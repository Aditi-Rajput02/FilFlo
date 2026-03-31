import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const phases = [
  {
    label: 'BRAND JOURNEY',
    tag: null,
    title: 'End-to-End FilFlo Walkthrough',
    desc: 'How a brand goes from manual Excel chaos to fully automated AI-driven inventory management',
    path: '/journey',
    buttons: [{ label: 'View', type: 'view' }],
  },
  {
    label: 'PHASE 1',
    tag: 'CORE',
    tagColor: '#22c55e',
    title: 'Inventory Dashboard',
    desc: 'Real-time stock visibility across all dark stores — Blinkit, Zepto, Instamart',
    path: '/inventory',
    buttons: [{ label: 'HLD', type: 'hld' }, { label: 'LLD', type: 'lld' }],
  },
  {
    label: 'PHASE 2',
    tag: 'CORE',
    tagColor: '#22c55e',
    title: 'Demand Prediction Engine',
    desc: 'AI forecasts demand by SKU × location × day using last 7-day sales average',
    path: '/demand',
    buttons: [{ label: 'HLD', type: 'hld' }, { label: 'LLD', type: 'lld' }],
  },
  {
    label: 'PHASE 3',
    tag: 'CORE',
    tagColor: '#22c55e',
    title: 'Replenishment Suggestions',
    desc: 'Auto-triggers reorder alerts when stock falls below threshold — no manual checking',
    path: '/replenishment',
    buttons: [{ label: 'HLD', type: 'hld' }, { label: 'LLD', type: 'lld' }],
  },
  {
    label: 'PHASE 4',
    tag: 'CORE',
    tagColor: '#22c55e',
    title: 'Purchase Order (PO) Generator',
    desc: 'Auto-creates POs: "Send 50 units of SKU-A to Store B from Warehouse C"',
    path: '/po-generator',
    buttons: [{ label: 'HLD', type: 'hld' }, { label: 'LLD', type: 'lld' }],
  },
  {
    label: 'PHASE 5',
    tag: 'FUTURE',
    tagColor: '#94a3b8',
    title: 'Multi-Platform Sync',
    desc: 'Unified inventory sync across Blinkit, Zepto, and Instamart APIs simultaneously',
    path: '/multi-platform-sync',
    buttons: [{ label: 'HLD', type: 'hld' }, { label: 'LLD', type: 'lld' }],
  },
  {
    label: 'PHASE 6',
    tag: 'FUTURE',
    tagColor: '#94a3b8',
    title: 'Autonomous Reorder Agent',
    desc: 'Fully autonomous AI agent that places orders with suppliers without human approval',
    path: '/autonomous-reorder-agent',
    buttons: [{ label: 'HLD', type: 'hld' }, { label: 'LLD', type: 'lld' }],
  },
]

const s = {
  page: { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '48px 24px' },
  hero: { marginBottom: '48px' },
  heroTitle: { fontSize: '32px', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px', lineHeight: 1.2 },
  heroDesc: { color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, maxWidth: '680px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '180px', background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  statNum: { fontSize: '28px', fontWeight: 700, color: '#6366f1', marginBottom: '4px' },
  statLabel: { fontSize: '12px', color: '#64748b', lineHeight: 1.4 },
  card: { background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px 24px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'border-color 0.2s' },
  cardLeft: { flex: 1 },
  labelRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  phaseLabel: { fontSize: '11px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em' },
  tag: { fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' },
  cardDesc: { fontSize: '13px', color: '#64748b', lineHeight: 1.5 },
  btnRow: { display: 'flex', gap: '8px', flexShrink: 0 },
  btnView: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 18px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' },
  btnHld: { background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  btnLld: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <Navbar title="Project Phases" />
      <div style={s.container}>
        <div style={s.hero}>
          <h1 style={s.heroTitle}>AI-Powered Autonomous Inventory Replenishment</h1>
          <p style={s.heroDesc}>
            FilFlo is a smart AI manager for brands selling on Blinkit, Zepto & Instamart.
            It predicts demand, detects stockouts before they happen, and auto-generates
            purchase orders — replacing 40+ hours/week of manual Excel work.
          </p>
        </div>

        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={s.statNum}>8–12%</div>
            <div style={s.statLabel}>Revenue lost annually due to stockouts</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statNum}>₹8 Cr</div>
            <div style={s.statLabel}>Working capital trapped in excess inventory</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statNum}>70%</div>
            <div style={s.statLabel}>Inventory decisions still made in Excel</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statNum}>40h+</div>
            <div style={s.statLabel}>Manual work per week per brand</div>
          </div>
        </div>

        {phases.map((phase, i) => (
          <div
            key={i}
            style={{ ...s.card, cursor: 'pointer' }}
            onClick={() => navigate(phase.path)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d3748' }}
          >
            <div style={s.cardLeft}>
              <div style={s.labelRow}>
                <span style={s.phaseLabel}>{phase.label}</span>
                {phase.tag && (
                  <span style={{
                    ...s.tag,
                    background: phase.tagColor === '#22c55e' ? '#14532d' : '#1e293b',
                    color: phase.tagColor,
                  }}>
                    {phase.tag}
                  </span>
                )}
              </div>
              <div style={s.cardTitle}>{phase.title}</div>
              <div style={s.cardDesc}>{phase.desc}</div>
            </div>
            <div style={s.btnRow}>
              {phase.buttons.map((btn, j) => {
                if (btn.type === 'view') {
                  return (
                    <button key={j} style={s.btnView}
                      onClick={e => { e.stopPropagation(); navigate(phase.path) }}>
                      View
                    </button>
                  )
                }
                if (btn.type === 'hld') {
                  return (
                    <button key={j} style={s.btnHld}
                      onClick={e => { e.stopPropagation(); navigate(phase.path) }}>
                      HLD
                    </button>
                  )
                }
                return (
                  <button key={j} style={s.btnLld}
                    onClick={e => { e.stopPropagation(); navigate(phase.path) }}>
                    LLD
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
