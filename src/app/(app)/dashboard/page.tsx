'use client'
// Dashboard Sub-adquirente — refatorado para usar CardSection + wrappers Recharts.
// 3 abas: Geral / Planificação / Antecipação. Theme-aware (Tupi/Vero).

import { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import CardSection from '@/components/shared/CardSection'
import KpiCard from '@/components/ui/KpiCard'
import AppSelect from '@/components/ui/AppSelect'
import { useTheme } from '@/stores/themeStore'
import { DonutBreakdown, MultiLineKPI, BarList } from '@/components/charts'
import SubMonitorAvancado from '@/features/subadquirente/v1/MonitorAvancado/SubMonitorAvancado'

const MERCHANTS = [
  { id:'MCH-001', name:'Americanas S.A.',   cnpj:'00.776.574/0001-56', mcc:'5912', status:'Ativo',    volume:'R$ 1.240.500,00', txns: 8420 },
  { id:'MCH-002', name:'Magazine Luiza',    cnpj:'47.960.950/0001-21', mcc:'5731', status:'Ativo',    volume:'R$ 987.200,00',   txns: 6310 },
  { id:'MCH-003', name:'Rappi Brasil',      cnpj:'28.665.021/0001-89', mcc:'5812', status:'Ativo',    volume:'R$ 765.400,00',   txns:14980 },
  { id:'MCH-004', name:'iFood Ltda',        cnpj:'14.380.200/0001-21', mcc:'5812', status:'Ativo',    volume:'R$ 654.900,00',   txns:12340 },
  { id:'MCH-005', name:'Shopee Brasil',     cnpj:'35.060.991/0001-56', mcc:'5999', status:'Suspenso', volume:'R$ 432.100,00',   txns: 5670 },
  { id:'MCH-006', name:'Amazon Brasil',     cnpj:'15.436.940/0001-03', mcc:'5999', status:'Ativo',    volume:'R$ 2.180.700,00', txns:19850 },
  { id:'MCH-007', name:'Mercado Livre',     cnpj:'03.007.331/0001-41', mcc:'5999', status:'Ativo',    volume:'R$ 3.450.200,00', txns:28900 },
  { id:'MCH-008', name:'Netshoes',          cnpj:'07.526.557/0001-00', mcc:'5661', status:'Inativo',  volume:'R$ 89.400,00',    txns:  740 },
]

const BRAND_COLORS: Record<string, string> = {
  Visa:       '#1A1F71',
  Mastercard: '#EB001B',
  Elo:        '#52C41A',
  Outros:     '#D9D9D9',
}

export default function DashboardPage() {
  const [tab, setTab] = useState<'geral' | 'planificacao' | 'antecipacao'>('geral')
  const [mcc, setMcc] = useState<string>('all')
  const [periodo, setPeriodo] = useState<string>('2026-04')
  const theme = useTheme()
  const TABS: Array<{ key: 'geral' | 'planificacao' | 'antecipacao'; label: string }> = [
    { key: 'geral',         label: 'Geral' },
    { key: 'planificacao',  label: 'Planificação' },
    { key: 'antecipacao',   label: 'Antecipação' },
  ]
  const MCC_OPTIONS = [
    { value: 'all',  label: 'Todos os MCCs' },
    { value: '5912', label: '5912 — Farmácias' },
    { value: '5731', label: '5731 — Eletrônicos' },
    { value: '5812', label: '5812 — Restaurantes' },
    { value: '5999', label: '5999 — Varejo diversificado' },
    { value: '5661', label: '5661 — Calçados' },
  ]
  const PERIODO_OPTIONS = [
    { value: '2026-04', label: 'Abril 2026' },
    { value: '2026-03', label: 'Março 2026' },
    { value: '2026-02', label: 'Fevereiro 2026' },
    { value: '2026-01', label: 'Janeiro 2026' },
  ]

  const donutData = [
    { label: 'Visa',       value: 4823 },
    { label: 'Mastercard', value: 3241 },
    { label: 'Elo',        value: 1456 },
    { label: 'Outros',     value:  620 },
  ]

  const multilineData = ['Jan','Fev','Mar','Abr','Mai','Jun'].map((mes, i) => ({
    mes,
    visa:       [3200, 4100, 3800, 4823, 5200, 4900][i],
    mastercard: [2100, 2800, 3100, 3241, 3500, 3200][i],
    elo:        [ 900, 1100, 1300, 1456, 1600, 1400][i],
  }))

  const ranked = [...MERCHANTS].sort((a, b) => b.txns - a.txns).slice(0, 6)

  /**
   * Loading state — refletindo fetch real assim que o backend de transações
   * estiver no /v1/transactions/summaries. Resetar a cada mudança de filtro.
   */
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(id)
  }, [tab, mcc, periodo])

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      {/* Grid responsivo dos KPIs:
          - Mobile (<768px):  1 coluna empilhada
          - Pequena (<1024px): 2 colunas
          - Média (1024-1680px): 3 colunas — 3 cards na linha 1, 2 cards na linha 2
            (Merchants ativos e MDR ficam alinhados à esquerda; última coluna fica vazia
            por design — melhor que "4+1 solitário")
          - Grande (>=1680px): 5 colunas em linha única */}
      <style>{`
        .dashboard-kpi-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .dashboard-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .dashboard-kpi-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1680px) {
          .dashboard-kpi-grid { grid-template-columns: repeat(5, 1fr); }
        }
      `}</style>
      <PageHeader title="Dashboard" breadcrumb="Sub-adquirente / Dashboard" extra={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Tabs primary (Geral/Planificação/Antecipação) */}
          <div style={{ display: 'flex', gap: 4 }}>
            {TABS.map((t) => {
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    border: active ? `1px solid ${theme.primary}` : '1px solid #d9d9d9',
                    background: active ? theme.primaryBg : '#fff',
                    color: active ? theme.primary : 'rgba(0,0,0,0.65)',
                    borderRadius: 2,
                    padding: '6px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                    fontWeight: active ? 500 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Filtros */}
          <div style={{ width: 200 }}>
            <AppSelect
              placeholder="Todos os MCCs"
              value={mcc}
              options={MCC_OPTIONS}
              onChange={(v) => setMcc(String(v ?? 'all'))}
            />
          </div>
          <div style={{ width: 160 }}>
            <AppSelect
              placeholder="Período"
              value={periodo}
              options={PERIODO_OPTIONS}
              onChange={(v) => setPeriodo(String(v ?? '2026-04'))}
            />
          </div>
        </div>
      } onBack={null} />

      {tab === 'antecipacao' && (
        <div style={{ padding: 24 }}>
          <SubMonitorAvancado embedded />
        </div>
      )}

      {tab !== 'antecipacao' && (
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPIs — grid explícito por breakpoint via className.
              Evita o "4+1 feio" forçando 3+2 em telas médias. */}
          <div className="dashboard-kpi-grid">
            <KpiCard
              label="Cobranças criadas"
              value="R$ 1.240.500,00"
              subLabel="Total do período"
              trend="+14% vs. mês anterior"
              trendUp
              loading={loading}
              tooltip="Soma de todas as cobranças criadas pelos merchants no período."
            />
            <KpiCard
              label="Cobranças autorizadas"
              value="R$ 1.180.200,00"
              subLabel="Taxa de aprovação 95,2%"
              trend="+9% vs. mês anterior"
              trendUp
              loading={loading}
              tooltip="Cobranças que foram efetivamente autorizadas pelo emissor."
            />
            <KpiCard
              label="Quantidade"
              value="38.140"
              subLabel="Transações"
              trend="+7% vs. mês anterior"
              trendUp
              loading={loading}
              tooltip="Número total de transações processadas."
            />
            <KpiCard
              label="Merchants ativos"
              value="7"
              subLabel="de 8 cadastrados"
              loading={loading}
              tooltip="Merchants com pelo menos uma transação no período."
            />
            <KpiCard
              label="MDR médio"
              value="2,34%"
              subLabel="Blended rate"
              loading={loading}
              tooltip="Taxa média ponderada (MDR) cobrada dos merchants no período."
            />
          </div>

          {/* Donut + Linhas */}
          <div style={{ display:'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
            <CardSection title="Distribuição de transações por bandeira" icon="filter">
              <DonutBreakdown
                data={donutData.map((d) => ({ label: d.label, value: d.value, color: BRAND_COLORS[d.label] }))}
              />
            </CardSection>

            <CardSection title="Quantidade e valor por bandeira" subtitle="Últimos 6 meses" icon="trendingUp">
              <MultiLineKPI
                data={multilineData}
                xKey="mes"
                series={[
                  { key: 'visa',       label: 'Visa',       color: BRAND_COLORS.Visa },
                  { key: 'mastercard', label: 'Mastercard', color: BRAND_COLORS.Mastercard },
                  { key: 'elo',        label: 'Elo',        color: BRAND_COLORS.Elo },
                ]}
              />
            </CardSection>
          </div>

          {/* Merchant ranking */}
          <CardSection
            title="Planificação — Top merchants por volume de transações"
            icon="barChart"
            subtitle="Ordem decrescente de transações no período"
          >
            <BarList
              data={ranked.map((m) => ({
                label: m.name,
                value: m.txns,
                sublabel: `· ${m.volume}`,
              }))}
              formatValue={(v) => v.toLocaleString('pt-BR')}
            />
          </CardSection>
        </div>
      )}
    </div>
  )
}
