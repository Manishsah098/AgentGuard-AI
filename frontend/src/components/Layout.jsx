import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Bot, Play, GitCompare,
  FileText, GitBranch, Activity, ChevronLeft, ChevronRight,
  Zap, Wrench, Search, Lock, CheckCircle2, Sparkles
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
      { path: '/root-cause', label: 'Root Cause Analyzer', icon: Search, accent: '#dc2626', step: 'STEP 5' },
      { path: '/fix-engine', label: 'AI Fix Engine', icon: Wrench, accent: '#ea580c', step: 'STEP 6' },
      { path: '/regression', label: 'Regression Test Loop', icon: GitCompare, accent: '#059669', step: 'STEP 7', highlight: true },
    ]
  },
  {
    group: 'DEPLOYMENT & GOVERNANCE',
    items: [
      { path: '/ci-gate', label: 'CI/CD Quality Gate', icon: GitBranch, accent: '#2563eb' },
      { path: '/reports', label: 'Security & Audit Reports', icon: FileText, accent: '#7c3aed' },
    ]
  }
]

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen transition-colors duration-200" style={{ backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300 bg-white border-r border-slate-200 shadow-xs"
        style={{
          width: collapsed ? '72px' : '260px',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 shadow-sm bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 group-hover:scale-105 transition-transform">
              <Shield size={22} className="text-white" />
            </div>
            {!collapsed && (
              <div>
                <div className="font-black text-base tracking-tight text-slate-900 flex items-center gap-1">
                  <span>AgentGuard</span>
                  <span className="text-blue-600">AI</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-400 tracking-wide flex items-center gap-1.5">
                  <span>Reliability Engine</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                <div className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  {group.group}
                </div>
              )}
              {group.items.map(({ path, label, icon: Icon, accent, badge, step, highlight }) => {
                const isActive = location.pathname === path || 
                  (path !== '/' && location.pathname.startsWith(path))
                const activeColor = accent || '#2563eb'

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-xs ${
                      isActive 
                        ? 'font-bold bg-blue-50/80 border-blue-200 text-blue-700 shadow-xs' 
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                    }`}
                    style={{
                      color: isActive ? activeColor : undefined,
                      borderColor: isActive ? `${activeColor}35` : 'transparent',
                      backgroundColor: isActive ? `${activeColor}10` : undefined,
                    }}
                    title={collapsed ? label : ''}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon 
                        size={18} 
                        className="flex-shrink-0 transition-transform" 
                        style={{ color: isActive ? activeColor : '#64748b' }} 
                      />
                      {!collapsed && (
                        <span className="truncate tracking-tight">{label}</span>
                      )}
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {step && (
                          <span 
                            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider"
                            style={{ 
                              background: `${activeColor}15`, 
                              color: activeColor,
                              border: `1px solid ${activeColor}30`
                            }}
                          >
                            {step}
                          </span>
                        )}
                        {badge && !step && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {badge}
                          </span>
                        )}
                        {highlight && (
                          <Sparkles size={13} className="text-emerald-500" />
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Live Status Card */}
        {!collapsed && (
          <div className="m-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-slate-800">ACTIVE PROTECTION</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 border border-blue-200">
                v1.1.0
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              Autonomous red-teaming sandbox armed with 10 threat vectors.
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-medium">Score Target</span>
              <span className="font-extrabold text-emerald-600">94 / 100 (+20%)</span>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          {!collapsed ? (
            <>
              <span className="font-medium text-slate-500">Enterprise Engine</span>
              <span className="text-blue-600 font-mono font-bold">v1.0.4</span>
            </>
          ) : (
            <div className="w-full flex justify-center text-blue-600 font-mono font-bold">v1.0</div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300 min-h-screen flex flex-col"
        style={{ marginLeft: collapsed ? '72px' : '260px' }}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <Activity size={14} className="text-blue-600" />
              <span className="text-slate-500 font-medium hidden sm:inline">Engine Latency:</span>
              <span className="font-mono font-bold text-slate-800">38ms</span>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs">
              <Lock size={13} className="text-purple-600" />
              <span className="text-slate-500 font-medium">Sandbox:</span>
              <span className="font-bold text-purple-700">Level 4 Confined</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span className="font-bold">Quality Gate: PASS (Score 94)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/evaluate"
              className="btn-primary text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-xs"
            >
              <Zap size={14} />
              <span>Run Eval Studio</span>
            </Link>

            <Link
              to="/reports"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
            >
              <FileText size={14} className="text-blue-600" />
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
