 
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import snapshots from '../../../data/inventory_snapshots.json'
import storesData from '../../../data/stores.json'
import skusData from '../../../data/skus.json'

const skuMap   = Object.fromEntries(skusData.map(s => [s.sku_id, s]))
const storeMap = Object.fromEntries(storesData.map(s => [s.store_id, s]))

const PLATFORMS = ['All', 'Blinkit', 'Zepto', 'Instamart']
const CITIES    = ['All', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Gurgaon', 'Noida']
const STATUSES  = ['All', 'CRITICAL', 'LOW', 'OK']

const statusColor  = { CRITICAL: '#ef4444', LOW: '#f59e0b', OK: '#22c55e' }
const statusBg     = { CRITICAL: '#1f0a0a', LOW: '#1c1505', OK: '#0a1f0a' }
const statusBorder = { CRITICAL: '#7f1d1d', LOW: '#78350f', OK: '#14532d' }
const statusIcon   = { CRITICAL: '🔴', LOW: '🟡', OK: '🟢' }

const platformStyle = p =>
  p === 'Blinkit'   ? { bg: '#1c0a00', color: '#f97316', border: '#7c2d12' } :
  p === 'Zepto'     ? { bg: '#0d0a1f', color: '#8b5cf6', border: '#4c1d95' } :
                      { bg: '#0a1a0a', color: '#22c55e', border: '#14532d' }

const summary = {
  total:    snapshots.length,
  critical: snapshots.filter(r => r.status === 'CRITICAL').length,
  low:      snapshots.filter(r => r.status === 'LOW').length,
  ok:       snapshots.filter(r => r.status === 'OK').length,
}

const platformStats = ['Blinkit', 'Zepto', 'Instamart'].map(p => ({
  name:     p,
  total:    snapshots.filter(r => r.platform === p).length,
  critical: snapshots.filter(r => r.platform === p && r.status === 'CRITICAL').length,
  low:      snapshots.filter(r => r.platform === p && r.status === 'LOW').length,
  ok:       snapshots.filter(r => r.platform === p && r.status === 'OK').length,
}))

const s = {
  page:        { minHeight: '100vh', background: '#0f1117' },
  container:   { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  topRow:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  title:       { fontSize: '22px', fontWeight: 700, color: '#f1f5f9' },
  subtitle:    { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  badge:       { background: '#0a1020', color: '#60a5fa', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.05em', marginRight: '8px' },
  syncBadge:   { background: '#1e293b', color: '#94a3b8', fontSize: '11px', padding: '3px 10px', borderRadius: '4px' },
  statsRow:    { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' },
  platformRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' },
  filterRow:   { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
  filterLabel: { fontSize: '12px', color: '#64748b', fontWeight: 600 },
  filterBtn:   active => ({ padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? '#60a5fa' : '#2d3748'}`, background: active ? '#1e3a5f' : '#1a1f2e', color: active ? '#60a5fa' : '#94a3b8' }),
  table:       { width: '100%', borderCollapse: 'collapse', background: '#1a1f2e', borderRadius: '10px', overflow: 'hidden', border: '1px solid #2d3748' },
  th:          { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', background: '#151a27', borderBottom: '1px solid #2d3748' },
  td:          { padding: '12px 16px', fontSize: '13px', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
  backBtn:     { background: 'transparent', border: '1px solid #2d3748', color: '#94a3b8', borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' },
  searchInput: { marginLeft: 'auto', background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '6px', padding: '6px 12px', color: '#e2e8f0', fontSize: '13px', outline: 'none', minWidth: '200px' },
}

function StatCard({ num, label, color, bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 20px' }}>
      <div style={{ fontSize: '26px', fontWeight: 700, color, marginBottom: '2px' }}>{num}</div>
      <div style={{ fontSize: '12px', color: '#64748b' }}>{label}</div>
    </div>
  )
}

function PlatformCard({ p }) {
  const ps = platformStyle(p.name)
  return (
    <div style={{ background: ps.bg, border: `1px solid ${ps.border}`, borderRadius: '10px', padding: '16px 20px' }}>
      <div style={{ fontSize: '15px', fontWeight: 700, color: ps.color, marginBottom: '12px' }}>{p.name}</div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '12px', color: '#64748b' }}>Total: <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{p.total}</span></div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>🔴 <span style={{ color: '#ef4444', fontWeight: 700 }}>{p.critical}</span></div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>🟡 <span style={{ color: '#f59e0b', fontWeight: 700 }}>{p.low}</span></div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>🟢 <span style={{ color: '#22c55e', fontWeight: 700 }}>{p.ok}</span></div>
      </div>
      <div style={{ marginTop: '10px', height: '6px', borderRadius: '3px', background: '#1e293b', overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${(p.critical/p.total)*100}%`, background: '#ef4444' }} />
        <div style={{ width: `${(p.low/p.total)*100}%`, background: '#f59e0b' }} />
        <div style={{ width: `${(p.ok/p.total)*100}%`, background: '#22c55e' }} />
      </div>
    </div>
  )
}

export default function MultiPlatformSyncDemo() {
  const navigate = useNavigate()
  const [platformFilter, setPlatformFilter] = useState('All')
  const [cityFilter,     setCityFilter]     = useState('All')
  const [statusFilter,   setStatusFilter]   = useState('All')
  const [search,         setSearch]         = useState('')

  const filtered = snapshots.filter(row => {
    const store = storeMap[row.store_id]
    const sku   = skuMap[row.sku_id]
    return (
      (platformFilter === 'All' || row.platform === platformFilter) &&
      (statusFilter   === 'All' || row.status   === statusFilter)   &&
      (cityFilter     === 'All' || store?.city   === cityFilter)     &&
      (!search ||
        sku?.name?.toLowerCase().includes(search.toLowerCase())        ||
        row.sku_id.toLowerCase().includes(search.toLowerCase())        ||
        store?.store_name?.toLowerCase().includes(search.toLowerCase()))
    )
  })

  return (
    <div style={s.page}>
      <Navbar title="Phase 5 — Multi-Platform Sync · Demo" />
      <div style={s.container}>
        <div style={s.topRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={s.badge}>PHASE 5 · CORE</span>
              <span style={s.syncBadge}>🔄 Last Synced: March 31, 2026 — 09:00 AM</span>
            </div>
            <div style={s.title}>Multi-Platform Inventory Sync</div>
            <div style={s.subtitle}>Real-time stock visibility across Blinkit, Zepto & Instamart — one unified view</div>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/multi-platform-sync')}>← Back to Phase 5</button>
        </div>

        <div style={s.statsRow}>
          <StatCard num={summary.total}    label="Total Sync Records"      color="#60a5fa" bg="#0a1020"  border="#1e3a5f" />
          <StatCard num={summary.critical} label="🔴 Critical Stock"       color="#ef4444" bg="#1f0a0a"  border="#7f1d1d" />
          <StatCard num={summary.low}      label="🟡 Low Stock"            color="#f59e0b" bg="#1c1505"  border="#78350f" />
          <StatCard num={summary.ok}       label="🟢 Healthy Stock"        color="#22c55e" bg="#0a1f0a"  border="#14532d" />
        </div>

        <div style={s.platformRow}>
          {platformStats.map(p => <PlatformCard key={p.name} p={p} />)}
        </div>

        <div style={s.filterRow}>
          <span style={s.filterLabel}>PLATFORM:</span>
          {PLATFORMS.map(p => <button key={p} style={s.filterBtn(platformFilter === p)} onClick={() => setPlatformFilter(p)}>{p}</button>)}
          <span style={{ ...s.filterLabel, marginLeft: '12px' }}>STATUS:</span>
          {STATUSES.map(st => <button key={st} style={s.filterBtn(statusFilter === st)} onClick={() => setStatusFilter(st)}>{st}</button>)}
          <span style={{ ...s.filterLabel, marginLeft: '12px' }}>CITY:</span>
          {CITIES.map(c => <button key={c} style={s.filterBtn(cityFilter === c)} onClick={() => setCityFilter(c)}>{c}</button>)}
          <input style={s.searchInput} placeholder="🔍 Search SKU or store…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {['SNAPSHOT', 'SKU', 'PRODUCT', 'PLATFORM', 'STORE', 'CITY', 'STOCK', 'THRESHOLD', 'AVG DAILY', 'DAYS LEFT', 'LAST SYNCED', 'STATUS'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={12} style={{ ...s.td, textAlign: 'center', color: '#64748b', padding: '32px' }}>No records match your filters.</td></tr>
              ) : filtered.map((row, i) => {
                const store = storeMap[row.store_id]
                const sku   = skuMap[row.sku_id]
                const ps    = platformStyle(row.platform)
                const daysColor = row.days_remaining < 1 ? '#ef4444' : row.days_remaining < 2 ? '#f97316' : row.days_remaining < 5 ? '#f59e0b' : '#22c55e'
                const syncTime  = new Date(row.last_synced).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#1a1f2e' : '#161b28' }}>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#64748b', fontSize: '11px' }}>{row.snapshot_id}</td>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#60a5fa', fontSize: '11px' }}>{row.sku_id}</td>
                    <td style={{ ...s.td, fontWeight: 500, fontSize: '12px', maxWidth: '140px' }}>{sku?.name || row.sku_id}</td>
                    <td style={s.td}>
                      <span style={{ display: 'inline-block', background: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, borderRadius: '5px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{row.platform}</span>
                    </td>
                    <td style={{ ...s.td, color: '#94a3b8', fontSize: '12px', maxWidth: '130px' }}>{store?.store_name || row.store_id}</td>
                    <td style={{ ...s.td, color: '#64748b', fontSize: '12px' }}>{store?.city || '—'}</td>
                    <td style={{ ...s.td, fontWeight: 700, color: statusColor[row.status] }}>{row.current_stock}</td>
                    <td style={{ ...s.td, color: '#64748b' }}>{row.threshold}</td>
                    <td style={{ ...s.td, color: '#94a3b8' }}>{row.avg_daily_sales}/day</td>
                    <td style={{ ...s.td, fontWeight: 700, color: daysColor }}>{row.days_remaining}d</td>
                    <td style={{ ...s.td, color: '#475569', fontSize: '12px' }}>🔄 {syncTime}</td>
                    <td style={s.td}>
                      <span style={{ background: statusBg[row.status], color: statusColor[row.status], border: `1px solid ${statusBorder[row.status]}`, borderRadius: '5px', padding: '3px 8px', fontSize: '11px', fontWeight: 700 }}>
                        {statusIcon[row.status]} {row.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#475569', textAlign: 'right' }}>
          Showing {filtered.length} of {snapshots.length} sync records · Data from <code style={{ color: '#60a5fa' }}>inventory_snapshots.json</code>
        </div>
      </div>
    </div>
  )
}
