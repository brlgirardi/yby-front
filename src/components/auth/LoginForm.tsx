'use client'

import { useState } from 'react'
import Icon from '@/components/shared/Icon'

export type LoginFormProps = {
  /** Mensagem de erro vinda do parent (ex: ApiError.body.message). */
  error?: string | null
  /** True quando a request está em voo. */
  loading?: boolean
  /** Banner de modo demo (mostrado quando apiMode === 'mock'). */
  showDemoBadge?: boolean
  /** URL para "Esqueci minha senha". Default '/forgot-password'. */
  forgotHref?: string
  /** Callback quando usuário submete o form. */
  onSubmit: (data: { email: string; password: string }) => void
}

/**
 * Formulário de login — UI pura, sem dependência de router/store.
 * O parent (page) injeta o handler de submit e os estados de loading/error.
 */
export default function LoginForm({
  error,
  loading = false,
  showDemoBadge = false,
  forgotHref = '/forgot-password',
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const submit = () => {
    if (loading) return
    onSubmit({ email, password })
  }

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#F2F4F8', display:'flex', flexDirection:'column' }}>
      <div style={{ width:'100%', height:104, background:'#fff', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 60px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <img src="/logo-tupi.svg" alt="TUPI" style={{ height:28, display:'block' }} />
          <span style={{ fontSize:12, background:'rgba(114,46,209,0.1)', color:'#722ED1', border:'1px solid #b37feb', borderRadius:2, padding:'1px 8px', fontWeight:500 }}>Sub-adquirente</span>
        </div>
        {showDemoBadge && (
          <span style={{ fontSize:11, background:'#FFFBE6', color:'#874D00', border:'1px solid #FFE58F', borderRadius:2, padding:'2px 8px', fontWeight:500 }}>
            Modo demo — qualquer e-mail + senha (4+) entram
          </span>
        )}
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:420, background:'#fff', borderRadius:2, padding:36, boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize:24, fontWeight:600, color:'rgba(0,0,0,0.85)', marginBottom:4 }}>Entrar</h2>
          <p style={{ fontSize:14, color:'rgba(0,0,0,0.65)', marginBottom:24 }}>Acesse o painel Sub-adquirente</p>

          {error && (
            <div role="alert" style={{ marginBottom:16, padding:'8px 12px', background:'#FFF1F0', border:'1px solid #FFCCC7', borderRadius:2, color:'#820014', fontSize:13, display:'flex', alignItems:'flex-start', gap:8 }}>
              <Icon name="info" size={14} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', marginBottom:4 }}>E-mail <span style={{ color:'#ff4d4f' }}>*</span></label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email" disabled={loading}
              style={{ width:'100%', border:'1px solid #d9d9d9', borderRadius:2, padding:'7px 12px', fontSize:14, outline:'none', fontFamily:'Roboto' }}
              onFocus={e=>(e.target as HTMLInputElement).style.border='1px solid #1890FF'}
              onBlur={e=>(e.target as HTMLInputElement).style.border='1px solid #d9d9d9'}
              onKeyDown={e=>e.key==='Enter'&&submit()} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', marginBottom:4 }}>Senha <span style={{ color:'#ff4d4f' }}>*</span></label>
            <div style={{ position:'relative' }}>
              <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha" autoComplete="current-password" disabled={loading}
                style={{ width:'100%', border:'1px solid #d9d9d9', borderRadius:2, padding:'7px 36px 7px 12px', fontSize:14, outline:'none', fontFamily:'Roboto' }}
                onFocus={e=>(e.target as HTMLInputElement).style.border='1px solid #1890FF'}
                onBlur={e=>(e.target as HTMLInputElement).style.border='1px solid #d9d9d9'}
                onKeyDown={e=>e.key==='Enter'&&submit()} />
              <button type="button" onClick={()=>setShowPass(!showPass)} aria-label={showPass?'Ocultar senha':'Mostrar senha'} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(0,0,0,0.35)' }}>
                <Icon name={showPass?'eyeOff':'eye'} size={16} />
              </button>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
            <a href={forgotHref} style={{ fontSize:13, color:'#1890FF', textDecoration:'none' }}>Esqueci minha senha</a>
          </div>

          <button onClick={submit} disabled={loading}
            style={{ width:'100%', background:loading?'#69b1ff':'#1890FF', color:'#fff', border:'none', borderRadius:2, padding:'8px 0', fontSize:14, fontWeight:500, cursor:loading?'not-allowed':'pointer', marginTop:16, fontFamily:'Roboto' }}>
            {loading?'Entrando...':'Entrar'}
          </button>
        </div>
      </div>

      <div style={{ height:52, display:'flex', alignItems:'center', justifyContent:'center', gap:24, fontSize:13, color:'rgba(0,0,0,0.45)' }}>
        <span>© 2025 TUPI — Todos os direitos reservados</span>
        <a href="#" style={{ color:'rgba(0,0,0,0.45)', textDecoration:'none' }}>Política de Privacidade</a>
        <a href="#" style={{ color:'rgba(0,0,0,0.45)', textDecoration:'none' }}>Termos de Uso</a>
      </div>
    </div>
  )
}
