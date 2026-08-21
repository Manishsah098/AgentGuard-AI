import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})


export const dashboardApi = {
  getStats: () => api.get('/dashboard'),
  getRegression: (agentName) => api.get(`/regression/${agentName}`),
}

export const agentsApi = {
  list: () => api.get('/agents/'),
  create: (data) => api.post('/agents/', data),
  get: (id) => api.get(`/agents/${id}`),
  analyze: (id) => api.get(`/agents/${id}/analyze`),
}

export const evaluationsApi = {
  run: (config) => api.post('/evaluations/run', config),
  list: (agentId) => api.get('/evaluations/', { params: agentId ? { agent_id: agentId } : {} }),
  get: (id) => api.get(`/evaluations/${id}`),
  getProgress: (id) => api.get(`/evaluations/${id}/progress`),
  replay: (evalId, scenarioId) => api.post(`/evaluations/${evalId}/replay/${scenarioId}`),
}

export const tracesApi = {
  getTraces: (evalId) => api.get(`/traces/${evalId}`),
  getFailures: (evalId) => api.get(`/traces/${evalId}/failures`),
}

export const reportsApi = {
  get: (evalId) => api.get(`/reports/${evalId}`),
}

export const scenariosApi = {
  generate: (agentId, count, types) => api.post('/scenarios/generate', null, {
    params: { agent_id: agentId, count, types: types || 'all' }
  }),
}

// Step 5: AI Root Cause Analyzer
// Step 6: AI Fix Engine
export const fixEngineApi = {
  getRootCause: (failureId) => api.get(`/failures/${failureId}/root-cause`),
  getFixPlan: (failureId) => api.get(`/failures/${failureId}/fix-plan`),
  applyFix: (failureId, fixType) => api.post(`/failures/${failureId}/apply-fix`, null, { params: { fix_type: fixType } }),
  getAllFixes: (evalId) => api.get(`/failures/evaluation/${evalId}/all-fixes`),
}

// Step 7: Regression Test Loop
export const regressionApi = {
  triggerLoop: (evalId) => api.post(`/failures/regression-loop/${evalId}`),
  getStatus: (regressionId) => api.get(`/failures/regression/${regressionId}/status`),
}

export default api

