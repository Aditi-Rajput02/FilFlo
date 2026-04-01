import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import inventoryData from '../../../data/inventory_snapshots.json'
import skusData from '../../../data/skus.json'
import storesData from '../../../data/stores.json'

const skuMap = Object.fromEntries(skusData.map(s => [s.sku_id, s]))
const storeMap = Object.fromEntries(storesData.map(s => [s.store_id, s]))

const statusColor = { CRITICAL: '#ef4444', LOW: '#f59e0b', OK: '#22c55e' }
const statusBg   = { CRITICAL: '#1f0a0a', LOW: '#1c1505', OK: '#0a1f0a' }
const statusBorder = { CRITICAL: '#7f1d1d', LOW: '#78350f', OK: '#14532d' }

const PLATFORMS = ['All', 'Blinkit', 'Zepto', 'Instamart']
const STATUSES  = ['All', 'CRITICAL', 'LOW', 'OK']

const summary = {
  total:    inventoryData.length,
  critical: inventoryData.filter(r => r.status === 'CRITICAL').length,
  low:      inventoryData.filter(r => r.status === 'LOW').length,
  ok:       inventoryData.filter(r => r.status === 'OK').length,
}

/* ─── styles ─────────────────────────────────────────────────────────────── */
const s = {
  page:      { minHeight: '100vh', background: '#0f1117' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },

  topRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
  },
  title:    { fontSize: '22px', fontWeight: 700, color: '#f1f5f9' },
  subtitle: { fontSize: '13px', color: '#64748b', marginTop: '4px' },

  badge: {
    background: '#14532d', color: '#22c55e', fontSize: '11px', fontWeight: 700,
    padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.05em', marginRight: '8px',
  },
  syncBadge: {
    background: '#1e293b', color: '#94a3b8', fontSize: '11px',
    padding: '3px 10px', borderRadius: '4px',
  },

  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' },
  statCard: (bg, border) => ({ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px 20px' }),
  statNum:  (color)      => ({ fontSize: '28px', fontWeight: 700, color, marginBottom: '2px' }),
  statLabel: { fontSize: '12px', color: '#64748b' },

  filterRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' },
  filterLabel: { fontSize: '12px', color: '#64748b', fontWeight: 600 },
  filterBtn: active => ({
    padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
    border:      `1px solid ${active ? '#6366f1' : '#2d3748'}`,
    background:  active ? '#6366f1' : '#1a1f2e',
    color:       active ? '#fff'    : '#94a3b8',
  }),

  table:  { width: '100%', borderCollapse: 'collapse', background: '#1a1f2e', borderRadius: '10px', overflow: 'hidden', border: '1px solid #2d3748' },
  th:     { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', background: '#151a27', borderBottom: '1px solid #2d3748' },
  td:     { padding: '12px 16px', fontSize: '13px', color: '#e2e8f0', borderBottom: '1px solid #1e293b' },

  statusBadge: status => ({
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: statusBg[status], color: statusColor[status],
    border: `1px solid ${statusBorder[status]}`,
    borderRadius: '5px', padding: '3px 10px', fontSize: '11px', fontWeight: 700,
  }),
  platformBadge: platform => ({
    display: 'inline-block',
    background: platform === 'Blinkit' ? '#1c0a00' : platform === 'Zepto' ? '#0d0a1f' : '#0a1a0a',
    color:      platform === 'Blinkit' ? '#f97316' : platform === 'Zepto' ? '#8b5cf6' : '#22c55e',
    border: `1px solid ${platform === 'Blinkit' ? '#7c2d12' : platform === 'Zepto' ? '#4c1d95' : '#14532d'}`,
    borderRadius: '5px', padding: '2px 8px', fontSize: '11px', fontWeight: 600,
  }),
  progressBar: (pct, color) => ({
    height: '6px', borderRadius: '3px', marginTop: '4px', minWidth: '80px',
    background: `linear-gradient(to right, ${color} ${pct}%, #1e293b ${pct}%)`,
  }),

  backBtn: {
    background: 'transparent', border: '1px solid #2d3748', color: '#94a3b8',
    borderRadius: '6px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer',
  },
  searchInput: {
    marginLeft: 'auto', background: '#1a1f2e', border: '1px solid #2d3748',
    borderRadius: '6px', padding: '6px 12px', color: '#e2e8f0', fontSize: '13px',
    outline: 'none', minWidth: '200px',
  },
}

/* ─── component ──────────────────────────────────────────────────────────── */
export default function InventoryDemo() {
  const navigate = useNavigate()
  const [platformFilter, setPlatformFilter] = useState('All')
  const [statusFilter,   setStatusFilter]   = useState('All')
  const [search,         setSearch]         = useState('')

  const filtered = inventoryData.filter(row => {
    const sku   = skuMap[row.sku_id]
    const store = storeMap[row.store_id]
    return (
      (platformFilter === 'All' || row.platform === platformFilter) &&
      (statusFilter   === 'All' || row.status   === statusFilter)   &&
      (!search ||
        sku?.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.sku_id.toLowerCase().includes(search.toLowerCase()) ||
        store?.store_name?.toLowerCase().includes(search.toLowerCase()))
    )
  })

  return (
    <div style={s.page}>
      <Navbar title="Phase 1 — Inventory Dashboard · Demo" />
      <div style={s.container}>

        {/* ── Top Row ── */}
        <div style={s.topRow}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={s.badge}>PHASE 1 · CORE</span>
              <span style={s.syncBadge}>🔄 Last synced: March 31, 2026 — 09:00 AM</span>
            </div>
            <div style={s.title}>Inventory Dashboard</div>
            <div style={s.subtitle}>Real-time stock visibility across Blinkit, Zepto &amp; Instamart dark stores</div>
          </div>
          <button style={s.backBtn} onClick={() => navigate('/inventory')}>← Back to Phase 1</button>
        </div>

        {/* ── Summary Stats ── */}
        <div style={s.statsRow}>
          <div style={s.statCard('#0f1117', '#2d3748')}>
            <div style={s.statNum('#6366f1')}>{summary.total}</div>
            <div style={s.statLabel}>Total SKU × Store Combos</div>
          </div>
          <div style={s.statCard('#1f0a0a', '#7f1d1d')}>
            <div style={s.statNum('#ef4444')}>{summary.critical}</div>
            <div style={s.statLabel}>🔴 Critical — Stockout Risk</div>
          </div>
          <div style={s.statCard('#1c1505', '#78350f')}>
            <div style={s.statNum('#f59e0b')}>{summary.low}</div>
            <div style={s.statLabel}>🟡 Low — Below Threshold</div>
          </div>
          <div style={s.statCard('#0a1f0a', '#14532d')}>
            <div style={s.statNum('#22c55e')}>{summary.ok}</div>
            <div style={s.statLabel}>🟢 OK — Healthy Stock</div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={s.filterRow}>
          <span style={s.filterLabel}>PLATFORM:</span>
          {PLATFORMS.map(p => (
            <button key={p} style={s.filterBtn(platformFilter === p)} onClick={() => setPlatformFilter(p)}>{p}</button>
          ))}
          <span style={{ ...s.filterLabel, marginLeft: '12px' }}>STATUS:</span>
          {STATUSES.map(st => (
            <button key={st} style={s.filterBtn(statusFilter === st)} onClick={() => setStatusFilter(st)}>{st}</button>
          ))}
          <input
            style={s.searchInput}
            placeholder="🔍 Search SKU or store…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── Table ── */}
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {['SKU', 'PRODUCT NAME', 'PLATFORM', 'STORE', 'CURRENT STOCK', 'THRESHOLD', 'AVG DAILY SALES', 'DAYS LEFT', 'STATUS'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...s.td, textAlign: 'center', color: '#64748b', padding: '32px' }}>
                    No records match your filters.
                  </td>
                </tr>
              ) : filtered.map((row, i) => {
                const sku   = skuMap[row.sku_id]
                const store = storeMap[row.store_id]
                const pct   = Math.min(100, Math.round((row.current_stock / row.threshold) * 100))
                const daysColor = row.days_remaining < 2 ? '#ef4444' : row.days_remaining < 5 ? '#f59e0b' : '#22c55e'
                return (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#1a1f2e' : '#161b28' }}>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#6366f1', fontSize: '12px' }}>{row.sku_id}</td>
                    <td style={{ ...s.td, fontWeight: 500 }}>{sku?.name || row.sku_id}</td>
                    <td style={s.td}><span style={s.platformBadge(row.platform)}>{row.platform}</span></td>
                    <td style={{ ...s.td, color: '#94a3b8', fontSize: '12px' }}>{store?.store_name || row.store_id}</td>
                    <td style={s.td}>
                      <div style={{ fontWeight: 700, color: statusColor[row.status] }}>{row.current_stock} units</div>
                      <div style={s.progressBar(pct, statusColor[row.status])} />
                    </td>
                    <td style={{ ...s.td, color: '#64748b' }}>{row.threshold} units</td>
                    <td style={{ ...s.td, color: '#94a3b8' }}>{row.avg_daily_sales}/day</td>
                    <td style={{ ...s.td, fontWeight: 600, color: daysColor }}>{row.days_remaining} days</td>
                    <td style={s.td}>
                      <span style={s.statusBadge(row.status)}>
                        {row.status === 'CRITICAL' ? '🔴' : row.status === 'LOW' ? '🟡' : '🟢'} {row.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#475569', textAlign: 'right' }}>
          Showing {filtered.length} of {inventoryData.length} records ·{' '}
          Data from <code style={{ color: '#6366f1' }}>inventory_snapshots.json</code>
        </div>
      </div>
    </div>
  )
}
