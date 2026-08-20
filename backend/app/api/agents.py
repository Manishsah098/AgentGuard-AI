"""
AgentGuard AI - Agents API
"""
import uuid
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.core.store import store
from app.models.schemas import Agent, AgentCreate, ToolCategory, RiskLevel

router = APIRouter()


@router.get("/", response_model=List[Agent])
def list_agents():
    return list(store.agents.values())


@router.post("/", response_model=Agent)
def create_agent(agent_data: AgentCreate):
    agent = Agent(
        id=str(uuid.uuid4()),
        **agent_data.model_dump()
    )
    store.agents[agent.id] = agent
    return agent


@router.get("/{agent_id}", response_model=Agent)
def get_agent(agent_id: str):
    if agent_id not in store.agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    return store.agents[agent_id]


@router.get("/{agent_id}/analyze")
def analyze_agent(agent_id: str):
    """Analyze agent capabilities and generate capability graph"""
    if agent_id not in store.agents:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent = store.agents[agent_id]
    tools = agent.tools

    # Categorize tools
    read_tools = [t for t in tools if t.category == ToolCategory.READ]
    write_tools = [t for t in tools if t.category in [ToolCategory.WRITE, ToolCategory.FINANCIAL]]
    destructive_tools = [t for t in tools if t.is_destructive]
    financial_tools = [t for t in tools if t.is_financial]
    external_tools = [t for t in tools if t.has_side_effects]

    # Build capability graph nodes/edges for visualization
    nodes = [{"id": "agent", "label": agent.name, "type": "agent"}]
    edges = []

    categories = {
        "Database": [t for t in tools if "customer" in t.name.lower() or "order" in t.name.lower() or "search" in t.name.lower()],
        "Payment API": [t for t in tools if "payment" in t.name.lower() or "refund" in t.name.lower()],
        "Email Service": [t for t in tools if "email" in t.name.lower() or "send" in t.name.lower()],
    }

    for cat_name, cat_tools in categories.items():
        if cat_tools:
            cat_id = cat_name.lower().replace(" ", "_")
            nodes.append({"id": cat_id, "label": cat_name, "type": "category"})
            edges.append({"source": "agent", "target": cat_id})

            for tool in cat_tools:
                nodes.append({
                    "id": tool.name,
                    "label": tool.name,
                    "type": "tool",
                    "risk_score": tool.risk_score,
                    "category": tool.category.value,
                    "is_financial": tool.is_financial,
                    "is_destructive": tool.is_destructive,
                })
                edges.append({"source": cat_id, "target": tool.name})

    # Risk assessment
    high_risk_tools = [t for t in tools if t.risk_score >= 7.0]
    overall_risk = "HIGH" if high_risk_tools else ("MEDIUM" if financial_tools else "LOW")

    return {
        "agent_id": agent_id,
        "agent_name": agent.name,
        "version": agent.version,
        "capability_graph": {"nodes": nodes, "edges": edges},
        "tool_summary": {
            "total": len(tools),
            "read_only": len(read_tools),
            "write": len(write_tools),
            "financial": len(financial_tools),
            "destructive": len(destructive_tools),
            "external_side_effects": len(external_tools),
            "high_risk": len(high_risk_tools),
        },
        "risk_assessment": {
            "overall_risk": overall_risk,
            "high_risk_tools": [{"name": t.name, "risk_score": t.risk_score} for t in high_risk_tools],
            "permission_boundaries": ["customer_data_read", "order_write", "financial_execute", "email_send"],
        },
        "tools": [t.model_dump() for t in tools],
    }
