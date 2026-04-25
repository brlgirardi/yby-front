'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'

const schemes = [
  { key:'visa', label:'Visa', color:'#1A1F71', txtColor:'#fff', products:[
    { name:'Crédito à vista', mdr:'2,20%', antec:'1,99% a.m.', tarifa:'R$ 0,10' },
    { name:'Crédito 2–6x', mdr:'2,90%', antec:'1,99% a.m.', tarifa:'R$ 0,10' },
    { name:'Crédito 7–12x', mdr:'3,40%', antec:'1,99% a.m.', tarifa:'R$ 0,10' },
    { name:'Débito', mdr:'1,50%', antec:'—', tarifa:'R$ 0,08' },
  ]},
  { key:'mastercard', label:'Mastercard', color:'#EB001B', txtColor:'#fff', products:[
    { name:'Crédito à vista', mdr:'2,25%', antec:'1,99% a.m.', tarifa:'R$ 0,10' },
    { name:'Crédito 2–6x', mdr:'2,95%', antec:'1,99% a.m.', tarifa:'R$ 0,10' },
    { name:'Crédito 7–12x', mdr:'3,50%', antec:'1,99% a.m.', tarifa:'R$ 0,10' },
    { name:'Débito', mdr:'1,55%', antec:'—', tarifa:'R$ 0,08' },
  ]},
  { key:'elo', label:'Elo', color:'#FFD700', txtColor:'#000', products:[
    { name:'Crédito à vista', mdr:'2,30%', antec:'2,10% a.m.', tarifa:'R$ 0,10' },
    { name:'Crédito 2–6x', mdr:'3,10%', antec:'2,10% a.m.', tarifa:'R$ 0,10' },
    { name:'Crédito 7–12x', mdr:'3,70%', antec:'2,10% a.m.', tarifa:'R$ 0,10' },
    { name:'Débito', mdr:'1,65%', antec:'—', tarifa:'R$ 0,08' },
  ]},
  { key:'pix', label:'PIX', color:'#00BDAE', txtColor:'#fff', products:[
    { name:'PIX QR Code / Cobrança', mdr:'0,99%', antec:'—', tarifa:'R$ 0,05' },
  ]},
]

export default function PricingPage() {
  const [exp, setExp] = useState<Record<string,boolean>>({ visa:true, mastercard:false, elo:false, pix:false })
  const toggle = (k: string) => setExp(p => ({ ...p, [k]: !p[k] }))

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader title="Custos & Pricing" breadcrumb="Sub-adquirente / Custos & Pricing" onBack={() => {}} extra={
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'6px 16px', fontSize:14, cursor:'pointer', color:'rgba(0,0,0,0.65)' }}>Histórico</button>
          <button style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, padding:'6px 16px', fontSize:14, cursor:'pointer' }}>Salvar alterações</button>
        </div>
      } />
      <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, padding:'10px 16px', display:'flex', gap:10, alignItems:'flex-start' }}>
          <Icon name="info" size={16} color="#1890FF" />
          <span style={{ fontSize:13, color:'rgba(0,0,0,0.65)' }}>As taxas abaixo refletem o pricing vigente para novos merchants. Alterações entram em vigor no próximo ciclo de faturamento.</span>
        </div>
        {schemes.map(scheme => (
          <div key={scheme.key} style={{ background:'#fff', borderRadius:2, border:'1px solid rgba(0,0,0,0.06)', overflow:'hidden' }}>
            <div onClick={() => toggle(scheme.key)}
              style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', borderBottom:exp[scheme.key]?'1px solid #f0f0f0':'none' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#fafafa'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#fff'}>
              <div style={{ width:32, height:20, borderRadius:2, background:scheme.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:9, color:scheme.txtColor, fontWeight:700 }}>{scheme.label.slice(0,3).toUpperCase()}</span>
              </div>
              <span style={{ fontWeight:600, fontSize:14, color:'rgba(0,0,0,0.85)', flex:1 }}>{scheme.label}</span>
              <span style={{ fontSize:12, color:'rgba(0,0,0,0.45)' }}>{scheme.products.length} produto(s)</span>
              <Icon name={exp[scheme.key]?'chevronUp':'chevronDown'} size={14} color="rgba(0,0,0,0.45)" />
            </div>
            {exp[scheme.key] && (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:'#fafafa' }}>
                    {['Produto / Arranjo','MDR (%)','Taxa de antecipação','Tarifa por transação',''].map(h => (
                      <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontWeight:500, color:'rgba(0,0,0,0.65)', fontSize:12, borderBottom:'1px solid #f0f0f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheme.products.map((p, i) => (
                    <tr key={i} style={{ borderBottom:i<scheme.products.length-1?'1px solid #f0f0f0':'none' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#fafafa'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                      <td style={{ padding:'12px 20px', color:'rgba(0,0,0,0.85)' }}>{p.name}</td>
                      <td style={{ padding:'12px 20px' }}>
                        <input defaultValue={p.mdr}
                          style={{ border:'1px solid #d9d9d9', borderRadius:2, padding:'4px 8px', width:80, fontSize:13, fontFamily:'Roboto Mono', textAlign:'right', outline:'none' }}
                          onFocus={e=>(e.target as HTMLInputElement).style.border='1px solid #1890FF'}
                          onBlur={e=>(e.target as HTMLInputElement).style.border='1px solid #d9d9d9'} />
                      </td>
                      <td style={{ padding:'12px 20px', color:p.antec==='—'?'rgba(0,0,0,0.25)':'rgba(0,0,0,0.65)' }}>{p.antec}</td>
                      <td style={{ padding:'12px 20px', color:'rgba(0,0,0,0.65)' }}>{p.tarifa}</td>
                      <td style={{ padding:'12px 20px', textAlign:'right' }}>
                        <button title="Editar" style={{ border:'none', background:'none', color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:4, display:'inline-flex', alignItems:'center', borderRadius:4 }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#1890FF';(e.currentTarget as HTMLElement).style.background='#f5f5f5'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.35)';(e.currentTarget as HTMLElement).style.background='none'}}>
                          <Icon name="edit" size={14} color="currentColor" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
