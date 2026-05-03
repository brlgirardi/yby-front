'use client'

import { useState } from 'react'
import Icon from '@/components/shared/Icon'

export interface VerifyCodeStepProps {
  email: string
  loading?: boolean
  error?: string | null
  /** Callback ao submeter código de 6 dígitos. */
  onSubmit: (code: string) => void
  /** Callback ao reenviar código (volta para SendEmail no fluxo). */
  onResend?: () => void
  onBack?: () => void
}

/**
 * Etapa 2 do fluxo "esqueci minha senha" (Tupi: verify-code).
 * Coleta código de 6 dígitos enviado por e-mail.
 */
export default function VerifyCodeStep({ email, loading, error, onSubmit, onResend, onBack }: VerifyCodeStepProps) {
  const [code, setCode] = useState('')

  const submit = () => {
    if (loading) return
    onSubmit(code.trim())
  }

  return (
    <div style={{ width: 420, background: '#fff', borderRadius: 2, padding: 36, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>Confirmar código</h2>
      <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', marginBottom: 24 }}>
        Etapa 2 de 3 — digite o código de 6 dígitos enviado para <strong>{email}</strong>.
      </p>

      {error && (
        <div role="alert" style={errorBox}>
          <Icon name="info" size={14} /><span>{error}</span>
        </div>
      )}

      <label style={lbl}>Código <span style={{ color: '#ff4d4f' }}>*</span></label>
      <input
        value={code}
        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        disabled={loading}
        onKeyDown={e => e.key === 'Enter' && code.length === 6 && submit()}
        style={{ ...inp, textAlign: 'center', fontFamily: 'Roboto Mono', fontSize: 18, letterSpacing: 6 }}
        onFocus={e => (e.target as HTMLInputElement).style.border = '1px solid #1890FF'}
        onBlur={e => (e.target as HTMLInputElement).style.border = '1px solid #d9d9d9'}
      />

      <button onClick={submit} disabled={loading || code.length !== 6} style={btnPrimary(loading || code.length !== 6)}>
        {loading ? 'Verificando…' : 'Confirmar código'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 13 }}>
        {onBack && (
          <button onClick={onBack} disabled={loading} style={linkBtn}>← Voltar</button>
        )}
        {onResend && (
          <button onClick={onResend} disabled={loading} style={linkBtn}>Reenviar código</button>
        )}
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }
const inp: React.CSSProperties = { width: '100%', border: '1px solid #d9d9d9', borderRadius: 2, padding: '7px 12px', fontSize: 14, outline: 'none', fontFamily: 'Roboto', marginBottom: 16 }
const errorBox: React.CSSProperties = { marginBottom: 16, padding: '8px 12px', background: '#FFF1F0', border: '1px solid #FFCCC7', borderRadius: 2, color: '#820014', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }
const btnPrimary = (disabled: boolean | undefined): React.CSSProperties => ({ width: '100%', background: disabled ? '#69b1ff' : '#1890FF', color: '#fff', border: 'none', borderRadius: 2, padding: '8px 0', fontSize: 14, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8, fontFamily: 'Roboto' })
const linkBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#1890FF', cursor: 'pointer', fontFamily: 'Roboto', fontSize: 13, padding: 0 }
