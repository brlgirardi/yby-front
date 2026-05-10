'use client'
// Empresas do Estabelecimento Comercial — V0.
// SEM screenshot do Figma — versão mínima viável: lista de empresas
// (matriz + filiais) vinculadas ao EC.

import { useMemo, useState } from 'react'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/shared/Tag'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import Drawer from '@/components/shared/Drawer'
import { ecEmpresas, type Empresa } from '@/mocks/ec/configuracoes'

export default function EcEmpresas() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Empresa | null>(null)

  const data = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return ecEmpresas
    return ecEmpresas.filter(
      (e) =>
        e.razaoSocial.toLowerCase().includes(term) ||
        e.nomeFantasia.toLowerCase().includes(term) ||
        e.cnpj.includes(term),
    )
  }, [search])

  const columns: ColumnType<Empresa>[] = [
    { title: 'Razão social',   dataIndex: 'razaoSocial',  key: 'razaoSocial' },
    { title: 'Nome fantasia',  dataIndex: 'nomeFantasia', key: 'nomeFantasia' },
    { title: 'CNPJ',           dataIndex: 'cnpj',         key: 'cnpj',         width: 180 },
    { title: 'Vínculo',        dataIndex: 'vinculo',      key: 'vinculo',      width: 110 },
    {
      title:  'Status',
      key:    'status',
      width:  120,
      render: (_: unknown, row: Empresa) => <Tag status={row.status === 'Ativa' ? 'Ativo' : 'Inativo'} label={row.status} />,
    },
    {
      title:  'Ações',
      key:    'acoes',
      width:  80,
      render: (_: unknown, row: Empresa) => (
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
        title="Empresas"
        breadcrumb="Estabelecimento Comercial / Configurações / Empresas"
        extra={<Button variant="primary" icon="plus">Adicionar empresa</Button>}
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <DataTable<Empresa>
          columns={columns}
          dataSource={data}
          rowKey="id"
          searchPlaceholder="Pesquisar por razão, fantasia ou CNPJ"
          searchValue={search}
          onSearch={setSearch}
          onRow={(row) => ({ onClick: () => setSelected(row) })}
        />
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Detalhes da empresa"
        width={480}
      >
        {selected && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>Dados da empresa</span>
              <Tag status={selected.status === 'Ativa' ? 'Ativo' : 'Inativo'} label={selected.status} />
            </div>
            {[
              { label: 'Razão social',   value: selected.razaoSocial },
              { label: 'Nome fantasia',  value: selected.nomeFantasia },
              { label: 'CNPJ',           value: selected.cnpj },
              { label: 'Vínculo',        value: selected.vinculo },
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
