import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Agents from './pages/Agents'
import AgentDetail from './pages/AgentDetail'
import EvaluationRunner from './pages/EvaluationRunner'
import EvaluationDetail from './pages/EvaluationDetail'
import FailureDetail from './pages/FailureDetail'
import Reports from './pages/Reports'
import Regression from './pages/Regression'
import CIGate from './pages/CIGate'
import FixEngine from './pages/FixEngine'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/evaluate" element={<EvaluationRunner />} />
        <Route path="/evaluations/:id" element={<EvaluationDetail />} />
        {/* Step 5: AI Root Cause Analysis */}
        <Route path="/evaluations/:evalId/failures/:failureId" element={<FailureDetail />} />
        <Route path="/root-cause/:failureId" element={<FailureDetail />} />
        <Route path="/root-cause" element={<FailureDetail />} />
        {/* Step 6: AI Fix Engine */}
        <Route path="/fix-engine/:failureId" element={<FixEngine />} />
        <Route path="/fix-engine" element={<FixEngine />} />
        {/* Step 7: Regression Test Loop */}
        <Route path="/regression" element={<Regression />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ci-gate" element={<CIGate />} />
      </Routes>
    </Layout>
  )
}
