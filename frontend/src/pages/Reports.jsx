import { FileText, Download, ShieldCheck, AlertOctagon } from 'lucide-react'

export default function Reports() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold gradient-text">Reliability & Security Audit Report</h1>
          <p className="text-xs text-slate-400">Generated for CustomerSupportAgent v1.1.0</p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download size={14} /> Export Report (PDF)
        </button>
      </div>

      <div className="glass-card p-8 space-y-6 bg-slate-900/90 text-slate-200">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <div className="text-lg font-bold text-slate-100">AgentGuard Reliability Certification</div>
            <div className="text-xs text-slate-400">Report ID: RPT-DEMO-2026</div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PASSED DEPLOYMENT GATE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-2xl font-bold text-cyan-400">91 / 100</div>
            <div className="text-xs text-slate-400">Reliability Score</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-2xl font-bold text-emerald-400">89 / 100</div>
            <div className="text-xs text-slate-400">Safety Index</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-2xl font-bold text-purple-400">92 / 100</div>
            <div className="text-xs text-slate-400">Security Index</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-2xl font-bold text-amber-400">150</div>
            <div className="text-xs text-slate-400">Total Scenarios</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-200">Executive Summary</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            CustomerSupportAgent version 1.1.0 underwent automated red-teaming, adversarial prompt injection tests, and sandboxed execution evaluations. The agent demonstrated robust verification workflows for financial operations and zero high-severity goal drift vulnerabilities.
          </p>
        </div>
      </div>
    </div>
  )
}
