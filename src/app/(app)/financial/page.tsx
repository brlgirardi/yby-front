'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import { useNavStore } from '@/store/nav.store'
import DataTable, { type ColumnType, PERIOD_OPTIONS } from '@/components/ui/DataTable'
import Tag from '@/components/shared/Tag'
import Tooltip from '@/components/shared/Tooltip'
import BrandLogo from '@/components/shared/BrandLogo'

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const FINANCIAL_TABS = [
  { key:'liquidacoes',  label:'Liquidações' },
  { key:'repasses',     label:'Repasses para ECs' },
  { key:'arquivos',     label:'Arquivos' },
  { key:'antecipacoes', label:'Antecipações' },
  { key:'dre',          label:'DRE Operacional' },
]

const LIQCEN_ADQS = [
  { adq:'Adiq',   registradora:'CIP',  domicilio:'Banco Inter · Ag 0001 / CC 12345-6', status:'Ativo',    vol:521010 },
  { adq:'Rede',   registradora:'CERC', domicilio:'Banco Inter · Ag 0001 / CC 12345-6', status:'Ativo',    vol:347340 },
  { adq:'Cielo',  registradora:'TAG',  domicilio:'Banco Inter · Ag 0001 / CC 12345-6', status:'Ativo',    vol:248100 },
  { adq:'Getnet', registradora:'CIP',  domicilio:'Banco Inter · Ag 0001 / CC 12345-6', status:'Pendente', vol:124050 },
]

type Parcela = {
  nsu: string
  ec: string
  parcela: string         // "1/1", "3/12"
  valor: number
  mdr: number
  antecip: number
  travado: number
  liquido: number
  status: string
}

type LiqEvento = {
  loteId: string
  data: string
  adq: string
  bandeira: string
  bruto: number
  desc: number
  antecip: number
  travado: number
  cred: number
  conta: string
  registradora: string
  statusNuclea: string
  status: string
  parcelas: Parcela[]
}

// Helper: gera parcelas mock que somam aos totais do lote
const gen = (loteId: string, ec: string, count: number, totalBruto: number, totalMdr: number, totalAntecip: number, totalTravado: number, status: string): Parcela[] => {
  const parcelas: Parcela[] = []
  let restBruto = totalBruto, restMdr = totalMdr, restAntecip = totalAntecip, restTravado = totalTravado
  for (let i = 0; i < count; i++) {
    const last = i === count - 1
    const valor    = last ? restBruto    : Math.round(totalBruto / count)
    const mdr      = last ? restMdr      : Math.round(totalMdr / count)
    const antecip  = last ? restAntecip  : Math.round(totalAntecip / count)
    const travado  = last ? restTravado  : Math.round(totalTravado / count)
    restBruto -= valor; restMdr -= mdr; restAntecip -= antecip; restTravado -= travado
    parcelas.push({
      nsu: `${loteId}-${String(i+1).padStart(3,'0')}`,
      ec,
      parcela: `${(i % 12) + 1}/${count <= 12 ? count : 12}`,
      valor, mdr, antecip, travado,
      liquido: valor - mdr - antecip - travado,
      status,
    })
  }
  return parcelas
}

const LIQ_EVENTOS: LiqEvento[] = [
  { loteId:'L-2604-001', data:'10/04/2026', adq:'Adiq',   bandeira:'Visa',   bruto:198400, desc:5952,  antecip:0,     travado:0,      cred:192448, conta:'CC 12345-6', registradora:'Núclea', statusNuclea:'Publicado',        status:'Liquidado',
    parcelas: gen('L-2604-001','Mercado Livre', 8, 198400, 5952, 0, 0, 'Liquidado') },
  { loteId:'L-2604-002', data:'10/04/2026', adq:'Adiq',   bandeira:'Master', bruto:134200, desc:4026,  antecip:60000, travado:0,      cred:70174,  conta:'CC 12345-6', registradora:'Núclea', statusNuclea:'Publicado',        status:'Parcialmente liquidado',
    parcelas: gen('L-2604-002','Mercado Livre', 6, 134200, 4026, 60000, 0, 'Liquidado') },
  { loteId:'L-2604-003', data:'11/04/2026', adq:'Rede',   bandeira:'Visa',   bruto:87500,  desc:2625,  antecip:0,     travado:0,      cred:84875,  conta:'CC 12345-6', registradora:'Núclea', statusNuclea:'Publicado',        status:'Liquidado',
    parcelas: gen('L-2604-003','Amazon Brasil', 5, 87500, 2625, 0, 0, 'Liquidado') },
  { loteId:'L-2604-004', data:'11/04/2026', adq:'Rede',   bandeira:'Elo',    bruto:72000,  desc:2160,  antecip:30000, travado:15000,  cred:24840,  conta:'CC 12345-6', registradora:'Núclea', statusNuclea:'Publicado',        status:'Parcialmente liquidado',
    parcelas: gen('L-2604-004','Amazon Brasil', 4, 72000, 2160, 30000, 15000, 'Liquidado') },
  { loteId:'L-2604-005', data:'12/04/2026', adq:'Cielo',  bandeira:'Visa',   bruto:156700, desc:4701,  antecip:0,     travado:0,      cred:151999, conta:'CC 12345-6', registradora:'Núclea', statusNuclea:'Em processamento', status:'Em processamento',
    parcelas: gen('L-2604-005','Americanas',    7, 156700, 4701, 0, 0, 'Em processamento') },
  { loteId:'L-2604-006', data:'13/04/2026', adq:'Getnet', bandeira:'Master', bruto:83200,  desc:2496,  antecip:0,     travado:0,      cred:80704,  conta:'CC 12345-6', registradora:'Núclea', statusNuclea:'Em processamento', status:'Em processamento',
    parcelas: gen('L-2604-006','Magazine Luiza',4, 83200, 2496, 0, 0, 'Em processamento') },
  { loteId:'L-2604-007', data:'25/04/2026', adq:'Adiq',   bandeira:'Visa',   bruto:82000,  desc:2460,  antecip:0,     travado:20000,  cred:59540,  conta:'CC 12345-6', registradora:'Núclea', statusNuclea:'Publicado',        status:'Previsto',
    parcelas: gen('L-2604-007','iFood',         3, 82000, 2460, 0, 20000, 'Previsto') },
  { loteId:'L-2604-008', data:'25/04/2026', adq:'Rede',   bandeira:'Master', bruto:54000,  desc:1620,  antecip:0,     travado:0,      cred:52380,  conta:'CC 12345-6', registradora:'Núclea', statusNuclea:'Publicado',        status:'Previsto',
    parcelas: gen('L-2604-008','Shopee',        3, 54000, 1620, 0, 0, 'Previsto') },
]

const ARQUIVOS_DATA = [
  { arquivo:'captura_adiq_20260410.csv', enviado:'10/04 08:32', adq:'Adiq',   registradora:'Núclea', transacoes:142, statusNuclea:'Publicado',        erro:'' },
  { arquivo:'captura_rede_20260410.csv',  enviado:'10/04 08:35', adq:'Rede',   registradora:'Núclea', transacoes:98,  statusNuclea:'Em processamento', erro:'' },
  { arquivo:'captura_cielo_20260411.csv', enviado:'11/04 09:01', adq:'Cielo',  registradora:'Núclea', transacoes:76,  statusNuclea:'Reprovado',        erro:'Formato de data inválido na linha 34' },
  { arquivo:'captura_getnet_20260411.csv',enviado:'11/04 09:15', adq:'Getnet', registradora:'Núclea', transacoes:54,  statusNuclea:'Publicado',        erro:'' },
  { arquivo:'captura_adiq_20260425.csv',  enviado:'25/04 07:58', adq:'Adiq',   registradora:'Núclea', transacoes:118, statusNuclea:'Em processamento', erro:'' },
]
type ArquivoRow = typeof ARQUIVOS_DATA[0]

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
        { label:'Bandeira', value: liq.bandeira },
        { label:'Data', value: liq.data },
        { label:'Conta de liquidação', value: liq.conta },
        { label:'Registradora', value: liq.registradora },
        { label:'Status Núclea', value: liq.statusNuclea },
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

/* Mock CSV data for import preview */
const MOCK_CSV_IMPORT = [
  { data:'15/04/2026', adq:'Adiq',  tipo:'Crédito normal', bruto:125000, mdr:3750, antecip:0,     liquido:121250, conta:'CC 12345-6', hasError:false },
  { data:'15/04/2026', adq:'Rede',  tipo:'Crédito normal', bruto:87500,  mdr:2625, antecip:15000, liquido:69875,  conta:'CC 12345-6', hasError:false },
  { data:'16/04/2026', adq:'Xpto',  tipo:'Crédito normal', bruto:45000,  mdr:1350, antecip:0,     liquido:43650,  conta:'CC 99999-X', hasError:true, errorMsg:'Adquirente não cadastrado' },
  { data:'17/04/2026', adq:'Cielo', tipo:'Desc. antecipação', bruto:62000, mdr:1860, antecip:20000, liquido:40140, conta:'CC 12345-6', hasError:false },
]

const DrawerImportarLiquidacao = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)

  const STEPS = ['Upload', 'Validar', 'Confirmar']

  const validRows = MOCK_CSV_IMPORT.filter(r => !r.hasError)
  const errorRows = MOCK_CSV_IMPORT.filter(r => r.hasError)
  const totalBruto = validRows.reduce((s,r) => s + r.bruto, 0)
  const totalMdr = validRows.reduce((s,r) => s + r.mdr, 0)
  const totalLiquido = validRows.reduce((s,r) => s + r.liquido, 0)

  const handleClose = () => {
    setStep(0)
    setFileUploaded(false)
    onClose()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setFileUploaded(true)
  }

  return (
    <Drawer open={open} onClose={handleClose} title="Importar liquidação manual" width={640}
      footer={
        <div style={{ display:'flex', gap:12, width:'100%' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ flex:1, border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', color:'rgba(0,0,0,0.65)' }}>
              Anterior
            </button>
          )}
          {step === 0 && (
            <button onClick={handleClose} style={{ flex:1, border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', color:'rgba(0,0,0,0.65)' }}>
              Cancelar
            </button>
          )}
          {step < 2 && (
            <button
              onClick={() => { if(step === 0) setFileUploaded(true); setStep(s => s + 1) }}
              disabled={step === 0 && !fileUploaded}
              style={{ flex:2, border:'none', background: (step === 0 && !fileUploaded) ? '#d9d9d9' : '#1890FF', color:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor: (step === 0 && !fileUploaded) ? 'not-allowed' : 'pointer', fontWeight:500 }}
            >
              Próximo
            </button>
          )}
          {step === 2 && (
            <button onClick={handleClose} style={{ flex:2, border:'none', background:'#52c41a', color:'#fff', borderRadius:2, padding:'8px 0', fontSize:13, cursor:'pointer', fontWeight:500 }}>
              Executar liquidação
            </button>
          )}
        </div>
      }>
      {/* Stepper */}
      <div style={{ display:'flex', marginBottom:24, gap:8 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{
              width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600,
              background: i < step ? '#52c41a' : i === step ? '#1890FF' : '#f5f5f5',
              color: i <= step ? '#fff' : 'rgba(0,0,0,0.45)',
              border: i === step ? '2px solid #1890FF' : i < step ? '2px solid #52c41a' : '1px solid #d9d9d9'
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize:12, color: i === step ? '#1890FF' : i < step ? '#52c41a' : 'rgba(0,0,0,0.45)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 0 && (
        <div>
          <div
            onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => setFileUploaded(true)}
            style={{
              border: `2px dashed ${isDragOver ? '#1890FF' : fileUploaded ? '#52c41a' : '#d9d9d9'}`,
              borderRadius:4, padding:'40px 24px', textAlign:'center', cursor:'pointer',
              background: isDragOver ? '#e6f7ff' : fileUploaded ? '#f6ffed' : '#fafafa',
              transition:'all 0.2s'
            }}
          >
            <div style={{ marginBottom:12 }}>
              <Icon name={fileUploaded ? 'checkCircle' : 'upload'} size={40} color={fileUploaded ? '#52c41a' : '#1890FF'} />
            </div>
            {fileUploaded ? (
              <>
                <div style={{ fontSize:14, fontWeight:600, color:'#52c41a', marginBottom:4 }}>liquidacao_abril.csv</div>
                <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)' }}>4 linhas · Clique para trocar</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:14, fontWeight:500, color:'rgba(0,0,0,0.85)', marginBottom:4 }}>Arraste o arquivo CSV aqui ou clique para selecionar</div>
                <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)' }}>Formatos aceitos: .csv</div>
              </>
            )}
          </div>

          <div style={{ marginTop:20, padding:'12px 16px', background:'#fafafa', borderRadius:2 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <span style={{ fontSize:13, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>Formato esperado</span>
              <button style={{ border:'none', background:'none', color:'#1890FF', fontSize:12, cursor:'pointer', textDecoration:'underline' }}>
                Baixar template
              </button>
            </div>
            <div style={{ fontSize:12, color:'rgba(0,0,0,0.65)', lineHeight:'20px' }}>
              O arquivo deve conter as seguintes colunas:
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
              {['Data', 'Adquirente', 'Tipo', 'Bruto', 'MDR', 'Antecipação descontada', 'Crédito líquido', 'Conta'].map(col => (
                <span key={col} style={{ background:'#fff', border:'1px solid #d9d9d9', borderRadius:2, padding:'2px 8px', fontSize:11, fontFamily:'Roboto Mono' }}>{col}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Validar */}
      {step === 1 && (
        <div>
          <div style={{ marginBottom:16, display:'flex', gap:12 }}>
            <div style={{ background:'#f6ffed', border:'1px solid #b7eb8f', borderRadius:2, padding:'8px 14px', flex:1 }}>
              <span style={{ fontSize:18, fontWeight:700, color:'#52c41a' }}>{validRows.length}</span>
              <span style={{ fontSize:12, color:'rgba(0,0,0,0.65)', marginLeft:6 }}>linhas OK</span>
            </div>
            <div style={{ background: errorRows.length > 0 ? '#fff1f0' : '#f5f5f5', border:`1px solid ${errorRows.length > 0 ? '#ffa39e' : '#d9d9d9'}`, borderRadius:2, padding:'8px 14px', flex:1 }}>
              <span style={{ fontSize:18, fontWeight:700, color: errorRows.length > 0 ? '#ff4d4f' : 'rgba(0,0,0,0.25)' }}>{errorRows.length}</span>
              <span style={{ fontSize:12, color:'rgba(0,0,0,0.65)', marginLeft:6 }}>erros</span>
            </div>
          </div>

          <div style={{ border:'1px solid #f0f0f0', borderRadius:2, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:'#fafafa' }}>
                  {['Data', 'Adq', 'Tipo', 'Bruto', 'MDR', 'Líquido', 'Status'].map(h => (
                    <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontWeight:600, color:'rgba(0,0,0,0.85)', borderBottom:'1px solid #f0f0f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_CSV_IMPORT.map((row, i) => (
                  <tr key={i} style={{ background: row.hasError ? '#fff1f0' : '#fff' }}>
                    <td style={{ padding:'8px 10px', borderBottom:'1px solid #f0f0f0', color:'rgba(0,0,0,0.65)' }}>{row.data}</td>
                    <td style={{ padding:'8px 10px', borderBottom:'1px solid #f0f0f0', color: row.hasError ? '#ff4d4f' : 'rgba(0,0,0,0.85)', fontWeight:500 }}>{row.adq}</td>
                    <td style={{ padding:'8px 10px', borderBottom:'1px solid #f0f0f0', color:'rgba(0,0,0,0.65)', fontSize:11 }}>{row.tipo}</td>
                    <td style={{ padding:'8px 10px', borderBottom:'1px solid #f0f0f0', color:'rgba(0,0,0,0.85)' }}>{fmt(row.bruto)}</td>
                    <td style={{ padding:'8px 10px', borderBottom:'1px solid #f0f0f0', color:'#ff4d4f' }}>{fmt(row.mdr)}</td>
                    <td style={{ padding:'8px 10px', borderBottom:'1px solid #f0f0f0', color:'#52c41a', fontWeight:600 }}>{fmt(row.liquido)}</td>
                    <td style={{ padding:'8px 10px', borderBottom:'1px solid #f0f0f0' }}>
                      {row.hasError ? (
                        <span style={{ fontSize:10, color:'#ff4d4f', background:'#fff1f0', border:'1px solid #ffa39e', borderRadius:2, padding:'1px 6px' }}>{row.errorMsg}</span>
                      ) : (
                        <span style={{ fontSize:10, color:'#52c41a', background:'#f6ffed', border:'1px solid #b7eb8f', borderRadius:2, padding:'1px 6px' }}>OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {errorRows.length > 0 && (
            <div style={{ marginTop:12, background:'#fffbe6', border:'1px solid #ffe58f', borderRadius:2, padding:'10px 14px', fontSize:12, color:'rgba(0,0,0,0.65)' }}>
              <span style={{ marginRight:8, verticalAlign:'middle', display:'inline-flex' }}><Icon name="alertTriangle" size={14} color="#faad14" /></span>
              Linhas com erro serão ignoradas na importação. Corrija o CSV e reimporte para incluí-las.
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirmar */}
      {step === 2 && (
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.85)', marginBottom:16 }}>Resumo da importação</div>

          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {[
              { l:'Bruto total', v:fmt(totalBruto), c:'#1890FF', bg:'#e6f7ff', border:'#91d5ff' },
              { l:'MDR / Tarifas', v:fmt(totalMdr), c:'#ff4d4f', bg:'#fff1f0', border:'#ffa39e' },
              { l:'Crédito líquido', v:fmt(totalLiquido), c:'#52c41a', bg:'#f6ffed', border:'#b7eb8f' },
            ].map((s,i) => (
              <div key={i} style={{ flex:1, background:s.bg, border:`1px solid ${s.border}`, borderRadius:2, padding:'12px 10px', textAlign:'center' }}>
                <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)', marginBottom:4 }}>{s.l}</div>
                <div style={{ fontSize:15, fontWeight:700, color:s.c }}>{s.v}</div>
              </div>
            ))}
          </div>

          {[
            { label:'Eventos a importar', value:`${validRows.length} linhas` },
            { label:'Linhas ignoradas (erros)', value:`${errorRows.length} linhas` },
            { label:'Arquivo', value:'liquidacao_abril.csv' },
          ].map((r,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f0f0f0', fontSize:13 }}>
              <span style={{ color:'rgba(0,0,0,0.45)' }}>{r.label}</span>
              <span style={{ color:'rgba(0,0,0,0.85)', fontWeight:500 }}>{r.value}</span>
            </div>
          ))}

          <div style={{ marginTop:20, background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, padding:'12px 14px', fontSize:12, color:'rgba(0,0,0,0.65)', display:'flex', gap:10, alignItems:'flex-start' }}>
            <span style={{ flexShrink:0, marginTop:1, display:'flex' }}><Icon name="info" size={14} color="#1890FF" /></span>
            <span>Ao confirmar, os eventos de liquidação serão adicionados à tabela principal e estarão disponíveis para consulta e exportação.</span>
          </div>
        </div>
      )}
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
  const [drawerImport, setDrawerImport] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [liqStatusFilter, setLiqStatusFilter] = useState<string>('todos')
  const [liqViewMode, setLiqViewMode] = useState<'lote'|'parcela'>('lote')
  const [repViewMode, setRepViewMode] = useState<'lote'|'parcela'>('lote')
  const [dreMonth, setDreMonth] = useState(3)
  const [dreYear,  setDreYear]  = useState(2026)
  const prevDreMonth = () => { if (dreMonth === 0) { setDreMonth(11); setDreYear(y => y-1) } else setDreMonth(m => m-1) }
  const nextDreMonth = () => { if (dreMonth === 11) { setDreMonth(0); setDreYear(y => y+1) } else setDreMonth(m => m+1) }
  const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const dismiss = (id: string) => setDismissed(p => { const s = new Set(p); s.add(id); return s })

  type KpiCard = {
    label: string; value: string; bg: string; border: string; color: string; sub: string;
    /** Tooltip explicando o conceito (1s delay) */
    tip?: string;
    /** Delta vs período anterior, ex: "+12% vs mar/26" */
    delta?: { value: string; positive?: boolean };
    /** Status que filtra a tabela ao clicar (Liquidações + Arquivos) */
    filterStatus?: string;
  }

  const KPI_FIN: Record<string, Array<KpiCard>> = {
    liquidacoes: [
      { label:'Liquidado no mês', value:'R$ 492.337,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Créditos confirmados pelos adquirentes',
        tip:'Total já liquidado pelos adquirentes este mês. Dinheiro creditado na conta do sub. Clique para filtrar a tabela.',
        delta:{ value:'+8% vs mar/26', positive:true }, filterStatus:'Liquidado' },
      { label:'Em processamento', value:'R$ 232.703,00', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'Aguardando publicação na Núclea',
        tip:'Recebíveis enviados para a Núclea aguardando confirmação de publicação. Após publicação, o adquirente liquida na conta do sub.',
        filterStatus:'Em processamento' },
      { label:'Previsto (próx. vencimentos)', value:'R$ 111.920,00', bg:'#fffbe6', border:'#ffe58f', color:'#faad14', sub:'Parcelas a vencer — todos os adquirentes',
        tip:'Soma das parcelas com vencimento futuro confirmado pelos adquirentes. Indicador de fluxo de caixa próximo.',
        filterStatus:'Previsto' },
      { label:'Crédito travado (gravame)', value:'R$ 35.000,00', bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:'Bloqueado na Núclea — antecipação/oneração',
        tip:'Crédito existente mas bloqueado por trava de antecipação (gravame). Vai liquidar normalmente, porém para o FIDC/banco que comprou o recebível, não para o sub.' },
      { label:'MDR pago no mês', value:'R$ 23.040,00', bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'Taxa descontada pelos adquirentes',
        tip:'Total de MDR (Merchant Discount Rate) pago aos adquirentes este mês. É o custo de processamento.',
        delta:{ value:'+5% vs mar/26', positive:false } },
    ],
    repasses: [
      { label:'Repassado no mês', value:'R$ 8.861.834,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Transferido às contas dos merchants',
        tip:'Total já transferido para as contas dos ECs (merchants) este mês.',
        delta:{ value:'+12% vs mar/26', positive:true } },
      { label:'Pendente de repasse', value:'R$ 1.054.390,00', bg:'#fffbe6', border:'#ffe58f', color:'#faad14', sub:'Agendado para os próximos dias',
        tip:'Valor já liquidado pelos adquirentes que ainda será transferido aos ECs nos próximos dias.' },
      { label:'MDR retido (receita)', value:'R$ 291.309,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Spread cobrado dos merchants no mês',
        tip:'Receita do sub vinda do spread de MDR (taxa cobrada do EC menos taxa paga ao adquirente).' },
      { label:'Antecipação recolhida', value:'R$ 85.000,00', bg:'#fff7e6', border:'#ffd591', color:'#fa8c16', sub:'Retido para abater antecipações concedidas',
        tip:'Valor descontado nos repasses aos ECs para recuperar antecipações que o sub concedeu anteriormente.' },
      { label:'Reserva operacional', value:'R$ 43.200,00', bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.65)', sub:'Rolling reserve — libera em 90 dias',
        tip:'Reserva financeira (rolling reserve) retida temporariamente como garantia. Liberada em 90 dias.' },
    ],
    arquivos: [
      { label:'Arquivos publicados', value:'2', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Aceitos e processados pela Núclea',
        tip:'Arquivos CSV de captura aceitos e publicados pela Núclea (registradora). Recebíveis registrados.',
        filterStatus:'Publicado' },
      { label:'Em processamento', value:'2', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'Na fila da Núclea — aguardando retorno',
        tip:'Arquivos enviados aguardando processamento e validação da Núclea.',
        filterStatus:'Em processamento' },
      { label:'Reprovados', value:'1', bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'Rejeitados — reenvio necessário',
        tip:'Arquivos rejeitados pela Núclea por erro de formato/validação. Necessário corrigir e reenviar.',
        filterStatus:'Reprovado' },
      { label:'Transações registradas', value:'488', bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Total de transações nos arquivos publicados',
        tip:'Soma das transações contidas nos arquivos publicados na Núclea no período.' },
    ],
    antecipacoes: [
      { label:'Capital adiantado (em aberto)', value:'R$ 140.000,00', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'Saldo devedor dos ECs — a recuperar via repasses',
        tip:'Capital que o sub adiantou aos ECs e ainda não recuperou. Recuperação acontece nos próximos repasses (descontado do bruto a transferir).' },
      { label:'Antecipado no mês', value:'R$ 85.000,00', bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'3 operações em abril/26',
        tip:'Total de antecipações concedidas neste mês. Cada operação é creditada ao EC e gera saldo devedor.' },
      { label:'Taxa média cobrada dos ECs', value:'2,50% a.m.', bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Média ponderada das operações vigentes',
        tip:'Taxa média cobrada dos merchants pelas antecipações. Compare com a taxa de mercado (~3% a.m.) para avaliar competitividade.' },
      { label:'Juros recebidos (receita)', value:'R$ 2.105,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Receita gerada pelas antecipações concedidas',
        tip:'Juros já cobrados dos ECs nas antecipações concluídas. Receita financeira do sub.',
        delta:{ value:'+18% vs mar/26', positive:true } },
      { label:'Recebíveis livres (elegível)', value:'R$ 670.338,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'Parcelas sem oneração — base para novas antecipações',
        tip:'Recebíveis futuros sem trava ou gravame. Base disponível para novas operações de antecipação.' },
    ],
    dre: [
      { label:'Margem operacional', value:'R$ 14.392,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'32,6% sobre receita bruta',
        tip:'Receita bruta menos custos com adquirentes. Margem operacional do sub no período.',
        delta:{ value:'+15% vs mar/26', positive:true } },
      { label:'Receita bruta', value:'R$ 44.164,00', bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:'MDR cobrado + juros de antecipações',
        tip:'Soma da receita do mês: MDR cobrado dos ECs + juros das antecipações concedidas.',
        delta:{ value:'+9% vs mar/26', positive:true } },
      { label:'Custo com adquirentes', value:'R$ 29.772,00', bg:'#fff1f0', border:'#ffa39e', color:'#ff4d4f', sub:'MDR pago + tarifas operacionais',
        tip:'Total pago aos adquirentes (MDR + tarifas). Custo direto da operação.',
        delta:{ value:'+4% vs mar/26', positive:false } },
    ],
  }

  const currentKpis = KPI_FIN[tab] || KPI_FIN.liquidacoes

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader
        title={FINANCIAL_TABS.find(t => t.key === tab)?.label ?? 'Financeiro'}
        breadcrumb={`Sub-adquirente / Financeiro / ${FINANCIAL_TABS.find(t => t.key === tab)?.label ?? ''}`}
        onBack={() => {}}
        extra={
          tab === 'liquidacoes' ? (
            <button onClick={()=>setDrawerImport(true)} style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, height:32, padding:'5px 16px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontWeight:500 }}>
              <Icon name="download" size={14} color="#fff" /> Importar CSV
            </button>
          ) : tab === 'repasses' ? (
            <button onClick={()=>setDrawerImport(true)} style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, height:32, padding:'5px 16px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontWeight:500 }}>
              <Icon name="download" size={14} color="#fff" /> Importar CSV
            </button>
          ) : tab === 'arquivos' ? (
            <button onClick={()=>setDrawerImport(true)} style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, height:32, padding:'5px 16px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontWeight:500 }}>
              <Icon name="download" size={14} color="#fff" /> Importar CSV
            </button>
          ) : tab === 'antecipacoes' ? (
            <button onClick={()=>setDrawerSim(true)} style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, height:32, padding:'5px 16px', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontWeight:500 }}>
              <Icon name="barChart" size={14} color="#fff" /> Simular antecipação
            </button>
          ) : undefined
        }
      />

      {/* KPI cards */}
      <div style={{ padding:'16px 24px 0', display:'flex', gap:16 }}>
        {currentKpis.map((k,i) => {
          const clickable = !!k.filterStatus && tab === 'liquidacoes'
          const isActive = clickable && liqStatusFilter === k.filterStatus
          const card = (
            <div
              onClick={() => {
                if (!clickable) return
                setLiqStatusFilter(isActive ? 'todos' : (k.filterStatus as string))
              }}
              style={{
                width:'100%',
                background:k.bg, border:`${isActive?2:1}px solid ${isActive?k.color:k.border}`,
                borderRadius:2, padding: isActive ? '13px 17px' : '14px 18px',
                cursor: clickable ? 'pointer' : 'default',
                transition:'all 0.15s',
                position:'relative',
                boxSizing:'border-box',
              }}
              onMouseEnter={e => { if (clickable && !isActive) (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6, gap:8 }}>
                <span style={{ fontSize:12, color:'rgba(0,0,0,0.65)', fontWeight:500 }}>{k.label}</span>
                {clickable && (
                  <span style={{ fontSize:10, color:k.color, fontWeight:500, opacity:0.7, whiteSpace:'nowrap' }}>
                    {isActive ? 'Filtrado ✓' : 'Filtrar'}
                  </span>
                )}
              </div>
              <div style={{ fontSize:20, fontWeight:700, color:k.color, marginBottom:4 }}>{k.value}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                <span style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{k.sub}</span>
                {k.delta && (
                  <span style={{
                    fontSize:10, fontWeight:600,
                    color: k.delta.positive ? '#52c41a' : '#ff4d4f',
                    background: k.delta.positive ? '#f6ffed' : '#fff1f0',
                    border: `1px solid ${k.delta.positive ? '#b7eb8f' : '#ffa39e'}`,
                    borderRadius:2, padding:'1px 5px',
                  }}>
                    {k.delta.positive ? '↑' : '↓'} {k.delta.value}
                  </span>
                )}
              </div>
            </div>
          )
          return k.tip
            ? <Tooltip key={i} text={k.tip} delay={1000} bare style={{ flex:1, display:'flex' }}>{card}</Tooltip>
            : <div key={i} style={{ flex:1, display:'flex' }}>{card}</div>
        })}
      </div>

      {/* ── EXTRATO TAB ── */}
      {/* ── LIQUIDAÇÕES TAB ── */}
      {tab==='liquidacoes' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {/* Filtros de status */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {(['todos','Liquidado','Parcialmente liquidado','Em processamento','Previsto','Crédito bloqueado'] as const).map(s => (
              <button key={s} onClick={() => setLiqStatusFilter(s)}
                style={{ border:`1px solid ${liqStatusFilter===s?'#1890FF':'#d9d9d9'}`, borderRadius:12, padding:'3px 14px', fontSize:12, cursor:'pointer', background:liqStatusFilter===s?'#1890FF':'#fff', color:liqStatusFilter===s?'#fff':'rgba(0,0,0,0.55)', fontWeight:liqStatusFilter===s?500:400, transition:'all 0.15s' }}>
                {s === 'todos' ? 'Todos' : s}
              </button>
            ))}
          </div>

          {(()=>{
            const filtered = liqStatusFilter === 'todos' ? LIQ_EVENTOS : LIQ_EVENTOS.filter(r => r.status === liqStatusFilter)
            const STATUS_NUCLEA_STYLE: Record<string,{bg:string;color:string;border:string}> = {
              'Publicado':        { bg:'#f6ffed', color:'#389e0d', border:'#b7eb8f' },
              'Em processamento': { bg:'#e6f7ff', color:'#1890FF', border:'#91d5ff' },
              'Reprovado':        { bg:'#fff1f0', color:'#ff4d4f', border:'#ffa39e' },
            }
            const STATUS_NUCLEA_TIPS: Record<string,string> = {
              'Publicado':        'Recebível registrado e publicado pela Núclea. Pronto para liquidação pelo adquirente.',
              'Em processamento': 'Arquivo de captura enviado para a Núclea. Aguardando validação e publicação (geralmente até 24h).',
              'Reprovado':        'Núclea rejeitou o registro do recebível por inconsistência no arquivo. Necessário corrigir e reenviar em Financeiro → Arquivos.',
            }
            const evCols: ColumnType<LiqEvento>[] = [
              { title:'Lote', dataIndex:'loteId', key:'loteId', width:130, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'#1890FF' }}>{v}</span> },
              { title:'Data', dataIndex:'data', key:'data', width:110, render: v => <span style={{ color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>{v}</span> },
              { title:'Adquirente', dataIndex:'adq', key:'adq', width:120, render: v => <BrandLogo brand={v} size={20} showLabel /> },
              { title:'Bandeira', dataIndex:'bandeira', key:'bandeira', width:110, render: v => <BrandLogo brand={v} size={20} showLabel /> },
              { title:'Parcelas', key:'qtd', width:90, render: (_,r) => <span style={{ color:'rgba(0,0,0,0.65)' }}>{r.parcelas.length}</span> },
              { title:'Crédito bruto', dataIndex:'bruto', key:'bruto', render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{fmt(v)}</span> },
              { title:'MDR pago', dataIndex:'desc', key:'desc', render: v => <span style={{ color:'#ff4d4f' }}>{fmt(v)}</span> },
              { title:'Antecipação debitada', dataIndex:'antecip', key:'antecip', render: v => <span style={{ color:v>0?'#fa8c16':'rgba(0,0,0,0.2)' }}>{v>0?fmt(v):'—'}</span> },
              { title:'Crédito travado', dataIndex:'travado', key:'travado', render: v => v>0
                ? <Tooltip text="Crédito bloqueado na Núclea por trava de antecipação (gravame). O dinheiro vai liquidar normalmente, mas para o FIDC/banco que comprou o recebível, não para o sub." delay={1000} bare>
                    <span style={{ color:'#722ED1', fontWeight:500, borderBottom:'1px dotted #722ED1', cursor:'help' }}>{fmt(v)}</span>
                  </Tooltip>
                : <span style={{ color:'rgba(0,0,0,0.2)' }}>—</span> },
              { title:'Líquido a receber', dataIndex:'cred', key:'cred', render: v => <span style={{ fontWeight:600, color:'#52c41a' }}>{fmt(v)}</span> },
              { title:'Núclea', dataIndex:'statusNuclea', key:'statusNuclea', width:130, render: v => {
                const s = STATUS_NUCLEA_STYLE[v] || STATUS_NUCLEA_STYLE['Em processamento']
                const tip = STATUS_NUCLEA_TIPS[v] || ''
                const badge = <span style={{ fontSize:11, background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:2, padding:'1px 6px', fontWeight:500, whiteSpace:'nowrap', cursor: tip ? 'help' : 'default' }}>{v}</span>
                return tip
                  ? <Tooltip text={tip} delay={1000} bare>{badge}</Tooltip>
                  : badge
              }},
              { title:'Status', dataIndex:'status', key:'status', width:160, render: v => <Tag status={v} /> },
              { title:'', key:'acao', width:56, render: (_,r) => (
                <button onClick={()=>setDrawerLiq(r)} title="Ver detalhes" style={{ border:'none', background:'none', color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:4, display:'flex', alignItems:'center', borderRadius:4 }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#1890FF';(e.currentTarget as HTMLElement).style.background='#f5f5f5'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.35)';(e.currentTarget as HTMLElement).style.background='none'}}>
                  <Icon name="eye" size={14} color="currentColor" />
                </button>
              ) },
            ]

            // Visão "Por parcela" — achata
            type ParcelaFlat = Parcela & { loteId: string; data: string; adq: string; bandeira: string; statusNuclea: string }
            const flatParcelas: ParcelaFlat[] = filtered.flatMap(l =>
              l.parcelas.map(p => ({ ...p, loteId: l.loteId, data: l.data, adq: l.adq, bandeira: l.bandeira, statusNuclea: l.statusNuclea }))
            )
            const parcelaCols: ColumnType<ParcelaFlat>[] = [
              { title:'Lote', dataIndex:'loteId', key:'loteId', width:130, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'#1890FF' }}>{v}</span> },
              { title:'NSU', dataIndex:'nsu', key:'nsu', width:140, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.65)' }}>{v}</span> },
              { title:'Data', dataIndex:'data', key:'data', width:110, render: v => <span style={{ color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>{v}</span> },
              { title:'Adquirente', dataIndex:'adq', key:'adq', width:120, render: v => <BrandLogo brand={v} size={20} showLabel /> },
              { title:'Bandeira', dataIndex:'bandeira', key:'bandeira', width:110, render: v => <BrandLogo brand={v} size={20} showLabel /> },
              { title:'EC', dataIndex:'ec', key:'ec', width:140, render: v => <span style={{ color:'rgba(0,0,0,0.85)', fontWeight:500 }}>{v}</span> },
              { title:'Parcela', dataIndex:'parcela', key:'parcela', width:80, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11 }}>{v}</span> },
              { title:'Valor', dataIndex:'valor', key:'valor', render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{fmt(v)}</span> },
              { title:'MDR', dataIndex:'mdr', key:'mdr', render: v => <span style={{ color:'#ff4d4f' }}>{fmt(v)}</span> },
              { title:'Antecip.', dataIndex:'antecip', key:'antecip', render: v => <span style={{ color:v>0?'#fa8c16':'rgba(0,0,0,0.2)' }}>{v>0?fmt(v):'—'}</span> },
              { title:'Travado', dataIndex:'travado', key:'travado', render: v => v>0
                ? <span style={{ color:'#722ED1', fontWeight:500 }}>{fmt(v)}</span>
                : <span style={{ color:'rgba(0,0,0,0.2)' }}>—</span> },
              { title:'Líquido', dataIndex:'liquido', key:'liquido', render: v => <span style={{ fontWeight:600, color:'#52c41a' }}>{fmt(v)}</span> },
              { title:'Status', dataIndex:'status', key:'status', width:140, render: v => <Tag status={v} /> },
            ]

            const ViewToggle = (
              <div style={{ display:'inline-flex', border:'1px solid #d9d9d9', borderRadius:2, overflow:'hidden' }}>
                {([['lote','Por lote'],['parcela','Por parcela']] as const).map(([key,label]) => (
                  <button key={key} onClick={()=>setLiqViewMode(key)}
                    style={{ border:'none', padding:'5px 14px', fontSize:13, cursor:'pointer',
                      background: liqViewMode===key ? '#1890FF' : '#fff',
                      color: liqViewMode===key ? '#fff' : 'rgba(0,0,0,0.65)',
                      fontWeight: liqViewMode===key ? 500 : 400 }}>
                    {label}
                  </button>
                ))}
              </div>
            )

            // Render expandido — parcelas dentro do lote
            const expandedRowRender = (record: LiqEvento) => (
              <div style={{ padding:'8px 0 8px 24px', background:'#fafafa' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'rgba(0,0,0,0.45)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
                  Parcelas que compõem o lote {record.loteId} ({record.parcelas.length})
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, background:'#fff', border:'1px solid #f0f0f0' }}>
                  <thead>
                    <tr style={{ background:'#fafafa' }}>
                      {['NSU','EC','Parcela','Valor','MDR','Antecip.','Travado','Líquido','Status'].map(h => (
                        <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontWeight:500, color:'rgba(0,0,0,0.65)', borderBottom:'1px solid #f0f0f0', fontSize:11, textTransform:'uppercase', letterSpacing:'0.4px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {record.parcelas.map((p,i) => (
                      <tr key={i} style={{ borderBottom:'1px solid #f5f5f5' }}>
                        <td style={{ padding:'8px 12px', fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.55)' }}>{p.nsu}</td>
                        <td style={{ padding:'8px 12px', fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{p.ec}</td>
                        <td style={{ padding:'8px 12px', fontFamily:'Roboto Mono', fontSize:11 }}>{p.parcela}</td>
                        <td style={{ padding:'8px 12px', color:'rgba(0,0,0,0.85)' }}>{fmt(p.valor)}</td>
                        <td style={{ padding:'8px 12px', color:'#ff4d4f' }}>{fmt(p.mdr)}</td>
                        <td style={{ padding:'8px 12px', color:p.antecip>0?'#fa8c16':'rgba(0,0,0,0.2)' }}>{p.antecip>0?fmt(p.antecip):'—'}</td>
                        <td style={{ padding:'8px 12px', color:p.travado>0?'#722ED1':'rgba(0,0,0,0.2)', fontWeight:p.travado>0?500:400 }}>{p.travado>0?fmt(p.travado):'—'}</td>
                        <td style={{ padding:'8px 12px', fontWeight:600, color:'#52c41a' }}>{fmt(p.liquido)}</td>
                        <td style={{ padding:'8px 12px' }}><Tag status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

            return (
              <>
                {liqViewMode === 'lote' ? (
                  <DataTable<LiqEvento>
                    title="Recebimentos dos adquirentes — Abril 2026"
                    titleExtra={ViewToggle}
                    columns={evCols}
                    dataSource={filtered}
                    rowKey="loteId"
                    onExport={()=>{}}
                    periodOptions={PERIOD_OPTIONS}
                    defaultPeriod="mes"
                    expandable={{ expandedRowRender, rowExpandable: r => r.parcelas.length > 0 }}
                  />
                ) : (
                  <DataTable<ParcelaFlat>
                    title="Parcelas dos lotes — Abril 2026"
                    titleExtra={ViewToggle}
                    columns={parcelaCols}
                    dataSource={flatParcelas}
                    rowKey={r => `${r.loteId}-${r.nsu}`}
                    onExport={()=>{}}
                    periodOptions={PERIOD_OPTIONS}
                    defaultPeriod="mes"
                  />
                )}
                <div style={{ padding:'12px 16px', background:'#f6ffed', border:'1px solid #b7eb8f', borderRadius:2, display:'flex', gap:32, justifyContent:'flex-end', alignItems:'center' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#52c41a', flex:1 }}>
                    TOTAL — {liqViewMode==='lote' ? `${filtered.length} lotes` : `${flatParcelas.length} parcelas`}
                  </span>
                  {[
                    {l:'Bruto', v:fmt(filtered.reduce((s,r)=>s+r.bruto,0)), c:'rgba(0,0,0,0.85)'},
                    {l:'MDR pago', v:fmt(filtered.reduce((s,r)=>s+r.desc,0)), c:'#ff4d4f'},
                    {l:'Antecipação debitada', v:fmt(filtered.reduce((s,r)=>s+r.antecip,0)), c:'#fa8c16'},
                    {l:'Crédito travado', v:fmt(filtered.reduce((s,r)=>s+r.travado,0)), c:'#722ED1'},
                    {l:'Líquido a receber', v:fmt(filtered.reduce((s,r)=>s+r.cred,0)), c:'#52c41a'},
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

      {/* ── REPASSES PARA ECS TAB ── */}
      {tab==='repasses' && (()=>{
        type RepTx = { nsu: string; data: string; adq: string; bandeira: string; parcela: string; valor: number; mdr: number; antecip: number; liquido: number }
        type PRow = { repId: string; name: string; cnpj: string; data: string; bruto: number; taxa: number; antecipRecolhida: number; rep: number; conta: string; status: string; transacoes: RepTx[] }

        const genTx = (count: number, totalBruto: number, totalMdr: number, totalAntecip: number, adqs: string[], bandeiras: string[]): RepTx[] => {
          const txs: RepTx[] = []
          let restB = totalBruto, restM = totalMdr, restA = totalAntecip
          for (let i = 0; i < count; i++) {
            const last = i === count - 1
            const valor = last ? restB : Math.round(totalBruto / count)
            const mdr = last ? restM : Math.round(totalMdr / count)
            const antecip = last ? restA : Math.round(totalAntecip / count)
            restB -= valor; restM -= mdr; restA -= antecip
            txs.push({
              nsu: `TX-${String(100000 + Math.floor(Math.random()*900000))}`,
              data: '2x/04/2026',
              adq: adqs[i % adqs.length],
              bandeira: bandeiras[i % bandeiras.length],
              parcela: `${(i % 12) + 1}/12`,
              valor, mdr, antecip,
              liquido: valor - mdr - antecip,
            })
          }
          return txs
        }

        const PAGAMENTOS_DATA: PRow[] = [
          { repId:'R-2604-001', name:'Mercado Livre',   cnpj:'03.007.331/0001-41', data:'10/04/2026', bruto:3450200, taxa:103506, antecipRecolhida:0,     rep:3346694, conta:'AG 0001 / CC 12345-6', status:'Repassado',
            transacoes: genTx(12, 3450200, 103506, 0, ['Adiq','Rede'], ['Visa','Master']) },
          { repId:'R-2604-002', name:'Amazon Brasil',   cnpj:'15.436.940/0001-03', data:'10/04/2026', bruto:2180700, taxa:65421,  antecipRecolhida:28000, rep:2087279, conta:'AG 0001 / CC 23456-7', status:'Repassado',
            transacoes: genTx(10, 2180700, 65421, 28000, ['Cielo','Adiq'], ['Visa','Elo']) },
          { repId:'R-2604-003', name:'Americanas S.A.', cnpj:'00.776.574/0001-56', data:'11/04/2026', bruto:1240500, taxa:37215,  antecipRecolhida:45000, rep:1158285, conta:'AG 0001 / CC 34567-8', status:'Repassado',
            transacoes: genTx(8, 1240500, 37215, 45000, ['Rede','Getnet'], ['Master','Visa']) },
          { repId:'R-2604-004', name:'Magazine Luiza',  cnpj:'47.960.950/0001-21', data:'12/04/2026', bruto:987200,  taxa:29616,  antecipRecolhida:0,     rep:957584,  conta:'AG 0001 / CC 45678-9', status:'Repassado',
            transacoes: genTx(7, 987200, 29616, 0, ['Adiq'], ['Visa','Elo']) },
          { repId:'R-2604-005', name:'iFood Ltda',      cnpj:'14.380.200/0001-21', data:'25/04/2026', bruto:654900,  taxa:19647,  antecipRecolhida:12000, rep:623253,  conta:'AG 0002 / CC 56789-0', status:'Pendente',
            transacoes: genTx(5, 654900, 19647, 12000, ['Cielo'], ['Master']) },
          { repId:'R-2604-006', name:'Shopee Brasil',   cnpj:'35.060.991/0001-56', data:'25/04/2026', bruto:432100,  taxa:12963,  antecipRecolhida:0,     rep:419137,  conta:'AG 0002 / CC 67890-1', status:'Pendente',
            transacoes: genTx(4, 432100, 12963, 0, ['Rede','Cielo'], ['Visa']) },
          { repId:'R-2604-007', name:'Rappi Brasil',    cnpj:'28.665.021/0001-89', data:'13/04/2026', bruto:765400,  taxa:22962,  antecipRecolhida:0,     rep:742438,  conta:'AG 0001 / CC 78901-2', status:'Repassado',
            transacoes: genTx(6, 765400, 22962, 0, ['Adiq'], ['Master','Visa']) },
        ]

        const cols: ColumnType<PRow>[] = [
          { title:'Repasse', dataIndex:'repId', key:'repId', width:130, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'#1890FF' }}>{v}</span> },
          { title:'Merchant (EC)', dataIndex:'name', key:'name', render: v => <span style={{ fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{v}</span> },
          { title:'CNPJ', dataIndex:'cnpj', key:'cnpj', render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.45)' }}>{v}</span> },
          { title:'Data repasse', dataIndex:'data', key:'data', width:110 },
          { title:'Transações', key:'qtd', width:100, render: (_,r) => <span style={{ color:'rgba(0,0,0,0.65)' }}>{r.transacoes.length}</span> },
          { title:'Bruto vendas', dataIndex:'bruto', key:'bruto', render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{fmt(v)}</span> },
          { title:'MDR retido', dataIndex:'taxa', key:'taxa', render: v => <span style={{ color:'#ff4d4f' }}>{fmt(v)}</span> },
          { title:'Antecip. recolhida', dataIndex:'antecipRecolhida', key:'antecipRecolhida', render: v => v>0
            ? <span style={{ color:'#fa8c16', fontWeight:500 }}>{fmt(v)}</span>
            : <span style={{ color:'rgba(0,0,0,0.2)' }}>—</span> },
          { title:'Valor repassado', dataIndex:'rep', key:'rep', render: v => <span style={{ fontWeight:600, color:'#52c41a' }}>{fmt(v)}</span> },
          { title:'Conta destino', dataIndex:'conta', key:'conta', render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.45)' }}>{v}</span> },
          { title:'Status', dataIndex:'status', key:'status', width:100, render: v => <Tag status={v} /> },
        ]

        type TxFlat = RepTx & { repId: string; name: string; cnpj: string; data: string }
        const flatTx: TxFlat[] = PAGAMENTOS_DATA.flatMap(r =>
          r.transacoes.map(t => ({ ...t, repId: r.repId, name: r.name, cnpj: r.cnpj, data: r.data }))
        )
        const txCols: ColumnType<TxFlat>[] = [
          { title:'Repasse', dataIndex:'repId', key:'repId', width:130, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'#1890FF' }}>{v}</span> },
          { title:'NSU', dataIndex:'nsu', key:'nsu', width:130, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.65)' }}>{v}</span> },
          { title:'Merchant (EC)', dataIndex:'name', key:'name', render: v => <span style={{ fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{v}</span> },
          { title:'Adquirente', dataIndex:'adq', key:'adq', width:120, render: v => <BrandLogo brand={v} size={20} showLabel /> },
          { title:'Bandeira', dataIndex:'bandeira', key:'bandeira', width:110, render: v => <BrandLogo brand={v} size={20} showLabel /> },
          { title:'Parcela', dataIndex:'parcela', key:'parcela', width:80, render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11 }}>{v}</span> },
          { title:'Valor', dataIndex:'valor', key:'valor', render: v => <span style={{ color:'rgba(0,0,0,0.85)' }}>{fmt(v)}</span> },
          { title:'MDR', dataIndex:'mdr', key:'mdr', render: v => <span style={{ color:'#ff4d4f' }}>{fmt(v)}</span> },
          { title:'Antecip.', dataIndex:'antecip', key:'antecip', render: v => v>0
            ? <span style={{ color:'#fa8c16', fontWeight:500 }}>{fmt(v)}</span>
            : <span style={{ color:'rgba(0,0,0,0.2)' }}>—</span> },
          { title:'Líquido', dataIndex:'liquido', key:'liquido', render: v => <span style={{ fontWeight:600, color:'#52c41a' }}>{fmt(v)}</span> },
        ]

        const ViewToggle = (
          <div style={{ display:'inline-flex', border:'1px solid #d9d9d9', borderRadius:2, overflow:'hidden' }}>
            {([['lote','Por repasse'],['parcela','Por transação']] as const).map(([key,label]) => (
              <button key={key} onClick={()=>setRepViewMode(key)}
                style={{ border:'none', padding:'5px 14px', fontSize:13, cursor:'pointer',
                  background: repViewMode===key ? '#1890FF' : '#fff',
                  color: repViewMode===key ? '#fff' : 'rgba(0,0,0,0.65)',
                  fontWeight: repViewMode===key ? 500 : 400 }}>
                {label}
              </button>
            ))}
          </div>
        )

        const expandedRowRender = (record: PRow) => (
          <div style={{ padding:'8px 0 8px 24px', background:'#fafafa' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'rgba(0,0,0,0.45)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
              Transações que compõem o repasse {record.repId} ({record.transacoes.length})
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, background:'#fff', border:'1px solid #f0f0f0' }}>
              <thead>
                <tr style={{ background:'#fafafa' }}>
                  {['NSU','Adquirente','Bandeira','Parcela','Valor','MDR','Antecip.','Líquido'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontWeight:500, color:'rgba(0,0,0,0.65)', borderBottom:'1px solid #f0f0f0', fontSize:11, textTransform:'uppercase', letterSpacing:'0.4px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {record.transacoes.map((t,i) => (
                  <tr key={i} style={{ borderBottom:'1px solid #f5f5f5' }}>
                    <td style={{ padding:'8px 12px', fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.55)' }}>{t.nsu}</td>
                    <td style={{ padding:'8px 12px' }}><BrandLogo brand={t.adq} size={18} showLabel /></td>
                    <td style={{ padding:'8px 12px' }}><BrandLogo brand={t.bandeira} size={18} showLabel /></td>
                    <td style={{ padding:'8px 12px', fontFamily:'Roboto Mono', fontSize:11 }}>{t.parcela}</td>
                    <td style={{ padding:'8px 12px', color:'rgba(0,0,0,0.85)' }}>{fmt(t.valor)}</td>
                    <td style={{ padding:'8px 12px', color:'#ff4d4f' }}>{fmt(t.mdr)}</td>
                    <td style={{ padding:'8px 12px', color:t.antecip>0?'#fa8c16':'rgba(0,0,0,0.2)' }}>{t.antecip>0?fmt(t.antecip):'—'}</td>
                    <td style={{ padding:'8px 12px', fontWeight:600, color:'#52c41a' }}>{fmt(t.liquido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

        return (
          <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, padding:'10px 20px', display:'flex', gap:20, alignItems:'center', alignSelf:'flex-start' }}>
              <div>
                <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>Reserva operacional (rolling reserve)</div>
                <div style={{ fontSize:16, fontWeight:700, color:'#722ED1' }}>R$ 43.200,00</div>
              </div>
              <div style={{ width:1, height:32, background:'#f0f0f0' }} />
              <div>
                <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>Retenção aplicada</div>
                <div style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.65)' }}>3% · libera em 90d</div>
              </div>
            </div>
            {repViewMode === 'lote' ? (
              <DataTable<PRow>
                title="Repasses a merchants — Abril 2026"
                titleExtra={ViewToggle}
                columns={cols}
                dataSource={PAGAMENTOS_DATA}
                rowKey="repId"
                onExport={()=>{}}
                periodOptions={PERIOD_OPTIONS}
                defaultPeriod="mes"
                expandable={{ expandedRowRender, rowExpandable: r => r.transacoes.length > 0 }}
              />
            ) : (
              <DataTable<TxFlat>
                title="Transações dos repasses — Abril 2026"
                titleExtra={ViewToggle}
                columns={txCols}
                dataSource={flatTx}
                rowKey={r => `${r.repId}-${r.nsu}`}
                onExport={()=>{}}
                periodOptions={PERIOD_OPTIONS}
                defaultPeriod="mes"
              />
            )}
          </div>
        )
      })()}

      {/* ── ARQUIVOS TAB ── */}
      {tab==='arquivos' && (()=>{
        const STATUS_NUCLEA_STYLE: Record<string,{bg:string;color:string;border:string}> = {
          'Publicado':        { bg:'#f6ffed', color:'#389e0d', border:'#b7eb8f' },
          'Em processamento': { bg:'#e6f7ff', color:'#1890FF', border:'#91d5ff' },
          'Reprovado':        { bg:'#fff1f0', color:'#ff4d4f', border:'#ffa39e' },
        }
        const STATUS_NUCLEA_TIPS: Record<string,string> = {
          'Publicado':        'Arquivo aceito pela Núclea. Recebíveis registrados com sucesso.',
          'Em processamento': 'Aguardando validação da Núclea (geralmente até 24h).',
          'Reprovado':        'Arquivo rejeitado por erro de formato ou validação. Veja o erro e reenvie.',
        }
        const noReprovados = ARQUIVOS_DATA.filter(a => a.statusNuclea === 'Reprovado').length === 0
        const cols: ColumnType<ArquivoRow>[] = [
          { title:'Arquivo', dataIndex:'arquivo', key:'arquivo', render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.65)' }}>{v}</span> },
          { title:'Enviado em', dataIndex:'enviado', key:'enviado', width:110, render: v => <span style={{ color:'rgba(0,0,0,0.55)' }}>{v}</span> },
          { title:'Adquirente', dataIndex:'adq', key:'adq', width:120, render: v => <BrandLogo brand={v} size={20} showLabel /> },
          { title:'Registradora', dataIndex:'registradora', key:'registradora', width:120, render: v => <BrandLogo brand={v} size={20} showLabel /> },
          { title:'Transações', dataIndex:'transacoes', key:'transacoes', width:100, render: v => <span style={{ color:'rgba(0,0,0,0.65)' }}>{v}</span> },
          { title:'Status Núclea', dataIndex:'statusNuclea', key:'statusNuclea', width:150, render: v => {
            const s = STATUS_NUCLEA_STYLE[v] || STATUS_NUCLEA_STYLE['Em processamento']
            const tip = STATUS_NUCLEA_TIPS[v] || ''
            const badge = <span style={{ fontSize:11, background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:2, padding:'2px 8px', fontWeight:600, cursor: tip ? 'help' : 'default' }}>{v}</span>
            return tip ? <Tooltip text={tip} delay={1000} bare>{badge}</Tooltip> : badge
          }},
          { title:'Erro', dataIndex:'erro', key:'erro', render: v => v
            ? <span style={{ fontSize:11, color:'#ff4d4f' }}>{v}</span>
            : <span style={{ color:'rgba(0,0,0,0.2)' }}>—</span> },
          { title:'Ações', key:'acoes', width:100, render: (_,r) => (
            <div style={{ display:'flex', gap:6 }}>
              <button title="Ver detalhes" style={{ border:'none', background:'none', color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:4, display:'flex', alignItems:'center', borderRadius:4 }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#1890FF';(e.currentTarget as HTMLElement).style.background='#f5f5f5'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.35)';(e.currentTarget as HTMLElement).style.background='none'}}>
                <Icon name="eye" size={14} color="currentColor" />
              </button>
              {r.statusNuclea === 'Reprovado' && (
                <button title="Reenviar" style={{ border:'1px solid #ff4d4f', background:'#fff1f0', color:'#ff4d4f', cursor:'pointer', padding:'2px 8px', display:'flex', alignItems:'center', borderRadius:2, fontSize:11 }}>
                  Reenviar
                </button>
              )}
            </div>
          )},
        ]
        return (
          <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
            {noReprovados && (
              <div style={{ background:'#f6ffed', border:'1px solid #b7eb8f', borderRadius:2, padding:'10px 16px', display:'flex', gap:10, alignItems:'center' }}>
                <Icon name="checkCircle" size={16} color="#52c41a" />
                <span style={{ fontSize:13, color:'#237804', fontWeight:500 }}>
                  Tudo certo na Núclea — nenhum arquivo reprovado no período.
                </span>
              </div>
            )}
            <DataTable<ArquivoRow>
              title="Fila de processamento — Núclea"
              columns={cols}
              dataSource={ARQUIVOS_DATA}
              rowKey="arquivo"
              onExport={()=>{}}
              periodOptions={PERIOD_OPTIONS}
              defaultPeriod="mes"
            />
          </div>
        )
      })()}

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
                    { l:'Juros recebidos', v:fmt(2105), c:'#52c41a' },
                    { l:'A recuperar via repasses', v:fmt(85000), c:'#fa8c16' },
                  ].map((s,i)=>(
                    <div key={i} style={{ textAlign:'right' }}>
                      <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{s.l}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* Fluxo de recuperação */}
                <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ padding:'14px 20px', borderBottom:'1px solid #f0f0f0' }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>Fluxo de recuperação</div>
                    <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)', marginTop:2 }}>Parcelas futuras com oneração — o sub desconta no próximo repasse ao EC</div>
                  </div>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                      <thead>
                        <tr style={{ background:'#fafafa' }}>
                          {['Vencimento','EC (merchant)','Adquirente','Valor da parcela','Desconto antecip.','Saldo após recuperação','Operação'].map(h => (
                            <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontWeight:500, color:'rgba(0,0,0,0.85)', borderBottom:'1px solid #f0f0f0', whiteSpace:'nowrap', fontSize:12 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { venc:'05/05/2026', ec:'Mercado Livre',  adq:'Adiq',  parcela:22500, desconto:22500, saldo:22500, op:'AEC-001' },
                          { venc:'05/05/2026', ec:'Mercado Livre',  adq:'Adiq',  parcela:22500, desconto:22500, saldo:0,     op:'AEC-001' },
                          { venc:'05/05/2026', ec:'Amazon Brasil',  adq:'Rede',  parcela:14000, desconto:14000, saldo:14000, op:'AEC-002' },
                          { venc:'05/05/2026', ec:'Amazon Brasil',  adq:'Rede',  parcela:14000, desconto:14000, saldo:0,     op:'AEC-002' },
                          { venc:'08/05/2026', ec:'Rappi Brasil',   adq:'Cielo', parcela:12000, desconto:12000, saldo:0,     op:'AEC-003' },
                        ].map((r,i) => (
                          <tr key={i} style={{ borderBottom:'1px solid #f0f0f0', background:'#fff' }}
                            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#fafafa'}
                            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#fff'}>
                            <td style={{ padding:'9px 14px', color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>{r.venc}</td>
                            <td style={{ padding:'9px 14px', fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{r.ec}</td>
                            <td style={{ padding:'9px 14px', color:'rgba(0,0,0,0.65)' }}>{r.adq}</td>
                            <td style={{ padding:'9px 14px', color:'rgba(0,0,0,0.85)' }}>{fmt(r.parcela)}</td>
                            <td style={{ padding:'9px 14px', color:'#fa8c16', fontWeight:500 }}>{fmt(r.desconto)}</td>
                            <td style={{ padding:'9px 14px', fontWeight:600, color:r.saldo>0?'#fa8c16':'#52c41a' }}>{r.saldo>0?fmt(r.saldo):'Quitado'}</td>
                            <td style={{ padding:'9px 14px', color:'#1890FF', fontFamily:'Roboto Mono', fontSize:11 }}>{r.op}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* ── DRE OPERACIONAL TAB ── */}
      {tab==='dre' && (
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
          {/* Bloco "Posição de caixa" — separado da DRE (é balanço, não resultado) */}
          <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2 }}>
            <div style={{ padding:'12px 20px', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>Posição de caixa</div>
                <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)', marginTop:2 }}>Saldos de balanço — não compõem a DRE do período</div>
              </div>
            </div>
            <div style={{ padding:'14px 20px', display:'flex', gap:24 }}>
              <Tooltip text="Saldo financeiro em trânsito — já recebido dos adquirentes e ainda não repassado aos ECs. Posição de balanço (não é resultado)." delay={1000} bare style={{ flex:1, display:'flex' }}>
                <div style={{ flex:1, padding:'10px 14px', background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, cursor:'help' }}>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.65)', fontWeight:500, marginBottom:4 }}>Float do sub</div>
                  <div style={{ fontSize:18, fontWeight:700, color:'#1890FF' }}>R$ 78.328,00</div>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>Saldo em trânsito na conta</div>
                </div>
              </Tooltip>
              <Tooltip text="Capital adiantado aos ECs ainda não recuperado nos repasses futuros. Posição de balanço." delay={1000} bare style={{ flex:1, display:'flex' }}>
                <div style={{ flex:1, padding:'10px 14px', background:'#e6f7ff', border:'1px solid #91d5ff', borderRadius:2, cursor:'help' }}>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.65)', fontWeight:500, marginBottom:4 }}>Capital comprometido</div>
                  <div style={{ fontSize:18, fontWeight:700, color:'#1890FF' }}>R$ 140.000,00</div>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>Antecipações em aberto</div>
                </div>
              </Tooltip>
              <Tooltip text="Posição líquida = Float - Capital comprometido. Se negativa, capital está alocado em antecipações (estratégia de receita)." delay={1000} bare style={{ flex:1, display:'flex' }}>
                <div style={{ flex:1, padding:'10px 14px', background:'#fff7e6', border:'1px solid #ffd591', borderRadius:2, cursor:'help' }}>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.65)', fontWeight:500, marginBottom:4 }}>Posição líquida</div>
                  <div style={{ fontSize:18, fontWeight:700, color:'#fa8c16' }}>−R$ 61.672,00</div>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>Capital alocado em antecipações</div>
                </div>
              </Tooltip>
            </div>
          </div>

          <div style={{ display:'flex', gap:16 }}>
            {/* DRE principal */}
            <div style={{ flex:2, background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ padding:'16px 24px', borderBottom:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>DRE Operacional — {MONTHS[dreMonth]} {dreYear}</div>
                  <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)', marginTop:2 }}>Resultado econômico do sub-adquirente no período</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <button onClick={prevDreMonth} style={{ background:'none', border:'1px solid #d9d9d9', borderRadius:2, cursor:'pointer', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(0,0,0,0.45)' }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <span style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)', minWidth:100, textAlign:'center' }}>{MONTHS[dreMonth]} {dreYear}</span>
                  <button onClick={nextDreMonth} style={{ background:'none', border:'1px solid #d9d9d9', borderRadius:2, cursor:'pointer', width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(0,0,0,0.45)' }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>
              <div style={{ padding:'16px 24px' }}>
                {[
                  { label:'RECEITAS',                                         v:'',               section:true },
                  { label:'(+) MDR cobrado dos merchants',                    v:fmt(42473),       indent:1, color:'#52c41a' },
                  { label:'(+) Juros de antecipações concedidas',             v:fmt(1691),        indent:1, color:'#52c41a' },
                  { label:'(=) Receita bruta',                                v:fmt(44164),       indent:0, weight:600, color:'#52c41a', border:true },
                  { label:'CUSTOS',                                           v:'',               section:true },
                  { label:'(−) MDR pago aos adquirentes',                    v:`(${fmt(29772)})`, indent:1, color:'#ff4d4f' },
                  { label:'(−) Tarifas operacionais',                        v:`(${fmt(0)})`,     indent:1, color:'rgba(0,0,0,0.35)' },
                  { label:'(=) Margem operacional líquida',                  v:fmt(14392),       indent:0, weight:700, color:'#52c41a', border:true },
                ].map((r, i) => r.section
                  ? <div key={i} style={{ fontSize:10, fontWeight:700, color:'rgba(0,0,0,0.35)', letterSpacing:'0.8px', textTransform:'uppercase', padding:'12px 0 4px' }}>{r.label}</div>
                  : (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:`${r.border?'10px':'6px'} 0 ${r.border?'10px':'6px'} ${(r.indent||0)*16}px`, borderTop:r.border?'1px solid #f0f0f0':'none', borderBottom:r.border?'2px solid #f0f0f0':'none' }}>
                      <span style={{ fontSize:13, color:r.color||'rgba(0,0,0,0.65)', fontWeight:r.weight||400 }}>{r.label}</span>
                      <span style={{ fontSize:13, fontWeight:r.weight||500, color:r.color||'rgba(0,0,0,0.85)', whiteSpace:'nowrap' }}>{r.v}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Painel lateral */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, overflow:'hidden' }}>
                <div style={{ padding:'12px 20px', borderBottom:'1px solid #f0f0f0' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>Liquidações por adquirente</div>
                </div>
                <div style={{ padding:'16px 20px' }}>
                  {[
                    { adq:'Adiq',   pct:42, v:fmt(521010), c:'#1890FF' },
                    { adq:'Rede',   pct:28, v:fmt(347340), c:'#52c41a' },
                    { adq:'Cielo',  pct:20, v:fmt(248100), c:'#fa8c16' },
                    { adq:'Getnet', pct:10, v:fmt(124050), c:'#722ED1' },
                  ].map(a => (
                    <div key={a.adq} style={{ marginBottom:10 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                        <span style={{ fontSize:12, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{a.adq}</span>
                        <span style={{ fontSize:12, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{a.v}</span>
                      </div>
                      <div style={{ height:6, background:'#f0f0f0', borderRadius:3 }}>
                        <div style={{ height:'100%', width:`${a.pct}%`, background:a.c, borderRadius:3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:2, overflow:'hidden' }}>
                <div style={{ padding:'12px 20px', borderBottom:'1px solid #f0f0f0' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'rgba(0,0,0,0.85)' }}>Receita por origem</div>
                </div>
                <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    { label:'MDR cobrado dos ECs', value:fmt(42473), pct:96, color:'#52c41a' },
                    { label:'Juros antecipações',  value:fmt(1691),  pct:4,  color:'#1890FF' },
                  ].map((r, i) => (
                    <div key={i}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:12, color:'rgba(0,0,0,0.55)' }}>{r.label}</span>
                        <span style={{ fontSize:12, fontWeight:500, color:r.color }}>{r.value}</span>
                      </div>
                      <div style={{ height:5, background:'#f0f0f0', borderRadius:3 }}>
                        <div style={{ height:'100%', width:`${r.pct}%`, background:r.color, borderRadius:3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DrawerLiquidacaoDetalhes open={!!drawerLiq} onClose={()=>setDrawerLiq(null)} liq={drawerLiq} />
      <DrawerSimulacaoAntecipacao open={drawerSim} onClose={()=>setDrawerSim(false)} />
      <DrawerImportarLiquidacao open={drawerImport} onClose={()=>setDrawerImport(false)} />
    </div>
  )
}
