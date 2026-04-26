'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import { useNavStore } from '@/store/nav.store'
import DataTable, { type ColumnType, PERIOD_OPTIONS } from '@/components/ui/DataTable'
import Tag from '@/components/shared/Tag'

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const FINANCIAL_TABS = [
  { key:'extrato',      label:'Extrato' },
  { key:'liquidacoes',  label:'Liquidações' },
  { key:'antecipacoes', label:'Antecipações' },
]

const LIQCEN_ADQS = [
  { adq:'Adiq',   registradora:'CIP',  domicilio:'Banco Inter · Ag 0001 / CC 12345-6', status:'Ativo',    vol:521010 },
  { adq:'Rede',   registradora:'CERC', domicilio:'Banco Inter · Ag 0001 / CC 12345-6', status:'Ativo',    vol:347340 },
  { adq:'Cielo',  registradora:'TAG',  domicilio:'Banco Inter · Ag 0001 / CC 12345-6', status:'Ativo',    vol:248100 },
  { adq:'Getnet', registradora:'CIP',  domicilio:'Banco Inter · Ag 0001 / CC 12345-6', status:'Pendente', vol:124050 },
]

const LIQ_EVENTOS = [
  { data:'10/04/2026', adq:'Adiq',   tipo:'Crédito normal',    bruto:198400, desc:5952,  antecip:0,     cred:192448, conta:'CC 12345-6', status:'Liquidado' },
  { data:'10/04/2026', adq:'Adiq',   tipo:'Desc. antecipação', bruto:134200, desc:4026,  antecip:60000, cred:70174,  conta:'CC 12345-6', status:'Liquidado' },
  { data:'11/04/2026', adq:'Rede',   tipo:'Crédito normal',    bruto:87500,  desc:2625,  antecip:0,     cred:84875,  conta:'CC 12345-6', status:'Liquidado' },
  { data:'11/04/2026', adq:'Rede',   tipo:'Desc. antecipação', bruto:72000,  desc:2160,  antecip:30000, cred:39840,  conta:'CC 12345-6', status:'Liquidado' },
  { data:'12/04/2026', adq:'Cielo',  tipo:'Crédito normal',    bruto:156700, desc:4701,  antecip:0,     cred:151999, conta:'CC 12345-6', status:'Pendente' },
  { data:'13/04/2026', adq:'Getnet', tipo:'Crédito normal',    bruto:83200,  desc:2496,  antecip:0,     cred:80704,  conta:'CC 12345-6', status:'Pendente' },
  { data:'25/04/2026', adq:'Adiq',   tipo:'Crédito normal',    bruto:82000,  desc:2460,  antecip:0,     cred:79540,  conta:'CC 12345-6', status:'Previsto' },
  { data:'25/04/2026', adq:'Rede',   tipo:'Crédito normal',    bruto:54000,  desc:1620,  antecip:0,     cred:52380,  conta:'CC 12345-6', status:'Previsto' },
]

type LiqEvento = typeof LIQ_EVENTOS[0]

const EXTRATO_DATA = [
  { data:'10/04', desc:'Liquidação lote L-001', tipo:'Crédito adquirente', adq:'Adiq',   entrada:192448, saida:0,      saldo:192448 },
  { data:'10/04', desc:'Liquidação c/ desc. antecip.', tipo:'Crédito deduzido', adq:'Adiq', entrada:70174, saida:0,   saldo:262622 },
  { data:'10/04', desc:'Repasse Mercado Livre', tipo:'Repasse merchant', adq:'—',       entrada:0,      saida:192448, saldo:70174 },
  { data:'11/04', desc:'Liquidação lote L-003', tipo:'Crédito adquirente', adq:'Rede',   entrada:84875,  saida:0,      saldo:155049 },
  { data:'11/04', desc:'Liquidação c/ desc. antecip.', tipo:'Crédito deduzido', adq:'Rede', entrada:39840, saida:0,   saldo:194889 },
  { data:'11/04', desc:'Repasse Amazon Brasil', tipo:'Repasse merchant', adq:'—',       entrada:0,      saida:115279, saldo:79610 },
  { data:'12/04', desc:'MDR e tarifas Cielo', tipo:'Custo processamento', adq:'Cielo',  entrada:0,      saida:4701,   saldo:74909 },
  { data:'13/04', desc:'Repasse Americanas', tipo:'Repasse merchant', adq:'—',         entrada:0,      saida:3285,   saldo:71624 },
]
type ExtratoRow = typeof EXTRATO_DATA[0]

const ANTECIP_EC_DATA = [
  { id:'AEC-001', data:'02/04/2026', merchant:'Mercado Livre',  valor:45000, taxa:'2,50%', juros:1125, venc:'02/05/2026', recuperar:45000, status:'A recuperar' },
  { id:'AEC-002', data:'05/04/2026', merchant:'Amazon Brasil',  valor:28000, taxa:'2,30%', juros:644,  venc:'05/05/2026', recuperar:28000, status:'A recuperar' },
  { id:'AEC-003', data:'08/04/2026', merchant:'Rappi Brasil',   valor:12000, taxa:'2,80%', juros:336,  venc:'08/05/2026', recuperar:12000, status:'A recuperar' },
  { id:'AEC-004', data:'15/03/2026', merchant:'iFood Ltda',     valor:35000, taxa:'2,50%', juros:875,  venc:'15/04/2026', recuperar:0,     status:'Recuperado' },
  { id:'AEC-005', data:'10/03/2026', merchant:'Magazine Luiza', valor:20000, taxa:'2,20%', juros:440,  venc:'10/04/2026', recuperar:0,     status:'Recuperado' },
]
type AntecipEC = typeof ANTECIP_EC_DATA[0]


/* Drawer component */
const Drawer = ({ open, onClose, title, width = 480, children, footer }: {
  open: boolean; onClose: () => void; title: string; width?: number;
  children: React.ReactNode; footer?: React.ReactNode
}) => {
  if (!open) return null
  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', justifyContent:'flex-end' }}
      onClick={e => { if(e.target === e.currentTarget) onClose() }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)' }} onClick={onClose} />
      <div style={{ position:'relative', width, height:'100%', background:'#fff', boxShadow:'-4px 0 16px rgba(0,0,0,0.15)', display:'flex', flexDirection:'column', zIndex:1 }}>
        <div style={{ padding:'16px 24px', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <span style={{ fontWeight:600, fontSize:16, color:'rgba(0,0,0,0.85)' }}>{title}</span>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', padding:4, borderRadius:2 }}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <div style={{ flex:1, overflow:'auto', padding:24 }}>{children}</div>
        {footer && (
          <div style={{ padding:'14px 24px', borderTop:'1px solid #f0f0f0', display:'flex', gap:12, flexShrink:0 }}>{footer}</div>
        )}
      </div>
    </div>
  )
}

const DrawerLiquidacaoDetalhes = ({ open, onClose, liq }: { open: boolean; onClose: () => void; liq: LiqEvento | null }) => {
  if (!liq) return null
  return (
    <Drawer open={open} onClose={onClose} title="Detalhes da liquidação" width={480}
      footer={<>
        <button style={{ flex:1, border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', color:'rgba(0,0,0,0.65)' }}>Baixar comprovante</button>
        {liq.status!=='Liquidado' && <button style={{ flex:1, border:'1px solid #ff4d4f', background:'#fff1f0', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', color:'#ff4d4f' }}>Estornar</button>}
      </>}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <span style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>Dados da operação</span>
        <Tag status={liq.status} />
      </div>
      {[
        { label:'Adquirente', value: liq.adq },
        { label:'Tipo de crédito', value: liq.tipo },
        { label:'Data', value: liq.data },
        { label:'Conta de liquidação', value: liq.conta },
        { label:'Registradora', value: LIQCEN_ADQS.find(a=>a.adq===liq.adq)?.registradora || '—' },
      ].map((r,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f0f0f0', fontSize:13 }}>
          <span style={{ color:'rgba(0,0,0,0.45)' }}>{r.label}</span>
          <span style={{ color:'rgba(0,0,0,0.85)', fontWeight:500 }}>{r.value}</span>
        </div>
      ))}
      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'rgba(0,0,0,0.85)', marginBottom:12 }}>Resumo financeiro</div>
        <div style={{ display:'flex', gap:8 }}>
          {[
            { l:'Bruto', v:fmt(liq.bruto), c:'#1890FF', bg:'#e6f7ff', border:'#91d5ff' },
            { l:'MDR / Tarifas', v:fmt(liq.desc), c:'#ff4d4f', bg:'#fff1f0', border:'#ffa39e' },
            { l:'Antecip.', v:liq.antecip>0?fmt(liq.antecip):'—', c:'#fa8c16', bg:'#fff7e6', border:'#ffd591' },
            { l:'Líquido', v:fmt(liq.cred), c:'#52c41a', bg:'#f6ffed', border:'#b7eb8f' },
          ].map((s,i) => (
            <div key={i} style={{ flex:1, background:s.bg, border:`1px solid ${s.border}`, borderRadius:2, padding:'10px 8px', textAlign:'center' }}>
              <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)', marginBottom:4 }}>{s.l}</div>
              <div style={{ fontSize:13, fontWeight:700, color:s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  )
}

const DrawerSimulacaoAntecipacao = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [valor, setValor] = useState('')
  const [metodo, setMetodo] = useState('')
  const [bandeira, setBandeira] = useState('')
  const [mcc, setMcc] = useState('')
  const [simulated, setSimulated] = useState<{v:number;taxaEC:number;taxaAdq:number;repasseEC:number;custoAdq:number;liquido:number}|null>(null)

  const MCCs = ['00001 — Fuel Group (Combustível)', '5912 — Drug Stores', '5812 — Eating Places', '5731 — Electronics', '5999 — Misc. Retail', '5661 — Shoe Stores']
  const METODOS = ['Crédito à vista', 'Crédito parcelado 2x', 'Crédito parcelado 3-6x', 'Crédito parcelado 7-12x', 'Débito à vista']
  const BANDEIRAS = ['Visa', 'Mastercard', 'Elo', 'Hipercard']

  const TAXA_EC: Record<string,number> = { 'Crédito à vista':0.02, 'Crédito parcelado 2x':0.025, 'Crédito parcelado 3-6x':0.029, 'Crédito parcelado 7-12x':0.034, 'Débito à vista':0.015 }
  const TAXA_ADQ: Record<string,number> = { 'Crédito à vista':0.01, 'Crédito parcelado 2x':0.012, 'Crédito parcelado 3-6x':0.015, 'Crédito parcelado 7-12x':0.018, 'Débito à vista':0.008 }

  const handleSimular = () => {
    if (!valor || !metodo || !bandeira) return
    const v = parseFloat(valor.replace(/[^\d,]/g,'').replace(',','.')) || 0
    const taxaEC = TAXA_EC[metodo] || 0.02
    const taxaAdq = TAXA_ADQ[metodo] || 0.01
    const repasseEC = -(v * (1 - taxaEC))
    const custoAdq = -(v * taxaAdq)
    const liquido = v + repasseEC + custoAdq
    setSimulated({ v, taxaEC: taxaEC*100, taxaAdq: taxaAdq*100, repasseEC, custoAdq, liquido })
  }

  return (
    <Drawer open={open} onClose={onClose} title="Simulação de Antecipação"
      footer={<>
        <button onClick={simulated ? ()=>setSimulated(null) : onClose} style={{ flex:1, border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', color:'rgba(0,0,0,0.65)' }}>{simulated ? 'Refazer Simulação' : 'Sair'}</button>
        {simulated && <button style={{ flex:2, border:'none', background:'#1890FF', color:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', fontWeight:500 }}>Contratar antecipação</button>}
        {!simulated && <button onClick={handleSimular} style={{ flex:2, border:'none', background:'#1890FF', color:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', fontWeight:500 }}>Simular</button>}
      </>}>
      <div style={{ background:'#fafafa', borderRadius:2, padding:'12px 16px', marginBottom:20 }}>
        <div style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>Detalhes da Simulação</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div>
          <label style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', display:'block', marginBottom:6 }}>Valor da cobrança</label>
          <input value={valor} onChange={e=>setValor(e.target.value)} placeholder="R$"
            style={{ width:'100%', border:'1px solid #d9d9d9', borderRadius:2, padding:'8px 12px', fontSize:14, outline:'none', fontFamily:'Roboto' }}
            onFocus={e=>(e.target as HTMLInputElement).style.border='1px solid #1890FF'} onBlur={e=>(e.target as HTMLInputElement).style.border='1px solid #d9d9d9'} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', display:'block', marginBottom:6 }}>Método</label>
            <select value={metodo} onChange={e=>setMetodo(e.target.value)} style={{ width:'100%', border:'1px solid #d9d9d9', borderRadius:2, padding:'8px 12px', fontSize:13, outline:'none', fontFamily:'Roboto', cursor:'pointer', color:metodo?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.35)' }}>
              <option value="">Selecione o método</option>
              {METODOS.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', display:'block', marginBottom:6 }}>Bandeira</label>
            <select value={bandeira} onChange={e=>setBandeira(e.target.value)} style={{ width:'100%', border:'1px solid #d9d9d9', borderRadius:2, padding:'8px 12px', fontSize:13, outline:'none', fontFamily:'Roboto', cursor:'pointer', color:bandeira?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.35)' }}>
              <option value="">Selecione a bandeira</option>
              {BANDEIRAS.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', display:'block', marginBottom:6 }}>MCC</label>
          <select value={mcc} onChange={e=>setMcc(e.target.value)} style={{ width:'100%', border:'1px solid #d9d9d9', borderRadius:2, padding:'8px 12px', fontSize:13, outline:'none', fontFamily:'Roboto', cursor:'pointer', color:mcc?'rgba(0,0,0,0.85)':'rgba(0,0,0,0.35)' }}>
            <option value="">Selecione o mcc</option>
            {MCCs.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      {simulated && (
        <div style={{ marginTop:24 }}>
          <div style={{ background:'#fafafa', borderRadius:2, padding:'12px 16px', marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.85)', marginBottom:12 }}>Resumo da simulação</div>
            <div style={{ display:'flex', gap:8 }}>
              {[
                { l:'Valor Bruto', v:`+${fmt(simulated.v)}`, c:'#1890FF', bg:'#e6f7ff', border:'#91d5ff' },
                { l:'Repasse EC', v:fmt(simulated.repasseEC), c:'rgba(0,0,0,0.65)', bg:'#fff', border:'#d9d9d9' },
                { l:'Custos', v:fmt(simulated.custoAdq), c:'#ff4d4f', bg:'#fff1f0', border:'#ffa39e' },
                { l:'Líquido', v:`+${fmt(simulated.liquido)}`, c:'#52c41a', bg:'#f6ffed', border:'#b7eb8f' },
              ].map((s,i) => (
                <div key={i} style={{ flex:1, background:s.bg, border:`1px solid ${s.border}`, borderRadius:2, padding:'10px 6px', textAlign:'center' }}>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)', marginBottom:4 }}>{s.l}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.85)', marginBottom:12 }}>Detalhes da simulação</div>
          {[
            { label:'Adquirente usado na operação', value:'adiq', bold:true },
            { label:'Custo do adquirente', value:`${simulated.taxaAdq.toFixed(2)}%` },
            { label:'Taxa aplicada ao EC', value:`${simulated.taxaEC.toFixed(2)}%` },
            { label:'Valor da cobrança', value:fmt(simulated.v), c:'rgba(0,0,0,0.85)' },
            { label:'Valor pago ao EC', value:fmt(simulated.repasseEC), c:'rgba(0,0,0,0.65)' },
            { label:'Valor pago ao Adquirente', value:fmt(simulated.custoAdq), c:'#ff4d4f' },
            { label:'Valor líquido à receber', value:`+${fmt(simulated.liquido)}`, c:'#52c41a' },
          ].map((r,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #f0f0f0', fontSize:13 }}>
              <span style={{ color:'rgba(0,0,0,0.65)' }}>{r.label}</span>
              <span style={{ fontWeight:r.bold?700:500, color:r.c||'rgba(0,0,0,0.85)', fontStyle:r.bold?'italic':undefined }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}

export default function FinancialPage() {
  const { financialTab, setFinancialTab } = useNavStore()
  const tab = financialTab

  const [drawerLiq, setDrawerLiq] = useState<LiqEvento | null>(null)
  const [drawerSim, setDrawerSim] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const dismiss = (id: string) => setDismissed(p => { const s = new Set(p); s.add(id); return s })

  const KPI_FIN: Record<string, Array<{label:string;value:string;bg:string;border:string;color:string;sub:string}>> = {
    extrato: [
      { label:'Saldo disponível', value:'R$ 78.328,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Conta domicílio principal' },
      { label:'Entradas no mês', value:'R$ 1.240.500,00', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'Créditos de adquirentes' },
      { label:'Saídas no mês', value:'R$ 1.162.172,00', bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'Repasses + custos + antecip.' },
      { label:'Próximo crédito', value:'25/04/2026', bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Adiq · R$ 82k previsto' },
    ],
    liquidacoes: [
      { label:'Total liquidado (mês)', value:'R$ 1.240.500,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Créditos confirmados adquirentes' },
      { label:'A liquidar (pendente)', value:'R$ 239.900,00', bg:'#fffbe6', border:'#ffe58f', color:'#faad14', sub:'Aguardando crédito nos domicílios' },
      { label:'Liq. centralizada ativa', value:'4 adquirentes', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'Domicílio configurado e operando' },
      { label:'Gravames ativos', value:'R$ 140.000,00', bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:'Oneração em registradora' },
      { label:'Custo de processamento', value:'R$ 29.772,00', bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'MDR + tarifas do mês' },
    ],
    antecipacoes: [
      { label:'Saldo devedor total', value:'R$ 140.000,00', bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:'Em aberto com adquirentes' },
      { label:'Antecipado no mês', value:'R$ 85.000,00', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'3 operações em abril/26' },
      { label:'Taxa média tomada', value:'1,99% a.m.', bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Média ponderada das ops' },
      { label:'Custo total em juros', value:'R$ 1.691,00', bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'Juros pagos em antecipações' },
      { label:'Elegível para antecipar', value:'R$ 670.338,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Recebíveis livres de gravame' },
    ],
  }

  const currentKpis = KPI_FIN[tab] || KPI_FIN.liquidacoes

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader
        title="Financeiro"
        breadcrumb="Sub-adquirente / Financeiro"
        onBack={() => {}}
        tabs={FINANCIAL_TABS}
        activeTab={tab}
        onTabChange={(k) => setFinancialTab(k as typeof financialTab)}
      />

      {/* KPI cards */}
      <div style={{ padding:'16px 24px 0', display:'flex', gap:16 }}>
        {currentKpis.map((k,i) => (
          <div key={i} style={{ flex:1, background:k.bg, border:`1px solid ${k.border}`, borderRadius:2, padding:'14px 18px' }}>
            <div style={{ fontSize:12, color:'rgba(0,0,0,0.65)', fontWeight:500, marginBottom:6 }}>{k.label}</div>
            <div style={{ fontSize:20, fontWeight:700, color:k.color, marginBottom:4 }}>{k.value}</div>
            <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── EXTRATO TAB ── */}
      {tab==='extrato' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {(()=>{
            const cols: ColumnType<ExtratoRow>[] = [
              { title:'Data', dataIndex:'data', key:'data', width:70, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}/2026</span> },
              { title:'Descrição', dataIndex:'desc', key:'desc', render: v => <span style={{ fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{v}</span> },
              { title:'Tipo', dataIndex:'tipo', key:'tipo', render: v => (
                <span style={{ fontSize:11, background:v.includes('Crédito')?'#e6f7ff':v.includes('Custo')?'#fff1f0':'#f5f5f5', color:v.includes('Crédito')?'#1890FF':v.includes('Custo')?'#ff4d4f':'rgba(0,0,0,0.45)', border:`1px solid ${v.includes('Crédito')?'#91d5ff':v.includes('Custo')?'#ffa39e':'#d9d9d9'}`, borderRadius:2, padding:'1px 6px' }}>{v}</span>
              )},
              { title:'Adquirente', dataIndex:'adq', key:'adq', width:90, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
              { title:'Entrada', dataIndex:'entrada', key:'entrada', width:130, render: v => <span style={{ color:'#52c41a', fontWeight:v>0?600:400 }}>{v>0?fmt(v):'—'}</span> },
              { title:'Saída', dataIndex:'saida', key:'saida', width:130, render: v => <span style={{ color:'#ff4d4f', fontWeight:v>0?600:400 }}>{v>0?fmt(v):'—'}</span> },
              { title:'Saldo parcial', dataIndex:'saldo', key:'saldo', width:140, render: v => <span style={{ fontWeight:600, color:'rgba(0,0,0,0.85)', fontFamily:'Roboto Mono', fontSize:11 }}>{fmt(v)}</span> },
            ]
            return (
              <DataTable<ExtratoRow>
                title="Extrato de caixa — Abril 2026"
                columns={cols}
                dataSource={EXTRATO_DATA}
                rowKey={(_,i)=>String(i)}
                onExport={()=>{}}
                periodOptions={PERIOD_OPTIONS}
                defaultPeriod="mes"
              />
            )
          })()}
        </div>
      )}

      {/* ── LIQUIDAÇÕES TAB ── */}
      {tab==='liquidacoes' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, padding:'12px 16px', display:'flex', gap:12, alignItems:'flex-start' }}>
            <Icon name="info" size={16} color="#1890FF" />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(0,0,0,0.85)', marginBottom:4 }}>Liquidação Centralizada ativa</div>
              <div style={{ fontSize:12, color:'rgba(0,0,0,0.65)', lineHeight:'18px' }}>
                Os adquirentes creditam diretamente no <strong>domicílio bancário</strong> do sub-adquirente via registradora (CIP/CERC/TAG).
                Oneração (gravame) de <strong>R$ 140.000,00</strong> registrada como garantia de antecipações em aberto.
              </div>
            </div>
            <button style={{ border:'1px solid #91d5ff', background:'#fff', borderRadius:2, padding:'4px 12px', fontSize:12, cursor:'pointer', color:'#1890FF', whiteSpace:'nowrap' }}>Ver configuração</button>
          </div>

          {(()=>{
            const domCols: ColumnType<typeof LIQCEN_ADQS[0]>[] = [
              { title:'Adquirente', dataIndex:'adq', key:'adq', render: v => <span style={{ fontWeight:600 }}>{v}</span> },
              { title:'Registradora', dataIndex:'registradora', key:'registradora', render: v => <span style={{ background:'#f5f5f5', border:'1px solid #d9d9d9', borderRadius:2, padding:'1px 7px', fontSize:11, fontWeight:500 }}>{v}</span> },
              { title:'Domicílio bancário', dataIndex:'domicilio', key:'domicilio', render: v => <span style={{ color:'rgba(0,0,0,0.65)', fontFamily:'Roboto Mono', fontSize:11 }}>{v}</span> },
              { title:'Volume liquidado', dataIndex:'vol', key:'vol', render: v => <span style={{ fontWeight:600, color:'#52c41a' }}>{fmt(v)}</span> },
              { title:'Status', dataIndex:'status', key:'status', width:100, render: v => <Tag status={v} /> },
                            { title:'Ações', key:'actions', width:70, render: () => (
                <button title="Editar" style={{ border:'none', background:'none', color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:4, display:'flex', alignItems:'center', borderRadius:4 }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#1890FF';(e.currentTarget as HTMLElement).style.background='#f5f5f5'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.35)';(e.currentTarget as HTMLElement).style.background='none'}}>
                  <Icon name="edit" size={14} color="currentColor" />
                </button>
              ) },
            ]
            return (
              <DataTable
                title="Domicílio bancário por adquirente"
                titleExtra={<button style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, height:32, padding:'5px 16px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}><Icon name="plus" size={14} color="#fff" /> Adicionar</button>}
                columns={domCols}
                dataSource={LIQCEN_ADQS}
                rowKey="adq"
                showPagination={false}
              />
            )
          })()}

          {(()=>{
            const evCols: ColumnType<LiqEvento>[] = [
              { title:'Data', dataIndex:'data', key:'data', width:110, render: v => <span style={{ color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>{v}</span> },
              { title:'Adquirente', dataIndex:'adq', key:'adq', width:90, render: v => <span style={{ fontWeight:600 }}>{v}</span> },
              { title:'Tipo de crédito', dataIndex:'tipo', key:'tipo', render: v => <span style={{ fontSize:11, background:v.includes('Desc.')?'#fff7e6':'#e6f7ff', color:v.includes('Desc.')?'#fa8c16':'#1890FF', border:`1px solid ${v.includes('Desc.')?'#ffd591':'#91d5ff'}`, borderRadius:2, padding:'1px 6px' }}>{v}</span> },
              { title:'Bruto do lote', dataIndex:'bruto', key:'bruto', render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{fmt(v)}</span> },
              { title:'MDR / Tarifas', dataIndex:'desc', key:'desc', render: v => <span style={{ color:'#ff4d4f' }}>{fmt(v)}</span> },
              { title:'Antecipação descontada', dataIndex:'antecip', key:'antecip', render: v => <span style={{ color:v>0?'#fa8c16':'rgba(0,0,0,0.25)' }}>{v>0?fmt(v):'—'}</span> },
              { title:'Crédito líquido', dataIndex:'cred', key:'cred', render: v => <span style={{ fontWeight:600, color:'#52c41a' }}>{fmt(v)}</span> },
              { title:'Conta creditada', dataIndex:'conta', key:'conta', render: v => <span style={{ color:'rgba(0,0,0,0.45)', fontFamily:'Roboto Mono', fontSize:11 }}>{v}</span> },
              { title:'Status', dataIndex:'status', key:'status', width:90, render: v => <Tag status={v} /> },
              { title:'', key:'acao', width:56, render: (_,r) => (
                <button onClick={()=>setDrawerLiq(r)} title="Ver detalhes" style={{ border:'none', background:'none', color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:4, display:'flex', alignItems:'center', borderRadius:4 }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#1890FF';(e.currentTarget as HTMLElement).style.background='#f5f5f5'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.35)';(e.currentTarget as HTMLElement).style.background='none'}}>
                  <Icon name="eye" size={14} color="currentColor" />
                </button>
              ) },
            ]
            return (
              <>
                <DataTable<LiqEvento>
                  title="Eventos de liquidação — Abril 2026"
                  columns={evCols}
                  dataSource={LIQ_EVENTOS}
                  rowKey={(_,i)=>String(i)}
                  onExport={()=>{}}
                  periodOptions={PERIOD_OPTIONS}
                  defaultPeriod="mes"
                />
                <div style={{ padding:'12px 16px', background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, display:'flex', gap:32, justifyContent:'flex-end', alignItems:'center' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#1890FF', flex:1 }}>TOTAL — {LIQ_EVENTOS.length} eventos</span>
                  {[
                    {l:'Bruto total', v:fmt(LIQ_EVENTOS.reduce((s,r)=>s+r.bruto,0)), c:'rgba(0,0,0,0.85)'},
                    {l:'MDR total', v:fmt(LIQ_EVENTOS.reduce((s,r)=>s+r.desc,0)), c:'#ff4d4f'},
                    {l:'Antecip. descontada', v:fmt(LIQ_EVENTOS.reduce((s,r)=>s+r.antecip,0)), c:'#fa8c16'},
                    {l:'Crédito líquido', v:fmt(LIQ_EVENTOS.reduce((s,r)=>s+r.cred,0)), c:'#52c41a'},
                  ].map(s=>(
                    <div key={s.l} style={{ textAlign:'right' }}>
                      <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{s.l}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* ── ANTECIPAÇÕES TAB ── */}
      {tab==='antecipacoes' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {!dismissed.has('fin-antecip-info') && (
            <div style={{ background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, padding:'10px 16px', display:'flex', gap:10, alignItems:'flex-start', position:'relative' }}>
              <Icon name="info" size={15} color="#1890FF" />
              <div style={{ flex:1, paddingRight:20, fontSize:12, color:'rgba(0,0,0,0.65)', lineHeight:'18px' }}>
                <strong>Antecipação a merchants:</strong> o sub adianta o valor ao EC e recupera via desconto nos próximos repasses. A taxa cobrada é a receita do sub nesta operação.
              </div>
              <button onClick={() => dismiss('fin-antecip-info')} title="Fechar" style={{ position:'absolute', top:8, right:10, border:'none', background:'none', cursor:'pointer', color:'rgba(0,0,0,0.25)', display:'flex', alignItems:'center', padding:4, borderRadius:2 }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          )}

          {(()=>{
            const cols: ColumnType<AntecipEC>[] = [
              { title:'ID', dataIndex:'id', key:'id', width:90, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'#1890FF' }}>{v}</span> },
              { title:'Data', dataIndex:'data', key:'data', width:100, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
              { title:'Merchant (EC)', dataIndex:'merchant', key:'merchant', width:160, render: v => <span style={{ fontWeight:500, color:'rgba(0,0,0,0.85)', whiteSpace:'nowrap' }}>{v}</span> },
              { title:'Valor antecipado', dataIndex:'valor', key:'valor', width:140, render: v => <span style={{ fontWeight:600, color:'#1890FF', whiteSpace:'nowrap' }}>{fmt(v)}</span> },
              { title:'Taxa (a.m.)', dataIndex:'taxa', key:'taxa', width:90, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
              { title:'Juros recebidos', dataIndex:'juros', key:'juros', width:130, render: v => <span style={{ fontWeight:600, color:'#52c41a', whiteSpace:'nowrap' }}>{fmt(v)}</span> },
              { title:'Vencimento original', dataIndex:'venc', key:'venc', width:140, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
              { title:'A recuperar', dataIndex:'recuperar', key:'recuperar', width:120, render: v => <span style={{ fontWeight:600, color:v>0?'#fa8c16':'rgba(0,0,0,0.25)', whiteSpace:'nowrap' }}>{v>0?fmt(v):'—'}</span> },
              { title:'Status', dataIndex:'status', key:'status', width:110, render: v => <Tag status={v} /> },
            ]
            return (
              <>
                <DataTable<AntecipEC>
                  title="Antecipações concedidas a merchants"
                  titleExtra={
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={()=>setDrawerSim(true)} style={{ border:'1px solid #1890FF', background:'#e6f4ff', color:'#1890FF', borderRadius:2, height:32, padding:'5px 16px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                        <Icon name="barChart" size={14} color="#1890FF" /> Simular antecipação
                      </button>
                      <button style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, height:32, padding:'5px 16px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                        <Icon name="plus" size={14} color="#fff" /> Nova antecipação
                      </button>
                    </div>
                  }
                  columns={cols}
                  dataSource={ANTECIP_EC_DATA}
                  rowKey="id"
                  onExport={()=>{}}
                  periodOptions={PERIOD_OPTIONS}
                  defaultPeriod="mes"
                />
                <div style={{ padding:'12px 16px', background:'#f6ffed', border:'1px solid #b7eb8f', borderRadius:2, display:'flex', gap:24, justifyContent:'flex-end', alignItems:'center' }}>
                  <span style={{ fontSize:12, fontWeight:600, color:'#52c41a', flex:1 }}>Resumo das operações</span>
                  {[
                    { l:'Total antecipado', v:fmt(140000), c:'#1890FF' },
                    { l:'Juros a receber', v:fmt(2105), c:'#52c41a' },
                    { l:'A recuperar dos adquirentes', v:fmt(85000), c:'#fa8c16' },
                  ].map((s,i)=>(
                    <div key={i} style={{ textAlign:'right' }}>
                      <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{s.l}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>
      )}

      <DrawerLiquidacaoDetalhes open={!!drawerLiq} onClose={()=>setDrawerLiq(null)} liq={drawerLiq} />
      <DrawerSimulacaoAntecipacao open={drawerSim} onClose={()=>setDrawerSim(false)} />
    </div>
  )
}
