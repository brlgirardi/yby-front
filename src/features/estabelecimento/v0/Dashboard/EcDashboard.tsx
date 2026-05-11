'use client'
// Dashboard do Estabelecimento Comercial — V0.
// Migrado para CardSection shared + wrappers Recharts (LineKPI, BarList).
// Theme-aware: cor primária reage ao tema (Tupi/Vero).

import KpiCard from '@/components/ui/KpiCard'
import PageHeader from '@/components/shared/PageHeader'
import CardSection from '@/components/shared/CardSection'
import EmptyState from '@/components/shared/EmptyState'
import BrandLogo from '@/components/atoms/BrandLogo'
import { LineKPI, BarList } from '@/components/charts'
import {
  ecDashboardKpis,
  ecDashboardTpv,
  ecDashboardStatus,
  ecDashboardPaymentMethods,
  ecDashboardBrands,
  ecDashboardConversion,
  ecDashboardInstallments,
  type StatusBreakdown,
} from '@/mocks/ec/dashboard'

const statusVariantMap: Record<StatusBreakdown['status'], 'success' | 'warning' | 'neutral' | 'error' | 'info'> = {
  'Pago':           'success',
  'Pendente':       'warning',
  'Cancelado':      'neutral',
  'Não autorizado': 'error',
  'Outros':         'info',
}

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
const fmtBRLshort = (v: number) =>
  Math.abs(v) >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M`
  : Math.abs(v) >= 1_000   ? `R$ ${(v / 1_000).toFixed(0)}k`
  : `R$ ${v.toLocaleString('pt-BR')}`

const BRAND_COLORS: Record<string, string> = {
  Visa:       '#1A1F71',
  Mastercard: '#EB001B',
  Elo:        '#FFC72C',
  Hipercard:  '#B3131B',
  Amex:       '#0690FF',
}

export default function EcDashboard() {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Dashboard" breadcrumb="Estabelecimento Comercial / Dashboard" onBack={null} />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPIs principais */}
        <div style={{ display: 'flex', gap: 24 }}>
          {ecDashboardKpis.map((k) => (
            <div key={k.label} style={{ flex: 1, minWidth: 0 }}>
              <KpiCard label={k.label} value={k.value} subLabel={k.subLabel} variant="info" />
            </div>
          ))}
        </div>

        {/* TPV */}
        <CardSection title="Gráfico de cobranças" subtitle="Volume total transacionado (TPV)" icon="trendingUp">
          <LineKPI
            data={ecDashboardTpv.map((p) => ({ label: p.date, value: p.value }))}
            formatValue={fmtBRLshort}
            height={220}
          />
        </CardSection>

        {/* Status */}
        <div style={{ display: 'flex', gap: 24 }}>
          {ecDashboardStatus.map((s) => (
            <div key={s.status} style={{ flex: 1, minWidth: 0 }}>
              <KpiCard
                label={s.status}
                value={fmtBRL(s.value)}
                subLabel={`${s.count} cobranças (${s.percent}%)`}
                variant={statusVariantMap[s.status]}
              />
            </div>
          ))}
        </div>

        {/* Formas + Bandeiras */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <CardSection title="Formas de pagamento mais utilizadas" icon="creditCard">
            <BarList
              data={ecDashboardPaymentMethods.map((m) => ({ label: m.method, value: m.percent }))}
              asPercent
            />
          </CardSection>

          <CardSection title="Bandeiras mais utilizadas" icon="filter">
            <BarList
              data={ecDashboardBrands.map((b) => ({
                label: b.brand,
                value: b.percent,
                color: BRAND_COLORS[b.brand],
              }))}
              asPercent
            />
            {/* Logos das bandeiras como referência visual */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
              {ecDashboardBrands.map((b) => (
                <BrandLogo key={b.brand} brand={b.brand} size={20} showLabel />
              ))}
            </div>
          </CardSection>
        </div>

        {/* Recusas + Conversão + Parcelas */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 24 }}>
          <CardSection title="Motivos de recusa por adquirente" icon="alertTriangle">
            <EmptyState title="Sem dados" description="Não encontramos dados para o período selecionado." paddingY={32} />
          </CardSection>

          <CardSection title="Índices de conversão" icon="checkCircle">
            <BarList
              data={ecDashboardConversion.map((c) => ({ label: c.channel, value: c.percent, color: '#52C41A' }))}
              asPercent
            />
          </CardSection>

          <CardSection title="Parcelas em cobranças de cartão" icon="barChart">
            <BarList
              data={ecDashboardInstallments.map((i) => ({ label: i.label, value: i.count }))}
              formatValue={(v) => v.toLocaleString('pt-BR')}
            />
          </CardSection>
        </div>
      </div>
    </div>
  )
}
