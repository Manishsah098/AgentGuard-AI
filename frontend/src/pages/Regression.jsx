import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  RefreshCw, TrendingUp, TrendingDown, CheckCircle2, XCircle,
  Play, Zap, Shield, Lock, Eye, Terminal, ChevronRight,
  Activity, GitCompare, Bot, Clock, AlertTriangle, Trophy
} from 'lucide-react'

const REGRESSION_ITERATIONS = [
  {
    iteration: 1,
    score: 82,
    fixes_applied: ['PROMPT_PATCH: Mandatory verification gate added for financial tools'],
    failures_fixed: ['Refund Issued Without Authorization'],
    new_failures: [],
    remaining_failures: 2,
    status: 'IMPROVED',
    scenarios_run: 150,
    passed: 126,
    failed: 24,
    critical: 4,
    duration_ms: 3200,
  },
  {
    iteration: 2,
    score: 88,
    fixes_applied: [
      'PROMPT_PATCH: Instruction boundary enforcement added',
      'TOOL_PERMISSION: search_customer() scoped to verified customer',
    ],
    failures_fixed: ['Prompt Injection Susceptibility', 'Bulk Customer Data Exposure'],
    new_failures: [],
    remaining_failures: 1,
    status: 'IMPROVED',
    scenarios_run: 150,
    passed: 139,
    failed: 11,
    critical: 1,
    duration_ms: 3100,
  },
  {
    iteration: 3,
    score: 94,
    fixes_applied: [
      'PROMPT_PATCH: Role-lock instruction added (immutable identity)',
      'POLICY_RULE: Retry policy max_retries=3 with backoff enforced',
    ],
    failures_fixed: ['Agent Accepted Unauthorized Role Change', 'Excessive Retry Loop Detected'],
    new_failures: [],
    remaining_failures: 0,
    status: 'PASS',
    scenarios_run: 150,
    passed: 148,
    failed: 2,
    critical: 0,
    duration_ms: 3050,
  },
]

const SCORE_HISTORY = [
  { version: 'v1.0.0 (Baseline)', score: 71, label: 'Original', color: '#ef4444' },
  { version: 'v1.0.0 Post-Fixes Iter 1', score: 82, label: 'After Eval', color: '#f59e0b' },
  { version: 'Auto-Patch Iter 1', score: 82, label: 'Loop 1', color: '#f59e0b' },
  { version: 'Auto-Patch Iter 2', score: 88, label: 'Loop 2', color: '#3b82f6' },
  { version: 'Auto-Patch Iter 3', score: 94, label: 'Loop 3 ✓', color: '#10b981' },
]

function ScoreDial({ score, size = 80, color = '#10b981' }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(30,45,61,0.8)" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
      />
    </svg>
  )
}

export default function Regression() {
  const [started, setStarted] = useState(false)
  const [currentIteration, setCurrentIteration] = useState(0)
  const [completedIterations, setCompletedIterations] = useState([])
  const [running, setRunning] = useState(false)
  const [runPhase, setRunPhase] = useState('')
  const [displayScore, setDisplayScore] = useState(71)
  const [allDone, setAllDone] = useState(false)
  const [tickLog, setTickLog] = useState([])
  const logRef = useRef(null)

  const addLog = (msg, color = '#94a3b8') => {
    setTickLog(prev => [...prev, { msg, color, ts: new Date().toLocaleTimeString() }])
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [tickLog])

  const runRegressionLoop = async () => {
    setStarted(true)
    setRunning(true)
    setCompletedIterations([])
    setCurrentIteration(0)
    setAllDone(false)
    setTickLog([])
    setDisplayScore(82)

    addLog('🚀 Regression Test Loop initiated...', '#00d4ff')
    addLog('📋 Loading fixed agent configuration...', '#94a3b8')
    await new Promise(r => setTimeout(r, 800))

    for (let i = 0; i < REGRESSION_ITERATIONS.length; i++) {
      const iter = REGRESSION_ITERATIONS[i]
      setCurrentIteration(i + 1)

      addLog(`\n⚡ ITERATION ${i + 1} — Running ${iter.scenarios_run} scenarios...`, '#3b82f6')
      setRunPhase(`Running ${iter.scenarios_run} scenarios...`)
      await new Promise(r => setTimeout(r, 900))

      addLog(`  📦 Generating scenario variants...`, '#94a3b8')
      await new Promise(r => setTimeout(r, 600))

      addLog(`  🔬 Executing in sandbox environment...`, '#94a3b8')
      setRunPhase('Executing in sandbox...')
      await new Promise(r => setTimeout(r, 800))

      addLog(`  📊 Evaluating traces...`, '#94a3b8')
      setRunPhase('Evaluating traces...')
      await new Promise(r => setTimeout(r, 600))

      addLog(`  ✅ Passed: ${iter.passed} | ❌ Failed: ${iter.failed} | 🔴 Critical: ${iter.critical}`, '#f59e0b')
      await new Promise(r => setTimeout(r, 400))

      for (const fixed of iter.failures_fixed) {
        addLog(`  ✓ FIXED: ${fixed}`, '#10b981')
        await new Promise(r => setTimeout(r, 200))
      }

      setDisplayScore(iter.score)
      setCompletedIterations(prev => [...prev, i])

      if (iter.status === 'PASS') {
        addLog(`\n🏆 Score: ${iter.score}/100 — ALL FAILURES RESOLVED`, '#10b981')
        addLog('✅ Agent is PRODUCTION READY', '#10b981')
        setRunPhase('COMPLETE')
        setAllDone(true)
      } else {
        addLog(`📈 Score after iteration ${i + 1}: ${iter.score}/100 (+${iter.score - (i === 0 ? 82 : REGRESSION_ITERATIONS[i - 1].score)} pts)`, '#3b82f6')
        addLog(`🔄 ${iter.remaining_failures} failures remaining — next iteration...`, '#f59e0b')
        await new Promise(r => setTimeout(r, 500))
      }
    }

    setRunning(false)
  }

  const scoreColor = displayScore >= 90 ? '#10b981' : displayScore >= 80 ? '#3b82f6' : '#f59e0b'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold gradient-text flex items-center gap-2">
            <RefreshCw size={20} />
            Regression Test Loop
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Step 7: Auto Re-test · Apply fixes → verify improvement → iterate until PASS
          </p>
        </div>
        {!running && !allDone && (
          <button
            onClick={runRegressionLoop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
          >
            <Play size={15} />
            Start Regression Loop
          </button>
        )}
        {running && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
            <RefreshCw size={14} className="animate-spin" />
            {runPhase || 'Running...'}
          </div>
        )}
        {allDone && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981',
              boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
            <Trophy size={15} />
            LOOP COMPLETE: 82 → 94 pts!
          </div>
        )}
      </div>

      {/* Step 7 banner */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <RefreshCw size={14} style={{ color: '#10b981' }} />
        <span className="text-xs font-semibold text-emerald-400">PIPELINE STEP 7 — REGRESSION TEST LOOP</span>
        <div className="ml-auto flex items-center gap-4 text-xs">
          <span className="text-slate-400">Mode:</span>
          <span className="font-bold text-emerald-400">Autonomous Loop</span>
          <span className="text-slate-400">Max Iterations:</span>
          <span className="font-bold text-emerald-400">10</span>
          <span className="text-slate-400">Target Score:</span>
          <span className="font-bold text-emerald-400">≥ 90</span>
        </div>
      </div>

      {/* Score comparison hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Before */}
        <div className="glass-card p-5 text-center space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Before Fixes</div>
          <div className="flex flex-col items-center gap-1 relative">
            <ScoreDial score={71} size={80} color="#ef4444" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black text-red-400">71</span>
            </div>
          </div>
          <div className="text-xs text-red-400 font-bold">HIGH RISK</div>
          <div className="text-xs text-slate-500">6 critical failures</div>
        </div>

        {/* Arrow + score boost */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #ef4444, #10b981)' }} />
            <RefreshCw size={18} style={{ color: '#10b981' }} className={running ? 'animate-spin' : ''} />
            <div className="h-0.5 w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #10b981, #3b82f6)' }} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: scoreColor }}>
              +{displayScore - 71} pts
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {running ? `Iteration ${currentIteration}...` : allDone ? '3 iterations complete' : 'score boost'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: '#10b981' }}>
            <Zap size={11} />
            Auto-fix loop active
          </div>
        </div>

        {/* After */}
        <div className="glass-card p-5 text-center space-y-2 transition-all duration-500"
          style={{
            border: allDone ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(30,45,61,0.8)',
            boxShadow: allDone ? '0 0 20px rgba(16,185,129,0.15)' : 'none',
          }}>
          <div className="text-xs text-slate-400 font-semibold uppercase">After Regression Loop</div>
          <div className="flex flex-col items-center gap-1 relative">
            <ScoreDial score={displayScore} size={80} color={scoreColor} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black" style={{ color: scoreColor }}>{displayScore}</span>
            </div>
          </div>
          <div className="text-xs font-bold" style={{ color: allDone ? '#10b981' : '#f59e0b' }}>
            {allDone ? 'PRODUCTION READY ✓' : running ? 'IMPROVING...' : 'TARGET STATE'}
          </div>
          <div className="text-xs text-slate-500">{allDone ? '0 critical failures' : '1 critical failure'}</div>
        </div>
      </div>

      {/* Score history bar */}
      <div className="glass-card p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Activity size={14} style={{ color: '#3b82f6' }} /> Score Progression
        </h3>
        <div className="space-y-2">
          {SCORE_HISTORY.map((point, i) => {
            const isReached = started ? i <= completedIterations.length + 1 : i === 0 || i === 1
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="text-xs text-slate-400 w-40 flex-shrink-0">{point.label}</div>
                <div className="flex-1 h-5 rounded-full overflow-hidden relative"
                  style={{ background: 'rgba(30,45,61,0.8)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{
                      width: isReached ? `${point.score}%` : '0%',
                      background: `linear-gradient(90deg, ${point.color}80, ${point.color})`,
                    }}
                  />
                </div>
                <div className="text-xs font-bold w-10 text-right" style={{ color: isReached ? point.color : '#475569' }}>
                  {isReached ? point.score : '–'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content: Iterations + Live Log */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Iteration cards */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <GitCompare size={14} style={{ color: '#8b5cf6' }} /> Auto-Fix Iterations
          </h3>
          {!started && (
            <div className="glass-card p-8 text-center space-y-4">
              <RefreshCw size={32} style={{ color: '#475569', margin: '0 auto' }} />
              <p className="text-sm text-slate-400">
                Click <strong className="text-emerald-400">Start Regression Loop</strong> to watch the pipeline automatically apply fixes and re-test until the agent passes.
              </p>
              <div className="text-xs text-slate-500">
                Simulates: 82 → 88 → 94 (3 iterations, +12 pts total)
              </div>
            </div>
          )}

          {REGRESSION_ITERATIONS.map((iter, i) => {
            const isDone = completedIterations.includes(i)
            const isActive = currentIteration === i + 1 && running
            const isPass = iter.status === 'PASS'

            if (!started && !isDone && !isActive) return null

            return (
              <div
                key={i}
                className="glass-card p-5 space-y-3 transition-all duration-500"
                style={{
                  border: isPass && isDone ? '1px solid rgba(16,185,129,0.4)' : isActive ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(30,45,61,0.8)',
                  boxShadow: isActive ? '0 0 15px rgba(59,130,246,0.1)' : isPass && isDone ? '0 0 15px rgba(16,185,129,0.1)' : 'none',
                  opacity: !started ? 0.3 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: isPass && isDone ? 'rgba(16,185,129,0.2)' : isActive ? 'rgba(59,130,246,0.2)' : 'rgba(30,45,61,0.8)',
                        color: isPass && isDone ? '#10b981' : isActive ? '#60a5fa' : '#475569',
                      }}>
                      {isDone ? (isPass ? '✓' : i + 1) : isActive ? <RefreshCw size={11} className="animate-spin" /> : i + 1}
                    </div>
                    <span className="text-sm font-bold text-slate-200">Iteration {i + 1}</span>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full animate-pulse"
                        style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.4)' }}>
                        RUNNING
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isDone && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          background: iter.score >= 90 ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                          color: iter.score >= 90 ? '#10b981' : '#60a5fa',
                          border: `1px solid ${iter.score >= 90 ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.4)'}`,
                        }}>
                        {iter.score}/100
                      </span>
                    )}
                    {isDone && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          background: isPass ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                          color: isPass ? '#10b981' : '#f59e0b',
                          border: `1px solid ${isPass ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        }}>
                        {iter.status}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} />
                      {(iter.duration_ms / 1000).toFixed(1)}s
                    </div>
                  </div>
                </div>

                {isDone && (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Scenarios', value: iter.scenarios_run, color: '#94a3b8' },
                        { label: 'Passed', value: iter.passed, color: '#10b981' },
                        { label: 'Failed', value: iter.failed, color: '#f59e0b' },
                        { label: 'Critical', value: iter.critical, color: '#ef4444' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="p-2 rounded-lg" style={{ background: 'rgba(17,24,39,0.6)' }}>
                          <div className="text-base font-bold" style={{ color }}>{value}</div>
                          <div className="text-xs text-slate-500">{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Fixes applied */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fixes Applied</div>
                      {iter.fixes_applied.map((fix, fi) => (
                        <div key={fi} className="flex items-start gap-2 text-xs py-1">
                          <Zap size={11} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: 1 }} />
                          <span className="text-slate-300">{fix}</span>
                        </div>
                      ))}
                    </div>

                    {/* Fixed failures */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Failures Resolved</div>
                      {iter.failures_fixed.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg"
                          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                          <CheckCircle2 size={11} style={{ color: '#10b981' }} />
                          <span className="text-emerald-400">{f}</span>
                        </div>
                      ))}
                    </div>

                    {!isPass && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 p-2 rounded-lg"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <AlertTriangle size={11} />
                        {iter.remaining_failures} failure(s) remaining → next iteration queued
                      </div>
                    )}
                    {isPass && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 p-2 rounded-lg"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <Trophy size={11} />
                        All failures resolved! Agent is PRODUCTION READY. Regression loop COMPLETE.
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Live log panel */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Terminal size={14} style={{ color: '#00d4ff' }} /> Live Execution Log
          </h3>
          <div
            ref={logRef}
            className="rounded-xl font-mono text-xs p-4 space-y-1 overflow-y-auto"
            style={{
              background: 'rgba(6,10,16,0.95)',
              border: '1px solid rgba(30,45,61,0.8)',
              height: '420px',
            }}
          >
            {tickLog.length === 0 && (
              <div className="text-slate-600 text-center py-8">
                Waiting for regression loop to start...
              </div>
            )}
            {tickLog.map((log, i) => (
              <div key={i} className="flex gap-2 trace-node">
                <span className="text-slate-600 flex-shrink-0">{log.ts}</span>
                <span style={{ color: log.color, whiteSpace: 'pre-wrap' }}>{log.msg}</span>
              </div>
            ))}
            {running && (
              <div className="flex items-center gap-2 text-blue-400">
                <RefreshCw size={10} className="animate-spin" />
                <span className="animate-pulse">Processing...</span>
              </div>
            )}
          </div>

          {/* Final summary */}
          {allDone && (
            <div className="p-4 rounded-xl space-y-3"
              style={{ background: 'rgba(16,185,129,0.08)', border: '2px solid rgba(16,185,129,0.3)', boxShadow: '0 0 20px rgba(16,185,129,0.1)' }}>
              <div className="flex items-center gap-2">
                <Trophy size={16} style={{ color: '#10b981' }} />
                <span className="text-sm font-bold text-emerald-400">Regression Loop Complete</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-slate-400">Initial Score</div>
                  <div className="font-bold text-red-400 text-base">82</div>
                </div>
                <div>
                  <div className="text-slate-400">Final Score</div>
                  <div className="font-bold text-emerald-400 text-base">94</div>
                </div>
                <div>
                  <div className="text-slate-400">Boost</div>
                  <div className="font-bold text-blue-400">+12 pts</div>
                </div>
                <div>
                  <div className="text-slate-400">Iterations</div>
                  <div className="font-bold text-purple-400">3</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Bot size={12} />
                Agent is PRODUCTION READY
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version comparison static row */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <GitCompare size={14} style={{ color: '#8b5cf6' }} />
          Version Comparison: v1.0.0 → v1.1.0 (Full Release)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Safety Score', v1: 62, v11: 89, icon: Shield },
            { label: 'Security Score', v1: 68, v11: 92, icon: Lock },
            { label: 'Critical Vulnerabilities', v1: 6, v11: 1, inverse: true, icon: AlertTriangle },
          ].map(({ label, v1, v11, inverse, icon: Icon }) => {
            const improved = inverse ? v11 < v1 : v11 > v1
            const change = v11 - v1
            return (
              <div key={label} className="p-4 rounded-xl space-y-2"
                style={{ background: 'rgba(17,24,39,0.6)', border: '1px solid rgba(30,45,61,0.8)' }}>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon size={12} />
                  {label}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-200">{v1} → {v11}</span>
                  <span className="text-xs font-bold flex items-center gap-0.5"
                    style={{ color: improved ? '#10b981' : '#ef4444' }}>
                    {improved ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {inverse ? Math.abs(change) + ' Fixed' : '+' + change}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
