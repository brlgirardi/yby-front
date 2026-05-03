'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/shared/Icon'
import Tag from '@/components/shared/Tag'
import Tooltip from '@/components/shared/Tooltip'
import BrandLogo from '@/components/shared/BrandLogo'
import DataTable, { type ColumnType, PERIOD_OPTIONS } from '@/components/ui/DataTable'

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

type Origin = 'gateway' | 'pos'
type StatusKey = 'Aprovada' | 'Recusada' | 'Cancelada' | 'Estorno' | 'Pendente' | 'Chargeback'

type Transaction = {
  origem: Origin
  marketplace: string
  ec: string
  bandeira: string
  tipo: string
  data: string
  valor: number
  authCode: string
  nsu: string
  status: StatusKey
}

const TRANSACTIONS: Transaction[] = [
  { origem:'pos',     marketplace:'Mercado Livre',  ec:'ML Loja 0021',     bandeira:'Mastercard', tipo:'Crédito - 12x', data:'20/04/26 12:42', valor:382.47,   authCode:'68e18784-7ddd-398f-9d19-6746e4a14cb9', nsu:'000000112',  status:'Recusada' },
  { origem:'pos',     marketplace:'Mercado Livre',  ec:'ML Loja 0021',     bandeira:'Mastercard', tipo:'Crédito - 12x', data:'20/04/26 12:37', valor:509.97,   authCode:'585489',                                  nsu:'000000110',  status:'Aprovada' },
  { origem:'pos',     marketplace:'Amazon Brasil',  ec:'AMZ Centro',       bandeira:'Mastercard', tipo:'Crédito - 3x',  data:'20/04/26 12:34', valor:394.50,   authCode:'049329',                                  nsu:'000473759764',status:'Aprovada' },
  { origem:'pos',     marketplace:'Mercado Livre',  ec:'ML Loja 0021',     bandeira:'Mastercard', tipo:'Crédito - 12x', data:'20/04/26 12:34', valor:892.44,   authCode:'491866',                                  nsu:'000000108',  status:'Aprovada' },
  { origem:'gateway', marketplace:'Shopee Brasil',  ec:'Shopee Boutique',  bandeira:'Visa',       tipo:'Crédito - 6x',  data:'20/04/26 11:58', valor:760.00,   authCode:'732910',                                  nsu:'000000105',  status:'Recusada' },
  { origem:'gateway', marketplace:'iFood Ltda',     ec:'iFood Restaurante',bandeira:'Elo',        tipo:'Crédito - 2x',  data:'20/04/26 11:42', valor:430.00,   authCode:'112844',                                  nsu:'000000103',  status:'Pendente' },
  { origem:'pos',     marketplace:'Magazine Luiza', ec:'ML Centro',        bandeira:'Visa',       tipo:'Débito',        data:'20/04/26 11:31', valor:128.90,   authCode:'778219',                                  nsu:'000000102',  status:'Aprovada' },
  { origem:'gateway', marketplace:'Rappi Brasil',   ec:'Rappi Quick',      bandeira:'Pix',        tipo:'Pix',           data:'20/04/26 10:58', valor:87.50,    authCode:'—',                                       nsu:'PIX-9991',   status:'Aprovada' },
  { origem:'pos',     marketplace:'Americanas S.A.',ec:'AME Loja 04',      bandeira:'Visa',       tipo:'Crédito - 1x',  data:'20/04/26 10:30', valor:999.00,   authCode:'002311',                                  nsu:'000000099',  status:'Aprovada' },
  { origem:'gateway', marketplace:'Amazon Brasil',  ec:'AMZ Online',       bandeira:'Mastercard', tipo:'Crédito - 1x',  data:'20/04/26 10:12', valor:2100.00,  authCode:'440092',                                  nsu:'000000097',  status:'Estorno' },
  { origem:'pos',     marketplace:'Mercado Livre',  ec:'ML Loja 0044',     bandeira:'Visa',       tipo:'Crédito - 4x',  data:'20/04/26 09:55', valor:312.10,   authCode:'558719',                                  nsu:'000000095',  status:'Chargeback' },
  { origem:'pos',     marketplace:'iFood Ltda',     ec:'iFood Restaurante',bandeira:'Mastercard', tipo:'Crédito - 1x',  data:'20/04/26 09:20', valor:64.80,    authCode:'441298',                                  nsu:'000000091',  status:'Cancelada' },
  { origem:'gateway', marketplace:'Shopee Brasil',  ec:'Shopee Eletro',    bandeira:'Mastercard', tipo:'Crédito - 10x', data:'20/04/26 09:38', valor:1879.40,  authCode:'661233',                                  nsu:'000000093',  status:'Aprovada' },
]

const STATUS_TIPS: Record<StatusKey, string> = {
  'Aprovada':   'A cobrança foi realizada com sucesso e o pagamento foi confirmado na sua maquininha de cartão.',
  'Recusada':   'Houve um impedimento na conclusão da transação por recusa do emissor de cartão. Por exemplo: saldo insuficiente, cartão vencido, falta de limite, cartão bloqueado, dados divergentes, etc.',
  'Cancelada':  'Quando ocorre o cancelamento na própria maquininha onde foi realizada a venda, no mesmo dia da transação. Para esse tipo de cancelamento é necessário que o portador do cartão esteja na loja. Use a senha de cancelamento fornecida no dia da instalação para fazer esse procedimento.',
  'Estorno':    'Quando há a devolução do valor já confirmado pelo seu estabelecimento e que já consta na fatura do portador do cartão. Por exemplo: quando o cliente não recebe a mercadoria, veio com algum defeito ou não houve atendimento pelo prestador de serviço.',
  'Pendente':   'Aguardando confirmação do emissor ou do gateway. Pode levar alguns minutos para resolver.',
  'Chargeback': 'Disputa aberta pelo portador junto à bandeira. Em análise — pode resultar em débito definitivo.',
}

const ORIGIN_TIPS: Record<Origin, string> = {
  gateway: 'Gateway — transação online (e-commerce, link de pagamento, API).',
  pos:     'POS — transação capturada em maquininha física no estabelecimento.',
}

const ALL_STATUSES: StatusKey[] = ['Aprovada','Recusada','Cancelada','Estorno','Pendente','Chargeback']
const ALL_ORIGINS: Origin[] = ['gateway','pos']
const ALL_BANDEIRAS = ['Visa','Mastercard','Elo','Pix']

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(ALL_STATUSES)
  const [originFilter, setOriginFilter] = useState<string[]>(ALL_ORIGINS)
  const [brandFilter, setBrandFilter]   = useState<string[]>(ALL_BANDEIRAS)

  const filtered = TRANSACTIONS.filter(r =>
    statusFilter.includes(r.status) &&
    originFilter.includes(r.origem) &&
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
      title: '',
      dataIndex: 'origem',
      key: 'origem',
      width: 50,
      render: (v: Origin) => (
        <Tooltip text={ORIGIN_TIPS[v]} delay={1000} bare>
          <span style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:28, height:28, borderRadius:4,
            background: v==='gateway' ? '#f9f0ff' : '#fff7e6',
            color: v==='gateway' ? '#722ED1' : '#fa8c16',
            border: `1px solid ${v==='gateway' ? '#d3adf7' : '#ffd591'}`,
          }}>
            <Icon name={v==='gateway' ? 'zap' : 'smartphone'} size={14} color="currentColor" />
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Marketplace', dataIndex: 'marketplace', key: 'marketplace', width: 160,
      render: v => <span style={{ fontWeight:500, color:'rgba(0,0,0,0.85)', whiteSpace:'nowrap' }}>{v}</span>,
    },
    {
      title: 'EC', dataIndex: 'ec', key: 'ec', width: 160,
      render: v => <span style={{ color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>{v}</span>,
    },
    {
      title: 'Tipo de Venda', dataIndex: 'tipo', key: 'tipo', width: 180,
      render: (_, r) => (
        <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
          <BrandLogo brand={r.bandeira} size={20} />
          <span style={{ color:'rgba(0,0,0,0.85)', whiteSpace:'nowrap' }}>{r.tipo}</span>
        </span>
      ),
    },
    {
      title: 'Data', dataIndex: 'data', key: 'data', width: 130,
      render: v => <span style={{ color:'rgba(0,0,0,0.65)', whiteSpace:'nowrap' }}>{v}</span>,
    },
    {
      title: 'Valor Bruto', dataIndex: 'valor', key: 'valor', width: 120,
      render: v => <span style={{ fontWeight:600, color:'rgba(0,0,0,0.85)', whiteSpace:'nowrap' }}>{fmt(v)}</span>,
    },
    {
      title: 'Código de Autorização', dataIndex: 'authCode', key: 'authCode', width: 180,
      render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.55)' }}>{v}</span>,
    },
    {
      title: 'NSU Adquirente', dataIndex: 'nsu', key: 'nsu', width: 140,
      render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:11, color:'rgba(0,0,0,0.55)' }}>{v}</span>,
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
      title: 'Ações', key: 'acoes', width: 70,
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
          searchPlaceholder="Buscar marketplace, EC, NSU ou código de autorização..."
          searchValue={search}
          onSearch={setSearch}
          filters={[
            {
              label: 'Origem',
              options: [
                { label: 'Gateway',    value: 'gateway' },
                { label: 'Maquininha', value: 'pos' },
              ],
              value: originFilter,
              onChange: setOriginFilter,
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
