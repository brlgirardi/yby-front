'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import BrandLogo from '@/components/shared/BrandLogo'

const MERCHANTS = [
  { id:'MCH-001', name:'Americanas S.A.', cnpj:'00.776.574/0001-56', mcc:'5912', status:'Ativo', volume:'R$ 1.240.500,00', txns:8420 },
  { id:'MCH-002', name:'Magazine Luiza', cnpj:'47.960.950/0001-21', mcc:'5731', status:'Ativo', volume:'R$ 987.200,00', txns:6310 },
  { id:'MCH-003', name:'Rappi Brasil', cnpj:'28.665.021/0001-89', mcc:'5812', status:'Ativo', volume:'R$ 765.400,00', txns:14980 },
  { id:'MCH-004', name:'iFood Ltda', cnpj:'14.380.200/0001-21', mcc:'5812', status:'Ativo', volume:'R$ 654.900,00', txns:12340 },
  { id:'MCH-005', name:'Shopee Brasil', cnpj:'35.060.991/0001-56', mcc:'5999', status:'Suspenso', volume:'R$ 432.100,00', txns:5670 },
  { id:'MCH-006', name:'Amazon Brasil', cnpj:'15.436.940/0001-03', mcc:'5999', status:'Ativo', volume:'R$ 2.180.700,00', txns:19850 },
  { id:'MCH-007', name:'Mercado Livre', cnpj:'03.007.331/0001-41', mcc:'5999', status:'Ativo', volume:'R$ 3.450.200,00', txns:28900 },
  { id:'MCH-008', name:'Netshoes', cnpj:'07.526.557/0001-00', mcc:'5661', status:'Inativo', volume:'R$ 89.400,00', txns:740 },
]

const KpiCard = ({ label, value, prefix = 'R$', sub, trend, trendUp }: { label: string; value: string; prefix?: string; sub?: string; trend?: string; trendUp?: boolean }) => (
  <div style={{ background:'#fff', borderRadius:2, border:'1px solid rgba(0,0,0,0.06)', padding:'20px 24px 16px', flex:1, minWidth:0 }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
      <span style={{ fontSize:13, color:'rgba(0,0,0,0.45)' }}>{label}</span>
      <Icon name="info" size={14} color="rgba(0,0,0,0.2)" />
    </div>
    <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
      {prefix && <span style={{ fontSize:16, color:'rgba(0,0,0,0.85)' }}>{prefix}</span>}
      <span style={{ fontSize:30, fontWeight:500, color:'rgba(0,0,0,0.85)', lineHeight:1 }}>{value}</span>
    </div>
    {sub && <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)' }}>{sub}</div>}
    {trend && (
      <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
        <Icon name="trendingUp" size={12} color={trendUp?'#52c41a':'#ff4d4f'} />
        <span style={{ fontSize:12, color:trendUp?'#52c41a':'#ff4d4f' }}>{trend}</span>
      </div>
    )}
  </div>
)

const DonutChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((s, d) => s + d.value, 0)
  let angle = -90
  const cx = 80, cy = 80, r = 60, ir = 36
  const arc = (cx: number, cy: number, r: number, s: number, e: number) => {
    const sr = (s * Math.PI) / 180, er = (e * Math.PI) / 180
    const x1 = cx + r * Math.cos(sr), y1 = cy + r * Math.sin(sr), x2 = cx + r * Math.cos(er), y2 = cy + r * Math.sin(er)
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${e - s > 180 ? 1 : 0},1 ${x2},${y2} Z`
  }
  const slices = data.map(d => { const a = (d.value / total) * 360, s = angle; angle += a; return { ...d, s, e: angle } })
  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {slices.map((s, i) => <path key={i} d={arc(cx, cy, r, s.s, s.e)} fill={s.color} opacity={0.9} />)}
      <circle cx={cx} cy={cy} r={ir} fill="#fff" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fill="rgba(0,0,0,0.45)" fontFamily="Roboto">Total</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={14} fontWeight="600" fill="rgba(0,0,0,0.85)" fontFamily="Roboto">{total.toLocaleString('pt-BR')}</text>
    </svg>
  )
}

const MultiLineChart = ({ series, labels }: { series: { label: string; color: string; data: number[] }[]; labels: string[] }) => {
  const w = 500, h = 140, px = 10, py = 14
  const allVals = series.flatMap(s => s.data)
  const min = Math.min(...allVals), max = Math.max(...allVals)
  const sc = (v: number) => py + (1 - (v - min) / (max - min)) * (h - 2 * py)
  const xs = labels.map((_, i) => px + (i / (labels.length - 1)) * (w - 2 * px))
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width:'100%', height:140, display:'block' }}>
      {[0, 50, 100].map(p => { const y = py + (1 - p / 100) * (h - 2 * py); return <line key={p} x1={px} y1={y} x2={w - px} y2={y} stroke="#f0f0f0" strokeWidth="1" /> })}
      {series.map((s, si) => <polyline key={si} points={s.data.map((v, i) => `${xs[i]},${sc(v)}`).join(' ')} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />)}
      {labels.map((l, i) => i % 2 === 0 && <text key={i} x={xs[i]} y={h} fontSize="18" fill="rgba(0,0,0,0.35)" textAnchor="middle" fontFamily="Roboto">{l}</text>)}
    </svg>
  )
}

export default function DashboardPage() {
  const [tab, setTab] = useState('geral')
  const donutData = [
    { label:'Visa', value:4823, color:'#1890FF' },
    { label:'Mastercard', value:3241, color:'#FF6B35' },
    { label:'Elo', value:1456, color:'#52c41a' },
    { label:'Outros', value:620, color:'#d9d9d9' },
  ]
  const lineSeries = [
    { label:'Visa', color:'#1890FF', data:[3200,4100,3800,4823,5200,4900] },
    { label:'Mastercard', color:'#FF6B35', data:[2100,2800,3100,3241,3500,3200] },
    { label:'Elo', color:'#52c41a', data:[900,1100,1300,1456,1600,1400] },
  ]
  const labels = ['Jan','Fev','Mar','Abr','Mai','Jun']
  const ranked = [...MERCHANTS].sort((a, b) => b.txns - a.txns).slice(0, 6)
  const maxT = ranked[0].txns

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader title="Dashboard" breadcrumb="Sub-adquirente / Dashboard" extra={
        <div style={{ display:'flex', gap:8 }}>
          {['Geral','Planificação'].map(t => (
            <button key={t} onClick={() => setTab(t.toLowerCase())}
              style={{ border:tab===t.toLowerCase()?'1px solid #1890FF':'1px solid #d9d9d9', background:tab===t.toLowerCase()?'#e6f7ff':'#fff', color:tab===t.toLowerCase()?'#1890FF':'rgba(0,0,0,0.65)', borderRadius:2, padding:'6px 16px', fontSize:14, cursor:'pointer' }}>{t}</button>
          ))}
          <button style={{ border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'6px 14px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:'rgba(0,0,0,0.65)' }}>Todos os MCCs <Icon name="chevronDown" size={12} color="rgba(0,0,0,0.45)" /></button>
          <button style={{ border:'1px solid #d9d9d9', background:'#fff', borderRadius:2, padding:'6px 14px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:'rgba(0,0,0,0.65)' }}><Icon name="calendar" size={14} color="rgba(0,0,0,0.45)" /> Abril 2026 <Icon name="chevronDown" size={12} color="rgba(0,0,0,0.45)" /></button>
        </div>
      } onBack={null} />

      <div style={{ padding:24, display:'flex', flexDirection:'column', gap:24 }}>
        <div style={{ display:'flex', gap:24 }}>
          <KpiCard label="Cobranças criadas" value="1.240.500,00" sub="Total do período" trend="+14% vs. mês anterior" trendUp />
          <KpiCard label="Cobranças autorizadas" value="1.180.200,00" sub="Taxa de aprovação 95,2%" trend="+9%" trendUp />
          <KpiCard label="Quantidade" prefix="" value="38.140" sub="Transações" trend="+7%" trendUp />
          <KpiCard label="Merchants ativos" prefix="" value="7" sub="de 8 cadastrados" />
          <KpiCard label="MDR médio" prefix="" value="2,34%" sub="Blended rate" />
        </div>

        <div style={{ display:'flex', gap:24 }}>
          {/* Donut */}
          <div style={{ flex:1, background:'#fff', borderRadius:2, border:'1px solid rgba(0,0,0,0.06)', padding:'20px 24px' }}>
            <div style={{ fontSize:14, fontWeight:500, marginBottom:16, color:'rgba(0,0,0,0.85)' }}>Distribuição de transações por bandeira</div>
            <div style={{ display:'flex', alignItems:'center', gap:24 }}>
              <DonutChart data={donutData} />
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {donutData.map(d => (
                  <div key={d.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:d.color, flexShrink:0 }} />
                    <span style={{ minWidth:80 }}><BrandLogo brand={d.label} size={18} showLabel /></span>
                    <span style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{d.value.toLocaleString('pt-BR')}</span>
                    <span style={{ fontSize:11, color:'rgba(0,0,0,0.35)' }}>{((d.value / donutData.reduce((s, x) => s + x.value, 0)) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line chart */}
          <div style={{ flex:2, background:'#fff', borderRadius:2, border:'1px solid rgba(0,0,0,0.06)', padding:'20px 24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>Quantidade e valor por bandeira</div>
              <div style={{ display:'flex', gap:12 }}>
                {lineSeries.map(s => (
                  <div key={s.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:20, height:2, background:s.color, borderRadius:1, flexShrink:0 }} />
                    <BrandLogo brand={s.label} size={18} showLabel />
                  </div>
                ))}
              </div>
            </div>
            <MultiLineChart series={lineSeries} labels={labels} />
          </div>
        </div>

        {/* Merchant ranking */}
        <div style={{ background:'#fff', borderRadius:2, border:'1px solid rgba(0,0,0,0.06)', padding:'20px 24px' }}>
          <div style={{ fontSize:14, fontWeight:500, marginBottom:16, color:'rgba(0,0,0,0.85)' }}>Planificação — Top merchants por volume de transações</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {ranked.map((m, i) => (
              <div key={m.id} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:12, color:'rgba(0,0,0,0.35)', width:20, textAlign:'right' }}>{i + 1}</span>
                <span style={{ fontSize:13, color:'rgba(0,0,0,0.85)', width:200, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{m.name}</span>
                <div style={{ flex:1, height:18, background:'#f0f0f0', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${(m.txns / maxT) * 100}%`, background:'#1890FF', borderRadius:2, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:6 }}>
                    <span style={{ fontSize:11, color:'#fff', fontWeight:500 }}>{m.txns.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <span style={{ fontSize:13, color:'rgba(0,0,0,0.65)', width:140, textAlign:'right' }}>{m.volume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
