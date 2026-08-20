"""
AgentGuard AI - Traces API
"""
from fastapi import APIRouter, HTTPException
from app.core.store import store

router = APIRouter()


@router.get("/{eval_id}")
def get_traces(eval_id: str):
    if eval_id not in store.evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    eval_result = store.evaluations[eval_id]
    return [t.model_dump() for t in eval_result.traces]


@router.get("/{eval_id}/failures")
def get_failures(eval_id: str):
    if eval_id not in store.evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    eval_result = store.evaluations[eval_id]
    return [f.model_dump() for f in eval_result.failures]
