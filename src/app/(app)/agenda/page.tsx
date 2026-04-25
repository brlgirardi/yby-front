'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import BrandLogo from '@/components/shared/BrandLogo'
import { useNavStore } from '@/store/nav.store'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const PARCELAS_DATA = [
  { data:'10/04/2026', nsu:'183726402', bandeira:'Visa',   lancamento:'Crédito à vista',   parcela:'1/1', valor:10.00,    comissao:0.30,   antecipDescontada:0,        liquido:9.70,    antecipado:false, status:'Pago' },
  { data:'10/04/2026', nsu:'209874928', bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'2/3', valor:200.00,   comissao:6.00,   antecipDescontada:0,        liquido:194.00,  antecipado:true,  status:'Pago' },
  { data:'10/04/2026', nsu:'109837229', bandeira:'Elo',    lancamento:'Débito',            parcela:'1/1', valor:2000.00,  comissao:50.00,  antecipDescontada:0,        liquido:1950.00, antecipado:false, status:'Pendente' },
  { data:'11/04/2026', nsu:'987638643', bandeira:'Master', lancamento:'Crédito parcelado', parcela:'4/6', valor:20000.00, comissao:600.00, antecipDescontada:50000.00, liquido:19400.00,antecipado:true,  status:'Antecipado' },
  { data:'11/04/2026', nsu:'290838372', bandeira:'Visa',   lancamento:'Crédito à vista',   parcela:'1/1', valor:50.00,   comissao:1.50,   antecipDescontada:0,        liquido:48.50,   antecipado:false, status:'Chargeback' },
  { data:'12/04/2026', nsu:'334872910', bandeira:'Master', lancamento:'Crédito à vista',   parcela:'1/1', valor:1500.00,  comissao:45.00,  antecipDescontada:0,        liquido:1455.00, antecipado:false, status:'Pago' },
  { data:'12/04/2026', nsu:'445983021', bandeira:'Elo',    lancamento:'Crédito parcelado', parcela:'1/4', valor:800.00,   comissao:24.00,  antecipDescontada:5000.00,  liquido:776.00,  antecipado:true,  status:'Antecipado' },
  { data:'13/04/2026', nsu:'556094132', bandeira:'Visa',   lancamento:'Débito',            parcela:'1/1', valor:350.00,   comissao:10.50,  antecipDescontada:0,        liquido:339.50,  antecipado:false, status:'Pago' },
  { data:'14/04/2026', nsu:'667205243', bandeira:'Master', lancamento:'Crédito parcelado', parcela:'3/6', valor:5000.00,  comissao:150.00, antecipDescontada:0,        liquido:4850.00, antecipado:false, status:'Pendente' },
  { data:'15/04/2026', nsu:'778316354', bandeira:'Visa',   lancamento:'Crédito à vista',   parcela:'1/1', valor:125.00,   comissao:3.75,   antecipDescontada:0,        liquido:121.25,  antecipado:false, status:'Pago' },
  { data:'16/04/2026', nsu:'889427465', bandeira:'Elo',    lancamento:'Crédito parcelado', parcela:'2/6', valor:3200.00,  comissao:96.00,  antecipDescontada:0,        liquido:3104.00, antecipado:false, status:'Pago' },
  { data:'17/04/2026', nsu:'990538576', bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'1/12',valor:8000.00,  comissao:240.00, antecipDescontada:30000.00, liquido:7760.00, antecipado:true,  status:'Antecipado' },
  { data:'18/04/2026', nsu:'112649687', bandeira:'Master', lancamento:'Débito',            parcela:'1/1', valor:450.00,   comissao:13.50,  antecipDescontada:0,        liquido:436.50,  antecipado:false, status:'Pago' },
  { data:'19/04/2026', nsu:'223750798', bandeira:'Visa',   lancamento:'Crédito à vista',   parcela:'1/1', valor:78.00,    comissao:2.34,   antecipDescontada:0,        liquido:75.66,   antecipado:false, status:'Pago' },
  { data:'20/04/2026', nsu:'334861809', bandeira:'Elo',    lancamento:'Crédito parcelado', parcela:'3/3', valor:600.00,   comissao:18.00,  antecipDescontada:0,        liquido:582.00,  antecipado:false, status:'Pendente' },
]

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  'Pago':       { bg:'#f6ffed', color:'#52c41a', border:'#b7eb8f' },
  'Pendente':   { bg:'#fffbe6', color:'#faad14', border:'#ffe58f' },
  'Antecipado': { bg:'#fff7e6', color:'#fa8c16', border:'#ffd591' },
  'Chargeback': { bg:'#fff1f0', color:'#ff4d4f', border:'#ffa39e' },
  'Liquidado':  { bg:'#f6ffed', color:'#389e0d', border:'#95de64' },
  'Em aberto':  { bg:'#fffbe6', color:'#faad14', border:'#ffe58f' },
  'Quitado':    { bg:'#f6ffed', color:'#52c41a', border:'#b7eb8f' },
}

const AgendaTag = ({ status }: { status: string }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE['Pendente']
  return <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:2, padding:'1px 8px', fontSize:12, fontWeight:500 }}>{status}</span>
}

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false)
  return (
    <span style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:4 }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <span style={{ cursor:'help', color:'rgba(0,0,0,0.35)', display:'inline-flex', alignItems:'center' }}>
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </span>
      {show && (
        <div style={{ position:'absolute', left:'50%', bottom:'calc(100% + 6px)', transform:'translateX(-50%)', background:'rgba(0,0,0,0.85)', color:'#fff', fontSize:11, lineHeight:'16px', padding:'6px 10px', borderRadius:4, width:220, zIndex:9999, pointerEvents:'none', whiteSpace:'normal', boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
          {text}
          <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:8, height:8, background:'rgba(0,0,0,0.85)', rotate:'45deg' }} />
        </div>
      )}
    </span>
  )
}

const CAL_VALUES: Record<string, number[]> = {
  bruto:      [0,48000,0,48000,48000,0,48000,0,48000,48000,0,48000,0,48000,48000,0,48000,0,48000,48000,0,0,0,0,0,0,0,0,0,0],
  adquirente: [0,32000,0,31000,29000,0,33000,0,28000,35000,0,30000,0,34000,27000,0,36000,0,29000,38000,0,0,0,0,0,0,0,0,0,0],
  liquido:    [0,38400,0,38400,38400,0,38400,0,38400,38400,0,38400,0,38400,38400,0,38400,0,38400,38400,0,0,0,0,0,0,0,0,0,0],
}
const CAL_ADQUIRENTES = ['—','Adiq','—','Rede','Cielo','—','Adiq','—','Rede','Adiq','—','Cielo','—','Rede','Getnet','—','Adiq','—','Cielo','Rede','—','—','—','—','—','—','—','—','—','—']
const CALENDAR_DAYS = Array.from({length:30},(_,i)=>{
  const day = i+1
  const past = day < 22
  const base = [48000,0,48000,0,48000,48000,0][day%7]
  return { day, past, value: base, status: past ? (day%5===0?'antecipado':'recebido') : 'previsto' }
})

const AGENDA_TABS = [
  { key:'calendario',   label:'Calendário' },
  { key:'detalhada',    label:'Por parcela' },
  { key:'lote',         label:'Por lote' },
  { key:'antecipacoes', label:'Antecipações' },
  { key:'funding',      label:'Funding / Liquidação' },
  { key:'pagamentos',   label:'Pagamentos' },
]

export default function AgendaPage() {
  const { agendaTab, setAgendaTab } = useNavStore()
  const tab = agendaTab

  const [agrupado, setAgrupado] = useState(false)
  const [search, setSearch] = useState('')
  const [filterBandeira, setFilterBandeira] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedDay, setSelectedDay] = useState(22)
  const [expandedLotes, setExpandedLotes] = useState<Record<string,boolean>>({'10/04/2026-Visa': true})
  const [calView, setCalView] = useState<'bruto' | 'liquido'>('bruto')
  const [calBrutoSub, setCalBrutoSub] = useState<'consolidado' | 'adquirente'>('consolidado')
  const [selectedAdqs, setSelectedAdqs] = useState<string[]>([])
  const [adqDropOpen, setAdqDropOpen] = useState(false)
  const isPerAdquirente = calView === 'bruto' && calBrutoSub === 'adquirente'
  const ALL_ADQS = ['Adiq','Rede','Cielo','Getnet']
  const toggleAdq = (a: string) => setSelectedAdqs(prev => prev.includes(a) ? prev.filter(x=>x!==a) : [...prev, a])
  const bandeiras = ['Visa','Master','Elo']

  const calMonth = 3
  const calYear = 2026
  const firstDow = new Date(calYear, calMonth, 1).getDay()

  const filtered = PARCELAS_DATA.filter(r =>
    (!filterBandeira || r.bandeira===filterBandeira) &&
    (!filterStatus   || r.status===filterStatus) &&
    (!search || r.nsu.includes(search) || r.bandeira.toLowerCase().includes(search.toLowerCase()) || r.lancamento.toLowerCase().includes(search.toLowerCase()))
  )

  const kpiData = (filterBandeira || filterStatus || search) ? filtered : PARCELAS_DATA
  const totalBruto    = kpiData.reduce((s,r)=>s+r.valor,0)
  const totalAntecip  = kpiData.reduce((s,r)=>s+r.antecipDescontada,0)
  const totalComissao = kpiData.reduce((s,r)=>s+r.comissao,0)
  const totalLiquido  = kpiData.reduce((s,r)=>s+r.liquido,0)
  const pipelineFuturo = 1247350.00

  const KPI_BY_TAB: Record<string, Array<{label:string;value:string;bg:string;border:string;color:string;sub:string;badge?:string|null}>> = {
    calendario: [
      { label:'Total Bruto das Vendas', value:fmt(totalBruto), bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:`${kpiData.length} transações · abr/2026` },
      { label:'Antecipação Tomada', value:fmt(totalAntecip), bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:'Saldo devedor ao adquirente' },
      { label:'Deduções & Custos', value:fmt(totalComissao), bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'MDR + chargebacks + outros' },
      { label:'Líquido a Receber', value:fmt(totalLiquido), bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Estimativa de crédito em conta' },
      { label:'Pipeline Futuro', value:fmt(pipelineFuturo), bg:'#fffbe6', border:'#ffe58f', color:'#faad14', sub:'Próximos 90 dias (todos)' },
    ],
    detalhada: [
      { label:'Total de parcelas', value:String(PARCELAS_DATA.length), bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'No período filtrado' },
      { label:'Valor bruto total', value:fmt(totalBruto), bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Soma de todas as parcelas' },
      { label:'Parcelas antecipadas', value:String(PARCELAS_DATA.filter(r=>r.antecipado).length), bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:fmt(totalAntecip)+' antecipado' },
      { label:'Deduções (MDR)', value:fmt(totalComissao), bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'Comissão sub sobre EC' },
      { label:'Valor líquido total', value:fmt(totalLiquido), bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Após deduções e antecipações' },
    ],
    lote: [
      { label:'Total de lotes', value:'7', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'4 adquirentes · abr/2026' },
      { label:'Bruto total dos lotes', value:fmt(835400), bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'1.786 transações' },
      { label:'Total antecipado', value:fmt(140000), bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:'Descontado em créditos futuros' },
      { label:'Total comissão', value:fmt(25062), bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'MDR retido pelo sub' },
      { label:'Líquido total dos lotes', value:fmt(670338), bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Crédito líquido previsto' },
    ],
    antecipacoes: [
      { label:'Saldo devedor total', value:fmt(140000), bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:'Em aberto com adquirentes' },
      { label:'Antecipações realizadas (mês)', value:fmt(85000), bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'3 operações em abril/26' },
      { label:'Taxa média tomada', value:'1,99% a.m.', bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Média ponderada das ops' },
      { label:'Custo total do mês', value:fmt(1691), bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'Juros pagos em antecipações' },
    ],
    funding: [
      { label:'Total liquidado (mês)', value:fmt(1240500), bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Créditos confirmados · abr/26' },
      { label:'A liquidar', value:fmt(239900), bg:'#fffbe6', border:'#ffe58f', color:'#faad14', sub:'Pendente de confirmação' },
      { label:'Float do sub-adquirente', value:fmt(78328), bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'Saldo em trânsito' },
      { label:'Próximo funding', value:'25/04/2026', bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Adiq + Rede · R$ 82k previsto' },
      { label:'Custo de processamento', value:fmt(29772), bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'MDR + tarifas do mês' },
    ],
    pagamentos: [
      { label:'Total pago a merchants', value:fmt(980000), bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Abril 2026 · 7 merchants' },
      { label:'Pagamentos pendentes', value:fmt(43200), bg:'#fffbe6', border:'#ffe58f', color:'#faad14', sub:'2 merchants aguardando repasse' },
      { label:'Média por merchant', value:fmt(140000), bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Ticket médio de repasse' },
      { label:'Próximo repasse agendado', value:'25/04/2026', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'2 merchants · R$ 1.054.390 a repassar' },
    ],
  }
  const currentKpis = KPI_BY_TAB[tab] || KPI_BY_TAB.calendario

  const activeFilters = [
    filterBandeira ? { key:'bandeira', label:`Bandeira: ${filterBandeira}` } : null,
    filterStatus   ? { key:'status',   label:`Status: ${filterStatus}` } : null,
  ].filter(Boolean) as Array<{ key: string; label: string }>

  const clearFilters = () => { setFilterBandeira(''); setFilterStatus(''); setSearch('') }

  type Parcela = typeof PARCELAS_DATA[0]
  type LoteGroup = { key: string; data: string; bandeira: string; rows: Parcela[]; bruto: number; comissao: number; antecipDescontada: number; liquido: number }

  const groupedLotes: LoteGroup[] = Object.values(
    filtered.reduce((acc: Record<string, LoteGroup>, r) => {
      const key = `${r.data}-${r.bandeira}`
      if (!acc[key]) acc[key] = { key, data:r.data, bandeira:r.bandeira, rows:[], bruto:0, comissao:0, antecipDescontada:0, liquido:0 }
      acc[key].rows.push(r)
      acc[key].bruto += r.valor
      acc[key].comissao += r.comissao
      acc[key].antecipDescontada += r.antecipDescontada
      acc[key].liquido += r.liquido
      return acc
    }, {})
  )

  const toggleLote = (key: string) => setExpandedLotes(p => ({...p,[key]:!p[key]}))

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader
        title="Agenda de Recebíveis"
        breadcrumb="Sub-adquirente / Agenda"
        onBack={() => {}}
        tabs={AGENDA_TABS}
        activeTab={tab}
        onTabChange={(k) => setAgendaTab(k as typeof agendaTab)}
      />

      {/* KPI cards */}
      <div style={{ padding:'16px 24px 0', display:'flex', gap:16 }}>
        {currentKpis.map((k,i) => (
          <div key={i} style={{ flex:1, background:k.bg, border:`1px solid ${k.border}`, borderRadius:2, padding:'14px 18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontSize:12, color:'rgba(0,0,0,0.65)', fontWeight:500 }}>{k.label}</span>
              {k.badge && <span style={{ fontSize:10, background:'#fff7e6', color:'#fa8c16', border:'1px solid #ffd591', borderRadius:2, padding:'0 5px', fontWeight:600 }}>{k.badge}</span>}
            </div>
            <div style={{ fontSize:20, fontWeight:700, color:k.color, marginBottom:4 }}>{k.value}</div>
            <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Formula bar */}
      {['calendario','detalhada','lote'].includes(tab) && (
        <div style={{ padding:'8px 24px', display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(0,0,0,0.45)' }}>
          <span style={{ fontWeight:500, color:'rgba(0,0,0,0.65)' }}>Fórmula:</span>
          {[{l:'Total Bruto',c:'#1890FF'},{op:'−'},{l:'Antecipação Tomada',c:'#fa8c16'},{op:'−'},{l:'Deduções & Custos',c:'#ff4d4f'},{op:'='},{l:'Líquido a Receber',c:'#52c41a'}].map((f,i) =>
            'op' in f
              ? <span key={i} style={{ color:'rgba(0,0,0,0.35)' }}>{(f as {op:string}).op}</span>
              : <span key={i} style={{ color:(f as {l:string;c:string}).c, fontWeight:500 }}>{(f as {l:string}).l}</span>
          )}
        </div>
      )}

      {/* ── CALENDÁRIO TAB ── */}
      {tab==='calendario' && (
        <div style={{ padding:24, display:'flex', gap:24, flex:1 }}>
          {/* ── Painel esquerdo: calendário — white card com divider após header ── */}
          <div style={{ flex:1, background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, display:'flex', flexDirection:'column' }}>
            {/* Header: mês + toggle de visão */}
            <div style={{ padding:'16px 21px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #f0f0f0' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button style={{ border:'none', background:'none', cursor:'pointer', color:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', padding:'4px 6px' }}><Icon name="chevronLeft" size={16} /></button>
                <span style={{ fontSize:16, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>{MONTHS[calMonth]} {calYear}</span>
                <button style={{ border:'none', background:'none', cursor:'pointer', color:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', padding:'4px 6px' }}><Icon name="chevronRight" size={16} /></button>
              </div>
              <div style={{ display:'flex', background:'#f5f5f5', borderRadius:4, padding:2, gap:1 }}>
                {([
                  ['bruto','Valores brutos'],
                  ['liquido','Valores líquidos'],
                ] as const).map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => { setCalView(k); if (k !== 'bruto') setCalBrutoSub('consolidado') }}
                    style={{ border:'none', borderRadius:3, padding:'6px 14px', fontSize:12, cursor:'pointer', background:calView===k?'#fff':'transparent', color:calView===k?'#1890FF':'rgba(0,0,0,0.55)', fontWeight:calView===k?600:400, boxShadow:calView===k?'0 1px 3px rgba(0,0,0,0.12)':undefined, transition:'all 0.15s', whiteSpace:'nowrap' }}
                  >{l}</button>
                ))}
              </div>
            </div>

            {/* Body: pills + grid + legenda */}
            <div style={{ padding:'16px 21px', display:'flex', flexDirection:'column', gap:16 }}>
              {calView === 'bruto' && (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:11, color:'rgba(0,0,0,0.35)', fontWeight:500, whiteSpace:'nowrap' }}>Quebrar por:</span>
                  <button
                    onClick={()=>{ setCalBrutoSub('consolidado'); setSelectedAdqs([]) }}
                    style={{ border:`1px solid ${calBrutoSub==='consolidado'?'#1890FF':'#d9d9d9'}`, borderRadius:12, padding:'3px 12px', fontSize:12, cursor:'pointer', background:calBrutoSub==='consolidado'?'#1890FF':'#fff', color:calBrutoSub==='consolidado'?'#fff':'rgba(0,0,0,0.55)', fontWeight:calBrutoSub==='consolidado'?500:400, transition:'all 0.15s' }}>
                    Todos
                  </button>
                  {ALL_ADQS.map(a => {
                    const isActive = calBrutoSub === 'adquirente' && (selectedAdqs.length === 0 || selectedAdqs.includes(a))
                    const isSelected = calBrutoSub === 'adquirente' && selectedAdqs.includes(a)
                    return (
                      <button key={a}
                        onClick={()=>{
                          setCalBrutoSub('adquirente')
                          setSelectedAdqs(prev =>
                            prev.includes(a)
                              ? prev.filter(x => x !== a)
                              : [...prev, a]
                          )
                        }}
                        style={{ border:`1px solid ${isSelected?'#1890FF':calBrutoSub==='adquirente'&&selectedAdqs.length===0?'#91d5ff':'#d9d9d9'}`, borderRadius:12, padding:'3px 12px', fontSize:12, cursor:'pointer', background:isSelected?'#e6f7ff':calBrutoSub==='adquirente'&&selectedAdqs.length===0?'#f0f7ff':'#fff', color:isSelected||isActive?'#1890FF':'rgba(0,0,0,0.55)', fontWeight:isSelected?500:400, transition:'all 0.15s' }}>
                        {a}
                      </button>
                    )
                  })}
                  {calBrutoSub === 'adquirente' && selectedAdqs.length > 0 && (
                    <button onClick={()=>setSelectedAdqs([])} style={{ border:'none', background:'none', fontSize:11, color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:'2px 4px', textDecoration:'underline' }}>
                      limpar
                    </button>
                  )}
                </div>
              )}

              {/* Grid do calendário */}
              <div style={{ border:'1px solid rgba(0,0,0,0.06)', borderRadius:2 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:'1px solid #f0f0f0' }}>
                  {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
                    <div key={d} style={{ padding:'10px 0', textAlign:'center', fontSize:12, fontWeight:500, color:'rgba(0,0,0,0.45)' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
                  {Array.from({length: firstDow}).map((_,i) => <div key={`empty-${i}`} style={{ borderRight:'1px solid #f0f0f0', borderBottom:'1px solid #f0f0f0', minHeight:72 }} />)}
                  {CALENDAR_DAYS.map(d => {
                    const isSelected = d.day === selectedDay
                    const isToday = d.day === 22
                    const effectiveView = isPerAdquirente ? 'adquirente' : calView
                    const dayVal = (CAL_VALUES[effectiveView] || CAL_VALUES.bruto)[d.day - 1] || 0
                    const adqLabel = isPerAdquirente ? CAL_ADQUIRENTES[d.day - 1] : null
                    const col = dayVal === 0 ? 'rgba(0,0,0,0.25)' : d.status==='recebido' ? '#52c41a' : d.status==='antecipado' ? '#fa8c16' : '#1890FF'
                    return (
                      <div key={d.day} onClick={()=>setSelectedDay(d.day)}
                        style={{ borderRight:'1px solid #f0f0f0', borderBottom:'1px solid #f0f0f0', minHeight:72, padding:'8px 10px', cursor:'pointer', background:isSelected?'#e6f7ff':isToday?'#f0f7ff':'#fff', position:'relative', transition:'background 0.1s' }}
                        onMouseEnter={e=>{ if(!isSelected) (e.currentTarget as HTMLElement).style.background='#fafafa' }}
                        onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background=isSelected?'#e6f7ff':isToday?'#f0f7ff':'#fff' }}>
                        <div style={{ fontSize:13, fontWeight:isToday?700:400, color:isToday?'#1890FF':'rgba(0,0,0,0.85)', marginBottom:2 }}>{d.day}</div>
                        {isPerAdquirente && adqLabel && adqLabel !== '—' ? (
                          <>
                            <div style={{ fontSize:10, color:'rgba(0,0,0,0.35)', marginBottom:2 }}>{adqLabel}</div>
                            <div style={{ fontSize:12, fontWeight:600, color:col }}>{dayVal>0?`R$ ${(dayVal/1000).toFixed(0)}k`:'R$ 0'}</div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize:10, color:'rgba(0,0,0,0.35)', marginBottom:2 }}>{d.past?'Recebido':'A Receber'}</div>
                            <div style={{ fontSize:12, fontWeight:600, color:col }}>{dayVal===0?'R$ 0':`R$ ${(dayVal/1000).toFixed(0)}k`}</div>
                          </>
                        )}
                        {isSelected && <div style={{ position:'absolute', top:4, right:6, width:6, height:6, borderRadius:'50%', background:'#1890FF' }} />}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legenda */}
              <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)', marginBottom:2 }}>Visão de caixa do sub no período</div>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.35)' }}>O calendário mostra o que entra no caixa, o que já foi antecipado e o que fica retido em custos ou garantia.</div>
                </div>
                <div style={{ display:'flex', gap:32 }}>
                  {[{l:'Previsto para crédito',v:'R$ 91,4 mil',c:'#52c41a'},{l:'Já antecipado',v:'R$ 60,0 mil',c:'#fa8c16'},{l:'Custos do dia',v:'R$ 30,0 mil',c:'#ff4d4f'}].map(s => (
                    <div key={s.l}>
                      <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{s.l}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Painel direito: detalhe do dia — white card com divider após título ── */}
          <div style={{ width:280, flexShrink:0 }}>
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, display:'flex', flexDirection:'column' }}>
              {/* Header: data + subtítulo */}
              <div style={{ padding:'16px 18px', borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ fontSize:16, fontWeight:600, color:'rgba(0,0,0,0.85)', marginBottom:2 }}>{selectedDay} de {MONTHS[calMonth]}</div>
                <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{selectedAdqs.length>0?`Filtrado: ${selectedAdqs.join(', ')}`:'Resumo consolidado do dia'}</div>
              </div>
              {/* Body */}
              <div style={{ padding:'16px 18px' }}>
                <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                  <div style={{ flex:1, background:'#f6ffed', border:'1px solid #b7eb8f', borderRadius:2, padding:'10px 12px' }}>
                    <div style={{ fontSize:10, color:'rgba(0,0,0,0.45)' }}>Crédito líquido do dia</div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#52c41a' }}>+R$ 91,4 mil</div>
                  </div>
                  <div style={{ flex:1, background:'#fffbe6', border:'1px solid #ffe58f', borderRadius:2, padding:'10px 12px' }}>
                    <div style={{ fontSize:10, color:'rgba(0,0,0,0.45)' }}>Compromisso futuro</div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fa8c16' }}>R$ 60,0 mil</div>
                  </div>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(0,0,0,0.65)', marginBottom:8 }}>Entradas previstas</div>
                {[
                  {l:<Tooltip text="Soma de todas as parcelas que vencem neste dia, provenientes dos adquirentes.">Parcelas a creditar</Tooltip>,v:'+R$ 191.400,00',c:'#52c41a'},
                  {l:<Tooltip text="Parcelas livres de antecipação — o valor que efetivamente entra na conta do sub-adquirente hoje.">Recebíveis livres do dia</Tooltip>,v:'+R$ 91.400,00',c:'#52c41a'},
                ].map((r,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f0f0f0', fontSize:12 }}>
                    <span style={{ color:'rgba(0,0,0,0.65)' }}>{r.l}</span>
                    <span style={{ color:r.c, fontWeight:600 }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(0,0,0,0.65)', margin:'12px 0 8px' }}>Compromissos e retenções</div>
                {[
                  {l:<Tooltip text="Valor antecipado junto ao adquirente que será descontado deste crédito.">Valor já antecipado</Tooltip>,v:'-R$ 60.000,00',c:'#fa8c16'},
                  {l:<Tooltip text="MDR (Merchant Discount Rate): taxa percentual cobrada pelo adquirente por cada transação.">Taxas e MDR</Tooltip>,v:'-R$ 25.000,00',c:'#ff4d4f'},
                  {l:<Tooltip text="Gravame é uma retenção de garantia sobre os recebíveis futuros.">Gravame / garantia</Tooltip>,v:'-R$ 15.000,00',c:'#722ED1'},
                ].map((r,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f0f0f0', fontSize:12 }}>
                    <span style={{ color:'rgba(0,0,0,0.65)' }}>{r.l}</span>
                    <span style={{ color:r.c, fontWeight:600 }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ marginTop:12, padding:'10px 12px', background:'#f5f5f5', borderRadius:2 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'rgba(0,0,0,0.65)', marginBottom:4 }}>Leitura operacional</div>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)', lineHeight:'16px' }}>Parte do bruto deste dia não cai em conta porque já foi usada como antecipação e outra parte segue retida por custo e garantia.</div>
                </div>
                <div style={{ marginTop:12, padding:'10px 12px', background:'#f6ffed', border:'1px solid #b7eb8f', borderRadius:2 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'#389e0d', marginBottom:4 }}>Próximo evento</div>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.55)', lineHeight:'16px' }}>Em {selectedDay+1}/Abr, mais R$ 48 mil ficam elegíveis para crédito, sem nova retenção de gravame.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VISÃO DETALHADA TAB ── */}
      {tab==='detalhada' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {(() => {
            const parcelaColumns: ColumnType<Parcela>[] = [
              {
                title: 'Data de pagamento', dataIndex: 'data', key: 'data', width: 140,
                render: v => <span style={{ color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>{v}<br/><span style={{ fontSize:11, color:'rgba(0,0,0,0.35)' }}>10:00</span></span>,
              },
              {
                title: 'NSU / Ref.', dataIndex: 'nsu', key: 'nsu', width: 130,
                render: (v, r) => (
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontFamily:'Roboto Mono', fontSize:12, color:'rgba(0,0,0,0.65)' }}>
                    {r.antecipado && <span style={{ width:7, height:7, borderRadius:'50%', background:'#fa8c16', display:'inline-block', flexShrink:0 }} />}
                    {v}
                  </span>
                ),
              },
              {
                title: 'Bandeira', dataIndex: 'bandeira', key: 'bandeira', width: 110,
                render: v => <BrandLogo brand={v} size={20} showLabel />,
              },
              {
                title: 'Lançamento', dataIndex: 'lancamento', key: 'lancamento',
                render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{v}</span>,
              },
              {
                title: 'Origem', dataIndex: 'parcela', key: 'parcela', width: 100,
                render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>Parcela {v}</span>,
              },
              {
                title: 'Valor da parcela', dataIndex: 'valor', key: 'valor', width: 140,
                render: v => <span style={{ color:'rgba(0,0,0,0.85)', fontWeight:500 }}>{fmt(v)}</span>,
              },
              {
                title: 'Valor EC', dataIndex: 'comissao', key: 'comissao', width: 120,
                render: v => <span style={{ color:'#f5222d', fontWeight:500 }}>{fmt(v)}</span>,
              },
              {
                title: 'Valor líquido', dataIndex: 'liquido', key: 'liquido', width: 130,
                render: (v, r) => <span style={{ color: r.antecipado ? '#fa8c16' : '#1890ff', fontWeight:600 }}>{fmt(v)}</span>,
              },
              {
                title: 'Status', dataIndex: 'status', key: 'status', width: 120,
                render: v => <AgendaTag status={v} />,
              },
              {
                title: '', key: 'actions', width: 60,
                render: () => <button title="Ver detalhes" style={{ border:'none', background:'none', color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:4, display:'flex', alignItems:'center', borderRadius:4 }}><Icon name="eye" size={15} color="rgba(0,0,0,0.35)" /></button>,
              },
            ]

            const toggleExtra = (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:13, color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>Visualizar por parcela</span>
                <div onClick={()=>setAgrupado(!agrupado)} style={{ width:40, height:22, borderRadius:11, background:agrupado?'#1890FF':'#d9d9d9', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
                  <div style={{ position:'absolute', top:3, left:agrupado?20:3, width:16, height:16, borderRadius:'50%', background:'#fff', boxShadow:'0 2px 4px rgba(0,35,11,0.2)', transition:'left 0.2s' }} />
                </div>
              </div>
            )

            const bFilter = filterBandeira ? [filterBandeira] : bandeiras
            const sFilter = filterStatus ? [filterStatus] : ['Pago','Pendente','Antecipado','Chargeback','Liquidado']

            return agrupado ? (
              /* ── Visão agrupada por lote ── */
              <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, boxShadow:'0 2px 0 rgba(0,0,0,0.02)' }}>
                <div style={{ padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:16, fontWeight:600, color:'rgba(0,0,0,0.85)', fontFamily:'Roboto, sans-serif' }}>Seus recebíveis</span>
                  {toggleExtra}
                </div>
                <div style={{ overflowX:'auto', padding:'0 21px 21px' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                    <thead>
                      <tr style={{ background:'#fafafa' }}>
                        {['Data de Liquidação','Bandeira','Qtd Transações','Valor Bruto do Lote','Comissão Sub (EC)','Antecipação Descontada','Vlr. Líquido do Lote','Status do Lote'].map(h => (
                          <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:500, color:'rgba(0,0,0,0.85)', borderBottom:'1px solid #f0f0f0', whiteSpace:'nowrap', fontSize:12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {groupedLotes.map(lote => {
                        const isExp = expandedLotes[lote.key]
                        const allPago = lote.rows.every(r=>r.status==='Pago')
                        const loteStatus = lote.antecipDescontada > 0 ? 'Antecipado' : allPago ? 'Liquidado' : 'Pendente'
                        return [
                          <tr key={lote.key} style={{ borderBottom:'1px solid #f0f0f0', background:'#fafafa', cursor:'pointer' }}
                            onClick={()=>toggleLote(lote.key)}
                            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#f0f7ff'}
                            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#fafafa'}>
                            <td style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:6 }}>
                              <span style={{ color:'#1890FF', display:'flex', alignItems:'center' }}><Icon name={isExp ? 'chevronDown' : 'chevronRight'} size={12} /></span>
                              <span style={{ fontWeight:600, color:'#1890FF' }}>{lote.data}</span>
                            </td>
                            <td style={{ padding:'12px 14px' }}><BrandLogo brand={lote.bandeira} size={20} showLabel /></td>
                            <td style={{ padding:'12px 14px', color:'rgba(0,0,0,0.65)' }}>{lote.rows.length} transações</td>
                            <td style={{ padding:'12px 14px', fontWeight:600, color:'rgba(0,0,0,0.85)' }}>{fmt(lote.bruto)}</td>
                            <td style={{ padding:'12px 14px', color:'rgba(0,0,0,0.65)' }}>{fmt(lote.comissao)}</td>
                            <td style={{ padding:'12px 14px', color:lote.antecipDescontada>0?'#fa8c16':'rgba(0,0,0,0.25)' }}>{lote.antecipDescontada>0?fmt(lote.antecipDescontada):'—'}</td>
                            <td style={{ padding:'12px 14px', fontWeight:600, color:'#52c41a' }}>{fmt(lote.liquido)}</td>
                            <td style={{ padding:'12px 14px' }}><AgendaTag status={loteStatus} /></td>
                          </tr>,
                          ...(isExp ? [
                            ...lote.rows.map((r,i) => (
                              <tr key={`${lote.key}-${i}`} style={{ borderBottom:'1px solid #f0f0f0', background:'#fff' }}
                                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#fafafa'}
                                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#fff'}>
                                <td style={{ padding:'9px 14px 9px 36px', color:'rgba(0,0,0,0.45)', fontFamily:'Roboto Mono', fontSize:11 }}>{r.nsu}</td>
                                <td />
                                <td style={{ padding:'9px 14px', color:'rgba(0,0,0,0.65)' }}>{r.lancamento} {r.parcela}</td>
                                <td style={{ padding:'9px 14px', color:'rgba(0,0,0,0.85)' }}>{fmt(r.valor)}</td>
                                <td style={{ padding:'9px 14px', color:'rgba(0,0,0,0.55)' }}>{fmt(r.comissao)}</td>
                                <td style={{ padding:'9px 14px', color:r.antecipDescontada>0?'#fa8c16':'rgba(0,0,0,0.2)' }}>{r.antecipDescontada>0?fmt(r.antecipDescontada):'–'}</td>
                                <td style={{ padding:'9px 14px', fontWeight:500, color:r.antecipado?'#fa8c16':'#52c41a' }}>{fmt(r.liquido)}</td>
                                <td style={{ padding:'9px 14px' }}><AgendaTag status={r.status} /></td>
                              </tr>
                            )),
                            <tr key={`${lote.key}-subtotal`} style={{ background:'#e6f7ff', borderBottom:'1px solid #91d5ff' }}>
                              <td style={{ padding:'9px 14px', color:'#1890FF', fontWeight:600 }} colSpan={2}>Subtotal {lote.bandeira}:</td>
                              <td />
                              <td style={{ padding:'9px 14px', fontWeight:600, color:'#1890FF' }}>{fmt(lote.bruto)}</td>
                              <td style={{ padding:'9px 14px', fontWeight:600, color:'#1890FF' }}>{fmt(lote.comissao)}</td>
                              <td style={{ padding:'9px 14px', fontWeight:600, color:lote.antecipDescontada>0?'#fa8c16':'rgba(0,0,0,0.25)' }}>{lote.antecipDescontada>0?fmt(lote.antecipDescontada):'—'}</td>
                              <td style={{ padding:'9px 14px', fontWeight:600, color:'#1890FF' }}>{fmt(lote.liquido)}</td>
                              <td />
                            </tr>
                          ] : [])
                        ]
                      })}
                      <tr style={{ background:'#e6f7ff', borderTop:'2px solid #91d5ff' }}>
                        <td colSpan={2} style={{ padding:'12px 14px', fontWeight:700, color:'#1890FF', fontSize:13 }}>TOTAL GERAL</td>
                        <td />
                        <td style={{ padding:'12px 14px', fontWeight:700, color:'#1890FF' }}>{fmt(filtered.reduce((s,r)=>s+r.valor,0))}</td>
                        <td style={{ padding:'12px 14px', fontWeight:700, color:'#1890FF' }}>{fmt(filtered.reduce((s,r)=>s+r.comissao,0))}</td>
                        <td style={{ padding:'12px 14px', fontWeight:700, color:'#fa8c16' }}>{fmt(filtered.reduce((s,r)=>s+r.antecipDescontada,0))}</td>
                        <td style={{ padding:'12px 14px', fontWeight:700, color:'#52c41a' }}>{fmt(filtered.reduce((s,r)=>s+r.liquido,0))}</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <DataTable<Parcela>
                title="Seus recebíveis"
                titleExtra={toggleExtra}
                columns={parcelaColumns}
                dataSource={filtered}
                rowKey="nsu"
                searchPlaceholder="Pesquise o pagamento"
                searchValue={search}
                onSearch={setSearch}
                filters={[
                  {
                    label: 'Data de pagamento',
                    options: [...new Set(PARCELAS_DATA.map(r => r.data))].map(d => ({ label: d, value: d })),
                    value: [],
                    onChange: () => {},
                  },
                  {
                    label: 'Arranjo',
                    options: bandeiras.map(b => ({ label: b, value: b })),
                    value: bFilter,
                    onChange: v => setFilterBandeira(v.length === bandeiras.length || v.length === 0 ? '' : v[0]),
                  },
                  {
                    label: 'Lançamento',
                    options: ['Crédito à vista','Crédito parcelado','Débito'].map(l => ({ label: l, value: l })),
                    value: ['Crédito à vista','Crédito parcelado','Débito'],
                    onChange: () => {},
                  },
                  {
                    label: 'Status',
                    options: ['Pago','Pendente','Antecipado','Chargeback','Liquidado'].map(s => ({ label: s, value: s })),
                    value: sFilter,
                    onChange: v => setFilterStatus(v.length === 5 || v.length === 0 ? '' : v[0]),
                  },
                ]}
                onExport={() => {}}
                onAdvancedFilter={() => {}}
                pageSize={10}
              />
            )
          })()}

          {/* Legenda antecipações */}
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(0,0,0,0.45)', padding:'0 4px' }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#fa8c16', display:'inline-block', flexShrink:0 }} />
            Parcelas com ponto laranja foram antecipadas — o valor já foi creditado via Antecipação Tomada.
          </div>
        </div>
      )}


      {/* ── POR LOTE TAB ── */}
      {tab==='lote' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, padding:'12px 16px', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ position:'relative', display:'flex', alignItems:'center', flex:'1 1 220px', maxWidth:280 }}>
              <div style={{ position:'absolute', left:9, pointerEvents:'none' }}><Icon name="search" size={13} color="rgba(0,0,0,0.35)" /></div>
              <input placeholder="Buscar por adquirente, bandeira, lote..." style={{ width:'100%', border:'1px solid #d9d9d9', borderRadius:2, padding:'6px 10px 6px 28px', fontSize:12, outline:'none', fontFamily:'Roboto' }} />
            </div>
            <select style={{ border:'1px solid #d9d9d9', borderRadius:2, padding:'6px 28px 6px 10px', fontSize:12, outline:'none', fontFamily:'Roboto', cursor:'pointer', color:'rgba(0,0,0,0.65)' }}>
              <option>Adquirente ▾</option><option>Adiq</option><option>Rede</option><option>Cielo</option><option>Getnet</option>
            </select>
            <select style={{ border:'1px solid #d9d9d9', borderRadius:2, padding:'6px 28px 6px 10px', fontSize:12, outline:'none', fontFamily:'Roboto', cursor:'pointer', color:'rgba(0,0,0,0.65)' }}>
              <option>Bandeira ▾</option><option>Visa</option><option>Mastercard</option><option>Elo</option>
            </select>
            <button style={{ border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'5px 12px', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5, color:'rgba(0,0,0,0.65)', marginLeft:'auto' }}>
              <Icon name="download" size={13} color="rgba(0,0,0,0.45)" /> Exportar
            </button>
          </div>
          {[
            { adquirente:'Adiq',   bandeira:'Visa',       lote:'L-001', qtd:412, bruto:198400, comissao:5952,  antecip:0,     liquido:192448, data:'10/04/2026', status:'Liquidado' },
            { adquirente:'Adiq',   bandeira:'Mastercard', lote:'L-002', qtd:287, bruto:134200, comissao:4026,  antecip:60000, liquido:70174,  data:'10/04/2026', status:'Antecipado' },
            { adquirente:'Rede',   bandeira:'Visa',       lote:'L-003', qtd:198, bruto:87500,  comissao:2625,  antecip:0,     liquido:84875,  data:'11/04/2026', status:'Liquidado' },
            { adquirente:'Rede',   bandeira:'Elo',        lote:'L-004', qtd:156, bruto:72000,  comissao:2160,  antecip:30000, liquido:39840,  data:'11/04/2026', status:'Antecipado' },
            { adquirente:'Cielo',  bandeira:'Mastercard', lote:'L-005', qtd:334, bruto:156700, comissao:4701,  antecip:0,     liquido:151999, data:'12/04/2026', status:'Pendente' },
            { adquirente:'Cielo',  bandeira:'Visa',       lote:'L-006', qtd:221, bruto:103400, comissao:3102,  antecip:50000, liquido:50298,  data:'12/04/2026', status:'Antecipado' },
            { adquirente:'Getnet', bandeira:'Visa',       lote:'L-007', qtd:178, bruto:83200,  comissao:2496,  antecip:0,     liquido:80704,  data:'13/04/2026', status:'Pendente' },
          ].map((lote, i) => (
            <div key={i} style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:16, borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:6, height:24, borderRadius:2, background: lote.status==='Liquidado'?'#52c41a':lote.status==='Antecipado'?'#fa8c16':'#faad14' }} />
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <BrandLogo brand={lote.adquirente} />
                      <span style={{ color:'rgba(0,0,0,0.35)', fontSize:12 }}>—</span>
                      <BrandLogo brand={lote.bandeira} size={20} showLabel />
                    </div>
                    <div style={{ fontSize:11, color:'rgba(0,0,0,0.35)', fontFamily:'Roboto Mono' }}>Lote {lote.lote} · {lote.data}</div>
                  </div>
                </div>
                <div style={{ flex:1, display:'flex', gap:32, justifyContent:'flex-end', alignItems:'center' }}>
                  {[
                    { l:'Qtd transações', v:lote.qtd.toLocaleString('pt-BR') },
                    { l:'Bruto', v:fmt(lote.bruto), c:'rgba(0,0,0,0.85)' },
                    { l:'Comissão Sub', v:fmt(lote.comissao), c:'#ff4d4f' },
                    { l:'Antecipação', v:lote.antecip>0?fmt(lote.antecip):'—', c:lote.antecip>0?'#fa8c16':'rgba(0,0,0,0.25)' },
                    { l:'Líquido', v:fmt(lote.liquido), c:'#52c41a' },
                  ].map(s=>(
                    <div key={s.l} style={{ textAlign:'right' }}>
                      <div style={{ fontSize:11, color:'rgba(0,0,0,0.35)' }}>{s.l}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:s.c||'rgba(0,0,0,0.65)' }}>{s.v}</div>
                    </div>
                  ))}
                  <AgendaTag status={lote.status} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, padding:'12px 20px', display:'flex', gap:32, justifyContent:'flex-end', alignItems:'center' }}>
            <span style={{ fontSize:13, fontWeight:600, color:'#1890FF', flex:1 }}>TOTAL — 7 lotes · 1.786 transações</span>
            {[{l:'Total Bruto', v:fmt(835400), c:'rgba(0,0,0,0.85)'},{l:'Total Comissão', v:fmt(25062), c:'#ff4d4f'},{l:'Total Antecipado', v:fmt(140000), c:'#fa8c16'},{l:'Total Líquido', v:fmt(670338), c:'#52c41a'}].map(s=>(
              <div key={s.l} style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{s.l}</div>
                <div style={{ fontSize:14, fontWeight:700, color:s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ANTECIPAÇÕES TAB ── */}
      {tab==='antecipacoes' && (()=>{
        const ANTECIP_DATA = [
          { data:'02/04/2026', adq:'Adiq',   valor:60000, taxa:'1,99%', custo:1194, prazo:'30d', saldo:60000, status:'Em aberto' },
          { data:'05/04/2026', adq:'Rede',   valor:30000, taxa:'2,10%', custo:630,  prazo:'30d', saldo:30000, status:'Em aberto' },
          { data:'08/04/2026', adq:'Cielo',  valor:50000, taxa:'1,95%', custo:975,  prazo:'30d', saldo:50000, status:'Em aberto' },
          { data:'15/03/2026', adq:'Adiq',   valor:40000, taxa:'1,99%', custo:796,  prazo:'30d', saldo:0,     status:'Quitado' },
          { data:'10/03/2026', adq:'Getnet', valor:25000, taxa:'2,05%', custo:512,  prazo:'30d', saldo:0,     status:'Quitado' },
        ]
        type ARow = typeof ANTECIP_DATA[0]
        const cols: ColumnType<ARow>[] = [
          { title:'Data', dataIndex:'data', key:'data', width:110, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
          { title:'Adquirente', dataIndex:'adq', key:'adq', render: v => <BrandLogo brand={v} /> },
          { title:'Valor antecipado', dataIndex:'valor', key:'valor', render: v => <span style={{ fontWeight:600, color:'#fa8c16' }}>{fmt(v)}</span> },
          { title:'Taxa (a.m.)', dataIndex:'taxa', key:'taxa', width:90, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
          { title:'Custo', dataIndex:'custo', key:'custo', render: v => <span style={{ color:'#ff4d4f' }}>{fmt(v)}</span> },
          { title:'Prazo', dataIndex:'prazo', key:'prazo', width:70, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
          { title:'Saldo restante', dataIndex:'saldo', key:'saldo', render: v => <span style={{ fontWeight:600, color:v>0?'#fa8c16':'rgba(0,0,0,0.25)' }}>{v>0?fmt(v):'—'}</span> },
          { title:'Status', dataIndex:'status', key:'status', width:100, render: v => <AgendaTag status={v==='Em aberto'?'Pendente':'Pago'} /> },
        ]
        return (
          <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'#fffbe6', border:'1px solid #ffe58f', borderRadius:2, padding:'10px 16px', display:'flex', gap:10, alignItems:'flex-start' }}>
              <Icon name="info" size={15} color="#faad14" />
              <div>
                <span style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>Liquidação centralizada ativa: </span>
                <span style={{ fontSize:13, color:'rgba(0,0,0,0.65)' }}>os valores antecipados serão descontados automaticamente nos próximos créditos do adquirente. Saldo restante: <strong>R$ 140.000,00</strong></span>
              </div>
            </div>
            <DataTable<ARow>
              title="Operações de antecipação"
              titleExtra={<button style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, padding:'4px 14px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><Icon name="plus" size={14} color="#fff" /> Nova antecipação</button>}
              columns={cols}
              dataSource={ANTECIP_DATA}
              rowKey={(_,i)=>String(i)}
            />
          </div>
        )
      })()}

      {/* ── FUNDING / LIQUIDAÇÃO TAB ── */}
      {tab==='funding' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', gap:16 }}>
            <div style={{ flex:2, background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, padding:'20px 24px' }}>
              <div style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.85)', marginBottom:16 }}>DRE de Caixa — Abril 2026</div>
              {[
                { label:'(+) Total bruto das vendas',                   v:fmt(1240500), indent:0, weight:500, color:'rgba(0,0,0,0.85)' },
                { label:'(−) Antecipações tomadas (saldo devedor)',      v:`(${fmt(140000)})`, indent:1, color:'#fa8c16' },
                { label:'(−) MDR e tarifas (custo de processamento)',    v:`(${fmt(29772)})`, indent:1, color:'#ff4d4f' },
                { label:'(−) Chargebacks e cancelamentos',               v:`(${fmt(12400)})`, indent:1, color:'#ff4d4f' },
                { label:'(=) Líquido disponível para crédito',           v:fmt(1058328), indent:0, weight:700, color:'#52c41a', border:true },
                { label:'(−) Pagamentos a merchants realizados',         v:`(${fmt(980000)})`, indent:1, color:'rgba(0,0,0,0.65)' },
                { label:'(=) Saldo do sub-adquirente (float)',           v:fmt(78328), indent:0, weight:700, color:'#1890FF', border:true },
              ].map((r,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:`${r.border?'10px':'7px'} 0 ${r.border?'10px':'7px'} ${(r.indent||0)*16}px`, borderTop:r.border?'1px solid #f0f0f0':'none', borderBottom:r.border?'2px solid #f0f0f0':'none' }}>
                  <span style={{ fontSize:13, color:r.color||'rgba(0,0,0,0.65)', fontWeight:r.weight||400 }}>{r.label}</span>
                  <span style={{ fontSize:13, fontWeight:r.weight||500, color:r.color||'rgba(0,0,0,0.85)', whiteSpace:'nowrap' }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, padding:'16px 20px' }}>
                <div style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', marginBottom:12 }}>Liquidações por adquirente</div>
                {[
                  { adq:'Adiq',   pct:42, v:fmt(521010), c:'#1890FF' },
                  { adq:'Rede',   pct:28, v:fmt(347340), c:'#52c41a' },
                  { adq:'Cielo',  pct:20, v:fmt(248100), c:'#fa8c16' },
                  { adq:'Getnet', pct:10, v:fmt(124050), c:'#722ED1' },
                ].map(a=>(
                  <div key={a.adq} style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                      <BrandLogo brand={a.adq} />
                      <span style={{ fontSize:12, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{a.v}</span>
                    </div>
                    <div style={{ height:6, background:'#f0f0f0', borderRadius:3 }}>
                      <div style={{ height:'100%', width:`${a.pct}%`, background:a.c, borderRadius:3 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, padding:'16px 20px' }}>
                <div style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', marginBottom:12 }}>Funding previsto (próx. 7 dias)</div>
                {['24/04','25/04','26/04','27/04','28/04'].map((d,i)=>{
                  const val = [82000,54000,128000,43000,95000][i]
                  return (
                    <div key={d} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:12, color:'rgba(0,0,0,0.45)', width:40 }}>{d}</span>
                      <div style={{ flex:1, height:14, background:'#f0f0f0', borderRadius:2 }}>
                        <div style={{ height:'100%', width:`${(val/128000)*100}%`, background:'#1890FF', borderRadius:2, opacity:0.7 }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:500, color:'rgba(0,0,0,0.85)', width:80, textAlign:'right' }}>R$ {(val/1000).toFixed(0)}k</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {(()=>{
            const FUNDING_EVENTOS = [
              { data:'10/04', adq:'Adiq',   tipo:'Crédito normal',    bruto:198400, desc:5952,  cred:192448, conta:'Conta 0001-7', status:'Liquidado' },
              { data:'10/04', adq:'Adiq',   tipo:'Desconto antecip.', bruto:134200, desc:64026, cred:70174,  conta:'Conta 0001-7', status:'Liquidado' },
              { data:'11/04', adq:'Rede',   tipo:'Crédito normal',    bruto:87500,  desc:2625,  cred:84875,  conta:'Conta 0001-7', status:'Liquidado' },
              { data:'11/04', adq:'Rede',   tipo:'Desconto antecip.', bruto:72000,  desc:32160, cred:39840,  conta:'Conta 0001-7', status:'Liquidado' },
              { data:'12/04', adq:'Cielo',  tipo:'Crédito normal',    bruto:156700, desc:4701,  cred:151999, conta:'Conta 0001-7', status:'Pendente' },
              { data:'13/04', adq:'Getnet', tipo:'Crédito normal',    bruto:83200,  desc:2496,  cred:80704,  conta:'Conta 0001-7', status:'Pendente' },
            ]
            type FRow = typeof FUNDING_EVENTOS[0]
            const cols: ColumnType<FRow>[] = [
              { title:'Data', dataIndex:'data', key:'data', width:70, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}/2026</span> },
              { title:'Adquirente', dataIndex:'adq', key:'adq', render: v => <BrandLogo brand={v} /> },
              { title:'Tipo', dataIndex:'tipo', key:'tipo', render: v => <span style={{ fontSize:11, background:v.includes('Desconto')?'#fff7e6':'#e6f7ff', color:v.includes('Desconto')?'#fa8c16':'#1890FF', border:`1px solid ${v.includes('Desconto')?'#ffd591':'#91d5ff'}`, borderRadius:2, padding:'1px 6px' }}>{v}</span> },
              { title:'Bruto do lote', dataIndex:'bruto', key:'bruto', render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{fmt(v)}</span> },
              { title:'Descontos', dataIndex:'desc', key:'desc', render: v => <span style={{ color:'#ff4d4f' }}>{fmt(v)}</span> },
              { title:'Crédito líquido', dataIndex:'cred', key:'cred', render: v => <span style={{ fontWeight:600, color:'#52c41a' }}>{fmt(v)}</span> },
              { title:'Conta destino', dataIndex:'conta', key:'conta', render: v => <span style={{ color:'rgba(0,0,0,0.45)', fontFamily:'Roboto Mono', fontSize:11 }}>{v}</span> },
              { title:'Status', dataIndex:'status', key:'status', width:90, render: v => <AgendaTag status={v==='Liquidado'?'Pago':'Pendente'} /> },
            ]
            return (
              <DataTable<FRow>
                title="Eventos de liquidação — Abril 2026"
                columns={cols}
                dataSource={FUNDING_EVENTOS}
                rowKey={(_,i)=>String(i)}
              />
            )
          })()}
        </div>
      )}

      {/* ── PAGAMENTOS TAB ── */}
      {tab==='pagamentos' && (()=>{
        const PAGAMENTOS_DATA = [
          { name:'Mercado Livre',   cnpj:'03.007.331/0001-41', data:'10/04/2026', bruto:3450200, taxa:103506, rep:3346694, conta:'AG 0001 / CC 12345-6', status:'Pago' },
          { name:'Amazon Brasil',   cnpj:'15.436.940/0001-03', data:'10/04/2026', bruto:2180700, taxa:65421,  rep:2115279, conta:'AG 0001 / CC 23456-7', status:'Pago' },
          { name:'Americanas S.A.', cnpj:'00.776.574/0001-56', data:'11/04/2026', bruto:1240500, taxa:37215,  rep:1203285, conta:'AG 0001 / CC 34567-8', status:'Pago' },
          { name:'Magazine Luiza',  cnpj:'47.960.950/0001-21', data:'12/04/2026', bruto:987200,  taxa:29616,  rep:957584,  conta:'AG 0001 / CC 45678-9', status:'Pago' },
          { name:'iFood Ltda',      cnpj:'14.380.200/0001-21', data:'25/04/2026', bruto:654900,  taxa:19647,  rep:635253,  conta:'AG 0002 / CC 56789-0', status:'Pendente' },
          { name:'Shopee Brasil',   cnpj:'35.060.991/0001-56', data:'25/04/2026', bruto:432100,  taxa:12963,  rep:419137,  conta:'AG 0002 / CC 67890-1', status:'Pendente' },
          { name:'Rappi Brasil',    cnpj:'28.665.021/0001-89', data:'13/04/2026', bruto:765400,  taxa:22962,  rep:742438,  conta:'AG 0001 / CC 78901-2', status:'Pago' },
        ]
        type PRow = typeof PAGAMENTOS_DATA[0]
        const cols: ColumnType<PRow>[] = [
          { title:'Merchant', dataIndex:'name', key:'name', render: v => <span style={{ fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{v}</span> },
          { title:'CNPJ', dataIndex:'cnpj', key:'cnpj', render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.45)' }}>{v}</span> },
          { title:'Data repasse', dataIndex:'data', key:'data', width:110, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
          { title:'Bruto vendas', dataIndex:'bruto', key:'bruto', render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{fmt(v)}</span> },
          { title:'Taxas retidas', dataIndex:'taxa', key:'taxa', render: v => <span style={{ color:'#ff4d4f' }}>{fmt(v)}</span> },
          { title:'Valor repassado', dataIndex:'rep', key:'rep', render: v => <span style={{ fontWeight:600, color:'#52c41a' }}>{fmt(v)}</span> },
          { title:'Conta destino', dataIndex:'conta', key:'conta', render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.45)' }}>{v}</span> },
          { title:'Status', dataIndex:'status', key:'status', width:90, render: v => <AgendaTag status={v} /> },
        ]
        return (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          <DataTable<PRow>
            title="Repasses a merchants — Abril 2026"
            titleExtra={<button style={{ border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'4px 14px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:'rgba(0,0,0,0.85)' }}><Icon name="download" size={13} color="rgba(0,0,0,0.45)" /> Exportar</button>}
            columns={cols}
            dataSource={PAGAMENTOS_DATA}
            rowKey={(_,i)=>String(i)}
          />
        </div>
        )
      })()}
    </div>
  )
}
