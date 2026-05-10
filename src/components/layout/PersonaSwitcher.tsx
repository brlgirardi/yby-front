'use client'
// Switcher de persona/versão exibido no GlobalHeader.
//
// Demo navegável (sem JWT real) — usuário troca livremente entre as personas
// Estabelecimento / Sub-adquirente / Adquirente para ver os 3 fluxos. Sempre
// visível e sempre interativo.

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/shared/Icon'
import { manifests } from '@/features/manifests'
import { getDefaultRouteForPersona } from '@/features/manifests/routes'
import type { Persona, PersonaManifest, Version } from '@/features/manifests/types'
import { usePersonaStore } from '@/stores/personaStore'

const PERSONA_ORDER: Persona[] = ['estabelecimento', 'subadquirente', 'adquirente']

const PERSONA_LABELS: Record<Persona, string> = {
  estabelecimento: 'Estabelecimento Comercial',
  subadquirente: 'Sub-adquirente',
  adquirente: 'Adquirente',
}

const PERSONA_SHORT: Record<Persona, string> = {
  estabelecimento: 'Estabelecimento',
  subadquirente: 'Sub-adquirente',
  adquirente: 'Adquirente',
}

interface AvailableEntry {
  persona: Persona
  version: Version
  label: string
}

function buildAvailable(): AvailableEntry[] {
  const entries: AvailableEntry[] = []
  PERSONA_ORDER.forEach((p) => {
    const personaMap = manifests[p] as Partial<Record<Version, PersonaManifest | null>>
    ;(['v0', 'v1'] as Version[]).forEach((v) => {
      const m = personaMap[v]
      if (m) {
        entries.push({ persona: p, version: v, label: m.label })
      }
    })
  })
  return entries
}

// ───────── visual styles ─────────

const baseTagStyle = {
  fontSize: 12,
  borderRadius: 2,
  padding: '1px 8px',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  lineHeight: '20px',
}

const defaultTagStyle = {
  ...baseTagStyle,
  background: 'rgba(24,144,255,0.1)',
  color: '#1890FF',
  border: '1px solid #91d5ff',
}

// ───────── component ─────────

export default function PersonaSwitcher() {
  const router = useRouter()
  const persona = usePersonaStore((s) => s.persona)
  const version = usePersonaStore((s) => s.version)
  const setPersona = usePersonaStore((s) => s.setPersona)

  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Click-outside / Escape fecham
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const personaShort = PERSONA_SHORT[persona] ?? 'Sub-adquirente'
  const available = buildAvailable()

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Clique para trocar de persona (Estabelecimento / Sub-adquirente / Adquirente)"
        style={{
          ...defaultTagStyle,
          cursor: 'pointer',
          font: 'inherit',
          letterSpacing: 'inherit',
        }}
      >
        {personaShort} · {version}
        <Icon name="chevronDown" size={10} />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: 240,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 4,
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            padding: '6px 0',
            zIndex: 200,
          }}
        >
          <div
            style={{
              padding: '6px 12px',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: 'rgba(0,0,0,0.45)',
              borderBottom: '1px solid rgba(0,0,0,0.04)',
            }}
          >
            Trocar de persona
          </div>

          {available.map(({ persona: p, version: v, label }) => {
            const isCurrent = p === persona && v === version
            return (
              <button
                key={`${p}-${v}`}
                role="menuitemradio"
                aria-checked={isCurrent}
                onClick={() => {
                  setPersona(p, v)
                  setOpen(false)
                  router.push(getDefaultRouteForPersona(p))
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: isCurrent ? 'rgba(24,144,255,0.06)' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: 13,
                  color: 'rgba(0,0,0,0.85)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.03)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }
                }}
              >
                <span>
                  {PERSONA_LABELS[p]} · <span style={{ color: 'rgba(0,0,0,0.55)' }}>{v}</span>
                </span>
                {isCurrent && <Icon name="checkCircle" size={14} color="#1890FF" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
