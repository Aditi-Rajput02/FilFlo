import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#4f46e5',
    lineColor: '#94a3b8',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    background: '#0f1117',
    mainBkg: '#1e293b',
    nodeBorder: '#4f46e5',
    clusterBkg: '#1e293b',
    titleColor: '#e2e8f0',
    edgeLabelBackground: '#1e293b',
    fontFamily: 'Inter, sans-serif',
  },
})

let idCounter = 0

export default function MermaidDiagram({ chart }) {
  const ref = useRef(null)
  const id = useRef(`mermaid-${++idCounter}`)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = ''
      mermaid.render(id.current, chart).then(({ svg }) => {
        ref.current.innerHTML = svg
      })
    }
  }, [chart])

  return (
    <div
      ref={ref}
      style={{
        background: '#1a1f2e',
        borderRadius: '12px',
        padding: '24px',
        overflowX: 'auto',
        border: '1px solid #2d3748',
      }}
    />
  )
}
