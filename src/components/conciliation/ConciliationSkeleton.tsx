'use client'

/**
 * Skeleton estruturado para o módulo de Conciliação. Replica:
 *  - DateScroller (7 cards horizontais)
 *  - 4 KPIs no topo do Overview
 *  - 3 a 5 AcquirerSummaryCards
 *
 * Variante `detail` mostra: header voltar/badge, BrandSummaryCard e seções
 * Divergentes/Conciliados com IRDs shimmer.
 *
 * Heurística Nielsen #1 (visibilidade do status do sistema).
 */
export interface ConciliationSkeletonProps {
  variant?: 'overview' | 'detail'
}

export default function ConciliationSkeleton({ variant = 'overview' }: ConciliationSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label={`Carregando ${variant === 'overview' ? 'visão geral da conciliação' : 'detalhe da bandeira'}`}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px' }}
    >
      {variant === 'overview' ? <OverviewSkeleton /> : <DetailSkeleton />}
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <>
      {/* DateScroller + botão CSV */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, maxWidth: 760, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Block w={32} h={32} radius={2} />
          <div style={{ display: 'flex', gap: 8, flex: 1 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Block key={i} w={'100%'} h={56} radius={2} style={{ flex: 1 }} />
            ))}
          </div>
          <Block w={32} h={32} radius={2} />
        </div>
        <Block w={130} h={32} radius={2} />
      </div>

      {/* 4 KPIs */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      {/* Filtros */}
      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '10px 14px', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <Block w={300} h={28} radius={2} />
        <Block w={140} h={28} radius={2} />
        <Block w={140} h={28} radius={2} />
        <span style={{ marginLeft: 'auto' }}>
          <Block w={80} h={12} radius={2} />
        </span>
      </div>

      {/* Lista de AcquirerSummaryCards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <AcquirerCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}

function DetailSkeleton() {
  return (
    <>
      {/* Header com voltar + identificação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Block w={20} h={20} radius={2} />
        <Block w={120} h={18} radius={2} />
        <Block w={6} h={6} radius={6} />
        <Block w={140} h={11} radius={2} />
        <span style={{ marginLeft: 'auto' }}>
          <Block w={130} h={28} radius={2} />
        </span>
      </div>

      {/* DateScroller */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Block w={32} h={32} radius={2} />
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Block key={i} w={'100%'} h={56} radius={2} style={{ flex: 1, maxWidth: 130 }} />
          ))}
        </div>
        <Block w={32} h={32} radius={2} />
      </div>

      {/* BrandSummaryCard */}
      <AcquirerCardSkeleton />

      {/* Filtros */}
      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '10px 14px', display: 'flex', gap: 14, alignItems: 'center' }}>
        <Block w={300} h={28} radius={2} />
        <Block w={170} h={24} radius={2} />
        <span style={{ marginLeft: 'auto' }}>
          <Block w={60} h={12} radius={2} />
        </span>
      </div>

      {/* Section divergentes */}
      <SectionSkeleton tone="warning" rows={2} />
      {/* Section conciliados */}
      <SectionSkeleton tone="success" rows={3} />
    </>
  )
}

function KpiSkeleton() {
  return (
    <div style={{ flex: 1, minWidth: 180, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '14px 18px' }}>
      <Block w={130} h={11} style={{ marginBottom: 8 }} />
      <Block w={110} h={24} style={{ marginBottom: 6 }} />
      <Block w={90} h={11} />
    </div>
  )
}

function AcquirerCardSkeleton() {
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* Logo */}
      <Block w={64} h={32} radius={2} />
      {/* Status badge */}
      <Block w={128} h={64} radius={2} />
      {/* Métricas (Transações / TPV / ITC) */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ flex: 1 }}>
          <Block w={70} h={11} style={{ marginBottom: 6 }} />
          <Block w={80} h={13} style={{ marginBottom: 4 }} />
          <Block w={80} h={13} />
        </div>
      ))}
      {/* chevron */}
      <Block w={10} h={10} radius={5} />
    </div>
  )
}

function SectionSkeleton({ tone, rows }: { tone: 'success' | 'warning'; rows: number }) {
  const bg = tone === 'success' ? '#F6FFED' : '#FFFBE6'
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Block w={120} h={13} />
          <Block w={70} h={11} />
        </div>
        <Block w={14} h={14} radius={2} />
      </div>
      <div style={{ borderTop: '1px solid #f0f0f0', padding: '14px 16px', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ background: bg, borderRadius: 2, padding: '14px 16px', display: 'grid', gridTemplateColumns: '280px 24px 1fr 1fr 24px', gap: 0, alignItems: 'stretch' }}>
            <div>
              <Block w={28} h={11} style={{ marginBottom: 6 }} />
              <Block w={40} h={22} style={{ marginBottom: 6 }} />
              <Block w={'90%'} h={11} />
            </div>
            <div />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 16 }}>
              <Block w={'70%'} h={12} />
              <Block w={'80%'} h={12} />
              <Block w={'60%'} h={12} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 16 }}>
              <Block w={'70%'} h={12} />
              <Block w={'80%'} h={12} />
              <Block w={'60%'} h={12} />
            </div>
            <Block w={12} h={12} radius={2} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Block({
  w, h, radius = 2, style,
}: { w: number | string; h: number; radius?: number; style?: React.CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: w,
        height: h,
        background: 'linear-gradient(90deg, #f0f0f0 0%, #f7f7f7 50%, #f0f0f0 100%)',
        backgroundSize: '200% 100%',
        animation: 'pixel-shimmer 1.4s ease-in-out infinite',
        borderRadius: radius,
        ...style,
      }}
    />
  )
}

if (typeof window !== 'undefined' && !document.getElementById('pixel-shimmer-keyframes')) {
  const style = document.createElement('style')
  style.id = 'pixel-shimmer-keyframes'
  style.textContent = `@keyframes pixel-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`
  document.head.appendChild(style)
}
