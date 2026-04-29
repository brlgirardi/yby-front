'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/shared/Tag'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import KpiCard from '@/components/ui/KpiCard'

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

type RecRow = {
  id: string; data: string; adquirente: string; ec: string; nsu: string
  valorEsperado: number; valorRecebido: number; diferenca: number; status: string
}

const DATA: RecRow[] = [
  { id:'REC-001', data:'22/04/2026', adquirente:'Adiq',   ec:'Americanas S.A.', nsu:'183726401', valorEsperado:450.00,  valorRecebido:450.00,  diferenca:0,       status:'Conciliado'    },
  { id:'REC-002', data:'22/04/2026', adquirente:'Adiq',   ec:'Americanas S.A.', nsu:'293847562', valorEsperado:433.33,  valorRecebido:433.33,  diferenca:0,       status:'Conciliado'    },
  { id:'REC-003', data:'22/04/2026', adquirente:'Rede',   ec:'Amazon Brasil',   nsu:'374958673', valorEsperado:450.00,  valorRecebido:441.00,  diferenca:-9.00,   status:'Divergente'    },
  { id:'REC-004', data:'21/04/2026', adquirente:'Cielo',  ec:'Mercado Livre',   nsu:'890415263', valorEsperado:624.75,  valorRecebido:624.75,  diferenca:0,       status:'Conciliado'    },
  { id:'REC-005', data:'21/04/2026', adquirente:'Rede',   ec:'Shopee Brasil',   nsu:'789304152', valorEsperado:399.17,  valorRecebido:0,        diferenca:-399.17, status:'Não encontrado'},
  { id:'REC-006', data:'20/04/2026', adquirente:'Getnet', ec:'iFood Ltda',      nsu:'435960718', valorEsperado:475.00,  valorRecebido:475.00,  diferenca:0,       status:'Conciliado'    },
  { id:'REC-007', data:'20/04/2026', adquirente:'Cielo',  ec:'iFood Ltda',      nsu:'901526374', valorEsperado:230.00,  valorRecebido:230.00,  diferenca:0,       status:'Conciliado'    },
  { id:'REC-008', data:'19/04/2026', adquirente:'Getnet', ec:'Shopee Brasil',   nsu:'324859607', valorEsperado:299.83,  valorRecebido:302.00,  diferenca:2.17,    status:'Divergente'    },
  { id:'REC-009', data:'19/04/2026', adquirente:'Adiq',   ec:'Rappi Brasil',    nsu:'456071829', valorEsperado:89.90,   valorRecebido:89.90,   diferenca:0,       status:'Conciliado'    },
  { id:'REC-010', data:'18/04/2026', adquirente:'Rede',   ec:'Magazine Luiza',  nsu:'567182930', valorEsperado:399.00,  valorRecebido:0,        diferenca:-399.00, status:'Pendente'      },
]

const STATUS_TAG: Record<string, string> = {
  'Conciliado': 'Liquidado', 'Divergente': 'Chargeback', 'Não encontrado': 'Recusado', 'Pendente': 'Pendente',
}

const ALL_ADQ    = ['Adiq','Rede','Cielo','Getnet']
const ALL_STATUS = ['Conciliado','Divergente','Não encontrado','Pendente']

export default function ReconciliationPage() {
  const [search, setSearch] = useState('')
  const [adqFilter, setAdq] = useState(ALL_ADQ)
  const [stFilter,  setSt]  = useState(ALL_STATUS)

  const filtered = DATA.filter(r =>
    adqFilter.includes(r.adquirente) && stFilter.includes(r.status) &&
    (!search || r.ec.toLowerCase().includes(search.toLowerCase()) || r.nsu.includes(search) || r.id.includes(search))
  )

  const columns: ColumnType<RecRow>[] = [
    { title:'ID',         dataIndex:'id',            key:'id',            render: v => <span style={{ color:'#1890FF', fontFamily:'Roboto Mono', fontSize:12 }}>{v}</span> },
    { title:'Data',       dataIndex:'data',          key:'data',          width:110 },
    { title:'Adquirente', dataIndex:'adquirente',    key:'adquirente',    width:100 },
    { title:'Merchant',   dataIndex:'ec',            key:'ec',            sorter:(a,b)=>a.ec.localeCompare(b.ec) },
    { title:'NSU',        dataIndex:'nsu',           key:'nsu',           render: v => <span style={{ fontFamily:'Roboto Mono', fontSize:12 }}>{v}</span> },
    { title:'Esperado',   dataIndex:'valorEsperado', key:'valorEsperado', align:'right' as const, render: v => fmt(v) },
    { title:'Recebido',   dataIndex:'valorRecebido', key:'valorRecebido', align:'right' as const, render: v => <span style={{ color: v===0?'rgba(0,0,0,0.25)':'rgba(0,0,0,0.85)' }}>{v===0?'—':fmt(v)}</span> },
    { title:'Diferença',  dataIndex:'diferenca',     key:'diferenca',     align:'right' as const, sorter:(a,b)=>a.diferenca-b.diferenca,
      render: v => v===0 ? <span style={{ color:'rgba(0,0,0,0.25)' }}>—</span> : <span style={{ color:v>0?'#52C41A':'#FF4D4F', fontWeight:500 }}>{v>0?'+':''}{fmt(v)}</span> },
    { title:'Status',     dataIndex:'status',        key:'status',        render: v => <Tag status={STATUS_TAG[v]??'Pendente'} label={v} /> },
  ]

  const totalConc  = DATA.filter(r => r.status==='Conciliado').length
  const totalDiv   = DATA.filter(r => r.status==='Divergente').length
  const totalNE    = DATA.filter(r => r.status==='Não encontrado').length
  const totalPend  = DATA.filter(r => r.status==='Pendente').length
  const sumDif     = DATA.reduce((s,r) => s+Math.abs(r.diferenca), 0)

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader title="Conciliação" breadcrumb="Sub-adquirente / Conciliação" onBack={() => {}} />
      <div style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          <KpiCard label="Conciliados"     value={String(totalConc)} variant="success" />
          <KpiCard label="Divergentes"     value={String(totalDiv)}  variant="error"   tooltip="Valor recebido difere do esperado" />
          <KpiCard label="Não encontrados" value={String(totalNE)}   variant="error"   tooltip="Transação esperada não chegou do adquirente" />
          <KpiCard label="Pendentes"       value={String(totalPend)} variant="warning" />
          <KpiCard label="Valor em aberto" value={fmt(sumDif)}       variant="orange"  tooltip="Soma das diferenças absolutas não conciliadas" />
        </div>
        <DataTable<RecRow>
          columns={columns} dataSource={filtered} rowKey="id"
          searchPlaceholder="Buscar merchant, NSU ou ID..."
          searchValue={search} onSearch={setSearch}
          filters={[
            { label:'Adquirente', options:ALL_ADQ.map(a=>({label:a,value:a})),    value:adqFilter, onChange:setAdq },
            { label:'Status',     options:ALL_STATUS.map(s=>({label:s,value:s})), value:stFilter,  onChange:setSt  },
          ]}
          onExport={() => {}}
          pageSize={10}
        />
      </div>
    </div>
  )
}
