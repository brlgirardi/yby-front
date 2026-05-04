import type { Meta, StoryObj } from '@storybook/react'
import Loading from './Loading'

const meta: Meta<typeof Loading> = {
  title: 'Shared/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Loading state padrão Yby Front: Spin antd centralizado com texto opcional.',
          '',
          '**Quando usar:**',
          '- Carregamento curto sem forma conhecida (request HTTP rápido)',
          '- Ação dentro de modal/drawer',
          '- Inline (em botões/células)',
          '',
          '**Quando NÃO usar:**',
          '- Carregamento longo com forma conhecida → use **Skeleton** (PricingSkeleton, ConciliationSkeleton)',
          '',
          '**a11y:** Spin antd já tem `aria-busy`. Quando há `message`, ela é anunciada via aria-live.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Loading>

export const Default: Story = { args: {} }

export const ComMensagem: Story = {
  args: { message: 'Carregando dados…' },
}

export const Pequeno: Story = {
  args: { size: 'small' },
}

export const Grande: Story = {
  args: { size: 'large', message: 'Processando, aguarde…' },
}

export const Inline: Story = {
  name: 'Inline (uso em botão)',
  render: () => (
    <button style={{ padding: '6px 16px', border: '1px solid #d9d9d9', borderRadius: 2, background: '#fff' }}>
      <Loading size="small" message="Salvando…" inline />
    </button>
  ),
}
