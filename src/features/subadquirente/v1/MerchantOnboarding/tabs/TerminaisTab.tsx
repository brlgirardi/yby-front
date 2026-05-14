'use client'
// src/features/subadquirente/v1/MerchantOnboarding/tabs/TerminaisTab.tsx
// Tab "Terminais" — 1 card wrapper com 2 sub-cards de produto (CP/CNP).
// Cada produto lista terminais com Identificação + vínculos (Adquirente + TID).
// Estados: canal desabilitado, sem adquirentes vinculados, ou OK pra cadastrar.

import { CreditCard, ShoppingCart, Trash2 } from 'lucide-react'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import { ADQUIRENTES } from '@/mocks/sub/merchant-onboarding'
import {
  type AdquirenteCanal,
  type ChannelKey,
  type MerchantFormData,
  type Terminal,
  type TerminalAdquirente,
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

function adquirenteLabel(adq: AdquirenteCanal): string {
  const brand = ADQUIRENTES.find((o) => o.value === adq.adquirenteId)?.label ?? adq.adquirenteId
  const midPart = adq.mid ? `MID: ${adq.mid}` : 'MID: —'
  return `${brand} - ${midPart}`
}

export default function TerminaisTab({ form, onChange, readonly = false }: TerminaisTabProps) {
  function setChannelTerminals(channel: ChannelKey, next: Terminal[]) {
    onChange({
      ...form,
      terminais: { ...form.terminais, [channel]: next },
    })
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div>
        <h3 style={{ fontSize: 20, fontWeight: 500, color: '#21272A', margin: 0 }}>
          Terminais
        </h3>
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid #f0f0f0',
            margin: '16px 0 0 0',
          }}
        />
      </div>

      {CHANNELS.map((ch) => (
        <ProductSection
          key={ch.id}
          def={ch}
          terminais={form.terminais[ch.id]}
          adquirentes={form.canais[ch.id].adquirentes}
          channelEnabled={form.canais[ch.id].enabled}
          readonly={readonly}
          onChange={(next) => setChannelTerminals(ch.id, next)}
        />
      ))}
    </div>
  )
}

interface ProductSectionProps {
  def: ChannelDef
  terminais: Terminal[]
  adquirentes: AdquirenteCanal[]
  channelEnabled: boolean
  readonly: boolean
  onChange: (next: Terminal[]) => void
}

function ProductSection({
  def,
  terminais,
  adquirentes,
  channelEnabled,
  readonly,
  onChange,
}: ProductSectionProps) {
  const hasAdquirentes = adquirentes.length > 0
  const canManage = channelEnabled && hasAdquirentes
  const dimmed = !channelEnabled

  function addTerminal() {
    onChange([
      ...terminais,
      { id: newId('term'), identificacao: '', vinculos: [] },
    ])
  }

  function updateTerminal(id: string, patch: Partial<Terminal>) {
    onChange(terminais.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  function removeTerminal(id: string) {
    onChange(terminais.filter((t) => t.id !== id))
  }

  return (
    <div
      style={{
        background: dimmed ? '#fafafa' : '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '16px 20px',
          opacity: dimmed ? 0.7 : 1,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: '#e6f4ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {def.icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#21272A' }}>{def.label}</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{def.description}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
        {!channelEnabled && (
          <div style={{ fontSize: 13, color: '#999' }}>
            Habilite este canal em &quot;Canais&quot; para adicionar terminais.
          </div>
        )}

        {channelEnabled && !hasAdquirentes && (
          <div style={{ fontSize: 13, color: '#999' }}>
            Adicione adquirentes em &quot;Canais&quot; antes de cadastrar terminais.
          </div>
        )}

        {canManage && (
          <>
            {terminais.length === 0 && (
              <div style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
                Nenhum terminal cadastrado. Clique em &quot;Adicionar terminal&quot; para iniciar.
              </div>
            )}

            {terminais.map((term) => (
              <TerminalBlock
                key={term.id}
                value={term}
                adquirentes={adquirentes}
                readonly={readonly}
                onChange={(patch) => updateTerminal(term.id, patch)}
                onRemove={() => removeTerminal(term.id)}
              />
            ))}

            {!readonly && (
              <DashedButton onClick={addTerminal} label="+ Adicionar terminal" />
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface TerminalBlockProps {
  value: Terminal
  adquirentes: AdquirenteCanal[]
  readonly: boolean
  onChange: (patch: Partial<Terminal>) => void
  onRemove: () => void
}

function TerminalBlock({ value, adquirentes, readonly, onChange, onRemove }: TerminalBlockProps) {
  function addVinculo() {
    onChange({
      vinculos: [
        ...value.vinculos,
        { id: newId('vinc'), adquirenteId: '', tid: '' },
      ],
    })
  }

  function updateVinculo(id: string, patch: Partial<TerminalAdquirente>) {
    onChange({
      vinculos: value.vinculos.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    })
  }

  function removeVinculo(id: string) {
    onChange({
      vinculos: value.vinculos.filter((v) => v.id !== id),
    })
  }

  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        padding: 16,
        marginBottom: 12,
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header com input + trash */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Input
            label="Identificação do terminal *"
            placeholder="Ex: 928132 - Loja"
            value={value.identificacao}
            onChange={(e) => onChange({ identificacao: e.target.value.slice(0, 64) })}
            disabled={readonly}
            aria-required
          />
        </div>
        {!readonly && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remover terminal"
            style={{
              width: 40,
              height: 40,
              border: '1px solid #ffccc7',
              borderRadius: 2,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ff4d4f',
              transition: 'background 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fff1f0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Vínculos */}
      {value.vinculos.length === 0 && (
        <div style={{ fontSize: 13, color: '#999' }}>
          Nenhum vínculo adquirente/TID. Clique em &quot;Adicionar adquirente&quot; para iniciar.
        </div>
      )}

      {value.vinculos.map((v) => (
        <VinculoBlock
          key={v.id}
          value={v}
          adquirentes={adquirentes}
          alreadyTaken={value.vinculos
            .filter((other) => other.id !== v.id)
            .map((other) => other.adquirenteId)
            .filter(Boolean)}
          readonly={readonly}
          onChange={(patch) => updateVinculo(v.id, patch)}
          onRemove={() => removeVinculo(v.id)}
        />
      ))}

      {!readonly && (
        <DashedButton onClick={addVinculo} label="+ Adicionar adquirente" />
      )}
    </div>
  )
}

interface VinculoBlockProps {
  value: TerminalAdquirente
  adquirentes: AdquirenteCanal[]
  alreadyTaken: string[]
  readonly: boolean
  onChange: (patch: Partial<TerminalAdquirente>) => void
  onRemove: () => void
}

function VinculoBlock({
  value,
  adquirentes,
  alreadyTaken,
  readonly,
  onChange,
  onRemove,
}: VinculoBlockProps) {
  const options = adquirentes
    .filter((a) => a.adquirenteId)
    .filter((a) => a.adquirenteId === value.adquirenteId || !alreadyTaken.includes(a.adquirenteId))
    .map((a) => ({ value: a.adquirenteId, label: adquirenteLabel(a) }))

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 40px',
        gap: 16,
        alignItems: 'end',
      }}
    >
      <AppSelect
        label="Adquirente *"
        placeholder="Selecione o adquirente"
        value={value.adquirenteId || undefined}
        options={options}
        onChange={(v) => onChange({ adquirenteId: String(v ?? '') })}
        showSearch
        optionFilterProp="label"
        disabled={readonly}
      />
      <Input
        label="TID *"
        placeholder="Identificador do TID"
        value={value.tid}
        onChange={(e) => onChange({ tid: e.target.value.slice(0, 32) })}
        disabled={readonly}
        aria-required
      />
      {!readonly && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover vínculo"
          style={{
            width: 40,
            height: 40,
            border: '1px solid #ffccc7',
            borderRadius: 2,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ff4d4f',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fff1f0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}

interface DashedButtonProps {
  onClick: () => void
  label: string
}

function DashedButton({ onClick, label }: DashedButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      {label}
    </button>
  )
}
