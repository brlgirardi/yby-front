'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import AppSelect from '@/components/ui/AppSelect'

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ background:'#fff', borderRadius:4, border:'1px solid #f0f0f0', overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ fontWeight:600, fontSize:14, color:'rgba(0,0,0,0.85)' }}>{title}</div>
        {description && <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)', marginTop:2 }}>{description}</div>}
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:24, alignItems:'start', paddingBottom:16, marginBottom:16, borderBottom:'1px solid #f0f0f0' }}>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{label}</div>
        {hint && <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)', marginTop:2 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width:40, height:22, borderRadius:11, border:'none', cursor:'pointer', transition:'background 0.2s', position:'relative',
        background: checked ? '#1890FF' : '#d9d9d9',
      }}
    >
      <span style={{
        position:'absolute', top:3, left: checked ? 21 : 3,
        width:16, height:16, borderRadius:'50%', background:'#fff',
        transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </button>
  )
}

export default function SettingsPage() {
  const [notifEmail,    setNotifEmail]    = useState(true)
  const [notifWebhook,  setNotifWebhook]  = useState(false)
  const [notifChargeback, setNotifCb]    = useState(true)
  const [notifLiquidacao, setNotifLiq]   = useState(true)
  const [twoFactor,     setTwoFactor]    = useState(false)
  const [saved, setSaved]                = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader
        title="Configurações"
        breadcrumb="Sub-adquirente / Configurações"
        onBack={null}
        extra={
          <Button variant="primary" size="sm" onClick={handleSave}>
            {saved ? '✓ Salvo' : 'Salvar alterações'}
          </Button>
        }
      />

      <div style={{ padding:24, maxWidth:800, display:'flex', flexDirection:'column', gap:20 }}>

        {/* Dados da empresa */}
        <Section title="Dados da empresa" description="Informações do sub-adquirente cadastradas na plataforma.">
          <Row label="Razão Social">
            <Input defaultValue="Tupi Tech Solutions Ltda" />
          </Row>
          <Row label="CNPJ">
            <Input defaultValue="12.345.678/0001-90" disabled />
          </Row>
          <Row label="E-mail de contato" hint="Usado para comunicações operacionais">
            <Input defaultValue="operacoes@tupitech.com.br" type="email" />
          </Row>
          <Row label="Fuso horário">
            <AppSelect
              defaultValue="america_sao_paulo"
              options={[
                { label:'America/São_Paulo (UTC-3)', value:'america_sao_paulo' },
                { label:'America/Manaus (UTC-4)', value:'america_manaus' },
                { label:'America/Belem (UTC-3)', value:'america_belem' },
              ]}
              style={{ width:'100%' }}
            />
          </Row>
          <div style={{ borderBottom:'none', paddingBottom:0, marginBottom:0 }}>
            <Row label="Moeda padrão">
              <AppSelect
                defaultValue="brl"
                options={[{ label:'BRL — Real brasileiro', value:'brl' }, { label:'USD — Dólar americano', value:'usd' }]}
                style={{ width:'100%' }}
              />
            </Row>
          </div>
        </Section>

        {/* Notificações */}
        <Section title="Notificações" description="Controle quais eventos geram alertas e por qual canal.">
          <Row label="E-mail de notificações" hint="Disparos automáticos de eventos">
            <Toggle checked={notifEmail} onChange={setNotifEmail} />
          </Row>
          <Row label="Webhook de eventos" hint="POST para URL configurada nos seus sistemas">
            <Toggle checked={notifWebhook} onChange={setNotifWebhook} />
          </Row>
          <Row label="Alertas de chargeback" hint="Notificar quando nova disputa for registrada">
            <Toggle checked={notifChargeback} onChange={setNotifCb} />
          </Row>
          <div style={{ borderBottom:'none', paddingBottom:0, marginBottom:0 }}>
            <Row label="Alertas de liquidação" hint="Notificar quando adquirente liquidar">
              <Toggle checked={notifLiquidacao} onChange={setNotifLiq} />
            </Row>
          </div>
        </Section>

        {/* Segurança */}
        <Section title="Segurança" description="Configurações de autenticação e acesso.">
          <Row label="Autenticação em dois fatores (2FA)" hint="Obrigatório para perfis Admin e Financeiro">
            <Toggle checked={twoFactor} onChange={setTwoFactor} />
          </Row>
          <div style={{ borderBottom:'none', paddingBottom:0, marginBottom:0 }}>
            <Row label="Sessão máxima" hint="Tempo antes de expirar sessão inativa">
              <AppSelect
                defaultValue="8h"
                options={[
                  { label:'1 hora', value:'1h' },
                  { label:'4 horas', value:'4h' },
                  { label:'8 horas', value:'8h' },
                  { label:'24 horas', value:'24h' },
                ]}
                style={{ width:180 }}
              />
            </Row>
          </div>
        </Section>

        {/* Integrações */}
        <Section title="Integrações" description="Credenciais e endpoints dos adquirentes conectados.">
          {['Adiq','Rede','Cielo','Getnet'].map((adq, i, arr) => (
            <div
              key={adq}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                paddingBottom: i < arr.length-1 ? 16 : 0,
                marginBottom:  i < arr.length-1 ? 16 : 0,
                borderBottom:  i < arr.length-1 ? '1px solid #f0f0f0' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{adq}</div>
                <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)' }}>Conectado · última sincronização há 2 min</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ background:'#F6FFED', color:'#237804', border:'1px solid #D9F7BE', borderRadius:2, padding:'1px 8px', fontSize:12 }}>Ativo</span>
                <Button variant="secondary" size="sm">Configurar</Button>
              </div>
            </div>
          ))}
        </Section>

      </div>
    </div>
  )
}
