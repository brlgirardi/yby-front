'use client'
// src/features/subadquirente/v1/MerchantOnboarding/tabs/CanaisTab.tsx
// Tab "Canais" — 2 cards de produto (CP / CNP) com switch enabled e lista de adquirentes.
// Padrão visual reutiliza ChannelSection de /pricing/costs (simplificado).
// Spec UX: Pixel (2026-05-14).

import { useState } from 'react'
import { Switch } from 'antd'
import { ChevronDown, ChevronUp, CreditCard, ShoppingCart, Trash2 } from 'lucide-react'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import { ADQUIRENTES } from '@/mocks/sub/merchant-onboarding'
import {
  type AdquirenteCanal,
  type CanalConfig,
  type ChannelKey,
  type MerchantFormData,
} from '../types'

interface CanaisTabProps {
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

function newAdqId(): string {
  return `adq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export default function CanaisTab({ form, onChange, readonly = false }: CanaisTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {CHANNELS.map((ch) => (
        <ChannelCard
          key={ch.id}
          def={ch}
          config={form.canais[ch.id]}
          readonly={readonly}
          onConfigChange={(next) =>
            onChange({ ...form, canais: { ...form.canais, [ch.id]: next } })
          }
        />
      ))}
    </div>
  )
}

interface ChannelCardProps {
  def: ChannelDef
  config: CanalConfig
  readonly: boolean
  onConfigChange: (next: CanalConfig) => void
}

function ChannelCard({ def, config, readonly, onConfigChange }: ChannelCardProps) {
  const [open, setOpen] = useState(true)

  function setEnabled(enabled: boolean) {
    onConfigChange({ ...config, enabled })
  }

  function addAdquirente() {
    onConfigChange({
      ...config,
      adquirentes: [...config.adquirentes, { id: newAdqId(), adquirenteId: '', mid: '' }],
    })
  }

  function updateAdquirente(id: string, patch: Partial<AdquirenteCanal>) {
    onConfigChange({
      ...config,
      adquirentes: config.adquirentes.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })
  }

  function removeAdquirente(id: string) {
    onConfigChange({
      ...config,
      adquirentes: config.adquirentes.filter((a) => a.id !== id),
    })
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '16px 20px',
        gap: 12,
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <Switch
            checked={config.enabled}
            onChange={setEnabled}
            disabled={readonly}
            aria-label={config.enabled ? 'Canal habilitado' : 'Canal desabilitado'}
          />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Recolher' : 'Expandir'}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#999' }}
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Body — só aparece quando expandido E canal habilitado (evita mostrar conteúdo morto). */}
      {open && config.enabled && (
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #f0f0f0',
        }}>
          <div style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#21272A',
            marginBottom: 12,
          }}>
            Adquirentes credenciados
          </div>

          {config.adquirentes.length === 0 && (
            <div style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
              Nenhum adquirente vinculado. Clique em &quot;Adicionar adquirente&quot; para iniciar.
            </div>
          )}

          {config.adquirentes.map((adq) => (
            <AdquirenteBlock
              key={adq.id}
              value={adq}
              readonly={readonly}
              alreadyTaken={config.adquirentes
                .filter((a) => a.id !== adq.id)
                .map((a) => a.adquirenteId)
                .filter(Boolean)}
              onChange={(patch) => updateAdquirente(adq.id, patch)}
              onRemove={() => removeAdquirente(adq.id)}
            />
          ))}

          {!readonly && (
            <button
              type="button"
              onClick={addAdquirente}
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
              + Adicionar adquirente
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface AdquirenteBlockProps {
  value: AdquirenteCanal
  readonly: boolean
  alreadyTaken: string[]
  onChange: (patch: Partial<AdquirenteCanal>) => void
  onRemove: () => void
}

function AdquirenteBlock({ value, readonly, alreadyTaken, onChange, onRemove }: AdquirenteBlockProps) {
  const availableOptions = ADQUIRENTES.filter(
    (op) => op.value === value.adquirenteId || !alreadyTaken.includes(op.value),
  )

  return (
    <div style={{
      border: '1px solid #f0f0f0',
      borderRadius: 2,
      padding: 16,
      marginBottom: 12,
      background: '#fafafa',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 40px',
      gap: 16,
      alignItems: 'end',
    }}>
      <AppSelect
        label="Adquirente *"
        placeholder="Selecione o adquirente"
        value={value.adquirenteId || undefined}
        options={availableOptions}
        onChange={(v) => onChange({ adquirenteId: String(v ?? '') })}
        showSearch
        optionFilterProp="label"
        disabled={readonly}
      />
      <Input
        label="MID *"
        placeholder="Identificador do MID"
        value={value.mid}
        onChange={(e) => onChange({ mid: e.target.value.slice(0, 32) })}
        disabled={readonly}
        aria-required
      />
      {!readonly && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover adquirente"
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
