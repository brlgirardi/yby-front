'use client'
// src/features/subadquirente/v1/MerchantOnboarding/tabs/CanaisTab.tsx
// Tab "Canais" do Onboarding EC — 2 cards de produto (CP / CNP) com lista
// de adquirentes credenciados. Visual espelha src/components/pricing/ChannelSection.tsx
// sem importar (simplificado: sem accordion interno por adquirente).

import { useState } from 'react'
import { Switch } from 'antd'
import { ChevronDown, ChevronUp, CreditCard, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import { ADQUIRENTES } from '@/mocks/sub/merchant-onboarding'
import type { AdquirenteCanal, CanalConfig, MerchantFormData } from '../types'

type CanalKey = 'cp' | 'cnp'

interface ProdutoDef {
  key: CanalKey
  label: string
  description: string
  icon: React.ReactNode
}

const PRODUTOS: ProdutoDef[] = [
  {
    key: 'cp',
    label: 'Cartão Presente — CP',
    description: 'Transações em maquininhas (POS) e TEF — Transferência Eletrônica de Fundos.',
    icon: <CreditCard size={20} color="#1677ff" />,
  },
  {
    key: 'cnp',
    label: 'Cartão não presente — CNP',
    description: 'Link de pagamentos e gateway para e-commerce.',
    icon: <ShoppingCart size={20} color="#1677ff" />,
  },
]

interface CanaisTabProps {
  form: MerchantFormData
  onChange: (next: MerchantFormData) => void
  /** Quando true, todos os inputs ficam desabilitados (modo view). */
  readonly?: boolean
}

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `adq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function CanaisTab({ form, onChange, readonly = false }: CanaisTabProps) {
  function updateCanal(key: CanalKey, next: CanalConfig) {
    onChange({
      ...form,
      canais: {
        ...form.canais,
        [key]: next,
      },
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {PRODUTOS.map((produto) => (
        <ProdutoCard
          key={produto.key}
          produto={produto}
          config={form.canais[produto.key]}
          onChange={(next) => updateCanal(produto.key, next)}
          readonly={readonly}
        />
      ))}
    </div>
  )
}

interface ProdutoCardProps {
  produto: ProdutoDef
  config: CanalConfig
  onChange: (next: CanalConfig) => void
  readonly: boolean
}

function ProdutoCard({ produto, config, onChange, readonly }: ProdutoCardProps) {
  const [expanded, setExpanded] = useState(true)

  function toggleEnabled(checked: boolean) {
    onChange({ ...config, enabled: checked })
  }

  function addAdquirente() {
    onChange({
      ...config,
      adquirentes: [
        ...config.adquirentes,
        { id: uid(), adquirenteId: '', mid: '' },
      ],
    })
  }

  function updateAdquirente(id: string, patch: Partial<Omit<AdquirenteCanal, 'id'>>) {
    onChange({
      ...config,
      adquirentes: config.adquirentes.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })
  }

  function removeAdquirente(id: string) {
    onChange({
      ...config,
      adquirentes: config.adquirentes.filter((a) => a.id !== id),
    })
  }

  const bodyDisabled = !config.enabled || readonly
  const selectedIds = config.adquirentes.map((a) => a.adquirenteId).filter(Boolean)

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded((v) => !v)
          }
        }}
        aria-expanded={expanded}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          padding: '16px 20px',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 0 }}>
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
            {produto.icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                color: 'rgba(0,0,0,0.85)',
                lineHeight: '22px',
              }}
            >
              {produto.label}
            </div>
            <div
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: 13,
                color: '#666',
                marginTop: 2,
                lineHeight: '20px',
              }}
            >
              {produto.description}
            </div>
          </div>
        </div>

        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={config.enabled}
            onChange={toggleEnabled}
            disabled={readonly}
            aria-label={`Ativar ${produto.label}`}
          />
          {expanded ? (
            <ChevronUp size={16} color="#999" />
          ) : (
            <ChevronDown size={16} color="#999" />
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '12px 20px 20px', borderTop: '1px solid #f0f0f0' }}>
          <div
            style={{
              opacity: bodyDisabled ? 0.5 : 1,
              pointerEvents: bodyDisabled ? 'none' : 'auto',
              transition: 'opacity 0.15s',
            }}
            aria-disabled={bodyDisabled}
          >
            <div
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: 14,
                fontWeight: 500,
                color: '#21272A',
                marginBottom: 12,
              }}
            >
              Adquirentes credenciados
            </div>

            {config.adquirentes.length === 0 && (
              <div
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 13,
                  color: 'rgba(0,0,0,0.45)',
                  padding: '12px 0',
                }}
              >
                Nenhum adquirente vinculado. Use o botão abaixo para adicionar.
              </div>
            )}

            {config.adquirentes.map((adq) => {
              const optionsFiltradas = ADQUIRENTES.filter(
                (opt) => opt.value === adq.adquirenteId || !selectedIds.includes(opt.value),
              )
              return (
                <div
                  key={adq.id}
                  style={{
                    border: '1px solid #f0f0f0',
                    borderRadius: 2,
                    padding: 16,
                    marginBottom: 12,
                    background: '#fafafa',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 40px',
                    gap: 16,
                    alignItems: 'end',
                  }}
                >
                  <AppSelect
                    label="Adquirente*"
                    placeholder="Selecione o adquirente"
                    value={adq.adquirenteId || undefined}
                    options={optionsFiltradas}
                    onChange={(v) => updateAdquirente(adq.id, { adquirenteId: String(v ?? '') })}
                    showSearch
                    optionFilterProp="label"
                    disabled={readonly}
                  />
                  <Input
                    label="MID*"
                    placeholder="Identificador do adquirente"
                    value={adq.mid}
                    onChange={(e) => updateAdquirente(adq.id, { mid: e.target.value.slice(0, 32) })}
                    maxLength={32}
                    disabled={readonly}
                    aria-required
                  />
                  <button
                    type="button"
                    onClick={() => removeAdquirente(adq.id)}
                    disabled={readonly}
                    aria-label="Remover adquirente"
                    style={{
                      width: 40,
                      height: 32,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: 2,
                      cursor: readonly ? 'not-allowed' : 'pointer',
                      color: '#ff4d4f',
                      padding: 0,
                    }}
                  >
                    <Trash2 size={16} color="#ff4d4f" />
                  </button>
                </div>
              )
            })}

            <Button
              variant="secondary"
              onClick={addAdquirente}
              disabled={readonly}
              style={{
                width: '100%',
                borderStyle: 'dashed',
                color: '#1890FF',
                gap: 6,
              }}
            >
              <Plus size={14} />
              Adicionar adquirente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
