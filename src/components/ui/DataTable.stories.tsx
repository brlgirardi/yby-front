import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import DataTable, { type ColumnType } from './DataTable'
import Tag from '@/components/shared/Tag'

/**
 * Padrões visuais do DataTable (atualizado 2026-04):
 *
 * ## Estrutura
 * - Wrapper branco com `border: 1px solid rgba(0,0,0,0.06)` e `borderRadius: 2`
 * - Padding interno `0 21px` em volta da tabela Ant Design
 * - `size="large"` para rows de 56px
 * - Header com `#fafafa` e `fontWeight: 400`
 * - `scroll={{ x: 'max-content' }}` ativo por padrão — garante que widths de colunas sejam respeitados
 *
 * ## Título
 * - Título e `titleExtra` ficam na mesma linha (título à esquerda, extra à direita)
 * - **Sem `borderBottom`** separando título da tabela — a separação é dada apenas pelo espaçamento
 * - Quando a tabela tem botão "Exportar" mas **não tem toolbar** (sem busca/filtros):
 *   → Use `titleExtra` com o botão, NÃO `onExport` (que cria uma linha de toolbar extra)
 *
 * ## Paginação
 * - Paginação **sempre visível** em todas as tabelas — nunca use `showPagination={false}`
 * - Mesmo tabelas com poucos registros devem mostrar "1–N de N itens | 10 por página"
 * - Isso mantém consistência visual e comunica o total de registros ao usuário
 *
 * ## Toolbar
 * - Use `onSearch`, `filters`, `onExport`, `onAdvancedFilter` somente quando a tabela
 *   tem interatividade real (busca, filtros múltiplos). Essas props criam a linha de toolbar.
 * - Evitar toolbar "fantasma" só com Exportar — prefira titleExtra nesses casos.
 */

const meta: Meta<typeof DataTable> = {
  title: 'Design System/Organisms/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#F2F4F8', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DataTable>

// ─── Merchants ───────────────────────────────────────────────────────────────

type Merchant = {
  id: string
  name: string
  cnpj: string
  mcc: string
  status: string
  volume: string
  txns: number
}

const MERCHANTS: Merchant[] = [
  { id: 'MCH-001', name: 'Americanas S.A.', cnpj: '00.776.574/0001-56', mcc: '5912', status: 'Ativo', volume: 'R$ 1.240.500,00', txns: 8420 },
  { id: 'MCH-002', name: 'Magazine Luiza', cnpj: '47.960.950/0001-21', mcc: '5731', status: 'Ativo', volume: 'R$ 987.200,00', txns: 6310 },
  { id: 'MCH-003', name: 'Rappi Brasil', cnpj: '28.665.021/0001-89', mcc: '5812', status: 'Ativo', volume: 'R$ 765.400,00', txns: 14980 },
  { id: 'MCH-004', name: 'iFood Ltda', cnpj: '14.380.200/0001-21', mcc: '5812', status: 'Ativo', volume: 'R$ 654.900,00', txns: 12340 },
  { id: 'MCH-005', name: 'Shopee Brasil', cnpj: '35.060.991/0001-56', mcc: '5999', status: 'Suspenso', volume: 'R$ 432.100,00', txns: 5670 },
  { id: 'MCH-006', name: 'Amazon Brasil', cnpj: '15.436.940/0001-03', mcc: '5999', status: 'Ativo', volume: 'R$ 2.180.700,00', txns: 19850 },
  { id: 'MCH-007', name: 'Mercado Livre', cnpj: '03.007.331/0001-41', mcc: '5999', status: 'Ativo', volume: 'R$ 3.450.200,00', txns: 28900 },
  { id: 'MCH-008', name: 'Netshoes', cnpj: '07.526.557/0001-00', mcc: '5661', status: 'Inativo', volume: 'R$ 89.400,00', txns: 740 },
]

const merchantColumns: ColumnType<Merchant>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    render: (v) => <span style={{ color: '#1890FF', fontFamily: 'Roboto Mono', fontSize: 12 }}>{v}</span>,
  },
  {
    title: 'Nome',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (v) => <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.85)' }}>{v}</span>,
  },
  {
    title: 'CNPJ',
    dataIndex: 'cnpj',
    key: 'cnpj',
    width: 180,
    render: (v) => <span style={{ fontFamily: 'Roboto Mono', fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{v}</span>,
  },
  {
    title: 'MCC',
    dataIndex: 'mcc',
    key: 'mcc',
    width: 70,
    render: (v) => <span style={{ color: 'rgba(0,0,0,0.65)' }}>{v}</span>,
  },
  {
    title: 'Volume (30d)',
    dataIndex: 'volume',
    key: 'volume',
    sorter: true,
    render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
  },
  {
    title: 'Transações',
    dataIndex: 'txns',
    key: 'txns',
    sorter: (a, b) => a.txns - b.txns,
    width: 110,
    render: (v) => <span style={{ color: 'rgba(0,0,0,0.65)' }}>{v.toLocaleString('pt-BR')}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (v) => <Tag status={v} />,
  },
  {
    title: 'Ações',
    key: 'actions',
    width: 96,
    render: () => (
      <div style={{ display: 'flex', gap: 4 }}>
        {[
          {
            path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
            extra: <circle cx="12" cy="12" r="3" />,
            hover: '#1890FF',
          },
          {
            path: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
            hover: '#1890FF',
          },
        ].map((icon, i) => (
          <button
            key={i}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'rgba(0,0,0,0.45)',
              display: 'flex',
              borderRadius: 4,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={icon.path} />
              {icon.extra}
            </svg>
          </button>
        ))}
        <button
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 4,
            color: 'rgba(0,0,0,0.45)',
            display: 'flex',
            borderRadius: 4,
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    ),
  },
]

export const Merchants: Story = {
  name: 'Merchants — busca + filtros + exportar + filtro avançado',
  render: () => {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string[]>(['Ativo', 'Suspenso', 'Inativo'])

    const data = MERCHANTS.filter(
      (m) =>
        statusFilter.includes(m.status) &&
        (!search || m.name.toLowerCase().includes(search.toLowerCase()) || m.cnpj.includes(search)),
    )

    return (
      <DataTable<Merchant>
        columns={merchantColumns}
        dataSource={data}
        rowKey="id"
        searchPlaceholder="Buscar por nome, CNPJ..."
        searchValue={search}
        onSearch={setSearch}
        filters={[
          {
            label: 'Status',
            options: [
              { label: 'Ativo', value: 'Ativo' },
              { label: 'Suspenso', value: 'Suspenso' },
              { label: 'Inativo', value: 'Inativo' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        onExport={() => alert('Exportar CSV')}
        onAdvancedFilter={() => alert('Abrir filtro avançado')}
      />
    )
  },
}

// ─── Transações ───────────────────────────────────────────────────────────────

type Transaction = {
  id: string
  merchant: string
  date: string
  value: string
  method: string
  installments: string
  status: string
}

const TRANSACTIONS: Transaction[] = [
  {
    id: '#TXN-9001',
    merchant: 'Mercado Livre',
    date: '22/04/2026',
    value: 'R$ 3.450,00',
    method: 'Visa',
    installments: '1x',
    status: 'Aprovado',
  },
  {
    id: '#TXN-9002',
    merchant: 'Amazon Brasil',
    date: '22/04/2026',
    value: 'R$ 1.280,90',
    method: 'Mastercard',
    installments: '3x',
    status: 'Aprovado',
  },
  {
    id: '#TXN-9003',
    merchant: 'Rappi Brasil',
    date: '21/04/2026',
    value: 'R$ 87,50',
    method: 'PIX',
    installments: '1x',
    status: 'Aprovado',
  },
  {
    id: '#TXN-9004',
    merchant: 'iFood Ltda',
    date: '21/04/2026',
    value: 'R$ 430,00',
    method: 'Elo',
    installments: '2x',
    status: 'Em análise',
  },
  {
    id: '#TXN-9005',
    merchant: 'Shopee Brasil',
    date: '20/04/2026',
    value: 'R$ 760,00',
    method: 'Mastercard',
    installments: '6x',
    status: 'Recusado',
  },
  {
    id: '#TXN-9006',
    merchant: 'Magazine Luiza',
    date: '20/04/2026',
    value: 'R$ 2.100,00',
    method: 'Visa',
    installments: '12x',
    status: 'Aprovado',
  },
  {
    id: '#TXN-9007',
    merchant: 'Americanas S.A.',
    date: '19/04/2026',
    value: 'R$ 999,00',
    method: 'Visa',
    installments: '1x',
    status: 'Pendente',
  },
]

const txnColumns: ColumnType<Transaction>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (v) => <span style={{ color: '#1890FF', fontFamily: 'Roboto Mono', fontSize: 12 }}>{v}</span>,
  },
  {
    title: 'Merchant',
    dataIndex: 'merchant',
    key: 'merchant',
    sorter: (a, b) => a.merchant.localeCompare(b.merchant),
  },
  { title: 'Data', dataIndex: 'date', key: 'date', width: 110 },
  {
    title: 'Valor',
    dataIndex: 'value',
    key: 'value',
    render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
  },
  { title: 'Método', dataIndex: 'method', key: 'method' },
  { title: 'Parcelas', dataIndex: 'installments', key: 'installments', width: 90 },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (v) => <Tag status={v} />,
  },
]

export const Transactions: Story = {
  name: 'Cobranças — com busca e filtro de status',
  render: () => {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string[]>(['Aprovado', 'Pendente', 'Em análise', 'Recusado'])

    const data = TRANSACTIONS.filter(
      (r) =>
        statusFilter.includes(r.status) &&
        (!search || r.merchant.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search)),
    )

    return (
      <DataTable<Transaction>
        columns={txnColumns}
        dataSource={data}
        rowKey="id"
        searchPlaceholder="Buscar merchant ou transação..."
        searchValue={search}
        onSearch={setSearch}
        filters={[
          {
            label: 'Status',
            options: [
              { label: 'Aprovado', value: 'Aprovado' },
              { label: 'Pendente', value: 'Pendente' },
              { label: 'Em análise', value: 'Em análise' },
              { label: 'Recusado', value: 'Recusado' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        onExport={() => alert('Exportar CSV')}
      />
    )
  },
}

// ─── Com título e titleExtra (toggle) — padrão Agenda ───────────────────────

export const ComTituloEToggle: Story = {
  name: 'Com título + titleExtra (toggle) — padrão Agenda',
  render: () => {
    const [search, setSearch] = useState('')
    const [toggle, setToggle] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string[]>(['Ativo', 'Suspenso', 'Inativo'])

    const data = MERCHANTS.filter(
      (m) => statusFilter.includes(m.status) && (!search || m.name.toLowerCase().includes(search.toLowerCase())),
    )

    const toggleExtra = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>Visualizar por parcela</span>
        <div
          onClick={() => setToggle((v) => !v)}
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            background: toggle ? '#1890FF' : '#d9d9d9',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 3,
              left: toggle ? 20 : 3,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0,35,11,0.2)',
              transition: 'left 0.2s',
            }}
          />
        </div>
      </div>
    )

    return (
      <DataTable<Merchant>
        title="Seus recebíveis"
        titleExtra={toggleExtra}
        columns={merchantColumns.slice(0, 6)}
        dataSource={data}
        rowKey="id"
        searchPlaceholder="Pesquise o pagamento"
        searchValue={search}
        onSearch={setSearch}
        filters={[
          {
            label: 'Status',
            options: [
              { label: 'Ativo', value: 'Ativo' },
              { label: 'Suspenso', value: 'Suspenso' },
              { label: 'Inativo', value: 'Inativo' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        onExport={() => alert('Exportar CSV')}
        onAdvancedFilter={() => alert('Filtro avançado')}
        pageSize={10}
      />
    )
  },
}

// ─── Título + Exportar no cabeçalho (padrão Extrato / Eventos / Pagamentos) ──

export const ComTituloEExportar: Story = {
  name: 'Com título + Exportar no cabeçalho — padrão Extrato',
  render: () => (
    <DataTable<Merchant>
      title="Extrato de caixa — Abril 2026"
      titleExtra={
        <button
          style={{
            border: '1px solid #d9d9d9',
            background: '#fff',
            borderRadius: 2,
            padding: '4px 14px',
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'rgba(0,0,0,0.85)',
          }}
        >
          ↓ Exportar
        </button>
      }
      columns={merchantColumns.slice(0, 5)}
      dataSource={MERCHANTS}
      rowKey="id"
    />
  ),
}

// ─── Sem toolbar ─────────────────────────────────────────────────────────────

export const SemToolbar: Story = {
  name: 'Sem toolbar — tabela com paginação (padrão)',
  render: () => (
    <DataTable<Merchant>
      title="Tabela simples — paginação sempre visível"
      columns={merchantColumns.slice(0, 5)}
      dataSource={MERCHANTS}
      rowKey="id"
    />
  ),
}

// ─── Loading ─────────────────────────────────────────────────────────────────

export const Loading: Story = {
  name: 'Estado loading (skeleton)',
  render: () => (
    <DataTable<Merchant>
      columns={merchantColumns}
      dataSource={[]}
      rowKey="id"
      loading
      searchPlaceholder="Buscar..."
      onSearch={() => {}}
    />
  ),
}

// ─── Sem resultados ───────────────────────────────────────────────────────────

export const Vazio: Story = {
  name: 'Estado vazio — sem resultados',
  render: () => (
    <DataTable<Merchant>
      columns={merchantColumns}
      dataSource={[]}
      rowKey="id"
      searchValue="xpto123"
      onSearch={() => {}}
      searchPlaceholder="Buscar..."
    />
  ),
}