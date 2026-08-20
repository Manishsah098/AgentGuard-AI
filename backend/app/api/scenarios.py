"""
AgentGuard AI - Scenarios API
"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.core.store import store
from app.models.schemas import ScenarioType
from app.services.generator import generate_scenarios

router = APIRouter()


@router.post("/generate")
def generate_test_scenarios(agent_id: str, count: int = 100, types: str = "all"):
    """Generate test scenarios for an agent"""
    if agent_id not in store.agents:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent = store.agents[agent_id]

    if types == "all":
        scenario_types = list(ScenarioType)
    else:
        scenario_types = [ScenarioType(t) for t in types.split(",")]

    scenarios = generate_scenarios(agent, count, scenario_types)

    return {
        "agent_id": agent_id,
        "count": len(scenarios),
        "scenarios": [s.model_dump() for s in scenarios],
        "breakdown": {
            t.value: len([s for s in scenarios if s.type == t])
            for t in ScenarioType
        },
    }
