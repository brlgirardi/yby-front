'use client'

import { useEffect } from 'react'
import changelog from '@/data/changelog.json'

const TAG_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  Feature:  { bg: '#E6F7FF', color: '#003A8C', border: '#91D5FF' },
  UX:       { bg: '#F9F0FF', color: '#531DAB', border: '#D3ADF7' },
  Fix:      { bg: '#FFF7E6', color: '#873800', border: '#FFD591' },
  Refactor: { bg: '#F5F5F5', color: 'rgba(0,0,0,0.65)', border: '#D9D9D9' },
  Init:     { bg: '#F6FFED', color: '#237804', border: '#D9F7BE' },
}

type Props = { open: boolean; onClose: () => void }

export default function ChangelogModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 400,
        background: '#fff', zIndex: 1001, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        animation: 'slideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Histórico de versões</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>Yby Front — Sub-adquirente backoffice</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', fontSize: 18, lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Versions list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {changelog.map((entry, idx) => {
            const tag = TAG_STYLE[entry.tag] ?? TAG_STYLE['Refactor']
            const isLatest = idx === 0
            return (
              <div
                key={entry.version}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f5f5f5',
                  background: isLatest ? '#fafafa' : '#fff',
                }}
              >
                {/* Version row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.85)', fontFamily: 'Roboto Mono, monospace' }}>
                    v{entry.version}
                  </span>
                  {isLatest && (
                    <span style={{ background: '#1890FF', color: '#fff', fontSize: 10, fontWeight: 600, borderRadius: 2, padding: '1px 6px', letterSpacing: '0.3px' }}>
                      ATUAL
                    </span>
                  )}
                  <span style={{ background: tag.bg, color: tag.color, border: `1px solid ${tag.border}`, fontSize: 11, borderRadius: 2, padding: '1px 6px' }}>
                    {entry.tag}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>
                    {entry.date}
                  </span>
                </div>

                {/* Title */}
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.75)', marginBottom: 8 }}>
                  {entry.title}
                </div>

                {/* Items */}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {entry.items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(0,0,0,0.55)', marginBottom: 4, lineHeight: '1.5' }}>
                      <span style={{ color: '#1890FF', flexShrink: 0, marginTop: 1 }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Commit hash */}
                {entry.commit && entry.commit !== 'HEAD' && (
                  <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(0,0,0,0.25)', fontFamily: 'Roboto Mono, monospace' }}>
                    {entry.commit}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  )
}
