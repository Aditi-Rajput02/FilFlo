import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import forecastData from '../../../data/demand_forecasts.json'
import skusData from '../../../data/skus.json'
import storesData from '../../../data/stores.json'

const skuMap = Object.fromEntries(skusData.map(s => [s.sku_id, s]))
const storeMap = Object.fromEntries(storesData.map(s => [s.store_id, s]))

const PLATFORMS = ['All', 'Blinkit', 'Zepto', 'Instamart']
const SPIKES = ['All', 'Spike Detected', 'Normal']

const getPlatform = (store_id) => {
  if (store_id.startsWith('BLK')) return 'Blinkit'
  if (store_id.startsWith('ZPT')) return 'Zepto'
  return 'Instamart'
}

const summary = {
  total: forecastData.length,
  spikes: forecastData.filter(r => r.spike_detected).length,
  avgConf: (forecastData.reduce((a, r) => a + r.confidence, 0) / forecastData.length * 100).toFixed(1),
  totalPredicted: forecastData.reduce((a, r) => a + r.predicted_qty, 0),
}

const s = {
  page: { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '22px', fontWeight: 700, color: '#f1f5f9' },
  subtitle: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  badge: { background: '#1e3a5f', color: '#60a5fa', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.05em', marginRight: '8px' },
  syncBadge: { background: '#1e293b', color: '#94a3b8', fontSize: '11px', padding: '3px 10px', borderRadius: '4px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
  filterLabel: { fontSize: '12px', color: '#64748b', fontWeight: 600 },
  filterBtn: active => ({ padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? '#6366f1' : '#2d3748'}`, background: active ? '#6366f1' : '#1a1f2e', color: active ? '#fff' : '#94a3b8' }),
  table: { width: '100%', borderCollapse: 'collapse', background: '#1a1f2e', borderRadius: '10px', overflow: 'hidden', border: '1px solid #2d3748' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', background: '#151a27', borderBottom: '1px solid #2d3748' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
  backBtn: { background: 'transparent', border: '1px solid #2d3748', color: '#94a3b8', borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' },
  searchInput: { marginLeft: 'auto', background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '6px', padding: '6px 12px', color: '#e2e8f0', fontSize: '13px', outline: 'none', minWidth: '200px' },
}

function StatCard({ num, label, color, bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 20px' }}>
      <div style={{ fontSize: '28px', fontWeight: 700, color, marginBottom: '2px' }}>{num}</div>
      <div style={{ fontSize: '12px', color: '#64748b' }}>{label}</div>
    </div>
  )
}

function MiniSparkline({ values }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 80, h = 28, pad = 3
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = pad + (i / (values.length - 1)) * (w - pad * 2)
        const y = h - pad - ((v - min) / range) * (h - pad * 2)
        return <circle key={i} cx={x} cy={y} r="2" fill="#6366f1" />
      })}
    </svg>
  )
}

export default function DemandPredictionDemo() {
  const navigate = useNavigate()
  const [platformFilter, setPlatformFilter] = useState('All')
  const [spikeFilter, setSpikeFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = forecastData.filter(row => {
    const platform = getPlatform(row.store_id)
    const sku = skuMap[row.sku_id]
    const store = storeMap[row.store_id]
    return (
      (platformFilter === 'All' || platform === platformFilter) &&
      (spikeFilter === 'All' || (spikeFilter === 'Spike Detected' ? row.spike_detected : !row.spike_detected)) &&
      (!search ||
        sku?.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.sku_id.toLowerCase().includes(search.toLowerCase()) ||
        store?.store_name?.toLowerCase().includes(search.toLowerCase()))
    )
  })

  const platformColor = p => p === 'Blinkit' ? { bg: '#1c0a00', color: '#f97316', border: '#7c2d12' } : p === 'Zepto' ? { bg: '#0d0a1f', color: '#8b5cf6', border: '#4c1d95' } : { bg: '#0a1a0a', color: '#22c55e', border: '#14532d' }

  return (
    <div style={s.page}>
      <Navbar title="Phase 2 — Demand Prediction · Demo" />
      <div style={s.container}>

        <div style={s.topRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={s.badge}>PHASE 2 · CORE</span>
              <span style={s.syncBadge}>📅 Forecast Date: April 1, 2026</span>
            </div>
            <div style={s.title}>Demand Prediction Engine</div>
            <div style={s.subtitle}>7-day rolling forecasts per SKU × Store with spike detection & confidence scores</div>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/demand')}>← Back to Phase 2</button>
        </div>

        <div style={s.statsRow}>
          <StatCard num={summary.total} label="Total Forecasts" color="#6366f1" bg="#0f1117" border="#2d3748" />
          <StatCard num={summary.spikes} label="⚡ Demand Spikes Detected" color="#f59e0b" bg="#1c1505" border="#78350f" />
          <StatCard num={summary.avgConf + '%'} label="📊 Avg Model Confidence" color="#22c55e" bg="#0a1f0a" border="#14532d" />
          <StatCard num={summary.totalPredicted} label="📦 Total Units Predicted" color="#60a5fa" bg="#0a1020" border="#1e3a5f" />
        </div>

        <div style={s.filterRow}>
          <span style={s.filterLabel}>PLATFORM:</span>
          {PLATFORMS.map(p => <button key={p} style={s.filterBtn(platformFilter === p)} onClick={() => setPlatformFilter(p)}>{p}</button>)}
          <span style={{ ...s.filterLabel, marginLeft: '12px' }}>SPIKE:</span>
          {SPIKES.map(sp => <button key={sp} style={s.filterBtn(spikeFilter === sp)} onClick={() => setSpikeFilter(sp)}>{sp}</button>)}
          <input style={s.searchInput} placeholder="🔍 Search SKU or store…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {['FORECAST ID', 'SKU', 'PRODUCT', 'PLATFORM', 'STORE', 'PREDICTED QTY', 'AVG DAILY', 'LAST 7 DAYS', 'CONFIDENCE', 'SPIKE'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ ...s.td, textAlign: 'center', color: '#64748b', padding: '32px' }}>No records match your filters.</td></tr>
              ) : filtered.map((row, i) => {
                const sku = skuMap[row.sku_id]
                const store = storeMap[row.store_id]
                const platform = getPlatform(row.store_id)
                const pc = platformColor(platform)
                const confColor = row.confidence >= 0.9 ? '#22c55e' : row.confidence >= 0.85 ? '#f59e0b' : '#ef4444'
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#1a1f2e' : '#161b28' }}>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#64748b', fontSize: '11px' }}>{row.forecast_id}</td>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#6366f1', fontSize: '12px' }}>{row.sku_id}</td>
                    <td style={{ ...s.td, fontWeight: 500, fontSize: '13px' }}>{sku?.name || row.sku_id}</td>
                    <td style={s.td}>
                      <span style={{ display: 'inline-block', background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, borderRadius: '5px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{platform}</span>
                    </td>
                    <td style={{ ...s.td, color: '#94a3b8', fontSize: '12px' }}>{store?.store_name || row.store_id}</td>
                    <td style={{ ...s.td, fontWeight: 700, color: '#f1f5f9', fontSize: '15px' }}>{row.predicted_qty} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>units</span></td>
                    <td style={{ ...s.td, color: '#94a3b8' }}>{row.avg_daily}/day</td>
                    <td style={s.td}><MiniSparkline values={row.actual_qty_last_7_days} /></td>
                    <td style={s.td}>
                      <div style={{ fontWeight: 700, color: confColor }}>{(row.confidence * 100).toFixed(0)}%</div>
                      <div style={{ height: '4px', borderRadius: '2px', marginTop: '4px', width: '60px', background: `linear-gradient(to right, ${confColor} ${row.confidence * 100}%, #1e293b ${row.confidence * 100}%)` }} />
                    </td>
                    <td style={s.td}>
                      {row.spike_detected
                        ? <span style={{ background: '#1c1505', color: '#f59e0b', border: '1px solid #78350f', borderRadius: '5px', padding: '3px 8px', fontSize: '11px', fontWeight: 700 }}>⚡ SPIKE</span>
                        : <span style={{ background: '#0a1f0a', color: '#22c55e', border: '1px solid #14532d', borderRadius: '5px', padding: '3px 8px', fontSize: '11px', fontWeight: 700 }}>✓ NORMAL</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#475569', textAlign: 'right' }}>
          Showing {filtered.length} of {forecastData.length} forecasts · Data from <code style={{ color: '#6366f1' }}>demand_forecasts.json</code>
        </div>
      </div>
    </div>
  )
}
