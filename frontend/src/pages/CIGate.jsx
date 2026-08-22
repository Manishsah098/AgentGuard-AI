import { useState, useEffect } from 'react'
import {
  GitBranch, CheckCircle2, XCircle, Shield, AlertTriangle,
  Play, Terminal, Copy, Check, Sliders, RefreshCw,
  FileCode, Send, ArrowRight, Zap, Lock
} from 'lucide-react'

const GITHUB_ACTIONS_YAML = `name: AgentGuard AI Quality Gate

on:
  pull_request:
    branches: [ main, production ]
  push:
    branches: [ main ]

jobs:
  agent-reliability-gate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Agent Codebase
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install AgentGuard CLI
        run: pip install agentguard-cli

      - name: Run Autonomous Red-Team & Reliability Gate
        env:
          AGENTGUARD_API_KEY: \${{ secrets.AGENTGUARD_API_KEY }}
        run: |
          agentguard gate \\
            --agent-id "customer-support-agent" \\
            --min-score 85 \\
            --max-critical 0 \\
            --max-high 2 \\
            --scenarios 150 \\
            --fail-on-regression
`

const GITLAB_CI_YAML = `stages:
  - test
  - agent-security-gate

agentguard_reliability_check:
  stage: agent-security-gate
  image: python:3.11
  script:
    - pip install agentguard-cli
    - agentguard gate --agent-id "customer-support-agent" --min-score 85 --max-critical 0
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
`

const CLI_COMMAND = `agentguard gate --agent-id "customer-support-agent" --min-score 85 --max-critical 0 --scenarios 150`

export default function CIGate() {
  const [minScore, setMinScore] = useState(85)
  const [maxCritical, setMaxCritical] = useState(0)
  const [allowRegression, setAllowRegression] = useState(false)
  const [activeTab, setActiveTab] = useState('runner')
  const [ciTab, setCiTab] = useState('github')
  const [copied, setCopied] = useState(false)
  
  // Pipeline Runner State
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const [gateResult, setGateResult] = useState('PASS') // 'PASS' | 'FAIL' | 'IDLE'

  const actualScore = 94
  const actualCritical = 0
  const actualRegression = 0

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const runPipelineSimulation = () => {
    setIsRunning(true)
    setLogs([])
    setGateResult('IDLE')

    const logMessages = [
      { text: '[AgentGuard CI v1.0.4] Initializing quality gate pipeline...', delay: 300 },
      { text: '[1/5] Fetching agent specification for "CustomerSupportAgent v1.1.0"...', delay: 700 },
      { text: '[2/5] Executing 150 adversarial red-team test scenarios in sandbox...', delay: 1200 },
      { text: '  ├─ Prompt Injection Vectors: 25/25 Blocked [PASS]', delay: 1600 },
      { text: '  ├─ Unauthorized Financial Tool Calls: 0 Executed [PASS]', delay: 2000 },
      { text: '  ├─ Role Boundary Enforcement: Verified [PASS]', delay: 2300 },
      { text: `[3/5] Evaluating Reliability Threshold (Required >= ${minScore}) -> Actual: ${actualScore} [PASS]`, delay: 2700 },
      { text: `[4/5] Checking Critical Zero-Day Count (Max: ${maxCritical}) -> Actual: ${actualCritical} [PASS]`, delay: 3100 },
      { text: '[5/5] Assessing Regression Delta across releases -> +23 pts Improvement [PASS]', delay: 3500 },
      { text: '>> AGENTGUARD DECISION: DEPLOYMENT APPROVED (Exit code 0)', delay: 3900 },
    ]

    logMessages.forEach(({ text, delay }) => {
      setTimeout(() => {
        setLogs(prev => [...prev, text])
      }, delay)
    })

    setTimeout(() => {
      const isPassed = actualScore >= minScore && actualCritical <= maxCritical
      setGateResult(isPassed ? 'PASS' : 'FAIL')
      setIsRunning(false)
    }, 4100)
  }

  useEffect(() => {
    // Run initial simulation
    runPipelineSimulation()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <GitBranch size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold gradient-text">CI/CD Quality Gate & Deployment Guard</h1>
              <p className="text-xs text-slate-400">
                Automated continuous testing and deployment guardrails for AI Agent release pipelines
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runPipelineSimulation}
            disabled={isRunning}
            className="btn-primary text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRunning ? 'animate-spin' : ''} />
            <span>{isRunning ? 'Running Gate Checks...' : 'Trigger Pipeline Check'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        {[
          { key: 'runner', label: 'Interactive Gate Runner' },
          { key: 'pr-simulation', label: 'Pull Request Simulation' },
          { key: 'workflow-generator', label: 'CI Pipeline Configs' },
          { key: 'webhook', label: 'Webhook & Alerts' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === tab.key
                ? 'text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-sm shadow-cyan-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Interactive Gate Runner */}
      {activeTab === 'runner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Gate Configuration */}
          <div className="space-y-4">
            <div className="glass-card p-5 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <Sliders size={16} className="text-cyan-400" />
                <span>Gate Threshold Rules</span>
              </div>

              {/* Min Score Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Minimum Reliability Score:</span>
                  <span className="font-bold text-cyan-400 font-mono">{minScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>60 (Permissive)</span>
                  <span>85 (Recommended)</span>
                  <span>95 (Strict)</span>
                </div>
              </div>

              {/* Max Critical Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Max Critical Vulnerabilities:</span>
                  <span className="font-bold text-rose-400 font-mono">{maxCritical} allowed</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={maxCritical}
                  onChange={(e) => setMaxCritical(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Prevent Regression Checkbox */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Block Regression Drops</div>
                  <div className="text-[10px] text-slate-400">Fail pipeline if score drops vs previous release</div>
                </div>
                <input
                  type="checkbox"
                  checked={!allowRegression}
                  onChange={() => setAllowRegression(!allowRegression)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={runPipelineSimulation}
                disabled={isRunning}
                className="w-full btn-primary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <Zap size={14} className="text-yellow-300" />
                <span>Evaluate Agent Against Gate</span>
              </button>
            </div>

            {/* Target Agent Card */}
            <div className="glass-card p-4 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Target</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-100">CustomerSupportAgent</div>
                  <div className="text-xs text-slate-400">Release Candidate v1.1.0</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                  Score: {actualScore}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Terminal Output & Decision */}
          <div className="lg:col-span-2 space-y-4">
            {/* Gate Result Banner */}
            <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
              gateResult === 'PASS'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : gateResult === 'FAIL'
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}>
              {gateResult === 'PASS' ? (
                <CheckCircle2 size={28} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : gateResult === 'FAIL' ? (
                <XCircle size={28} className="text-rose-400 flex-shrink-0 mt-0.5" />
              ) : (
                <RefreshCw size={28} className="text-cyan-400 animate-spin flex-shrink-0 mt-0.5" />
              )}

              <div className="space-y-1">
                <div className="text-sm font-extrabold tracking-wide uppercase">
                  {gateResult === 'PASS'
                    ? 'DEPLOYMENT GATE: APPROVED (Score 94 / 100)'
                    : gateResult === 'FAIL'
                    ? 'DEPLOYMENT GATE: BLOCKED'
                    : 'RUNNING AUTOMATED GATE CHECKS...'}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {gateResult === 'PASS'
                    ? 'Agent meets all strict reliability thresholds (Score 94 >= 85), 0 critical vulnerabilities, and has passed prompt injection isolation checks.'
                    : gateResult === 'FAIL'
                    ? 'Agent failed defined threshold constraints. Check log details below to remediate before production deployment.'
                    : 'Executing 150 adversarial red-team scenarios and validating safety boundaries...'}
                </div>
              </div>
            </div>

            {/* Terminal Logs Viewer */}
            <div className="glass-card border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2 font-mono">
                  <Terminal size={14} className="text-cyan-400" />
                  <span>agentguard-ci.log (stdout)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
              </div>

              <div className="p-4 bg-[#050811] font-mono text-xs text-slate-300 space-y-1.5 min-h-[220px] max-h-[300px] overflow-y-auto">
                {logs.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.includes('[PASS]')
                        ? 'text-emerald-400'
                        : line.includes('APPROVED')
                        ? 'text-cyan-300 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {line}
                  </div>
                ))}
                {isRunning && (
                  <div className="text-cyan-400 animate-pulse flex items-center gap-1">
                    <span>&gt; Processing test traces...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pull Request Gate Simulation */}
      {activeTab === 'pr-simulation' && (
        <div className="glass-card p-6 border border-slate-800 space-y-6">
          <div className="border border-slate-700/80 rounded-xl bg-slate-950/80 overflow-hidden">
            {/* PR Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Open PR #142
                </span>
                <span className="text-sm font-bold text-slate-100">
                  feat(agent): deploy CustomerSupportAgent v1.1.0 with financial authorization gate
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">branch: feat/support-agent-v1.1 → main</span>
            </div>

            {/* PR Checks */}
            <div className="p-4 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Checks Passed (3/3)</div>
              
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">agentguard/reliability-gate</div>
                      <div className="text-[11px] text-slate-400">Reliability Score: 94/100 (Threshold: &gt;=85)</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">SUCCESS</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">agentguard/zero-day-redteam</div>
                      <div className="text-[11px] text-slate-400">0 Critical Vulnerabilities Detected across 150 scenarios</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">SUCCESS</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">agentguard/regression-delta</div>
                      <div className="text-[11px] text-slate-400">+23 points improvement over v1.0.0 (71 → 94)</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">SUCCESS</span>
                </div>
              </div>

              {/* Merge Button simulation */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-800">
                <div className="text-xs text-slate-400">This pull request meets all repository security requirements.</div>
                <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2">
                  <Check size={14} /> Merge & Deploy to Production
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: CI Pipeline Configs */}
      {activeTab === 'workflow-generator' && (
        <div className="glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {[
                { id: 'github', label: 'GitHub Actions (.github/workflows/agentguard.yml)' },
                { id: 'gitlab', label: 'GitLab CI (.gitlab-ci.yml)' },
                { id: 'cli', label: 'CLI One-Liner' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setCiTab(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    ciTab === t.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopy(
                ciTab === 'github' ? GITHUB_ACTIONS_YAML : ciTab === 'gitlab' ? GITLAB_CI_YAML : CLI_COMMAND
              )}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Workflow Code'}</span>
            </button>
          </div>

          <div className="rounded-xl bg-[#070b14] border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
            <pre>
              {ciTab === 'github' ? GITHUB_ACTIONS_YAML : ciTab === 'gitlab' ? GITLAB_CI_YAML : CLI_COMMAND}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Webhook & Alerts */}
      {activeTab === 'webhook' && (
        <div className="glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Send size={16} className="text-cyan-400" />
                <span>Automated Incident Webhook Payload</span>
              </h3>
              <p className="text-xs text-slate-400">Dispatched automatically to Slack, PagerDuty, or Datadog upon CI gate evaluation</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
              HTTP 200 OK
            </span>
          </div>

          <div className="rounded-xl bg-[#070b14] border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>
{`{
  "event": "agentguard.gate.evaluated",
  "timestamp": "${new Date().toISOString()}",
  "agent": {
    "name": "CustomerSupportAgent",
    "version": "1.1.0",
    "model": "GPT-4"
  },
  "pipeline_verdict": "PASS",
  "overall_reliability_score": 94.0,
  "threshold_configured": 85.0,
  "critical_vulnerabilities": 0,
  "scenarios_evaluated": 150,
  "regression_delta": "+23.0 points",
  "report_url": "https://agentguard.ai/reports/RPT-DEMO-2026",
  "commit_sha": "a7f3c92e104b492",
  "triggered_by": "ci-runner"
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
