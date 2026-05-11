'use client'
// Dashboard Sub-adquirente — refatorado para usar CardSection + wrappers Recharts.
// 3 abas: Geral / Planificação / Antecipação. Theme-aware (Tupi/Vero).

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import CardSection from '@/components/shared/CardSection'
import Icon from '@/components/atoms/Icon'
import BrandLogo from '@/components/atoms/BrandLogo'
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

interface KpiCardProps { label: string; value: string; prefix?: string; sub?: string; trend?: string; trendUp?: boolean }
const KpiCard = ({ label, value, prefix = 'R$', sub, trend, trendUp }: KpiCardProps) => (
  <div style={{ background:'#fff', borderRadius:2, border:'1px solid rgba(0,0,0,0.06)', padding:'20px 24px 16px', flex:1, minWidth:0 }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
      <span style={{ fontSize:13, color:'rgba(0,0,0,0.45)' }}>{label}</span>
      <Icon name="info" size={14} color="rgba(0,0,0,0.2)" />
    </div>
    <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
      {prefix && <span style={{ fontSize:16, color:'rgba(0,0,0,0.85)' }}>{prefix}</span>}
      <span style={{ fontSize:30, fontWeight:500, color:'rgba(0,0,0,0.85)', lineHeight:1 }}>{value}</span>
    </div>
    {sub && <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)' }}>{sub}</div>}
    {trend && (
      <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
        <Icon name="trendingUp" size={12} color={trendUp ? '#52c41a' : '#ff4d4f'} />
        <span style={{ fontSize:12, color: trendUp ? '#52c41a' : '#ff4d4f' }}>{trend}</span>
      </div>
    )}
  </div>
)

const BRAND_COLORS: Record<string, string> = {
  Visa:       '#1A1F71',
  Mastercard: '#EB001B',
  Elo:        '#52C41A',
  Outros:     '#D9D9D9',
}

export default function DashboardPage() {
  const [tab, setTab] = useState<'geral' | 'planificação' | 'antecipação'>('geral')
  const theme = useTheme()
  const TABS: Array<typeof tab> = ['geral', 'planificação', 'antecipação']

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

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader title="Dashboard" breadcrumb="Sub-adquirente / Dashboard" extra={
        <div style={{ display:'flex', gap:8 }}>
          {TABS.map((t) => {
            const active = tab === t
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  border: active ? `1px solid ${theme.primary}` : '1px solid #d9d9d9',
                  background: active ? theme.primaryBg : '#fff',
                  color: active ? theme.primary : 'rgba(0,0,0,0.65)',
                  borderRadius: 2, padding: '6px 16px', fontSize: 14, cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t}
              </button>
            )
          })}
          <button style={{ border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'6px 14px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:'rgba(0,0,0,0.65)' }}>Todos os MCCs <Icon name="chevronDown" size={12} color="rgba(0,0,0,0.45)" /></button>
          <button style={{ border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'6px 14px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:'rgba(0,0,0,0.65)' }}><Icon name="calendar" size={14} color="rgba(0,0,0,0.45)" /> Abril 2026 <Icon name="chevronDown" size={12} color="rgba(0,0,0,0.45)" /></button>
        </div>
      } onBack={null} />

      {tab === 'antecipação' && (
        <div style={{ padding: 24 }}>
          <SubMonitorAvancado embedded />
        </div>
      )}

      {tab !== 'antecipação' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:24 }}>
          {/* KPIs */}
          <div style={{ display:'flex', gap:24 }}>
            <KpiCard label="Cobranças criadas"      value="1.240.500,00" sub="Total do período"     trend="+14% vs. mês anterior" trendUp />
            <KpiCard label="Cobranças autorizadas"  value="1.180.200,00" sub="Taxa de aprovação 95,2%" trend="+9%"  trendUp />
            <KpiCard label="Quantidade"             prefix="" value="38.140" sub="Transações"          trend="+7%"  trendUp />
            <KpiCard label="Merchants ativos"       prefix="" value="7"      sub="de 8 cadastrados" />
            <KpiCard label="MDR médio"              prefix="" value="2,34%"  sub="Blended rate" />
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
