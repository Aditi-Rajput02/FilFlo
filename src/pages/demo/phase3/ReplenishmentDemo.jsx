import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import replenData from '../../../data/replenishment_suggestions.json'

const URGENCIES = ['All', 'CRITICAL', 'LOW', 'NORMAL']
const STATUSES  = ['All', 'PENDING', 'AUTO_ORDERED', 'SCHEDULED']
const PLATFORMS = ['All', 'Blinkit', 'Zepto', 'Instamart']

const getPlatform = store_name =>
  store_name.includes('Blinkit') ? 'Blinkit' :
  store_name.includes('Zepto')   ? 'Zepto'   : 'Instamart'

const urgencyColor  = { CRITICAL: '#ef4444', LOW: '#f59e0b', NORMAL: '#22c55e' }
const urgencyBg     = { CRITICAL: '#1f0a0a', LOW: '#1c1505', NORMAL: '#0a1f0a' }
const urgencyBorder = { CRITICAL: '#7f1d1d', LOW: '#78350f', NORMAL: '#14532d' }

const statusColor  = { PENDING: '#f59e0b', AUTO_ORDERED: '#22c55e', SCHEDULED: '#6366f1' }
const statusBg     = { PENDING: '#1c1505', AUTO_ORDERED: '#0a1f0a', SCHEDULED: '#0d0a1f' }
const statusBorder = { PENDING: '#78350f', AUTO_ORDERED: '#14532d', SCHEDULED: '#4c1d95' }

const platformStyle = p =>
  p === 'Blinkit' ? { bg: '#1c0a00', color: '#f97316', border: '#7c2d12' } :
  p === 'Zepto'   ? { bg: '#0d0a1f', color: '#8b5cf6', border: '#4c1d95' } :
                    { bg: '#0a1a0a', color: '#22c55e', border: '#14532d' }

const summary = {
  total:       replenData.length,
  critical:    replenData.filter(r => r.urgency === 'CRITICAL').length,
  autoOrdered: replenData.filter(r => r.status === 'AUTO_ORDERED').length,
  totalCost:   replenData.reduce((a, r) => a + r.estimated_cost, 0),
}

const s = {
  page:      { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  topRow:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  title:     { fontSize: '22px', fontWeight: 700, color: '#f1f5f9' },
  subtitle:  { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  badge:     { background: '#2d1b4e', color: '#a78bfa', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.05em', marginRight: '8px' },
  syncBadge: { background: '#1e293b', color: '#94a3b8', fontSize: '11px', padding: '3px 10px', borderRadius: '4px' },
  statsRow:  { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
  filterLabel: { fontSize: '12px', color: '#64748b', fontWeight: 600 },
  filterBtn: active => ({ padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? '#8b5cf6' : '#2d3748'}`, background: active ? '#8b5cf6' : '#1a1f2e', color: active ? '#fff' : '#94a3b8' }),
  table:     { width: '100%', borderCollapse: 'collapse', background: '#1a1f2e', borderRadius: '10px', overflow: 'hidden', border: '1px solid #2d3748' },
  th:        { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', background: '#151a27', borderBottom: '1px solid #2d3748' },
  td:        { padding: '12px 16px', fontSize: '13px', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
  backBtn:   { background: 'transparent', border: '1px solid #2d3748', color: '#94a3b8', borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' },
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

export default function ReplenishmentDemo() {
  const navigate = useNavigate()
  const [urgencyFilter,  setUrgencyFilter]  = useState('All')
  const [statusFilter,   setStatusFilter]   = useState('All')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [search,         setSearch]         = useState('')

  const filtered = replenData.filter(row => {
    const platform = getPlatform(row.store_name)
    return (
      (urgencyFilter  === 'All' || row.urgency === urgencyFilter) &&
      (statusFilter   === 'All' || row.status  === statusFilter)  &&
      (platformFilter === 'All' || platform    === platformFilter) &&
      (!search ||
        row.sku_name.toLowerCase().includes(search.toLowerCase())   ||
        row.store_name.toLowerCase().includes(search.toLowerCase()) ||
        row.suggestion_id.toLowerCase().includes(search.toLowerCase()))
    )
  })

  return (
    <div style={s.page}>
      <Navbar title="Phase 3 — Replenishment Suggestions · Demo" />
      <div style={s.container}>

        {/* ── Top Row ── */}
        <div style={s.topRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={s.badge}>PHASE 3 · CORE</span>
              <span style={s.syncBadge}>🕘 Generated: March 31, 2026 — 09:05 AM</span>
            </div>
            <div style={s.title}>Replenishment Suggestions</div>
            <div style={s.subtitle}>AI-generated reorder recommendations ranked by urgency across all dark stores</div>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/replenishment')}>← Back to Phase 3</button>
        </div>

        {/* ── Stats ── */}
        <div style={s.statsRow}>
          <StatCard num={summary.total}       label="Total Suggestions"          color="#a78bfa" bg="#0d0a1f"  border="#4c1d95" />
          <StatCard num={summary.critical}    label="🔴 Critical — Act Now"      color="#ef4444" bg="#1f0a0a"  border="#7f1d1d" />
          <StatCard num={summary.autoOrdered} label="✅ Auto-Ordered by Agent"   color="#22c55e" bg="#0a1f0a"  border="#14532d" />
          <StatCard num={`₹${summary.totalCost.toLocaleString()}`} label="💰 Total Estimated Cost" color="#f59e0b" bg="#1c1505" border="#78350f" />
        </div>

        {/* ── Filters ── */}
        <div style={s.filterRow}>
          <span style={s.filterLabel}>URGENCY:</span>
          {URGENCIES.map(u => <button key={u} style={s.filterBtn(urgencyFilter === u)} onClick={() => setUrgencyFilter(u)}>{u}</button>)}
          <span style={{ ...s.filterLabel, marginLeft: '12px' }}>STATUS:</span>
          {STATUSES.map(st => <button key={st} style={s.filterBtn(statusFilter === st)} onClick={() => setStatusFilter(st)}>{st}</button>)}
          <span style={{ ...s.filterLabel, marginLeft: '12px' }}>PLATFORM:</span>
          {PLATFORMS.map(p => <button key={p} style={s.filterBtn(platformFilter === p)} onClick={() => setPlatformFilter(p)}>{p}</button>)}
          <input style={s.searchInput} placeholder="🔍 Search SKU or store…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* ── Table ── */}
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {['ID', 'SKU', 'PRODUCT', 'PLATFORM', 'STORE', 'STOCK LEFT', 'DAYS LEFT', 'SUGGEST QTY', 'EST. COST', 'REASON', 'STATUS', 'URGENCY'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={12} style={{ ...s.td, textAlign: 'center', color: '#64748b', padding: '32px' }}>No records match your filters.</td></tr>
              ) : filtered.map((row, i) => {
                const platform = getPlatform(row.store_name)
                const pc = platformStyle(platform)
                const daysColor = row.days_remaining < 1 ? '#ef4444' : row.days_remaining < 2 ? '#f97316' : row.days_remaining < 4 ? '#f59e0b' : '#22c55e'
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#1a1f2e' : '#161b28' }}>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#64748b', fontSize: '11px' }}>{row.suggestion_id}</td>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#a78bfa', fontSize: '12px' }}>{row.sku_id}</td>
                    <td style={{ ...s.td, fontWeight: 500, maxWidth: '160px' }}>{row.sku_name}</td>
                    <td style={s.td}>
                      <span style={{ display: 'inline-block', background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, borderRadius: '5px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{platform}</span>
                    </td>
                    <td style={{ ...s.td, color: '#94a3b8', fontSize: '12px', maxWidth: '140px' }}>{row.store_name}</td>
                    <td style={{ ...s.td, fontWeight: 700, color: urgencyColor[row.urgency] }}>{row.current_stock} units</td>
                    <td style={{ ...s.td, fontWeight: 700, color: daysColor }}>{row.days_remaining}d</td>
                    <td style={{ ...s.td, fontWeight: 700, color: '#f1f5f9' }}>{row.suggested_qty} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>units</span></td>
                    <td style={{ ...s.td, color: '#f59e0b', fontWeight: 600 }}>₹{row.estimated_cost.toLocaleString()}</td>
                    <td style={{ ...s.td, color: '#64748b', fontSize: '12px', maxWidth: '200px', lineHeight: 1.4 }}>{row.reason}</td>
                    <td style={s.td}>
                      <span style={{ background: statusBg[row.status], color: statusColor[row.status], border: `1px solid ${statusBorder[row.status]}`, borderRadius: '5px', padding: '3px 8px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {row.status === 'AUTO_ORDERED' ? '✅ AUTO ORDERED' : row.status === 'SCHEDULED' ? '🕐 SCHEDULED' : '⏳ PENDING'}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ background: urgencyBg[row.urgency], color: urgencyColor[row.urgency], border: `1px solid ${urgencyBorder[row.urgency]}`, borderRadius: '5px', padding: '3px 8px', fontSize: '11px', fontWeight: 700 }}>
                        {row.urgency === 'CRITICAL' ? '🔴' : row.urgency === 'LOW' ? '🟡' : '🟢'} {row.urgency}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#475569', textAlign: 'right' }}>
          Showing {filtered.length} of {replenData.length} suggestions · Data from <code style={{ color: '#a78bfa' }}>replenishment_suggestions.json</code>
        </div>
      </div>
    </div>
  )
}
