 
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import agentLogs from '../../../data/agent_logs.json'

// ── Constants ────────────────────────────────────────────────────────────────
const URGENCY_THRESHOLD    = 75
const CONFIDENCE_THRESHOLD = 90

const decisionColor = {
  AUTO_ORDER: '#22c55e',
  DRAFT_PO:   '#f59e0b',
  NO_ACTION:  '#64748b',
}
const decisionBg = {
  AUTO_ORDER: '#0a1f0a',
  DRAFT_PO:   '#1c1505',
  NO_ACTION:  '#1a1f2e',
}
const decisionBorder = {
  AUTO_ORDER: '#14532d',
  DRAFT_PO:   '#78350f',
  NO_ACTION:  '#2d3748',
}
const decisionLabel = {
  AUTO_ORDER: '🤖 AUTO ORDER',
  DRAFT_PO:   '⚠️ DRAFT PO',
  NO_ACTION:  '⏸️ NO ACTION',
}

const platformStyle = p =>
  p === 'Blinkit'   ? { bg: '#1c0a00', color: '#f97316', border: '#7c2d12' } :
  p === 'Zepto'     ? { bg: '#0d0a1f', color: '#8b5cf6', border: '#4c1d95' } :
                      { bg: '#0a1a0a', color: '#22c55e', border: '#14532d' }

// ── Agent simulation steps for a single run ──────────────────────────────────
function buildSteps(log) {
  const steps = [
    { id: 1, icon: '🔍', label: 'Scanning inventory…',        detail: `Checking ${log.sku_name} at ${log.store_name}`,                                    delay: 600  },
    { id: 2, icon: '📊', label: 'Fetching stock data…',       detail: `Current stock: ${log.current_stock} units · ${log.days_remaining}d cover`,          delay: 800  },
    { id: 3, icon: '🧮', label: 'Calculating urgency score…', detail: `Urgency = ${log.urgency_score}/100 (threshold: ${URGENCY_THRESHOLD})`,               delay: 900  },
    { id: 4, icon: '🏭', label: 'Evaluating supplier…',       detail: `Best supplier: ${log.supplier}`,                                                     delay: 700  },
    { id: 5, icon: '📦', label: 'Computing order quantity…',  detail: `Qty = forecast × lead_time + safety_stock − current_stock = ${log.qty_ordered} units`, delay: 800 },
    { id: 6, icon: '🏢', label: 'Selecting warehouse…',       detail: `Optimal warehouse: ${log.warehouse} (min TAT + max capacity)`,                       delay: 700  },
    { id: 7, icon: '📈', label: 'Scoring confidence…',        detail: `Confidence = ${log.confidence_score}% (threshold: ${CONFIDENCE_THRESHOLD}%)`,        delay: 900  },
    { id: 8, icon: log.decision === 'AUTO_ORDER' ? '✅' : log.decision === 'DRAFT_PO' ? '⚠️' : '⏸️',
              label: log.decision === 'AUTO_ORDER' ? 'Placing order autonomously…' : log.decision === 'DRAFT_PO' ? 'Creating draft PO for ops review…' : 'No action needed.',
              detail: log.outcome,
              delay: 1000, final: true },
  ]
  if (log.urgency_score < URGENCY_THRESHOLD) return steps.slice(0, 3).concat(steps.slice(7))
  return steps
}

// ── Summary stats ─────────────────────────────────────────────────────────────
const summary = {
  total:     agentLogs.length,
  auto:      agentLogs.filter(r => r.decision === 'AUTO_ORDER').length,
  draft:     agentLogs.filter(r => r.decision === 'DRAFT_PO').length,
  noAction:  agentLogs.filter(r => r.decision === 'NO_ACTION').length,
  totalValue: agentLogs.filter(r => r.decision !== 'NO_ACTION').reduce((a, r) => a + r.total_cost, 0),
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page:        { minHeight: '100vh', background: '#0f1117' },
  container:   { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  topRow:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  title:       { fontSize: '22px', fontWeight: 700, color: '#f1f5f9' },
  subtitle:    { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  badge:       { background: '#0d0a1f', color: '#a78bfa', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.05em', marginRight: '8px' },
  syncBadge:   { background: '#1e293b', color: '#94a3b8', fontSize: '11px', padding: '3px 10px', borderRadius: '4px' },
  statsRow:    { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '28px' },
  backBtn:     { background: 'transparent', border: '1px solid #2d3748', color: '#94a3b8', borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' },
  grid2:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' },
  panel:       { background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '12px', overflow: 'hidden' },
  panelHead:   { padding: '14px 18px', borderBottom: '1px solid #2d3748', fontSize: '13px', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  th:          { padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', background: '#151a27', borderBottom: '1px solid #2d3748' },
  td:          { padding: '10px 14px', fontSize: '12px', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ num, label, color, bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '14px 18px' }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color, marginBottom: '2px' }}>{num}</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>{label}</div>
    </div>
  )
}

// ── AgentSimulator ────────────────────────────────────────────────────────────
function AgentSimulator({ log, onDone }) {
  const [visibleSteps, setVisibleSteps] = useState([])
  const [running, setRunning]           = useState(false)
  const [done, setDone]                 = useState(false)
  const timerRef = useRef([])

  const steps = buildSteps(log)

  function runSimulation() {
    setVisibleSteps([])
    setDone(false)
    setRunning(true)
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []

    let elapsed = 0
    steps.forEach((step, idx) => {
      elapsed += step.delay
      const t = setTimeout(() => {
        setVisibleSteps(prev => [...prev, step])
        if (idx === steps.length - 1) {
          setRunning(false)
          setDone(true)
          if (onDone) onDone()
        }
      }, elapsed)
      timerRef.current.push(t)
    })
  }

  useEffect(() => { return () => timerRef.current.forEach(clearTimeout) }, [])

  const finalStep = visibleSteps.find(s => s.final)
  const decision  = log.decision

  return (
    <div style={{ background: '#0f1117', border: `1px solid ${decisionBorder[decision]}`, borderRadius: '12px', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{log.sku_name}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{log.store_name} · {log.city}</div>
        </div>
        <button
          onClick={runSimulation}
          disabled={running}
          style={{ background: running ? '#1e293b' : '#4f46e5', color: running ? '#64748b' : '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer' }}
        >
          {running ? '⏳ Running…' : done ? '▶ Run Again' : '▶ Run Agent'}
        </button>
      </div>

      {/* Input metrics */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Stock',    val: `${log.current_stock} units`, color: log.current_stock < 10 ? '#ef4444' : '#f59e0b' },
          { label: 'Days',     val: `${log.days_remaining}d`,     color: log.days_remaining < 1 ? '#ef4444' : log.days_remaining < 2 ? '#f97316' : '#f59e0b' },
          { label: 'Urgency',  val: `${log.urgency_score}/100`,   color: log.urgency_score > 90 ? '#ef4444' : log.urgency_score > 75 ? '#f59e0b' : '#64748b' },
          { label: 'Confidence', val: `${log.confidence_score}%`, color: log.confidence_score >= 90 ? '#22c55e' : '#f59e0b' },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '6px', padding: '6px 12px', fontSize: '11px' }}>
            <span style={{ color: '#64748b' }}>{m.label}: </span>
            <span style={{ color: m.color, fontWeight: 700 }}>{m.val}</span>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div style={{ minHeight: '120px' }}>
        {visibleSteps.length === 0 && !running && (
          <div style={{ color: '#475569', fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>
            Press <strong style={{ color: '#a78bfa' }}>▶ Run Agent</strong> to watch the AI think step-by-step
          </div>
        )}
        {visibleSteps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', animation: 'fadeIn 0.3s ease' }}>
            <span style={{ fontSize: '16px', minWidth: '20px' }}>{step.icon}</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: step.final ? decisionColor[decision] : '#e2e8f0' }}>{step.label}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{step.detail}</div>
            </div>
          </div>
        ))}
        {running && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa', animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: '11px', color: '#64748b' }}>Agent thinking…</span>
          </div>
        )}
      </div>

      {/* Final decision badge */}
      {finalStep && (
        <div style={{ marginTop: '12px', padding: '10px 14px', background: decisionBg[decision], border: `1px solid ${decisionBorder[decision]}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: decisionColor[decision] }}>{decisionLabel[decision]}</span>
          {log.qty_ordered > 0 && (
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{log.qty_ordered} units · ₹{log.total_cost.toLocaleString()}</span>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AutonomousAgentDemo() {
  const navigate = useNavigate()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selectedLog = agentLogs[selectedIdx]

  return (
    <div style={s.page}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <Navbar title="Phase 6 — Autonomous Reorder Agent · Demo" />
      <div style={s.container}>

        {/* Top Row */}
        <div style={s.topRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={s.badge}>PHASE 6 · AGENT</span>
              <span style={s.syncBadge}>🤖 Cycle: March 31, 2026 — 09:00 AM · Every 15 min</span>
            </div>
            <div style={s.title}>Autonomous Reorder Agent</div>
            <div style={s.subtitle}>Watch the AI agent think, decide, and act — step by step, in real time</div>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/autonomous-reorder-agent')}>← Back to Phase 6</button>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          <StatCard num={summary.total}    label="SKUs Scanned"          color="#a78bfa" bg="#0d0a1f"  border="#4c1d95" />
          <StatCard num={summary.auto}     label="🤖 Auto-Ordered"       color="#22c55e" bg="#0a1f0a"  border="#14532d" />
          <StatCard num={summary.draft}    label="⚠️ Draft PO (Human)"   color="#f59e0b" bg="#1c1505"  border="#78350f" />
          <StatCard num={summary.noAction} label="⏸️ No Action Needed"   color="#64748b" bg="#1a1f2e"  border="#2d3748" />
          <StatCard num={`₹${summary.totalValue.toLocaleString()}`} label="💰 Total Value Ordered" color="#f97316" bg="#1c0a00" border="#7c2d12" />
        </div>

        {/* Two-column layout: selector + simulator */}
        <div style={s.grid2}>

          {/* Left: SKU selector list */}
          <div style={s.panel}>
            <div style={s.panelHead}>
              <span>📋</span> Agent Run Log — {agentLogs.length} SKUs scanned
            </div>
            <div style={{ overflowY: 'auto', maxHeight: '520px' }}>
              {agentLogs.map((log, i) => {
                const ps = platformStyle(log.platform)
                const isSelected = i === selectedIdx
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedIdx(i)}
                    style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #1e293b', background: isSelected ? '#0d0a1f' : 'transparent', borderLeft: isSelected ? '3px solid #a78bfa' : '3px solid transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>{log.sku_name}</span>
                      <span style={{ background: decisionBg[log.decision], color: decisionColor[log.decision], border: `1px solid ${decisionBorder[log.decision]}`, borderRadius: '4px', padding: '1px 6px', fontSize: '10px', fontWeight: 700 }}>
                        {decisionLabel[log.decision]}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, borderRadius: '3px', padding: '1px 5px', fontSize: '10px', fontWeight: 600 }}>{log.platform}</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{log.store_name}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>
                      Urgency: <span style={{ color: log.urgency_score > 90 ? '#ef4444' : log.urgency_score > 75 ? '#f59e0b' : '#64748b', fontWeight: 600 }}>{log.urgency_score}</span>
                      {' · '}Confidence: <span style={{ color: log.confidence_score >= 90 ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>{log.confidence_score}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Agent simulator */}
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', fontWeight: 600 }}>
              🤖 AGENT SIMULATION — {selectedLog.run_id}
            </div>
            <AgentSimulator key={selectedIdx} log={selectedLog} />

            {/* Decision detail card */}
            <div style={{ ...s.panel, marginTop: '16px' }}>
              <div style={s.panelHead}><span>📝</span> Decision Details</div>
              <table style={s.table}>
                <tbody>
                  {[
                    ['Run ID',       selectedLog.run_id],
                    ['Timestamp',    new Date(selectedLog.timestamp).toLocaleString('en-IN')],
                    ['Supplier',     selectedLog.supplier],
                    ['Warehouse',    selectedLog.warehouse],
                    ['Qty Ordered',  selectedLog.qty_ordered > 0 ? `${selectedLog.qty_ordered} units` : '—'],
                    ['Total Cost',   selectedLog.total_cost > 0 ? `₹${selectedLog.total_cost.toLocaleString()}` : '—'],
                    ['Delivery ETA', selectedLog.delivery_eta ? new Date(selectedLog.delivery_eta).toLocaleString('en-IN') : '—'],
                    ['Human Involved', selectedLog.human_involved ? '👤 Yes — Ops approval needed' : '🤖 No — Fully autonomous'],
                    ['Reason',       selectedLog.reason],
                  ].map(([k, v], i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#1a1f2e' : '#161b28' }}>
                      <td style={{ ...s.td, color: '#64748b', fontWeight: 600, width: '140px' }}>{k}</td>
                      <td style={{ ...s.td, color: k === 'Human Involved' ? (selectedLog.human_involved ? '#f59e0b' : '#22c55e') : '#e2e8f0' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#475569', textAlign: 'right' }}>
          Data from <code style={{ color: '#a78bfa' }}>agent_logs.json</code> · Agent runs every 15 minutes
        </div>
      </div>
    </div>
  )
}
