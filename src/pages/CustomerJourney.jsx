import Navbar from '../components/Navbar'
import MermaidDiagram from '../components/MermaidDiagram'

const journeyFlow = `flowchart TD
    A["🛒 Brand sells on Blinkit / Zepto / Instamart"]
    B["📊 Sales data flows into RevQ every hour"]
    C["🤖 AI Engine analyzes SKU × Store × Day"]
    D{"Stock < Threshold?"}
    E["✅ No action needed — stock is healthy"]
    F["⚠️ Low Stock Alert triggered"]
    G["📈 Demand Prediction runs for next 7 days"]
    H["🏭 Best warehouse identified for replenishment"]
    I["📋 Purchase Order auto-generated"]
    J["🚚 PO sent to supplier / warehouse team"]
    K["📦 Stock replenished at dark store"]
    L["💰 No stockout — Revenue protected!"]

    A --> B
    B --> C
    C --> D
    D -- No --> E
    D -- Yes --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L

    style A fill:#6366f1,color:#fff,stroke:#4f46e5
    style B fill:#3b82f6,color:#fff,stroke:#2563eb
    style C fill:#06b6d4,color:#fff,stroke:#0891b2
    style D fill:#f59e0b,color:#fff,stroke:#d97706
    style E fill:#22c55e,color:#fff,stroke:#16a34a
    style F fill:#ef4444,color:#fff,stroke:#dc2626
    style G fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style H fill:#06b6d4,color:#fff,stroke:#0891b2
    style I fill:#f97316,color:#fff,stroke:#ea580c
    style J fill:#3b82f6,color:#fff,stroke:#2563eb
    style K fill:#22c55e,color:#fff,stroke:#16a34a
    style L fill:#22c55e,color:#fff,stroke:#16a34a
`

const brand = {
  name: 'Zindagi Naturals',
  category: 'Health & Wellness D2C Brand',
  platforms: 'Blinkit, Zepto, Instamart',
  skus: '47 SKUs across 120 dark stores',
  problem: 'Losing ₹12L/month to stockouts, 3 ops managers spending 40h/week in Excel',
  goal: 'Automate inventory decisions, reduce stockouts by 80%, free up ops team',
}

const steps = [
  {
    num: '01',
    color: '#6366f1',
    title: 'Brand Onboards RevQ',
    desc: 'Zindagi Naturals connects their Blinkit/Zepto seller accounts to RevQ. Historical sales data (last 90 days) is ingested automatically.',
  },
  {
    num: '02',
    color: '#3b82f6',
    title: 'Real-Time Data Sync',
    desc: 'Every hour, RevQ pulls live stock levels from all 120 dark stores across 3 platforms. No manual entry. No Excel.',
  },
  {
    num: '03',
    color: '#8b5cf6',
    title: 'AI Demand Prediction',
    desc: 'RevQ\'s AI forecasts demand for each SKU at each store for the next 7 days — factoring in weekends, festivals, and local trends.',
  },
  {
    num: '04',
    color: '#f59e0b',
    title: 'Stockout Alert Fires',
    desc: '"Ashwagandha 60-cap at Blinkit Koramangala will run out in 2 days." Alert sent to ops manager + auto-action triggered.',
  },
  {
    num: '05',
    color: '#f97316',
    title: 'PO Auto-Generated',
    desc: 'RevQ creates: "Send 80 units of Ashwagandha 60-cap from Bangalore Warehouse to Blinkit Koramangala by tomorrow 6 AM."',
  },
  {
    num: '06',
    color: '#22c55e',
    title: 'Revenue Protected 💰',
    desc: 'Stock arrives before stockout. Sale continues. ₹12L/month loss eliminated. Ops team now focuses on growth, not firefighting.',
  },
]

const s = {
  page: { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '48px 24px' },
  title: { fontSize: '26px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' },
  subtitle: {
    background: '#1e293b',
    borderLeft: '3px solid #6366f1',
    padding: '14px 18px',
    borderRadius: '0 8px 8px 0',
    color: '#94a3b8',
    fontSize: '14px',
    marginBottom: '40px',
    lineHeight: 1.6,
  },
  section: { marginBottom: '48px' },
  sectionTitle: { fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' },
  brandCard: {
    background: '#1a1f2e',
    border: '1px solid #2d3748',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '40px',
  },
  brandHeader: {
    background: '#6366f1',
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.05em',
  },
  brandTable: { width: '100%', borderCollapse: 'collapse' },
  brandRow: { borderBottom: '1px solid #1e293b' },
  brandKey: { padding: '12px 24px', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '160px', verticalAlign: 'top' },
  brandVal: { padding: '12px 24px', color: '#e2e8f0', fontSize: '13px', lineHeight: 1.5 },
  stepCard: {
    display: 'flex',
    gap: '20px',
    background: '#1a1f2e',
    border: '1px solid #2d3748',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '12px',
    alignItems: 'flex-start',
  },
  stepNum: {
    fontSize: '22px',
    fontWeight: 800,
    minWidth: '40px',
    lineHeight: 1,
  },
  stepTitle: { fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' },
  stepDesc: { fontSize: '13px', color: '#64748b', lineHeight: 1.6 },
}

export default function CustomerJourney() {
  return (
    <div style={s.page}>
      <Navbar title="Brand Journey" />
      <div style={s.container}>
        <h1 style={s.title}>Brand Journey — End-to-End RevQ Walkthrough</h1>
        <div style={s.subtitle}>
          A single brand's path from manual Excel chaos → fully automated AI-driven inventory management
        </div>

        {/* Meet the Brand */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Meet the Brand</div>
          <div style={s.brandCard}>
            <div style={s.brandHeader}>DEMO BRAND — ZINDAGI NATURALS</div>
            <table style={s.brandTable}>
              <tbody>
                {Object.entries(brand).map(([key, val]) => (
                  <tr key={key} style={s.brandRow}>
                    <td style={s.brandKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                    <td style={s.brandVal}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Journey Steps */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Step-by-Step Journey</div>
          {steps.map((step, i) => (
            <div key={i} style={s.stepCard}>
              <div style={{ ...s.stepNum, color: step.color }}>{step.num}</div>
              <div>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Flow Diagram */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Journey Flow Diagram</div>
          <MermaidDiagram chart={journeyFlow} />
        </div>
      </div>
    </div>
  )
}
