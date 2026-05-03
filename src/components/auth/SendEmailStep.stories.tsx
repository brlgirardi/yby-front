import type { Meta, StoryObj } from '@storybook/react'
import SendEmailStep from './SendEmailStep'

const meta: Meta<typeof SendEmailStep> = {
  title: 'Auth/SendEmailStep',
  component: SendEmailStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Etapa 1 do fluxo de recuperação de senha (Tupi: `send-code`). Coleta o e-mail e dispara envio do código de 6 dígitos.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof SendEmailStep>

export const Idle: Story = { args: { onSubmit: () => undefined } }
export const Loading: Story = { args: { loading: true, onSubmit: () => undefined } }
export const ComErro: Story = { args: { error: 'E-mail não encontrado em nossa base.', onSubmit: () => undefined } }
export const ComCancelar: Story = { args: { onSubmit: () => undefined, onCancel: () => undefined } }
