'use client'
// Usuários do Estabelecimento Comercial — V0.
// SEM screenshot do Figma — versão mínima viável: lista tabular.

import { useMemo, useState } from 'react'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/atoms/Tag'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Drawer from '@/components/shared/Drawer'
import { ecUsuarios, type Usuario } from '@/mocks/ec/configuracoes'

export default function EcUsuarios() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Usuario | null>(null)

  const data = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return ecUsuarios
    return ecUsuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.papel.toLowerCase().includes(term),
    )
  }, [search])

  const columns: ColumnType<Usuario>[] = [
    { title: 'Nome',         dataIndex: 'nome',         key: 'nome' },
    { title: 'E-mail',       dataIndex: 'email',        key: 'email' },
    { title: 'Papel',        dataIndex: 'papel',        key: 'papel',        width: 130 },
    { title: 'Último acesso',dataIndex: 'ultimoAcesso', key: 'ultimoAcesso', width: 160 },
    {
      title:  'Status',
      key:    'status',
      width:  120,
      render: (_: unknown, row: Usuario) => <Tag status={row.status} />,
    },
    {
      title:  'Ações',
      key:    'acoes',
      width:  80,
      render: (_: unknown, row: Usuario) => (
        <button
          aria-label="Ver detalhes"
          onClick={(e) => { e.stopPropagation(); setSelected(row) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)' }}
        >
          <Icon name="eye" size={16} />
        </button>
      ),
    },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Usuários"
        breadcrumb="Estabelecimento Comercial / Configurações / Usuários"
        extra={<Button variant="primary" icon="userPlus">Convidar usuário</Button>}
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <DataTable<Usuario>
          columns={columns}
          dataSource={data}
          rowKey="id"
          searchPlaceholder="Pesquisar por nome, e-mail ou papel"
          searchValue={search}
          onSearch={setSearch}
          onRow={(row) => ({ onClick: () => setSelected(row) })}
        />
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Detalhes do usuário"
        width={480}
        footer={
          <>
            <button style={{ flex: 1, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }}>Editar</button>
            <button style={{ flex: 1, border: '1px solid #ff4d4f', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: '#ff4d4f' }}>Desativar</button>
          </>
        }
      >
        {selected && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Dados do usuário</span>
              <Tag status={selected.status} />
            </div>
            {[
              { label: 'Nome',          value: selected.nome },
              { label: 'E-mail',        value: selected.email },
              { label: 'Papel',         value: selected.papel },
              { label: 'Último acesso', value: selected.ultimoAcesso },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>{r.label}</span>
                <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </>
        )}
      </Drawer>
    </div>
  )
}
