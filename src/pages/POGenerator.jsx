import Navbar from '../components/Navbar'
import MermaidDiagram from '../components/MermaidDiagram'

const hldDiagram = `flowchart LR
    A["📋 Replenishment\nSuggestion"] --> C["📄 PO Generator\nEngine"]
    B["🏭 Warehouse\nInventory"] --> C
    C --> D["📝 Draft PO Created"]
    D --> E{"Auto-approve\nenabled?"}
    E -- Yes --> F["✅ PO Auto-Approved\n& Dispatched"]
    E -- No --> G["👤 Ops Manager\nReviews PO"]
    G -- Approve --> F
    G -- Reject --> H["🔄 Re-calculate\nSuggestion"]
    F --> I["🚚 Dispatch\nInstruction Sent"]

    style A fill:#f97316,color:#fff,stroke:#ea580c
    style B fill:#3b82f6,color:#fff,stroke:#2563eb
    style C fill:#6366f1,color:#fff,stroke:#4f46e5
    style D fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style E fill:#f59e0b,color:#fff,stroke:#d97706
    style F fill:#22c55e,color:#fff,stroke:#16a34a
    style G fill:#06b6d4,color:#fff,stroke:#0891b2
    style H fill:#ef4444,color:#fff,stroke:#dc2626
    style I fill:#22c55e,color:#fff,stroke:#16a34a
`

const lldDiagram = `flowchart TD
    A["Trigger: Replenishment suggestion approved"] --> B["Fetch suggestion details\nSKU + Store + Qty + Warehouse"]
    B --> C["Generate PO ID\nPO-YYYYMMDD-XXXX"]
    C --> D["Build PO document:\nFrom, To, SKU, Qty, ETA"]
    D --> E["Validate warehouse\nhas sufficient stock"]
    E --> F{"Validation\npassed?"}
    F -- No --> G["Alert: Warehouse\nstock insufficient\nFind alternate"]
    F -- Yes --> H["Save PO to database\nStatus: PENDING"]
    H --> I{"Auto-approve\nflag set?"}
    I -- Yes --> J["Update status: APPROVED\nSend dispatch instruction"]
    I -- No --> K["Send to ops manager\nfor approval"]
    K --> J

    style A fill:#6366f1,color:#fff,stroke:#4f46e5
    style C fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style F fill:#f59e0b,color:#fff,stroke:#d97706
    style G fill:#ef4444,color:#fff,stroke:#dc2626
    style H fill:#3b82f6,color:#fff,stroke:#2563eb
    style I fill:#f59e0b,color:#fff,stroke:#d97706
    style J fill:#22c55e,color:#fff,stroke:#16a34a
    style K fill:#06b6d4,color:#fff,stroke:#0891b2
`

const features = [
  { icon: '📄', title: 'Auto-Generated PO Document', desc: 'Creates a complete Purchase Order with PO ID, SKU details, quantity, source warehouse, destination store, and ETA.' },
  { icon: '✅', title: 'One-Click Approval', desc: 'Ops manager gets a notification and can approve or reject the PO with a single click. Or enable full auto-approval.' },
  { icon: '🔢', title: 'Unique PO ID System', desc: 'Every PO gets a unique ID (PO-20260331-0042) for tracking, audit trail, and supplier communication.' },
  { icon: '🚚', title: 'Dispatch Instruction', desc: 'Once approved, FilFlo sends a dispatch instruction to the warehouse team with all details needed to ship.' },
]

const samplePO = {
  'PO ID': 'PO-20260331-0042',
  'Created At': 'March 31, 2026 — 09:14 AM',
  'Status': '✅ AUTO-APPROVED',
  'SKU': 'Ashwagandha 60-cap (SKU-A047)',
  'Quantity': '80 units',
  'From': 'Bangalore Central Warehouse',
  'To': 'Blinkit Dark Store — Koramangala',
  'Expected Delivery': 'April 1, 2026 by 6:00 AM',
  'Reason': 'Stock at 1.5 days cover — below 3-day safety threshold',
}

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
  poCard: { background: '#1a1f2e', border: '1px solid #22c55e', borderRadius: '10px', overflow: 'hidden' },
  poHeader: { background: '#15803d', padding: '12px 20px', fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  poRow: { display: 'flex', borderBottom: '1px solid #1e293b' },
  poKey: { padding: '10px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, minWidth: '180px' },
  poVal: { padding: '10px 20px', color: '#e2e8f0', fontSize: '13px' },
}

export default function POGenerator() {
  return (
    <div style={s.page}>
      <Navbar title="Phase 4 — PO Generator" />
      <div style={s.container}>
        <div style={s.badge}>PHASE 4 · CORE</div>
        <h1 style={s.title}>Purchase Order (PO) Generator</h1>
        <div style={{ background: '#1e293b', borderLeft: '3px solid #6366f1', padding: '14px 18px', borderRadius: '0 8px 8px 0', color: '#94a3b8', fontSize: '14px', marginBottom: '40px', lineHeight: 1.6 }}>
          Auto-creates Purchase Orders like: <strong style={{ color: '#e2e8f0' }}>"Send 80 units of Ashwagandha 60-cap from Bangalore Warehouse to Blinkit Koramangala by 6 AM tomorrow."</strong>
          {' '}No human needed to write this. FilFlo does it automatically.
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

        {/* Sample PO */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Sample Auto-Generated Purchase Order</div>
          <div style={s.poCard}>
            <div style={s.poHeader}>
              <span>📋 PURCHASE ORDER</span>
              <span style={{ background: '#22c55e', padding: '3px 10px', borderRadius: '4px', fontSize: '11px' }}>AUTO-APPROVED</span>
            </div>
            {Object.entries(samplePO).map(([key, val], i) => (
              <div key={i} style={{ ...s.poRow, borderBottom: i < Object.keys(samplePO).length - 1 ? '1px solid #1e293b' : 'none' }}>
                <div style={s.poKey}>{key}</div>
                <div style={s.poVal}>{val}</div>
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
            {['Python / FastAPI', 'PostgreSQL', 'PDF Generator', 'Email / WhatsApp API', 'Approval Workflow'].map((t, i) => (
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
