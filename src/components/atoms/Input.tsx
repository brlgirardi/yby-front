'use client'

import React, { useState } from 'react'
import Icon from './Icon'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  hint?: string
  prefix?: string   // icon name for left side
  suffix?: string   // icon name for right side
  onSuffixClick?: () => void
}

export default function Input({
  label,
  error,
  hint,
  prefix,
  suffix,
  onSuffixClick,
  disabled,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false)

  const borderColor = error
    ? '#FF4D4F'
    : focused
    ? '#1890FF'
    : '#D9D9D9'

  const boxShadow = error
    ? focused ? '0 0 0 2px rgba(255,77,79,0.2)' : 'none'
    : focused
    ? '0 0 0 2px rgba(24,144,255,0.2)'
    : 'none'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'Roboto, sans-serif', ...style }}>
      {label && (
        <label
          style={{
            fontSize: 14,
            lineHeight: '22px',
            color: 'rgba(0,0,0,0.85)',
            fontWeight: 400,
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: disabled ? '#F5F5F5' : '#fff',
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow,
        }}
      >
        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: 10,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'rgba(0,0,0,0.35)',
            }}
          >
            <Icon name={prefix} size={14} />
          </span>
        )}

        <input
          disabled={disabled}
          style={{
            flex: 1,
            height: 32,
            padding: `0 ${suffix ? 36 : 12}px 0 ${prefix ? 34 : 12}px`,
            fontSize: 14,
            lineHeight: '22px',
            color: disabled ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.85)',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: 'Roboto, sans-serif',
            cursor: disabled ? 'not-allowed' : 'text',
            width: '100%',
          }}
          onFocus={(e) => { setFocused(true); onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); onBlur?.(e) }}
          {...rest}
        />

        {suffix && (
          <span
            onClick={onSuffixClick}
            style={{
              position: 'absolute',
              right: 10,
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(0,0,0,0.35)',
              cursor: onSuffixClick ? 'pointer' : 'default',
            }}
          >
            <Icon name={suffix} size={14} />
          </span>
        )}
      </div>

      {error && (
        <span style={{ fontSize: 12, lineHeight: '20px', color: '#FF4D4F' }}>{error}</span>
      )}
      {!error && hint && (
        <span style={{ fontSize: 12, lineHeight: '20px', color: 'rgba(0,0,0,0.45)' }}>{hint}</span>
      )}
    </div>
  )
}
