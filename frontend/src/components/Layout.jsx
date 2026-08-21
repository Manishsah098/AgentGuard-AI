import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Bot, Play, GitCompare,
  FileText, GitBranch, Activity, ChevronLeft, ChevronRight,
  Zap, Wrench, Search
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/agents', label: 'Agent Registry', icon: Bot },
  { path: '/evaluate', label: 'Run Evaluation', icon: Play },
  { path: '/root-cause', label: 'Root Cause (Step 5)', icon: Search, accent: '#dc2626' },
  { path: '/fix-engine', label: 'Fix Engine (Step 6)', icon: Wrench, accent: '#ea580c' },
  { path: '/regression', label: 'Regression (Step 7)', icon: GitCompare, accent: '#059669' },
  { path: '/ci-gate', label: 'CI/CD Gate', icon: GitBranch },
  { path: '/reports', label: 'Reports', icon: FileText },
]

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-grid transition-colors duration-300" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300 shadow-sm"
        style={{
          width: collapsed ? '64px' : '240px',
          background: 'var(--color-bg-card)',
          borderRight: '1px solid var(--color-border)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 shadow-sm"
               style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
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
            const activeColor = accent || '#2563eb'
            return (
              <Link
                key={path}
                to={path}
                className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                  isActive ? 'active font-bold' : 'border-transparent font-medium'
                }`}
                style={{
                  color: isActive ? activeColor : 'var(--color-text-secondary)',
                  borderColor: isActive ? `${activeColor}30` : 'transparent',
                  background: isActive ? `${activeColor}12` : 'transparent',
                }}
                title={collapsed ? label : ''}
              >
                <Icon size={17} className="flex-shrink-0" style={{ color: isActive ? activeColor : undefined }} />
                {!collapsed && <span className="text-sm">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Demo Mode Badge */}
        {!collapsed && (
          <div className="m-3 p-3 rounded-xl glass-card" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)' }}>
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
          className="flex items-center justify-center p-3 border-t transition-colors hover:bg-black/5"
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
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 shadow-xs"
          style={{
            background: 'var(--color-bg-card)',
            borderBottom: '1px solid var(--color-border)',
            backdropFilter: 'blur(20px)',
          }}>
          <div className="flex items-center gap-3">
            <Activity size={16} style={{ color: 'var(--color-accent-cyan)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Break AI Agents Before They Break Production.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                 style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">SYSTEM OPERATIONAL</span>
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
