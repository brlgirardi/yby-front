import type { Meta, StoryObj } from '@storybook/react'
import LoginForm from './LoginForm'

const meta: Meta<typeof LoginForm> = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Formulário de login do Yby Front. UI pura — recebe `loading`, `error` e `onSubmit` do parent.',
          '',
          '**Comportamento:**',
          '- Enter em qualquer input dispara submit',
          '- Loading bloqueia inputs e mostra "Entrando..."',
          '- Erros vêm do parent (tipicamente `ApiError.body.message`)',
          '- Toggle de visualização de senha com ícone eye/eyeOff',
          '',
          '**`showDemoBadge`:** mostrado quando `apiMode === "mock"` (env). Avisa o usuário que qualquer credencial entra — evita confusão em demos.',
          '',
          '**Acessibilidade:** alert role no banner de erro, `aria-label` no toggle de senha, `autoComplete` correto nos inputs (email/current-password).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    onSubmit: { action: 'submit' },
  },
}
export default meta

type Story = StoryObj<typeof LoginForm>

export const Idle: Story = {
  name: 'Idle (estado inicial)',
  args: {
    loading: false,
    error: null,
  },
}

export const Loading: Story = {
  name: 'Loading (request em voo)',
  args: {
    loading: true,
    error: null,
  },
}

export const ComErro: Story = {
  name: 'Com erro de credencial',
  args: {
    loading: false,
    error: 'E-mail ou senha incorretos.',
  },
}

export const ModoDemo: Story = {
  name: 'Modo demo (mock API)',
  args: {
    loading: false,
    error: null,
    showDemoBadge: true,
  },
}

export const ErroDeRede: Story = {
  name: 'Erro de rede',
  args: {
    loading: false,
    error: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  },
}
