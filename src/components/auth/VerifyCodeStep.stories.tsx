import type { Meta, StoryObj } from '@storybook/react'
import VerifyCodeStep from './VerifyCodeStep'

const meta: Meta<typeof VerifyCodeStep> = {
  title: 'Auth/VerifyCodeStep',
  component: VerifyCodeStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Etapa 2 do fluxo (Tupi: `verify-code`). Aceita só dígitos, máx 6, com `inputMode=numeric` e `autoComplete=one-time-code` (iOS sugere automaticamente o código do SMS/e-mail).',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof VerifyCodeStep>

const baseArgs = { email: 'bruno@yby.com.br', onSubmit: () => undefined, onResend: () => undefined, onBack: () => undefined }

export const Idle: Story = { args: baseArgs }
export const Loading: Story = { args: { ...baseArgs, loading: true } }
export const ComErro: Story = { args: { ...baseArgs, error: 'Código incorreto. Tente novamente.' } }
