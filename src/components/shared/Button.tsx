'use client'

import React, { useState } from 'react'
import Icon from './Icon'
import { useTheme } from '@/stores/themeStore'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  children?: React.ReactNode
}

const SIZE_MAP: Record<ButtonSize, { height: number; fontSize: number; padding: string; iconSize: number }> = {
  sm: { height: 24, fontSize: 12, padding: '0 8px',  iconSize: 12 },
  md: { height: 32, fontSize: 14, padding: '0 15px', iconSize: 14 },
  lg: { height: 40, fontSize: 16, padding: '0 20px', iconSize: 16 },
}

const VARIANT_BASE: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: '#1890FF', color: '#fff',              border: '1px solid #1890FF' },
  secondary: { background: '#fff',    color: 'rgba(0,0,0,0.85)', border: '1px solid #D9D9D9' },
  ghost:     { background: 'transparent', color: '#1890FF',      border: '1px solid transparent' },
  danger:    { background: '#FF4D4F', color: '#fff',              border: '1px solid #FF4D4F' },
}

const VARIANT_HOVER: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: '#40A9FF', border: '1px solid #40A9FF' },
  secondary: { background: '#fff',    color: '#1890FF', border: '1px solid #1890FF' },
  ghost:     { background: 'rgba(24,144,255,0.06)', border: '1px solid transparent' },
  danger:    { background: '#FF7875', border: '1px solid #FF7875' },
}

const VARIANT_DISABLED: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: '#F5F5F5', color: 'rgba(0,0,0,0.25)', border: '1px solid #D9D9D9' },
  secondary: { background: '#F5F5F5', color: 'rgba(0,0,0,0.25)', border: '1px solid #D9D9D9' },
  ghost:     { background: 'transparent', color: 'rgba(0,0,0,0.25)', border: '1px solid transparent' },
  danger:    { background: '#F5F5F5', color: 'rgba(0,0,0,0.25)', border: '1px solid #D9D9D9' },
}

// Simple spinner SVG inline
function Spinner({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false)
  const sz = SIZE_MAP[size]
  const isDisabled = disabled || loading
  const theme = useTheme()

  // Override de tokens só onde a marca importa — primary background/border, ghost text
  const themedBase: React.CSSProperties = {
    primary:   { background: theme.primary, color: '#fff', border: `1px solid ${theme.primary}` },
    secondary: VARIANT_BASE.secondary,
    ghost:     { background: 'transparent', color: theme.primary, border: '1px solid transparent' },
    danger:    VARIANT_BASE.danger,
  }[variant]

  const themedHover: React.CSSProperties = {
    primary:   { background: theme.primaryDark, border: `1px solid ${theme.primaryDark}` },
    secondary: { background: '#fff', color: theme.primary, border: `1px solid ${theme.primary}` },
    ghost:     { background: theme.primaryBg, border: '1px solid transparent' },
    danger:    VARIANT_HOVER.danger,
  }[variant]

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: sz.height,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontWeight: 400,
    lineHeight: 1,
    fontFamily: 'Roboto, sans-serif',
    borderRadius: 2,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s',
    outline: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...(isDisabled ? VARIANT_DISABLED[variant] : hovered ? { ...themedBase, ...themedHover } : themedBase),
    ...style,
  }

  return (
    <>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <button
        disabled={isDisabled}
        style={baseStyle}
        onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e) }}
        onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e) }}
        {...rest}
      >
        {loading && iconPosition === 'left' && <Spinner size={sz.iconSize} />}
        {!loading && icon && iconPosition === 'left' && <Icon name={icon} size={sz.iconSize} />}
        {children}
        {!loading && icon && iconPosition === 'right' && <Icon name={icon} size={sz.iconSize} />}
        {loading && iconPosition === 'right' && <Spinner size={sz.iconSize} />}
      </button>
    </>
  )
}
