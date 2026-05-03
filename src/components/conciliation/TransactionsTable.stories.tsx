import type { Meta, StoryObj } from '@storybook/react'
import TransactionsTable from './TransactionsTable'
import type { TransactionDetail } from '@/services/types/brandDetail.types'

const meta: Meta<typeof TransactionsTable> = {
  title: 'Conciliation/TransactionsTable',
  component: TransactionsTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Tabela de transações detalhadas dentro de um IRD — usada no drawer de detalhe. Cada linha: NSU, Terminal ID, Valor, ITC apurado. Variantes: `non-conciliated` (amarelo) ou `conciliated` (verde). Espelha `TransactionsTable` do branch LGR-264-recon-acquirer.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof TransactionsTable>

const txs: TransactionDetail[] = [
  { nsu: 'NSU-001241', terminalId: 'POS-A-9821', amount:  450.00, calculatedItc:  10.35, transactionDate: '2026-04-24T10:14:00Z' },
  { nsu: 'NSU-001242', terminalId: 'POS-A-9821', amount:  120.50, calculatedItc:   2.77, transactionDate: '2026-04-24T11:02:00Z' },
  { nsu: 'NSU-001243', terminalId: 'POS-B-1130', amount:  329.50, calculatedItc:   7.58, transactionDate: '2026-04-24T13:24:00Z' },
  { nsu: 'NSU-001244', terminalId: 'POS-B-1130', amount: 4280.00, calculatedItc:  98.44, transactionDate: '2026-04-24T16:48:00Z' },
]

export const Divergentes: Story = {
  args: { transactions: txs, variant: 'non-conciliated' },
}

export const Conciliadas: Story = {
  args: { transactions: txs, variant: 'conciliated' },
}

export const Loading: Story = { args: { transactions: [], variant: 'non-conciliated', loading: true } }

export const Vazio: Story = { args: { transactions: [] } }
