'use client'
// src/features/subadquirente/v1/MerchantOnboarding/tabs/TerminaisTab.tsx
// Tab "Terminais" — 1 white card com 2 sub-cards de produto (CP / CNP).
// Cada produto: lista de terminais (maquininhas / gateways).
// Cada terminal: identificação + N vínculos adquirente+TID.
// Adquirente do vínculo limita-se aos vinculados em Canais do mesmo produto.
// Spec UX: Pixel (2026-05-14).

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, CreditCard, ShoppingCart, Trash2 } from 'lucide-react'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import { getProviders, type ProviderOption } from '@/services/providersService'
import {
  type CanalConfig,
  type ChannelKey,
  type MerchantFormData,
  type Terminal,
  type TerminalVinculo,
} from '../types'

interface TerminaisTabProps {
  form: MerchantFormData
  onChange: (next: MerchantFormData) => void
  readonly?: boolean
}

interface ChannelDef {
  id: ChannelKey
  label: string
  description: string
  icon: React.ReactNode
}

const CHANNELS: ChannelDef[] = [
  {
    id: 'cp',
    label: 'Cartão Presente — CP',
    description: 'Esse canal habilita transações em maquininhas (POS) e TEF.',
    icon: <CreditCard size={20} color="#1677ff" />,
  },
  {
    id: 'cnp',
    label: 'Cartão não presente — CNP',
    description: 'Esse canal habilita link de pagamentos e gateway para e-commerce.',
    icon: <ShoppingCart size={20} color="#1677ff" />,
  },
]

function newId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function adquirenteLabel(adquirenteId: string, providers: ProviderOption[]): string {
  return providers.find((a) => a.value === adquirenteId)?.label ?? adquirenteId
}

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 2,
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

const CARD_TITLE: React.CSSProperties = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: 20,
  fontWeight: 500,
  color: '#21272A',
  lineHeight: '28px',
  margin: 0,
}

const DIVIDER: React.CSSProperties = {
  border: 0,
  borderTop: '1px solid #f0f0f0',
  margin: 0,
}

export default function TerminaisTab({ form, onChange, readonly = false }: TerminaisTabProps) {
  const [providers, setProviders] = useState<ProviderOption[]>([])

  useEffect(() => {
    let cancelled = false
    getProviders().then((list) => {
      if (!cancelled) setProviders(list)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function setTerminais(channel: ChannelKey, next: Terminal[]) {
    onChange({ ...form, terminais: { ...form.terminais, [channel]: next } })
  }

  return (
    <div style={CARD}>
      <h3 style={CARD_TITLE}>Terminais</h3>
      <hr aria-hidden style={DIVIDER} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {CHANNELS.map((ch) => (
          <ChannelTerminalsCard
            key={ch.id}
            def={ch}
            canal={form.canais[ch.id]}
            terminais={form.terminais[ch.id]}
            providers={providers}
            readonly={readonly}
            onChange={(next) => setTerminais(ch.id, next)}
          />
        ))}
      </div>
    </div>
  )
}

interface ChannelTerminalsCardProps {
  def: ChannelDef
  canal: CanalConfig
  terminais: Terminal[]
  providers: ProviderOption[]
  readonly: boolean
  onChange: (next: Terminal[]) => void
}

function ChannelTerminalsCard({ def, canal, terminais, providers, readonly, onChange }: ChannelTerminalsCardProps) {
  const [open, setOpen] = useState(true)
  const disabledChannel = !canal.enabled
  const noAdquirentes = canal.enabled && canal.adquirentes.length === 0

  function addTerminal() {
    onChange([...terminais, { id: newId('term'), identificacao: '', vinculos: [{ id: newId('vinc'), adquirenteId: '', tid: '' }] }])
  }

  function updateTerminal(id: string, patch: Partial<Terminal>) {
    onChange(terminais.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  function removeTerminal(id: string) {
    onChange(terminais.filter((t) => t.id !== id))
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '16px 20px',
        gap: 12,
        opacity: disabledChannel ? 0.5 : 1,
      }}>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', flex: 1, minWidth: 0 }}
          onClick={() => setOpen((v) => !v)}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: '#e6f4ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {def.icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#21272A' }}>{def.label}</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{def.description}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Recolher' : 'Expandir'}
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#999' }}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {open && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
          {disabledChannel ? (
            <div style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: '16px 0' }}>
              Habilite este canal em &quot;Canais&quot; para adicionar terminais.
            </div>
          ) : noAdquirentes ? (
            <div style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: '16px 0' }}>
              Adicione adquirentes em &quot;Canais&quot; antes de cadastrar terminais.
            </div>
          ) : (
            <>
              {terminais.length === 0 && (
                <div style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
                  Nenhum terminal cadastrado. Clique em &quot;Adicionar terminal&quot; para iniciar.
                </div>
              )}

              {terminais.map((terminal) => (
                <TerminalBlock
                  key={terminal.id}
                  terminal={terminal}
                  canalAdquirentes={canal.adquirentes}
                  providers={providers}
                  readonly={readonly}
                  onChange={(patch) => updateTerminal(terminal.id, patch)}
                  onRemove={() => removeTerminal(terminal.id)}
                />
              ))}

              {!readonly && (
                <button
                  type="button"
                  onClick={addTerminal}
                  style={{
                    width: '100%',
                    marginTop: 4,
                    padding: '10px 16px',
                    border: '1px dashed #d9d9d9',
                    background: 'transparent',
                    borderRadius: 2,
                    color: 'rgba(0,0,0,0.65)',
                    fontSize: 14,
                    fontFamily: 'Roboto, sans-serif',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff'
                    e.currentTarget.style.color = '#1890ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9'
                    e.currentTarget.style.color = 'rgba(0,0,0,0.65)'
                  }}
                >
                  + Adicionar terminal
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

interface TerminalBlockProps {
  terminal: Terminal
  canalAdquirentes: CanalConfig['adquirentes']
  providers: ProviderOption[]
  readonly: boolean
  onChange: (patch: Partial<Terminal>) => void
  onRemove: () => void
}

function TerminalBlock({ terminal, canalAdquirentes, providers, readonly, onChange, onRemove }: TerminalBlockProps) {
  // Opções base: somente adquirentes vinculados em Canais deste produto.
  const baseOptions = canalAdquirentes
    .filter((a) => a.adquirenteId)
    .map((a) => ({ value: a.adquirenteId, label: `${adquirenteLabel(a.adquirenteId, providers)} — MID: ${a.mid || '—'}` }))

  /**
   * Pra cada AppSelect, escondemos adquirentes já escolhidos em OUTROS vínculos
   * do mesmo terminal (sem duplicar adquirente no mesmo terminal).
   */
  function optionsFor(currentVinculoId: string): typeof baseOptions {
    const takenInOtherVinculos = terminal.vinculos
      .filter((v) => v.id !== currentVinculoId)
      .map((v) => v.adquirenteId)
      .filter(Boolean)
    return baseOptions.filter(
      (op) => !takenInOtherVinculos.includes(op.value) ||
        op.value === terminal.vinculos.find((v) => v.id === currentVinculoId)?.adquirenteId,
    )
  }

  function addVinculo() {
    onChange({ vinculos: [...terminal.vinculos, { id: newId('vinc'), adquirenteId: '', tid: '' }] })
  }

  function updateVinculo(id: string, patch: Partial<TerminalVinculo>) {
    onChange({ vinculos: terminal.vinculos.map((v) => (v.id === id ? { ...v, ...patch } : v)) })
  }

  function removeVinculo(id: string) {
    onChange({ vinculos: terminal.vinculos.filter((v) => v.id !== id) })
  }

  return (
    <div style={{
      border: '1px solid #f0f0f0',
      borderRadius: 2,
      padding: 16,
      marginBottom: 12,
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Identificação do terminal *"
            placeholder="Ex: 928132 - Loja"
            value={terminal.identificacao}
            onChange={(e) => onChange({ identificacao: e.target.value.slice(0, 60) })}
            disabled={readonly}
            aria-required
          />
        </div>
        {!readonly && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Excluir terminal"
            title="Excluir terminal"
            style={{
              width: 40,
              height: 40,
              border: '1px solid #ff4d4f',
              borderRadius: 2,
              background: '#fff1f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ff4d4f',
              marginTop: 30,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ffccc7')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff1f0')}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {terminal.vinculos.map((v) => (
          <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 16, alignItems: 'end' }}>
            <AppSelect
              label="Adquirente *"
              placeholder="Selecione o adquirente"
              value={v.adquirenteId || undefined}
              options={optionsFor(v.id)}
              onChange={(val) => updateVinculo(v.id, { adquirenteId: String(val ?? '') })}
              showSearch
              optionFilterProp="label"
              disabled={readonly}
            />
            <Input
              label="TID *"
              placeholder="Identificador do TID"
              value={v.tid}
              onChange={(e) => updateVinculo(v.id, { tid: e.target.value.slice(0, 32) })}
              disabled={readonly}
              aria-required
            />
            {!readonly && (
              <button
                type="button"
                onClick={() => removeVinculo(v.id)}
                aria-label="Remover vínculo adquirente"
                title="Remover vínculo"
                style={{
                  width: 40,
                  height: 40,
                  border: '1px solid #d9d9d9',
                  borderRadius: 2,
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'rgba(0,0,0,0.45)',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ff4d4f'
                  e.currentTarget.style.borderColor = '#ffccc7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(0,0,0,0.45)'
                  e.currentTarget.style.borderColor = '#d9d9d9'
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        {!readonly && (
          <button
            type="button"
            onClick={addVinculo}
            style={{
              alignSelf: 'flex-start',
              marginTop: 4,
              padding: '6px 12px',
              border: '1px dashed #d9d9d9',
              background: 'transparent',
              borderRadius: 2,
              color: 'rgba(0,0,0,0.65)',
              fontSize: 13,
              fontFamily: 'Roboto, sans-serif',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1890ff'
              e.currentTarget.style.color = '#1890ff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d9d9d9'
              e.currentTarget.style.color = 'rgba(0,0,0,0.65)'
            }}
          >
            + Adicionar adquirente
          </button>
        )}
      </div>
    </div>
  )
}
