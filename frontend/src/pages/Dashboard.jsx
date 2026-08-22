import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell
} from 'recharts'
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Activity,
  Zap, TrendingUp, TrendingDown, Bot, Play, GitCompare,
  Target, Lock, Eye, AlertOctagon, BarChart2, Clock,
  ArrowRight, Sparkles, ChevronDown, ChevronUp, Search, Wrench
} from 'lucide-react'
import { dashboardApi, agentsApi } from '../lib/api'
import ScoreRing from '../components/ScoreRing'
import SeverityBadge from '../components/SeverityBadge'
import PipelineFlowDiagram from '../components/PipelineFlowDiagram'

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
  { name: 'Prompt Injection', count: 21, severity: 'HIGH', color: '#f59e0b', category: 'Security' },
  { name: 'Unauthorized Action', count: 18, severity: 'CRITICAL', color: '#f43f5e', category: 'Tool Authorization' },
  { name: 'Tool Misuse', count: 15, severity: 'HIGH', color: '#f59e0b', category: 'Tool Discipline' },
  { name: 'Goal Drift', count: 11, severity: 'MEDIUM', color: '#38bdf8', category: 'Behavioral' },
  { name: 'Data Leakage', count: 7, severity: 'CRITICAL', color: '#f43f5e', category: 'Privacy & Security' },
  { name: 'Infinite Loop', count: 3, severity: 'MEDIUM', color: '#38bdf8', category: 'Execution Resilience' },
]

const SCORE_HISTORY = [
  { version: 'v0.9 (Base)', score: 58 },
  { version: 'v1.0 (Vulnerable)', score: 71 },
  { version: 'v1.0.4 (Fix Engine)', score: 82 },
  { version: 'v1.1 (Hardened)', score: 94 },
]

const DIMENSION_DATA = [
  { label: 'Reliability', score: 93, color: '#38bdf8' },
  { label: 'Safety', score: 89, color: '#10b981' },
  { label: 'Security', score: 92, color: '#a855f7' },
  { label: 'Tool Discipline', score: 90, color: '#f59e0b' },
  { label: 'Goal Alignment', score: 94, color: '#00f0ff' },
  { label: 'Recovery', score: 88, color: '#f43f5e' }
]

export default function Dashboard() {
  const [stats, setStats] = useState(DEMO_STATS)
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFailure, setSelectedFailure] = useState(null)
  const [showPipeline, setShowPipeline] = useState(true)

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
              <Shield size={26} className="text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold gradient-text">AgentGuard AI</h1>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Red-Teaming, AI Root Cause Analysis & Self-Healing Reliability Engine
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPipeline(!showPipeline)}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>{showPipeline ? 'Hide 7-Step Workflow' : 'Show 7-Step Workflow'}</span>
            {showPipeline ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <Link to="/agents" className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-2 transition-colors">
            <Bot size={14} className="text-indigo-400" /> Agents Registry
          </Link>

          <Link to="/evaluate" className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
            <Zap size={14} className="text-yellow-300" /> Run Evaluation Studio
          </Link>
        </div>
      </div>

      {/* Interactive 7-Step Pipeline Diagram Banner */}
      {showPipeline && (
        <div className="glass-card p-5 border border-cyan-500/30 bg-slate-950/60 shadow-xl transition-all">
          <PipelineFlowDiagram />
        </div>
      )}

      {/* Score Hero & Key Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Production Score Hero Card */}
        <div className="glass-card p-6 lg:col-span-1 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-700/80">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              CI Gate: PASS
            </span>
          </div>

          <div className="my-2 relative">
            <ScoreRing score={currentScore} size={150} />
          </div>

          <div className="space-y-1.5 mt-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle size={14} /> PRODUCTION READY
            </div>
            <div className="text-xs font-semibold text-slate-300">CustomerSupportAgent v1.1.0</div>
            <div className="text-[11px] text-emerald-400 flex items-center justify-center gap-1">
              <TrendingUp size={12} />
              <span>+20% score boost from AI Fix Engine</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Scenarios Evaluated', value: stats.tests_executed.toLocaleString(), icon: Activity, color: '#38bdf8', sub: '10 Threat vectors' },
            { label: 'Tests Passed', value: stats.passed.toLocaleString(), icon: CheckCircle, color: '#10b981', sub: `${passRate}% overall pass rate` },
            { label: 'Failed Tests', value: stats.failed.toLocaleString(), icon: XCircle, color: '#f43f5e', sub: 'Red-team intercepted' },
            { label: 'Critical Zero-Days', value: '0', icon: AlertOctagon, color: '#10b981', sub: 'All 7 auto-remediated', highlight: true },
            { label: 'AI Scenarios Synthesized', value: stats.scenarios_generated.toLocaleString(), icon: Target, color: '#a855f7', sub: 'Adversarial mutations' },
            { label: 'Regression Score Delta', value: '+23 pts', icon: TrendingUp, color: '#00f0ff', sub: '71 → 94 after AI Fix' },
          ].map(({ label, value, icon: Icon, color, sub, highlight }) => (
            <div key={label} className={`glass-card metric-card p-4 flex flex-col justify-between ${highlight ? 'border-emerald-500/40 bg-emerald-950/10' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">{label}</span>
                <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800" style={{ color }}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-100 tracking-tight">{value}</div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension Scores Bar */}
      <div className="glass-card p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Shield size={16} className="text-cyan-400" />
              <span>Reliability Dimension Scorecard — CustomerSupportAgent v1.1.0</span>
            </h3>
            <p className="text-xs text-slate-400">Independent AI evaluation across 6 core enterprise dimensions</p>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            Avg: 91.0 / 100
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DIMENSION_DATA.map(({ label, score, color }) => (
            <div key={label} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-slate-300 truncate">{label}</span>
                <span className="text-xs font-bold font-mono" style={{ color }}>{score}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Chart */}
        <div className="glass-card p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Version Radar Benchmark
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              v1.0 vs v1.1
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={DEMO_RADAR}>
              <PolarGrid stroke="rgba(51,65,85,0.6)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
              <Radar name="v1.0 (Vulnerable)" dataKey="v1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="v1.1 (Remediated)" dataKey="v11" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2.5} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 600 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score History */}
        <div className="glass-card p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Score Improvement Progression
            </h3>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              +36 pts total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={SCORE_HISTORY}>
              <CartesianGrid stroke="rgba(51,65,85,0.4)" strokeDasharray="3 3" />
              <XAxis dataKey="version" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis domain={[40, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }}
                labelStyle={{ color: '#f8fafc' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ fill: '#38bdf8', r: 5, strokeWidth: 2, stroke: '#0f172a' }}
                activeDot={{ r: 8, fill: '#00f0ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Distribution */}
        <div className="glass-card p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Intercepted Threat Vectors
            </h3>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              75 total threats
            </span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={DEMO_FAILURES} layout="vertical">
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 10 }} width={110} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {DEMO_FAILURES.map((entry, index) => (
                  <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Heatmap & Causal Chain Explorer */}
      <div className="glass-card p-5 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Search size={16} className="text-rose-400" />
              <span>Red-Team Failure Heatmap & Root Cause Links</span>
            </h3>
            <p className="text-xs text-slate-400">Click any threat row to inspect AI Root Cause Analysis (Step 5) & Fix Engine (Step 6)</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">150 automated adversarial trials</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400">
                {['Threat Vector', 'Category', 'Detections', 'Severity', 'Auto-Remediation Status', 'Quick Actions'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3.5 font-bold uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {DEMO_FAILURES.map((f, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedFailure(selectedFailure === i ? null : i)}
                >
                  <td className="py-3 px-3.5 font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: f.color }} />
                      <span>{f.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-400">{f.category}</td>
                  <td className="py-3 px-3.5 font-mono font-bold" style={{ color: f.color }}>{f.count} cases</td>
                  <td className="py-3 px-3.5">
                    <SeverityBadge severity={f.severity} small />
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle size={10} /> Remediation Patch Ready
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/root-cause"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] font-medium transition-colors"
                      >
                        Root Cause →
                      </Link>
                      <Link
                        to="/fix-engine"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-medium transition-colors"
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
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <AlertTriangle size={15} />
                <span>Deep Causal Insight: {DEMO_FAILURES[selectedFailure].name}</span>
              </div>
              <SeverityBadge severity={DEMO_FAILURES[selectedFailure].severity} small />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detected across {DEMO_FAILURES[selectedFailure].count} adversarial scenarios. The agent lacked parameter bounding and authorization checks prior to executing financial or data retrieval tools.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/root-cause" className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1">
                View Step 5 Causal Chain & Graph <ArrowRight size={13} />
              </Link>
              <Link to="/fix-engine" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                Generate Step 6 Patch <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Registered Agents Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Bot size={16} className="text-indigo-400" />
            <span>Agent Registry & Version Benchmarks</span>
          </h3>
          <Link to="/agents" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold">
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
              className="glass-card p-5 block metric-card border border-slate-800 hover:border-cyan-500/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <span>{a.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        v{a.version}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{a.model} · {a.domain} Domain · 150 Tests</div>
                  </div>
                </div>
                <div className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${a.ready ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/15 text-rose-400 border border-rose-500/40'}`}>
                  {a.statusBadge}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 text-center pt-3 border-t border-slate-800/80">
                {[
                  ['Score', a.score, a.score >= 85 ? '#10b981' : '#f43f5e'],
                  ['Safety', a.safety, '#10b981'],
                  ['Security', a.security, '#a855f7'],
                  ['Tests', a.tests, '#94a3b8'],
                  ['Critical', a.critical, a.critical === 0 ? '#10b981' : '#f43f5e'],
                ].map(([label, val, color]) => (
                  <div key={label} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/50">
                    <div className="text-base font-extrabold font-mono" style={{ color }}>{val}</div>
                    <div className="text-[10px] font-medium text-slate-400">{label}</div>
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
