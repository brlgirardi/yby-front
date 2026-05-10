'use client'
// ScoreGauge — número-rei do Resultado IA. SVG inline, sem libs.
// Pixel: "score é o número, tier é a promessa". Gauge circular animado.

export type Tier = 'Bronze' | 'Prata' | 'Ouro' | 'Platinum' | 'Black'

const TIER_COLORS: Record<Tier, string> = {
  Bronze:   '#CD7F32',
  Prata:    '#9CA3AF',
  Ouro:     '#FAAD14',
  Platinum: '#1890FF',
  Black:    '#262626',
}

interface ScoreGaugeProps {
  value: number  // 0–100
  tier: Tier
  size?: number
}

export default function ScoreGauge({ value, tier, size = 200 }: ScoreGaugeProps) {
  const radius = size * 0.4
  const circ = 2 * Math.PI * radius
  const safeValue = Math.max(0, Math.min(100, value))
  const offset = circ * (1 - safeValue / 100)
  const color = TIER_COLORS[tier]
  const cx = size / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx} cy={cx} r={radius}
        fill="none" stroke="#F0F0F0" strokeWidth={12}
      />
      <circle
        cx={cx} cy={cx} r={radius}
        fill="none" stroke={color} strokeWidth={12}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text
        x={cx} y={cx + size * 0.02}
        textAnchor="middle"
        fontSize={size * 0.26}
        fontWeight={700}
        fill="#262626"
        fontFamily="Roboto, sans-serif"
      >
        {Math.round(safeValue)}
      </text>
      <text
        x={cx} y={cx + size * 0.16}
        textAnchor="middle"
        fontSize={size * 0.06}
        fill="rgba(0,0,0,0.45)"
        fontFamily="Roboto, sans-serif"
      >
        / 100
      </text>
    </svg>
  )
}

export function tierFromScore(score: number): { tier: Tier; color: string; range: string } {
  if (score <= 30) return { tier: 'Bronze',   color: TIER_COLORS.Bronze,   range: '0–30'  }
  if (score <= 50) return { tier: 'Prata',    color: TIER_COLORS.Prata,    range: '31–50' }
  if (score <= 75) return { tier: 'Ouro',     color: TIER_COLORS.Ouro,     range: '51–75' }
  if (score <= 90) return { tier: 'Platinum', color: TIER_COLORS.Platinum, range: '76–90' }
  return { tier: 'Black', color: TIER_COLORS.Black, range: '91–100' }
}
