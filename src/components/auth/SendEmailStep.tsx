'use client'

import { useState } from 'react'
import Icon from '@/components/shared/Icon'

export interface SendEmailStepProps {
  initialEmail?: string
  loading?: boolean
  error?: string | null
  onSubmit: (email: string) => void
  onCancel?: () => void
}

/**
 * Etapa 1 do fluxo "esqueci minha senha" (Tupi: send-code).
 * Coleta e-mail e dispara envio de código.
 */
export default function SendEmailStep({ initialEmail = '', loading, error, onSubmit, onCancel }: SendEmailStepProps) {
  const [email, setEmail] = useState(initialEmail)

  const submit = () => {
    if (loading) return
    onSubmit(email.trim())
  }

  return (
    <div style={{ width: 420, background: '#fff', borderRadius: 2, padding: 36, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>Recuperar senha</h2>
      <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', marginBottom: 24 }}>
        Etapa 1 de 3 — informe seu e-mail e enviaremos um código de verificação.
      </p>

      {error && (
        <div role="alert" style={errorBox}>
          <Icon name="info" size={14} /><span>{error}</span>
        </div>
      )}

      <label style={lbl}>E-mail <span style={{ color: '#ff4d4f' }}>*</span></label>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="seu@email.com"
        autoComplete="email"
        autoFocus
        disabled={loading}
        onKeyDown={e => e.key === 'Enter' && submit()}
        style={inp}
        onFocus={e => (e.target as HTMLInputElement).style.border = '1px solid #1890FF'}
        onBlur={e => (e.target as HTMLInputElement).style.border = '1px solid #d9d9d9'}
      />

      <button onClick={submit} disabled={loading} style={btnPrimary(loading)}>
        {loading ? 'Enviando…' : 'Enviar código'}
      </button>

      {onCancel && (
        <button onClick={onCancel} disabled={loading} style={btnGhost}>
          Voltar para o login
        </button>
      )}
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }
const inp: React.CSSProperties = { width: '100%', border: '1px solid #d9d9d9', borderRadius: 2, padding: '7px 12px', fontSize: 14, outline: 'none', fontFamily: 'Roboto', marginBottom: 16 }
const errorBox: React.CSSProperties = { marginBottom: 16, padding: '8px 12px', background: '#FFF1F0', border: '1px solid #FFCCC7', borderRadius: 2, color: '#820014', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }
const btnPrimary = (loading: boolean | undefined): React.CSSProperties => ({ width: '100%', background: loading ? '#69b1ff' : '#1890FF', color: '#fff', border: 'none', borderRadius: 2, padding: '8px 0', fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, fontFamily: 'Roboto' })
const btnGhost: React.CSSProperties = { width: '100%', background: 'none', color: 'rgba(0,0,0,0.65)', border: '1px solid #d9d9d9', borderRadius: 2, padding: '7px 0', fontSize: 13, cursor: 'pointer', marginTop: 8, fontFamily: 'Roboto' }
