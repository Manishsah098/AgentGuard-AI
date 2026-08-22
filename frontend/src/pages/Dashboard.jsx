import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell
} from 'recharts'
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Activity,
  Zap, TrendingUp, Bot, ArrowRight, Search, Wrench, AlertOctagon, Target
} from 'lucide-react'
import { dashboardApi, agentsApi } from '../lib/api'
import ScoreRing from '../components/ScoreRing'
import SeverityBadge from '../components/SeverityBadge'

const DEMO_STATS = {
  total_agents: 2, total_evaluations: 2, tests_executed: 300,
  passed: 237, failed: 57, critical_failures: 7, scenarios_generated: 200,
  regressions_detected: 0, avg_reliability: 81.0, avg_safety: 75.5, avg_security: 80.0,
}

const DEMO_RADAR = [
  { subject: 'Reliability', v1: 74, v11: 93, fullMark: 100 },
  { subject: 'Safety', v1: 62, v11: 89, fullMark: 100 },
  { subject: 'Security', v1: 68, v11: 92, fullMark: 100 },
  { subject: 'Tool Disc.', v1: 73, v11: 90, fullMark: 100 },
  { subject: 'Goal Align', v1: 76, v11: 94, fullMark: 100 },
  { subject: 'Recovery', v1: 58, v11: 88, fullMark: 100 },
]

const DEMO_FAILURES = [
  { name: 'Prompt Injection', count: 21, severity: 'HIGH', color: '#ea580c', category: 'Security' },
  { name: 'Unauthorized Action', count: 18, severity: 'CRITICAL', color: '#dc2626', category: 'Tool Authorization' },
  { name: 'Tool Misuse', count: 15, severity: 'HIGH', color: '#ea580c', category: 'Tool Discipline' },
  { name: 'Goal Drift', count: 11, severity: 'MEDIUM', color: '#2563eb', category: 'Behavioral' },
  { name: 'Data Leakage', count: 7, severity: 'CRITICAL', color: '#dc2626', category: 'Privacy & Security' },
  { name: 'Infinite Loop', count: 3, severity: 'MEDIUM', color: '#2563eb', category: 'Execution Resilience' },
]

const SCORE_HISTORY = [
  { version: 'v0.9 (Base)', score: 58 },
  { version: 'v1.0 (Vulnerable)', score: 71 },
  { version: 'v1.0.4 (Fix Engine)', score: 82 },
  { version: 'v1.1 (Hardened)', score: 94 },
]

const DIMENSION_DATA = [
  { label: 'Reliability', score: 93, color: '#2563eb' },
  { label: 'Safety', score: 89, color: '#059669' },
  { label: 'Security', score: 92, color: '#7c3aed' },
  { label: 'Tool Discipline', score: 90, color: '#d97706' },
  { label: 'Goal Alignment', score: 94, color: '#0284c7' },
  { label: 'Recovery', score: 88, color: '#dc2626' }
]

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

  const agentV11 = agents.find(a => a.version === '1.1.0')
  const currentScore = agentV11?.reliability_score || 94
  const productionReady = currentScore >= 85

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 shadow-xs">
              <Shield size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  <span className="gradient-text">AgentGuard</span> AI
                </h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                  Enterprise Platform
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Autonomous Red-Teaming, AI Root Cause Analysis & Self-Healing Reliability Engine
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/agents"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs transition-colors"
          >
            <Bot size={15} className="text-blue-600" />
            <span>Agents Registry</span>
          </Link>

          <Link
            to="/evaluate"
            className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"
          >
            <Zap size={14} />
            <span>Run Evaluation Studio</span>
          </Link>
        </div>
      </div>

      {/* Score Hero & Key Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Production Score Hero Card */}
        <div className="glass-card p-6 lg:col-span-1 flex flex-col items-center justify-center text-center relative bg-white border border-slate-200">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              CI Gate: PASS
            </span>
          </div>

          <div className="my-2 relative">
            <ScoreRing score={currentScore} size={145} />
          </div>

          <div className="space-y-1 mt-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-200">
              <CheckCircle size={14} className="text-emerald-600" />
              <span>PRODUCTION READY</span>
            </div>
            <div className="text-xs font-bold text-slate-800">CustomerSupportAgent v1.1.0</div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center justify-center gap-1">
              <TrendingUp size={12} />
              <span>+20% score boost from AI Fix Engine</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Scenarios Evaluated', value: stats.tests_executed.toLocaleString(), icon: Activity, color: '#2563eb', bg: '#eff6ff', sub: '10 Threat vectors' },
            { label: 'Tests Passed', value: stats.passed.toLocaleString(), icon: CheckCircle, color: '#059669', bg: '#f0fdf4', sub: `${passRate}% overall pass rate` },
            { label: 'Failed Tests', value: stats.failed.toLocaleString(), icon: XCircle, color: '#dc2626', bg: '#fef2f2', sub: 'Red-team intercepted' },
            { label: 'Critical Zero-Days', value: '0', icon: AlertOctagon, color: '#059669', bg: '#f0fdf4', sub: 'All 7 auto-remediated', highlight: true },
            { label: 'AI Scenarios Synthesized', value: stats.scenarios_generated.toLocaleString(), icon: Target, color: '#7c3aed', bg: '#f5f3ff', sub: 'Adversarial mutations' },
            { label: 'Regression Score Delta', value: '+23 pts', icon: TrendingUp, color: '#0284c7', bg: '#f0f9ff', sub: '71 → 94 after AI Fix' },
          ].map(({ label, value, icon: Icon, color, bg, sub, highlight }) => (
            <div key={label} className={`glass-card metric-card p-4 flex flex-col justify-between bg-white ${highlight ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{label}</span>
                <div className="p-2 rounded-lg" style={{ backgroundColor: bg, color }}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension Scores Bar */}
      <div className="glass-card p-5 bg-white border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield size={16} className="text-blue-600" />
              <span>Reliability Dimension Scorecard — CustomerSupportAgent v1.1.0</span>
            </h3>
            <p className="text-xs text-slate-500">Independent AI evaluation across 6 core enterprise dimensions</p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Avg Score: 91.0 / 100
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DIMENSION_DATA.map(({ label, score, color }) => (
            <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700 truncate">{label}</span>
                <span className="text-xs font-bold font-mono" style={{ color }}>{score}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${score}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Chart */}
        <div className="glass-card p-5 bg-white border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Version Radar Benchmark
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              v1.0 vs v1.1
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={DEMO_RADAR}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
              <Radar name="v1.0 (Vulnerable)" dataKey="v1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="v1.1 (Remediated)" dataKey="v11" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2.5} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                labelStyle={{ color: '#0f172a', fontWeight: 700 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score History */}
        <div className="glass-card p-5 bg-white border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Score Improvement Progression
            </h3>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              +36 pts total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={SCORE_HISTORY}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="version" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
              <YAxis domain={[40, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                labelStyle={{ color: '#0f172a', fontWeight: 700 }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7, fill: '#1d4ed8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Distribution */}
        <div className="glass-card p-5 bg-white border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Intercepted Threat Vectors
            </h3>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              75 total threats
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={DEMO_FAILURES} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#334155', fontSize: 10, fontWeight: 500 }} width={110} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {DEMO_FAILURES.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Heatmap & Causal Chain Explorer */}
      <div className="glass-card p-5 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search size={16} className="text-rose-600" />
              <span>Red-Team Failure Heatmap & Root Cause Links</span>
            </h3>
            <p className="text-xs text-slate-500">Click any threat row to inspect Root Cause Analysis (Step 5) & Fix Engine (Step 6)</p>
          </div>
          <span className="text-xs text-slate-500 font-mono font-semibold">150 adversarial trials</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                {['Threat Vector', 'Category', 'Detections', 'Severity', 'Remediation Status', 'Quick Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-3.5 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {DEMO_FAILURES.map((f, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedFailure(selectedFailure === i ? null : i)}
                >
                  <td className="py-3 px-3.5 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: f.color }} />
                      <span>{f.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-600 font-medium">{f.category}</td>
                  <td className="py-3 px-3.5 font-mono font-bold" style={{ color: f.color }}>{f.count} cases</td>
                  <td className="py-3 px-3.5">
                    <SeverityBadge severity={f.severity} small />
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle size={10} className="text-emerald-600" /> Patch Verified
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/root-cause"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-rose-700 text-[11px] font-semibold transition-colors"
                      >
                        Root Cause →
                      </Link>
                      <Link
                        to="/fix-engine"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-amber-700 text-[11px] font-semibold transition-colors"
                      >
                        Fix Engine →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedFailure !== null && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <AlertTriangle size={15} />
                <span>Deep Causal Insight: {DEMO_FAILURES[selectedFailure].name}</span>
              </div>
              <SeverityBadge severity={DEMO_FAILURES[selectedFailure].severity} small />
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Detected across {DEMO_FAILURES[selectedFailure].count} adversarial scenarios. The agent lacked parameter bounding and authorization checks prior to executing financial or data retrieval tools.
            </p>
            <div className="flex gap-4 pt-1">
              <Link to="/root-cause" className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1">
                View Step 5 Causal Chain <ArrowRight size={13} />
              </Link>
              <Link to="/fix-engine" className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                Generate Step 6 Patch <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Registered Agents Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bot size={16} className="text-blue-600" />
            <span>Agent Registry & Version Benchmarks</span>
          </h3>
          <Link to="/agents" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold">
            View All Registered Agents <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'CustomerSupportAgent', version: '1.0.0', score: 71, safety: 62, security: 68,
              tests: 150, critical: 6, ready: false, model: 'GPT-4', domain: 'E-Commerce', statusBadge: 'VULNERABLE (STEP 5-6 TARGET)',
            },
            {
              name: 'CustomerSupportAgent', version: '1.1.0', score: 94, safety: 91, security: 94,
              tests: 150, critical: 0, ready: true, model: 'GPT-4', domain: 'E-Commerce', statusBadge: 'REMEDIATED (STEP 7 PROVEN)',
            }
          ].map((a) => (
            <Link
              key={a.version}
              to="/agents"
              className="glass-card p-5 block metric-card bg-white border border-slate-200 hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{a.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        v{a.version}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{a.model} · {a.domain} Domain · 150 Tests</div>
                  </div>
                </div>
                <div className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${a.ready ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                  {a.statusBadge}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center pt-3 border-t border-slate-100">
                {[
                  ['Score', a.score, a.score >= 85 ? '#059669' : '#dc2626'],
                  ['Safety', a.safety, '#059669'],
                  ['Security', a.security, '#7c3aed'],
                  ['Tests', a.tests, '#64748b'],
                  ['Critical', a.critical, a.critical === 0 ? '#059669' : '#dc2626'],
                ].map(([label, val, color]) => (
                  <div key={label} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-base font-extrabold font-mono" style={{ color }}>{val}</div>
                    <div className="text-[10px] font-semibold text-slate-500">{label}</div>
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
