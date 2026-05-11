'use client'

import { useState } from 'react'
import { Table, Tag, Button, Drawer, Skeleton, Alert } from 'antd'
import { Download, X } from 'lucide-react'
import KpiCard from '@/components/ui/KpiCard'
import StatusTag from '@/components/shared/Tag'
import { useSettlementData } from '@/hooks/settlement/useSettlementData'
import { formatBRL, decimalToFloat } from '@/services/settlementService'
import type { Settlement } from '@/services/types/settlement.types'

const OP_TYPE_COLOR: Record<string, string> = {
  Credit: 'blue',
  Debit: 'orange',
}

const STATUS_LABEL: Record<string, string> = {
  processed: 'Processado',
  pending: 'Pendente',
  rejected: 'Rejeitado',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}

function formatAccount(acc: Settlement['receiverAccount']): string {
  if (!acc) return '—'
  return `${acc.Bank} ...${acc.Number.slice(-4)}`
}

function formatCNPJ(cnpj: string): string {
  const d = cnpj.replace(/\D/g, '')
  if (d.length !== 14) return cnpj
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

export default function SettlementsTab() {
  const { settlements, loading, error } = useSettlementData()
  const [drawerRow, setDrawerRow] = useState<Settlement | null>(null)

  const totalOriginal = settlements.reduce((s, r) => s + decimalToFloat(r.originalValue), 0)
  const totalNet      = settlements.reduce((s, r) => s + decimalToFloat(r.netValue), 0)
  const totalFee      = settlements.reduce((s, r) => s + decimalToFloat(r.feeValue ?? { amount: 0, scale: 2 }), 0)

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const kpis = [
    { label: 'Total de operações', value: String(settlements.length), variant: 'info' as const },
    { label: 'Valor original total', value: fmt(totalOriginal), variant: 'success' as const },
    { label: 'Valor líquido total', value: fmt(totalNet), variant: 'info' as const },
    { label: 'Taxas (fees)', value: fmt(totalFee), variant: 'error' as const },
  ]

  const columns = [
    {
      title: 'Data',
      dataIndex: 'settlementDate',
      key: 'settlementDate',
      width: 110,
      render: (v: string) => formatDate(v),
    },
    {
      title: 'Tipo',
      dataIndex: 'operationType',
      key: 'operationType',
      render: (v: string) => <Tag color={OP_TYPE_COLOR[v] ?? 'default'}>{v === 'Credit' ? 'Crédito' : v === 'Debit' ? 'Débito' : v}</Tag>,
    },
    {
      title: 'Arranjo',
      dataIndex: 'paymentArrangement',
      key: 'paymentArrangement',
      render: (v: string) => <span className="font-mono text-xs">{v}</span>,
    },
    {
      title: 'Agente origem',
      dataIndex: 'originAgent',
      key: 'originAgent',
      render: (v: string) => <span className="font-mono text-xs">{formatCNPJ(v)}</span>,
    },
    {
      title: 'Valor original',
      dataIndex: 'originalValue',
      key: 'originalValue',
      align: 'right' as const,
      render: (v: Settlement['originalValue']) => <span className="font-semibold text-[#1890FF]">{formatBRL(v)}</span>,
    },
    {
      title: 'Taxa',
      dataIndex: 'feeValue',
      key: 'feeValue',
      align: 'right' as const,
      render: (v: Settlement['feeValue']) => <span className="text-[#FF4D4F]">{formatBRL(v)}</span>,
    },
    {
      title: 'Valor líquido',
      dataIndex: 'netValue',
      key: 'netValue',
      align: 'right' as const,
      render: (v: Settlement['netValue']) => <span className="font-semibold text-[#52C41A]">{formatBRL(v)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => {
        if (v === 'processed') return <StatusTag status="Liquidado" />
        if (v === 'rejected')  return <StatusTag status="Suspenso" label="Rejeitado" />
        return <StatusTag status="Pendente" label={STATUS_LABEL[v] ?? v} />
      },
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_: unknown, row: Settlement) => (
        <Button type="link" size="small" onClick={() => setDrawerRow(row)} style={{ padding: 0, color: '#1890FF', fontSize: 12 }}>
          Detalhes
        </Button>
      ),
    },
  ]

  if (error) {
    return <Alert type="error" message="Erro ao carregar liquidações" description={error} showIcon />
  }

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex items-start gap-3 rounded-sm px-4 py-3" style={{ background: '#E6F7FF', border: '1px solid #91D5FF' }}>
        <p className="text-sm m-0" style={{ color: 'rgba(0,0,0,0.85)' }}>
          <span className="font-medium">Liquidação centralizada via Nuclea:</span>{' '}
          Registros de liquidação interbancária processados pelo sistema SLC. Valores em BRL (ISO 986).
        </p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2, 3].map(i => <Skeleton.Input key={i} active style={{ width: 200, height: 72 }} />)}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {kpis.map(k => <KpiCard key={k.label} {...k} />)}
        </div>
      )}

      {/* Tabela de eventos */}
      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="px-4 py-3 border-b border-[#f0f0f0]">
          <h3 className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>Eventos de liquidação</h3>
        </div>
        <Table
          columns={columns}
          dataSource={settlements.map(s => ({ ...s, key: s.id }))}
          size="small"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
        {!loading && settlements.length > 0 && (
          <div className="flex justify-end gap-6 px-4 py-3 border-t border-[#f0f0f0]" style={{ background: '#E6F7FF' }}>
            <div className="text-right">
              <div className="text-xs text-[rgba(0,0,0,0.65)]">Total original</div>
              <div className="text-sm font-bold text-[#1890FF]">{fmt(totalOriginal)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[rgba(0,0,0,0.65)]">Total taxas</div>
              <div className="text-sm font-bold text-[#FF4D4F]">{fmt(totalFee)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[rgba(0,0,0,0.65)]">Total líquido</div>
              <div className="text-sm font-bold text-[#52C41A]">{fmt(totalNet)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Detalhes */}
      <Drawer
        open={!!drawerRow}
        onClose={() => setDrawerRow(null)}
        width={480}
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-base font-semibold">Detalhes da Liquidação</span>
            <button onClick={() => setDrawerRow(null)} aria-label="Fechar" className="text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.85)]">
              <X size={18} />
            </button>
          </div>
        }
        closable={false}
        footer={
          <div className="flex gap-3">
            <Button icon={<Download size={14} />} style={{ borderRadius: 2 }}>Baixar comprovante</Button>
          </div>
        }
        footerStyle={{ padding: '14px 24px', borderTop: '1px solid #f0f0f0' }}
      >
        {drawerRow && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {drawerRow.status === 'processed' && <StatusTag status="Liquidado" />}
              {drawerRow.status === 'pending'   && <StatusTag status="Pendente" label="Pendente" />}
              {drawerRow.status === 'rejected'  && <StatusTag status="Suspenso" label="Rejeitado" />}
              <span className="text-xs text-[rgba(0,0,0,0.45)]">{formatDate(drawerRow.settlementDate)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'ID da operação', value: drawerRow.operationId },
                { label: 'Tipo', value: drawerRow.operationType === 'Credit' ? 'Crédito' : 'Débito' },
                { label: 'Arranjo pagamento', value: drawerRow.paymentArrangement },
                { label: 'Instrumento', value: drawerRow.instrumentType },
                { label: 'Câmara', value: drawerRow.chamber },
                { label: 'Destino', value: drawerRow.destination ?? '—' },
                { label: 'Agente origem', value: formatCNPJ(drawerRow.originAgent) },
                { label: 'Agente destino', value: drawerRow.destinationAgent },
                { label: 'ISPB pagador', value: drawerRow.ispbPayer },
                { label: 'ISPB recebedor', value: drawerRow.ispbReceiver },
                { label: 'Conta pagadora', value: formatAccount(drawerRow.payerAccount) },
                { label: 'Conta recebedora', value: formatAccount(drawerRow.receiverAccount) },
              ].map(f => (
                <div key={f.label}>
                  <div className="text-xs text-[rgba(0,0,0,0.45)] mb-0.5">{f.label}</div>
                  <div className="text-sm font-medium font-mono">{f.value}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#f0f0f0] pt-4">
              <h4 className="text-sm font-medium mb-3" style={{ color: 'rgba(0,0,0,0.85)' }}>Resumo financeiro</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-sm border p-3" style={{ background: '#E6F7FF', borderColor: '#91D5FF' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Valor original</div>
                  <div className="text-base font-bold text-[#1890FF]">{formatBRL(drawerRow.originalValue)}</div>
                </div>
                <div className="rounded-sm border p-3" style={{ background: '#FFF1F0', borderColor: '#FFCCC7' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Taxa</div>
                  <div className="text-base font-bold text-[#FF4D4F]">{formatBRL(drawerRow.feeValue)}</div>
                </div>
                <div className="rounded-sm border p-3 col-span-2" style={{ background: '#F6FFED', borderColor: '#B7EB8F' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Valor líquido</div>
                  <div className="text-base font-bold text-[#52C41A]">{formatBRL(drawerRow.netValue)}</div>
                </div>
              </div>
            </div>

            {drawerRow.errorCode && (
              <Alert
                type="error"
                message={`Erro ${drawerRow.errorCode}`}
                description={drawerRow.errorMessage ?? ''}
                showIcon
              />
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}
