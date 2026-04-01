import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

// ── All routes in the app ────────────────────────────────────────────────────
const sections = [
  {
    group: '🏠 Core Navigation',
    color: '#6366f1',
    border: '#4f46e5',
    bg: '#0d0d1f',
    items: [
      {
        label: 'Home',
        path: '/',
        icon: '🏠',
        desc: 'Project overview — all 6 phases listed with HLD/LLD links',
        tag: 'ENTRY POINT',
        tagColor: '#6366f1',
        tagBg: '#1e1b4b',
      },
      {
        label: 'Brand Journey',
        path: '/journey',
        icon: '🗺️',
        desc: 'End-to-end FilFlo walkthrough — how a brand goes from Excel chaos to AI automation',
        tag: 'STORY',
        tagColor: '#a78bfa',
        tagBg: '#1e1b4b',
      },
    ],
  },
  {
    group: '📦 Phase 1 — Inventory Dashboard',
    color: '#22c55e',
    border: '#16a34a',
    bg: '#0a1f0a',
    items: [
      {
        label: 'Inventory Dashboard',
        path: '/inventory',
        icon: '📦',
        desc: 'Real-time stock visibility across all dark stores — Blinkit, Zepto, Instamart. HLD + LLD diagrams.',
        tag: 'PHASE 1 · CORE',
        tagColor: '#22c55e',
        tagBg: '#14532d',
      },
      {
        label: 'Inventory Demo',
        path: '/demo/inventory',
        icon: '🎮',
        desc: 'Live interactive demo — filter by platform, city, store. See stock levels, days of cover, status badges.',
        tag: 'DEMO',
        tagColor: '#4ade80',
        tagBg: '#052e16',
      },
    ],
  },
  {
    group: '📈 Phase 2 — Demand Prediction',
    color: '#3b82f6',
    border: '#2563eb',
    bg: '#0a0f1f',
    items: [
      {
        label: 'Demand Prediction Engine',
        path: '/demand',
        icon: '📈',
        desc: 'AI forecasts demand by SKU × location × day using 7-day sales average. HLD + LLD diagrams.',
        tag: 'PHASE 2 · CORE',
        tagColor: '#3b82f6',
        tagBg: '#1e3a5f',
      },
      {
        label: 'Demand Prediction Demo',
        path: '/demo/demand',
        icon: '🎮',
        desc: 'Live demo — browse forecasts by SKU, see predicted vs actual demand, confidence scores.',
        tag: 'DEMO',
        tagColor: '#60a5fa',
        tagBg: '#0c1a2e',
      },
    ],
  },
  {
    group: '🔄 Phase 3 — Replenishment Suggestions',
    color: '#f59e0b',
    border: '#d97706',
    bg: '#1c1505',
    items: [
      {
        label: 'Replenishment Suggestions',
        path: '/replenishment',
        icon: '🔄',
        desc: 'Auto-triggers reorder alerts when stock falls below threshold. HLD + LLD diagrams.',
        tag: 'PHASE 3 · CORE',
        tagColor: '#f59e0b',
        tagBg: '#451a03',
      },
      {
        label: 'Replenishment Demo',
        path: '/demo/replenishment',
        icon: '🎮',
        desc: 'Live demo — see all replenishment suggestions, urgency levels, recommended order quantities.',
        tag: 'DEMO',
        tagColor: '#fbbf24',
        tagBg: '#1c1505',
      },
    ],
  },
  {
    group: '🧾 Phase 4 — PO Generator',
    color: '#ec4899',
    border: '#be185d',
    bg: '#1a0510',
    items: [
      {
        label: 'Purchase Order Generator',
        path: '/po-generator',
        icon: '🧾',
        desc: 'Auto-creates POs: "Send 50 units of SKU-A to Store B from Warehouse C". HLD + LLD.',
        tag: 'PHASE 4 · CORE',
        tagColor: '#ec4899',
        tagBg: '#500724',
      },
      {
        label: 'PO Generator Demo',
        path: '/demo/po-generator',
        icon: '🎮',
        desc: 'Live demo — browse all generated purchase orders, filter by status, supplier, platform.',
        tag: 'DEMO',
        tagColor: '#f472b6',
        tagBg: '#1a0510',
      },
    ],
  },
  {
    group: '🔗 Phase 5 — Multi-Platform Sync',
    color: '#06b6d4',
    border: '#0891b2',
    bg: '#0a1a1f',
    items: [
      {
        label: 'Multi-Platform Sync',
        path: '/multi-platform-sync',
        icon: '🔗',
        desc: 'Unified inventory sync across Blinkit, Zepto, and Instamart APIs simultaneously. HLD + LLD.',
        tag: 'PHASE 5 · FUTURE',
        tagColor: '#06b6d4',
        tagBg: '#083344',
      },
      {
        label: 'Multi-Platform Sync Demo',
        path: '/demo/multi-platform-sync',
        icon: '🎮',
        desc: 'Live demo — watch real-time sync events across platforms, see conflict resolution, API status.',
        tag: 'DEMO',
        tagColor: '#22d3ee',
        tagBg: '#0a1a1f',
      },
    ],
  },
  {
    group: '🤖 Phase 6 — Autonomous Reorder Agent',
    color: '#a78bfa',
    border: '#7c3aed',
    bg: '#0d0a1f',
    items: [
      {
        label: 'Autonomous Reorder Agent',
        path: '/autonomous-reorder-agent',
        icon: '🤖',
        desc: 'Fully autonomous AI agent that places orders with suppliers without human approval. HLD + LLD.',
        tag: 'PHASE 6 · FUTURE',
        tagColor: '#a78bfa',
        tagBg: '#2e1065',
      },
      {
        label: 'Autonomous Agent Demo',
        path: '/demo/autonomous-agent',
        icon: '🎮',
        desc: 'Live demo — pick any SKU, press ▶ Run Agent, watch it think step-by-step and decide autonomously.',
        tag: 'DEMO',
        tagColor: '#c4b5fd',
        tagBg: '#1e1040',
      },
    ],
  },
]

const stats = [
  { num: '14',   label: 'Total Routes',         color: '#6366f1' },
  { num: '6',    label: 'Product Phases',        color: '#22c55e' },
  { num: '6',    label: 'Live Interactive Demos', color: '#f59e0b' },
  { num: '12',   label: 'HLD + LLD Diagrams',    color: '#3b82f6' },
  { num: '10+',  label: 'JSON Data Files',        color: '#ec4899' },
  { num: '100%', label: 'Build Success',          color: '#a78bfa' },
]

const s = {
  page:      { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' },
  topRow:    { marginBottom: '32px' },
  badge:     { display: 'inline-block', background: '#1e293b', color: '#94a3b8', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', marginBottom: '10px', letterSpacing: '0.05em' },
  title:     { fontSize: '28px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' },
  subtitle:  { fontSize: '14px', color: '#64748b', lineHeight: 1.6 },
  statsRow:  { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '36px' },
  statCard:  { background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '10px', padding: '14px 12px', textAlign: 'center' },
  statNum:   { fontSize: '20px', fontWeight: 700, marginBottom: '4px' },
  statLabel: { fontSize: '10px', color: '#64748b', lineHeight: 1.4 },
  section:   { marginBottom: '28px' },
  groupHead: { fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '8px' },
  card:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', border: '1px solid', gap: '12px', transition: 'opacity 0.15s' },
  cardLeft:  { flex: 1 },
  cardIcon:  { fontSize: '20px', minWidth: '28px' },
  cardLabel: { fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '3px' },
  cardDesc:  { fontSize: '12px', color: '#64748b', lineHeight: 1.5 },
  tag:       { fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.04em', whiteSpace: 'nowrap' },
  visitBtn:  { background: '#1e293b', color: '#94a3b8', border: '1px solid #2d3748', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  footer:    { marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' },
}

export default function SiteOverview() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <Navbar title="Site Overview" />
      <div style={s.container}>

        {/* Header */}
        <div style={s.topRow}>
          <div style={s.badge}>SITE MAP · ALL ROUTES</div>
          <div style={s.title}>FilFlo — Complete Site Overview</div>
          <div style={s.subtitle}>
            Every page, feature, and demo in one place. Click any card to navigate directly.
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {stats.map((st, i) => (
            <div key={i} style={s.statCard}>
              <div style={{ ...s.statNum, color: st.color }}>{st.num}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        {sections.map((sec, si) => (
          <div key={si} style={s.section}>
            <div style={s.groupHead}>
              <span style={{ color: sec.color }}>{sec.group}</span>
            </div>
            {sec.items.map((item, ii) => (
              <div
                key={ii}
                style={{ ...s.card, background: sec.bg, borderColor: sec.border }}
                onClick={() => navigate(item.path)}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                <span style={s.cardIcon}>{item.icon}</span>
                <div style={s.cardLeft}>
                  <div style={s.cardLabel}>{item.label}</div>
                  <div style={s.cardDesc}>{item.desc}</div>
                </div>
                <span style={{ ...s.tag, background: item.tagBg, color: item.tagColor }}>
                  {item.tag}
                </span>
                <button
                  style={s.visitBtn}
                  onClick={e => { e.stopPropagation(); navigate(item.path) }}
                >
                  Visit →
                </button>
              </div>
            ))}
          </div>
        ))}

        {/* Footer */}
        <div style={s.footer}>
          <span style={{ fontSize: '12px', color: '#475569' }}>
            FilFlo · AI-Powered Autonomous Inventory Replenishment · 6 Phases · 14 Routes
          </span>
          <button
            style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
