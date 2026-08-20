import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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

export default api
