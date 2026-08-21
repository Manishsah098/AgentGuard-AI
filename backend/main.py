"""
AgentGuard AI - Backend Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import agents, evaluations, scenarios, traces, reports, dashboard, fix_engine

app = FastAPI(
    title="AgentGuard AI",
    description="Autonomous AI Agent Evaluation, Red-Teaming & Reliability Engineering Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["Scenarios"])
app.include_router(evaluations.router, prefix="/api/evaluations", tags=["Evaluations"])
app.include_router(traces.router, prefix="/api/traces", tags=["Traces"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(fix_engine.router, prefix="/api/failures", tags=["Fix Engine"])


@app.get("/")
def root():
    return {
        "service": "AgentGuard AI API",
        "status": "operational",
        "docs": "/api/docs",
        "health": "/api/health",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health_check():
    return {"status": "operational", "service": "AgentGuard AI", "version": "1.0.0"}

