"""
AgentGuard AI - Reports API
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.core.store import store

router = APIRouter()


@router.get("/{eval_id}")
def get_report(eval_id: str):
    """Generate a comprehensive reliability report"""
    if eval_id not in store.evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    eval_result = store.evaluations[eval_id]
    agent = store.agents.get(eval_result.agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    score = eval_result.score
    failures = eval_result.failures

    # Failure distribution
    failure_dist = {}
    for f in failures:
        key = f.subcategory
        if key not in failure_dist:
            failure_dist[key] = {"count": 0, "severity": f.severity.value, "category": f.category.value}
        failure_dist[key]["count"] += 1

    # Critical vulnerabilities
    critical_vulns = [f for f in failures if f.severity.value in ["CRITICAL", "HIGH"]]

    # Recommendations
    recommendations = []
    for f in critical_vulns:
        recommendations.append({
            "priority": "HIGH" if f.severity.value == "CRITICAL" else "MEDIUM",
            "title": f.title,
            "recommendation": f.recommendation,
            "tool": f.affected_tool,
        })

    production_ready = score.overall >= 85.0 if score else False

    return {
        "report_id": f"RPT-{eval_id[:8]}",
        "generated_at": datetime.utcnow().isoformat(),
        "executive_summary": {
            "agent_name": agent.name,
            "version": agent.version,
            "evaluation_date": eval_result.started_at.isoformat(),
            "overall_score": score.overall if score else 0,
            "production_readiness": score.production_readiness if score else "UNKNOWN",
            "grade": score.grade if score else "?",
            "critical_issues": eval_result.critical,
            "recommendation": "APPROVED FOR DEPLOYMENT" if production_ready else "DEPLOYMENT BLOCKED — CRITICAL ISSUES FOUND",
        },
        "agent_info": {
            "id": agent.id,
            "name": agent.name,
            "version": agent.version,
            "model": agent.model,
            "domain": agent.domain,
            "risk_level": agent.risk_level.value,
            "tools": [t.name for t in agent.tools],
        },
        "test_coverage": {
            "total_scenarios": eval_result.total_scenarios,
            "passed": eval_result.passed,
            "failed": eval_result.failed,
            "critical": eval_result.critical,
            "warnings": eval_result.warnings,
            "pass_rate": round(eval_result.passed / max(eval_result.total_scenarios, 1) * 100, 1),
            "scenario_types": list(set(s.type.value for s in eval_result.scenarios)),
        },
        "reliability_scores": score.model_dump() if score else {},
        "failure_distribution": failure_dist,
        "critical_vulnerabilities": [
            {
                "title": f.title,
                "category": f.category.value,
                "severity": f.severity.value,
                "tool": f.affected_tool,
                "evidence": f.evidence,
                "confidence": f.confidence,
            }
            for f in critical_vulns
        ],
        "recommendations": recommendations,
        "production_decision": {
            "approved": production_ready,
            "threshold": 85.0,
            "current_score": score.overall if score else 0,
            "reason": "All safety and security checks passed" if production_ready
                      else f"Critical failures detected: {eval_result.critical} critical issues must be resolved",
            "ci_cd_gate": "PASS" if production_ready else "FAIL",
        },
    }
