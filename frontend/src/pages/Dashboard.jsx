import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts'
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Activity,
  Zap, TrendingUp, TrendingDown, Bot, Play, GitCompare,
  Target, Lock, Eye, AlertOctagon, BarChart2, Clock
} from 'lucide-react'
import { dashboardApi, agentsApi, evaluationsApi } from '../lib/api'
import ScoreRing from '../components/ScoreRing'
import SeverityBadge from '../components/SeverityBadge'

// Demo data (used when backend unavailable)
const DEMO_STATS = {
  total_agents: 2, total_evaluations: 2, tests_executed: 300,
  passed: 237, failed: 57, critical_failures: 7, scenarios_generated: 200,
  regressions_detected: 0, avg_reliability: 81.0, avg_safety: 75.5, avg_security: 80.0,
}

const DEMO_RADAR = [
  { subject: 'Reliability', v1: 74, v11: 93 },
  { subject: 'Safety', v1: 62, v11: 89 },
  { subject: 'Security', v1: 68, v11: 92 },
  { subject: 'Tool Disc.', v1: 73, v11: 90 },
  { subject: 'Goal Align', v1: 76, v11: 94 },
  { subject: 'Recovery', v1: 58, v11: 88 },
]

const DEMO_FAILURES = [
  { name: 'Prompt Injection', count: 21, severity: 'HIGH', color: '#f59e0b' },
  { name: 'Unauthorized Action', count: 18, severity: 'CRITICAL', color: '#ef4444' },
  { name: 'Tool Misuse', count: 15, severity: 'HIGH', color: '#f59e0b' },
  { name: 'Goal Drift', count: 11, severity: 'MEDIUM', color: '#3b82f6' },
  { name: 'Data Leakage', count: 7, severity: 'CRITICAL', color: '#ef4444' },
  { name: 'Infinite Loop', count: 3, severity: 'MEDIUM', color: '#3b82f6' },
]

const SCORE_HISTORY = [
  { version: 'v0.9', score: 58 },
  { version: 'v1.0', score: 71 },
  { version: 'v1.1', score: 91 },
]

const DIMENSION_LABELS = {
  reliability: 'Reliability',
  safety: 'Safety',
  security: 'Security',
  tool_discipline: 'Tool Discipline',
  goal_alignment: 'Goal Alignment',
  recovery: 'Recovery',
}

const DIMENSION_COLORS = {
  reliability: '#3b82f6',
  safety: '#10b981',
  security: '#8b5cf6',
  tool_discipline: '#f59e0b',
  goal_alignment: '#00d4ff',
  recovery: '#ec4899',
}

export default function Dashboard() {
  const [stats, setStats] = useState(DEMO_STATS)
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFailure, setSelectedFailure] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, agentsRes] = await Promise.all([
          dashboardApi.getStats(),
          agentsApi.list(),
        ])
        setStats(statsRes.data)
        setAgents(agentsRes.data)
      } catch (e) {
        console.log('Using demo data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const passRate = stats.tests_executed ? 
    Math.round((stats.passed / stats.tests_executed) * 100) : 0

  const agentV1 = agents.find(a => a.version === '1.0.0')
  const agentV11 = agents.find(a => a.version === '1.1.0')

  const currentScore = agentV11?.reliability_score || 91
  const productionReady = currentScore >= 85

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(59,130,246,0.3)' }}>
              <Shield size={22} style={{ color: 'var(--color-accent-cyan)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">AgentGuard AI</h1>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>AI Agent Reliability Center</p>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Autonomous evaluation, red-teaming & reliability engineering for AI agents
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/agents" className="btn-primary text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
            <Bot size={15} /> Agent Registry
          </Link>
          <Link to="/evaluate" className="btn-danger text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
            <Zap size={15} /> Run Evaluation
          </Link>
        </div>
      </div>

      {/* Score Hero + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Score Hero */}
        <div className="glass-card p-6 lg:col-span-1 flex flex-col items-center justify-center"
             style={{ border: productionReady ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)' }}>
          <ScoreRing score={currentScore} size={140} />
          <div className="mt-3 text-center">
            <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${productionReady ? 'text-emerald-400' : 'text-red-400'}`}
                 style={{ background: productionReady ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: productionReady ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)' }}>
              {productionReady ? '✓ PRODUCTION READY' : '✕ NOT PRODUCTION READY'}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>CustomerSupportAgent v1.1</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Tests Executed', value: stats.tests_executed.toLocaleString(), icon: Activity, color: '#3b82f6' },
            { label: 'Passed', value: stats.passed.toLocaleString(), icon: CheckCircle, color: '#10b981' },
            { label: 'Failed', value: stats.failed.toLocaleString(), icon: XCircle, color: '#ef4444' },
            { label: 'Critical Failures', value: stats.critical_failures, icon: AlertOctagon, color: '#ef4444', highlight: true },
            { label: 'Scenarios Generated', value: stats.scenarios_generated.toLocaleString(), icon: Target, color: '#8b5cf6' },
            { label: 'Regressions', value: stats.regressions_detected, icon: TrendingDown, color: '#f59e0b' },
          ].map(({ label, value, icon: Icon, color, highlight }) => (
            <div key={label} className={`glass-card metric-card p-4 ${highlight && value > 0 ? 'glow-red' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: highlight && value > 0 ? '#ef4444' : 'var(--color-text-primary)' }}>
                {value}
              </div>
              {label === 'Passed' && (
                <div className="text-xs mt-1 text-emerald-400">{passRate}% pass rate</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dimension Scores Bar */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Reliability Dimensions — CustomerSupportAgent v1.1
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {agentV11 ? (
            Object.entries(DIMENSION_LABELS).map(([key, label]) => {
              const score = agentV11[`${key}_score`] || (
                { reliability: 93, safety: 89, security: 92, tool_discipline: 90, goal_alignment: 94, recovery: 88 }[key]
              )
              return (
                <DimensionBar key={key} label={label} score={score} color={DIMENSION_COLORS[key]} />
              )
            })
          ) : (
            [['Reliability', 93, '#3b82f6'], ['Safety', 89, '#10b981'], ['Security', 92, '#8b5cf6'],
             ['Tool Discipline', 90, '#f59e0b'], ['Goal Alignment', 94, '#00d4ff'], ['Recovery', 88, '#ec4899']]
              .map(([label, score, color]) => (
                <DimensionBar key={label} label={label} score={score} color={color} />
              ))
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Chart */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Version Comparison
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={DEMO_RADAR}>
              <PolarGrid stroke="rgba(30,45,61,0.8)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
              <Radar name="v1.0" dataKey="v1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="v1.1" dataKey="v11" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              <Legend iconType="line" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e2d3d', borderRadius: '8px', fontSize: '11px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score History */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Score History
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SCORE_HISTORY}>
              <CartesianGrid stroke="rgba(30,45,61,0.5)" strokeDasharray="3 3" />
              <XAxis dataKey="version" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[40, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e2d3d', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7, fill: '#60a5fa' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Distribution */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Failure Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEMO_FAILURES} layout="vertical">
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={110} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1e2d3d', borderRadius: '8px' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {DEMO_FAILURES.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Heatmap */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Failure Heatmap — Click to Inspect
          </h3>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            CustomerSupportAgent v1.0 · 150 scenarios
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Failure Category', 'Count', 'Severity', 'Category', 'Recommendation'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_FAILURES.map((f, i) => (
                <tr
                  key={i}
                  className="border-b cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ borderColor: 'var(--color-border)' }}
                  onClick={() => setSelectedFailure(selectedFailure === i ? null : i)}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: f.color }} />
                      <span style={{ color: 'var(--color-text-primary)' }}>{f.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold" style={{ color: f.color }}>{f.count}</td>
                  <td className="py-3 px-3">
                    <SeverityBadge severity={f.severity} />
                  </td>
                  <td className="py-3 px-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {f.severity === 'CRITICAL' ? 'Security / Safety' : 'Behavior / Reliability'}
                  </td>
                  <td className="py-3 px-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Add validation guardrail →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedFailure !== null && (
          <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-sm font-semibold text-red-400">Failure Detail: {DEMO_FAILURES[selectedFailure].name}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {DEMO_FAILURES[selectedFailure].count} instances detected across test scenarios. 
              Severity: <strong>{DEMO_FAILURES[selectedFailure].severity}</strong>. 
              This failure type requires immediate attention before production deployment.
            </p>
            <Link to="/evaluate" className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300">
              <Play size={11} /> View full evaluation →
            </Link>
          </div>
        )}
      </div>

      {/* Agent Cards */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Registered Agents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'CustomerSupportAgent', version: '1.0.0', score: 71, safety: 62, security: 68,
              tests: 150, critical: 6, ready: false, model: 'GPT-4', domain: 'E-Commerce',
            },
            {
              name: 'CustomerSupportAgent', version: '1.1.0', score: 91, safety: 89, security: 92,
              tests: 150, critical: 1, ready: true, model: 'GPT-4', domain: 'E-Commerce',
            }
          ].map((a) => (
            <Link
              key={a.version}
              to="/agents"
              className="glass-card p-4 block metric-card"
              style={{ border: a.ready ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <Bot size={16} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{a.name}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>v{a.version} · {a.model} · {a.domain}</div>
                  </div>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded ${a.ready ? 'text-emerald-400' : 'text-red-400'}`}
                     style={{ background: a.ready ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                  {a.ready ? '✓ READY' : '✕ NOT READY'}
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  ['Score', a.score, '#3b82f6'],
                  ['Safety', a.safety, '#10b981'],
                  ['Security', a.security, '#8b5cf6'],
                  ['Tests', a.tests, '#94a3b8'],
                  ['Critical', a.critical, '#ef4444'],
                ].map(([label, val, color]) => (
                  <div key={label}>
                    <div className="text-lg font-bold" style={{ color }}>{val}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function DimensionBar({ label, score, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'rgba(30,45,61,0.8)' }}>
        <div
          className="h-2 rounded-full progress-bar"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  )
}
