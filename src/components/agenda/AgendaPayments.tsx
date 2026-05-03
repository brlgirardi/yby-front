'use client'

import { Table } from 'antd'
import KpiCard from '@/components/ui/KpiCard'
import Tag from '@/components/shared/Tag'

const data = [
  { key: '1', merchant: 'Restaurante Bom Sabor', cnpj: '12.345.678/0001-90', data: '24/04/2026', bruto: 'R$ 14.320', taxas: 'R$ 430', repassado: 'R$ 13.890', conta: 'Itaú ...8821', status: 'Pago' },
  { key: '2', merchant: 'Farmácia Saúde Total', cnpj: '98.765.432/0001-10', data: '24/04/2026', bruto: 'R$ 9.870', taxas: 'R$ 296', repassado: 'R$ 9.574', conta: 'Bradesco ...3312', status: 'Pendente' },
  { key: '3', merchant: 'Eletrônicos Max', cnpj: '55.444.333/0001-22', data: '24/04/2026', bruto: 'R$ 32.100', taxas: 'R$ 963', repassado: 'R$ 31.137', conta: 'Nubank ...9901', status: 'Pago' },
  { key: '4', merchant: 'Mercado Boa Vista', cnpj: '77.666.555/0001-44', data: '23/04/2026', bruto: 'R$ 48.200', taxas: 'R$ 1.446', repassado: 'R$ 46.754', conta: 'Santander ...1120', status: 'Pago' },
  { key: '5', merchant: 'Auto Peças Centro', cnpj: '11.222.333/0001-55', data: '23/04/2026', bruto: 'R$ 7.600', taxas: 'R$ 228', repassado: 'R$ 7.372', conta: 'Caixa ...4430', status: 'Pendente' },
]

const columns = [
  { title: 'Merchant', dataIndex: 'merchant', key: 'merchant', render: (v: string) => <span className="font-medium text-sm">{v}</span> },
  { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj', render: (v: string) => <span className="font-mono text-xs text-[rgba(0,0,0,0.65)]">{v}</span> },
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Bruto vendas', dataIndex: 'bruto', key: 'bruto', align: 'right' as const, render: (v: string) => <span className="text-[#1890FF] font-semibold">{v}</span> },
  { title: 'Taxas retidas', dataIndex: 'taxas', key: 'taxas', align: 'right' as const, render: (v: string) => <span className="text-[#FF4D4F]">{v}</span> },
  { title: 'Valor repassado', dataIndex: 'repassado', key: 'repassado', align: 'right' as const, render: (v: string) => <span className="font-bold text-[#52C41A]">{v}</span> },
  { title: 'Conta destino', dataIndex: 'conta', key: 'conta', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag status={v} /> },
]

const kpis = [
  { label: 'Total repassado', value: 'R$ 108.727', variant: 'success' as const },
  { label: 'Taxas retidas', value: 'R$ 3.363', variant: 'error' as const },
  { label: 'Pendentes', value: '2', subLabel: 'repasses', variant: 'warning' as const },
  { label: 'Merchants pagos', value: '3', subLabel: 'nesta data', variant: 'neutral' as const },
]

export default function AgendaPayments() {
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="px-4 py-3 border-b border-[#f0f0f0]">
          <h3 className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>Repasses a merchants</h3>
        </div>
        <Table columns={columns} dataSource={data} size="small" pagination={{ pageSize: 10 }} />
      </div>
    </div>
  )
}
