import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MermaidDiagram from '../components/MermaidDiagram'

const hldDiagram = `flowchart LR 
    A["📈 Demand\nForecast"] --> D["🤖 Autonomous\nReorder Engine"] 
    B["📦 Stock\nLevels"] --> D 
    C["🏭 Supplier\nCatalog"] --> D 
    W["🏢 Warehouse\nData"] --> D
    
    D --> E["Calculate\nUrgency Score"] 
    E --> F{"Urgency > \nThreshold?"} 
    
    F -- No --> Z["⏸️ Sleep until\nnext cycle"]
    F -- Yes --> G["📊 Fetch Best\nSupplier & Qty"]
    
    G --> H["🎯 Select\nOptimal Warehouse\nfor Fulfillment"]
    H --> I["🔢 Calculate\nConfidence Score\n(Forecast Accuracy)"]
    
    I --> J{"Confidence\n> 90%?"} 
    J -- Yes --> K["✅ Auto-Place\nOrder"]
    J -- No --> L["⚠️ Create Draft PO\nEscalate to Ops"]
    
    K --> M["📋 Update DB"]
    L --> M
    M --> N["📤 Notify Supplier\n(API/Email)"]
    N --> O["📍 Assign to\nDark Stores"]
    
    style A fill:#8b5cf6,color:#fff,stroke:#7c3aed 
    style B fill:#3b82f6,color:#fff,stroke:#2563eb 
    style C fill:#06b6d4,color:#fff,stroke:#0891b2
    style W fill:#ec4899,color:#fff,stroke:#be185d
    style D fill:#6366f1,color:#fff,stroke:#4f46e5 
    style E fill:#3b82f6,color:#fff,stroke:#2563eb
    style F fill:#f59e0b,color:#fff,stroke:#d97706 
    style G fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style H fill:#ec4899,color:#fff,stroke:#be185d
    style I fill:#3b82f6,color:#fff,stroke:#2563eb
    style J fill:#f59e0b,color:#fff,stroke:#d97706 
    style K fill:#22c55e,color:#fff,stroke:#16a34a 
    style L fill:#f97316,color:#fff,stroke:#ea580c 
    style M fill:#22c55e,color:#fff,stroke:#16a34a 
    style N fill:#22c55e,color:#fff,stroke:#16a34a 
    style O fill:#22c55e,color:#fff,stroke:#16a34a 
    style Z fill:#6b7280,color:#fff,stroke:#4b5563
`

const lldDiagram = `flowchart TD 
    START["🚀 Agent wakes up\nevery 15 minutes"] --> SCAN["Scan all SKU × Store\ncombinations"]
    
    SCAN --> FETCH_DATA["📊 Fetch data:<br/>- Current inventory levels<br/>- Days of cover<br/>- Demand forecast"]
    
    FETCH_DATA --> URGENCY["🔢 Calculate Urgency Score<br/>urgency = (forecast - inventory) / days_of_cover<br/>+ demand_spike_multiplier"]
    
    URGENCY --> CHECK_URGENCY{"Urgency Score\n> Threshold?"} 
    CHECK_URGENCY -- No --> SLEEP["😴 Sleep until next cycle<br/>Log: No action needed"]
    
    CHECK_URGENCY -- Yes --> SUPPLIER["🏭 Fetch Best Supplier<br/>- Price<br/>- Lead time<br/>- Min order qty"]
    
    SUPPLIER --> QTY["📦 Calculate Order Qty<br/>qty = (forecast × lead_time) + safety_stock<br/>- current_inventory"]
    
    QTY --> WAREHOUSE["🏢 SELECT WAREHOUSE<br/>(Autonomous Decision #1)<br/>- Check capacity<br/>- Minimize shipping cost<br/>- Minimize TAT<br/>- Consider stock-out risk"]
    
    WAREHOUSE --> DEPLOY["📍 INVENTORY DEPLOYMENT<br/>(Autonomous Decision #2)<br/>Assign ordered qty to dark stores<br/>- High demand stores first<br/>- Minimize transport cost<br/>- Maximize ROI"]
    
    DEPLOY --> CONFIDENCE["📈 Calculate Confidence Score<br/>confidence = forecast_accuracy %<br/>× supplier_reliability %<br/>× warehouse_capacity %"]
    
    CONFIDENCE --> CHECK_CONF{"Confidence\n> 90%?"} 
    
    CHECK_CONF -- Yes --> PLACE["✅ Place Order<br/>- Call Supplier API<br/>- OR Send email"]
    CHECK_CONF -- No --> DRAFT["⚠️ Create Draft PO<br/>- Alert ops_manager<br/>- Await human approval"]
    
    PLACE --> DB_UPDATE_AUTO["💾 Update Database<br/>- order_placed = true<br/>- timestamp<br/>- warehouse_id<br/>- deployment_plan"]
    
    DRAFT --> DB_UPDATE_DRAFT["💾 Update Database<br/>- status = pending_approval<br/>- confidence_score<br/>- assigned_to = ops_manager"]
    
    DB_UPDATE_AUTO --> NOTIFY["📧 Notify Supplier<br/>- Send PO details<br/>- Expected delivery date<br/>- Warehouse receiving address"]
    
    DB_UPDATE_DRAFT --> WAIT_HUMAN["⏳ Wait for Human Approval<br/>Ops manager reviews & approves/rejects"]
    
    NOTIFY --> LOG["📝 Log Decision<br/>- SKU, qty, warehouse<br/>- Reason (urgency score)<br/>- Confidence level<br/>- Estimated impact"]
    
    WAIT_HUMAN --> LOG
    LOG --> END["✅ Cycle Complete"]
    
    style START fill:#6366f1,color:#fff,stroke:#4f46e5
    style SCAN fill:#3b82f6,color:#fff,stroke:#2563eb
    style FETCH_DATA fill:#3b82f6,color:#fff,stroke:#2563eb
    style URGENCY fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style CHECK_URGENCY fill:#f59e0b,color:#fff,stroke:#d97706
    style SLEEP fill:#6b7280,color:#fff,stroke:#4b5563
    style SUPPLIER fill:#06b6d4,color:#fff,stroke:#0891b2
    style QTY fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style WAREHOUSE fill:#ec4899,color:#fff,stroke:#be185d
    style DEPLOY fill:#ec4899,color:#fff,stroke:#be185d
    style CONFIDENCE fill:#3b82f6,color:#fff,stroke:#2563eb
    style CHECK_CONF fill:#f59e0b,color:#fff,stroke:#d97706
    style PLACE fill:#22c55e,color:#fff,stroke:#16a34a
    style DRAFT fill:#f97316,color:#fff,stroke:#ea580c
    style DB_UPDATE_AUTO fill:#22c55e,color:#fff,stroke:#16a34a
    style DB_UPDATE_DRAFT fill:#f97316,color:#fff,stroke:#ea580c
    style NOTIFY fill:#22c55e,color:#fff,stroke:#16a34a
    style WAIT_HUMAN fill:#f59e0b,color:#fff,stroke:#d97706
    style LOG fill:#22c55e,color:#fff,stroke:#16a34a
    style END fill:#22c55e,color:#fff,stroke:#16a34a
`

const features = [
  { icon: '🤖', title: 'Fully Autonomous Ordering', desc: 'When confidence is high (>90%), the agent places orders directly with suppliers via API or email — zero human involvement.' },
  { icon: '🧠', title: 'Confidence Scoring', desc: 'Every decision gets a confidence score based on forecast accuracy, historical patterns, and data quality. Low confidence = escalate to human.' },
  { icon: '⏱️', title: 'Runs Every 15 Minutes', desc: 'The agent continuously monitors all SKU × store combinations every 15 minutes, 24/7. Never sleeps. Never misses a stockout.' },
  { icon: '🔐', title: 'Human Override Always Available', desc: 'Ops managers can override any autonomous decision at any time. Full audit trail of every action the agent takes.' },
]

const agentDecision = [
  { label: 'Agent Run Time', value: 'March 31, 2026 — 11:45 PM' },
  { label: 'SKU Scanned', value: 'Ashwagandha 60-cap (SKU-A047)' },
  { label: 'Store', value: 'Blinkit — Koramangala, Bangalore' },
  { label: 'Days of Cover', value: '0.8 days 🚨 CRITICAL' },
  { label: 'Urgency Score', value: '97 / 100' },
  { label: 'Confidence Score', value: '94% ✅ Above threshold' },
  { label: 'Decision', value: '🤖 AUTO-ORDER PLACED' },
  { label: 'Supplier', value: 'Himalaya Wellness Distributors' },
  { label: 'Order Qty', value: '120 units' },
  { label: 'Expected Delivery', value: 'April 1, 2026 by 4:00 AM' },
  { label: 'Human Involved?', value: 'No — Fully Autonomous ✅' },
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
  decisionCard: { background: '#1a1f2e', border: '1px solid #6366f1', borderRadius: '10px', overflow: 'hidden' },
  decisionHeader: { background: '#4f46e5', padding: '12px 20px', fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  decisionRow: { display: 'flex', borderBottom: '1px solid #1e293b' },
  decisionKey: { padding: '10px 20px', color: '#64748b', fontSize: '13px', fontWeight: 600, minWidth: '180px' },
  decisionVal: { padding: '10px 20px', color: '#e2e8f0', fontSize: '13px' },
}

export default function AutonomousReorderAgent() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <Navbar title="Phase 6 — Autonomous Reorder Agent" />
      <div style={s.container}>
        <div style={s.badge}>PHASE 6 · FUTURE</div>
        <h1 style={s.title}>Autonomous Reorder Agent</h1>
        <div style={{ background: '#1e293b', borderLeft: '3px solid #94a3b8', padding: '14px 18px', borderRadius: '0 8px 8px 0', color: '#94a3b8', fontSize: '14px', marginBottom: '40px', lineHeight: 1.6 }}>
          The final evolution of RevQ — a fully autonomous AI agent that monitors inventory 24/7,
          makes ordering decisions, and places orders with suppliers <strong style={{ color: '#e2e8f0' }}>without any human approval</strong> when confidence is high enough.
        </div>

        {/* ── Demo CTA ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0d0a1f 0%, #0f1117 100%)',
          border: '1px solid #a78bfa',
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
              🤖 See the Agent Think — Live Interactive Demo
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Pick any SKU, press <strong style={{ color: '#a78bfa' }}>▶ Run Agent</strong> and watch it scan inventory, calculate urgency,
              score confidence, and decide — autonomously. Powered by <code style={{ color: '#a78bfa' }}>agent_logs.json</code>.
            </div>
          </div>
          <button
            onClick={() => navigate('/demo/autonomous-agent')}
            style={{
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(167,139,250,0.3)',
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

        {/* Sample Agent Decision Log */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Sample Agent Decision Log</div>
          <div style={s.decisionCard}>
            <div style={s.decisionHeader}>
              <span>🤖 AGENT DECISION LOG</span>
              <span style={{ background: '#22c55e', padding: '3px 10px', borderRadius: '4px', fontSize: '11px' }}>AUTO-EXECUTED</span>
            </div>
            {agentDecision.map((row, i) => (
              <div key={i} style={{ ...s.decisionRow, borderBottom: i < agentDecision.length - 1 ? '1px solid #1e293b' : 'none' }}>
                <div style={s.decisionKey}>{row.label}</div>
                <div style={s.decisionVal}>{row.value}</div>
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
            {['Python Agent Loop', 'LLM / Rule Engine', 'Supplier API Integration', 'PostgreSQL', 'Confidence Scoring', 'Audit Trail Logger'].map((t, i) => (
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
