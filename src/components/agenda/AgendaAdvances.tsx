'use client'

import { useState } from 'react'
import { Table } from 'antd'
import Tooltip from '@/components/shared/Tooltip'
import Tag from '@/components/shared/Tag'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'
import KpiCard from '@/components/ui/KpiCard'

const data = [
  { key: '1', id: 'ANT-0041', merchant: 'Restaurante Bom Sabor', valor: 'R$ 24.000', taxa: '2,8%/m', juros: 'R$ 672', vencimento: '15/05/2026', aRecuperar: 'R$ 24.672', status: 'A recuperar' },
  { key: '2', id: 'ANT-0039', merchant: 'Farmácia Saúde Total',  valor: 'R$ 18.500', taxa: '2,8%/m', juros: 'R$ 518', vencimento: '10/05/2026', aRecuperar: 'R$ 19.018', status: 'A recuperar' },
  { key: '3', id: 'ANT-0035', merchant: 'Eletrônicos Max',        valor: 'R$ 45.000', taxa: '2,5%/m', juros: 'R$ 1.125', vencimento: '30/04/2026', aRecuperar: 'R$ 0',      status: 'Recuperado' },
  { key: '4', id: 'ANT-0033', merchant: 'Mercado Boa Vista',      valor: 'R$ 62.300', taxa: '2,5%/m', juros: 'R$ 1.558', vencimento: '28/04/2026', aRecuperar: 'R$ 18.900', status: 'A recuperar' },
  { key: '5', id: 'ANT-0030', merchant: 'Auto Peças Centro',      valor: 'R$ 11.200', taxa: '3,0%/m', juros: 'R$ 336',   vencimento: '20/04/2026', aRecuperar: 'R$ 0',      status: 'Recuperado' },
]

// Fluxo de recuperação — parcelas que chegam do adquirente e vão abater antecipações concedidas
const recoveryFlow = [
  { data: '22/04/2026', merchant: 'Restaurante Bom Sabor', adquirente: 'Adiq', parcela: 'R$ 5.100', operacao: 'ANT-0041', saldoApos: 'R$ 19.572' },
  { data: '22/04/2026', merchant: 'Mercado Boa Vista',     adquirente: 'Rede', parcela: 'R$ 3.300', operacao: 'ANT-0033', saldoApos: 'R$ 15.600' },
  { data: '28/04/2026', merchant: 'Mercado Boa Vista',     adquirente: 'Rede', parcela: 'R$ 8.200', operacao: 'ANT-0033', saldoApos: 'R$ 7.400'  },
  { data: '10/05/2026', merchant: 'Farmácia Saúde Total',  adquirente: 'Cielo', parcela: 'R$ 9.500', operacao: 'ANT-0039', saldoApos: 'R$ 9.518' },
  { data: '15/05/2026', merchant: 'Restaurante Bom Sabor', adquirente: 'Adiq', parcela: 'R$ 12.000', operacao: 'ANT-0041', saldoApos: 'R$ 7.572' },
]

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', render: (v: string) => <span className="font-mono text-xs text-[#1890FF]">{v}</span> },
  { title: 'Data', key: 'data', render: () => '24/04/2026', width: 110 },
  { title: 'Merchant (EC)', dataIndex: 'merchant', key: 'merchant' },
  { title: 'Valor antecipado', dataIndex: 'valor', key: 'valor', align: 'right' as const, render: (v: string) => <span className="font-semibold text-[#FA8C16]">{v}</span> },
  { title: 'Taxa cobrada', dataIndex: 'taxa', key: 'taxa', align: 'right' as const },
  { title: 'Juros recebidos', dataIndex: 'juros', key: 'juros', align: 'right' as const, render: (v: string) => <span className="text-[#52C41A]">{v}</span> },
  { title: 'Vencimento', dataIndex: 'vencimento', key: 'vencimento' },
  { title: 'A recuperar', dataIndex: 'aRecuperar', key: 'aRecuperar', align: 'right' as const, render: (v: string) => <span className="font-semibold">{v}</span> },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag status={v} /> },
]

const recoveryColumns = [
  { title: 'Data prevista', dataIndex: 'data', key: 'data', width: 110 },
  { title: 'Merchant (EC)', dataIndex: 'merchant', key: 'merchant' },
  { title: 'Adquirente', dataIndex: 'adquirente', key: 'adquirente', width: 100 },
  { title: 'Parcela a recuperar', dataIndex: 'parcela', key: 'parcela', align: 'right' as const, render: (v: string) => <span className="font-semibold text-[#722ED1]">{v}</span> },
  { title: 'Operação', dataIndex: 'operacao', key: 'operacao', render: (v: string) => <span className="font-mono text-xs text-[#1890FF]">{v}</span> },
  { title: 'Saldo após recuperação', dataIndex: 'saldoApos', key: 'saldoApos', align: 'right' as const, render: (v: string) => <span className="text-[#FAAD14]">{v}</span> },
]

const kpis = [
  { label: 'Total antecipado', value: 'R$ 161.000', variant: 'orange' as const, tooltip: 'Soma dos valores antecipados a merchants (ECs) ativos' },
  { label: 'Juros a receber', value: 'R$ 4.209', variant: 'success' as const },
  { label: 'A recuperar', value: 'R$ 62.590', variant: 'warning' as const, tooltip: 'Saldo ainda não recuperado dos adquirentes via liquidação' },
  { label: 'Recuperado', value: 'R$ 56.200', variant: 'neutral' as const },
]

export default function AgendaAdvances() {
  const [showFlow, setShowFlow] = useState(true)

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-sm px-4 py-3" style={{ background: '#E6F7FF', border: '1px solid #91D5FF' }}>
        <p className="text-sm m-0" style={{ color: 'rgba(0,0,0,0.85)' }}>
          <span className="font-medium">Antecipações concedidas a merchants:</span>{' '}
          O sub-adquirente adianta o recebível do EC e recupera o valor quando o adquirente liquidar as parcelas. As parcelas ficam oneradas e o valor de recuperação aparece no fluxo do calendário.
        </p>
      </div>

      {/* KPIs */}
      <div className="flex flex-wrap gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Tabela de operações */}
      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="px-4 py-3 border-b border-[#f0f0f0]">
          <span className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>Operações ativas</span>
        </div>
        <Table columns={columns} dataSource={data} size="small" pagination={{ pageSize: 10 }} />
        <div className="flex justify-end px-4 py-3 border-t border-[#f0f0f0]" style={{ background: '#FFF7E6' }}>
          <div className="flex gap-8">
            <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">Total antecipado</div><div className="text-sm font-bold text-[#FA8C16]">R$ 161.000</div></div>
            <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">Juros a receber</div><div className="text-sm font-bold text-[#52C41A]">R$ 4.209</div></div>
            <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">A recuperar</div><div className="text-sm font-bold text-[#FAAD14]">R$ 62.590</div></div>
          </div>
        </div>
      </div>

      {/* Fluxo de recuperação cruzado com calendário */}
      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <button
          className="w-full flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors"
          onClick={() => setShowFlow(v => !v)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>
              Fluxo de recuperação — parcelas a receber dos adquirentes
            </span>
            <Tooltip text="Mostra quais parcelas futuras, já oneradas, vão abater as antecipações concedidas. Reflete o que aparece como 'Antecipações concedidas' no detalhe de cada dia do calendário." delay={1000} bare>
              <Info size={14} style={{ color: 'rgba(0,0,0,0.45)' }} />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#F9F0FF', color: '#722ED1', border: '1px solid #D3ADF7' }}>
              R$ 38.100 nos próx. 30 dias
            </span>
            {showFlow ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
        {showFlow && (
          <Table
            columns={recoveryColumns}
            dataSource={recoveryFlow.map((r, i) => ({ ...r, key: i }))}
            size="small"
            pagination={false}
            footer={() => (
              <div className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>
                As parcelas listadas estão oneradas e serão retidas pelo sub-adquirente na liquidação do adquirente.
              </div>
            )}
          />
        )}
      </div>
    </div>
  )
}
