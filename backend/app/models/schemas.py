"""
AgentGuard AI - Pydantic Models
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
import uuid
from datetime import datetime


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ToolCategory(str, Enum):
    READ = "READ"
    WRITE = "WRITE"
    FINANCIAL = "FINANCIAL"
    DESTRUCTIVE = "DESTRUCTIVE"
    COMMUNICATION = "COMMUNICATION"
    EXTERNAL = "EXTERNAL"


class FailureCategory(str, Enum):
    RELIABILITY = "RELIABILITY"
    SAFETY = "SAFETY"
    SECURITY = "SECURITY"
    BEHAVIOR = "BEHAVIOR"


class ScenarioType(str, Enum):
    NORMAL = "NORMAL"
    EDGE_CASE = "EDGE_CASE"
    ADVERSARIAL = "ADVERSARIAL"
    SAFETY = "SAFETY"
    SECURITY = "SECURITY"
    STRESS = "STRESS"
    GOAL_DRIFT = "GOAL_DRIFT"


class TestStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    CRITICAL = "CRITICAL"
    WARNING = "WARNING"


# Tool Schema
class ToolSchema(BaseModel):
    name: str
    description: str
    category: ToolCategory
    parameters: Dict[str, Any] = {}
    risk_score: float = Field(default=0.0, ge=0.0, le=10.0)
    requires_auth: bool = False
    has_side_effects: bool = False
    is_destructive: bool = False
    is_financial: bool = False


# Agent Models
class AgentCreate(BaseModel):
    name: str
    description: str
    version: str = "1.0.0"
    model: str = "gpt-4"
    system_prompt: str
    tools: List[ToolSchema] = []
    domain: str = "general"
    risk_level: RiskLevel = RiskLevel.MEDIUM
    tags: List[str] = []


class Agent(AgentCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    reliability_score: Optional[float] = None
    safety_score: Optional[float] = None
    security_score: Optional[float] = None
    test_count: int = 0
    critical_failures: int = 0
    production_ready: bool = False


# Scenario Models
class Scenario(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_id: str
    type: ScenarioType
    title: str
    description: str
    user_input: str
    expected_behavior: str
    risk_level: RiskLevel
    tags: List[str] = []
    mutation_of: Optional[str] = None
    adversarial_technique: Optional[str] = None


# Tool Call Trace
class ToolCall(BaseModel):
    timestamp_ms: int
    tool_name: str
    arguments: Dict[str, Any]
    response: Any
    risk_level: RiskLevel
    authorized: bool
    state_change: Optional[str] = None


# Execution Trace
class ExecutionTrace(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    evaluation_id: str
    scenario_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    agent_thinking: List[str] = []
    tool_calls: List[ToolCall] = []
    final_response: Optional[str] = None
    loop_detected: bool = False
    loop_count: int = 0
    total_tool_calls: int = 0


# Failure Models
class FailureDetail(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    evaluation_id: str
    scenario_id: str
    category: FailureCategory
    subcategory: str
    severity: RiskLevel
    title: str
    description: str
    root_cause: str
    affected_tool: Optional[str] = None
    evidence: str
    expected_behavior: str
    actual_behavior: str
    recommendation: str
    confidence: float = Field(ge=0.0, le=1.0)
    trace_id: Optional[str] = None


# Reliability Score
class DimensionScore(BaseModel):
    reliability: float
    safety: float
    security: float
    tool_discipline: float
    goal_alignment: float
    recovery: float


class ReliabilityScore(BaseModel):
    agent_id: str
    evaluation_id: str
    overall: float
    dimensions: DimensionScore
    production_readiness: str
    grade: str
    calculated_at: datetime = Field(default_factory=datetime.utcnow)


# Evaluation Models
class EvaluationConfig(BaseModel):
    agent_id: str
    scenario_count: int = 100
    scenario_types: List[ScenarioType] = list(ScenarioType)
    sandbox_enabled: bool = True
    deterministic_replay: bool = True
    ai_mode: bool = False


class EvaluationResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_id: str
    agent_version: str
    config: EvaluationConfig
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    status: str = "running"
    progress: float = 0.0
    current_step: str = "Initializing"
    total_scenarios: int = 0
    passed: int = 0
    failed: int = 0
    critical: int = 0
    warnings: int = 0
    scenarios: List[Scenario] = []
    failures: List[FailureDetail] = []
    score: Optional[ReliabilityScore] = None
    traces: List[ExecutionTrace] = []


# Regression Models
class RegressionResult(BaseModel):
    agent_id: str
    version_a: str
    version_b: str
    score_change: float
    safety_change: float
    security_change: float
    reliability_change: float
    regression_detected: bool
    new_failures: List[str] = []
    fixed_failures: List[str] = []


# Dashboard Stats
class DashboardStats(BaseModel):
    total_agents: int
    total_evaluations: int
    tests_executed: int
    passed: int
    failed: int
    critical_failures: int
    scenarios_generated: int
    regressions_detected: int
    avg_reliability: float
    avg_safety: float
    avg_security: float
