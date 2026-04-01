import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import poData from '../../../data/purchase_orders.json'

const STATUSES  = ['All', 'CONFIRMED', 'PENDING_APPROVAL', 'SENT_TO_SUPPLIER', 'DRAFT', 'SCHEDULED']
const PLATFORMS = ['All', 'Blinkit', 'Zepto', 'Instamart']

const getPlatform = store_name =>
  store_name.includes('Blinkit') ? 'Blinkit' :
  store_name.includes('Zepto')   ? 'Zepto'   : 'Instamart'

const statusColor  = { CONFIRMED: '#22c55e', PENDING_APPROVAL: '#f59e0b', SENT_TO_SUPPLIER: '#60a5fa', DRAFT: '#94a3b8', SCHEDULED: '#a78bfa' }
const statusBg     = { CONFIRMED: '#0a1f0a', PENDING_APPROVAL: '#1c1505', SENT_TO_SUPPLIER: '#0a1020', DRAFT: '#1a1f2e', SCHEDULED: '#0d0a1f' }
const statusBorder = { CONFIRMED: '#14532d', PENDING_APPROVAL: '#78350f', SENT_TO_SUPPLIER: '#1e3a5f', DRAFT: '#2d3748', SCHEDULED: '#4c1d95' }
const statusLabel  = { CONFIRMED: '✅ CONFIRMED', PENDING_APPROVAL: '⏳ PENDING APPROVAL', SENT_TO_SUPPLIER: '📧 SENT TO SUPPLIER', DRAFT: '📝 DRAFT', SCHEDULED: '🕐 SCHEDULED' }

const platformStyle = p =>
  p === 'Blinkit' ? { bg: '#1c0a00', color: '#f97316', border: '#7c2d12' } :
  p === 'Zepto'   ? { bg: '#0d0a1f', color: '#8b5cf6', border: '#4c1d95' } :
                    { bg: '#0a1a0a', color: '#22c55e', border: '#14532d' }

const summary = {
  total:      poData.length,
  confirmed:  poData.filter(r => r.status === 'CONFIRMED').length,
  autoGen:    poData.filter(r => r.auto_generated).length,
  totalValue: poData.reduce((a, r) => a + r.total_cost, 0),
}

const s = {
  page:      { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' },
  topRow:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  title:     { fontSize: '22px', fontWeight: 700, color: '#f1f5f9' },
  subtitle:  { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  badge:     { background: '#1c0a00', color: '#f97316', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.05em', marginRight: '8px' },
  syncBadge: { background: '#1e293b', color: '#94a3b8', fontSize: '11px', padding: '3px 10px', borderRadius: '4px' },
  statsRow:  { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
  filterLabel: { fontSize: '12px', color: '#64748b', fontWeight: 600 },
  filterBtn: active => ({ padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? '#f97316' : '#2d3748'}`, background: active ? '#f97316' : '#1a1f2e', color: active ? '#fff' : '#94a3b8' }),
  table:     { width: '100%', borderCollapse: 'collapse', background: '#1a1f2e', borderRadius: '10px', overflow: 'hidden', border: '1px solid #2d3748' },
  th:        { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', background: '#151a27', borderBottom: '1px solid #2d3748' },
  td:        { padding: '12px 16px', fontSize: '13px', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },
  backBtn:   { background: 'transparent', border: '1px solid #2d3748', color: '#94a3b8', borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' },
  searchInput: { marginLeft: 'auto', background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: '6px', padding: '6px 12px', color: '#e2e8f0', fontSize: '13px', outline: 'none', minWidth: '200px' },
}

function StatCard({ num, label, color, bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 20px' }}>
      <div style={{ fontSize: '24px', fontWeight: 700, color, marginBottom: '2px' }}>{num}</div>
      <div style={{ fontSize: '12px', color: '#64748b' }}>{label}</div>
    </div>
  )
}

export default function POGeneratorDemo() {
  const navigate = useNavigate()
  const [statusFilter,   setStatusFilter]   = useState('All')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [autoFilter,     setAutoFilter]     = useState('All')
  const [search,         setSearch]         = useState('')

  const filtered = poData.filter(row => {
    const platform = getPlatform(row.store_name)
    return (
      (statusFilter   === 'All' || row.status === statusFilter) &&
      (platformFilter === 'All' || platform   === platformFilter) &&
      (autoFilter     === 'All' || (autoFilter === 'Auto' ? row.auto_generated : !row.auto_generated)) &&
      (!search ||
        row.po_id.toLowerCase().includes(search.toLowerCase())        ||
        row.sku_name.toLowerCase().includes(search.toLowerCase())     ||
        row.store_name.toLowerCase().includes(search.toLowerCase())   ||
        row.supplier_name.toLowerCase().includes(search.toLowerCase()))
    )
  })

  return (
    <div style={s.page}>
      <Navbar title="Phase 4 — PO Generator · Demo" />
      <div style={s.container}>

        {/* ── Top Row ── */}
        <div style={s.topRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={s.badge}>PHASE 4 · CORE</span>
              <span style={s.syncBadge}>📋 Generated: March 31, 2026 — 09:06 AM</span>
            </div>
            <div style={s.title}>Purchase Order Generator</div>
            <div style={s.subtitle}>Auto-generated POs from replenishment suggestions — sent directly to suppliers</div>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/po-generator')}>← Back to Phase 4</button>
        </div>

        {/* ── Stats ── */}
        <div style={s.statsRow}>
          <StatCard num={summary.total}     label="Total Purchase Orders"       color="#f97316" bg="#1c0a00"  border="#7c2d12" />
          <StatCard num={summary.confirmed} label="✅ Confirmed by Supplier"    color="#22c55e" bg="#0a1f0a"  border="#14532d" />
          <StatCard num={summary.autoGen}   label="🤖 Auto-Generated by AI"     color="#60a5fa" bg="#0a1020"  border="#1e3a5f" />
          <StatCard num={`₹${summary.totalValue.toLocaleString()}`} label="💰 Total PO Value" color="#f59e0b" bg="#1c1505" border="#78350f" />
        </div>

        {/* ── Filters ── */}
        <div style={s.filterRow}>
          <span style={s.filterLabel}>STATUS:</span>
          {STATUSES.map(st => <button key={st} style={s.filterBtn(statusFilter === st)} onClick={() => setStatusFilter(st)}>{st === 'PENDING_APPROVAL' ? 'PENDING' : st === 'SENT_TO_SUPPLIER' ? 'SENT' : st}</button>)}
          <span style={{ ...s.filterLabel, marginLeft: '12px' }}>PLATFORM:</span>
          {PLATFORMS.map(p => <button key={p} style={s.filterBtn(platformFilter === p)} onClick={() => setPlatformFilter(p)}>{p}</button>)}
          <span style={{ ...s.filterLabel, marginLeft: '12px' }}>SOURCE:</span>
          {['All', 'Auto', 'Manual'].map(a => <button key={a} style={s.filterBtn(autoFilter === a)} onClick={() => setAutoFilter(a)}>{a}</button>)}
          <input style={s.searchInput} placeholder="🔍 Search PO, SKU, store, supplier…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* ── Table ── */}
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {['PO ID', 'SKU', 'PRODUCT', 'PLATFORM', 'STORE', 'SUPPLIER', 'QTY', 'UNIT COST', 'TOTAL', 'DELIVERY', 'SOURCE', 'STATUS'].map(h => (
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
                const deliveryDate = new Date(row.expected_delivery)
                const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#1a1f2e' : '#161b28' }}>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#f97316', fontSize: '12px', fontWeight: 700 }}>{row.po_id}</td>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#6366f1', fontSize: '11px' }}>{row.sku_id}</td>
                    <td style={{ ...s.td, fontWeight: 500, maxWidth: '150px', fontSize: '12px' }}>{row.sku_name}</td>
                    <td style={s.td}>
                      <span style={{ display: 'inline-block', background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, borderRadius: '5px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{platform}</span>
                    </td>
                    <td style={{ ...s.td, color: '#94a3b8', fontSize: '12px', maxWidth: '130px' }}>{row.store_name}</td>
                    <td style={{ ...s.td, color: '#cbd5e1', fontSize: '12px', maxWidth: '150px' }}>{row.supplier_name}</td>
                    <td style={{ ...s.td, fontWeight: 700, color: '#f1f5f9' }}>{row.qty_ordered} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>units</span></td>
                    <td style={{ ...s.td, color: '#94a3b8' }}>₹{row.unit_cost}</td>
                    <td style={{ ...s.td, fontWeight: 700, color: '#f59e0b' }}>₹{row.total_cost.toLocaleString()}</td>
                    <td style={{ ...s.td, color: '#60a5fa', fontSize: '12px' }}>{deliveryStr}</td>
                    <td style={s.td}>
                      {row.auto_generated
                        ? <span style={{ background: '#0a1020', color: '#60a5fa', border: '1px solid #1e3a5f', borderRadius: '5px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>🤖 AUTO</span>
                        : <span style={{ background: '#1a1f2e', color: '#94a3b8', border: '1px solid #2d3748', borderRadius: '5px', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>👤 MANUAL</span>
                      }
                    </td>
                    <td style={s.td}>
                      <span style={{ background: statusBg[row.status], color: statusColor[row.status], border: `1px solid ${statusBorder[row.status]}`, borderRadius: '5px', padding: '3px 8px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {statusLabel[row.status]}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#475569', textAlign: 'right' }}>
          Showing {filtered.length} of {poData.length} purchase orders · Data from <code style={{ color: '#f97316' }}>purchase_orders.json</code>
        </div>
      </div>
    </div>
  )
}
