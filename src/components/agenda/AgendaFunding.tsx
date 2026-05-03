'use client'

import { Table, Tag } from 'antd'
import KpiCard from '@/components/ui/KpiCard'
import StatusTag from '@/components/shared/Tag'

const dreItems = [
  { label: 'Entradas (liquidações previstas)', value: 'R$ 193.420', color: '#52C41A' },
  { label: 'Antecipações concedidas (saída)', value: '− R$ 42.800', color: '#FA8C16' },
  { label: 'Custos operacionais', value: '− R$ 8.730', color: '#FF4D4F' },
  { label: 'Gravame retido (CIP/CERC)', value: '− R$ 12.400', color: '#FAAD14' },
  { label: 'Saldo float disponível', value: 'R$ 129.490', color: '#1890FF', bold: true },
]

const acquirerBars = [
  { name: 'Cielo', value: 48200, total: 193420 },
  { name: 'Rede', value: 72100, total: 193420 },
  { name: 'Adiq', value: 31500, total: 193420 },
  { name: 'Getnet', value: 41620, total: 193420 },
]

const timeline = [
  { day: 'Hoje', date: '24/04', value: 'R$ 193.420', status: 'previsto' },
  { day: 'Amanhã', date: '25/04', value: 'R$ 147.300', status: 'previsto' },
  { day: 'Sáb', date: '26/04', value: 'R$ 89.100', status: 'previsto' },
  { day: 'Seg', date: '28/04', value: 'R$ 214.600', status: 'previsto' },
  { day: 'Ter', date: '29/04', value: 'R$ 176.800', status: 'previsto' },
  { day: 'Qua', date: '30/04', value: 'R$ 201.400', status: 'previsto' },
  { day: 'Qui', date: '01/05', value: '—', status: 'feriado' },
]

const liquidationData = [
  { key: '1', data: '24/04/2026', adquirente: 'Cielo', tipo: 'Crédito normal', bruto: 'R$ 48.200', mdr: 'R$ 1.446', antecip: '—', liquido: 'R$ 46.754', conta: '...4521', status: 'Previsto' },
  { key: '2', data: '24/04/2026', adquirente: 'Rede', tipo: 'Crédito normal', bruto: 'R$ 72.100', mdr: 'R$ 2.163', antecip: '—', liquido: 'R$ 69.937', conta: '...4521', status: 'Previsto' },
  { key: '3', data: '23/04/2026', adquirente: 'Adiq', tipo: 'Desc. antecipação', bruto: 'R$ 31.500', mdr: 'R$ 945', antecip: 'R$ 4.200', liquido: 'R$ 26.355', conta: '...4521', status: 'Liquidado' },
]

const liqColumns = [
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Adquirente', dataIndex: 'adquirente', key: 'adquirente' },
  { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', render: (v: string) => <Tag color={v.includes('Desc') ? 'orange' : 'blue'}>{v}</Tag> },
  { title: 'Bruto', dataIndex: 'bruto', key: 'bruto', align: 'right' as const },
  { title: 'MDR', dataIndex: 'mdr', key: 'mdr', align: 'right' as const, render: (v: string) => <span className="text-[#FF4D4F]">{v}</span> },
  { title: 'Antecip.', dataIndex: 'antecip', key: 'antecip', align: 'right' as const, render: (v: string) => <span className="text-[#FA8C16]">{v}</span> },
  { title: 'Líquido', dataIndex: 'liquido', key: 'liquido', align: 'right' as const, render: (v: string) => <span className="font-semibold text-[#52C41A]">{v}</span> },
  { title: 'Conta', dataIndex: 'conta', key: 'conta', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <StatusTag status={v} /> },
]

const kpis = [
  { label: 'Entradas previstas', value: 'R$ 193.420', variant: 'success' as const },
  { label: 'Saídas (antecipações)', value: 'R$ 42.800', variant: 'orange' as const },
  { label: 'Gravame retido', value: 'R$ 12.400', variant: 'warning' as const },
  { label: 'Saldo float', value: 'R$ 129.490', variant: 'info' as const },
]

export default function AgendaFunding() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* DRE de caixa */}
        <div className="bg-white rounded-sm border border-[#f0f0f0] p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(0,0,0,0.85)' }}>DRE de caixa — hoje</h3>
          <div className="space-y-3">
            {dreItems.map(i => (
              <div key={i.label} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.65)' }}>{i.label}</span>
                <span className="text-xs font-semibold" style={{ color: i.color, fontWeight: i.bold ? 700 : 600 }}>{i.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Barras por adquirente */}
        <div className="bg-white rounded-sm border border-[#f0f0f0] p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(0,0,0,0.85)' }}>Funding por adquirente</h3>
          <div className="space-y-3">
            {acquirerBars.map(a => {
              const pct = Math.round((a.value / a.total) * 100)
              return (
                <div key={a.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'rgba(0,0,0,0.65)' }}>{a.name}</span>
                    <span className="font-semibold text-[#1890FF]">R$ {a.value.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="h-2 rounded bg-[#f0f0f0]">
                    <div className="h-2 rounded bg-[#1890FF]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-right text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.45)' }}>{pct}%</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Timeline 7 dias */}
        <div className="bg-white rounded-sm border border-[#f0f0f0] p-4" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: 'rgba(0,0,0,0.85)' }}>Funding previsto — 7 dias</h3>
          <div className="space-y-2">
            {timeline.map(t => (
              <div key={t.date} className="flex items-center justify-between py-1.5 border-b border-[#f0f0f0] last:border-0">
                <div>
                  <span className="text-xs font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>{t.day}</span>
                  <span className="text-xs ml-2" style={{ color: 'rgba(0,0,0,0.45)' }}>{t.date}</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: t.status === 'feriado' ? 'rgba(0,0,0,0.25)' : '#52C41A' }}>{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de eventos */}
      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="px-4 py-3 border-b border-[#f0f0f0]">
          <h3 className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>Eventos de liquidação</h3>
        </div>
        <Table columns={liqColumns} dataSource={liquidationData} size="small" pagination={false} />
      </div>
    </div>
  )
}
