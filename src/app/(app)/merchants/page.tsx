'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Icon from '@/components/atoms/Icon'
import Tag from '@/components/atoms/Tag'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'

const MERCHANTS = [
  { id:'MCH-001', name:'Americanas S.A.', cnpj:'00.776.574/0001-56', mcc:'5912', status:'Ativo',    volume:'R$ 1.240.500,00', txns:8420  },
  { id:'MCH-002', name:'Magazine Luiza',  cnpj:'47.960.950/0001-21', mcc:'5731', status:'Ativo',    volume:'R$ 987.200,00',   txns:6310  },
  { id:'MCH-003', name:'Rappi Brasil',    cnpj:'28.665.021/0001-89', mcc:'5812', status:'Ativo',    volume:'R$ 765.400,00',   txns:14980 },
  { id:'MCH-004', name:'iFood Ltda',      cnpj:'14.380.200/0001-21', mcc:'5812', status:'Ativo',    volume:'R$ 654.900,00',   txns:12340 },
  { id:'MCH-005', name:'Shopee Brasil',   cnpj:'35.060.991/0001-56', mcc:'5999', status:'Suspenso', volume:'R$ 432.100,00',   txns:5670  },
  { id:'MCH-006', name:'Amazon Brasil',   cnpj:'15.436.940/0001-03', mcc:'5999', status:'Ativo',    volume:'R$ 2.180.700,00', txns:19850 },
  { id:'MCH-007', name:'Mercado Livre',   cnpj:'03.007.331/0001-41', mcc:'5999', status:'Ativo',    volume:'R$ 3.450.200,00', txns:28900 },
  { id:'MCH-008', name:'Netshoes',        cnpj:'07.526.557/0001-00', mcc:'5661', status:'Inativo',  volume:'R$ 89.400,00',    txns:740   },
]

type Merchant = typeof MERCHANTS[0]

function IconBtn({ onClick, hoverColor, ariaLabel, children }: { onClick?: () => void; hoverColor: string; ariaLabel: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, color: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', borderRadius: 4 }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = hoverColor; (e.currentTarget as HTMLElement).style.background = '#f5f5f5' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.45)'; (e.currentTarget as HTMLElement).style.background = 'none' }}
    >
      {children}
    </button>
  )
}

export default function MerchantsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativo', 'Suspenso', 'Inativo'])

  const filtered = MERCHANTS.filter(m =>
    statusFilter.includes(m.status) &&
    (!search || m.name.toLowerCase().includes(search.toLowerCase()) || m.cnpj.includes(search))
  )

  const columns: ColumnType<Merchant>[] = [
    {
      title: 'Nome', dataIndex: 'name', key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: v => <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{v}</span>,
    },
    {
      title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj', width: 180,
      render: v => <span style={{ fontFamily: 'Roboto Mono', fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{v}</span>,
    },
    { title: 'MCC', dataIndex: 'mcc', key: 'mcc', width: 70 },
    {
      title: 'Volume (30d)', dataIndex: 'volume', key: 'volume',
      render: v => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    {
      title: 'Transações', dataIndex: 'txns', key: 'txns', width: 110,
      sorter: (a, b) => a.txns - b.txns,
      render: v => <span style={{ color: 'rgba(0,0,0,0.65)' }}>{v.toLocaleString('pt-BR')}</span>,
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 100,
      render: v => <Tag status={v} />,
    },
    {
      title: 'Ações', key: 'actions', width: 96,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconBtn
            ariaLabel="Visualizar estabelecimento"
            onClick={() => router.push(`/merchants/${record.id}`)}
            hoverColor="#1890FF"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </IconBtn>
          <IconBtn
            ariaLabel="Editar estabelecimento"
            onClick={() => router.push(`/merchants/${record.id}?edit=1`)}
            hoverColor="#1890FF"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </IconBtn>
          <IconBtn ariaLabel="Excluir estabelecimento" hoverColor="#ff4d4f">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/>
            </svg>
          </IconBtn>
        </div>
      ),
    },
  ]

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader title="Lista de Merchants" breadcrumb="Sub-adquirente / Merchants" onBack={null} extra={
        <button
          onClick={() => router.push('/merchants/novo')}
          style={{ border:'none', background:'#1890FF', color:'#fff', borderRadius:2, padding:'6px 16px', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}
        >
          <Icon name="plus" size={14} color="#fff" /> Novo estabelecimento
        </button>
      } />

      <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
        <DataTable<Merchant>
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          searchPlaceholder="Buscar por nome, CNPJ..."
          searchValue={search}
          onSearch={setSearch}
          filters={[{
            label: 'Status',
            options: [
              { label: 'Ativo',    value: 'Ativo'    },
              { label: 'Suspenso', value: 'Suspenso' },
              { label: 'Inativo',  value: 'Inativo'  },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          }]}
          onExport={() => {}}
          pageSize={10}
        />
      </div>
    </div>
  )
}
