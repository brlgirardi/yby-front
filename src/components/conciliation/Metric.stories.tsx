import type { Meta, StoryObj } from '@storybook/react'
import Metric from './Metric'

const meta: Meta<typeof Metric> = {
  title: 'Conciliation/Metric',
  component: Metric,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Bloco métrica dual capture × outgoing — usado no `AcquirerSummaryCard`.',
          '',
          'Quando os valores numéricos divergem (`firstValue !== secondValue`), o segundo valor é destacado em vermelho. Isso permite o operador detectar a divergência sem precisar comparar mentalmente os dois números.',
        ].join('\n'),
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof Metric>

export const Igual: Story = {
  name: 'Conciliado (capture = outgoing)',
  args: {
    label: 'Transações',
    valuePrimary: '1.240',
    valueSecondary: '1.240',
    firstValue: 1240,
    secondValue: 1240,
  },
}

export const Divergente: Story = {
  args: {
    label: 'Transações',
    tooltip: 'Quantidade de transações no dia, capture × outgoing.',
    valuePrimary: '892',
    valueSecondary: '884',
    firstValue: 892,
    secondValue: 884,
  },
}

export const ValorTPV: Story = {
  name: 'Volume (TPV) divergente',
  args: {
    label: 'Volume (TPV)',
    valuePrimary: 'R$ 198.320,00',
    valueSecondary: 'R$ 197.850,00',
    firstValue: 198320,
    secondValue: 197850,
  },
}
