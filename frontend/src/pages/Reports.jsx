import { useState } from 'react'
import {
  FileText, Download, ShieldCheck, AlertOctagon, CheckCircle2,
  XCircle, Award, Printer, Shield, Calendar, Bot, Check,
  ExternalLink, Lock, FileCode, CheckSquare
} from 'lucide-react'
import ScoreRing from '../components/ScoreRing'
import SeverityBadge from '../components/SeverityBadge'

const OWASP_LLM_COMPLIANCE = [
  { id: 'LLM01', name: 'Prompt Injection', status: 'PASS', score: '98%', mitigation: 'Instruction boundary validation & role-lock filters' },
  { id: 'LLM02', name: 'Insecure Output Handling', status: 'PASS', score: '96%', mitigation: 'Strict response schemas & tool output sanitization' },
  { id: 'LLM06', name: 'Excessive Agency & Privilege', status: 'PASS', score: '94%', mitigation: 'Granular tool authorization gates on financial APIs' },
  { id: 'LLM07', name: 'System Prompt Leakage', status: 'PASS', score: '95%', mitigation: 'Immutable system prompt barrier & intent classifier' },
  { id: 'LLM08', name: 'Vector & Tool Misuse', status: 'PASS', score: '92%', mitigation: 'Pre-flight parameter validation & rate-limiting' },
  { id: 'LLM09', name: 'Infinite Loops / DoS', status: 'PASS', score: '97%', mitigation: 'Max execution depth=3 with exponential backoff' },
]

const NIST_RMF_PILLARS = [
  { pillar: 'Govern', compliance: 95, desc: 'Policies and processes for agentic risk management established' },
  { pillar: 'Map', compliance: 92, desc: 'Categorized 10 threat vectors & agent tool execution boundaries' },
  { pillar: 'Measure', compliance: 96, desc: 'Continuous automated red-team evaluation across 150 scenarios' },
  { pillar: 'Manage', compliance: 94, desc: 'Automated AI Fix Engine & self-healing regression loop active' },
]

export default function Reports() {
  const [selectedVersion, setSelectedVersion] = useState('v1.1.0')
  const [downloading, setDownloading] = useState(false)

  const isV11 = selectedVersion === 'v1.1.0'
  const reportScore = isV11 ? 94 : 71
  const reportStatus = isV11 ? 'APPROVED FOR PRODUCTION' : 'DEPLOYMENT BLOCKED'

  const handleExportPDF = () => {
    setDownloading(true)
    setTimeout(() => {
      window.print()
      setDownloading(false)
    }, 300)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800 no-print">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold gradient-text">Enterprise Reliability & Security Audit</h1>
              <p className="text-xs text-slate-400">Official certification report and regulatory compliance audit package</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-cyan-400 transition-colors"
          >
            <option value="v1.1.0">CustomerSupportAgent v1.1.0 (Hardened)</option>
            <option value="v1.0.0">CustomerSupportAgent v1.0.0 (Vulnerable Baseline)</option>
          </select>

          <button
            onClick={handleExportPDF}
            disabled={downloading}
            className="btn-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
          >
            <Printer size={14} />
            <span>{downloading ? 'Preparing...' : 'Print / Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="glass-card p-6 md:p-10 space-y-8 bg-slate-950/90 border border-slate-800/90 shadow-2xl relative overflow-hidden text-slate-200">
        {/* Certificate Watermark / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={26} className={isV11 ? 'text-emerald-400' : 'text-rose-400'} />
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                AgentGuard Reliability Certification
              </h2>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-3">
              <span>Report ID: <strong className="text-slate-200 font-mono">RPT-AG-2026-9401</strong></span>
              <span>•</span>
              <span>Generated: <strong className="text-slate-200">{new Date().toLocaleDateString()}</strong></span>
              <span>•</span>
              <span>Auditor: <strong className="text-cyan-400">AgentGuard Autonomous Engine</strong></span>
            </div>
          </div>

          <div className="text-right flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border shadow-md ${
              isV11 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' 
                : 'bg-rose-500/15 text-rose-400 border-rose-500/40'
            }`}>
              {reportStatus}
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-black font-mono text-cyan-400">{reportScore} / 100</div>
            <div className="text-xs text-slate-400 font-semibold mt-0.5">Reliability Score</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">{isV11 ? 'Grade: A+ (Target >= 85)' : 'Grade: C- (Fails Gate)'}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-black font-mono text-emerald-400">{isV11 ? '91%' : '62%'}</div>
            <div className="text-xs text-slate-400 font-semibold mt-0.5">Safety Index</div>
            <div className="text-[10px] text-slate-400 mt-1">Harm Prevention</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-black font-mono text-purple-400">{isV11 ? '94%' : '68%'}</div>
            <div className="text-xs text-slate-400 font-semibold mt-0.5">Security Index</div>
            <div className="text-[10px] text-slate-400 mt-1">Injection Resilience</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-black font-mono text-amber-400">150</div>
            <div className="text-xs text-slate-400 font-semibold mt-0.5">Threat Scenarios</div>
            <div className="text-[10px] text-cyan-400 mt-1">10 Threat Vectors</div>
          </div>
        </div>

        {/* Executive Narrative */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Award size={15} className="text-cyan-400" />
            <span>Executive Findings & Verdict</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isV11 ? (
              <>
                CustomerSupportAgent version 1.1.0 underwent 150 automated adversarial red-team evaluations across multi-turn prompt injections, tool boundary tampering, and financial execution simulations. Following the application of AI Fix Engine patches (Step 6), all 7 critical zero-day vulnerabilities were completely neutralized. The agent achieved a composite score of <strong>94/100</strong>, fully satisfying enterprise security gate thresholds.
              </>
            ) : (
              <>
                CustomerSupportAgent version 1.0.0 contains 6 critical zero-day vulnerabilities in financial refund execution and unauthorized customer data extraction. Deployment to production is strictly blocked until remediated via Step 6 (AI Fix Engine) and verified through Step 7 (Regression Test Loop).
              </>
            )}
          </p>
        </div>

        {/* OWASP LLM Top 10 Compliance Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Lock size={15} className="text-cyan-400" />
              <span>OWASP Top 10 for LLM Applications Compliance Matrix</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              100% Compliant
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 text-left font-bold text-[10px] uppercase">Category</th>
                  <th className="py-2.5 px-3 text-left font-bold text-[10px] uppercase">Threat Description</th>
                  <th className="py-2.5 px-3 text-left font-bold text-[10px] uppercase">Status</th>
                  <th className="py-2.5 px-3 text-left font-bold text-[10px] uppercase">Score</th>
                  <th className="py-2.5 px-3 text-left font-bold text-[10px] uppercase">Remediation Mechanism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {OWASP_LLM_COMPLIANCE.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{row.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-200">{row.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                        <CheckCircle2 size={12} /> {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-200">{row.score}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{row.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NIST AI RMF 1.0 Framework Alignment */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <CheckSquare size={15} className="text-indigo-400" />
            <span>NIST AI Risk Management Framework (AI RMF 1.0) Pillars</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {NIST_RMF_PILLARS.map((p) => (
              <div key={p.pillar} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">{p.pillar}</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">{p.compliance}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ width: `${p.compliance}%` }} />
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Sign-off & Audit Stamp */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-1 text-center sm:text-left">
            <div>Cryptographic Verification Hash: <span className="font-mono text-slate-300">0x7c4e92a188fbc093e11749da</span></div>
            <div>Evaluation Engine: <span className="text-cyan-400 font-semibold">AgentGuard AI v1.0.4 Enterprise</span></div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Check size={16} />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-bold text-slate-200">DIGITALLY CERTIFIED</div>
              <div className="text-slate-400">AgentGuard CI Gatekeeper</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
