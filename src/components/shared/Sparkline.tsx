type SparklineProps = {
  /** Array de valores (mín 2 pontos). Renderizados em ordem cronológica. */
  data: number[]
  /** Cor da linha. Default: #1890FF */
  color?: string
  /** Largura em px. Default: 80 */
  width?: number
  /** Altura em px. Default: 24 */
  height?: number
  /** Preenche área sob a linha com versão translúcida da cor. Default: true */
  filled?: boolean
}

/**
 * Gráfico de tendência inline minimalista para KPIs.
 * Renderiza apenas uma linha SVG (e opcional área preenchida).
 * Sem eixos, labels ou tooltips — pura indicação visual de movimento.
 */
export default function Sparkline({ data, color = '#1890FF', width = 80, height = 24, filled = true }: SparklineProps) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)
  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * height
    return [x, y] as const
  })
  const pathLine = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')
  const pathFill = `${pathLine} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {filled && <path d={pathFill} fill={color} fillOpacity={0.12} />}
      <path d={pathLine} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
