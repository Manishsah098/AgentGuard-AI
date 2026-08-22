import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Bot, Play, GitCompare,
  FileText, GitBranch, Activity, ChevronLeft, ChevronRight,
  Zap, Wrench, Search, Lock, Cpu, Server, ExternalLink,
  Sparkles, CheckCircle2, AlertTriangle
} from 'lucide-react'

const navGroups = [
  {
    group: 'CORE PLATFORM',
    items: [
      { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
      { path: '/agents', label: 'Agent Registry', icon: Bot, badge: '2 Active' },
      { path: '/evaluate', label: 'Evaluation Studio', icon: Play, badge: 'Step 1-4' },
    ]
  },
  {
    group: 'AI RELIABILITY SUITE',
    items: [
      { path: '/root-cause', label: 'Root Cause Analyzer', icon: Search, accent: '#f43f5e', step: 'STEP 5' },
      { path: '/fix-engine', label: 'AI Fix Engine', icon: Wrench, accent: '#fb923c', step: 'STEP 6' },
      { path: '/regression', label: 'Regression Test Loop', icon: GitCompare, accent: '#10b981', step: 'STEP 7', highlight: true },
    ]
  },
  {
    group: 'DEPLOYMENT & GOVERNANCE',
    items: [
      { path: '/ci-gate', label: 'CI/CD Quality Gate', icon: GitBranch, accent: '#38bdf8' },
      { path: '/reports', label: 'Security & Audit Reports', icon: FileText, accent: '#a855f7' },
    ]
  }
]

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-grid transition-colors duration-300" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300 shadow-2xl"
        style={{
          width: collapsed ? '72px' : '260px',
          background: 'rgba(11, 17, 32, 0.92)',
          borderRight: '1px solid rgba(51, 65, 85, 0.5)',
          backdropFilter: 'blur(28px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform"
                 style={{ background: 'linear-gradient(135deg, #0284c7, #6366f1, #a855f7)' }}>
              <Shield size={22} className="text-white drop-shadow" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {!collapsed && (
              <div>
                <div className="font-extrabold text-base tracking-tight flex items-center gap-1">
                  <span className="gradient-text">AgentGuard</span>
                  <span className="text-cyan-400 font-black">AI</span>
                </div>
                <div className="text-[11px] font-medium text-slate-400 tracking-wide flex items-center gap-1">
                  <span>Reliability Engine</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav Items Grouped */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {group.group}
                </div>
              )}
              {group.items.map(({ path, label, icon: Icon, accent, badge, step, highlight }) => {
                const isActive = location.pathname === path || 
                  (path !== '/' && location.pathname.startsWith(path))
                const activeColor = accent || '#38bdf8'

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`nav-item relative flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                      isActive 
                        ? 'font-bold shadow-md' 
                        : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                    style={{
                      background: isActive 
                        ? `linear-gradient(90deg, ${activeColor}22 0%, rgba(15, 23, 42, 0.4) 100%)` 
                        : undefined,
                      borderColor: isActive ? `${activeColor}60` : 'transparent',
                      color: isActive ? '#ffffff' : undefined,
                    }}
                    title={collapsed ? label : ''}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <Icon 
                          size={18} 
                          className="flex-shrink-0 transition-transform group-hover:scale-110" 
                          style={{ color: isActive ? activeColor : '#94a3b8' }} 
                        />
                        {isActive && (
                          <div 
                            className="absolute inset-0 blur-sm opacity-60" 
                            style={{ background: activeColor }} 
                          />
                        )}
                      </div>
                      {!collapsed && (
                        <span className="text-xs truncate tracking-tight">{label}</span>
                      )}
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {step && (
                          <span 
                            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-widest"
                            style={{ 
                              background: `${activeColor}25`, 
                              color: activeColor,
                              border: `1px solid ${activeColor}50`
                            }}
                          >
                            {step}
                          </span>
                        )}
                        {badge && !step && (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                            {badge}
                          </span>
                        )}
                        {highlight && (
                          <Sparkles size={12} className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Pro Live Status Card */}
        {!collapsed && (
          <div className="m-3 p-3.5 rounded-xl glass-card bg-slate-900/90 border border-slate-800/90 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-slate-200">ACTIVE PROTECTION</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                v1.1.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">
              Autonomous red-teaming sandbox armed with 10 threat vectors.
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Score Target</span>
              <span className="font-bold text-emerald-400">94 / 100 (+20%)</span>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          {!collapsed ? (
            <>
              <span>Enterprise Red-Team Engine</span>
              <span className="text-cyan-400 font-mono">v1.0.4</span>
            </>
          ) : (
            <div className="w-full flex justify-center text-cyan-400 font-mono">v1.0</div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300 min-h-screen flex flex-col"
        style={{ marginLeft: collapsed ? '72px' : '260px' }}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
              <Activity size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-slate-400 hidden sm:inline">Engine Latency:</span>
              <span className="font-mono font-bold text-slate-200">38ms</span>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
              <Lock size={13} className="text-purple-400" />
              <span className="text-slate-400">Sandbox Isolation:</span>
              <span className="font-semibold text-purple-300">Level 4 Confined</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400">
              <CheckCircle2 size={13} />
              <span className="font-semibold">Quality Gate: PASS (Score 94)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/evaluate"
              className="btn-primary text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <Zap size={14} className="text-yellow-300" />
              <span>Run Eval Studio</span>
            </Link>

            <Link
              to="/reports"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <FileText size={14} className="text-cyan-400" />
              <span>Audit Report</span>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}
