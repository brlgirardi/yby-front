'use client'

import { useState } from 'react'
import { Space, Typography } from 'antd'
import { CaretDownOutlined, CaretUpOutlined, CreditCardOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import type { CardBrand, Channel, CostBlueprintTable, Installment, PricingModel } from '@/services/types/pricing.types'
import AcquirerSection from './AcquirerSection'
import type { CostRow } from './MethodTable'

const { Text } = Typography

export interface ChannelDef {
  id: Channel
  label: string
  description: React.ReactNode
  icon: React.ReactNode
}

export const CHANNELS: ChannelDef[] = [
  {
    id: 'cp',
    label: 'Cartão Presente — CP',
    description: (
      <>Esse canal habilita transações em <strong>Maquininhas — POS</strong> e TEF — <strong>Transferência Eletrônica de Fundos</strong></>
    ),
    icon: <CreditCardOutlined style={{ fontSize: 20, color: '#1677ff' }} />,
  },
  {
    id: 'cnp',
    label: 'Gateway de pagamentos — CNP',
    description: (
      <>Esse canal habilita <strong>Link de pagamentos</strong> e <strong>Gateway para ecommerce</strong></>
    ),
    icon: <ShoppingCartOutlined style={{ fontSize: 20, color: '#1677ff' }} />,
  },
]

export interface ChannelSectionProps {
  channel: ChannelDef
  tables: CostBlueprintTable[]
  acquirerIds: string[]
  acquirerNames: Record<string, string>
  installments: Installment[]
  onHasData?: (brand: string, hasData: boolean) => void
  onDataChange?: (brand: CardBrand, acquirerId: string, pricingType: PricingModel, rows: CostRow[]) => void
}

/**
 * Box-canal (CP / CNP): banner com ícone + descrição + lista de adquirentes.
 * Espelha `ChannelSection` do branch feat/pricing.
 */
export default function ChannelSection({
  channel, tables, acquirerIds, acquirerNames, installments,
  onHasData, onDataChange,
}: ChannelSectionProps) {
  const [open, setOpen] = useState(true)
  const display = acquirerIds.length > 0 ? acquirerIds : ['acq-001']

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 0, marginBottom: 16, background: '#fff', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '16px 20px', cursor: 'pointer',
        }}
        onClick={() => setOpen(v => !v)}
      >
        <Space align="start" size={12}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 0,
              background: '#e6f4ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {channel.icon}
          </div>
          <div>
            <Text strong style={{ fontSize: 15, display: 'block' }}>{channel.label}</Text>
            <Text style={{ fontSize: 13, color: '#666', display: 'block', marginTop: 2 }}>{channel.description}</Text>
            <Text style={{ fontSize: 12, color: '#aaa', marginTop: 4, display: 'block' }}>
              Atualizado em {new Date().toLocaleDateString('pt-BR')}
            </Text>
          </div>
        </Space>
        {open ? <CaretUpOutlined style={{ fontSize: 16, color: '#999' }} /> : <CaretDownOutlined style={{ fontSize: 16, color: '#999' }} />}
      </div>

      {open && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
          {display.map(acqId => (
            <AcquirerSection
              key={acqId}
              acquirerId={acqId}
              acquirerName={acquirerNames[acqId] ?? acqId}
              table={tables.find(t => t.acquirer_id === acqId && t.channel === channel.id) ?? null}
              installments={installments}
              onHasData={onHasData}
              onDataChange={onDataChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
