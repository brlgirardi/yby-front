'use client'
// EC v1 — Configurando preferências (FigJam 141:279).
// 3 áreas configuráveis pelo EC: opt-in/out automática, % agenda customizado,
// canais de notificação. Sempre validado contra limite do Sub em real-time.
//
// Regra Sub-imposed: a categoria do EC (Bronze/Prata/Ouro) define teto.
// Se Sub mudar categoria, EC é notificado e prefs ajustadas automaticamente.

import { useState } from 'react'
import { Switch, Slider, Checkbox, Tag as AntTag } from 'antd'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Tooltip from '@/components/atoms/Tooltip'


const sectionCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: 2,
}

const sectionHeader: React.CSSProperties = {
  padding: '16px 20px',
  borderBottom: '1px solid #f0f0f0',
}

const sectionBody: React.CSSProperties = {
  padding: '20px',
}

// Mock — categoria do EC vinda do Sub (read-only no portal EC).
type Categoria = 'Bronze' | 'Prata' | 'Ouro'
const EC_CATEGORIA: Categoria = 'Prata'
const TETO_AGENDA: Record<Categoria, number> = { Bronze: 50, Prata: 70, Ouro: 95 }

export default function EcPreferencias() {
  // Pixel/Rian (cap. 5 status quo): default conservador. Usuário sobe ativamente.
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [percentAgenda, setPercentAgenda] = useState(30)
  const [notifPush, setNotifPush] = useState(true)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSms, setNotifSms] = useState(false)

  const teto = TETO_AGENDA[EC_CATEGORIA]
  const acimaDoTeto = percentAgenda > teto

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Preferências de antecipação"
        breadcrumb="Estabelecimento Comercial · v1 / Configurações / Preferências"
        extra={<Button variant="primary" disabled={acimaDoTeto}>Salvar preferências</Button>}
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Categoria info */}
        <div style={{ ...sectionCard, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="info" size={16} color="#1890FF" />
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
            Sua categoria atual é{' '}
            <AntTag color={EC_CATEGORIA === 'Ouro' ? 'gold' : EC_CATEGORIA === 'Prata' ? 'default' : 'orange'} style={{ marginInlineEnd: 0 }}>
              {EC_CATEGORIA}
            </AntTag>{' '}
            — você pode antecipar até <strong>{teto}%</strong> da sua agenda.{' '}
            <Tooltip bare text="Categoria definida pelo Sub-adquirente com base no seu histórico (volume, chargeback, MCC). Quanto mais alta, maior teto e melhor taxa.">
              <span style={{ borderBottom: '1px dotted rgba(0,0,0,0.25)', cursor: 'help' }}>O que é categoria?</span>
            </Tooltip>
          </span>
        </div>

        {/* Antecipação automática */}
        <div style={sectionCard}>
          <div style={{ ...sectionHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Antecipação automática</div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Antecipa todas as parcelas elegíveis assim que a venda é autorizada</div>
            </div>
            <Switch checked={autoAdvance} onChange={setAutoAdvance} />
          </div>
        </div>

        {/* % agenda customizado */}
        <div style={sectionCard}>
          <div style={sectionHeader}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>% da agenda a antecipar</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
              Quanto da sua agenda futura você quer antecipar automaticamente quando uma regra dispara.{' '}
              <Tooltip bare text={`Sua categoria ${EC_CATEGORIA} permite até ${teto}%. Acima disso, fale com o sub-adquirente pra subir de categoria.`}>
                <span style={{ borderBottom: '1px dotted rgba(0,0,0,0.25)', cursor: 'help' }}>Há um limite por categoria</span>
              </Tooltip>.
            </div>
          </div>
          <div style={sectionBody}>
            <Slider
              min={0}
              max={100}
              value={percentAgenda}
              onChange={setPercentAgenda}
              marks={{ 0: '0%', 100: '100%' }}
              styles={{ track: { background: acimaDoTeto ? '#FF4D4F' : '#1890FF' } }}
            />
            {acimaDoTeto && (
              <div style={{ marginTop: 12, padding: '8px 12px', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 2, fontSize: 12, color: '#FF4D4F' }}>
                ⚠ Acima do limite da sua categoria. Reduza pra ≤ {teto}% pra salvar — ou fale com seu sub-adquirente pra subir de categoria.
              </div>
            )}
          </div>
        </div>

        {/* Canais de notificação */}
        <div style={sectionCard}>
          <div style={sectionHeader}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Como você quer ser avisado</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Eventos: antecipação executada, falhas, mudanças de categoria.</div>
          </div>
          <div style={{ ...sectionBody, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Checkbox checked={notifPush}  onChange={(e) => setNotifPush(e.target.checked)}>Push (app)</Checkbox>
            <Checkbox checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)}>E-mail (cadastrado)</Checkbox>
            <Checkbox checked={notifSms}   onChange={(e) => setNotifSms(e.target.checked)}>SMS (cobra do operador a cada envio)</Checkbox>
          </div>
        </div>
      </div>
    </div>
  )
}
