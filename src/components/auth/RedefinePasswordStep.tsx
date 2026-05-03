'use client'

import { useState } from 'react'
import Icon from '@/components/shared/Icon'

const CheckMark = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const Circle = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
  </svg>
)

export interface RedefinePasswordStepProps {
  loading?: boolean
  error?: string | null
  /** Quando true, mostra também o campo "senha atual" (fluxo de senha temporária). */
  requireCurrentPassword?: boolean
  /** Título customizável (default: "Definir nova senha"). */
  title?: string
  /** Subtítulo customizável. */
  subtitle?: string
  onSubmit: (data: { currentPassword?: string; newPassword: string }) => void
  onBack?: () => void
}

/**
 * Etapa 3 do fluxo "esqueci minha senha" (Tupi: update-password).
 * Também é usada no fluxo de "redefine temporary password" (primeiro acesso),
 * com `requireCurrentPassword=true`.
 */
export default function RedefinePasswordStep({
  loading, error, requireCurrentPassword = false,
  title = 'Definir nova senha',
  subtitle = 'Etapa 3 de 3 — escolha uma senha forte com pelo menos 8 caracteres.',
  onSubmit, onBack,
}: RedefinePasswordStepProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)

  const requirements = [
    { label: '8+ caracteres', met: newPassword.length >= 8 },
    { label: '1 letra maiúscula', met: /[A-Z]/.test(newPassword) },
    { label: '1 número', met: /\d/.test(newPassword) },
    { label: 'Confere com a confirmação', met: !!newPassword && newPassword === confirmPassword },
  ]
  const allMet = requirements.every(r => r.met)
  const canSubmit = !loading && allMet && (!requireCurrentPassword || currentPassword.length > 0)

  const submit = () => {
    if (!canSubmit) return
    onSubmit({ currentPassword: requireCurrentPassword ? currentPassword : undefined, newPassword })
  }

  return (
    <div style={{ width: 420, background: '#fff', borderRadius: 2, padding: 36, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', marginBottom: 24 }}>{subtitle}</p>

      {error && (
        <div role="alert" style={errorBox}>
          <Icon name="info" size={14} /><span>{error}</span>
        </div>
      )}

      {requireCurrentPassword && (
        <>
          <label style={lbl}>Senha atual (temporária) <span style={{ color: '#ff4d4f' }}>*</span></label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            style={inp}
          />
        </>
      )}

      <label style={lbl}>Nova senha <span style={{ color: '#ff4d4f' }}>*</span></label>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <input
          type={showNew ? 'text' : 'password'}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          disabled={loading}
          autoComplete="new-password"
          autoFocus
          style={{ ...inp, paddingRight: 36, marginBottom: 0 }}
        />
        <button type="button" onClick={() => setShowNew(s => !s)} aria-label={showNew ? 'Ocultar senha' : 'Mostrar senha'}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.35)' }}>
          <Icon name={showNew ? 'eyeOff' : 'eye'} size={16} />
        </button>
      </div>

      <label style={lbl}>Confirmar nova senha <span style={{ color: '#ff4d4f' }}>*</span></label>
      <input
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        disabled={loading}
        autoComplete="new-password"
        onKeyDown={e => e.key === 'Enter' && submit()}
        style={inp}
      />

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
        {requirements.map(r => (
          <li key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: r.met ? '#52C41A' : 'rgba(0,0,0,0.45)', marginBottom: 4 }}>
            {r.met ? <CheckMark /> : <Circle />}
            {r.label}
          </li>
        ))}
      </ul>

      <button onClick={submit} disabled={!canSubmit} style={btnPrimary(!canSubmit)}>
        {loading ? 'Redefinindo…' : 'Redefinir senha'}
      </button>

      {onBack && (
        <button onClick={onBack} disabled={loading} style={btnGhost}>← Voltar</button>
      )}
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }
const inp: React.CSSProperties = { width: '100%', border: '1px solid #d9d9d9', borderRadius: 2, padding: '7px 12px', fontSize: 14, outline: 'none', fontFamily: 'Roboto', marginBottom: 16 }
const errorBox: React.CSSProperties = { marginBottom: 16, padding: '8px 12px', background: '#FFF1F0', border: '1px solid #FFCCC7', borderRadius: 2, color: '#820014', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }
const btnPrimary = (disabled: boolean | undefined): React.CSSProperties => ({ width: '100%', background: disabled ? '#69b1ff' : '#1890FF', color: '#fff', border: 'none', borderRadius: 2, padding: '8px 0', fontSize: 14, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8, fontFamily: 'Roboto' })
const btnGhost: React.CSSProperties = { width: '100%', background: 'none', color: 'rgba(0,0,0,0.65)', border: '1px solid #d9d9d9', borderRadius: 2, padding: '7px 0', fontSize: 13, cursor: 'pointer', marginTop: 8, fontFamily: 'Roboto' }
