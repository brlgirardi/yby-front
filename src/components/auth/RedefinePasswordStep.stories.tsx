import type { Meta, StoryObj } from '@storybook/react'
import RedefinePasswordStep from './RedefinePasswordStep'

const meta: Meta<typeof RedefinePasswordStep> = {
  title: 'Auth/RedefinePasswordStep',
  component: RedefinePasswordStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Etapa 3 do fluxo de recuperação (Tupi: `update-password`) — também usada no fluxo `redefine-temporary-password` (primeiro acesso) com `requireCurrentPassword=true`.',
          '',
          '**Validação live:** mostra checklist de requisitos (tamanho, maiúscula, número, confere com confirmação). O botão fica disabled até todos passarem.',
          '',
          '**Affordance:** botão "olho" mostra/oculta a senha. `autoComplete=new-password` impede o gerenciador de preencher com a senha antiga.',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof RedefinePasswordStep>

export const RecuperacaoSenha: Story = {
  name: 'Recuperação de senha (etapa 3 de 3)',
  args: { onSubmit: () => undefined, onBack: () => undefined },
}

export const PrimeiroAcesso: Story = {
  name: 'Primeiro acesso (com senha temporária)',
  args: {
    requireCurrentPassword: true,
    title: 'Primeiro acesso',
    subtitle: 'Bem-vindo, bruno@yby.com.br. Defina uma nova senha para continuar.',
    onSubmit: () => undefined,
  },
}

export const Loading: Story = { args: { loading: true, onSubmit: () => undefined } }

export const ComErro: Story = {
  args: { error: 'A nova senha deve ser diferente da temporária.', requireCurrentPassword: true, onSubmit: () => undefined },
}
