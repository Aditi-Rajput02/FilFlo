import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ── Top nav links (like a normal website) ────────────────────────────────────
const NAV_LINKS = [
  { label: 'Home',          path: '/' },
  { label: 'Overview',      path: '/overview' },
  { label: 'Journey',       path: '/journey' },
  { label: 'Inventory',     path: '/inventory' },
  { label: 'Demand',        path: '/demand' },
  { label: 'Replenishment', path: '/replenishment' },
  { label: 'PO Generator',  path: '/po-generator' },
  { label: 'Sync',          path: '/multi-platform-sync' },
  { label: 'Agent',         path: '/autonomous-reorder-agent' },
]

const HEADER_H = 56

export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const path      = location.pathname

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>

      {/* ── TOP HEADER ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: HEADER_H,
        background: '#0d1117',
        borderBottom: '1px solid #1e293b',
        display: 'flex', alignItems: 'center',
        padding: '0 32px',
        gap: '32px',
        zIndex: 200,
      }}>

        {/* Logo */}
        <span
          onClick={() => navigate('/')}
          style={{
            color: '#6366f1', fontWeight: 800, fontSize: '20px',
            letterSpacing: '-0.5px', cursor: 'pointer', userSelect: 'none',
            flexShrink: 0,
          }}
        >
          RevQ
        </span>

        {/* Desktop nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, flexWrap: 'nowrap', overflow: 'hidden' }}>
          {NAV_LINKS.map((link) => {
            const active = path === link.path
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  background: active ? '#1e1b4b' : 'transparent',
                  color: active ? '#a78bfa' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#1a1f2e'; e.currentTarget.style.color = '#f1f5f9' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' } }}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        {/* Right badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ background: '#14532d', color: '#22c55e', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>4 CORE</span>
          <span style={{ background: '#2e1065', color: '#a78bfa', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>2 FUTURE</span>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'none',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', fontSize: '22px', padding: '4px',
          }}
          className="hamburger"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: HEADER_H, left: 0, right: 0,
          background: '#0d1117', borderBottom: '1px solid #1e293b',
          zIndex: 199, padding: '8px 16px 16px',
        }}>
          {NAV_LINKS.map((link) => {
            const active = path === link.path
            return (
              <div
                key={link.path}
                onClick={() => { navigate(link.path); setMenuOpen(false) }}
                style={{
                  padding: '10px 12px',
                  color: active ? '#a78bfa' : '#94a3b8',
                  fontWeight: active ? 600 : 400,
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  background: active ? '#1e1b4b' : 'transparent',
                  marginBottom: '2px',
                }}
              >
                {link.label}
              </div>
            )
          })}
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <main style={{ paddingTop: HEADER_H }}>
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid #1e293b',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#0d1117',
      }}>
        <div>
          <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '16px', marginRight: '12px' }}>RevQ</span>
          <span style={{ color: '#334155', fontSize: '13px' }}>AI-Powered Autonomous Inventory Replenishment</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {NAV_LINKS.map(link => (
            <span
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{ color: '#475569', fontSize: '12px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              {link.label}
            </span>
          ))}
        </div>
        <span style={{ color: '#1e293b', fontSize: '12px' }}>© 2026 RevQ</span>
      </footer>

      {/* Responsive style for hamburger */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: block !important; }
          nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}
