import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MermaidDiagram from '../components/MermaidDiagram'

const hldDiagram = `flowchart LR
    A["📦 Inventory DB\n(Last 7-90 days sales)"] --> C["🤖 Demand\nPrediction Engine"]
    B["📅 Calendar Data\n(Festivals, Weekends)"] --> C
    W["🌦️ Weather Data"] --> C
    P["🎯 Platform Data\n(Promotions, Trending)"] --> C
    
    C --> D["📈 7-Day Forecast\nper SKU × Store"]
    D --> E["🔴 High Demand\nAlert"]
    D --> F["🟡 Medium Demand\nForecast"]
    D --> G["🟢 Low Demand\nForecast"]
    
    E --> H["⚡ Trigger Early\nReplenishment"]
    
    D --> ACC["📊 Calculate Accuracy\n(MAPE)"]
    ACC --> CHECK{"MAPE\n< 15%?"}
    CHECK -- No --> RETRAIN["🔄 Retrain Model\nwith new data"]
    CHECK -- Yes --> OK["✅ Model performs"]
    RETRAIN --> D
    OK --> H
    
    style A fill:#3b82f6,color:#fff,stroke:#2563eb
    style B fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style W fill:#06b6d4,color:#fff,stroke:#0891b2
    style P fill:#f59e0b,color:#fff,stroke:#d97706
    style C fill:#6366f1,color:#fff,stroke:#4f46e5
    style D fill:#06b6d4,color:#fff,stroke:#0891b2
    style E fill:#ef4444,color:#fff,stroke:#dc2626
    style F fill:#f59e0b,color:#fff,stroke:#d97706
    style G fill:#22c55e,color:#fff,stroke:#16a34a
    style H fill:#f97316,color:#fff,stroke:#ea580c
    style ACC fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style CHECK fill:#f59e0b,color:#fff,stroke:#d97706
    style RETRAIN fill:#6366f1,color:#fff,stroke:#4f46e5
    style OK fill:#22c55e,color:#fff,stroke:#16a34a
`

const lldDiagram = `flowchart TD
    A["Input: SKU + Store + Date"] --> B["Fetch historical sales\nlast 7-90 days"]
    B --> C["Calculate base forecast\navg_daily_sales = sum / days"]
    
    C --> WEATHER["Get weather\nfor tomorrow"]
    C --> PROMO["Check platform\npromotions"]
    C --> PRICE["Check competitor\nprice"]
    
    WEATHER --> D["Calculate multipliers:<br/>- day_of_week_weight<br/>- festival_boost<br/>- weather_multiplier<br/>- promotion_boost<br/>- price_multiplier"]
    PROMO --> D
    PRICE --> D
    
    D --> F["predicted_demand =<br/>base_forecast ×<br/>all_multipliers"]
    
    F --> G{"predicted_demand > 1.5x\nbase_forecast?"}
    
    G -- Yes --> H["🔴 Flag HIGH DEMAND<br/>Priority = CRITICAL"]
    G -- No --> I["Normal forecast<br/>Priority = NORMAL"]
    
    H --> J["Store forecast\nin DB"]
    I --> J
    
    J --> NEXT["Tomorrow: Compare\nforecast vs actual"]
    NEXT --> ACTUAL["actual_sales = sum(sold_today)"]
    ACTUAL --> CALC_ERROR["error_pct = |forecast - actual| / actual"]
    
    CALC_ERROR --> MAPE["Update rolling MAPE<br/>= avg(last_7_errors)"]
    
    MAPE --> CHECK_MAPE{"MAPE\n< 15%?"}
    
    CHECK_MAPE -- Yes --> GOOD["✅ Model ok\nContinue"]
    CHECK_MAPE -- No --> RETRAIN["🔄 Trigger Retraining<br/>- Add 90-day data<br/>- Include new signals<br/>- Retrain model"]
    
    RETRAIN --> DEPLOY["Deploy new model"]
    GOOD --> REPLEN["Feed forecast\ninto Replenishment Engine"]
    DEPLOY --> REPLEN
    
    style A fill:#6366f1,color:#fff,stroke:#4f46e5
    style B fill:#3b82f6,color:#fff,stroke:#2563eb
    style C fill:#3b82f6,color:#fff,stroke:#2563eb
    style WEATHER fill:#06b6d4,color:#fff,stroke:#0891b2
    style PROMO fill:#f59e0b,color:#fff,stroke:#d97706
    style PRICE fill:#f59e0b,color:#fff,stroke:#d97706
    style D fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style F fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style G fill:#f59e0b,color:#fff,stroke:#d97706
    style H fill:#ef4444,color:#fff,stroke:#dc2626
    style I fill:#22c55e,color:#fff,stroke:#16a34a
    style J fill:#06b6d4,color:#fff,stroke:#0891b2
    style ACTUAL fill:#3b82f6,color:#fff,stroke:#2563eb
    style CALC_ERROR fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style MAPE fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style CHECK_MAPE fill:#f59e0b,color:#fff,stroke:#d97706
    style GOOD fill:#22c55e,color:#fff,stroke:#16a34a
    style RETRAIN fill:#6366f1,color:#fff,stroke:#4f46e5
    style DEPLOY fill:#22c55e,color:#fff,stroke:#16a34a
    style REPLEN fill:#06b6d4,color:#fff,stroke:#0891b2
`

const features = [
  { icon: '📅', title: '7-Day Rolling Forecast', desc: 'Predicts demand for the next 7 days for every SKU at every store using a rolling average of the last 7 days of sales.' },
  { icon: '🎉', title: 'Festival & Weekend Boost', desc: 'Automatically applies demand multipliers for weekends, festivals (Diwali, Holi, etc.) and local events.' },
  { icon: '📍', title: 'SKU × Location Granularity', desc: 'Forecasts are not generic — they are specific to each product at each dark store location.' },
  { icon: '⚡', title: 'Early Warning System', desc: 'When predicted demand spikes above 1.5x average, an early warning fires to trigger replenishment before stockout.' },
]

const formula = [
  { label: 'Step 1', text: 'avg_daily_sales = sum(last_7_days_sales) ÷ 7' },
  { label: 'Step 2', text: 'day_weight = 1.3 (weekend) or 1.0 (weekday)' },
  { label: 'Step 3', text: 'festival_boost = 1.5 (festival week) or 1.0 (normal)' },
  { label: 'Result', text: 'predicted_demand = avg_daily_sales × day_weight × festival_boost' },
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
  formulaCard: { background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '10px', overflow: 'hidden' },
  formulaRow: { display: 'flex', gap: '0', borderBottom: '1px solid #1e293b', alignItems: 'center' },
  formulaLabel: { background: '#1e293b', color: '#6366f1', fontSize: '11px', fontWeight: 700, padding: '12px 16px', minWidth: '80px', letterSpacing: '0.05em' },
  formulaText: { padding: '12px 20px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace' },
}

export default function DemandPrediction() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      <Navbar title="Phase 2 — Demand Prediction" />
      <div style={s.container}>
        <div style={s.badge}>PHASE 2 · CORE</div>
        <h1 style={s.title}>Demand Prediction Engine</h1>
        <div style={{ background: '#1e293b', borderLeft: '3px solid #6366f1', padding: '14px 18px', borderRadius: '0 8px 8px 0', color: '#94a3b8', fontSize: '14px', marginBottom: '40px', lineHeight: 1.6 }}>
          AI forecasts demand by SKU × location × day using rolling 7-day averages with
          festival and weekend multipliers — so you never get caught off guard.
        </div>

        {/* ── Demo CTA ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1117 100%)',
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
              📈 See it in action — Live Demo
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Explore 22 real demand forecasts with sparkline charts, confidence scores, spike detection
              and platform filters — all powered by <code style={{ color: '#60a5fa' }}>demand_forecasts.json</code>.
            </div>
          </div>
          <button
            onClick={() => navigate('/demo/demand')}
            style={{
              background: '#2563eb',
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

        {/* Prediction Formula */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Prediction Logic (Simple Formula)</div>
          <div style={s.formulaCard}>
            {formula.map((row, i) => (
              <div key={i} style={{ ...s.formulaRow, borderBottom: i < formula.length - 1 ? '1px solid #1e293b' : 'none' }}>
                <div style={s.formulaLabel}>{row.label}</div>
                <div style={s.formulaText}>{row.text}</div>
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
            {['Python / FastAPI', 'PostgreSQL', 'Pandas', 'Cron Scheduler', 'REST API'].map((t, i) => (
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
