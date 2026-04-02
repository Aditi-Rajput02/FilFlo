import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MermaidDiagram from '../components/MermaidDiagram'

const hldDiagram = `flowchart LR
    A["🛒 Blinkit API"] --> D["RevQ\nData Ingestion Layer"]
    B["⚡ Zepto API"] --> D
    C["🛍️ Instamart API"] --> D
    
    D --> E["📦 Inventory\nDatabase"]
    E --> F["🖥️ Dashboard UI\n(Visibility Layer)"]
    
    E --> G["🤖 Autonomous\nReorder Agent"]
    
    F --> H["🔴 Low Stock Alert"]
    F --> I["🟢 Healthy Stock View"]
    F --> J["📊 Store-wise Table"]
    F --> K["📈 Forecast View"]
    
    H --> L["Trigger Signal"]
    L --> G
    
    G --> M["📋 Calculate PO\n(qty, supplier, warehouse)"]
    M --> N["✅ Auto-Place Order"]
    N --> O["📧 Notify Supplier"]
 
    style A fill:#f97316,color:#fff,stroke:#ea580c
    style B fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style C fill:#22c55e,color:#fff,stroke:#16a34a
    style D fill:#3b82f6,color:#fff,stroke:#2563eb
    style E fill:#1e293b,color:#e2e8f0,stroke:#4f46e5
    style F fill:#6366f1,color:#fff,stroke:#4f46e5
    style G fill:#ec4899,color:#fff,stroke:#be185d
    style H fill:#ef4444,color:#fff,stroke:#dc2626
    style I fill:#22c55e,color:#fff,stroke:#16a34a
    style J fill:#06b6d4,color:#fff,stroke:#0891b2
    style K fill:#f59e0b,color:#fff,stroke:#d97706
    style L fill:#f59e0b,color:#fff,stroke:#d97706
    style M fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style N fill:#22c55e,color:#fff,stroke:#16a34a
    style O fill:#22c55e,color:#fff,stroke:#16a34a
`

const lldDiagram = `flowchart TD
    START["Cron Job: Every 60 min"] --> CALL["Call Platform APIs\n(Blinkit, Zepto, Instamart)"]
    
    CALL --> RETRY{"API call\nsucceeded?"}
    RETRY -- No --> RETRY_LOGIC["Retry up to 3 times\nwith exponential backoff"]
    RETRY_LOGIC --> RETRY_CHECK{"Max retries\nexceeded?"}
    RETRY_CHECK -- No --> CALL
    RETRY_CHECK -- Yes --> FALLBACK["Use last known good data\nfrom DB"]
    RETRY -- Yes --> PARSE["Parse JSON Response"]
    FALLBACK --> LOG_ERROR["📝 Log error\nAlert ops: Data stale"]
    
    PARSE --> NORM["Normalize:\nSKU × Store × Qty × Timestamp"]
    NORM --> VALIDATE{"Data\nvalid?"}
    VALIDATE -- No --> REJECT["Reject record\nLog validation error"]
    VALIDATE -- Yes --> UPSERT["Upsert into PostgreSQL\ninventory_snapshots table"]
    
    REJECT --> UPSERT
    LOG_ERROR --> UPSERT
    
    UPSERT --> COMPUTE["Compute:<br/>- current_stock<br/>- threshold<br/>- days_remaining = stock / daily_forecast<br/>- risk_level"]
    
    COMPUTE --> CHECK_THRESHOLD{"current_stock\n< threshold?"}
    
    CHECK_THRESHOLD -- Yes --> CHECK_FORECAST{"days_remaining\n< lead_time?"}
    CHECK_FORECAST -- Yes --> CRITICAL["Set status = CRITICAL\nCreate alert with HIGH priority"]
    CHECK_FORECAST -- No --> LOW["Set status = LOW\nCreate alert with MEDIUM priority"]
    
    CHECK_THRESHOLD -- No --> OK["Set status = OK\nNo alert needed"]
    
    CRITICAL --> TRIGGER_AGENT["🚨 Trigger Signal to\nAutonomous Reorder Agent"]
    LOW --> TRIGGER_AGENT
    OK --> PUSH["Push inventory snapshot\nto Dashboard via WebSocket"]
    
    TRIGGER_AGENT --> AGENT["🤖 Reorder Agent receives signal"]
    AGENT --> AGENT_CALC["Calculate optimal PO"]
    AGENT_CALC --> PLACE["Auto-place order"]
    PLACE --> NOTIFY["Notify supplier"]
    
    NOTIFY --> PUSH
    
    PUSH --> END["Dashboard updates in real-time"]
 
    style START fill:#6366f1,color:#fff,stroke:#4f46e5
    style CALL fill:#3b82f6,color:#fff,stroke:#2563eb
    style RETRY fill:#f59e0b,color:#fff,stroke:#d97706
    style RETRY_LOGIC fill:#f59e0b,color:#fff,stroke:#d97706
    style FALLBACK fill:#f97316,color:#fff,stroke:#ea580c
    style LOG_ERROR fill:#f97316,color:#fff,stroke:#ea580c
    style PARSE fill:#3b82f6,color:#fff,stroke:#2563eb
    style NORM fill:#3b82f6,color:#fff,stroke:#2563eb
    style VALIDATE fill:#f59e0b,color:#fff,stroke:#d97706
    style REJECT fill:#f97316,color:#fff,stroke:#ea580c
    style UPSERT fill:#06b6d4,color:#fff,stroke:#0891b2
    style COMPUTE fill:#3b82f6,color:#fff,stroke:#2563eb
    style CHECK_THRESHOLD fill:#f59e0b,color:#fff,stroke:#d97706
    style CHECK_FORECAST fill:#f59e0b,color:#fff,stroke:#d97706
    style CRITICAL fill:#ef4444,color:#fff,stroke:#dc2626
    style LOW fill:#f59e0b,color:#fff,stroke:#d97706
    style OK fill:#22c55e,color:#fff,stroke:#16a34a
    style TRIGGER_AGENT fill:#ec4899,color:#fff,stroke:#be185d
    style AGENT fill:#ec4899,color:#fff,stroke:#be185d
    style AGENT_CALC fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style PLACE fill:#22c55e,color:#fff,stroke:#16a34a
    style NOTIFY fill:#22c55e,color:#fff,stroke:#16a34a
    style PUSH fill:#06b6d4,color:#fff,stroke:#0891b2
    style END fill:#22c55e,color:#fff,stroke:#16a34a
`

const features = [
  { icon: '🏪', title: 'Store-wise Stock View', desc: 'See current stock for every SKU at every dark store across Blinkit, Zepto, and Instamart in one table.' },
  { icon: '🔴', title: 'Low Stock Alerts', desc: 'Automatic red alerts when any SKU at any store drops below the configured safety threshold.' },
  { icon: '📊', title: 'Days Remaining Estimate', desc: 'Based on average daily sales, RevQ shows "X days of stock remaining" for each SKU × store combination.' },
  { icon: '🔄', title: 'Auto-Refresh Every Hour', desc: 'Data syncs automatically every 60 minutes from all platforms. No manual refresh needed.' },
]

const s = {
  page: { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '48px 24px' },
  title: { fontSize: '26px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' },
  badge: { display: 'inline-block', background: '#14532d', color: '#22c55e', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', marginBottom: '12px', letterSpacing: '0.05em' },
  subtitle: { background: '#1e293b', borderLeft: '3px solid #6366f1', padding: '14px 18px', borderRadius: '0 8px 8px 0', color: '#94a3b8', fontSize: '14px', marginBottom: '40px', lineHeight: 1.6 },
  section: { marginBottom: '48px' },
  sectionTitle: { fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  featureCard: { background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  featureIcon: { fontSize: '24px', marginBottom: '10px' },
  featureTitle: { fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' },
  featureDesc: { fontSize: '13px', color: '#64748b', lineHeight: 1.6 },
  tabRow: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: { padding: '7px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' },
}

export default function InventoryDashboard() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <Navbar title="Phase 1 — Inventory Dashboard" />
      <div style={s.container}>
        <div style={s.badge}>PHASE 1 · CORE</div>
        <h1 style={s.title}>Inventory Dashboard</h1>
        <div style={s.subtitle}>
          Real-time stock visibility across all dark stores on Blinkit, Zepto & Instamart.
          Replaces manual Excel tracking with a live, auto-refreshing dashboard.
        </div>

        {/* ── Demo CTA ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1117 100%)',
          border: '1px solid #6366f1',
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
              🚀 See it in action — Live Demo
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Explore the actual inventory dashboard with real sample data from 22 dark stores across Blinkit, Zepto & Instamart.
              Filter by platform, status, and search by SKU or store name.
            </div>
          </div>
          <button
            onClick={() => navigate('/demo/inventory')}
            style={{
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(99,102,241,0.3)',
            }}
          >
            View Live Dashboard →
          </button>
        </div>

        {/* Features */}
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

        {/* HLD */}
        <div style={s.section}>
          <div style={s.sectionTitle}>HLD — High Level Design</div>
          <MermaidDiagram chart={hldDiagram} />
        </div>

        {/* LLD */}
        <div style={s.section}>
          <div style={s.sectionTitle}>LLD — Low Level Design</div>
          <MermaidDiagram chart={lldDiagram} />
        </div>

        {/* Tech Stack */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Tech Stack</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['React + Vite', 'Node.js / FastAPI', 'PostgreSQL', 'WebSocket', 'Blinkit API', 'Zepto API', 'Instamart API'].map((t, i) => (
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
