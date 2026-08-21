import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu, Play, Database, Brain, CheckCircle2, XCircle,
  Search, Wrench, RefreshCw, ArrowDown, ArrowRight,
  Zap, AlertTriangle, ChevronRight, Activity
} from 'lucide-react'

const PIPELINE_STEPS = [
  {
    id: 1,
    key: 'scenario',
    label: 'Scenario Generator',
    sublabel: '10 Threat Dimensions',
    icon: Cpu,
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.3)',
    route: '/evaluate',
    description: 'Generates adversarial, safety, security and reliability test scenarios using mutation and red-team techniques.',
    stats: '150 scenarios generated',
  },
  {
    id: 2,
    key: 'execution',
    label: 'Agent Execution',
    sublabel: 'Real LLM / Sim Engine + Tool Calls',
    icon: Play,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.3)',
    route: '/evaluate',
    description: 'Runs each scenario through the agent in an isolated sandbox, intercepting all tool calls and state changes.',
    stats: '300 tool calls traced',
  },
  {
    id: 3,
    key: 'trace',
    label: 'Trace Capture',
    sublabel: 'Reasoning Steps, Tool I/O, Latency',
    icon: Database,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
    route: '/evaluate',
    description: 'Records full execution traces including agent thinking, tool arguments, responses, and timing data.',
    stats: '100% trace fidelity',
  },
  {
    id: 4,
    key: 'evaluation',
    label: 'AI Evaluation',
    sublabel: 'Impartial Evaluator: PASS / FAIL',
    icon: Brain,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    route: '/evaluate',
    description: 'Impartial AI evaluator scores each trace against safety, security, and behavioral policies.',
    stats: 'PASS / FAIL verdict',
  },
]

const FAILURE_STEPS = [
  {
    id: 5,
    key: 'rootcause',
    label: 'AI Root Cause',
    sublabel: 'Causal Chain + Evidence',
    icon: Search,
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.3)',
    route: '/root-cause',
    description: 'Deep causal chain analysis identifies exactly why each failure occurred and which layers are affected.',
    stats: '97% confidence avg',
  },
  {
    id: 6,
    key: 'fix',
    label: 'AI Fix Engine',
    sublabel: 'Prompt, Tool Perms, Policy, Validation',
    icon: Wrench,
    color: '#f97316',
    glow: 'rgba(249,115,22,0.3)',
    route: '/fix-engine',
    description: 'Generates structured, auto-applicable fixes: prompt patches, tool permission changes, and policy rules.',
    stats: 'Auto-applicable fixes',
  },
  {
    id: 7,
    key: 'regression',
    label: 'Regression Test Loop',
    sublabel: 'Auto Re-test (82 → 94 Boost!)',
    icon: RefreshCw,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
    route: '/regression',
    description: 'After fixes are applied, automatically re-runs the full evaluation suite to verify improvements.',
    stats: '82 → 94 score boost',
    highlight: true,
  },
]

function PipelineNode({ step, isActive, isComplete, onClick, index, total }) {
  const Icon = step.icon
  return (
    <div
      onClick={() => onClick(step.route)}
      className="pipeline-node"
      style={{
        animationDelay: `${index * 0.1}s`,
        cursor: 'pointer',
      }}
    >
      <div
        className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${step.color}15, ${step.color}08)`
            : 'var(--color-bg-card)',
          borderColor: isActive ? step.color : 'var(--color-border)',
          boxShadow: isActive ? `0 0 20px ${step.glow}, 0 0 40px ${step.glow}50` : 'none',
          minWidth: '140px',
        }}
      >
        {/* Animated background pulse when active */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-2xl animate-ping opacity-10"
            style={{ background: step.color, animationDuration: '2s' }}
          />
        )}

        {/* Step number badge */}
        <div
          className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: isActive ? step.color : 'var(--color-bg-elevated)',
            color: isActive ? '#fff' : 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
          }}
        >
          {step.id}
        </div>

        {/* Complete check */}
        {isComplete && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 size={14} style={{ color: '#10b981' }} />
          </div>
        )}

        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mt-2 transition-all duration-300 group-hover:scale-110"
          style={{
            background: `${step.color}15`,
            border: `1px solid ${step.color}35`,
          }}
        >
          <Icon size={18} style={{ color: step.color }} />
        </div>

        {/* Label */}
        <div className="text-center">
          <div className="text-xs font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>{step.label}</div>
          <div className="text-xs mt-0.5 leading-tight font-medium" style={{ color: step.color }}>
            {step.sublabel}
          </div>
        </div>

        {/* Stats badge */}
        {isActive && (
          <div
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}40` }}
          >
            {step.stats}
          </div>
        )}

        {step.highlight && (
          <div className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse"
            style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>
            +12 pts boost!
          </div>
        )}
      </div>
    </div>
  )
}

function AnimatedArrow({ color = 'var(--color-border-bright)', vertical = false, active = false }) {
  const arrowColor = active ? color : 'var(--color-border-bright)'
  return (
    <div className="flex items-center justify-center flex-shrink-0">
      {vertical ? (
        <div className="flex flex-col items-center gap-0.5 py-1">
          <div className="w-0.5 h-4 rounded-full transition-all duration-500"
            style={{ background: arrowColor, boxShadow: active ? `0 0 8px ${color}` : 'none' }} />
          <ArrowDown size={12} style={{ color: arrowColor }} />
        </div>
      ) : (
        <div className="flex items-center gap-0.5 px-1">
          <div className="h-0.5 w-8 rounded-full transition-all duration-500"
            style={{ background: arrowColor, boxShadow: active ? `0 0 8px ${color}` : 'none' }} />
          <ArrowRight size={12} style={{ color: arrowColor }} />
        </div>
      )}
    </div>
  )
}

export default function PipelineFlowDiagram({ activeStep = null, completedSteps = [] }) {
  const navigate = useNavigate()
  const [hoveredStep, setHoveredStep] = useState(null)
  const [animStep, setAnimStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const runAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setAnimStep(0)
    let step = 0
    const interval = setInterval(() => {
      step++
      setAnimStep(step)
      if (step >= 7) {
        clearInterval(interval)
        setTimeout(() => {
          setIsAnimating(false)
          setAnimStep(0)
        }, 2000)
      }
    }, 600)
  }

  const currentActive = activeStep ?? (isAnimating ? animStep : null)
  const currentCompleted = completedSteps.length > 0 ? completedSteps : (isAnimating ? Array.from({ length: animStep - 1 }, (_, i) => i + 1) : [])

  const isStepActive = (id) => currentActive === id
  const isStepDone = (id) => currentCompleted.includes(id)

  const showFailureBranch = currentActive >= 5 || currentCompleted.some(s => s >= 5)
  const passActive = currentActive === 4 && !showFailureBranch

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold gradient-text flex items-center gap-2">
            <Activity size={16} />
            7-Step Autonomous Evaluation Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any step to navigate · Click Simulate to watch the full pipeline run
          </p>
        </div>
        <button
          onClick={runAnimation}
          disabled={isAnimating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{
            background: isAnimating ? 'rgba(59,130,246,0.1)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            border: '1px solid rgba(59,130,246,0.4)',
            color: 'white',
          }}
        >
          {isAnimating ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
          {isAnimating ? 'Simulating...' : 'Simulate Pipeline'}
        </button>
      </div>

      {/* Main Pipeline Flow */}
      <div className="overflow-x-auto pb-2">
        <div className="flex flex-col items-center gap-0 min-w-max mx-auto">

          {/* Agent Config Row */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl mb-3"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Cpu size={14} style={{ color: '#3b82f6' }} />
            <span className="text-xs font-semibold text-blue-400">AI AGENT (Config & Tools)</span>
            <ArrowDown size={12} className="text-blue-400" />
          </div>

          {/* Steps 1–4: Main pipeline row */}
          <div className="flex items-center gap-0">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div onMouseEnter={() => setHoveredStep(step.id)} onMouseLeave={() => setHoveredStep(null)}>
                  <PipelineNode
                    step={step}
                    isActive={isStepActive(step.id) || hoveredStep === step.id}
                    isComplete={isStepDone(step.id)}
                    onClick={(route) => navigate(route)}
                    index={i}
                    total={PIPELINE_STEPS.length}
                  />
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <AnimatedArrow
                    color={PIPELINE_STEPS[i].color}
                    active={isStepDone(step.id) || isStepActive(step.id)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Arrow down from Step 4 */}
          <AnimatedArrow vertical color="#f59e0b" active={isStepDone(4) || isStepActive(4)} />

          {/* PASS / FAIL Branch */}
          <div className="flex items-start gap-12">
            {/* PASS branch */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="px-6 py-2 rounded-xl border text-xs font-bold transition-all duration-500"
                style={{
                  background: passActive ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.05)',
                  borderColor: passActive ? '#10b981' : 'rgba(16,185,129,0.2)',
                  color: passActive ? '#10b981' : '#475569',
                  boxShadow: passActive ? '0 0 20px rgba(16,185,129,0.3)' : 'none',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  PASS
                </div>
              </div>
              <div className="text-xs text-slate-500 text-center max-w-[100px]">Agent is production ready</div>
            </div>

            {/* FAIL branch */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="px-6 py-2 rounded-xl border text-xs font-bold transition-all duration-500"
                style={{
                  background: showFailureBranch ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.05)',
                  borderColor: showFailureBranch ? '#ef4444' : 'rgba(239,68,68,0.2)',
                  color: showFailureBranch ? '#ef4444' : '#475569',
                  boxShadow: showFailureBranch ? '0 0 20px rgba(239,68,68,0.3)' : 'none',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <XCircle size={13} />
                  FAILURE
                </div>
              </div>

              {/* Arrow down to failure steps */}
              <AnimatedArrow vertical color="#ef4444" active={showFailureBranch} />

              {/* Steps 5, 6, 7 */}
              {FAILURE_STEPS.map((step, i) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div onMouseEnter={() => setHoveredStep(step.id)} onMouseLeave={() => setHoveredStep(null)}>
                    <PipelineNode
                      step={step}
                      isActive={isStepActive(step.id) || hoveredStep === step.id}
                      isComplete={isStepDone(step.id)}
                      onClick={(route) => navigate(route)}
                      index={i}
                      total={FAILURE_STEPS.length}
                    />
                  </div>
                  {i < FAILURE_STEPS.length - 1 && (
                    <AnimatedArrow vertical color={step.color} active={isStepDone(step.id) || isStepActive(step.id)} />
                  )}
                </div>
              ))}

              {/* Regression loop back arrow */}
              <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <RefreshCw size={11} style={{ color: '#10b981' }} />
                <span className="text-xs font-semibold" style={{ color: '#10b981' }}>Auto-Re-test Loop → 82 → 94 pts!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredStep && (() => {
        const allSteps = [...PIPELINE_STEPS, ...FAILURE_STEPS]
        const step = allSteps.find(s => s.id === hoveredStep)
        if (!step) return null
        return (
          <div className="p-3 rounded-xl text-xs leading-relaxed transition-all"
            style={{ background: `${step.color}10`, border: `1px solid ${step.color}30`, color: '#94a3b8' }}>
            <span className="font-bold" style={{ color: step.color }}>Step {step.id}: {step.label}</span>
            {' — '}{step.description}
          </div>
        )
      })()}
    </div>
  )
}
