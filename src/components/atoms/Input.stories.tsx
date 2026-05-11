import type { Meta, StoryObj } from '@storybook/react'
import Input from './Input'

const meta: Meta<typeof Input> = {
  title: 'Design System/Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label acima do campo',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder do input',
    },
    error: {
      control: 'text',
      description: 'Mensagem de erro (ativa border vermelha)',
    },
    hint: {
      control: 'text',
      description: 'Texto de ajuda abaixo do campo (só exibido sem erro)',
    },
    prefix: {
      control: 'select',
      options: [undefined, 'search', 'users', 'landmark', 'creditCard', 'filter'],
      description: 'Ícone à esquerda',
    },
    suffix: {
      control: 'select',
      options: [undefined, 'eye', 'eyeOff', 'x', 'chevronDown', 'info'],
      description: 'Ícone à direita',
    },
    disabled: {
      control: 'boolean',
      description: 'Campo desabilitado',
    },
  },
  parameters: {
    backgrounds: { default: 'white' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#fff', maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

// --- Default controlável ---
export const Default: Story = {
  args: {
    placeholder: 'Digite aqui...',
  },
}

// --- Com label ---
export const ComLabel: Story = {
  name: 'Com label',
  args: {
    label: 'Nome do Merchant',
    placeholder: 'Ex.: Loja Alpha LTDA',
  },
}

// --- Com erro ---
export const ComErro: Story = {
  name: 'Estado de erro',
  args: {
    label: 'CNPJ',
    placeholder: '00.000.000/0001-00',
    error: 'CNPJ inválido. Verifique e tente novamente.',
  },
}

// --- Disabled ---
export const Disabled: Story = {
  name: 'Estado disabled',
  args: {
    label: 'Código do Merchant',
    value: 'MER-00123',
    disabled: true,
    hint: 'Este campo não pode ser editado.',
  },
}

// --- Com ícone prefix (search) ---
export const ComSearch: Story = {
  name: 'Busca — com ícone prefix',
  args: {
    prefix: 'search',
    placeholder: 'Buscar merchants...',
  },
}

// --- Com ícone suffix (senha) ---
export const ComSufixoSenha: Story = {
  name: 'Senha — com sufixo eye',
  args: {
    label: 'Senha',
    placeholder: '••••••••',
    type: 'password',
    suffix: 'eye',
  },
}

// --- Com hint ---
export const ComHint: Story = {
  name: 'Com texto de ajuda (hint)',
  args: {
    label: 'Limite de crédito',
    placeholder: 'R$ 0,00',
    hint: 'Valor máximo de crédito mensal para este merchant.',
    prefix: 'landmark',
  },
}

// --- Formulário completo de exemplo ---
export const FormularioCompleto: Story = {
  name: 'Uso real — formulário de merchant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24, background: '#fff', maxWidth: 400 }}>
      <Input label="Razão Social"  placeholder="Ex.: Loja Alpha LTDA" />
      <Input label="CNPJ"          placeholder="00.000.000/0001-00" />
      <Input label="E-mail"        placeholder="contato@empresa.com" prefix="users" />
      <Input label="Limite mensal" placeholder="R$ 0,00" prefix="landmark"
        hint="Valor máximo de processamento por mês." />
      <Input label="Token de acesso" placeholder="tok_••••••••"
        suffix="eye" disabled hint="Gerado automaticamente pelo sistema." />
      <Input label="Código inválido" placeholder="MER-XXXXX"
        error="Merchant não encontrado. Verifique o código." />
    </div>
  ),
  decorators: [(Story) => <div style={{ background: '#F2F4F8', padding: 24 }}><Story /></div>],
}
