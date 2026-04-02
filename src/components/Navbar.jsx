// Navbar is now a lightweight page-title breadcrumb bar.
// Global navigation (header + sidebar) is handled by AppShell.
export default function Navbar({ title }) {
  return (
    <div style={{
      padding: '20px 28px 0',
      marginBottom: '4px',
    }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: '#475569',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: '4px',
      }}>
        RevQ
      </div>
      <h1 style={{
        fontSize: '22px',
        fontWeight: 700,
        color: '#f1f5f9',
        margin: 0,
        lineHeight: 1.2,
      }}>
        {title || 'Project Phases'}
      </h1>
      <div style={{
        height: '1px',
        background: '#1e293b',
        marginTop: '16px',
      }} />
    </div>
  )
}
