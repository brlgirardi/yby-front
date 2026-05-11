'use client'
// Onboarding EC — V0.
// Step central do FigJam V0 EC: aceite de Antecipação automática + Liquidação
// automática durante o cadastro.
//
// Componentes: tudo do design system Yby + antd já em uso (Card, Switch,
// Checkbox). Nenhum visual inline.

import { useState } from 'react'
import { Switch, Checkbox } from 'antd'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Tooltip from '@/components/atoms/Tooltip'

const sectionCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: 2,
  marginTop: 16,
}

const sectionHeader: React.CSSProperties = {
  padding: '16px 20px',
  borderBottom: '1px solid #f0f0f0',
}

const sectionBody: React.CSSProperties = {
  padding: '16px 20px',
}

// Pixel/Rian (Enviesados cap. 5 + cap. 9): defaults OFF — usuário liga
// explicitamente. Nudge ético = mostrar trade-off, não pré-marcar.
export default function EcOnboarding() {
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [autoSettlement, setAutoSettlement] = useState(true)
  const [accepted, setAccepted] = useState(false)

  return (
    <div style={{ padding: '24px 32px', maxWidth: 920, margin: '0 auto' }}>
      <PageHeader title="Vamos configurar seu recebimento" breadcrumb="Estabelecimento Comercial / Onboarding" />

      <div style={sectionCard}>
        <div style={sectionHeader}>
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginBottom: 6 }}>Passo 2 de 3</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Como você quer receber suas vendas?</div>
        </div>
        <div style={sectionBody}>
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
            Escolhas honestas e transparentes. Você pode mudar isso depois em
            <strong> Financeiro · Antecipações</strong>.
          </div>
        </div>
      </div>

      <div style={sectionCard}>
        <div style={{ ...sectionHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="zap" size={16} color="#FA8C16" />
              <span style={{ fontSize: 15, fontWeight: 500 }}>Antecipação automática</span>
            </div>
          </div>
          <Switch checked={autoAdvance} onChange={setAutoAdvance} aria-label="Antecipação automática" />
        </div>
        <div style={sectionBody}>
          {/* Trade-off honesto — ganho + custo + alternativa, mesmo peso visual */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: '12px 14px', background: '#F6FFED', borderRadius: 2, border: '1px solid #B7EB8F', fontSize: 12, color: 'rgba(0,0,0,0.75)' }}>
              <div style={{ fontWeight: 600, color: '#52C41A', marginBottom: 4 }}>Ganho</div>
              Recebe no mesmo dia em vez de esperar 15 dias úteis pelo crédito.
            </div>
            <div style={{ padding: '12px 14px', background: '#FFF1F0', borderRadius: 2, border: '1px solid #FFA39E', fontSize: 12, color: 'rgba(0,0,0,0.75)' }}>
              <div style={{ fontWeight: 600, color: '#FF4D4F', marginBottom: 4 }}>Ônus</div>
              Taxa de antecipação por parcela —{' '}
              <Tooltip bare text="Cada parcela antecipada gera uma taxa proporcional ao prazo. Tabela completa em Financeiro · Taxas e Simulações.">
                <span style={{ borderBottom: '1px dotted rgba(0,0,0,0.4)', cursor: 'help' }}>ver tabela</span>
              </Tooltip>.
            </div>
          </div>
          <div style={{ padding: '10px 12px', background: '#FAFAFA', borderRadius: 2, fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
            <strong>Sem ligar:</strong> você recebe nas datas originais e usa <em>Antecipações → Simular</em> só quando precisar de caixa.
          </div>
        </div>
      </div>

      <div style={sectionCard}>
        <div style={{ ...sectionHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="landmark" size={16} color="#1890FF" />
            <span style={{ fontSize: 15, fontWeight: 500 }}>Liquidação automática</span>
          </div>
          <Switch checked={autoSettlement} onChange={setAutoSettlement} aria-label="Liquidação automática" />
        </div>
        <div style={sectionBody}>
          <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.6, margin: 0 }}>
            Os valores caem direto na sua conta bancária no <strong>D+1</strong> (dia útil seguinte) — sem
            precisar pedir transferência.
          </p>
        </div>
      </div>

      <div style={{ ...sectionCard, padding: '16px 20px' }}>
        <Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)}>
          <span style={{ fontSize: 13 }}>
            Li e aceito as <a href="#" style={{ color: '#1890FF' }}>condições comerciais</a> e a{' '}
            <a href="#" style={{ color: '#1890FF' }}>tabela de taxas</a> aplicáveis ao meu MCC.
          </span>
        </Checkbox>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <Button variant="ghost">Voltar</Button>
        <Button variant="primary" disabled={!accepted}>
          Concluir onboarding
        </Button>
      </div>
    </div>
  )
}
