import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Plus, Shield, AlertTriangle, CheckCircle, ChevronRight, Search } from 'lucide-react'
import { agentsApi } from '../lib/api'
import ScoreRing from '../components/ScoreRing'
import SeverityBadge from '../components/SeverityBadge'

const DEMO_AGENTS = [
  {
    id: 'demo-agent-v1-0000-0000-000000000001',
    name: 'CustomerSupportAgent', version: '1.0.0', model: 'GPT-4',
    domain: 'e-commerce', risk_level: 'HIGH', description: 'AI customer support agent with intentional vulnerabilities for AgentGuard demo.',
    reliability_score: 71, safety_score: 62, security_score: 68,
    test_count: 150, critical_failures: 6, production_ready: false,
    tools: [
      { name: 'search_customer', category: 'READ', risk_score: 2.0 },
      { name: 'get_order', category: 'READ', risk_score: 1.5 },
      { name: 'cancel_order', category: 'WRITE', risk_score: 6.5 },
      { name: 'refund_payment', category: 'FINANCIAL', risk_score: 9.0, is_financial: true },
      { name: 'send_email', category: 'COMMUNICATION', risk_score: 4.0 },
    ],
    tags: ['customer-support', 'e-commerce', 'demo'],
  },
  {
    id: 'demo-agent-v1-1000-0000-000000000002',
    name: 'CustomerSupportAgent', version: '1.1.0', model: 'GPT-4',
    domain: 'e-commerce', risk_level: 'MEDIUM', description: 'Improved version with authorization checks, rate limiting, and prompt injection resistance.',
    reliability_score: 91, safety_score: 89, security_score: 92,
    test_count: 150, critical_failures: 1, production_ready: true,
    tools: [
      { name: 'search_customer', category: 'READ', risk_score: 2.0 },
      { name: 'get_order', category: 'READ', risk_score: 1.5 },
      { name: 'cancel_order', category: 'WRITE', risk_score: 6.5 },
      { name: 'refund_payment', category: 'FINANCIAL', risk_score: 9.0, is_financial: true },
      { name: 'send_email', category: 'COMMUNICATION', risk_score: 4.0 },
    ],
    tags: ['customer-support', 'e-commerce', 'demo', 'improved'],
  },
]

export default function Agents() {
  const [agents, setAgents] = useState(DEMO_AGENTS)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    agentsApi.list().then(r => setAgents(r.data)).catch(() => {})
  }, [])

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.domain?.toLowerCase().includes(search.toLowerCase())
  )

  const TOOL_COLORS = { READ: '#3b82f6', WRITE: '#f59e0b', FINANCIAL: '#ef4444', COMMUNICATION: '#10b981', DESTRUCTIVE: '#ef4444', EXTERNAL: '#8b5cf6' }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold gradient-text">Agent Registry</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {agents.length} registered agents · Register and manage AI agents for evaluation
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={15} /> Register Agent
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          placeholder="Search agents by name or domain..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>

      {/* Register Form */}
      {showForm && <RegisterForm onClose={() => setShowForm(false)} onSaved={(a) => setAgents(prev => [...prev, a])} />}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map(agent => (
          <Link key={agent.id} to={`/agents/${agent.id}`} className="glass-card block metric-card p-5"
                style={{ border: agent.production_ready ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.2)' }}>
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <Bot size={18} style={{ color: '#60a5fa' }} />
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{agent.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>
                      v{agent.version}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{agent.model} · {agent.domain}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-bold px-2 py-1 rounded ${agent.production_ready ? 'text-emerald-400' : 'text-red-400'}`}
                     style={{ background: agent.production_ready ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                  {agent.production_ready ? '✓ PROD READY' : '✕ NOT READY'}
                </div>
                <SeverityBadge severity={agent.risk_level} small className="mt-1" />
              </div>
            </div>

            <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {agent.description}
            </p>

            {/* Score Row */}
            <div className="flex items-center justify-between mb-4">
              <ScoreRing score={agent.reliability_score || 0} size={70} />
              <div className="flex-1 ml-4 grid grid-cols-3 gap-2">
                {[
                  ['Safety', agent.safety_score, '#10b981'],
                  ['Security', agent.security_score, '#8b5cf6'],
                  ['Tests', agent.test_count, '#3b82f6'],
                ].map(([label, val, color]) => (
                  <div key={label} className="text-center">
                    <div className="text-lg font-bold" style={{ color }}>{val || 0}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
              {agent.critical_failures > 0 && (
                <div className="text-center ml-2 p-2 rounded-lg severity-critical">
                  <div className="text-xl font-bold text-red-400">{agent.critical_failures}</div>
                  <div className="text-xs text-red-400">Critical</div>
                </div>
              )}
            </div>

            {/* Tools */}
            <div className="flex flex-wrap gap-2 mb-3">
              {agent.tools?.slice(0, 5).map(tool => (
                <span key={tool.name} className="text-xs px-2 py-1 rounded-full font-mono"
                      style={{
                        background: `${TOOL_COLORS[tool.category] || '#475569'}15`,
                        color: TOOL_COLORS[tool.category] || '#94a3b8',
                        border: `1px solid ${TOOL_COLORS[tool.category] || '#475569'}30`,
                      }}>
                  {tool.name}()
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div className="flex gap-2">
                {agent.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded"
                        style={{ background: 'rgba(30,45,61,0.8)', color: 'var(--color-text-muted)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-accent-cyan)' }}>
                View Analysis <ChevronRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function RegisterForm({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '', description: '', version: '1.0.0', model: 'gpt-4',
    system_prompt: '', domain: 'general', risk_level: 'MEDIUM',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await agentsApi.create({ ...form, tools: [] })
      onSaved(res.data)
      onClose()
    } catch {
      alert('Failed to save agent (backend may not be running)')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass-card p-5" style={{ border: '1px solid rgba(59,130,246,0.3)' }}>
      <h3 className="text-sm font-bold mb-4 gradient-text">Register New Agent</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {[
          ['name', 'Agent Name', 'text', 'MyAgent'],
          ['version', 'Version', 'text', '1.0.0'],
          ['model', 'Model', 'text', 'gpt-4'],
          ['domain', 'Domain', 'text', 'e-commerce'],
        ].map(([key, label, type, placeholder]) => (
          <div key={key}>
            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>
            <input type={type} placeholder={placeholder} value={form[key]}
                   onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                   className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                   style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          </div>
        ))}
        <div className="col-span-2">
          <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Description</label>
          <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                 className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                 style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>System Prompt</label>
          <textarea value={form.system_prompt} onChange={e => setForm(p => ({ ...p, system_prompt: e.target.value }))}
                    rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                    style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
        </div>
        <div className="col-span-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm"
                  style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary text-white text-sm px-4 py-2 rounded-lg">
            {saving ? 'Saving...' : 'Register Agent'}
          </button>
        </div>
      </form>
    </div>
  )
}
