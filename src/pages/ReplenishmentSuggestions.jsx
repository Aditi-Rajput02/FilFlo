import Navbar from '../components/Navbar'
import MermaidDiagram from '../components/MermaidDiagram'

const hldDiagram = `flowchart LR
    A["📈 Demand\nPrediction Output"] --> C["🧠 Replenishment\nDecision Engine"]
    B["📦 Current\nStock Levels"] --> C
    C --> D{"Stock covers\npredicted demand?"}
    D -- Yes --> E["✅ No action\nneeded"]
    D -- No --> F["⚠️ Replenishment\nSuggestion Created"]
    F --> G["🏭 Warehouse\nSelection Logic"]
    G --> H["📋 Suggestion sent\nto PO Generator"]

    style A fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style B fill:#3b82f6,color:#fff,stroke:#2563eb
    style C fill:#6366f1,color:#fff,stroke:#4f46e5
    style D fill:#f59e0b,color:#fff,stroke:#d97706
    style E fill:#22c55e,color:#fff,stroke:#16a34a
    style F fill:#ef4444,color:#fff,stroke:#dc2626
    style G fill:#06b6d4,color:#fff,stroke:#0891b2
    style H fill:#f97316,color:#fff,stroke:#ea580c
`

const lldDiagram = `flowchart TD
    A["For each SKU × Store combination"] --> B["Get current_stock from DB"]
    B --> C["Get predicted_demand\nfor next 7 days"]
    C --> D["Calculate days_of_cover\n= current_stock / avg_daily_demand"]
    D --> E{"days_of_cover\n< safety_days?"}
    E -- No --> F["Mark as HEALTHY\nNo action"]
    E -- Yes --> G["Calculate reorder_qty\n= target_stock - current_stock"]
    G --> H["Find nearest warehouse\nwith sufficient stock"]
    H --> I["Create suggestion:\nSKU + Store + Qty + Warehouse"]
    I --> J["Save to suggestions table\nNotify ops team"]

    style A fill:#6366f1,color:#fff,stroke:#4f46e5
    style D fill:#3b82f6,color:#fff,stroke:#2563eb
    style E fill:#f59e0b,color:#fff,stroke:#d97706
    style F fill:#22c55e,color:#fff,stroke:#16a34a
    style G fill:#ef4444,color:#fff,stroke:#dc2626
    style H fill:#06b6d4,color:#fff,stroke:#0891b2
    style I fill:#f97316,color:#fff,stroke:#ea580c
    style J fill:#8b5cf6,color:#fff,stroke:#7c3aed
`

const features = [
  { icon: '🧮', title: 'Days-of-Cover Calculation', desc: 'Calculates how many days current stock will last based on predicted daily demand. Triggers alert when below safety threshold.' },
  { icon: '🏭', title: 'Smart Warehouse Selection', desc: 'Automatically picks the nearest warehouse with sufficient stock to minimize delivery time and cost.' },
  { icon: '📊', title: 'Reorder Quantity Formula', desc: 'Calculates exact reorder quantity: target_stock - current_stock, so you never over-order or under-order.' },
  { icon: '🔔', title: 'Ops Team Notification', desc: 'Sends instant notification to ops manager with full suggestion details — approve with one click or let it auto-approve.' },
]

const example = [
  { label: 'SKU', value: 'Ashwagandha 60-cap (SKU-A047)' },
  { label: 'Store', value: 'Blinkit — Koramangala, Bangalore' },
  { label: 'Current Stock', value: '12 units' },
  { label: 'Avg Daily Sales', value: '8 units/day' },
  { label: 'Days of Cover', value: '1.5 days ⚠️ CRITICAL' },
  { label: 'Safety Threshold', value: '3 days' },
  { label: 'Reorder Qty', value: '80 units (to reach 10-day target)' },
  { label: 'Source Warehouse', value: 'Bangalore Central Warehouse (2.3 km away)' },
]

const s = {
  page: { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '48px 24px' },
  title: { fontSize: '26px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' },
  badge: { display: 'inline-block', background: '#14532d', color: '#22c55e', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', marginBottom: '12px', letterSpacing: '0.05em' },
  section: { marginBottom: '48px' },
  sectionTitle: { fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  featureCard: { background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '10px', padding: '20px' },
  featureIcon: { fontSize: '24px', marginBottom: '10px' },
  featureTitle: { fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' },
  featureDesc: { fontSize: '13px', color: '#64748b', lineHeight: 1.6 },
  exampleCard: { background: '#1a1f2e', border: '1px solid #ef4444', borderRadius: '10px', overflow: 'hidden' },
  exampleHeader: { background: '#ef4444', padding: '12px 20px', fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' },
  exampleRow: { display: 'flex', borderBottom: '1px solid #1e293b' },
  exampleKey: { padding: '10px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, minWidth: '160px' },
  exampleVal: { padding: '10px 20px', color: '#e2e8f0', fontSize: '13px' },
}

export default function ReplenishmentSuggestions() {
  return (
    <div style={s.page}>
      <Navbar title="Phase 3 — Replenishment Suggestions" />
      <div style={s.container}>
        <div style={s.badge}>PHASE 3 · CORE</div>
        <h1 style={s.title}>Replenishment Suggestions</h1>
        <div style={{ background: '#1e293b', borderLeft: '3px solid #6366f1', padding: '14px 18px', borderRadius: '0 8px 8px 0', color: '#94a3b8', fontSize: '14px', marginBottom: '40px', lineHeight: 1.6 }}>
          Auto-triggers reorder suggestions when stock falls below safety threshold.
          No manual checking. No Excel. Just smart, automated alerts with exact quantities and warehouse routing.
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

        {/* Example Suggestion */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Example Replenishment Suggestion</div>
          <div style={s.exampleCard}>
            <div style={s.exampleHeader}>🚨 CRITICAL ALERT — AUTO-GENERATED SUGGESTION</div>
            {example.map((row, i) => (
              <div key={i} style={{ ...s.exampleRow, borderBottom: i < example.length - 1 ? '1px solid #1e293b' : 'none' }}>
                <div style={s.exampleKey}>{row.label}</div>
                <div style={s.exampleVal}>{row.value}</div>
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
            {['Python / FastAPI', 'PostgreSQL', 'Rule Engine', 'Notification Service', 'REST API'].map((t, i) => (
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
