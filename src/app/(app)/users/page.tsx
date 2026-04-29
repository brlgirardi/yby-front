'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/shared/Tag'
import Button from '@/components/shared/Button'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'

type User = {
  id: string; nome: string; email: string; perfil: string; status: string; ultimoAcesso: string; criado: string
}

const DATA: User[] = [
  { id:'USR-001', nome:'Bruno Liberato',    email:'bruno@subadq.com.br',    perfil:'Admin',     status:'Ativo',    ultimoAcesso:'29/04/2026 14:32', criado:'01/01/2025' },
  { id:'USR-002', nome:'Ana Souza',         email:'ana.souza@subadq.com.br', perfil:'Operador',  status:'Ativo',    ultimoAcesso:'29/04/2026 09:15', criado:'15/02/2025' },
  { id:'USR-003', nome:'Carlos Menezes',    email:'carlos@subadq.com.br',   perfil:'Financeiro', status:'Ativo',    ultimoAcesso:'28/04/2026 17:48', criado:'10/03/2025' },
  { id:'USR-004', nome:'Fernanda Lima',     email:'fernanda@subadq.com.br', perfil:'Operador',  status:'Suspenso', ultimoAcesso:'20/04/2026 11:00', criado:'22/03/2025' },
  { id:'USR-005', nome:'Rafael Torres',     email:'rafael@subadq.com.br',   perfil:'Visualizador', status:'Ativo', ultimoAcesso:'27/04/2026 08:30', criado:'05/04/2025' },
  { id:'USR-006', nome:'Julia Cardoso',     email:'julia@subadq.com.br',    perfil:'Financeiro', status:'Inativo',  ultimoAcesso:'10/03/2026 16:20', criado:'12/01/2025' },
]

const PERFIL_COLOR: Record<string, { bg: string; color: string; border: string }> = {
  'Admin':        { bg:'#F9F0FF', color:'#531DAB', border:'#D3ADF7' },
  'Financeiro':   { bg:'#E6F7FF', color:'#003A8C', border:'#91D5FF' },
  'Operador':     { bg:'#F6FFED', color:'#237804', border:'#D9F7BE' },
  'Visualizador': { bg:'#F5F5F5', color:'rgba(0,0,0,0.45)', border:'#D9D9D9' },
}

const ALL_PERFIS  = ['Admin','Operador','Financeiro','Visualizador']
const ALL_STATUS  = ['Ativo','Suspenso','Inativo']

export default function UsersPage() {
  const [search, setSearch]       = useState('')
  const [perfilFilter, setPerfil] = useState(ALL_PERFIS)
  const [stFilter, setSt]         = useState(ALL_STATUS)

  const filtered = DATA.filter(u =>
    perfilFilter.includes(u.perfil) && stFilter.includes(u.status) &&
    (!search || u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  )

  const columns: ColumnType<User>[] = [
    { title:'Nome',         dataIndex:'nome',         key:'nome',         sorter:(a,b)=>a.nome.localeCompare(b.nome) },
    { title:'E-mail',       dataIndex:'email',        key:'email',        render: v => <span style={{ color:'rgba(0,0,0,0.65)', fontSize:13 }}>{v}</span> },
    { title:'Perfil',       dataIndex:'perfil',       key:'perfil',       width:120,
      render: v => {
        const s = PERFIL_COLOR[v] ?? PERFIL_COLOR['Visualizador']
        return <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:2, padding:'1px 8px', fontSize:12, whiteSpace:'nowrap' }}>{v}</span>
      }
    },
    { title:'Status',       dataIndex:'status',       key:'status',       width:100, render: v => <Tag status={v} /> },
    { title:'Último acesso',dataIndex:'ultimoAcesso', key:'ultimoAcesso', width:160, render: v => <span style={{ color:'rgba(0,0,0,0.45)', fontSize:12 }}>{v}</span> },
    { title:'Criado em',    dataIndex:'criado',       key:'criado',       width:110 },
    {
      title:'', key:'actions', width:80,
      render: () => (
        <div style={{ display:'flex', gap:4 }}>
          <Button variant="ghost" size="sm" icon="edit">Editar</Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }}>
      <PageHeader
        title="Usuários"
        breadcrumb="Sub-adquirente / Usuários"
        onBack={() => {}}
        extra={<Button variant="primary" size="sm" icon="plus">Novo usuário</Button>}
      />
      <div style={{ padding:24 }}>
        <DataTable<User>
          columns={columns} dataSource={filtered} rowKey="id"
          searchPlaceholder="Buscar nome ou e-mail..."
          searchValue={search} onSearch={setSearch}
          filters={[
            { label:'Perfil',  options:ALL_PERFIS.map(p=>({label:p,value:p})), value:perfilFilter, onChange:setPerfil },
            { label:'Status',  options:ALL_STATUS.map(s=>({label:s,value:s})), value:stFilter,     onChange:setSt     },
          ]}
          onExport={() => {}}
          pageSize={10}
        />
      </div>
    </div>
  )
}
