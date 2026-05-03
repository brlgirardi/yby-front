import type { Meta, StoryObj } from '@storybook/react'
import InterchangeRateCard from './InterchangeRateCard'

const meta: Meta<typeof InterchangeRateCard> = {
  title: 'Interchange/InterchangeRateCard',
  component: InterchangeRateCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Card colapsável da Matriz de Intercâmbio para uma bandeira (vocabulário Tupi).',
          '',
          '**Vocabulário:**',
          '- *Card brand × type*: Visa Doméstico, Mastercard Internacional, etc.',
          '- *Card tier*: Standard / Premium / Corporate (categoria do cartão)',
          '- *Person type*: PF / PJ',
          '- *Card product*: Crédito / Débito / Pré-pago',
          '- *Card entry*: Chip / Contactless / Magnético (forma de captura)',
          '- *Sector*: E-commerce / Corporativo / Governo',
          '- *Rate*: taxa de intercâmbio (%)',
          '- *Fixed fee*: tarifa fixa adicional por transação (R$)',
          '',
          'Quando expandido, faz fetch das taxas via `fetchInterchangeRates(brand)` e mostra abas por produto. Read-only.',
        ].join('\n'),
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof InterchangeRateCard>

export const Mastercard: Story = {
  args: {
    brand: { id: '1', brand: 'Mastercard', configs: 12, updatedAt: '15/01/2026' },
  },
}

export const Visa: Story = {
  args: {
    brand: { id: '2', brand: 'Visa', configs: 13, updatedAt: '14/01/2026' },
  },
}

export const Elo: Story = {
  args: {
    brand: { id: '3', brand: 'Elo', configs: 11, updatedAt: '13/01/2026' },
  },
}

export const Amex: Story = {
  name: 'American Express',
  args: {
    brand: { id: '4', brand: 'American Express', configs: 10, updatedAt: '10/01/2026' },
  },
}
