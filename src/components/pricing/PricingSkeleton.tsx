'use client'

/**
 * Skeleton estruturado para o módulo Pricing — espelha a hierarquia
 * Channel → Acquirer → Brand para que o usuário veja a "forma" da página
 * imediatamente, reduzindo carga cognitiva (Nielsen #1: visibilidade do
 * status do sistema).
 *
 * Renderiza 2 channels, cada um com 1 acquirer e 3 brands shimmer.
 */
export default function PricingSkeleton({ variant = 'costs' }: { variant?: 'costs' | 'prices' }) {
  return (
    <div aria-busy="true" aria-label={`Carregando ${variant === 'costs' ? 'custos' : 'preços'}`}>
      <ChannelSkeleton brandsCount={3} />
      <ChannelSkeleton brandsCount={2} />
    </div>
  )
}

function ChannelSkeleton({ brandsCount }: { brandsCount: number }) {
  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 0, marginBottom: 16, background: '#fff', overflow: 'hidden' }}>
      {/* header com ícone + título + descrição */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 20px' }}>
        <Block w={40} h={40} radius={0} />
        <div style={{ flex: 1 }}>
          <Block w={220} h={14} style={{ marginBottom: 8 }} />
          <Block w={'60%'} h={12} style={{ marginBottom: 6 }} />
          <Block w={140} h={11} />
        </div>
      </div>

      {/* AcquirerSection: header com logo + brands */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ border: '1px solid #f0f0f0', background: '#fff', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Block w={32} h={20} radius={2} />
              <Block w={80} h={14} />
            </div>
            <Block w={120} h={11} />
          </div>

          {/* BrandSections shimmer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
            {Array.from({ length: brandsCount }).map((_, i) => (
              <div key={i} style={{ border: '1px solid #f0f0f0', background: '#fff', marginBottom: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Block w={28} h={18} radius={2} />
                  <Block w={70} h={12} />
                </div>
                <Block w={140} h={20} radius={2} />
              </div>
            ))}
          </div>
        </div>
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

// global keyframe — injetado uma única vez
if (typeof window !== 'undefined' && !document.getElementById('pixel-shimmer-keyframes')) {
  const style = document.createElement('style')
  style.id = 'pixel-shimmer-keyframes'
  style.textContent = `@keyframes pixel-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`
  document.head.appendChild(style)
}
