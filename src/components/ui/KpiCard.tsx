'use client'

import Tooltip from '@/components/atoms/Tooltip'
import Icon from '@/components/atoms/Icon'

export type KpiVariant = 'info' | 'orange' | 'error' | 'success' | 'warning' | 'neutral'

const variantStyles: Record<KpiVariant, { bg: string; border: string; valueColor: string }> = {
  info:    { bg: '#fff', border: '#f0f0f0', valueColor: '#1890FF' },
  orange:  { bg: '#fff', border: '#f0f0f0', valueColor: '#FA8C16' },
  error:   { bg: '#fff', border: '#f0f0f0', valueColor: '#FF4D4F' },
  success: { bg: '#fff', border: '#f0f0f0', valueColor: '#237804' },
  warning: { bg: '#fff', border: '#f0f0f0', valueColor: '#D48806' },
  neutral: { bg: '#fff', border: '#f0f0f0', valueColor: 'rgba(0,0,0,0.85)' },
}

interface KpiCardProps {
  label: string
  value: string
  subLabel?: string
  variant?: KpiVariant
  tooltip?: string
  loading?: boolean
  style?: React.CSSProperties
}

export default function KpiCard({
  label,
  value,
  subLabel,
  variant = 'neutral',
  tooltip,
  loading = false,
  style,
}: KpiCardProps) {
  const s = variantStyles[variant]

  return (
    <>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 2,
        padding: '14px 18px',
        minWidth: 160,
        fontFamily: 'Roboto, sans-serif',
        ...style,
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: '20px',
            color: 'rgba(0,0,0,0.45)',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {label}
        </span>
        {tooltip && (
          <Tooltip text={tooltip} delay={1000} bare>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <Icon name="info" size={13} color="rgba(0,0,0,0.45)" />
            </span>
          </Tooltip>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div
          style={{
            height: 28,
            width: '60%',
            background: 'rgba(0,0,0,0.06)',
            borderRadius: 2,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: '32px',
            color: s.valueColor,
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {value}
        </div>
      )}

      {/* Sub-label */}
      {subLabel && !loading && (
        <div
          style={{
            marginTop: 2,
            fontSize: 12,
            lineHeight: '20px',
            color: 'rgba(0,0,0,0.45)',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {subLabel}
        </div>
      )}
    </div>
    </>
  )
}
