'use client'

import { useState } from 'react'
import { App, Button, InputNumber, Select, Switch, TimePicker } from 'antd'
import dayjs from 'dayjs'
import PageHeader from '@/components/shared/PageHeader'
import AccordionCard from '@/components/shared/AccordionCard'
import Icon from '@/components/shared/Icon'

type Categoria = 'Bronze' | 'Prata' | 'Ouro'

// ── TAXAS ──
interface TaxaCategoria {
  categoria:    Categoria
  taxaMensal:   number
  taxaMin:      number
  taxaMax:      number
  prazoMaxDias: number
  limiteOp:     number
}

const TAXAS_INITIAL: TaxaCategoria[] = [
  { categoria: 'Bronze', taxaMensal: 3.5, taxaMin: 2.0, taxaMax: 5.0, prazoMaxDias: 180, limiteOp: 50000  },
  { categoria: 'Prata',  taxaMensal: 2.8, taxaMin: 1.5, taxaMax: 4.0, prazoMaxDias: 270, limiteOp: 150000 },
  { categoria: 'Ouro',   taxaMensal: 2.2, taxaMin: 1.0, taxaMax: 3.5, prazoMaxDias: 360, limiteOp: 500000 },
]

// ── RISCO ──
interface RiscoConfig {
  categoria:          Categoria
  scoreMinimo:        number
  thresholdChargeback: number
  carenciaDias:       number
}

const RISCO_INITIAL: RiscoConfig[] = [
  { categoria: 'Bronze', scoreMinimo: 600, thresholdChargeback: 2.0, carenciaDias: 90  },
  { categoria: 'Prata',  scoreMinimo: 500, thresholdChargeback: 3.0, carenciaDias: 60  },
  { categoria: 'Ouro',   scoreMinimo: 400, thresholdChargeback: 4.0, carenciaDias: 30  },
]

// ── LIMITES ──
interface LimitesConfig {
  categoria:       Categoria
  pctAgendaMax:    number
  limiteDiario:    number
  opMinima:        number
  opMaxima:        number
  cooldownHoras:   number
  colchaoReserva:  number
}

const LIMITES_INITIAL: LimitesConfig[] = [
  { categoria: 'Bronze', pctAgendaMax: 40, limiteDiario: 100000,  opMinima: 1000,  opMaxima: 50000,  cooldownHoras: 48, colchaoReserva: 5  },
  { categoria: 'Prata',  pctAgendaMax: 60, limiteDiario: 300000,  opMinima: 1000,  opMaxima: 150000, cooldownHoras: 24, colchaoReserva: 3  },
  { categoria: 'Ouro',   pctAgendaMax: 80, limiteDiario: 1000000, opMinima: 5000,  opMaxima: 500000, cooldownHoras: 12, colchaoReserva: 2  },
]

// ── OPERACIONAL ──
interface OperacionalConfig {
  horarioCorte:     string
  slaAprovacaoHoras: number
  retryMaxTentativas: number
  retryIntervaloMin: number
  janelaReconciliacaoHoras: number
  modoManutencao:   boolean
}

const OPERACIONAL_INITIAL: OperacionalConfig = {
  horarioCorte:              '15:00',
  slaAprovacaoHoras:         48,
  retryMaxTentativas:        3,
  retryIntervaloMin:         5,
  janelaReconciliacaoHoras:  4,
  modoManutencao:            false,
}

// ── NOTIFICAÇÕES ──
interface NotifConfig {
  emailAtivo:       boolean
  pushAtivo:        boolean
  smsAtivo:         boolean
  thresholdAlertaExposicao: number
  thresholdAlertaChargeback: number
  dominiosEmail:    string
}

const NOTIF_INITIAL: NotifConfig = {
  emailAtivo:                true,
  pushAtivo:                 true,
  smsAtivo:                  false,
  thresholdAlertaExposicao:  80,
  thresholdAlertaChargeback: 3.0,
  dominiosEmail:             'subadq.com.br',
}

const CAT_COLOR: Record<Categoria, string> = {
  Bronze: '#d46b08',
  Prata:  'rgba(0,0,0,0.65)',
  Ouro:   '#d4a017',
}

const TABS = [
  { key: 'taxas',        label: 'Taxas' },
  { key: 'risco',        label: 'Risco' },
  { key: 'limites',      label: 'Limites' },
  { key: 'operacional',  label: 'Operacional' },
  { key: 'notificacoes', label: 'Notificações' },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
      {children}
    </div>
  )
}

export default function PricingAntecipacaoPage() {
  const { message } = App.useApp()
  const [tab, setTab]           = useState('taxas')
  const [saving, setSaving]     = useState(false)
  const [taxas, setTaxas]       = useState<TaxaCategoria[]>(TAXAS_INITIAL)
  const [risco, setRisco]       = useState<RiscoConfig[]>(RISCO_INITIAL)
  const [limites, setLimites]   = useState<LimitesConfig[]>(LIMITES_INITIAL)
  const [oper, setOper]         = useState<OperacionalConfig>(OPERACIONAL_INITIAL)
  const [notif, setNotif]       = useState<NotifConfig>(NOTIF_INITIAL)

  const updateTaxa  = (cat: Categoria, field: keyof TaxaCategoria, v: number)   => setTaxas(p => p.map(t => t.categoria === cat ? { ...t, [field]: v } : t))
  const updateRisco = (cat: Categoria, field: keyof RiscoConfig, v: number)      => setRisco(p => p.map(t => t.categoria === cat ? { ...t, [field]: v } : t))
  const updateLim   = (cat: Categoria, field: keyof LimitesConfig, v: number)    => setLimites(p => p.map(t => t.categoria === cat ? { ...t, [field]: v } : t))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    message.success('Configurações salvas (modo demo — nada gravado).')
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Antecipação"
        breadcrumb="Sub-adquirente · v1 / Pricing / Antecipação"
        extra={<Button type="primary" loading={saving} onClick={handleSave}>Salvar</Button>}
      />

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px', display: 'flex', gap: 0 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              border: 'none', background: 'none', padding: '12px 20px', fontSize: 14, cursor: 'pointer',
              color: tab === t.key ? '#1890FF' : 'rgba(0,0,0,0.65)',
              borderBottom: tab === t.key ? '2px solid #1890FF' : '2px solid transparent',
              fontWeight: tab === t.key ? 500 : 400,
              marginBottom: -1,
            }}
          >{t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F8', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#E6F7FF', border: '1px solid #91D5FF', borderRadius: 2, padding: '10px 14px', fontSize: 12, color: 'rgba(0,0,0,0.85)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Icon name="info" size={14} color="#1890FF" />
          <span>Cada save = nova versão com timestamp. Mudanças aplicam-se a partir do próximo ciclo (D+1). Categorias Bronze/Prata/Ouro atravessam todas as áreas.</span>
        </div>

        {/* ── TAXAS ── */}
        {tab === 'taxas' && taxas.map(t => (
          <AccordionCard
            key={t.categoria} defaultOpen={true}
            header={<>
              <div style={{ width: 32, height: 32, background: '#fafafa', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="creditCard" size={16} color={CAT_COLOR[t.categoria]} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: CAT_COLOR[t.categoria] }}>{t.categoria}</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Taxa a.m. atual: {t.taxaMensal.toFixed(2).replace('.', ',')}%</div>
              </div>
            </>}
            meta={<span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Limite por op.: R$ {t.limiteOp.toLocaleString('pt-BR')}</span>}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24, padding: '4px 0' }}>
              <Field label="Taxa a.m. (%)"><InputNumber value={t.taxaMensal} min={0} max={20} step={0.1} precision={2} suffix="%" style={{ width: '100%' }} onChange={v => v !== null && updateTaxa(t.categoria, 'taxaMensal', v)} /></Field>
              <Field label="Taxa mínima (%)"><InputNumber value={t.taxaMin} min={0} max={t.taxaMensal} step={0.1} precision={2} suffix="%" style={{ width: '100%' }} onChange={v => v !== null && updateTaxa(t.categoria, 'taxaMin', v)} /></Field>
              <Field label="Taxa máxima (%)"><InputNumber value={t.taxaMax} min={t.taxaMensal} max={30} step={0.1} precision={2} suffix="%" style={{ width: '100%' }} onChange={v => v !== null && updateTaxa(t.categoria, 'taxaMax', v)} /></Field>
              <Field label="Prazo máx. (dias)"><InputNumber value={t.prazoMaxDias} min={30} max={720} step={30} suffix="dias" style={{ width: '100%' }} onChange={v => v !== null && updateTaxa(t.categoria, 'prazoMaxDias', v)} /></Field>
              <Field label="Limite por operação (R$)"><InputNumber value={t.limiteOp} min={1000} step={1000} formatter={v => `R$ ${Number(v).toLocaleString('pt-BR')}`} parser={v => Number(String(v).replace(/[^0-9]/g, ''))} style={{ width: '100%' }} onChange={v => v !== null && updateTaxa(t.categoria, 'limiteOp', v)} /></Field>
            </div>
          </AccordionCard>
        ))}

        {/* ── RISCO ── */}
        {tab === 'risco' && (
          <>
            {risco.map(r => (
              <AccordionCard
                key={r.categoria} defaultOpen={true}
                header={<>
                  <div style={{ width: 32, height: 32, background: '#fafafa', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="alertTriangle" size={16} color={CAT_COLOR[r.categoria]} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: CAT_COLOR[r.categoria] }}>{r.categoria}</div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Score mín.: {r.scoreMinimo} · Chargeback máx.: {r.thresholdChargeback.toFixed(1)}%</div>
                  </div>
                </>}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24, padding: '4px 0' }}>
                  <Field label="Score mínimo"><InputNumber value={r.scoreMinimo} min={0} max={1000} step={10} style={{ width: '100%' }} onChange={v => v !== null && updateRisco(r.categoria, 'scoreMinimo', v)} /></Field>
                  <Field label="Threshold chargeback (% TPV)"><InputNumber value={r.thresholdChargeback} min={0} max={20} step={0.1} precision={1} suffix="%" style={{ width: '100%' }} onChange={v => v !== null && updateRisco(r.categoria, 'thresholdChargeback', v)} /></Field>
                  <Field label="Carência (dias) para novo EC"><InputNumber value={r.carenciaDias} min={0} max={365} step={30} suffix="dias" style={{ width: '100%' }} onChange={v => v !== null && updateRisco(r.categoria, 'carenciaDias', v)} /></Field>
                </div>
              </AccordionCard>
            ))}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, padding: '16px 20px' }}>
              <SectionLabel>MCCs e whitelist</SectionLabel>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>Controle granular de MCCs permitidos/bloqueados e whitelist de ECs — disponível na próxima versão.</div>
            </div>
          </>
        )}

        {/* ── LIMITES ── */}
        {tab === 'limites' && limites.map(l => (
          <AccordionCard
            key={l.categoria} defaultOpen={true}
            header={<>
              <div style={{ width: 32, height: 32, background: '#fafafa', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="barChart" size={16} color={CAT_COLOR[l.categoria]} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: CAT_COLOR[l.categoria] }}>{l.categoria}</div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Agenda máx.: {l.pctAgendaMax}% · Diário: R$ {(l.limiteDiario/1000).toFixed(0)}k</div>
              </div>
            </>}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24, padding: '4px 0' }}>
              <Field label="% máx. da agenda"><InputNumber value={l.pctAgendaMax} min={1} max={100} step={5} suffix="%" style={{ width: '100%' }} onChange={v => v !== null && updateLim(l.categoria, 'pctAgendaMax', v)} /></Field>
              <Field label="Limite diário (R$)"><InputNumber value={l.limiteDiario} min={1000} step={10000} formatter={v => `R$ ${Number(v).toLocaleString('pt-BR')}`} parser={v => Number(String(v).replace(/[^0-9]/g, ''))} style={{ width: '100%' }} onChange={v => v !== null && updateLim(l.categoria, 'limiteDiario', v)} /></Field>
              <Field label="Op. mínima (R$)"><InputNumber value={l.opMinima} min={100} step={500} formatter={v => `R$ ${Number(v).toLocaleString('pt-BR')}`} parser={v => Number(String(v).replace(/[^0-9]/g, ''))} style={{ width: '100%' }} onChange={v => v !== null && updateLim(l.categoria, 'opMinima', v)} /></Field>
              <Field label="Op. máxima (R$)"><InputNumber value={l.opMaxima} min={l.opMinima} step={5000} formatter={v => `R$ ${Number(v).toLocaleString('pt-BR')}`} parser={v => Number(String(v).replace(/[^0-9]/g, ''))} style={{ width: '100%' }} onChange={v => v !== null && updateLim(l.categoria, 'opMaxima', v)} /></Field>
              <Field label="Cooldown entre operações"><InputNumber value={l.cooldownHoras} min={0} max={168} step={12} suffix="h" style={{ width: '100%' }} onChange={v => v !== null && updateLim(l.categoria, 'cooldownHoras', v)} /></Field>
              <Field label="Colchão de reserva (%)"><InputNumber value={l.colchaoReserva} min={0} max={20} step={0.5} precision={1} suffix="%" style={{ width: '100%' }} onChange={v => v !== null && updateLim(l.categoria, 'colchaoReserva', v)} /></Field>
            </div>
          </AccordionCard>
        ))}

        {/* ── OPERACIONAL ── */}
        {tab === 'operacional' && (
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <SectionLabel>Janelas de tempo</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
                <Field label="Horário de corte (mesmo dia)">
                  <TimePicker
                    value={dayjs(oper.horarioCorte, 'HH:mm')}
                    format="HH:mm"
                    minuteStep={30}
                    style={{ width: '100%' }}
                    onChange={v => v && setOper(p => ({ ...p, horarioCorte: v.format('HH:mm') }))}
                  />
                </Field>
                <Field label="SLA aprovação manual">
                  <InputNumber value={oper.slaAprovacaoHoras} min={1} max={168} step={12} suffix="h" style={{ width: '100%' }} onChange={v => v !== null && setOper(p => ({ ...p, slaAprovacaoHoras: v }))} />
                </Field>
                <Field label="Janela reconciliação Núclea">
                  <InputNumber value={oper.janelaReconciliacaoHoras} min={1} max={24} step={1} suffix="h" style={{ width: '100%' }} onChange={v => v !== null && setOper(p => ({ ...p, janelaReconciliacaoHoras: v }))} />
                </Field>
              </div>
            </div>

            <div>
              <SectionLabel>Retry TED/PIX</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
                <Field label="Tentativas máximas">
                  <InputNumber value={oper.retryMaxTentativas} min={1} max={10} step={1} style={{ width: '100%' }} onChange={v => v !== null && setOper(p => ({ ...p, retryMaxTentativas: v }))} />
                </Field>
                <Field label="Intervalo entre tentativas">
                  <InputNumber value={oper.retryIntervaloMin} min={1} max={60} step={5} suffix="min" style={{ width: '100%' }} onChange={v => v !== null && setOper(p => ({ ...p, retryIntervaloMin: v }))} />
                </Field>
              </div>
            </div>

            <div>
              <SectionLabel>Modo de manutenção</SectionLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Switch
                  checked={oper.modoManutencao}
                  onChange={v => setOper(p => ({ ...p, modoManutencao: v }))}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: oper.modoManutencao ? '#ff4d4f' : 'rgba(0,0,0,0.85)' }}>
                    {oper.modoManutencao ? 'ATIVO — novas antecipações pausadas globalmente' : 'Inativo'}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Operações em andamento não são afetadas.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICAÇÕES ── */}
        {tab === 'notificacoes' && (
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <SectionLabel>Canais de saída</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {([
                  { key: 'emailAtivo', label: 'E-mail', desc: 'Notificações por e-mail para operadores' },
                  { key: 'pushAtivo',  label: 'Push',   desc: 'Notificações push no painel' },
                  { key: 'smsAtivo',   label: 'SMS',    desc: 'SMS para alertas críticos' },
                ] as const).map(ch => (
                  <div key={ch.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Switch checked={notif[ch.key]} onChange={v => setNotif(p => ({ ...p, [ch.key]: v }))} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{ch.label}</div>
                      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{ch.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Thresholds de alerta</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
                <Field label="Alerta exposição (% do limite)">
                  <InputNumber value={notif.thresholdAlertaExposicao} min={50} max={100} step={5} suffix="%" style={{ width: '100%' }} onChange={v => v !== null && setNotif(p => ({ ...p, thresholdAlertaExposicao: v }))} />
                </Field>
                <Field label="Alerta chargeback (% TPV)">
                  <InputNumber value={notif.thresholdAlertaChargeback} min={0.5} max={10} step={0.5} precision={1} suffix="%" style={{ width: '100%' }} onChange={v => v !== null && setNotif(p => ({ ...p, thresholdAlertaChargeback: v }))} />
                </Field>
              </div>
            </div>

            <div>
              <SectionLabel>Whitelist de domínios (e-mail)</SectionLabel>
              <Field label="Domínios permitidos (separados por vírgula)">
                <input
                  value={notif.dominiosEmail}
                  onChange={e => setNotif(p => ({ ...p, dominiosEmail: e.target.value }))}
                  style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: 2, padding: '5px 11px', fontSize: 13, outline: 'none', color: 'rgba(0,0,0,0.85)' }}
                  onFocus={e => (e.target.style.borderColor = '#1890FF')}
                  onBlur={e  => (e.target.style.borderColor = '#d9d9d9')}
                />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
