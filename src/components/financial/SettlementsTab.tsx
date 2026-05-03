'use client'

import { useState } from 'react'
import { Table, Tag, Button, Drawer } from 'antd'
import { Download, RotateCcw, X } from 'lucide-react'
import KpiCard from '@/components/ui/KpiCard'
import StatusTag from '@/components/shared/Tag'

interface LiqRow {
  key: string
  data: string
  adquirente: string
  tipo: string
  bruto: string
  mdr: string
  antecip: string
  liquido: string
  conta: string
}

const domicilioData = [
  { key: '1', adquirente: 'Cielo', registradora: 'CIP', domicilio: 'Itaú ...4521', volume: 'R$ 96.800', status: 'Ativo' },
  { key: '2', adquirente: 'Rede', registradora: 'CERC', domicilio: 'Itaú ...4521', volume: 'R$ 143.700', status: 'Ativo' },
  { key: '3', adquirente: 'Adiq', registradora: 'TAG', domicilio: 'Itaú ...4521', volume: 'R$ 63.000', status: 'Gravame ativo' },
  { key: '4', adquirente: 'Getnet', registradora: 'CIP', domicilio: 'Itaú ...4521', volume: 'R$ 83.240', status: 'Ativo' },
]

const liqData: LiqRow[] = [
  { key: '1', data: '24/04/2026', adquirente: 'Cielo', tipo: 'Crédito normal', bruto: 'R$ 48.200', mdr: 'R$ 1.446', antecip: '—', liquido: 'R$ 46.754', conta: '...4521' },
  { key: '2', data: '24/04/2026', adquirente: 'Rede', tipo: 'Crédito normal', bruto: 'R$ 72.100', mdr: 'R$ 2.163', antecip: '—', liquido: 'R$ 69.937', conta: '...4521' },
  { key: '3', data: '23/04/2026', adquirente: 'Adiq', tipo: 'Desc. antecipação', bruto: 'R$ 31.500', mdr: 'R$ 945', antecip: 'R$ 4.200', liquido: 'R$ 26.355', conta: '...4521' },
  { key: '4', data: '23/04/2026', adquirente: 'Getnet', tipo: 'Crédito normal', bruto: 'R$ 41.620', mdr: 'R$ 1.249', antecip: '—', liquido: 'R$ 40.371', conta: '...4521' },
  { key: '5', data: '22/04/2026', adquirente: 'Cielo', tipo: 'Crédito normal', bruto: 'R$ 96.800', mdr: 'R$ 2.904', antecip: '—', liquido: 'R$ 93.896', conta: '...4521' },
]

const registradoras: Record<string, string> = { CIP: 'blue', CERC: 'purple', TAG: 'green' }

const domColumns = [
  { title: 'Adquirente', dataIndex: 'adquirente', key: 'adquirente', render: (v: string) => <span className="font-medium">{v}</span> },
  { title: 'Registradora', dataIndex: 'registradora', key: 'registradora', render: (v: string) => <Tag color={registradoras[v]}>{v}</Tag> },
  { title: 'Domicílio', dataIndex: 'domicilio', key: 'domicilio', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
  { title: 'Volume', dataIndex: 'volume', key: 'volume', align: 'right' as const, render: (v: string) => <span className="font-semibold text-[#1890FF]">{v}</span> },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => v === 'Ativo' ? <StatusTag status="Ativo" /> : <StatusTag status="Suspenso" label={v} /> },
]

const kpis = [
  { label: 'Total liquidado (mês)', value: 'R$ 1.287.420', variant: 'success' as const },
  { label: 'MDR total', value: 'R$ 38.623', variant: 'error' as const },
  { label: 'Antecipações desc.', value: 'R$ 4.200', variant: 'orange' as const },
  { label: 'Líquido recebido', value: 'R$ 1.244.597', variant: 'info' as const },
]

export default function SettlementsTab() {
  const [drawerRow, setDrawerRow] = useState<LiqRow | null>(null)

  const liqColumns = [
    { title: 'Data', dataIndex: 'data', key: 'data', width: 110 },
    { title: 'Adquirente', dataIndex: 'adquirente', key: 'adquirente' },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', render: (v: string) => <Tag color={v.includes('Desc') ? 'orange' : 'blue'}>{v}</Tag> },
    { title: 'Bruto', dataIndex: 'bruto', key: 'bruto', align: 'right' as const },
    { title: 'MDR', dataIndex: 'mdr', key: 'mdr', align: 'right' as const, render: (v: string) => <span className="text-[#FF4D4F]">{v}</span> },
    { title: 'Antecip.', dataIndex: 'antecip', key: 'antecip', align: 'right' as const, render: (v: string) => <span className="text-[#FA8C16]">{v}</span> },
    { title: 'Líquido', dataIndex: 'liquido', key: 'liquido', align: 'right' as const, render: (v: string) => <span className="font-semibold text-[#52C41A]">{v}</span> },
    { title: 'Conta', dataIndex: 'conta', key: 'conta', render: (v: string) => <span className="font-mono text-xs">{v}</span> },
    {
      title: 'Ações', key: 'acoes',
      render: (_: unknown, row: LiqRow) => (
        <Button type="link" size="small" onClick={() => setDrawerRow(row)} style={{ padding: 0, color: '#1890FF', fontSize: 12 }}>
          Detalhes
        </Button>
      )
    },
  ]

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex items-start gap-3 rounded-sm px-4 py-3" style={{ background: '#E6F7FF', border: '1px solid #91D5FF' }}>
        <p className="text-sm m-0" style={{ color: 'rgba(0,0,0,0.85)' }}>
          <span className="font-medium">Liquidação centralizada ativa:</span>{' '}
          Os adquirentes creditam diretamente no seu domicílio bancário. Recebíveis registrados em CIP/CERC/TAG com gravame ativo como garantia.
        </p>
      </div>

      {/* KPIs */}
      <div className="flex flex-wrap gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Domicílio bancário */}
      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="px-4 py-3 border-b border-[#f0f0f0]">
          <h3 className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>Domicílio bancário</h3>
        </div>
        <Table columns={domColumns} dataSource={domicilioData} size="small" pagination={false} />
      </div>

      {/* Eventos de liquidação */}
      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="px-4 py-3 border-b border-[#f0f0f0]">
          <h3 className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>Eventos de liquidação</h3>
        </div>
        <Table columns={liqColumns} dataSource={liqData} size="small" pagination={{ pageSize: 10 }} />
        {/* Totalizador */}
        <div className="flex justify-end gap-6 px-4 py-3 border-t border-[#f0f0f0]" style={{ background: '#E6F7FF' }}>
          <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">Total bruto</div><div className="text-sm font-bold text-[#1890FF]">R$ 290.220</div></div>
          <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">Total MDR</div><div className="text-sm font-bold text-[#FF4D4F]">R$ 8.707</div></div>
          <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">Total antecip.</div><div className="text-sm font-bold text-[#FA8C16]">R$ 4.200</div></div>
          <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">Total líquido</div><div className="text-sm font-bold text-[#52C41A]">R$ 277.313</div></div>
        </div>
      </div>

      {/* Drawer Detalhes */}
      <Drawer
        open={!!drawerRow}
        onClose={() => setDrawerRow(null)}
        width={480}
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-base font-semibold">Detalhes da Liquidação</span>
            <button onClick={() => setDrawerRow(null)} aria-label="Fechar detalhes" className="text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.85)]">
              <X size={18} />
            </button>
          </div>
        }
        closable={false}
        footer={
          <div className="flex gap-3">
            <Button icon={<Download size={14} />} style={{ borderRadius: 2 }}>Baixar comprovante</Button>
            <Button danger icon={<RotateCcw size={14} />} style={{ borderRadius: 2 }}>Estornar</Button>
          </div>
        }
        footerStyle={{ padding: '14px 24px', borderTop: '1px solid #f0f0f0' }}
      >
        {drawerRow && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusTag status="Liquidado" />
              <span className="text-xs text-[rgba(0,0,0,0.45)]">{drawerRow.data}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Adquirente', value: drawerRow.adquirente },
                { label: 'Tipo', value: drawerRow.tipo },
                { label: 'Conta crédito', value: drawerRow.conta },
                { label: 'Bandeiras', value: 'Visa / Mastercard' },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-xs text-[rgba(0,0,0,0.45)] mb-0.5">{f.label}</div>
                  <div className="text-sm font-medium">{f.value}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#f0f0f0] pt-4">
              <h4 className="text-sm font-medium mb-3" style={{ color: 'rgba(0,0,0,0.85)' }}>Resumo financeiro</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-sm border p-3" style={{ background: '#E6F7FF', borderColor: '#91D5FF' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Bruto</div>
                  <div className="text-base font-bold text-[#1890FF]">{drawerRow.bruto}</div>
                </div>
                <div className="rounded-sm border p-3" style={{ background: '#FFF1F0', borderColor: '#FFCCC7' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">MDR</div>
                  <div className="text-base font-bold text-[#FF4D4F]">{drawerRow.mdr}</div>
                </div>
                <div className="rounded-sm border p-3" style={{ background: '#FFF7E6', borderColor: '#FFD591' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Antecipação</div>
                  <div className="text-base font-bold text-[#FA8C16]">{drawerRow.antecip}</div>
                </div>
                <div className="rounded-sm border p-3" style={{ background: '#F6FFED', borderColor: '#B7EB8F' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Líquido</div>
                  <div className="text-base font-bold text-[#52C41A]">{drawerRow.liquido}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
