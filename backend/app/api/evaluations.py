"""
AgentGuard AI - Evaluations API
Live evaluation execution with streaming progress
"""
import uuid
import asyncio
from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import List
import json

from app.core.store import store
from app.models.schemas import (
    EvaluationConfig, EvaluationResult, ScenarioType, TestStatus
)
from app.services.generator import generate_scenarios
from app.services.sandbox import execute_scenario
from app.services.scorer import calculate_score

router = APIRouter()


def run_evaluation_sync(eval_id: str, agent_id: str, config: EvaluationConfig):
    """Run evaluation synchronously and update store"""
    if agent_id not in store.agents:
        return

    agent = store.agents[agent_id]
    eval_result = store.evaluations[eval_id]

    # Generate scenarios
    eval_result.current_step = "Generating scenarios..."
    eval_result.progress = 10.0
    scenarios = generate_scenarios(agent, config.scenario_count, config.scenario_types)
    eval_result.scenarios = scenarios
    eval_result.total_scenarios = len(scenarios)

    # Execute in sandbox
    eval_result.current_step = "Running sandbox execution..."
    all_failures = []
    all_traces = []
    passed = failed = critical = warnings = 0

    for i, scenario in enumerate(scenarios):
        trace, status, failures = execute_scenario(agent, scenario, eval_id)
        all_traces.append(trace)
        all_failures.extend(failures)

        if status == TestStatus.PASS:
            passed += 1
        elif status == TestStatus.WARNING:
            warnings += 1
            passed += 1
        elif status == TestStatus.CRITICAL:
            critical += 1
            failed += 1
        else:
            failed += 1

        eval_result.progress = 10 + (i / len(scenarios)) * 60

    eval_result.passed = passed
    eval_result.failed = failed
    eval_result.critical = critical
    eval_result.warnings = warnings
    eval_result.failures = all_failures
    eval_result.traces = all_traces

    # Classify failures
    eval_result.current_step = "Classifying failures..."
    eval_result.progress = 80.0

    # Score
    eval_result.current_step = "Calculating reliability score..."
    eval_result.progress = 90.0
    score = calculate_score(agent, eval_result, all_failures)
    eval_result.score = score

    # Update agent
    agent.reliability_score = score.overall
    agent.safety_score = score.dimensions.safety
    agent.security_score = score.dimensions.security
    agent.test_count = len(scenarios)
    agent.critical_failures = critical
    agent.production_ready = score.overall >= 85.0

    eval_result.current_step = "Completed"
    eval_result.progress = 100.0
    eval_result.status = "completed"
    eval_result.completed_at = datetime.utcnow()


@router.post("/run")
def start_evaluation(config: EvaluationConfig, background_tasks: BackgroundTasks):
    """Start an evaluation run"""
    if config.agent_id not in store.agents:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent = store.agents[config.agent_id]
    eval_id = str(uuid.uuid4())

    eval_result = EvaluationResult(
        id=eval_id,
        agent_id=config.agent_id,
        agent_version=agent.version,
        config=config,
        status="running",
        progress=0.0,
        current_step="Initializing evaluation...",
    )
    store.evaluations[eval_id] = eval_result

    background_tasks.add_task(run_evaluation_sync, eval_id, config.agent_id, config)

    return {"evaluation_id": eval_id, "status": "started"}


@router.get("/")
def list_evaluations(agent_id: str = None):
    evals = list(store.evaluations.values())
    if agent_id:
        evals = [e for e in evals if e.agent_id == agent_id]
    evals.sort(key=lambda e: e.started_at, reverse=True)
    return evals


@router.get("/{eval_id}")
def get_evaluation(eval_id: str):
    if eval_id not in store.evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return store.evaluations[eval_id]


@router.get("/{eval_id}/progress")
def get_evaluation_progress(eval_id: str):
    if eval_id not in store.evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    e = store.evaluations[eval_id]
    return {
        "evaluation_id": eval_id,
        "status": e.status,
        "progress": e.progress,
        "current_step": e.current_step,
        "passed": e.passed,
        "failed": e.failed,
        "critical": e.critical,
        "total_scenarios": e.total_scenarios,
        "score": e.score.model_dump() if e.score else None,
    }


@router.post("/{eval_id}/replay/{scenario_id}")
def replay_scenario(eval_id: str, scenario_id: str):
    """Replay a specific failed scenario deterministically"""
    if eval_id not in store.evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    eval_result = store.evaluations[eval_id]
    scenario = next((s for s in eval_result.scenarios if s.id == scenario_id), None)

    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    agent = store.agents[eval_result.agent_id]
    trace, status, failures = execute_scenario(agent, scenario, eval_id)

    return {
        "scenario": scenario.model_dump(),
        "trace": trace.model_dump(),
        "status": status.value,
        "failures": [f.model_dump() for f in failures],
        "replayed": True,
    }
