import type { Meta, StoryObj } from '@storybook/react'
import PersonaBadge from './PersonaBadge'
import { usePersonaStore } from '@/stores/personaStore'
import type { Persona, Version } from '@/features/manifests/types'

const meta: Meta<typeof PersonaBadge> = {
  title: 'Domain/PersonaBadge',
  component: PersonaBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Badge dev-only que aparece no header quando o usuário aplicou um override manual de persona/versão via /settings/dev. Usado pra deixar visível em dev/QA que o app está rodando em modo "forçado", evitando confusão com o estado real do JWT.',
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      // Força o estado do store antes de renderizar a story
      const persona = (ctx.parameters.persona ?? 'subadquirente') as Persona
      const version = (ctx.parameters.version ?? 'v1') as Version
      const override = (ctx.parameters.isDevOverride ?? true) as boolean
      usePersonaStore.setState({ persona, version, isDevOverride: override })
      return <Story />
    },
  ],
}

export default meta
type Story = StoryObj<typeof PersonaBadge>

export const ECv0: Story = {
  name: 'EC v0 (override)',
  parameters: { persona: 'estabelecimento', version: 'v0', isDevOverride: true },
}

export const SAv1: Story = {
  name: 'SA v1 (override)',
  parameters: { persona: 'subadquirente', version: 'v1', isDevOverride: true },
}

export const AQv0: Story = {
  name: 'AQ v0 (override)',
  parameters: { persona: 'adquirente', version: 'v0', isDevOverride: true },
}

export const SemOverride: Story = {
  name: 'Sem override (badge oculto)',
  parameters: { persona: 'subadquirente', version: 'v1', isDevOverride: false },
}

export const LabelCustomizado: Story = {
  name: 'Label customizado',
  args: { label: 'PREVIEW' },
  parameters: { persona: 'estabelecimento', version: 'v0', isDevOverride: true },
}
