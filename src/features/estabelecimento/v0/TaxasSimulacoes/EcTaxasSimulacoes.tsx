'use client'
// Taxas e Simulações do Estabelecimento Comercial — V0.
// Padrão TUPI: SectionCard (Prazo de recebimento) + AccordionCard (modalidades)
// — header branco + body cinza, igual ao AcquirerCostCard do SUB Pricing.

import { useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Tooltip from '@/components/atoms/Tooltip'
import AccordionCard from '@/components/shared/AccordionCard'
import BrandLogo from '@/components/atoms/BrandLogo'
import SimulacaoDrawer from '@/features/estabelecimento/v0/shared/SimulacaoDrawer'
import { ecPrazoRecebimento, ecTaxasModalidades, type TaxaModalidadeForma } from '@/mocks/ec/financeiro'

// Render visual da célula de taxa — explica ITC com tooltip pro EC pequeno
function renderTaxa(text: string | undefined): React.ReactNode {
  if (!text) return '—'
  if (!text.includes('ITC')) return text
  const [percent, suffix] = text.split('+').map((s) => s.trim())
  return (
    <span>
      {percent} +{' '}
      <Tooltip bare text="ITC (Interchange + Card scheme fees) — taxa que a bandeira (Visa, Mastercard…) cobra do adquirente. Repassada na sua taxa final.">
        <span style={{ borderBottom: '1px dotted rgba(0,0,0,0.25)', cursor: 'help' }}>{suffix}</span>
      </Tooltip>
    </span>
  )
}

export default function EcTaxasSimulacoes() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [aviso, setAviso] = useState(true)

  const brandHeader = (brand: string) => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <BrandLogo brand={brand} size={28} />
    </div>
  )

  const taxaColumns: ColumnsType<TaxaModalidadeForma> = [
    { title: 'Forma de pagamento', dataIndex: 'forma', key: 'forma', width: 200 },
    { title: brandHeader('Mastercard'), key: 'master', align: 'center', render: (_, row) => renderTaxa(row.bandeiras.find((b) => b.bandeira === 'Mastercard')?.percentText) },
    { title: brandHeader('Visa'),       key: 'visa',   align: 'center', render: (_, row) => renderTaxa(row.bandeiras.find((b) => b.bandeira === 'Visa')?.percentText) },
    { title: brandHeader('Elo'),        key: 'elo',    align: 'center', render: (_, row) => renderTaxa(row.bandeiras.find((b) => b.bandeira === 'Elo')?.percentText) },
    { title: brandHeader('Amex'),       key: 'amex',   align: 'center', render: (_, row) => renderTaxa(row.bandeiras.find((b) => b.bandeira === 'Amex')?.percentText) },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Taxas e Simulações"
        breadcrumb="Estabelecimento Comercial / Financeiro / Taxas e Simulações"
        extra={<Button variant="primary" onClick={() => setDrawerOpen(true)}>Simulação</Button>}
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Prazo de recebimento — SectionCard pattern */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, background: '#E6F7FF', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="calendar" size={16} color="#1890FF" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Prazo de recebimento</div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Esse é o prazo de recebimento para as suas vendas.</div>
            </div>
          </div>
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {ecPrazoRecebimento.map((p) => (
              <div key={p.pagamento}>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Pagamento:</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{p.pagamento}</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 8 }}>Recebimento:</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{p.recebimento}</div>
              </div>
            ))}
          </div>
          {aviso && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0', background: '#F6FFED', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Icon name="info" size={14} color="#52C41A" />
              <span style={{ flex: 1, fontSize: 12, color: 'rgba(0,0,0,0.75)', lineHeight: '18px' }}>
                <strong style={{ color: '#52C41A' }}>Antecipação automática ativa.</strong>{' '}
                Vendas parceladas no crédito são pagas em <strong>uma única parcela</strong> em até 15 dias úteis — você não espera mês a mês.
              </span>
              <button
                aria-label="Fechar aviso"
                onClick={() => setAviso(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Modalidades — AccordionCard pattern (header branco, body cinza) */}
        {ecTaxasModalidades.map((mod) => (
          <AccordionCard
            key={mod.id}
            defaultOpen
            header={
              <>
                <div style={{ width: 32, height: 32, background: '#E6F7FF', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={mod.iconKey} size={16} color="#1890FF" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{mod.nome}</div>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{mod.descricao}</div>
                </div>
              </>
            }
            meta={<span>{mod.formas.length} formas configuradas</span>}
          >
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2 }}>
              <Table<TaxaModalidadeForma>
                columns={taxaColumns}
                dataSource={mod.formas}
                rowKey="forma"
                pagination={false}
                size="small"
              />
            </div>
          </AccordionCard>
        ))}
      </div>

      <SimulacaoDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
