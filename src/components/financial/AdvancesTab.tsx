'use client'

import { useState } from 'react'
import { Table, Button, Drawer, Select, Form, InputNumber } from 'antd'
import Tooltip from '@/components/shared/Tooltip'
import Tag from '@/components/shared/Tag'
import { PlusCircle, X, RefreshCw, ChevronDown, ChevronUp, Info } from 'lucide-react'
import KpiCard from '@/components/ui/KpiCard'

const { Option } = Select

interface AntRow { key: string; id: string; data: string; merchant: string; valor: string; taxa: string; juros: string; vencimento: string; aRecuperar: string; status: string }

const data: AntRow[] = [
  { key: '1', id: 'ANT-0041', data: '20/04/2026', merchant: 'Restaurante Bom Sabor', valor: 'R$ 24.000', taxa: '2,8%/m', juros: 'R$ 672', vencimento: '15/05/2026', aRecuperar: 'R$ 24.672', status: 'A recuperar' },
  { key: '2', id: 'ANT-0039', data: '18/04/2026', merchant: 'Farmácia Saúde Total', valor: 'R$ 18.500', taxa: '2,8%/m', juros: 'R$ 518', vencimento: '10/05/2026', aRecuperar: 'R$ 19.018', status: 'A recuperar' },
  { key: '3', id: 'ANT-0035', data: '10/04/2026', merchant: 'Eletrônicos Max', valor: 'R$ 45.000', taxa: '2,5%/m', juros: 'R$ 1.125', vencimento: '30/04/2026', aRecuperar: 'R$ 0', status: 'Recuperado' },
  { key: '4', id: 'ANT-0033', data: '08/04/2026', merchant: 'Mercado Boa Vista', valor: 'R$ 62.300', taxa: '2,5%/m', juros: 'R$ 1.558', vencimento: '28/04/2026', aRecuperar: 'R$ 18.900', status: 'A recuperar' },
  { key: '5', id: 'ANT-0030', data: '01/04/2026', merchant: 'Auto Peças Centro', valor: 'R$ 11.200', taxa: '3,0%/m', juros: 'R$ 336', vencimento: '20/04/2026', aRecuperar: 'R$ 0', status: 'Recuperado' },
]

interface SimResult { bruto: number; repasse: number; custos: number; liquido: number; detalhe: string[] }

function simulate(valor: number, bandeira: string, metodo: string): SimResult {
  const mdr: Record<string, number> = { Visa: 0.03, Mastercard: 0.028, Elo: 0.032, PIX: 0.005 }
  const taxa = mdr[bandeira] ?? 0.03
  const metodoFee = metodo === 'Crédito' ? 0.005 : 0.002
  const custos = valor * (taxa + metodoFee)
  const repasse = valor - custos
  return {
    bruto: valor,
    repasse: Math.round(repasse * 100) / 100,
    custos: Math.round(custos * 100) / 100,
    liquido: Math.round(repasse * 100) / 100,
    detalhe: [
      `MDR ${bandeira}: ${(taxa * 100).toFixed(1)}% → R$ ${(valor * taxa).toFixed(2)}`,
      `Taxa ${metodo}: ${(metodoFee * 100).toFixed(1)}% → R$ ${(valor * metodoFee).toFixed(2)}`,
    ],
  }
}

const fmt = (n: number) => `R$ ${n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', render: (v: string) => <span className="font-mono text-xs text-[#1890FF]">{v}</span> },
  { title: 'Data', dataIndex: 'data', key: 'data' },
  { title: 'Merchant (EC)', dataIndex: 'merchant', key: 'merchant' },
  { title: 'Valor antecipado', dataIndex: 'valor', key: 'valor', align: 'right' as const, render: (v: string) => <span className="font-semibold text-[#FA8C16]">{v}</span> },
  { title: 'Taxa cobrada', dataIndex: 'taxa', key: 'taxa', align: 'right' as const },
  { title: 'Juros recebidos', dataIndex: 'juros', key: 'juros', align: 'right' as const, render: (v: string) => <span className="text-[#52C41A]">{v}</span> },
  { title: 'Vencimento', dataIndex: 'vencimento', key: 'vencimento' },
  { title: 'A recuperar', dataIndex: 'aRecuperar', key: 'aRecuperar', align: 'right' as const, render: (v: string) => <span className="font-semibold">{v}</span> },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag status={v} /> },
]

const kpis = [
  { label: 'Total antecipado', value: 'R$ 161.000', variant: 'orange' as const, tooltip: 'Total concedido a merchants no período' },
  { label: 'Juros a receber', value: 'R$ 4.209', variant: 'success' as const },
  { label: 'A recuperar', value: 'R$ 62.590', variant: 'warning' as const },
  { label: 'Recuperado', value: 'R$ 56.200', variant: 'neutral' as const },
]

const recoveryFlow = [
  { key: '1', data: '22/04/2026', merchant: 'Restaurante Bom Sabor', adquirente: 'Adiq',  parcela: 'R$ 5.100',  operacao: 'ANT-0041', saldoApos: 'R$ 19.572' },
  { key: '2', data: '22/04/2026', merchant: 'Mercado Boa Vista',     adquirente: 'Rede',  parcela: 'R$ 3.300',  operacao: 'ANT-0033', saldoApos: 'R$ 15.600' },
  { key: '3', data: '28/04/2026', merchant: 'Mercado Boa Vista',     adquirente: 'Rede',  parcela: 'R$ 8.200',  operacao: 'ANT-0033', saldoApos: 'R$ 7.400'  },
  { key: '4', data: '10/05/2026', merchant: 'Farmácia Saúde Total',  adquirente: 'Cielo', parcela: 'R$ 9.500',  operacao: 'ANT-0039', saldoApos: 'R$ 9.518'  },
  { key: '5', data: '15/05/2026', merchant: 'Restaurante Bom Sabor', adquirente: 'Adiq',  parcela: 'R$ 12.000', operacao: 'ANT-0041', saldoApos: 'R$ 7.572'  },
]

const recoveryColumns = [
  { title: 'Data prevista',           dataIndex: 'data',       key: 'data',       width: 110 },
  { title: 'Merchant (EC)',           dataIndex: 'merchant',   key: 'merchant' },
  { title: 'Adquirente',             dataIndex: 'adquirente', key: 'adquirente', width: 100 },
  { title: 'Parcela a recuperar',    dataIndex: 'parcela',    key: 'parcela',    align: 'right' as const, render: (v: string) => <span className="font-semibold" style={{ color: '#722ED1' }}>{v}</span> },
  { title: 'Operação',               dataIndex: 'operacao',   key: 'operacao',   render: (v: string) => <span className="font-mono text-xs text-[#1890FF]">{v}</span> },
  { title: 'Saldo após recuperação', dataIndex: 'saldoApos',  key: 'saldoApos',  align: 'right' as const, render: (v: string) => <span className="text-[#FAAD14]">{v}</span> },
]

export default function AdvancesTab() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [simResult, setSimResult] = useState<SimResult | null>(null)
  const [showFlow, setShowFlow] = useState(true)
  const [form] = Form.useForm()

  const handleSimulate = () => {
    const vals = form.getFieldsValue()
    if (vals.valor && vals.bandeira && vals.metodo) {
      setSimResult(simulate(vals.valor, vals.bandeira, vals.metodo))
    }
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-sm px-4 py-3" style={{ background: '#E6F7FF', border: '1px solid #91D5FF' }}>
        <p className="text-sm m-0" style={{ color: 'rgba(0,0,0,0.85)' }}>
          <span className="font-medium">Produto de antecipação para merchants:</span>{' '}
          O sub-adquirente oferece adiantamento do recebível ao merchant (EC) e recupera o valor quando o adquirente liquidar.
        </p>
      </div>

      {/* KPIs */}
      <div className="flex flex-wrap gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
          <h3 className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>Antecipações concedidas</h3>
          <Button
            type="primary"
            icon={<PlusCircle size={14} />}
            size="small"
            onClick={() => setDrawerOpen(true)}
            style={{ background: '#1890FF', borderColor: '#1890FF', borderRadius: 2 }}
          >
            Simular antecipação
          </Button>
        </div>
        <Table columns={columns} dataSource={data} size="small" pagination={{ pageSize: 10 }} />
        <div className="flex justify-end gap-6 px-4 py-3 border-t border-[#f0f0f0]" style={{ background: '#F6FFED' }}>
          <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">Total antecipado</div><div className="text-sm font-bold text-[#FA8C16]">R$ 161.000</div></div>
          <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">Juros a receber</div><div className="text-sm font-bold text-[#52C41A]">R$ 4.209</div></div>
          <div className="text-right"><div className="text-xs text-[rgba(0,0,0,0.65)]">A recuperar</div><div className="text-sm font-bold text-[#FAAD14]">R$ 62.590</div></div>
        </div>
      </div>

      {/* Fluxo de recuperação */}
      <div className="bg-white rounded-sm border border-[#f0f0f0]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <button
          className="w-full flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors"
          onClick={() => setShowFlow(v => !v)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.85)' }}>
              Fluxo de recuperação — parcelas a receber dos adquirentes
            </span>
            <Tooltip text="Parcelas futuras oneradas que serão retidas pelo sub ao receber do adquirente, abatendo o saldo de cada antecipação concedida." delay={1000} bare>
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
            dataSource={recoveryFlow}
            size="small"
            pagination={false}
            footer={() => (
              <span className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>
                As parcelas listadas estão oneradas e serão retidas pelo sub-adquirente na liquidação do adquirente.
              </span>
            )}
          />
        )}
      </div>

      {/* Drawer simulação */}
      <Drawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSimResult(null); form.resetFields() }}
        width={480}
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-base font-semibold">Simular antecipação</span>
            <button onClick={() => { setDrawerOpen(false); setSimResult(null) }} aria-label="Fechar simulação" className="text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.85)]">
              <X size={18} />
            </button>
          </div>
        }
        closable={false}
        footer={null}
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item label="Valor da cobrança (R$)" name="valor" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%', borderRadius: 2 }} precision={2} placeholder="0,00" />
          </Form.Item>
          <Form.Item label="Método de pagamento" name="metodo" rules={[{ required: true }]}>
            <Select placeholder="Selecione" style={{ borderRadius: 2 }}>
              {['Crédito', 'Débito', 'PIX'].map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Bandeira" name="bandeira" rules={[{ required: true }]}>
            <Select placeholder="Selecione" style={{ borderRadius: 2 }}>
              {['Visa','Mastercard','Elo','PIX'].map(b => <Option key={b} value={b}>{b}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="MCC do merchant" name="mcc">
            <Select placeholder="Selecione (opcional)" style={{ borderRadius: 2 }}>
              {['5812 - Restaurantes','5912 - Farmácias','5411 - Mercados','5734 - Eletrônicos'].map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Form.Item>

          {!simResult ? (
            <Button type="primary" block onClick={handleSimulate} style={{ background: '#1890FF', borderRadius: 2 }}>
              Simular
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-sm border p-3" style={{ background: '#E6F7FF', borderColor: '#91D5FF' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Bruto</div>
                  <div className="text-base font-bold text-[#1890FF]">{fmt(simResult.bruto)}</div>
                </div>
                <div className="rounded-sm border p-3" style={{ background: '#F6FFED', borderColor: '#B7EB8F' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Repasse EC</div>
                  <div className="text-base font-bold text-[#52C41A]">{fmt(simResult.repasse)}</div>
                </div>
                <div className="rounded-sm border p-3" style={{ background: '#FFF1F0', borderColor: '#FFCCC7' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Custos</div>
                  <div className="text-base font-bold text-[#FF4D4F]">{fmt(simResult.custos)}</div>
                </div>
                <div className="rounded-sm border p-3" style={{ background: '#F6FFED', borderColor: '#B7EB8F' }}>
                  <div className="text-xs text-[rgba(0,0,0,0.65)]">Líquido sub</div>
                  <div className="text-base font-bold text-[#52C41A]">{fmt(simResult.liquido)}</div>
                </div>
              </div>
              <div className="rounded-sm p-3 space-y-1.5" style={{ background: '#f5f5f5' }}>
                <div className="text-xs font-medium text-[rgba(0,0,0,0.65)] mb-2">Detalhamento</div>
                {simResult.detalhe.map(d => (
                  <div key={d} className="text-xs text-[rgba(0,0,0,0.65)]">• {d}</div>
                ))}
              </div>
              <Button
                icon={<RefreshCw size={14} />}
                block
                onClick={() => setSimResult(null)}
                style={{ borderRadius: 2 }}
              >
                Refazer simulação
              </Button>
            </div>
          )}
        </Form>
      </Drawer>
    </div>
  )
}
