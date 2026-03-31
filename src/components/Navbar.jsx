import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ title }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav style={{
      background: '#0d1117',
      borderBottom: '1px solid #1e293b',
      padding: '0 32px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ color: '#6366f1', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
        FilFlo
      </Link>
      <span style={{ color: '#334155', fontSize: '18px' }}>|</span>
      <span style={{ color: '#94a3b8', fontSize: '14px' }}>{title || 'Project Phases'}</span>
      {!isHome && (
        <Link to="/" style={{
          marginLeft: 'auto',
          background: '#1e293b',
          color: '#94a3b8',
          border: '1px solid #2d3748',
          borderRadius: '6px',
          padding: '5px 14px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          ← Back
        </Link>
      )}
    </nav>
  )
}
