import type { Meta, StoryObj } from '@storybook/react'
import SkeletonBlock, { SkeletonLine, SkeletonCard } from './Skeleton'

const meta: Meta<typeof SkeletonBlock> = {
  title: 'Shared/Skeleton',
  component: SkeletonBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Primitivos para construir skeletons estruturados (shimmer animado).',
          '',
          '**Heurística:** Nielsen #1 (visibilidade do status do sistema). Em conexões lentas, mostrar a "forma" do conteúdo antes do dado chegar reduz ansiedade e dá feedback de progresso.',
          '',
          '**Quando usar:**',
          '- Listagens de cards/tabelas → use o SkeletonBlock para construir layouts customizados',
          '- Páginas com hierarquia conhecida → use os skeletons compostos (PricingSkeleton, ConciliationSkeleton)',
          '',
          '**Quando NÃO usar:**',
          '- Carregamento curto sem forma conhecida → use **Loading** (Spin + texto)',
          '- Estado vazio → use **EmptyState**',
        ].join('\n'),
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof SkeletonBlock>

export const Bloco: Story = {
  name: 'SkeletonBlock (default)',
  args: { w: 200, h: 14 },
}

export const BlocoLargo: Story = {
  name: 'SkeletonBlock (full width)',
  args: { w: '100%', h: 12 },
}

export const Linhas: Story = {
  name: 'SkeletonLine (parágrafo)',
  render: () => (
    <div style={{ width: 400 }}>
      <SkeletonLine w="100%" h={14} gap={8} />
      <SkeletonLine w="80%" h={12} gap={8} />
      <SkeletonLine w="90%" h={12} gap={8} />
      <SkeletonLine w="60%" h={12} />
    </div>
  ),
}

export const Card: Story = {
  name: 'SkeletonCard (composição)',
  render: () => (
    <SkeletonCard padding={20}>
      <SkeletonBlock w={120} h={14} style={{ marginBottom: 8 }} />
      <SkeletonBlock w="100%" h={32} style={{ marginBottom: 12 }} />
      <SkeletonBlock w="60%" h={11} />
    </SkeletonCard>
  ),
}

export const KpiCards: Story = {
  name: 'Padrão de uso — 4 KPIs',
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} padding={14}>
          <SkeletonBlock w={130} h={11} style={{ marginBottom: 8 }} />
          <SkeletonBlock w={110} h={24} style={{ marginBottom: 6 }} />
          <SkeletonBlock w={90} h={11} />
        </SkeletonCard>
      ))}
    </div>
  ),
}

export const TabelaListagem: Story = {
  name: 'Padrão de uso — linhas de tabela',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 720 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCard key={i} padding={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SkeletonBlock w={28} h={18} />
            <SkeletonBlock w={120} h={14} />
            <span style={{ flex: 1 }} />
            <SkeletonBlock w={80} h={12} />
            <SkeletonBlock w={60} h={12} />
            <SkeletonBlock w={12} h={12} />
          </div>
        </SkeletonCard>
      ))}
    </div>
  ),
}
