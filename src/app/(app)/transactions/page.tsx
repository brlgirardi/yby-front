'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import Tag from '@/components/shared/Tag'
import Tooltip from '@/components/shared/Tooltip'
import BrandLogo from '@/components/shared/BrandLogo'
import DataTable, { type ColumnType, PERIOD_OPTIONS } from '@/components/ui/DataTable'

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

type Channel = 'pos' | 'link' | 'ecommerce'
type StatusKey = 'Aprovada' | 'Recusada' | 'Cancelada' | 'Estorno' | 'Pendente' | 'Chargeback'

type Transaction = {
  channel: Channel
  posId?: string             // só quando channel === 'pos'
  marketplace: string        // ex: Mercado Livre — entidade pai (master merchant)
  ec: string                 // EC efetivamente operando dentro do marketplace
  bandeira: string
  parcelas: string           // "1x", "12x", "Pix"
  data: string               // dd/mm/aaaa
  hora: string               // hh:mm
  valor: number
  authCode: string
  nsu: string
  status: StatusKey
}

const TRANSACTIONS: Transaction[] = [
  { channel:'pos',         posId:'12345', marketplace:'Mercado Livre',  ec:'ML Loja 0021',     bandeira:'Mastercard', parcelas:'12x', data:'20/04/2026', hora:'12:42', valor:382.47,  authCode:'68e18784-7ddd-398f-9d19-6746e4a14cb9', nsu:'000000112',   status:'Recusada'   },
  { channel:'pos',         posId:'12345', marketplace:'Mercado Livre',  ec:'ML Loja 0021',     bandeira:'Mastercard', parcelas:'12x', data:'20/04/2026', hora:'12:37', valor:509.97,  authCode:'585489',                                  nsu:'000000110',   status:'Aprovada'   },
  { channel:'ecommerce',                  marketplace:'Amazon Brasil',  ec:'AMZ Centro',       bandeira:'Mastercard', parcelas:'3x',  data:'20/04/2026', hora:'12:34', valor:394.50,  authCode:'049329',                                  nsu:'000473759764',status:'Aprovada'   },
  { channel:'pos',         posId:'87654', marketplace:'Mercado Livre',  ec:'ML Loja 0021',     bandeira:'Mastercard', parcelas:'12x', data:'20/04/2026', hora:'12:34', valor:892.44,  authCode:'491866',                                  nsu:'000000108',   status:'Aprovada'   },
  { channel:'link',                       marketplace:'Shopee Brasil',  ec:'Shopee Boutique',  bandeira:'Visa',       parcelas:'6x',  data:'20/04/2026', hora:'11:58', valor:760.00,  authCode:'732910',                                  nsu:'000000105',   status:'Recusada'   },
  { channel:'ecommerce',                  marketplace:'iFood Ltda',     ec:'iFood Restaurante',bandeira:'Elo',        parcelas:'2x',  data:'20/04/2026', hora:'11:42', valor:430.00,  authCode:'112844',                                  nsu:'000000103',   status:'Pendente'   },
  { channel:'pos',         posId:'45102', marketplace:'Magazine Luiza', ec:'ML Centro',        bandeira:'Visa',       parcelas:'1x',  data:'20/04/2026', hora:'11:31', valor:128.90,  authCode:'778219',                                  nsu:'000000102',   status:'Aprovada'   },
  { channel:'link',                       marketplace:'Rappi Brasil',   ec:'Rappi Quick',      bandeira:'Pix',        parcelas:'Pix', data:'20/04/2026', hora:'10:58', valor:87.50,   authCode:'—',                                       nsu:'PIX-9991',    status:'Aprovada'   },
  { channel:'ecommerce',                  marketplace:'Americanas S.A.',ec:'AME Loja 04',      bandeira:'Visa',       parcelas:'1x',  data:'20/04/2026', hora:'10:30', valor:999.00,  authCode:'002311',                                  nsu:'000000099',   status:'Aprovada'   },
  { channel:'ecommerce',                  marketplace:'Amazon Brasil',  ec:'AMZ Online',       bandeira:'Mastercard', parcelas:'1x',  data:'20/04/2026', hora:'10:12', valor:2100.00, authCode:'440092',                                  nsu:'000000097',   status:'Estorno'    },
  { channel:'pos',         posId:'33099', marketplace:'Mercado Livre',  ec:'ML Loja 0044',     bandeira:'Visa',       parcelas:'4x',  data:'20/04/2026', hora:'09:55', valor:312.10,  authCode:'558719',                                  nsu:'000000095',   status:'Chargeback' },
  { channel:'ecommerce',                  marketplace:'Shopee Brasil',  ec:'Shopee Eletro',    bandeira:'Mastercard', parcelas:'10x', data:'20/04/2026', hora:'09:38', valor:1879.40, authCode:'661233',                                  nsu:'000000093',   status:'Aprovada'   },
  { channel:'pos',         posId:'77821', marketplace:'iFood Ltda',     ec:'iFood Restaurante',bandeira:'Mastercard', parcelas:'1x',  data:'20/04/2026', hora:'09:20', valor:64.80,   authCode:'441298',                                  nsu:'000000091',   status:'Cancelada'  },
]

const STATUS_TIPS: Record<StatusKey, string> = {
  'Aprovada':   'A cobrança foi realizada com sucesso e o pagamento foi confirmado na sua maquininha de cartão.',
  'Recusada':   'Houve um impedimento na conclusão da transação por recusa do emissor de cartão. Por exemplo: saldo insuficiente, cartão vencido, falta de limite, cartão bloqueado, dados divergentes, etc.',
  'Cancelada':  'Quando ocorre o cancelamento na própria maquininha onde foi realizada a venda, no mesmo dia da transação. Para esse tipo de cancelamento é necessário que o portador do cartão esteja na loja. Use a senha de cancelamento fornecida no dia da instalação para fazer esse procedimento.',
  'Estorno':    'Quando há a devolução do valor já confirmado pelo seu estabelecimento e que já consta na fatura do portador do cartão. Por exemplo: quando o cliente não recebe a mercadoria, veio com algum defeito ou não houve atendimento pelo prestador de serviço.',
  'Pendente':   'Aguardando confirmação do emissor ou do gateway. Pode levar alguns minutos para resolver.',
  'Chargeback': 'Disputa aberta pelo portador junto à bandeira. Em análise — pode resultar em débito definitivo.',
}

const CHANNEL_META: Record<Channel, { icon: string; label: string; tip: string }> = {
  pos:         { icon:'pos',          label:'POS',         tip:'POS — transação capturada em maquininha física no estabelecimento.' },
  link:        { icon:'link2',        label:'Link',        tip:'Link de pagamento — checkout enviado por mensagem/email.'           },
  ecommerce:   { icon:'shoppingCart', label:'Ecommerce',   tip:'Ecommerce — checkout integrado no site do estabelecimento.'         },
}

const ALL_STATUSES: StatusKey[] = ['Aprovada','Recusada','Cancelada','Estorno','Pendente','Chargeback']
const ALL_CHANNELS: Channel[] = ['pos','link','ecommerce']
const ALL_BANDEIRAS = ['Visa','Mastercard','Elo','Pix']

// Truncate text com tooltip de valor completo no hover
function TruncatedMono({ text, max = 16 }: { text: string; max?: number }) {
  const truncated = text.length > max ? text.slice(0, max) + '…' : text
  if (text.length <= max) {
    return <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.55)', whiteSpace:'nowrap' }}>{text}</span>
  }
  return (
    <Tooltip text={text} bare>
      <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.55)', whiteSpace:'nowrap', borderBottom:'1px dotted rgba(0,0,0,0.25)' }}>{truncated}</span>
    </Tooltip>
  )
}

// Chip de canal — estilo Figma (bg #F2F2F7, ícone Lucide + texto)
function ChannelChip({ channel, posId }: { channel: Channel; posId?: string }) {
  const meta = CHANNEL_META[channel]
  const label = channel === 'pos' && posId ? `POS-${posId}` : meta.label
  const truncated = label.length > 12 ? label.slice(0, 10) + '…' : label
  const showTooltip = label.length > 12 || true // sempre mostra explicação do canal

  return (
    <Tooltip text={`${meta.tip}${posId ? `\nID da maquininha: ${posId}` : ''}`} bare>
      <span style={{
        display:'inline-flex', alignItems:'center', gap:6,
        background:'#F2F2F7',
        borderRadius:2, padding:'2px 7px', fontSize:12,
        color:'rgba(0,0,0,0.85)', whiteSpace:'nowrap',
      }}>
        <Icon name={meta.icon} size={14} color="rgba(0,0,0,0.65)" />
        <span>{truncated}</span>
      </span>
    </Tooltip>
  )
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter]   = useState<string[]>(ALL_STATUSES)
  const [channelFilter, setChannelFilter] = useState<string[]>(ALL_CHANNELS)
  const [brandFilter, setBrandFilter]     = useState<string[]>(ALL_BANDEIRAS)

  const filtered = TRANSACTIONS.filter(r =>
    statusFilter.includes(r.status) &&
    channelFilter.includes(r.channel) &&
    brandFilter.includes(r.bandeira) &&
    (!search ||
      r.marketplace.toLowerCase().includes(search.toLowerCase()) ||
      r.ec.toLowerCase().includes(search.toLowerCase()) ||
      r.authCode.toLowerCase().includes(search.toLowerCase()) ||
      r.nsu.toLowerCase().includes(search.toLowerCase())
    )
  )

  const totalVol = filtered.reduce((s,r) => r.status==='Aprovada' ? s + r.valor : s, 0)
  const aprovadas = filtered.filter(r => r.status==='Aprovada').length
  const recusadas = filtered.filter(r => r.status==='Recusada').length
  const taxaAprov = filtered.length > 0 ? Math.round((aprovadas / filtered.length) * 100) : 0

  const KPIS = [
    { label:'Volume aprovado',  value:fmt(totalVol),     bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:`${aprovadas} transações capturadas`        },
    { label:'Transações',       value:String(filtered.length), bg:'#e6f7ff', border:'#91d5ff', color:'#1890FF', sub:'No período filtrado'                       },
    { label:'Taxa de aprovação',value:`${taxaAprov}%`,   bg:'#f6ffed', border:'#b7eb8f', color:'#52c41a', sub:`${recusadas} recusadas no período`         },
    { label:'Ticket médio',     value:aprovadas ? fmt(totalVol/aprovadas) : 'R$ 0,00', bg:'#f5f5f5', border:'#d9d9d9', color:'rgba(0,0,0,0.85)', sub:'Sobre transações aprovadas' },
  ]

  const columns: ColumnType<Transaction>[] = [
    {
      title: 'Canal', dataIndex: 'channel', key: 'channel', width: 150,
      render: (v: Channel, r) => <ChannelChip channel={v} posId={r.posId} />,
    },
    {
      title: 'Estabelecimento', dataIndex: 'ec', key: 'ec', width: 220,
      render: (_, r) => (
        <div style={{ display:'flex', flexDirection:'column', gap:2, minWidth:0 }}>
          <span style={{ fontWeight:500, color:'rgba(0,0,0,0.85)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:200 }}>{r.ec}</span>
          <span style={{ fontSize:11, color:'rgba(0,0,0,0.45)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:200 }}>{r.marketplace}</span>
        </div>
      ),
    },
    {
      title: 'Forma de Pagamento', dataIndex: 'bandeira', key: 'bandeira', width: 180,
      render: (_, r) => (
        <span style={{ display:'inline-flex', alignItems:'center', gap:8, whiteSpace:'nowrap' }}>
          <BrandLogo brand={r.bandeira} size={20} />
          <span style={{ color:'rgba(0,0,0,0.85)' }}>{r.parcelas}</span>
        </span>
      ),
    },
    {
      title: 'Data', dataIndex: 'data', key: 'data', width: 110,
      render: (_, r) => (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          <span style={{ color:'rgba(0,0,0,0.85)', fontSize:13 }}>{r.data}</span>
          <span style={{ color:'rgba(0,0,0,0.45)', fontSize:11 }}>{r.hora}</span>
        </div>
      ),
    },
    {
      title: 'Valor', dataIndex: 'valor', key: 'valor', width: 120,
      render: v => <span style={{ fontWeight:600, color:'rgba(0,0,0,0.85)', whiteSpace:'nowrap' }}>{fmt(v)}</span>,
    },
    {
      title: 'Cód. Autorização', dataIndex: 'authCode', key: 'authCode', width: 160,
      render: v => <TruncatedMono text={v} max={14} />,
    },
    {
      title: 'NSU', dataIndex: 'nsu', key: 'nsu', width: 130,
      render: v => <TruncatedMono text={v} max={14} />,
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 130,
      render: (v: StatusKey) => (
        <Tooltip text={STATUS_TIPS[v]} delay={1000} bare>
          <Tag status={v} />
        </Tooltip>
      ),
    },
    {
      title: '', key: 'acoes', width: 60,
      render: () => (
        <button title="Ver detalhes" style={{ border:'none', background:'none', color:'rgba(0,0,0,0.35)', cursor:'pointer', padding:4, display:'flex', alignItems:'center', borderRadius:4 }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#1890FF';(e.currentTarget as HTMLElement).style.background='#f5f5f5'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.35)';(e.currentTarget as HTMLElement).style.background='none'}}>
          <Icon name="eye" size={15} color="currentColor" />
        </button>
      ),
    },
  ]

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader
        title="Transações"
        breadcrumb="Sub-adquirente / Transações"
        onBack={() => {}}
      />

      <div style={{ padding:'16px 24px 0', display:'flex', gap:16 }}>
        {KPIS.map((k,i) => (
          <div key={i} style={{ flex:1, background:k.bg, border:`1px solid ${k.border}`, borderRadius:2, padding:'14px 18px' }}>
            <div style={{ fontSize:12, color:'rgba(0,0,0,0.65)', fontWeight:500, marginBottom:6 }}>{k.label}</div>
            <div style={{ fontSize:20, fontWeight:700, color:k.color, marginBottom:4 }}>{k.value}</div>
            <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:24 }}>
        <DataTable<Transaction>
          title="Listagem de Transações"
          columns={columns}
          dataSource={filtered}
          rowKey={(_,i) => String(i)}
          searchPlaceholder="Buscar EC, marketplace, NSU ou código de autorização..."
          searchValue={search}
          onSearch={setSearch}
          filters={[
            {
              label: 'Canal',
              options: ALL_CHANNELS.map(c => ({ label: CHANNEL_META[c].label, value: c })),
              value: channelFilter,
              onChange: setChannelFilter,
            },
            {
              label: 'Status',
              options: ALL_STATUSES.map(s => ({ label: s, value: s })),
              value: statusFilter,
              onChange: setStatusFilter,
            },
            {
              label: 'Bandeira',
              options: ALL_BANDEIRAS.map(b => ({ label: b, value: b })),
              value: brandFilter,
              onChange: setBrandFilter,
            },
          ]}
          onExport={() => {}}
          periodOptions={PERIOD_OPTIONS}
          defaultPeriod="hoje"
          pageSize={10}
        />
      </div>
    </div>
  )
}
