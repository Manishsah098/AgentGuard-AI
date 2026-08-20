"""
AgentGuard AI - In-Memory Store (Demo Mode)
Simulates a database for hackathon purposes
"""
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from app.models.schemas import Agent, EvaluationResult, FailureDetail, Scenario, ExecutionTrace


class InMemoryStore:
    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.evaluations: Dict[str, EvaluationResult] = {}
        self.scenarios: Dict[str, List[Scenario]] = {}
        self.traces: Dict[str, ExecutionTrace] = {}
        self.failures: Dict[str, List[FailureDetail]] = {}
        self._seed_demo_data()

    def _seed_demo_data(self):
        """Seed the store with demo agents and evaluations"""
        from app.data.demo_data import get_demo_agents, get_demo_evaluations
        demo_agents = get_demo_agents()
        for agent in demo_agents:
            self.agents[agent.id] = agent

        demo_evals = get_demo_evaluations(demo_agents)
        for eval_result in demo_evals:
            self.evaluations[eval_result.id] = eval_result
            self.failures[eval_result.id] = eval_result.failures
            self.scenarios[eval_result.id] = eval_result.scenarios


# Singleton store instance
store = InMemoryStore()
