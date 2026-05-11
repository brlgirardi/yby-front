import type { Meta, StoryObj } from '@storybook/react'
import PersonaSwitcher from './PersonaSwitcher'
import { usePersonaStore } from '@/stores/personaStore'
import type { Persona, Version } from '@/features/manifests/types'

const meta: Meta<typeof PersonaSwitcher> = {
  title: 'Design System/Organisms/Layout/PersonaSwitcher',
  component: PersonaSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Switcher de persona/versão exibido no GlobalHeader em dev/QA. Em produção vira span estático mostrando a persona do JWT. Quando o usuário aplica override manual, o badge muda pra amarelo + borda tracejada (heurística do enquadramento — Pixel/Rian Enviesados cap. 6) pra deixar visível que está em modo forçado.',
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const persona = (ctx.parameters.persona ?? 'subadquirente') as Persona
      const version = (ctx.parameters.version ?? 'v1') as Version
      const override = (ctx.parameters.isDevOverride ?? false) as boolean
      usePersonaStore.setState({ persona, version, isDevOverride: override })
      return (
        <div style={{ background: '#fff', padding: 24 }}>
          <Story />
        </div>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof PersonaSwitcher>

export const Default: Story = {
  name: 'Default (sem override) — azul',
  parameters: { persona: 'subadquirente', version: 'v1', isDevOverride: false },
}

export const OverrideEC: Story = {
  name: 'Override EC v0 — amarelo tracejado',
  parameters: { persona: 'estabelecimento', version: 'v0', isDevOverride: true },
}

export const OverrideAQ: Story = {
  name: 'Override AQ v0 — amarelo tracejado',
  parameters: { persona: 'adquirente', version: 'v0', isDevOverride: true },
}
