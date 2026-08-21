import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Bot, Play, GitCompare,
  FileText, GitBranch, Activity, ChevronLeft, ChevronRight,
  Zap, Wrench, Search, Palette
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/agents', label: 'Agent Registry', icon: Bot },
  { path: '/evaluate', label: 'Run Evaluation', icon: Play },
  { path: '/root-cause', label: 'Root Cause (Step 5)', icon: Search, accent: '#ef4444' },
  { path: '/fix-engine', label: 'Fix Engine (Step 6)', icon: Wrench, accent: '#f97316' },
  { path: '/regression', label: 'Regression (Step 7)', icon: GitCompare, accent: '#10b981' },
  { path: '/ci-gate', label: 'CI/CD Gate', icon: GitBranch },
  { path: '/reports', label: 'Reports', icon: FileText },
]

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState('executive')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="flex min-h-screen bg-grid transition-colors duration-300" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300"
        style={{
          width: collapsed ? '64px' : '240px',
          background: 'rgba(9, 13, 22, 0.92)',
          borderRight: '1px solid var(--color-border)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <Shield size={19} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                <span className="gradient-text">AgentGuard</span>
                <span style={{ color: 'var(--color-accent-cyan)' }}> AI</span>
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Enterprise Platform</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon, accent }) => {
            const isActive = location.pathname === path || 
              (path !== '/' && location.pathname.startsWith(path))
            const activeColor = accent || '#818cf8'
            return (
              <Link
                key={path}
                to={path}
                className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                  isActive ? 'active' : 'border-transparent'
                }`}
                style={{
                  color: isActive ? activeColor : 'var(--color-text-secondary)',
                  borderColor: isActive ? `${activeColor}40` : 'transparent',
                  background: isActive ? `${activeColor}15` : 'transparent',
                }}
                title={collapsed ? label : ''}
              >
                <Icon size={17} className="flex-shrink-0" style={{ color: isActive ? activeColor : undefined }} />
                {!collapsed && <span className="text-sm font-medium">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Demo Mode Badge */}
        {!collapsed && (
          <div className="m-3 p-3 rounded-xl glass-card" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={13} style={{ color: 'var(--color-accent-cyan)' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--color-accent-cyan)' }}>PRO DEMO MODE</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Enterprise Red-Teaming & Reliability Engine active.
            </p>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-3 border-t transition-colors hover:bg-white/5"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: collapsed ? '64px' : '240px' }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3"
          style={{
            background: 'rgba(9, 13, 22, 0.85)',
            borderBottom: '1px solid var(--color-border)',
            backdropFilter: 'blur(20px)',
          }}>
          <div className="flex items-center gap-3">
            <Activity size={16} style={{ color: 'var(--color-accent-cyan)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Break AI Agents Before They Break Production.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl glass-card" style={{ border: '1px solid var(--color-border)' }}>
              <Palette size={13} className="ml-1.5 text-slate-400" />
              {[
                { id: 'executive', name: 'Executive' },
                { id: 'carbon', name: 'Carbon' },
                { id: 'cyber', name: 'Cyber' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    theme === t.id ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                 style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">SYSTEM OPERATIONAL</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
