import type { Meta, StoryObj } from '@storybook/react'
import Tag from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Design System/Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'Aprovado', 'Pago', 'Liquidado', 'Quitado', 'Recuperado', 'Ativo',
        'Pendente', 'Em aberto', 'A recuperar', 'Suspenso', 'Antecipado', 'Previsto',
        'Recusado', 'Chargeback', 'Erro',
        'Cancelado', 'Inativo',
        'Em análise', 'Info',
      ],
      description: 'Status que define cor, ícone e texto padrão do badge',
    },
    label: {
      control: 'text',
      description: 'Texto alternativo (sobrescreve o status key)',
    },
    showIcon: {
      control: 'boolean',
      description: 'Exibe ícone semântico antes do texto. Default: true (padrão Figma)',
    },
  },
  parameters: {
    backgrounds: { default: 'white' },
    docs: {
      description: {
        component: `
**Tag** é o componente de status semântico do sistema. Segue o padrão Figma com dois variants:

- **Com ícone** (\`showIcon\` = true, default): círculo com símbolo semântico + texto. Usar em tabelas, listas de status.
- **Sem ícone** (\`showIcon\` = false): apenas texto com cor. Usar em contextos compactos ou onde o ícone seria redundante.

### Mapeamento semântico de ícones
| Grupo | Statuses | Ícone |
|---|---|---|
| Sucesso | Aprovado, Pago, Ativo | ✓ círculo |
| Aviso | Pendente, Antecipado | ⓘ círculo |
| Atenção | Suspenso | ⚠ triângulo |
| Erro | Recusado, Chargeback, Erro | ✕ círculo |
| Neutro | Cancelado, Inativo | — círculo |
| Info | Em análise, Info | ⓘ círculo |
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Tag>

// ── Variant: Com ícone (default Figma) ────────────────────────────────────

export const ComIconeAtivo: Story        = { name: '✅ Com ícone — Ativo',       args: { status: 'Ativo' } }
export const ComIconePago: Story         = { name: '✅ Com ícone — Pago',        args: { status: 'Pago' } }
export const ComIconePendente: Story     = { name: '⚠️ Com ícone — Pendente',    args: { status: 'Pendente' } }
export const ComIconeSuspenso: Story     = { name: '⚠️ Com ícone — Suspenso',    args: { status: 'Suspenso' } }
export const ComIconeRecusado: Story     = { name: '🔴 Com ícone — Recusado',    args: { status: 'Recusado' } }
export const ComIconeChargeback: Story   = { name: '🔴 Com ícone — Chargeback',  args: { status: 'Chargeback' } }
export const ComIconeCancelado: Story    = { name: '⬜ Com ícone — Cancelado',   args: { status: 'Cancelado' } }
export const ComIconeInativo: Story      = { name: '⬜ Com ícone — Inativo',     args: { status: 'Inativo' } }
export const ComIconeEmAnalise: Story    = { name: 'ℹ️ Com ícone — Em análise',  args: { status: 'Em análise' } }
export const ComIconeAntecipado: Story   = { name: '🟡 Com ícone — Antecipado', args: { status: 'Antecipado' } }

// ── Variant: Sem ícone ─────────────────────────────────────────────────────

export const SemIconeAtivo: Story      = { name: 'Sem ícone — Ativo',    args: { status: 'Ativo',    showIcon: false } }
export const SemIconePendente: Story   = { name: 'Sem ícone — Pendente', args: { status: 'Pendente', showIcon: false } }
export const SemIconeRecusado: Story   = { name: 'Sem ícone — Recusado', args: { status: 'Recusado', showIcon: false } }

// ── Galeria — Com ícone ────────────────────────────────────────────────────

export const GaleriaComIcone: Story = {
  name: 'Galeria — Com ícone (default)',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 20, background: '#fff' }}>
      {[
        'Aprovado', 'Pago', 'Liquidado', 'Quitado', 'Recuperado', 'Ativo',
        'Pendente', 'Em aberto', 'A recuperar', 'Suspenso', 'Antecipado', 'Previsto',
        'Recusado', 'Chargeback', 'Erro',
        'Cancelado', 'Inativo',
        'Em análise', 'Info',
      ].map((s) => <Tag key={s} status={s} />)}
    </div>
  ),
}

// ── Galeria — Sem ícone ────────────────────────────────────────────────────

export const GaleriaSemIcone: Story = {
  name: 'Galeria — Sem ícone',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 20, background: '#fff' }}>
      {[
        'Aprovado', 'Pago', 'Liquidado', 'Quitado', 'Recuperado', 'Ativo',
        'Pendente', 'Em aberto', 'A recuperar', 'Suspenso', 'Antecipado', 'Previsto',
        'Recusado', 'Chargeback', 'Erro',
        'Cancelado', 'Inativo',
        'Em análise', 'Info',
      ].map((s) => <Tag key={s} status={s} showIcon={false} />)}
    </div>
  ),
}

// ── Comparação lado a lado ─────────────────────────────────────────────────

export const ComparacaoVariants: Story = {
  name: 'Comparação — Com vs. Sem ícone',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 180px', gap: 12, padding: 20, background: '#fff', fontFamily: 'Roboto, sans-serif', fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
      <div style={{ fontWeight: 600, color: 'rgba(0,0,0,0.65)', paddingBottom: 4, borderBottom: '1px solid #f0f0f0' }}>Com ícone (default)</div>
      <div style={{ fontWeight: 600, color: 'rgba(0,0,0,0.65)', paddingBottom: 4, borderBottom: '1px solid #f0f0f0' }}>Sem ícone</div>
      {['Ativo', 'Pendente', 'Suspenso', 'Recusado', 'Cancelado', 'Em análise', 'Antecipado', 'Chargeback'].map((s) => (
        <>
          <div key={`icon-${s}`}><Tag status={s} /></div>
          <div key={`noicon-${s}`}><Tag status={s} showIcon={false} /></div>
        </>
      ))}
    </div>
  ),
}

// ── Uso real — tabela de cobranças ─────────────────────────────────────────

export const UsoRealTabela: Story = {
  name: 'Uso real — linha de tabela',
  render: () => (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'Roboto, sans-serif', fontSize: 14, width: '100%' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
          {['ID', 'Merchant', 'Valor', 'Status'].map((h) => (
            <th key={h} style={{ padding: '8px 16px', textAlign: 'left', color: 'rgba(0,0,0,0.45)', fontWeight: 500, fontSize: 12 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          { id: '#001', merchant: 'Americanas S.A.', value: 'R$ 1.200,00', status: 'Pago' },
          { id: '#002', merchant: 'Magazine Luiza',  value: 'R$ 340,00',   status: 'Pendente' },
          { id: '#003', merchant: 'Shopee Brasil',   value: 'R$ 890,00',   status: 'Chargeback' },
          { id: '#004', merchant: 'Netshoes',        value: 'R$ 56,00',    status: 'Cancelado' },
          { id: '#005', merchant: 'iFood Ltda',      value: 'R$ 2.100,00', status: 'Antecipado' },
          { id: '#006', merchant: 'Amazon Brasil',   value: 'R$ 980,00',   status: 'Em análise' },
          { id: '#007', merchant: 'Mercado Livre',   value: 'R$ 54,90',    status: 'Suspenso' },
        ].map((row) => (
          <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '12px 16px', color: 'rgba(0,0,0,0.65)' }}>{row.id}</td>
            <td style={{ padding: '12px 16px', color: 'rgba(0,0,0,0.85)' }}>{row.merchant}</td>
            <td style={{ padding: '12px 16px', color: 'rgba(0,0,0,0.85)' }}>{row.value}</td>
            <td style={{ padding: '12px 16px' }}><Tag status={row.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

// ── Label customizado ──────────────────────────────────────────────────────

export const LabelCustomizado: Story = {
  name: 'Label customizado (Pago → Liquidado)',
  args: { status: 'Pago', label: 'Liquidado' },
}

export const LabelCustomizadoSemIcone: Story = {
  name: 'Label customizado sem ícone',
  args: { status: 'Em análise', label: 'Em revisão', showIcon: false },
}
