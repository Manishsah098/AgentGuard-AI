"""
AgentGuard AI - Dashboard API
"""
from fastapi import APIRouter
from app.core.store import store
from app.models.schemas import DashboardStats

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats():
    """Get aggregated dashboard statistics"""
    agents = list(store.agents.values())
    evals = list(store.evaluations.values())

    total_tests = sum(e.total_scenarios for e in evals)
    total_passed = sum(e.passed for e in evals)
    total_failed = sum(e.failed for e in evals)
    total_critical = sum(e.critical for e in evals)
    total_scenarios = sum(len(e.scenarios) for e in evals)

    scored_agents = [a for a in agents if a.reliability_score is not None]
    avg_reliability = sum(a.reliability_score for a in scored_agents) / max(len(scored_agents), 1)
    avg_safety = sum(a.safety_score for a in scored_agents if a.safety_score) / max(len(scored_agents), 1)
    avg_security = sum(a.security_score for a in scored_agents if a.security_score) / max(len(scored_agents), 1)

    # Count regressions (simplified: agents with decreasing scores)
    regressions = 0
    agent_names = {}
    for agent in sorted(agents, key=lambda a: a.created_at):
        name = agent.name
        if name in agent_names:
            prev = agent_names[name]
            if prev.reliability_score and agent.reliability_score:
                if prev.reliability_score > agent.reliability_score + 5:
                    regressions += 1
        agent_names[name] = agent

    return DashboardStats(
        total_agents=len(agents),
        total_evaluations=len(evals),
        tests_executed=total_tests,
        passed=total_passed,
        failed=total_failed,
        critical_failures=total_critical,
        scenarios_generated=total_scenarios,
        regressions_detected=regressions,
        avg_reliability=round(avg_reliability, 1),
        avg_safety=round(avg_safety, 1),
        avg_security=round(avg_security, 1),
    )


@router.get("/regression/{agent_name}")
def get_regression_analysis(agent_name: str):
    """Get regression analysis for an agent across versions"""
    agents = [a for a in store.agents.values() if a.name == agent_name]
    agents.sort(key=lambda a: a.version)

    versions = []
    for agent in agents:
        evals = [e for e in store.evaluations.values() if e.agent_id == agent.id]
        latest_eval = max(evals, key=lambda e: e.started_at) if evals else None
        versions.append({
            "version": agent.version,
            "agent_id": agent.id,
            "reliability_score": agent.reliability_score,
            "safety_score": agent.safety_score,
            "security_score": agent.security_score,
            "critical_failures": agent.critical_failures,
            "production_ready": agent.production_ready,
            "evaluation_id": latest_eval.id if latest_eval else None,
            "score": latest_eval.score.dict() if latest_eval and latest_eval.score else None,
        })

    # Detect regression between consecutive versions
    regressions = []
    for i in range(1, len(versions)):
        prev = versions[i - 1]
        curr = versions[i]
        if prev["reliability_score"] and curr["reliability_score"]:
            diff = curr["reliability_score"] - prev["reliability_score"]
            if diff < -5:
                regressions.append({
                    "from_version": prev["version"],
                    "to_version": curr["version"],
                    "score_drop": round(diff, 1),
                })

    return {
        "agent_name": agent_name,
        "versions": versions,
        "regressions": regressions,
        "regression_detected": len(regressions) > 0,
    }
