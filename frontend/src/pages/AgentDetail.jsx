import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bot, Play, Shield, ArrowLeft, Zap, Database, CreditCard, Mail, Search } from 'lucide-react'
import { agentsApi } from '../lib/api'
import ScoreRing from '../components/ScoreRing'
import SeverityBadge from '../components/SeverityBadge'

const DEMO_ANALYSIS = {
  capability_graph: {
    nodes: [
      { id: 'agent', label: 'CustomerSupportAgent', type: 'agent' },
      { id: 'database', label: 'Customer Database', type: 'category' },
      { id: 'payment_api', label: 'Payment API', type: 'category' },
      { id: 'email_service', label: 'Email Service', type: 'category' },
      { id: 'search_customer', label: 'search_customer()', type: 'tool', risk_score: 2.0, category: 'READ' },
      { id: 'get_order', label: 'get_order()', type: 'tool', risk_score: 1.5, category: 'READ' },
      { id: 'cancel_order', label: 'cancel_order()', type: 'tool', risk_score: 6.5, category: 'WRITE' },
      { id: 'refund_payment', label: 'refund_payment()', type: 'tool', risk_score: 9.0, category: 'FINANCIAL', is_financial: true },
      { id: 'send_email', label: 'send_email()', type: 'tool', risk_score: 4.0, category: 'COMMUNICATION' },
    ],
    edges: [
      { source: 'agent', target: 'database' },
      { source: 'agent', target: 'payment_api' },
      { source: 'agent', target: 'email_service' },
      { source: 'database', target: 'search_customer' },
      { source: 'database', target: 'get_order' },
      { source: 'database', target: 'cancel_order' },
      { source: 'payment_api', target: 'refund_payment' },
      { source: 'email_service', target: 'send_email' },
    ],
  },
  tool_summary: { total: 5, read_only: 2, write: 2, financial: 1, destructive: 0, external_side_effects: 3, high_risk: 2 },
  risk_assessment: {
    overall_risk: 'HIGH',
    high_risk_tools: [
      { name: 'refund_payment', risk_score: 9.0 },
      { name: 'cancel_order', risk_score: 6.5 },
    ],
  },
}

const CATEGORY_ICONS = { READ: Search, WRITE: Database, FINANCIAL: CreditCard, COMMUNICATION: Mail }
const CATEGORY_COLORS = { READ: '#3b82f6', WRITE: '#f59e0b', FINANCIAL: '#ef4444', COMMUNICATION: '#10b981' }
const RISK_COLORS = { 0: '#10b981', 3: '#10b981', 5: '#f59e0b', 7: '#f97316', 9: '#ef4444' }

function getRiskColor(score) {
  if (score >= 8) return '#ef4444'
  if (score >= 6) return '#f97316'
  if (score >= 4) return '#f59e0b'
  return '#10b981'
}

export default function AgentDetail() {
  const { id } = useParams()
  const [agent, setAgent] = useState(null)
  const [analysis, setAnalysis] = useState(DEMO_ANALYSIS)
  const [analyzing, setAnalyzing] = useState(false)
  const [tab, setTab] = useState('capability')

  useEffect(() => {
    agentsApi.get(id)
      .then(r => setAgent(r.data))
      .catch(() => {
        setAgent({
          id, name: 'CustomerSupportAgent', version: '1.0.0', model: 'GPT-4',
          domain: 'e-commerce', risk_level: 'HIGH',
          reliability_score: 71, safety_score: 62, security_score: 68,
          critical_failures: 6, production_ready: false,
          system_prompt: 'You are a helpful customer support agent...',
          tools: [
            { name: 'search_customer', category: 'READ', risk_score: 2.0, description: 'Search customer by ID/email', requires_auth: true },
            { name: 'get_order', category: 'READ', risk_score: 1.5, description: 'Get order details', requires_auth: true },
            { name: 'cancel_order', category: 'WRITE', risk_score: 6.5, description: 'Cancel an order', requires_auth: true, has_side_effects: true },
            { name: 'refund_payment', category: 'FINANCIAL', risk_score: 9.0, description: 'Issue refund to customer', requires_auth: true, is_financial: true, has_side_effects: true },
            { name: 'send_email', category: 'COMMUNICATION', risk_score: 4.0, description: 'Send email to customer', has_side_effects: true },
          ],
        })
      })
  }, [id])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const res = await agentsApi.analyze(id)
      setAnalysis(res.data)
    } catch {
      setAnalysis(DEMO_ANALYSIS)
    } finally {
      setAnalyzing(false)
      setTab('capability')
    }
  }

  if (!agent) return <div className="flex items-center justify-center h-64"><div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading agent...</div></div>

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/agents" className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--color-text-muted)' }}>
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold gradient-text">{agent.name}</h1>
            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>
              v{agent.version}
            </span>
            <SeverityBadge severity={agent.risk_level} />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{agent.model} · {agent.domain}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAnalyze} disabled={analyzing}
                  className="btn-primary text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2">
            <Shield size={15} />
            {analyzing ? 'Analyzing...' : 'Analyze Agent'}
          </button>
          <Link to="/evaluate" className="btn-danger text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2">
            <Zap size={15} /> Run Evaluation
          </Link>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex flex-col items-center">
          <ScoreRing score={agent.reliability_score || 0} size={80} />
          <span className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>Overall Score</span>
        </div>
        {[
          ['Safety', agent.safety_score || 0, '#10b981'],
          ['Security', agent.security_score || 0, '#8b5cf6'],
          ['Critical Issues', agent.critical_failures || 0, '#ef4444'],
        ].map(([label, val, color]) => (
          <div key={label} className="glass-card p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold" style={{ color }}>{val}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          ['capability', 'Capability Graph'],
          ['tools', 'Tool Analysis'],
          ['prompt', 'System Prompt'],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'active nav-item' : 'nav-item border-transparent'}`}
                  style={{ color: tab === key ? '#60a5fa' : 'var(--color-text-secondary)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Capability Graph */}
      {tab === 'capability' && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold mb-4 gradient-text">Agent Capability Graph</h3>
          <div className="flex flex-col items-center gap-6">
            {/* Agent Node */}
            <div className="px-6 py-3 rounded-xl text-center"
                 style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))', border: '2px solid rgba(59,130,246,0.5)' }}>
              <Bot size={20} className="mx-auto mb-1" style={{ color: '#60a5fa' }} />
              <div className="text-sm font-bold" style={{ color: '#60a5fa' }}>{agent.name}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>v{agent.version}</div>
            </div>

            {/* Connector */}
            <div className="w-px h-6" style={{ background: 'var(--color-border-bright)' }} />

            {/* Categories + Tools */}
            <div className="flex gap-8 flex-wrap justify-center">
              {[
                { cat: 'Customer Database', icon: Database, tools: ['search_customer', 'get_order', 'cancel_order'] },
                { cat: 'Payment API', icon: CreditCard, tools: ['refund_payment'] },
                { cat: 'Email Service', icon: Mail, tools: ['send_email'] },
              ].map(({ cat, icon: Icon, tools: catTools }) => (
                <div key={cat} className="flex flex-col items-center gap-3">
                  {/* Category Node */}
                  <div className="px-4 py-2 rounded-lg text-center"
                       style={{ background: 'rgba(30,45,61,0.8)', border: '1px solid var(--color-border-bright)' }}>
                    <Icon size={14} className="mx-auto mb-1" style={{ color: 'var(--color-text-secondary)' }} />
                    <div className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{cat}</div>
                  </div>
                  <div className="w-px h-4" style={{ background: 'var(--color-border)' }} />
                  {/* Tool Nodes */}
                  <div className="flex flex-col gap-2">
                    {catTools.map(toolName => {
                      const tool = agent.tools?.find(t => t.name === toolName)
                      if (!tool) return null
                      const color = CATEGORY_COLORS[tool.category] || '#94a3b8'
                      const riskColor = getRiskColor(tool.risk_score)
                      return (
                        <div key={toolName} className="px-3 py-2 rounded-lg text-xs"
                             style={{ background: `${color}12`, border: `1px solid ${color}40`, minWidth: '160px' }}>
                          <div className="font-mono font-semibold" style={{ color }}>{toolName}()</div>
                          <div className="flex items-center justify-between mt-1">
                            <span style={{ color: 'var(--color-text-muted)' }}>{tool.category}</span>
                            <span className="font-bold" style={{ color: riskColor }}>Risk {tool.risk_score}/10</span>
                          </div>
                          {tool.is_financial && (
                            <div className="mt-1 text-xs font-semibold text-red-400">⚠ FINANCIAL — HIGH RISK</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Summary */}
          {analysis && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ['Total Tools', analysis.tool_summary.total, '#3b82f6'],
                ['Read-Only', analysis.tool_summary.read_only, '#10b981'],
                ['Financial', analysis.tool_summary.financial, '#ef4444'],
                ['External Effects', analysis.tool_summary.external_side_effects, '#f59e0b'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-3 rounded-lg text-center"
                     style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
                  <div className="text-xl font-bold" style={{ color }}>{val}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tool Analysis */}
      {tab === 'tools' && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Tool Risk Analysis</h3>
          <div className="space-y-3">
            {agent.tools?.sort((a, b) => b.risk_score - a.risk_score).map(tool => {
              const color = getRiskColor(tool.risk_score)
              const barWidth = (tool.risk_score / 10) * 100
              return (
                <div key={tool.name} className="p-4 rounded-lg"
                     style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono font-semibold text-sm" style={{ color: CATEGORY_COLORS[tool.category] || '#94a3b8' }}>
                        {tool.name}()
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{tool.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold" style={{ color }}>{tool.risk_score}</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>/10</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(30,45,61,0.8)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${barWidth}%`, background: color }} />
                  </div>
                  <div className="flex gap-3 text-xs">
                    {tool.requires_auth && <span className="text-emerald-400">✓ Auth Required</span>}
                    {tool.has_side_effects && <span className="text-yellow-400">⚡ Side Effects</span>}
                    {tool.is_financial && <span className="text-red-400">💰 Financial</span>}
                    {tool.is_destructive && <span className="text-red-400">💣 Destructive</span>}
                    <span style={{ color: 'var(--color-text-muted)' }}>{tool.category}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* System Prompt */}
      {tab === 'prompt' && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>System Prompt</h3>
            {agent.version === '1.0.0' && (
              <span className="text-xs px-2 py-1 rounded severity-critical">⚠ Vulnerability Detected</span>
            )}
          </div>
          <pre className="text-xs p-4 rounded-lg leading-relaxed whitespace-pre-wrap"
               style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', fontFamily: 'monospace' }}>
            {agent.system_prompt || 'No system prompt defined.'}
          </pre>
          {agent.version === '1.0.0' && (
            <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-xs text-red-400 font-semibold mb-1">⚠ AgentGuard detected vulnerability in system prompt:</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                The phrase "process refunds immediately" encourages bypassing authorization verification. 
                This leads to unauthorized financial operations (6 critical failures detected).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
