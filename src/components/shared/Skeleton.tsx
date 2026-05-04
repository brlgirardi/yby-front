'use client'

/**
 * Skeleton primitivos reutilizáveis (shimmer + bloco).
 *
 * Use estes blocos para construir skeletons estruturados de páginas e
 * componentes complexos (PricingSkeleton, ConciliationSkeleton, etc).
 *
 * Heurística Nielsen #1 (visibilidade do status): mostrar a "forma" do
 * conteúdo antes do dado chegar reduz ansiedade em conexões lentas.
 *
 * a11y: blocos shimmer são `aria-hidden` (decorativos). Os wrappers que
 * usam Skeleton devem aplicar `aria-busy="true"` + `aria-label` próprios.
 */

const SHIMMER_KEYFRAMES_ID = 'pixel-shimmer-keyframes'

if (typeof window !== 'undefined' && !document.getElementById(SHIMMER_KEYFRAMES_ID)) {
  const style = document.createElement('style')
  style.id = SHIMMER_KEYFRAMES_ID
  style.textContent = `@keyframes pixel-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`
  document.head.appendChild(style)
}

export interface SkeletonBlockProps {
  /** Largura — px ou string (ex: '60%', '100%'). Default '100%'. */
  w?: number | string
  /** Altura em px. Default 12. */
  h?: number
  /** Border radius. Default 2. */
  radius?: number
  /** Estilo extra (margem, flex, etc). */
  style?: React.CSSProperties
}

/**
 * Bloco shimmer animado. Use para construir skeletons estruturados.
 *
 * @example
 * <SkeletonBlock w={120} h={14} />
 * <SkeletonBlock w="60%" h={11} style={{ marginBottom: 8 }} />
 */
export default function SkeletonBlock({ w = '100%', h = 12, radius = 2, style }: SkeletonBlockProps) {
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

export interface SkeletonLineProps {
  /** Largura. Default '100%'. */
  w?: number | string
  /** Altura. Default 12. */
  h?: number
  /** Espaço abaixo. Default 0. */
  gap?: number
}

/** Versão block-level (line break). */
export function SkeletonLine({ w = '100%', h = 12, gap = 0 }: SkeletonLineProps) {
  return (
    <div style={{ marginBottom: gap }}>
      <SkeletonBlock w={w} h={h} />
    </div>
  )
}

export interface SkeletonCardProps {
  /** Padding interno. Default 16. */
  padding?: number
  /** Background. Default '#fff'. */
  background?: string
  /** Border. Default '1px solid #f0f0f0'. */
  border?: string
  /** Children custom (composição livre de SkeletonBlocks). */
  children?: React.ReactNode
}

/** Container de skeleton (para envolver SkeletonBlocks com card style). */
export function SkeletonCard({
  padding = 16,
  background = '#fff',
  border = '1px solid #f0f0f0',
  children,
}: SkeletonCardProps) {
  return (
    <div
      style={{
        padding,
        background,
        border,
        borderRadius: 2,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}
