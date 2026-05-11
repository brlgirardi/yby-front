'use client'
// Tela dev/QA para forçar override de persona+versão.
// Em produção retorna notFound(); em dev permite alternar visualmente entre
// estabelecimento, sub-adquirente e adquirente para validar features sem JWT.

import { useState } from 'react'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import { manifests } from '@/features/manifests'
import type { Persona, Version } from '@/features/manifests/types'
import { usePersonaStore } from '@/stores/personaStore'

const IS_DEV_PERSONA_SWITCH_ENABLED = process.env.NODE_ENV !== 'production'

const PERSONA_LABELS: Record<Persona, string> = {
  estabelecimento: 'Estabelecimento Comercial',
  subadquirente: 'Sub-adquirente',
  adquirente: 'Adquirente',
}

const ALL_VERSIONS: Version[] = ['v0', 'v1']

export default function DevPersonaSwitchPage() {
  if (!IS_DEV_PERSONA_SWITCH_ENABLED) {
    notFound()
  }

  const persona = usePersonaStore((s) => s.persona)
  const version = usePersonaStore((s) => s.version)
  const isDevOverride = usePersonaStore((s) => s.isDevOverride)
  const setPersona = usePersonaStore((s) => s.setPersona)
  const resetToDefault = usePersonaStore((s) => s.resetToDefault)

  const [draftPersona, setDraftPersona] = useState<Persona>(persona)
  const [draftVersion, setDraftVersion] = useState<Version>(version)

  const apply = () => setPersona(draftPersona, draftVersion)
  const reset = () => {
    resetToDefault()
    setDraftPersona('subadquirente')
    setDraftVersion('v0')
  }

  return (
    <div style={{ padding: '24px 32px' }}>
      <PageHeader
        title="Modo dev — Trocar persona"
        breadcrumb="Configurações / Dev"
      />

      <div
        style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 4,
          fontSize: 13,
          color: 'rgba(0,0,0,0.65)',
        }}
      >
        ⚠️ Modo desenvolvimento — esta tela só existe fora de produção. Override
        atual:{' '}
        <strong>
          {PERSONA_LABELS[persona]} · {version} {isDevOverride ? '(forçado)' : '(default)'}
        </strong>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 16,
          marginTop: 24,
        }}
      >
        {(Object.keys(PERSONA_LABELS) as Persona[]).map((p) => {
          const personaManifests = manifests[p] as Partial<Record<Version, unknown>>
          const availableVersions = ALL_VERSIONS.filter((v) => personaManifests[v])
          const isSelected = draftPersona === p

          return (
            <div
              key={p}
              style={{
                background: '#fff',
                border: `1px solid ${isSelected ? '#3b82f6' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: 4,
                padding: '20px 24px',
                cursor: availableVersions.length > 0 ? 'pointer' : 'not-allowed',
                opacity: availableVersions.length > 0 ? 1 : 0.5,
              }}
              onClick={() => {
                if (availableVersions.length === 0) return
                setDraftPersona(p)
                if (!availableVersions.includes(draftVersion)) {
                  setDraftVersion(availableVersions[0])
                }
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>
                {PERSONA_LABELS[p]}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 16 }}>
                {availableVersions.length === 0
                  ? 'Nenhuma versão disponível'
                  : `Versões: ${availableVersions.join(', ')}`}
              </div>

              {availableVersions.map((v) => (
                <label
                  key={v}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    padding: '6px 0',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="radio"
                    name={`version-${p}`}
                    checked={isSelected && draftVersion === v}
                    onChange={() => {
                      setDraftPersona(p)
                      setDraftVersion(v)
                    }}
                  />
                  {v}
                </label>
              ))}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button variant="primary" onClick={apply}>
          Aplicar
        </Button>
        <Button variant="ghost" onClick={reset}>
          Resetar para default (Sub-adquirente · v0)
        </Button>
      </div>
    </div>
  )
}
