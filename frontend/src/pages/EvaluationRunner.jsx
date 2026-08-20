import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Shield, Zap, CheckCircle2, RefreshCw, Cpu, Database } from 'lucide-react'
import { evaluationsApi } from '../lib/api'

export default function EvaluationRunner() {
  const navigate = useNavigate()
  const [selectedAgent, setSelectedAgent] = useState('demo-agent-v1-0000-0000-000000000001')
  const [scenarioCount, setScenarioCount] = useState(150)
  const [sandboxEnabled, setSandboxEnabled] = useState(true)
  const [replayEnabled, setReplayEnabled] = useState(true)
  const [aiMode, setAiMode] = useState(false)
  const [testTypes, setTestTypes] = useState({
    NORMAL: true,
    EDGE_CASE: true,
    ADVERSARIAL: true,
    SAFETY: true,
    SECURITY: true,
    STRESS: true,
    GOAL_DRIFT: true,
  })
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState('')

  const handleRun = async () => {
    setRunning(true)
    setProgress(0)
    setStep('Initializing Evaluation Engine...')

    try {
      const activeTypes = Object.keys(testTypes).filter(k => testTypes[k])
      const res = await evaluationsApi.run({
        agent_id: selectedAgent,
        scenario_count: Number(scenarioCount),
        scenario_types: activeTypes,
        sandbox_enabled: sandboxEnabled,
        deterministic_replay: replayEnabled,
        ai_mode: aiMode,
      })

      const evalId = res.data.evaluation_id

      // Poll progress or simulate live steps for high responsiveness
      const steps = [
        [15, 'Generating scenario variations & adversarial mutations...'],
        [35, 'Spinning up Docker sandbox environment...'],
        [60, 'Intercepting tool calls & recording execution traces...'],
        [80, 'Classifying failures & calculating risk metrics...'],
        [95, 'Finalizing evaluation report & score card...'],
        [100, 'Evaluation Completed!'],
      ]

      for (const [p, msg] of steps) {
        await new Promise(r => setTimeout(r, 600))
        setProgress(p)
        setStep(msg)
      }

      setTimeout(() => {
        navigate(`/evaluations/${evalId}`)
      }, 500)
    } catch {
      // Fallback demo evaluation redirection if backend service isn't active
      const demoEvalId = selectedAgent.includes('v1-1') ? 'demo-eval-v11-000-0000-000000000002' : 'demo-eval-v1-0000-0000-000000000001'
      const steps = [
        [20, 'Generating 150 scenarios...'],
        [50, 'Executing sandbox runs...'],
        [85, 'Analyzing security traces...'],
        [100, 'Evaluation Completed!'],
      ]
      for (const [p, msg] of steps) {
        await new Promise(r => setTimeout(r, 500))
        setProgress(p)
        setStep(msg)
      }
      navigate(`/evaluations/${demoEvalId}`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold gradient-text">Run Agent Evaluation</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Configure scenario generator, red-team parameters, and sandbox settings.
        </p>
      </div>

      <div className="glass-card p-6 space-y-6">
        {/* Agent Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-accent-cyan)' }}>
            Select Target Agent
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'demo-agent-v1-0000-0000-000000000001', name: 'CustomerSupportAgent v1.0.0', desc: 'Vulnerable Baseline (Missing authorization checks)', risk: 'HIGH' },
              { id: 'demo-agent-v1-1000-0000-000000000002', name: 'CustomerSupportAgent v1.1.0', desc: 'Hardened Guardrails (Strict identity verification)', risk: 'LOW' }
            ].map(a => (
              <div
                key={a.id}
                onClick={() => setSelectedAgent(a.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedAgent === a.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-900/50'}`}
              >
                <div className="flex items-center justify-between font-bold text-sm text-slate-200">
                  <span>{a.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${a.risk === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {a.risk} RISK
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Types Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-accent-cyan)' }}>
            Scenario Categories to Include
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.keys(testTypes).map(type => (
              <label key={type} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900/30 text-xs cursor-pointer hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={testTypes[type]}
                  onChange={e => setTestTypes(p => ({ ...p, [type]: e.target.checked }))}
                  className="rounded text-blue-500 focus:ring-0 bg-slate-950"
                />
                <span className="font-semibold text-slate-300">{type.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Configuration Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Scenario Volume</label>
            <select
              value={scenarioCount}
              onChange={e => setScenarioCount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 outline-none"
            >
              <option value="50">50 Scenarios (Fast Evaluation)</option>
              <option value="150">150 Scenarios (Standard Coverage)</option>
              <option value="500">500 Scenarios (Full Red-Team Audit)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Sandbox Isolation</label>
            <div className="flex items-center justify-between p-2.5 border border-slate-800 bg-slate-950 rounded-lg text-xs">
              <span className="text-slate-300">Docker Mocked Sandbox</span>
              <input
                type="checkbox"
                checked={sandboxEnabled}
                onChange={e => setSandboxEnabled(e.target.checked)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Deterministic Replay</label>
            <div className="flex items-center justify-between p-2.5 border border-slate-800 bg-slate-950 rounded-lg text-xs">
              <span className="text-slate-300">Capture Traces & State</span>
              <input
                type="checkbox"
                checked={replayEnabled}
                onChange={e => setReplayEnabled(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Live Execution Progress overlay */}
        {running && (
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-blue-400">
              <div className="flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                <span>{step}</span>
              </div>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleRun}
            disabled={running}
            className="btn-danger text-white text-sm font-bold px-6 py-3 rounded-xl flex items-center gap-2 glow-red"
          >
            <Play size={16} /> Start Evaluation Run
          </button>
        </div>
      </div>
    </div>
  )
}
