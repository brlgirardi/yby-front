'use client'

import { useState } from 'react'
import { App, Button, InputNumber, Switch, TimePicker, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/atoms/Icon'
import TableTabsBar from '@/components/pricing/TableTabsBar'

// ── Tipos ──────────────────────────────────────────────────────────────────

interface Categoria {
  id:           string
  name:         string
  taxaMensal:   number
  taxaMin:      number
  taxaMax:      number
  prazoMaxDias: number
  limiteOp:     number
  scoreMinimo:         number
  thresholdChargeback: number
  carenciaDias:        number
  pctAgendaMax:    number
  limiteDiario:    number
  opMinima:        number
  opMaxima:        number
  cooldownHoras:   number
  colchaoReserva:  number
}

const CATEGORIAS_INITIAL: Categoria[] = [
  {
    id: 'bronze', name: 'Bronze',
    taxaMensal: 3.5, taxaMin: 2.0, taxaMax: 5.0, prazoMaxDias: 180, limiteOp: 50000,
    scoreMinimo: 600, thresholdChargeback: 2.0, carenciaDias: 90,
    pctAgendaMax: 40, limiteDiario: 100000, opMinima: 1000, opMaxima: 50000, cooldownHoras: 48, colchaoReserva: 5,
  },
  {
    id: 'prata', name: 'Prata',
    taxaMensal: 2.8, taxaMin: 1.5, taxaMax: 4.0, prazoMaxDias: 270, limiteOp: 150000,
    scoreMinimo: 500, thresholdChargeback: 3.0, carenciaDias: 60,
    pctAgendaMax: 60, limiteDiario: 300000, opMinima: 1000, opMaxima: 150000, cooldownHoras: 24, colchaoReserva: 3,
  },
  {
    id: 'ouro', name: 'Ouro',
    taxaMensal: 2.2, taxaMin: 1.0, taxaMax: 3.5, prazoMaxDias: 360, limiteOp: 500000,
    scoreMinimo: 400, thresholdChargeback: 4.0, carenciaDias: 30,
    pctAgendaMax: 80, limiteDiario: 1000000, opMinima: 5000, opMaxima: 500000, cooldownHoras: 12, colchaoReserva: 2,
  },
]

interface OperacionalConfig {
  horarioCorte:             string
  slaAprovacaoHoras:        number
  retryMaxTentativas:       number
  retryIntervaloMin:        number
  janelaReconciliacaoHoras: number
  modoManutencao:           boolean
}

const OPER_INITIAL: OperacionalConfig = {
  horarioCorte: '15:00', slaAprovacaoHoras: 48, retryMaxTentativas: 3,
  retryIntervaloMin: 5, janelaReconciliacaoHoras: 4, modoManutencao: false,
}

// ── Helpers ────────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{label}</span>
        {hint && (
          <Tooltip title={hint} placement="top">
            <Info size={12} color="rgba(0,0,0,0.25)" style={{ cursor: 'help', flexShrink: 0 }} />
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  )
}

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, padding: '20px 24px' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 20 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────

function PricingAntecipacaoInner() {
  const router = useRouter()
  const { message } = App.useApp()
  const [saving, setSaving]   = useState(false)
  const [cats, setCats]       = useState<Categoria[]>(CATEGORIAS_INITIAL)
  const [activeCatId, setActiveCatId] = useState<string>(CATEGORIAS_INITIAL[0].id)
  const [oper, setOper]       = useState<OperacionalConfig>(OPER_INITIAL)

  const cat = cats.find(c => c.id === activeCatId) ?? cats[0]

  const updateCat = <K extends keyof Categoria>(field: K, value: Categoria[K]) =>
    setCats(prev => prev.map(c => c.id === activeCatId ? { ...c, [field]: value } : c))

  const handleAddCat = () => {
    const newId = `cat_${Date.now()}`
    const base = cats[0]
    setCats(prev => [...prev, { ...base, id: newId, name: `Categoria ${prev.length + 1}` }])
    setActiveCatId(newId)
  }

  const handleRenameCat = (id: string, name: string) =>
    setCats(prev => prev.map(c => c.id === id ? { ...c, name } : c))

  const handleDeleteCat = (id: string) => {
    setCats(prev => {
      const next = prev.filter(c => c.id !== id)
      if (activeCatId === id) setActiveCatId(next[0]?.id ?? '')
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    message.success('Configurações salvas (modo demo — nada gravado).')
    setSaving(false)
  }

  const fmtBRL = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Antecipação"
        breadcrumb="Sub-adquirente · v1 / Custos & Precificação / Antecipação"
        noBorder
        extra={
          <>
            <Button onClick={() => router.back()}>Cancelar</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>Salvar</Button>
          </>
        }
      />

      {/* Tabs de categoria */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px', flexShrink: 0 }}>
        <TableTabsBar
          tabs={cats}
          activeId={activeCatId}
          onChangeActive={setActiveCatId}
          onAdd={handleAddCat}
          onRename={handleRenameCat}
          onDelete={cats.length > 1 ? handleDeleteCat : undefined}
          addLabel="Nova categoria"
        />
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── TAXAS ── */}
        <CardSection title="Taxas">
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginBottom: 20 }}>
            Taxas e prazos aplicados às antecipações dos ECs na categoria <strong style={{ color: 'rgba(0,0,0,0.85)' }}>{cat.name}</strong>.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            <Field label="Taxa a.m. (%)" hint="Taxa mensal cobrada do EC pela antecipação do recebível">
              <InputNumber value={cat.taxaMensal} min={0} max={20} step={0.1} precision={2} suffix="%" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('taxaMensal', v)} />
            </Field>
            <Field label="Taxa mínima (%)" hint="Piso da taxa — não pode ser cobrado abaixo disso mesmo com desconto comercial">
              <InputNumber value={cat.taxaMin} min={0} max={cat.taxaMensal} step={0.1} precision={2} suffix="%" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('taxaMin', v)} />
            </Field>
            <Field label="Taxa máxima (%)" hint="Teto da taxa — limite superior para negociação comercial com o EC">
              <InputNumber value={cat.taxaMax} min={cat.taxaMensal} max={30} step={0.1} precision={2} suffix="%" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('taxaMax', v)} />
            </Field>
            <Field label="Prazo máx. (dias)" hint="Parcelas com vencimento além desse prazo não são elegíveis para antecipação">
              <InputNumber value={cat.prazoMaxDias} min={30} max={720} step={30} suffix="dias" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('prazoMaxDias', v)} />
            </Field>
            <Field label="Limite por operação (R$)" hint="Valor máximo que pode ser antecipado em uma única solicitação">
              <InputNumber
                value={cat.limiteOp} min={1000} step={1000}
                formatter={v => fmtBRL(Number(v))}
                parser={v => Number(String(v).replace(/[^0-9]/g, ''))}
                style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('limiteOp', v)}
              />
            </Field>
          </div>
        </CardSection>

        {/* ── RISCO ── */}
        <CardSection title="Risco">
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginBottom: 20 }}>
            Critérios de elegibilidade para ECs na categoria <strong style={{ color: 'rgba(0,0,0,0.85)' }}>{cat.name}</strong>.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            <Field label="Score mínimo" hint="Score de crédito mínimo exigido do EC para poder antecipar. ECs abaixo desse score são bloqueados automaticamente.">
              <InputNumber value={cat.scoreMinimo} min={0} max={1000} step={10} style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('scoreMinimo', v)} />
            </Field>
            <Field label="Limite de chargeback (% do volume)" hint="Percentual máximo de chargeback sobre o volume total processado. Acima desse limite, novas antecipações são bloqueadas automaticamente para o EC.">
              <InputNumber value={cat.thresholdChargeback} min={0} max={20} step={0.1} precision={1} suffix="%" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('thresholdChargeback', v)} />
            </Field>
            <Field label="Carência inicial (dias)" hint="Quantos dias um EC recém-cadastrado deve aguardar antes de poder solicitar a primeira antecipação.">
              <InputNumber value={cat.carenciaDias} min={0} max={365} step={30} suffix="dias" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('carenciaDias', v)} />
            </Field>
          </div>
        </CardSection>

        {/* ── LIMITES ── */}
        <CardSection title="Limites operacionais">
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginBottom: 20 }}>
            Limites de volume e frequência para ECs na categoria <strong style={{ color: 'rgba(0,0,0,0.85)' }}>{cat.name}</strong>.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            <Field label="Limite de agenda (%)" hint="Percentual máximo do saldo de agenda do EC que pode ser antecipado. Ex: 60% = EC com R$ 100k em agenda pode antecipar até R$ 60k.">
              <InputNumber value={cat.pctAgendaMax} min={1} max={100} step={5} suffix="%" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('pctAgendaMax', v)} />
            </Field>
            <Field label="Limite diário (R$)" hint="Valor máximo total que pode ser antecipado por um EC em um único dia, somando todas as operações.">
              <InputNumber
                value={cat.limiteDiario} min={1000} step={10000}
                formatter={v => fmtBRL(Number(v))}
                parser={v => Number(String(v).replace(/[^0-9]/g, ''))}
                style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('limiteDiario', v)}
              />
            </Field>
            <Field label="Operação mínima (R$)" hint="Valor mínimo por solicitação. Abaixo disso, a solicitação é recusada para evitar microoperações não rentáveis.">
              <InputNumber
                value={cat.opMinima} min={100} step={500}
                formatter={v => fmtBRL(Number(v))}
                parser={v => Number(String(v).replace(/[^0-9]/g, ''))}
                style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('opMinima', v)}
              />
            </Field>
            <Field label="Operação máxima (R$)" hint="Valor máximo por solicitação individual. Acima disso, exige aprovação manual.">
              <InputNumber
                value={cat.opMaxima} min={cat.opMinima} step={5000}
                formatter={v => fmtBRL(Number(v))}
                parser={v => Number(String(v).replace(/[^0-9]/g, ''))}
                style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('opMaxima', v)}
              />
            </Field>
            <Field label="Cooldown entre operações" hint="Tempo mínimo que o EC deve aguardar entre duas solicitações consecutivas. Evita múltiplas operações em sequência rápida.">
              <InputNumber value={cat.cooldownHoras} min={0} max={168} step={12} suffix="h" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('cooldownHoras', v)} />
            </Field>
            <Field label="Reserva de garantia (%)" hint="Percentual do valor antecipado retido como reserva para cobrir eventuais falhas de TED/PIX ou chargebacks futuros.">
              <InputNumber value={cat.colchaoReserva} min={0} max={20} step={0.5} precision={1} suffix="%" style={{ width: '100%' }}
                onChange={v => v !== null && updateCat('colchaoReserva', v)} />
            </Field>
          </div>
        </CardSection>

        {/* ── OPERACIONAL (global, sem categorias) ── */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Operacional — configuração global
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 16 }}>Janelas de tempo</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              <Field label="Horário de corte" hint="Solicitações recebidas até este horário são processadas no mesmo dia. Após o corte, entram no ciclo do próximo dia útil.">
                <TimePicker
                  value={dayjs(oper.horarioCorte, 'HH:mm')}
                  format="HH:mm" minuteStep={30} style={{ width: '100%' }}
                  onChange={v => v && setOper(p => ({ ...p, horarioCorte: v.format('HH:mm') }))}
                />
              </Field>
              <Field label="SLA aprovação manual" hint="Prazo máximo para que a equipe de operações revise e aprove/rejeite solicitações que requerem análise manual.">
                <InputNumber value={oper.slaAprovacaoHoras} min={1} max={168} step={12} suffix="h" style={{ width: '100%' }}
                  onChange={v => v !== null && setOper(p => ({ ...p, slaAprovacaoHoras: v }))} />
              </Field>
              <Field label="Prazo de confirmação Núclea (h)" hint="Período em que o sistema aguarda confirmação da Núclea antes de considerar a operação liquidada.">
                <InputNumber value={oper.janelaReconciliacaoHoras} min={1} max={24} step={1} suffix="h" style={{ width: '100%' }}
                  onChange={v => v !== null && setOper(p => ({ ...p, janelaReconciliacaoHoras: v }))} />
              </Field>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 16 }}>Retry TED/PIX</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
              <Field label="Tentativas máximas" hint="Quantas vezes o sistema tenta reenviar um TED/PIX em caso de falha técnica antes de marcar como erro.">
                <InputNumber value={oper.retryMaxTentativas} min={1} max={10} step={1} style={{ width: '100%' }}
                  onChange={v => v !== null && setOper(p => ({ ...p, retryMaxTentativas: v }))} />
              </Field>
              <Field label="Intervalo entre tentativas" hint="Tempo de espera entre cada tentativa de reenvio. Evita sobrecarregar o sistema de pagamentos em caso de instabilidade.">
                <InputNumber value={oper.retryIntervaloMin} min={1} max={60} step={5} suffix="min" style={{ width: '100%' }}
                  onChange={v => v !== null && setOper(p => ({ ...p, retryIntervaloMin: v }))} />
              </Field>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 12 }}>Modo de manutenção</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch checked={oper.modoManutencao} onChange={v => setOper(p => ({ ...p, modoManutencao: v }))} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: oper.modoManutencao ? '#ff4d4f' : 'rgba(0,0,0,0.85)' }}>
                  {oper.modoManutencao ? 'ATIVO — novas antecipações pausadas globalmente' : 'Inativo'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Operações em andamento não são afetadas.</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function PricingAntecipacaoPage() {
  return (
    <App>
      <PricingAntecipacaoInner />
    </App>
  )
}
