import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MermaidDiagram from '../components/MermaidDiagram'

const hldDiagram = `flowchart LR
    A["🛒 Blinkit\nSeller API"] --> D["🔄 FilFlo\nUnified Sync Layer"]
    B["⚡ Zepto\nSeller API"] --> D
    C["🛍️ Instamart\nSeller API"] --> D
    D --> E["📦 Unified\nInventory DB"]
    E --> F["🖥️ Single Dashboard\nAll Platforms"]
    E --> G["🤖 AI Engine\n(Demand + Replenishment)"]
    G --> H["📋 Cross-Platform\nPO Generator"]

    style A fill:#f97316,color:#fff,stroke:#ea580c
    style B fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style C fill:#22c55e,color:#fff,stroke:#16a34a
    style D fill:#6366f1,color:#fff,stroke:#4f46e5
    style E fill:#1e293b,color:#e2e8f0,stroke:#4f46e5
    style F fill:#3b82f6,color:#fff,stroke:#2563eb
    style G fill:#06b6d4,color:#fff,stroke:#0891b2
    style H fill:#f97316,color:#fff,stroke:#ea580c
`

const lldDiagram = `flowchart TD
    A["Cron: Every 30 min"] --> B["Parallel API calls:\nBlinkit + Zepto + Instamart"]
    B --> C["Normalize responses\nto unified schema"]
    C --> D["platform_id, sku_id,\nstore_id, qty, timestamp"]
    D --> E["Conflict resolution:\nlatest timestamp wins"]
    E --> F["Upsert into\nunified_inventory table"]
    F --> G["Compute cross-platform\nstock totals per SKU"]
    G --> H["Detect imbalance:\nOverstock on Zepto,\nUnderstock on Blinkit"]
    H --> I["Suggest inter-platform\nstock rebalancing"]

    style A fill:#6366f1,color:#fff,stroke:#4f46e5
    style B fill:#3b82f6,color:#fff,stroke:#2563eb
    style E fill:#f59e0b,color:#fff,stroke:#d97706
    style H fill:#ef4444,color:#fff,stroke:#dc2626
    style I fill:#22c55e,color:#fff,stroke:#16a34a
`

const features = [
  { icon: '🔄', title: 'Unified Sync Every 30 Min', desc: 'Pulls stock data from Blinkit, Zepto, and Instamart simultaneously every 30 minutes into one unified database.' },
  { icon: '⚖️', title: 'Cross-Platform Rebalancing', desc: 'Detects when one platform is overstocked while another is understocked — and suggests rebalancing moves.' },
  { icon: '🗂️', title: 'Single Source of Truth', desc: 'One dashboard shows all platforms. No switching between 3 different seller portals. Everything in one place.' },
  { icon: '🔧', title: 'Schema Normalization', desc: 'Each platform has different API formats. FilFlo normalizes everything into a unified schema automatically.' },
]

const s = {
  page: { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '48px 24px' },
  title: { fontSize: '26px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' },
  badge: { display: 'inline-block', background: '#1e293b', color: '#94a3b8', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', marginBottom: '12px', letterSpacing: '0.05em' },
  section: { marginBottom: '48px' },
  sectionTitle: { fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  featureCard: { background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  featureIcon: { fontSize: '24px', marginBottom: '10px' },
  featureTitle: { fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' },
  featureDesc: { fontSize: '13px', color: '#64748b', lineHeight: 1.6 },
}

export default function MultiPlatformSync() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <Navbar title="Phase 5 — Multi-Platform Sync" />
      <div style={s.container}>
        <div style={s.badge}>PHASE 5 · FUTURE</div>
        <h1 style={s.title}>Multi-Platform Sync</h1>
        <div style={{ background: '#1e293b', borderLeft: '3px solid #94a3b8', padding: '14px 18px', borderRadius: '0 8px 8px 0', color: '#94a3b8', fontSize: '14px', marginBottom: '40px', lineHeight: 1.6 }}>
          Unified inventory sync across Blinkit, Zepto, and Instamart simultaneously.
          One dashboard. One source of truth. No more switching between 3 seller portals.
        </div>

        {/* ── Demo CTA ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1020 0%, #0f1117 100%)',
          border: '1px solid #60a5fa',
          borderRadius: '12px',
          padding: '24px 28px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
              🔄 See it in action — Live Demo
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Explore 25 real sync records across Blinkit, Zepto & Instamart — with platform breakdown,
              city filter, stock status and days-remaining — powered by <code style={{ color: '#60a5fa' }}>inventory_snapshots.json</code>.
            </div>
          </div>
          <button
            onClick={() => navigate('/demo/multi-platform-sync')}
            style={{
              background: '#1d4ed8',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(96,165,250,0.3)',
            }}
          >
            View Live Demo →
          </button>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>What This Phase Delivers</div>
          <div style={s.grid}>
            {features.map((f, i) => (
              <div key={i} style={s.featureCard}>
                <div style={s.featureIcon}>{f.icon}</div>
                <div style={s.featureTitle}>{f.title}</div>
                <div style={s.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>HLD — High Level Design</div>
          <MermaidDiagram chart={hldDiagram} />
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>LLD — Low Level Design</div>
          <MermaidDiagram chart={lldDiagram} />
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>Tech Stack</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['Python / FastAPI', 'PostgreSQL', 'Async API Calls', 'Conflict Resolution Logic', 'Blinkit API', 'Zepto API', 'Instamart API'].map((t, i) => (
              <span key={i} style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #2d3748', borderRadius: '6px', padding: '6px 14px', fontSize: '13px' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
