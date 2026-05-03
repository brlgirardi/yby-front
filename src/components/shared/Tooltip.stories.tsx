import type { Meta, StoryObj } from '@storybook/react'
import Tooltip from './Tooltip'
import Tag from './Tag'

const meta: Meta<typeof Tooltip> = {
  title: 'Shared/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Tooltip global do design system. Padrões fundamentais:',
          '',
          '**1. Cursor `help` é automático.** Sempre que houver Tooltip, o cursor muda para "?" no hover. Isso é convenção e não deve ser sobrescrita pelo chamador. Garante que o usuário aprenda uma única affordance visual.',
          '',
          '**2. `delay` controla intenção.** `delay=0` (default) mostra imediato — use para truncate, NSU, codes em monoespaço. `delay=1000` (1s) usa para conteúdo explicativo (status, KPIs, jargão técnico). Evita mostrar tooltip em hover acidental.',
          '',
          '**3. `bare` controla aparência.** `bare=false` (default) mostra ícone "?" ao lado do conteúdo — use em formulários ou labels onde o usuário precisa SABER que tem ajuda. `bare=true` deixa só o cursor mudar — use em badges, tags, chips, KPIs onde o ícone "?" polui.',
          '',
          '**4. Renderiza via portal.** Tooltip aparece em `document.body` com `position:fixed`, então nunca é cortado por `overflow:hidden` de tabela ou drawer.',
          '',
          'Heurística #6 Nielsen (recognition over recall): se o usuário aprende a convenção, tem que valer em todo lugar.',
        ].join('\n'),
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const ComIconeAjuda: Story = {
  name: 'Com ícone "?" (default)',
  args: {
    text: 'Spread MDR é a diferença entre o MDR cobrado dos ECs e o MDR pago aos adquirentes. Margem de intermediação do sub.',
    children: <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.85)' }}>Spread de MDR</span>,
  },
}

export const Bare: Story = {
  name: 'Bare (sem ícone) — para tags e chips',
  args: {
    text: 'A cobrança foi realizada com sucesso e o pagamento foi confirmado na sua maquininha de cartão.',
    bare: true,
    children: <Tag status="Aprovada" />,
  },
}

export const ComDelay: Story = {
  name: 'Com delay 1s (status)',
  args: {
    text: 'Aguardando publicação na Núclea. Após registro, o adquirente liquida na conta do sub.',
    bare: true,
    delay: 1000,
    children: <Tag status="Em processamento" />,
  },
}

export const PadraoNoYby: Story = {
  name: 'Padrão de uso no Yby — exemplos',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Roboto, sans-serif', padding: 24 }}>
      <section>
        <h4 style={{ marginBottom: 12, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>Status em tabela (bare + delay 1000)</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tooltip text="Crédito confirmado pelo adquirente. Dinheiro creditado na conta do sub." delay={1000} bare>
            <Tag status="Liquidado" />
          </Tooltip>
          <Tooltip text="Aguardando publicação na Núclea." delay={1000} bare>
            <Tag status="Em processamento" />
          </Tooltip>
          <Tooltip text="Disputa aberta pelo portador junto à bandeira." delay={1000} bare>
            <Tag status="Chargeback" />
          </Tooltip>
        </div>
      </section>

      <section>
        <h4 style={{ marginBottom: 12, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>Truncate de NSU/Auth Code (bare + delay 0)</h4>
        <Tooltip text="68e18784-7ddd-398f-9d19-6746e4a14cb9" bare>
          <span style={{ fontFamily: 'Roboto Mono', fontSize: 11, color: 'rgba(0,0,0,0.55)', borderBottom: '1px dotted rgba(0,0,0,0.25)' }}>
            68e18784-7ddd-3…
          </span>
        </Tooltip>
      </section>

      <section>
        <h4 style={{ marginBottom: 12, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>KPI hero com tooltip (bare + delay 1000)</h4>
        <Tooltip
          text="Receita bruta menos custos com adquirentes. Margem operacional do sub no período."
          delay={1000}
          bare
          style={{ display: 'inline-flex' }}
        >
          <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 2, padding: '14px 18px', minWidth: 200 }}>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', fontWeight: 500, marginBottom: 6 }}>Margem operacional</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#52c41a' }}>R$ 14.392,00</div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>32,6% sobre receita bruta</div>
          </div>
        </Tooltip>
      </section>
    </div>
  ),
}
