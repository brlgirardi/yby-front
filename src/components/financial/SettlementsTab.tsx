// src/components/financial/SettlementsTab.tsx
'use client'

import { useState } from 'react'
import { Table, Button, Drawer, Skeleton, Alert, Tooltip } from 'antd'
import { Download, X } from 'lucide-react'
import KpiCard from '@/components/ui/KpiCard'
import StatusTag from '@/components/atoms/Tag'
import OpTypeTag from '@/components/atoms/OpTypeTag'
import { useSettlementData } from '@/hooks/settlement/useSettlementData'
import { formatBRL, decimalToFloat } from '@/lib/format'
import type { Settlement } from '@/services/types/settlement.types'

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
  const { settlements, loading, error, reload } = useSettlementData()
  const [drawerRow, setDrawerRow] = useState<Settlement | null>(null)

  const totalOriginal = settlements.reduce((s, r) => s + decimalToFloat(r.originalValue), 0)
  const totalNet      = settlements.reduce((s, r) => s + decimalToFloat(r.netValue), 0)
  const totalFee      = settlements.reduce((s, r) => s + decimalToFloat(r.feeValue ?? { amount: 0, scale: 2 }), 0)

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const kpis = [
    { label: 'Total de operações', value: String(settlements.length), variant: 'info' as const },
    { label: 'Valor original total', value: fmt(totalOriginal), variant: 'success' as const },
    { label: 'Valor líquido total', value: fmt(totalNet), variant: 'info' as const },
    // Taxa é custo esperado, não erro. Vermelho em KPI financeiro dispara ansiedade e vira "wolf cry".
    { label: 'Taxas (fees)', value: fmt(totalFee), variant: 'orange' as const },
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
      render: (v: string) => <OpTypeTag type={v} />,
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
      render: (v: Settlement['originalValue']) => <span className="font-semibold text-accent">{formatBRL(v)}</span>,
    },
    {
      title: 'Taxa',
      dataIndex: 'feeValue',
      key: 'feeValue',
      align: 'right' as const,
      render: (v: Settlement['feeValue']) => <span className="text-orange">{formatBRL(v)}</span>,
    },
    {
      title: 'Valor líquido',
      dataIndex: 'netValue',
      key: 'netValue',
      align: 'right' as const,
      render: (v: Settlement['netValue']) => <span className="font-semibold text-success">{formatBRL(v)}</span>,
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
        <Button type="link" size="small" onClick={() => setDrawerRow(row)} className="!p-0 !text-accent !text-sm">
          Detalhes
        </Button>
      ),
    },
  ]

  if (error) {
    return (
      <Alert
        type="error"
        message="Erro ao carregar liquidações"
        description={error}
        showIcon
        closable
        action={
          <Button
            size="small"
            onClick={reload}
            aria-label="Tentar carregar liquidações novamente"
          >
            Tentar novamente
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex items-start gap-3 rounded-xs px-4 py-3 bg-info-bg border border-info-border">
        <p className="text-sm m-0 text-text-primary">
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
      <div className="bg-white rounded-xs border border-border-split shadow-card">
        <div className="px-4 py-3 border-b border-border-split">
          <h3 className="text-sm font-medium text-text-primary">Eventos de liquidação</h3>
        </div>
        <Table
          columns={columns}
          dataSource={settlements.map(s => ({ ...s, key: s.id }))}
          size="small"
          pagination={{ pageSize: 10 }}
          loading={loading}
          locale={{ emptyText: 'Nenhuma liquidação encontrada' }}
        />
        {!loading && settlements.length > 0 && (
          <div className="flex justify-end gap-6 px-4 py-3 border-t border-border-split bg-info-bg">
            <div className="text-right">
              <div className="text-xs text-text-secondary">Total original</div>
              <div className="text-sm font-bold text-accent">{fmt(totalOriginal)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-secondary">Total taxas</div>
              <div className="text-sm font-bold text-orange">{fmt(totalFee)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-secondary">Total líquido</div>
              <div className="text-sm font-bold text-success">{fmt(totalNet)}</div>
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
            <button
              onClick={() => setDrawerRow(null)}
              aria-label="Fechar"
              className="text-text-tertiary hover:text-text-primary"
            >
              <X size={18} />
            </button>
          </div>
        }
        closable={false}
        footer={
          <div className="flex gap-3">
            <Tooltip title="Em breve">
              <Button icon={<Download size={14} />} className="!rounded-xs" disabled>
                Baixar comprovante
              </Button>
            </Tooltip>
          </div>
        }
        footerStyle={{ padding: '14px 24px', borderTop: '1px solid #F0F0F0' }}
      >
        {drawerRow && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {drawerRow.status === 'processed' && <StatusTag status="Liquidado" />}
              {drawerRow.status === 'pending'   && <StatusTag status="Pendente" label="Pendente" />}
              {drawerRow.status === 'rejected'  && <StatusTag status="Suspenso" label="Rejeitado" />}
              <span className="text-xs text-text-tertiary">{formatDate(drawerRow.settlementDate)}</span>
            </div>

            {/* Resumo financeiro primeiro: é o que o operador olha antes da metadata técnica. */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-text-primary">Resumo financeiro</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xs border p-3 bg-info-bg border-info-border">
                  <div className="text-xs text-text-secondary">Valor original</div>
                  <div className="text-md font-bold text-accent">{formatBRL(drawerRow.originalValue)}</div>
                </div>
                <div className="rounded-xs border p-3 bg-orange-bg border-orange-border">
                  <div className="text-xs text-text-secondary">Taxa</div>
                  <div className="text-md font-bold text-orange">{formatBRL(drawerRow.feeValue)}</div>
                </div>
                <div className="rounded-xs border p-3 col-span-2 bg-success-bg border-success-border">
                  <div className="text-xs text-text-secondary">Valor líquido</div>
                  <div className="text-md font-bold text-success">{formatBRL(drawerRow.netValue)}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-border-split pt-4">
              <h4 className="text-sm font-medium mb-3 text-text-primary">Detalhes técnicos</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'ID da operação', value: drawerRow.operationId },
                  { label: 'Tipo', value: drawerRow.operationType === 'Credit' ? 'Crédito' : 'Débito' },
                  { label: 'Arranjo de pagamento', value: drawerRow.paymentArrangement },
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
                    <div className="text-xs text-text-tertiary mb-0.5">{f.label}</div>
                    <div className="text-sm font-medium font-mono">{f.value}</div>
                  </div>
                ))}
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
