'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import BrandLogo from '@/components/shared/BrandLogo'
import { useNavStore } from '@/store/nav.store'
import DataTable, { type ColumnType, PERIOD_OPTIONS } from '@/components/ui/DataTable'
import Tag from '@/components/shared/Tag'

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const PARCELAS_DATA = [
  // ── Americanas / Adiq / Visa ──────────────────────────────────────────────
  { data:'05/04/2026', nsu:'183726401', adq:'Adiq',   ec:'Americanas S.A.', bandeira:'Visa',   lancamento:'Crédito à vista',   parcela:'1/1',  valor:450.00,  comissao:9.90,  antecipDescontada:0,       liquido:440.10,  antecipado:false, status:'Pago'       },
  // Venda 6x — parcelas 2 e 3 antecipadas (operação R$ 2.166,65)
  { data:'05/04/2026', nsu:'293847562', adq:'Adiq',   ec:'Americanas S.A.', bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'2/6',  valor:433.33,  comissao:12.57, antecipDescontada:2166.65, liquido:420.76,  antecipado:true,  status:'Antecipado' },
  { data:'10/04/2026', nsu:'293847562', adq:'Adiq',   ec:'Americanas S.A.', bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'3/6',  valor:433.33,  comissao:12.57, antecipDescontada:2166.65, liquido:420.76,  antecipado:true,  status:'Antecipado' },
  // ── Amazon / Rede / Visa ──────────────────────────────────────────────────
  // Notebook 12x — parcelas 4 e 5 antecipadas (operação R$ 4.050,00; MDR 7–12x)
  { data:'05/04/2026', nsu:'374958673', adq:'Rede',   ec:'Amazon Brasil',   bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'4/12', valor:450.00,  comissao:15.30, antecipDescontada:4050.00, liquido:434.70,  antecipado:true,  status:'Antecipado' },
  { data:'09/04/2026', nsu:'374958673', adq:'Rede',   ec:'Amazon Brasil',   bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'5/12', valor:450.00,  comissao:15.30, antecipDescontada:4050.00, liquido:434.70,  antecipado:true,  status:'Antecipado' },
  // ── Rappi / Adiq / Elo ────────────────────────────────────────────────────
  { data:'07/04/2026', nsu:'456071829', adq:'Adiq',   ec:'Rappi Brasil',    bandeira:'Elo',    lancamento:'Débito',            parcela:'1/1',  valor:89.90,   comissao:1.48,  antecipDescontada:0,       liquido:88.42,   antecipado:false, status:'Pago'       },
  // ── Magazine Luiza / Rede / Master ────────────────────────────────────────
  // Geladeira 6x — parcela 3 paga; 4 e 5 antecipadas (operação R$ 1.197,00)
  { data:'07/04/2026', nsu:'567182930', adq:'Rede',   ec:'Magazine Luiza',  bandeira:'Master', lancamento:'Crédito parcelado', parcela:'3/6',  valor:399.00,  comissao:11.77, antecipDescontada:0,       liquido:387.23,  antecipado:false, status:'Pago'       },
  { data:'13/04/2026', nsu:'567182930', adq:'Rede',   ec:'Magazine Luiza',  bandeira:'Master', lancamento:'Crédito parcelado', parcela:'4/6',  valor:399.00,  comissao:11.77, antecipDescontada:1197.00, liquido:387.23,  antecipado:true,  status:'Antecipado' },
  { data:'18/04/2026', nsu:'567182930', adq:'Rede',   ec:'Magazine Luiza',  bandeira:'Master', lancamento:'Crédito parcelado', parcela:'5/6',  valor:399.00,  comissao:11.77, antecipDescontada:1197.00, liquido:387.23,  antecipado:true,  status:'Antecipado' },
  // ── Shopee / Rede / Master ────────────────────────────────────────────────
  { data:'08/04/2026', nsu:'678293041', adq:'Rede',   ec:'Shopee Brasil',   bandeira:'Master', lancamento:'Crédito à vista',   parcela:'1/1',  valor:1200.00, comissao:27.00, antecipDescontada:0,       liquido:1173.00, antecipado:false, status:'Pago'       },
  // iPhone 12x — parcela 7 com chargeback em disputa
  { data:'09/04/2026', nsu:'789304152', adq:'Rede',   ec:'Shopee Brasil',   bandeira:'Master', lancamento:'Crédito parcelado', parcela:'7/12', valor:399.17,  comissao:13.97, antecipDescontada:0,       liquido:385.20,  antecipado:false, status:'Chargeback' },
  // ── Mercado Livre / Cielo / Elo ───────────────────────────────────────────
  // Smart TV 4x — parcela 1 paga; 2 e 3 antecipadas (operação R$ 1.874,25)
  { data:'08/04/2026', nsu:'890415263', adq:'Cielo',  ec:'Mercado Livre',   bandeira:'Elo',    lancamento:'Crédito parcelado', parcela:'1/4',  valor:624.75,  comissao:19.37, antecipDescontada:0,       liquido:605.38,  antecipado:false, status:'Pago'       },
  { data:'12/04/2026', nsu:'890415263', adq:'Cielo',  ec:'Mercado Livre',   bandeira:'Elo',    lancamento:'Crédito parcelado', parcela:'2/4',  valor:624.75,  comissao:19.37, antecipDescontada:1874.25, liquido:605.38,  antecipado:true,  status:'Antecipado' },
  { data:'15/04/2026', nsu:'890415263', adq:'Cielo',  ec:'Mercado Livre',   bandeira:'Elo',    lancamento:'Crédito parcelado', parcela:'3/4',  valor:624.75,  comissao:19.37, antecipDescontada:1874.25, liquido:605.38,  antecipado:true,  status:'Antecipado' },
  // ── iFood / Cielo / Elo ───────────────────────────────────────────────────
  { data:'08/04/2026', nsu:'901526374', adq:'Cielo',  ec:'iFood Ltda',      bandeira:'Elo',    lancamento:'Débito',            parcela:'1/1',  valor:230.00,  comissao:3.80,  antecipDescontada:0,       liquido:226.20,  antecipado:false, status:'Pago'       },
  // Ar-cond 12x — parcela 8 pendente; 9 antecipada (operação R$ 833,00; MDR 7–12x)
  { data:'11/04/2026', nsu:'102637485', adq:'Cielo',  ec:'Americanas S.A.', bandeira:'Elo',    lancamento:'Crédito parcelado', parcela:'8/12', valor:208.25,  comissao:7.71,  antecipDescontada:0,       liquido:200.54,  antecipado:false, status:'Pendente'   },
  { data:'14/04/2026', nsu:'102637485', adq:'Cielo',  ec:'Americanas S.A.', bandeira:'Elo',    lancamento:'Crédito parcelado', parcela:'9/12', valor:208.25,  comissao:7.71,  antecipDescontada:833.00,  liquido:200.54,  antecipado:true,  status:'Antecipado' },
  // ── Netshoes / Getnet / Visa ──────────────────────────────────────────────
  { data:'10/04/2026', nsu:'213748596', adq:'Getnet', ec:'Netshoes',        bandeira:'Visa',   lancamento:'Crédito à vista',   parcela:'1/1',  valor:78.00,   comissao:1.72,  antecipDescontada:0,       liquido:76.28,   antecipado:false, status:'Pago'       },
  // ── Shopee / Getnet / Visa ────────────────────────────────────────────────
  // Câmera 6x — parcelas 2 e 3 pagas; 4 pendente (sem antecipação)
  { data:'10/04/2026', nsu:'324859607', adq:'Getnet', ec:'Shopee Brasil',   bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'2/6',  valor:299.83,  comissao:8.70,  antecipDescontada:0,       liquido:291.13,  antecipado:false, status:'Pago'       },
  { data:'14/04/2026', nsu:'324859607', adq:'Getnet', ec:'Shopee Brasil',   bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'3/6',  valor:299.83,  comissao:8.70,  antecipDescontada:0,       liquido:291.13,  antecipado:false, status:'Pago'       },
  { data:'17/04/2026', nsu:'324859607', adq:'Getnet', ec:'Shopee Brasil',   bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'4/6',  valor:299.83,  comissao:8.70,  antecipDescontada:0,       liquido:291.13,  antecipado:false, status:'Pendente'   },
  // ── iFood / Getnet / Visa ─────────────────────────────────────────────────
  // Assinatura 12x — parcela 11 pendente; 12 antecipada (operação R$ 950,00)
  { data:'10/04/2026', nsu:'435960718', adq:'Getnet', ec:'iFood Ltda',      bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'11/12',valor:475.00,  comissao:16.15, antecipDescontada:0,       liquido:458.85,  antecipado:false, status:'Pendente'   },
  { data:'15/04/2026', nsu:'435960718', adq:'Getnet', ec:'iFood Ltda',      bandeira:'Visa',   lancamento:'Crédito parcelado', parcela:'12/12',valor:475.00,  comissao:16.15, antecipDescontada:950.00,  liquido:458.85,  antecipado:true,  status:'Antecipado' },
  // ── Mercado Livre / Getnet / Visa ─────────────────────────────────────────
  { data:'13/04/2026', nsu:'547071829', adq:'Getnet', ec:'Mercado Livre',   bandeira:'Visa',   lancamento:'Débito',            parcela:'1/1',  valor:350.00,  comissao:5.25,  antecipDescontada:0,       liquido:344.75,  antecipado:false, status:'Pago'       },
]


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
  bruto:      [0,48000,0,48000,48000,0,48000,0,48000,48000,0,48000,0,48000,48000,0,48000,0,48000,48000,0,48000,52000,45000,0,0,50000,47000,53000,41000],
  // repasse = o que o sub paga aos ECs (bruto − MDR ~7%)
  repasse:    [0,44640,0,44640,44640,0,44640,0,44640,44640,0,44640,0,44640,44640,0,44640,0,44640,44640,0,44640,48360,41850,0,0,46500,43710,49290,38130],
  adquirente: [0,32000,0,31000,29000,0,33000,0,28000,35000,0,30000,0,34000,27000,0,36000,0,29000,38000,0,31000,35000,29000,0,0,33000,30000,36000,28000],
  // liquido = o que fica na conta do sub após deduções e antecipações
  liquido:    [0,3360,0,3360,3360,0,3360,0,3360,3360,0,3360,0,3360,3360,0,3360,0,3360,3360,0,3360,3640,3150,0,0,3500,3290,3710,2870],
}
const CAL_ADQUIRENTES = ['—','Adiq','—','Rede','Cielo','—','Adiq','—','Rede','Adiq','—','Cielo','—','Rede','Getnet','—','Adiq','—','Cielo','Rede','—','Adiq','Rede','Cielo','—','—','Getnet','Adiq','Rede','Cielo']
const CALENDAR_DAYS = Array.from({length:30},(_,i)=>{
  const day = i+1
  const past = day < 22
  const base = [48000,0,48000,0,48000,48000,0][day%7]
  // 3 estados: creditado (liquidação confirmada na conta) | confirmado (agendado, ainda não creditado) | antecipado | previsto
  const status = day%5===0 && past ? 'antecipado' : day < 19 ? 'creditado' : day <= 22 ? 'confirmado' : 'previsto'
  return { day, past, value: base, status }
})

const AGENDA_TABS = [
  { key:'calendario', label:'Recebíveis' },
]

export default function AgendaPage() {
  const { agendaTab, setAgendaTab } = useNavStore()
  const tab = agendaTab

  const [agrupado, setAgrupado] = useState(true)
  const [drawerImportAgenda, setDrawerImportAgenda] = useState(false)
  const [search, setSearch] = useState('')
  const [filterBandeira, setFilterBandeira] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedDay, setSelectedDay] = useState(22)
  const [expandedLotes, setExpandedLotes] = useState<Record<string,boolean>>({'10/04/2026-Visa': true})
  const [expandedPainel, setExpandedPainel] = useState<Record<string,boolean>>({})
  const togglePainel = (k: string) => setExpandedPainel(p => ({ ...p, [k]: !p[k] }))
  const [selectedAdqs, setSelectedAdqs] = useState<string[]>([])
  const isPerAdquirente = selectedAdqs.length > 0
  // Banners/legendas dispensáveis (session-only)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const dismiss = (id: string) => setDismissed(p => { const s = new Set(p); s.add(id); return s })
  const ALL_ADQS = ['Adiq','Rede','Cielo','Getnet']
  const toggleAdq = (a: string) => setSelectedAdqs(prev => prev.includes(a) ? prev.filter(x=>x!==a) : [...prev, a])
  const bandeiras = ['Visa','Master','Elo']

  const calMonth = 3
  const calYear = 2026
  const [fundingMonth, setFundingMonth] = useState(3)
  const [fundingYear,  setFundingYear]  = useState(2026)
  const prevFundingMonth = () => {
    if (fundingMonth === 0) { setFundingMonth(11); setFundingYear(y => y - 1) }
    else setFundingMonth(m => m - 1)
  }
  const nextFundingMonth = () => {
    if (fundingMonth === 11) { setFundingMonth(0); setFundingYear(y => y + 1) }
    else setFundingMonth(m => m + 1)
  }
  const firstDow = new Date(calYear, calMonth, 1).getDay()

  const filtered = PARCELAS_DATA.filter(r =>
    (!filterBandeira || r.bandeira===filterBandeira) &&
    (!filterStatus   || r.status===filterStatus) &&
    (!search || r.nsu.includes(search) || r.ec.toLowerCase().includes(search.toLowerCase()) || r.bandeira.toLowerCase().includes(search.toLowerCase()) || r.lancamento.toLowerCase().includes(search.toLowerCase()))
  )

  const kpiData = (filterBandeira || filterStatus || search) ? filtered : PARCELAS_DATA
  const totalBruto    = kpiData.reduce((s,r)=>s+r.valor,0)
  // Deduplica por NSU para evitar double-count de operações com múltiplas parcelas
  const totalAntecip  = (() => {
    const seen: Record<string,number> = {}
    kpiData.forEach(r => { if (r.antecipado && r.antecipDescontada > 0) seen[r.nsu] = Math.max(seen[r.nsu]||0, r.antecipDescontada) })
    return Object.values(seen).reduce((s,v)=>s+v,0)
  })()
  const totalComissao = kpiData.reduce((s,r)=>s+r.comissao,0)
  const totalLiquido  = kpiData.reduce((s,r)=>s+r.liquido,0)
  const pipelineFuturo = 1247350.00

  const KPI_BY_TAB: Record<string, Array<{label:string;value:string;bg:string;border:string;color:string;sub:string;badge?:string|null}>> = {
    calendario: [
      { label:'Total a receber dos adquirentes', value:fmt(totalBruto), bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:`${kpiData.length} parcelas · abr/2026` },
      { label:'Antecipação Tomada', value:fmt(totalAntecip), bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:'Saldo devedor ao adquirente' },
      { label:'Deduções & Custos', value:fmt(totalComissao), bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'MDR + chargebacks + outros' },
      { label:'Líquido a Receber', value:fmt(totalLiquido), bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Estimativa de crédito em conta' },
      { label:'Recebíveis futuros (90 dias)', value:fmt(pipelineFuturo), bg:'#fffbe6', border:'#ffe58f', color:'#faad14', sub:'Parcelas previstas — todos os adquirentes' },
    ],
  }
  const currentKpis = KPI_BY_TAB[tab] || KPI_BY_TAB.calendario

  const activeFilters = [
    filterBandeira ? { key:'bandeira', label:`Bandeira: ${filterBandeira}` } : null,
    filterStatus   ? { key:'status',   label:`Status: ${filterStatus}` } : null,
  ].filter(Boolean) as Array<{ key: string; label: string }>

  const clearFilters = () => { setFilterBandeira(''); setFilterStatus(''); setSearch('') }

  type Parcela = typeof PARCELAS_DATA[0]

  // Agrupamento por adquirente + bandeira (ex: "Adiq — Visa")
  type ArranjoGroup = { key: string; adq: string; bandeira: string; rows: Parcela[]; bruto: number; comissao: number; antecipDescontada: number; liquido: number }

  const groupedArranjo: ArranjoGroup[] = Object.values(
    filtered.reduce((acc: Record<string, ArranjoGroup>, r) => {
      const key = `${r.adq}-${r.bandeira}`
      if (!acc[key]) acc[key] = { key, adq:r.adq, bandeira:r.bandeira, rows:[], bruto:0, comissao:0, antecipDescontada:0, liquido:0 }
      acc[key].rows.push(r)
      acc[key].bruto += r.valor
      acc[key].comissao += r.comissao
      acc[key].antecipDescontada += r.antecipDescontada
      acc[key].liquido += r.liquido
      return acc
    }, {})
  ).sort((a, b) => b.bruto - a.bruto)

  const toggleLote = (key: string) => setExpandedLotes(p => ({...p,[key]:!p[key]}))

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      {/* Drawer importar CSV agenda */}
      {drawerImportAgenda && (
        <div style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', justifyContent:'flex-end' }}
          onClick={e => { if(e.target === e.currentTarget) setDrawerImportAgenda(false) }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)' }} onClick={() => setDrawerImportAgenda(false)} />
          <div style={{ position:'relative', width:560, height:'100%', background:'#fff', boxShadow:'-4px 0 16px rgba(0,0,0,0.15)', display:'flex', flexDirection:'column', zIndex:1 }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:600, fontSize:16 }}>Importar arquivo de captura</span>
              <button onClick={() => setDrawerImportAgenda(false)} style={{ border:'none', background:'none', cursor:'pointer', display:'flex', alignItems:'center' }}><Icon name="x" size={20} /></button>
            </div>
            <div style={{ flex:1, overflow:'auto', padding:24, display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, padding:'12px 16px', display:'flex', gap:10, alignItems:'flex-start' }}>
                <Icon name="info" size={16} color="#1890FF" />
                <div style={{ fontSize:13, color:'rgba(0,0,0,0.65)', lineHeight:'20px' }}>
                  O arquivo CSV será enviado para a <strong>Núclea (registradora)</strong> para processamento. Acompanhe o status em <strong>Financeiro → Arquivos</strong>.
                </div>
              </div>
              <div style={{ border:'2px dashed #d9d9d9', borderRadius:4, padding:'48px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:12, cursor:'pointer', background:'#fafafa' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='#1890FF'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='#d9d9d9'}>
                <Icon name="download" size={32} color="rgba(0,0,0,0.25)" />
                <div style={{ fontSize:14, color:'rgba(0,0,0,0.65)' }}>Arraste o arquivo ou <span style={{ color:'#1890FF', cursor:'pointer' }}>clique para selecionar</span></div>
                <div style={{ fontSize:12, color:'rgba(0,0,0,0.35)' }}>Formatos aceitos: .csv · máx. 50MB</div>
              </div>
              <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)', lineHeight:'20px' }}>
                <div style={{ fontWeight:600, color:'rgba(0,0,0,0.65)', marginBottom:6 }}>Colunas esperadas no CSV:</div>
                <div style={{ fontFamily:'Roboto Mono', background:'#f5f5f5', padding:'8px 12px', borderRadius:2, fontSize:11 }}>
                  data · adquirente · bandeira · nsu · ec · lancamento · parcela · valor · mdr · antecipacao
                </div>
              </div>
            </div>
            <div style={{ padding:'14px 24px', borderTop:'1px solid #f0f0f0', display:'flex', gap:12 }}>
              <button onClick={() => setDrawerImportAgenda(false)} style={{ flex:1, border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer' }}>Cancelar</button>
              <button style={{ flex:2, border:'none', background:'#1890FF', color:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', fontWeight:500 }}>Enviar para processamento</button>
            </div>
          </div>
        </div>
      )}
      <PageHeader
        title="Agenda de Recebíveis"
        breadcrumb="Sub-adquirente / Agenda / Recebíveis"
        onBack={() => {}}
        extra={
          <button onClick={() => setDrawerImportAgenda(true)} style={{ border:'1px solid #1890FF', background:'#e6f4ff', color:'#1890FF', borderRadius:2, height:32, padding:'5px 16px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
            <Icon name="download" size={14} color="#1890FF" /> Importar CSV
          </button>
        }
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

      {/* Nota de leitura — dispensável */}
      {['calendario','detalhada','lote'].includes(tab) && !dismissed.has('formula') && (
        <div style={{ padding:'6px 24px', display:'flex', alignItems:'center', gap:8, fontSize:11, color:'rgba(0,0,0,0.35)', background:'transparent' }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><span style={{ color:'#1890FF', fontWeight:500 }}>Bruto</span> = crédito do adquirente · <span style={{ color:'rgba(0,0,0,0.55)', fontWeight:500 }}>Repasses</span> = o que vai para os ECs · <span style={{ color:'#52c41a', fontWeight:500 }}>Líquido</span> = o que fica com o sub. Deduções visíveis no painel do dia.</span>
          <button onClick={() => dismiss('formula')} style={{ border:'none', background:'none', cursor:'pointer', color:'rgba(0,0,0,0.25)', display:'flex', alignItems:'center', marginLeft:'auto', padding:'2px 4px', borderRadius:2, lineHeight:1 }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* ── CALENDÁRIO TAB ── */}
      {tab==='calendario' && (
        <div style={{ padding:24, display:'flex', gap:24, flex:1 }}>
          {/* ── Painel esquerdo: calendário — white card com divider após header ── */}
          <div style={{ flex:1, background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, display:'flex', flexDirection:'column' }}>
            {/* Header: mês + filtro de adquirente */}
            <div style={{ padding:'16px 21px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #f0f0f0', flexWrap:'wrap', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button style={{ border:'none', background:'none', cursor:'pointer', color:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', padding:'4px 6px' }}><Icon name="chevronLeft" size={16} /></button>
                <span style={{ fontSize:16, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>{MONTHS[calMonth]} {calYear}</span>
                <button style={{ border:'none', background:'none', cursor:'pointer', color:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', padding:'4px 6px' }}><Icon name="chevronRight" size={16} /></button>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:11, color:'rgba(0,0,0,0.35)', fontWeight:500, whiteSpace:'nowrap' }}>Adquirente:</span>
                <button
                  onClick={() => setSelectedAdqs([])}
                  style={{ border:`1px solid ${selectedAdqs.length===0?'#1890FF':'#d9d9d9'}`, borderRadius:12, padding:'3px 12px', fontSize:12, cursor:'pointer', background:selectedAdqs.length===0?'#1890FF':'#fff', color:selectedAdqs.length===0?'#fff':'rgba(0,0,0,0.55)', fontWeight:selectedAdqs.length===0?500:400, transition:'all 0.15s' }}>
                  Todos
                </button>
                {ALL_ADQS.map(a => {
                  const isSelected = selectedAdqs.includes(a)
                  return (
                    <button key={a}
                      onClick={() => setSelectedAdqs(prev => prev.includes(a) ? prev.filter(x=>x!==a) : [...prev, a])}
                      style={{ border:`1px solid ${isSelected?'#1890FF':'#d9d9d9'}`, borderRadius:12, padding:'3px 12px', fontSize:12, cursor:'pointer', background:isSelected?'#e6f7ff':'#fff', color:isSelected?'#1890FF':'rgba(0,0,0,0.55)', fontWeight:isSelected?500:400, transition:'all 0.15s' }}>
                      {a}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Body: grid + legenda */}
            <div style={{ padding:'16px 21px', display:'flex', flexDirection:'column', gap:16 }}>

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
                    const isPast = d.day < 22
                    const effectiveView = isPerAdquirente ? 'adquirente' : 'bruto'
                    const dayVal = (CAL_VALUES[effectiveView] ?? CAL_VALUES.bruto)[d.day - 1] ?? 0
                    const adqLabel = isPerAdquirente ? CAL_ADQUIRENTES[d.day - 1] : null
                    const dayNumColor = isToday ? '#1890FF' : isPast ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.65)'
                    const valColor = dayVal === 0
                      ? (isPast ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.2)')
                      : isPast ? 'rgba(0,0,0,0.35)' : isToday ? '#1890FF' : '#91CAFF'
                    const cellOpacity = isPast && !isSelected ? 0.6 : 1
                    const bgDay = isSelected ? '#e6f7ff' : isToday ? '#f0f7ff' : '#fff'
                    return (
                      <div key={d.day} onClick={()=>setSelectedDay(d.day)}
                        style={{ borderRight:'1px solid #f0f0f0', borderBottom:'1px solid #f0f0f0', minHeight:72, padding:'8px 10px', cursor:'pointer', background:bgDay, position:'relative', transition:'background 0.1s', opacity:cellOpacity }}
                        onMouseEnter={e=>{ if(!isSelected) { (e.currentTarget as HTMLElement).style.background='#fafafa'; (e.currentTarget as HTMLElement).style.opacity='1' } }}
                        onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background=bgDay; (e.currentTarget as HTMLElement).style.opacity=String(cellOpacity) }}>
                        {isToday && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#1890FF', borderRadius:'2px 2px 0 0' }} />}
                        <div style={{ fontSize:13, fontWeight:isToday?700:400, color:dayNumColor, marginBottom:4 }}>{d.day}</div>
                        {isPerAdquirente && adqLabel && adqLabel !== '—' ? (
                          <>
                            <div style={{ fontSize:10, color:'rgba(0,0,0,0.35)', marginBottom:2 }}>{adqLabel}</div>
                            <div style={{ fontSize:12, fontWeight:600, color:valColor }}>{dayVal>0?`R$ ${(dayVal/1000).toFixed(0)}k`:'—'}</div>
                          </>
                        ) : (
                          <div style={{ fontSize:12, fontWeight:600, color:valColor }}>{dayVal===0?'—':`R$ ${(dayVal/1000).toFixed(0)}k`}</div>
                        )}
                        {isSelected && <div style={{ position:'absolute', top:6, right:8, width:5, height:5, borderRadius:'50%', background:'#1890FF' }} />}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legenda temporal */}
              <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:8, display:'flex', alignItems:'center', gap:16 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, color:'rgba(0,0,0,0.35)' }}>
                  <span style={{ width:20, height:8, borderRadius:2, background:'rgba(0,0,0,0.1)', display:'inline-block' }} />
                  Passado
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, color:'rgba(0,0,0,0.45)' }}>
                  <span style={{ width:20, height:8, borderRadius:2, borderTop:'2px solid #1890FF', background:'#f0f7ff', display:'inline-block' }} />
                  Hoje
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, color:'#91CAFF' }}>
                  <span style={{ width:20, height:8, borderRadius:2, background:'#f0f7ff', border:'1px solid #91CAFF', display:'inline-block' }} />
                  Previsto
                </span>
                <span style={{ fontSize:11, color:'rgba(0,0,0,0.25)', marginLeft:'auto' }}>Clique no dia para detalhes →</span>
              </div>
            </div>
          </div>

          {/* ── Painel direito: detalhe do dia — white card com divider após título ── */}
          <div style={{ width:280, flexShrink:0, display:'flex', flexDirection:'column' }}>
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, display:'flex', flexDirection:'column', flex:1 }}>
              {/* Header: data + estado do dia */}
              <div style={{ padding:'16px 18px', borderBottom:'1px solid #f0f0f0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:16, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>{selectedDay} de {MONTHS[calMonth]}</span>
                  {(() => {
                    const dayObj = CALENDAR_DAYS.find(d => d.day === selectedDay)
                    const BADGE: Record<string,{bg:string;color:string;border:string;label:string}> = {
                      creditado:  { bg:'#f6ffed', color:'#389e0d', border:'#b7eb8f', label:'Creditado' },
                      confirmado: { bg:'#f6ffed', color:'#389e0d', border:'#b7eb8f', label:'Confirmado' },
                      antecipado: { bg:'#fff7e6', color:'#d46b08', border:'#ffd591', label:'Antecipado' },
                      previsto:   { bg:'#e6f7ff', color:'#4ea3db', border:'#91CAFF', label:'Previsto' },
                    }
                    const b = BADGE[dayObj?.status || 'previsto']
                    return <span style={{ fontSize:10, background:b.bg, color:b.color, border:`1px solid ${b.border}`, borderRadius:2, padding:'1px 6px', fontWeight:600, lineHeight:'18px' }}>{b.label}</span>
                  })()}
                </div>
                <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{selectedAdqs.length>0?`Filtrado: ${selectedAdqs.join(', ')}`:'Resumo consolidado do dia'}</div>
              </div>
              {/* Body */}
              <div style={{ padding:'8px 0' }}>
                {([
                  {
                    key: 'adquirente',
                    icon: 'trendingUp' as const,
                    color: '#52c41a',
                    label: 'Líquido do adquirente',
                    summary: 'Líquido do adquirente',
                    summaryValue: '+R$ 91.400,00',
                    summaryColor: '#52c41a',
                    rows: [
                      { l: <Tooltip text="Soma de todas as parcelas que vencem hoje, antes de qualquer dedução.">Crédito bruto</Tooltip>, v:'+R$ 191.400,00', c:'#52c41a' },
                      { l: <Tooltip text="MDR (Merchant Discount Rate): taxa cobrada pelo adquirente sobre cada transação processada.">− MDR pago</Tooltip>, v:'−R$ 25.000,00', c:'#ff4d4f' },
                      { l: <Tooltip text="Parcelas comprometidas com operações de antecipação tomada junto ao adquirente, debitadas na liquidação.">− Antecipação debitada</Tooltip>, v:'−R$ 75.000,00', c:'#fa8c16' },
                    ],
                  },
                  {
                    key: 'ecs',
                    icon: 'users' as const,
                    color: '#1890ff',
                    label: 'Repasse aos ECs',
                    summary: 'A repassar hoje',
                    summaryValue: 'R$ 149.840,00',
                    summaryColor: '#1890ff',
                    rows: [
                      { l: <Tooltip text="Valor bruto das vendas que o sub deve repassar aos merchants hoje.">Repasse bruto</Tooltip>, v:'R$ 158.000,00', c:'rgba(0,0,0,0.85)' },
                      { l: <Tooltip text="MDR cobrado dos merchants — retido pelo sub antes do repasse.">− MDR retido do EC</Tooltip>, v:'−R$ 8.160,00', c:'#ff4d4f' },
                    ],
                  },
                  {
                    key: 'resultado',
                    icon: 'barChart' as const,
                    color: '#722ED1',
                    label: 'Receita operacional',
                    summary: 'Receita operacional',
                    summaryValue: '+R$ 8.400,00',
                    summaryColor: '#722ED1',
                    rows: [
                      { l: <Tooltip text="Diferença entre o MDR cobrado dos ECs e o MDR pago aos adquirentes. Margem de intermediação do sub.">Spread de MDR</Tooltip>, v:'+R$ 8.160,00', c:'#52c41a' },
                      { l: <Tooltip text="Juros cobrados dos merchants pelas antecipações concedidas. Receita financeira do sub.">Juros de antecipações</Tooltip>, v:'+R$ 240,00', c:'#52c41a' },
                    ],
                  },
                  {
                    key: 'capital',
                    icon: 'creditCard' as const,
                    color: '#fa8c16',
                    label: 'Capital comprometido',
                    summary: 'Total comprometido',
                    summaryValue: 'R$ 23.400,00',
                    summaryColor: '#fa8c16',
                    rows: [
                      { l: <Tooltip text="Capital adiantado a merchants ainda em recuperação. As parcelas do adquirente vão abatendo gradualmente.">Antecipações concedidas</Tooltip>, v:'R$ 8.400,00', c:'#fa8c16' },
                      { l: <Tooltip text="Recebíveis bloqueados por garantia (gravame) ou comprometidos com antecipação tomada junto ao adquirente.">Gravame / oneração</Tooltip>, v:'R$ 15.000,00', c:'#fa8c16' },
                    ],
                  },
                ] as const).map((section, si, arr) => {
                  const isOpen = !!expandedPainel[section.key]
                  return (
                    <div key={section.key} style={{ borderBottom: si < arr.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      {/* Header — sempre visível, clicável */}
                      <div
                        onClick={() => togglePainel(section.key)}
                        style={{ display:'flex', alignItems:'center', padding:'10px 18px', cursor:'pointer', userSelect:'none' }}
                      >
                        <div style={{ display:'flex', alignItems:'center', gap:6, flex:1, minWidth:0 }}>
                          <Icon name={section.icon} size={12} color={section.color} />
                          <span style={{ fontSize:11, fontWeight:700, color:section.color, letterSpacing:'0.4px', textTransform:'uppercase', whiteSpace:'nowrap' }}>{section.label}</span>
                        </div>
                        {!isOpen && (
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                            <span style={{ fontSize:12, fontWeight:700, color:section.summaryColor }}>{section.summaryValue}</span>
                            <Icon name="chevronDown" size={12} color="rgba(0,0,0,0.35)" />
                          </div>
                        )}
                        {isOpen && (
                          <Icon name="chevronUp" size={12} color="rgba(0,0,0,0.35)" />
                        )}
                      </div>
                      {/* Detalhe expandido */}
                      {isOpen && (
                        <div style={{ padding:'0 18px 12px' }}>
                          {section.rows.map((r, i) => (
                            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #f5f5f5', fontSize:12 }}>
                              <span style={{ color:'rgba(0,0,0,0.65)' }}>{r.l}</span>
                              <span style={{ color:r.c, fontWeight:600 }}>{r.v}</span>
                            </div>
                          ))}
                          <div style={{ display:'flex', justifyContent:'space-between', padding:'7px 0 2px', fontSize:12 }}>
                            <span style={{ color:'rgba(0,0,0,0.85)', fontWeight:600 }}>{section.summary}</span>
                            <span style={{ color:section.summaryColor, fontWeight:700 }}>{section.summaryValue}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VISÃO DETALHADA TAB (removed — unified with Liquidações in Financeiro) ── */}
      {false && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {(() => {
            const parcelaColumns: ColumnType<Parcela>[] = [
              {
                title: 'Data de crédito', dataIndex: 'data', key: 'data', width: 130,
                render: v => <span style={{ color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>{v}</span>,
              },
              {
                title: 'NSU / Ref.', dataIndex: 'nsu', key: 'nsu', width: 130,
                render: (v, r) => (
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontFamily:'Roboto Mono', fontSize:12, color:'rgba(0,0,0,0.65)' }}>
                    {r.antecipado && (
                      <Tooltip text="Parcela antecipada — o valor já foi creditado antecipadamente. Quando liquidada, abate o saldo devedor da operação.">
                        <span style={{ width:7, height:7, borderRadius:'50%', background:'#fa8c16', display:'inline-block', flexShrink:0 }} />
                      </Tooltip>
                    )}
                    {v}
                  </span>
                ),
              },
              {
                title: 'Merchant (EC)', dataIndex: 'ec', key: 'ec', width: 160,
                render: v => <span style={{ fontWeight:500, color:'rgba(0,0,0,0.85)', whiteSpace:'nowrap' }}>{v}</span>,
              },
              {
                title: 'Adquirente', dataIndex: 'adq', key: 'adq', width: 110,
                render: v => <BrandLogo brand={v} />,
              },
              {
                title: 'Bandeira', dataIndex: 'bandeira', key: 'bandeira', width: 110,
                render: v => <BrandLogo brand={v} size={20} showLabel />,
              },
              {
                title: 'Lançamento', dataIndex: 'lancamento', key: 'lancamento', width: 160,
                render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{v}</span>,
              },
              {
                title: 'Parcela', dataIndex: 'parcela', key: 'parcela', width: 80,
                render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:12, color:'rgba(0,0,0,0.65)' }}>{v}</span>,
              },
              {
                title: 'Valor', dataIndex: 'valor', key: 'valor', width: 130,
                render: v => <span style={{ color:'rgba(0,0,0,0.85)', fontWeight:500 }}>{fmt(v)}</span>,
              },
              {
                title: 'MDR retido', dataIndex: 'comissao', key: 'comissao', width: 120,
                render: v => <span style={{ color:'#f5222d', fontWeight:500 }}>{fmt(v)}</span>,
              },
              {
                title: 'Antecip. tomada', dataIndex: 'antecipDescontada', key: 'antecipDescontada', width: 150,
                render: v => v > 0
                  ? (
                    <Tooltip text="Valor total da operação de antecipação que cobre esta parcela. Quando liquidada, o crédito abate este saldo junto ao adquirente.">
                      <span style={{ color:'#fa8c16', fontWeight:500 }}>{fmt(v)}</span>
                    </Tooltip>
                  )
                  : <span style={{ color:'rgba(0,0,0,0.2)' }}>—</span>,
              },
              {
                title: 'Valor líquido', dataIndex: 'liquido', key: 'liquido', width: 130,
                render: (v, r) => <span style={{ color: r.antecipado ? '#fa8c16' : '#1890ff', fontWeight:600 }}>{fmt(v)}</span>,
              },
              {
                title: 'Status', dataIndex: 'status', key: 'status', width: 120,
                render: v => <Tag status={v} />,
              },
              {
                title: '', key: 'actions', width: 60,
                render: () => <button title="Ver detalhes" style={{ border:'none', background:'none', color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:4, display:'flex', alignItems:'center', borderRadius:4 }}><Icon name="eye" size={15} color="rgba(0,0,0,0.35)" /></button>,
              },
            ]

            const toggleExtra = (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:13, color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>Agrupar por arranjo</span>
                <div onClick={()=>setAgrupado(!agrupado)} style={{ width:40, height:22, borderRadius:11, background:agrupado?'#1890FF':'#d9d9d9', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
                  <div style={{ position:'absolute', top:3, left:agrupado?20:3, width:16, height:16, borderRadius:'50%', background:'#fff', boxShadow:'0 2px 4px rgba(0,35,11,0.2)', transition:'left 0.2s' }} />
                </div>
              </div>
            )

            const bFilter = filterBandeira ? [filterBandeira] : bandeiras
            const sFilter = filterStatus ? [filterStatus] : ['Pago','Pendente','Antecipado','Chargeback','Liquidado']

            return agrupado ? (
              /* ── Visão agrupada por adquirente + bandeira (arranjo) ── */
              <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, boxShadow:'0 2px 0 rgba(0,0,0,0.02)' }}>
                <div style={{ padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:16, fontWeight:600, color:'rgba(0,0,0,0.85)', fontFamily:'Roboto, sans-serif' }}>Recebíveis por arranjo</span>
                  {toggleExtra}
                </div>
                <div style={{ overflowX:'auto', padding:'0 21px 21px' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                    <thead>
                      <tr style={{ background:'#fafafa' }}>
                        {['Arranjo (Adquirente / Bandeira)','Parcelas','Crédito bruto (adquirente)','MDR pago','Antecipação tomada','Crédito líquido','Status'].map(h => (
                          <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:500, color:'rgba(0,0,0,0.85)', borderBottom:'1px solid #f0f0f0', whiteSpace:'nowrap', fontSize:12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {groupedArranjo.map(arr => {
                        const isExp = expandedLotes[arr.key]
                        const allPago = arr.rows.every(r=>r.status==='Pago')
                        const arrStatus = arr.antecipDescontada > 0 ? 'Antecipado' : allPago ? 'Liquidado' : 'Pendente'
                        return [
                          <tr key={arr.key} style={{ borderBottom:'1px solid #f0f0f0', background:'#fafafa', cursor:'pointer' }}
                            onClick={()=>toggleLote(arr.key)}
                            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#f0f7ff'}
                            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#fafafa'}>
                            <td style={{ padding:'12px 14px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <span style={{ color:'#1890FF', display:'flex', alignItems:'center' }}><Icon name={isExp ? 'chevronDown' : 'chevronRight'} size={12} /></span>
                                <BrandLogo brand={arr.adq} />
                                <span style={{ color:'rgba(0,0,0,0.25)', fontSize:12 }}>·</span>
                                <BrandLogo brand={arr.bandeira} size={20} showLabel />
                              </div>
                            </td>
                            <td style={{ padding:'12px 14px', color:'rgba(0,0,0,0.65)' }}>{arr.rows.length} parcelas</td>
                            <td style={{ padding:'12px 14px', fontWeight:600, color:'rgba(0,0,0,0.85)' }}>{fmt(arr.bruto)}</td>
                            <td style={{ padding:'12px 14px', color:'#ff4d4f' }}>{fmt(arr.comissao)}</td>
                            <td style={{ padding:'12px 14px', color:arr.antecipDescontada>0?'#fa8c16':'rgba(0,0,0,0.25)' }}>{arr.antecipDescontada>0?fmt(arr.antecipDescontada):'—'}</td>
                            <td style={{ padding:'12px 14px', fontWeight:600, color:'#52c41a' }}>{fmt(arr.liquido)}</td>
                            <td style={{ padding:'12px 14px' }}><Tag status={arrStatus} /></td>
                          </tr>,
                          ...(isExp ? [
                            ...arr.rows.map((r,i) => (
                              <tr key={`${arr.key}-${i}`} style={{ borderBottom:'1px solid #f0f0f0', background:'#fff' }}
                                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#fafafa'}
                                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#fff'}>
                                <td style={{ padding:'9px 14px 9px 36px', color:'rgba(0,0,0,0.45)', fontFamily:'Roboto Mono', fontSize:11 }}>{r.nsu} · {r.data}</td>
                                <td style={{ padding:'9px 14px', fontSize:12, color:'rgba(0,0,0,0.65)', fontWeight:500 }}>{r.ec} · {r.lancamento} · {r.parcela}</td>
                                <td style={{ padding:'9px 14px', color:'rgba(0,0,0,0.85)' }}>{fmt(r.valor)}</td>
                                <td style={{ padding:'9px 14px', color:'rgba(0,0,0,0.55)' }}>{fmt(r.comissao)}</td>
                                <td style={{ padding:'9px 14px', color:r.antecipDescontada>0?'#fa8c16':'rgba(0,0,0,0.2)' }}>{r.antecipDescontada>0?fmt(r.antecipDescontada):'–'}</td>
                                <td style={{ padding:'9px 14px', fontWeight:500, color:r.antecipado?'#fa8c16':'#52c41a' }}>{fmt(r.liquido)}</td>
                                <td style={{ padding:'9px 14px' }}><Tag status={r.status} /></td>
                              </tr>
                            )),
                            <tr key={`${arr.key}-subtotal`} style={{ background:'#e6f7ff', borderBottom:'1px solid #91d5ff' }}>
                              <td style={{ padding:'9px 14px', color:'#1890FF', fontWeight:600 }} colSpan={2}>Subtotal {arr.adq} / {arr.bandeira}:</td>
                              <td style={{ padding:'9px 14px', fontWeight:600, color:'#1890FF' }}>{fmt(arr.bruto)}</td>
                              <td style={{ padding:'9px 14px', fontWeight:600, color:'#ff4d4f' }}>{fmt(arr.comissao)}</td>
                              <td style={{ padding:'9px 14px', fontWeight:600, color:arr.antecipDescontada>0?'#fa8c16':'rgba(0,0,0,0.25)' }}>{arr.antecipDescontada>0?fmt(arr.antecipDescontada):'—'}</td>
                              <td style={{ padding:'9px 14px', fontWeight:600, color:'#52c41a' }}>{fmt(arr.liquido)}</td>
                              <td />
                            </tr>
                          ] : [])
                        ]
                      })}
                      <tr style={{ background:'#e6f7ff', borderTop:'2px solid #91d5ff' }}>
                        <td colSpan={2} style={{ padding:'12px 14px', fontWeight:700, color:'#1890FF', fontSize:13 }}>TOTAL GERAL</td>
                        <td style={{ padding:'12px 14px', fontWeight:700, color:'#1890FF' }}>{fmt(filtered.reduce((s,r)=>s+r.valor,0))}</td>
                        <td style={{ padding:'12px 14px', fontWeight:700, color:'#ff4d4f' }}>{fmt(filtered.reduce((s,r)=>s+r.comissao,0))}</td>
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
                title="Recebíveis detalhados"
                titleExtra={toggleExtra}
                columns={parcelaColumns}
                dataSource={filtered}
                rowKey="nsu"
                searchPlaceholder="Pesquise NSU, merchant, bandeira..."
                searchValue={search}
                onSearch={setSearch}
                filters={[
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
                periodOptions={PERIOD_OPTIONS}
                defaultPeriod="hoje"
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

    </div>
  )
}
