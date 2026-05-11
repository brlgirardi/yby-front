import type { Meta, StoryObj } from '@storybook/react'

const CARD_BORDER = '1px solid rgba(0,0,0,0.06)'
const HEADER_DIVIDER = '1px solid #f0f0f0'

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: CARD_BORDER,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
}

const headerStyle: React.CSSProperties = {
  padding: '16px 21px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: HEADER_DIVIDER,
}

const bodyStyle: React.CSSProperties = {
  padding: '16px 21px',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

const sidePanelHeaderStyle: React.CSSProperties = {
  padding: '16px 18px',
  borderBottom: HEADER_DIVIDER,
}

const sidePanelBodyStyle: React.CSSProperties = {
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: 'rgba(0,0,0,0.85)',
}

const subtitleStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(0,0,0,0.45)',
}

const meta = {
  title: 'Design System/Patterns/WhiteCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: '#F2F4F8', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function HeaderContent({
  title,
  subtitle,
  actionLabel,
}: {
  title: string
  subtitle?: string
  actionLabel: string
}) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: subtitle ? 2 : 0 }}>
        <div style={titleStyle}>{title}</div>
        {subtitle ? <div style={subtitleStyle}>{subtitle}</div> : null}
      </div>

      <div
        style={{
          display: 'flex',
          background: '#f5f5f5',
          borderRadius: 4,
          padding: 2,
          gap: 1,
        }}
      >
        <button
          type="button"
          style={{
            border: 'none',
            borderRadius: 3,
            padding: '6px 14px',
            fontSize: 12,
            cursor: 'pointer',
            background: '#fff',
            color: '#1890FF',
            fontWeight: 600,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            whiteSpace: 'nowrap',
          }}
        >
          {actionLabel}
        </button>
        <button
          type="button"
          style={{
            border: 'none',
            borderRadius: 3,
            padding: '6px 14px',
            fontSize: 12,
            cursor: 'pointer',
            background: 'transparent',
            color: 'rgba(0,0,0,0.55)',
            fontWeight: 400,
            whiteSpace: 'nowrap',
          }}
        >
          Secundário
        </button>
      </div>
    </>
  )
}

function PlaceholderBlock({
  title,
  description,
  tone = '#1890FF',
}: {
  title: string
  description: string
  tone?: string
}) {
  return (
    <div
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 2,
        padding: '12px 14px',
        background: '#fff',
      }}
    >
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: tone, marginBottom: 6 }}>{description}</div>
      <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', lineHeight: '16px' }}>
        Estrutura ilustrativa para documentar o padrão visual do card branco da Agenda de Recebíveis.
      </div>
    </div>
  )
}

export const Base: Story = {
  render: () => (
    <div style={{ maxWidth: 920 }}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <HeaderContent
            title="Agenda de recebíveis"
            subtitle="Resumo consolidado do período"
            actionLabel="Valores brutos"
          />
        </div>

        <div style={bodyStyle}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div
              style={{
                flex: 1,
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: 2,
                padding: '10px 12px',
              }}
            >
              <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Crédito líquido</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#52c41a' }}>+R$ 91,4 mil</div>
            </div>

            <div
              style={{
                flex: 1,
                background: '#fffbe6',
                border: '1px solid #ffe58f',
                borderRadius: 2,
                padding: '10px 12px',
              }}
            >
              <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Compromisso futuro</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fa8c16' }}>R$ 60,0 mil</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <PlaceholderBlock title="Bloco interno" description="Padding 16px 21px no body" />
            <PlaceholderBlock title="Borda externa" description="1px solid rgba(0,0,0,0.06)" tone="rgba(0,0,0,0.85)" />
          </div>

          <div
            style={{
              borderTop: HEADER_DIVIDER,
              paddingTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 2 }}>Leitura operacional</div>
              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)' }}>
                Header e body usam o mesmo eixo horizontal, com separação feita apenas pelo divider do header.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Header</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1890FF' }}>16px 21px</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Body</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#52c41a' }}>16px 21px</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const ComDividerNoHeader: Story = {
  render: () => (
    <div style={{ maxWidth: 920 }}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <HeaderContent
            title="Padrão com divider no header"
            subtitle="O separador pertence ao header, não ao body"
            actionLabel="Padrão ativo"
          />
        </div>

        <div style={bodyStyle}>
          <div
            style={{
              padding: '12px 14px',
              background: '#fafafa',
              borderRadius: 2,
            }}
          >
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', marginBottom: 6 }}>Regra estrutural</div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', lineHeight: '18px' }}>
              O body não recebe border top nem bottom próprio para separar do header. A divisão visual vem
              exclusivamente de <code style={{ fontSize: 11 }}>borderBottom: 1px solid #f0f0f0</code> aplicado
              no header, como no painel esquerdo da agenda.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <PlaceholderBlock title="Container" description="background #fff" tone="rgba(0,0,0,0.85)" />
            <PlaceholderBlock title="Header" description="borderBottom #f0f0f0" tone="#1890FF" />
            <PlaceholderBlock title="Body" description="Sem divider próprio" tone="#fa8c16" />
          </div>
        </div>
      </div>
    </div>
  ),
}

export const PainelLateral: Story = {
  render: () => (
    <div style={{ width: 280, flexShrink: 0 }}>
      <div style={cardStyle}>
        <div style={sidePanelHeaderStyle}>
          <div style={{ ...titleStyle, marginBottom: 2 }}>22 de Abril</div>
          <div style={subtitleStyle}>Resumo consolidado do dia</div>
        </div>

        <div style={sidePanelBodyStyle}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                flex: 1,
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: 2,
                padding: '10px 12px',
              }}
            >
              <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Crédito líquido do dia</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#52c41a' }}>+R$ 91,4 mil</div>
            </div>

            <div
              style={{
                flex: 1,
                background: '#fffbe6',
                border: '1px solid #ffe58f',
                borderRadius: 2,
                padding: '10px 12px',
              }}
            >
              <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Compromisso futuro</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fa8c16' }}>R$ 60,0 mil</div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.65)', marginBottom: -4 }}>
            Entradas previstas
          </div>

          {[
            { label: 'Parcelas a creditar', value: '+R$ 191.400,00', color: '#52c41a' },
            { label: 'Recebíveis livres do dia', value: '+R$ 91.400,00', color: '#52c41a' },
            { label: 'Valor já antecipado', value: '-R$ 60.000,00', color: '#fa8c16' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
                padding: '6px 0',
                borderBottom: HEADER_DIVIDER,
                fontSize: 12,
              }}
            >
              <span style={{ color: 'rgba(0,0,0,0.65)' }}>{item.label}</span>
              <span style={{ color: item.color, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.value}</span>
            </div>
          ))}

          <div
            style={{
              marginTop: 4,
              padding: '10px 12px',
              background: '#f5f5f5',
              borderRadius: 2,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.65)', marginBottom: 4 }}>
              Leitura operacional
            </div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', lineHeight: '16px' }}>
              Variante lateral usa <code style={{ fontSize: 11 }}>width: 280</code>, <code style={{ fontSize: 11 }}>flexShrink: 0</code> e
              padding horizontal reduzido para 18px.
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}