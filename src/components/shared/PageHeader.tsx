'use client'

import { useRouter } from 'next/navigation'
import Icon from './Icon'

interface Tab {
  key: string
  label: string
}

interface PageHeaderProps {
  title: string
  breadcrumb?: string
  extra?: React.ReactNode
  /**
   * Callback do botão Voltar.
   *  - `undefined` (default): usa `router.back()` automaticamente
   *  - função custom: navega para onde você quiser
   *  - `null`: oculta o botão (use em pages-raiz como Dashboard)
   */
  onBack?: (() => void) | null
  tabs?: Tab[]
  activeTab?: string
  onTabChange?: (key: string) => void
}

/**
 * Header padrão das pages do Yby Front.
 *
 * Botão Voltar aparece por default (Nielsen #3: controle do usuário).
 * Use `onBack={null}` para ocultar em pages-raiz onde voltar não faz sentido.
 */
export default function PageHeader({ title, breadcrumb, extra, onBack, tabs, activeTab, onTabChange }: PageHeaderProps) {
  const router = useRouter()
  const showBack = onBack !== null
  const handleBack = onBack ?? (() => router.back())

  return (
    <div style={{ width:'100%', background:'#fff', borderBottom:'1px solid #f0f0f0', flexShrink:0 }}>
      {breadcrumb && (
        <div style={{ padding:'12px 24px 0', fontSize:12, color:'rgba(0,0,0,0.45)' }}>{breadcrumb}</div>
      )}
      <div style={{ padding: tabs ? '8px 24px 0' : '8px 24px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {showBack && (
            <button onClick={handleBack} aria-label="Voltar" style={{ border:'none', background:'none', cursor:'pointer', color:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', padding:'4px 6px 4px 0', borderRadius:2, transition:'color 0.15s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.85)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.45)'}>
              <Icon name="arrowLeft" size={16} />
            </button>
          )}
          <h1 style={{ fontSize:20, fontWeight:600, color:'rgba(0,0,0,0.85)', lineHeight:'28px', margin:0 }}>{title}</h1>
        </div>
        {extra && <div style={{ display:'flex', gap:8, alignItems:'center' }}>{extra}</div>}
      </div>
      {tabs && (
        <div style={{ display:'flex', padding:'0 24px', gap:0 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => onTabChange?.(t.key)}
              style={{ border:'none', background:'none', padding:'10px 16px', fontSize:13, cursor:'pointer', color:activeTab===t.key?'#1890FF':'rgba(0,0,0,0.65)', borderBottom:activeTab===t.key?'2px solid #1890FF':'2px solid transparent', marginBottom:-1, fontWeight:activeTab===t.key?500:400, whiteSpace:'nowrap', transition:'color 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
