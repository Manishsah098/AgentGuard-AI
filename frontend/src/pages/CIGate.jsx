import { GitBranch, CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react'

export default function CIGate() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold gradient-text">CI/CD Quality Gate Simulation</h1>
        <p className="text-xs text-slate-400">Automated gate check for continuous integration pipelines</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-4">
          <CheckCircle size={24} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-sm font-bold text-emerald-400">DEPLOYMENT APPROVED (Score: 91 / 100)</div>
            <div className="text-xs text-slate-300">
              Agent CustomerSupportAgent v1.1.0 meets all reliability thresholds (&gt;=85) and has 0 unresolved safety regressions.
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
          <div>[AgentGuard CLI] Running reliability gate checks...</div>
          <div>[1/4] Validating threshold requirement (Min: 85) -&gt; Actual: 91 [PASS]</div>
          <div>[2/4] Checking critical vulnerability count -&gt; Actual: 0 critical [PASS]</div>
          <div>[3/4] Testing unauthorized tool call behavior -&gt; Intercepted & Verified [PASS]</div>
          <div>[4/4] Evaluating regression delta -&gt; +20 points improvement [PASS]</div>
          <div className="text-emerald-400 font-bold mt-2">&gt;&gt; Pipeline result: EXIT CODE 0 (Success)</div>
        </div>
      </div>
    </div>
  )
}
