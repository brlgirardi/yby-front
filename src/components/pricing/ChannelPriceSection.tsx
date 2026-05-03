'use client'

import { useState } from 'react'
import { Space, Typography } from 'antd'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { CostItem, Installment, PriceBlueprintTable, PriceItem } from '@/services/types/pricing.types'
import AcquirerPriceSection from './AcquirerPriceSection'
import { CHANNELS, type ChannelDef } from './ChannelSection'

const { Text } = Typography

export interface ChannelPriceSectionProps {
  channel: ChannelDef
  tables: PriceBlueprintTable[]
  acquirerIds: string[]
  acquirerNames: Record<string, string>
  costItems: CostItem[]
  priceItems: PriceItem[]
  installments: Installment[]
}

export default function ChannelPriceSection({
  channel, tables, acquirerIds, acquirerNames,
  costItems, priceItems, installments,
}: ChannelPriceSectionProps) {
  const [open, setOpen] = useState(true)
  const display = acquirerIds.length > 0 ? acquirerIds : ['adiq']

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
          <div style={{ width: 40, height: 40, background: '#e6f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
        {open ? <ChevronUp size={16} color="#999" /> : <ChevronDown size={16} color="#999" />}
      </div>

      {open && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
          {display.map(acqId => (
            <AcquirerPriceSection
              key={acqId}
              acquirerId={acqId}
              acquirerName={acquirerNames[acqId] ?? acqId}
              table={tables.find(t => t.acquirer_id === acqId && t.channel === channel.id) ?? null}
              costItems={costItems}
              priceItems={priceItems}
              installments={installments}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { CHANNELS }
