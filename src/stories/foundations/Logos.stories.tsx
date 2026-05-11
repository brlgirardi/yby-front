import type { Meta, StoryObj } from '@storybook/react'
import BrandLogo, { BRAND_CATEGORIES } from '@/components/atoms/BrandLogo'

/**
 * Foundations / Logos
 *
 * Grid interativo de logos do produto. Centraliza bandeiras, adquirentes,
 * registradoras e marca Tupi em um único catálogo navegável.
 *
 * Classificação Atomic Design (Brad Frost, 2016, atomicdesign.bradfrost.com):
 * `BrandLogo` é um **átomo** — elemento de UI indivisível, sem composição interna
 * de outros componentes do projeto. Ver `src/stories/foundations/AtomicDesign.mdx`
 * para o restante da classificação e os critérios de inclusão por camada.
 *
 * Reutiliza o átomo `BrandLogo` existente (`src/components/shared/BrandLogo.tsx`)
 * — nenhum componente novo é criado nesta fase. Cada célula carrega `aria-label`
 * para leitores de tela e usa container quadrado com `padding` interno suficiente
 * para garantir tap target ≥ 44×44px mesmo quando o logo é renderizado em 16px.
 *
 * Brain Harrison: `harrison-brain/agents/pixel/taste-profile.md` reforça a regra
 * de tap target mínimo e contraste de borda em ações clicáveis.
 */

const meta: Meta<typeof BrandLogo> = {
  title: 'Foundations/Logos',
  component: BrandLogo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Catálogo visual de todas as logos do produto. Use o canvas para escolher uma marca e tamanho, ou navegue pelas stories para ver categorias completas e comparações de tamanho lado a lado.',
      },
    },
  },
  argTypes: {
    brand: {
      control: 'select',
      options: Object.values(BRAND_CATEGORIES).flat(),
      description: 'Nome da marca a renderizar. Resolução é case-insensitive no componente.',
    },
    size: {
      control: { type: 'range', min: 14, max: 64, step: 2 },
      description: 'Altura em pixels. Largura é calculada como 1.5× para preservar o viewBox 36×24.',
    },
    showLabel: {
      control: 'boolean',
      description: 'Se true, renderiza o nome da marca ao lado do logo.',
    },
  },
}

export default meta

type Story = StoryObj<typeof BrandLogo>

const LOGO_SIZES = [16, 20, 24, 32, 48] as const

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: 'rgba(0,0,0,0.85)',
  margin: '0 0 12px',
  fontFamily: 'Roboto, sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const SECTION_SUBTITLE_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(0,0,0,0.45)',
  margin: '0 0 16px',
  fontFamily: 'Roboto, sans-serif',
}

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  border: '1px solid #D9D9D9',
  borderRadius: 4,
  padding: 16,
  minHeight: 96,
  minWidth: 96,
  background: '#fff',
  fontFamily: 'Roboto, sans-serif',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(0,0,0,0.55)',
  textAlign: 'center',
  lineHeight: 1.2,
}

function LogoCard({ brand, size = 28 }: { brand: string; size?: number }) {
  return (
    <div style={CARD_STYLE} aria-label={`Logo ${brand}`} role="figure" title={brand}>
      <BrandLogo brand={brand} size={size} />
      <span style={LABEL_STYLE}>{brand}</span>
    </div>
  )
}

function CategoryGrid({
  title,
  description,
  brands,
  size = 28,
}: {
  title: string
  description: string
  brands: readonly string[]
  size?: number
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={SECTION_TITLE_STYLE}>{title}</h2>
      <p style={SECTION_SUBTITLE_STYLE}>{description}</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))',
          gap: 12,
        }}
      >
        {brands.map((b) => (
          <LogoCard key={b} brand={b} size={size} />
        ))}
      </div>
    </section>
  )
}

// ── Stories ───────────────────────────────────────────────────────────────

export const Padrao: Story = {
  args: { brand: 'Visa', size: 28, showLabel: true },
}

export const Catalogo: Story = {
  name: 'Catálogo completo',
  parameters: {
    docs: {
      description: {
        story:
          'Visão geral de todas as categorias de logos disponíveis hoje. Sub-adquirentes ainda não têm logos próprios — quando entrarem, devem ser adicionados a `BRAND_CATEGORIES` em `src/components/shared/BrandLogo.tsx`.',
      },
    },
  },
  render: () => (
    <div style={{ background: '#F2F4F8', padding: 24, minHeight: '100%', fontFamily: 'Roboto, sans-serif' }}>
      <CategoryGrid
        title="Bandeiras"
        description="Bandeiras de cartão suportadas hoje. Visa, Mastercard, Elo, Hipercard, Amex."
        brands={BRAND_CATEGORIES.bandeiras}
      />
      <CategoryGrid
        title="Adquirentes"
        description="Adquirentes que operam liquidação direta com a sub-adquirente."
        brands={BRAND_CATEGORIES.adquirentes}
      />
      <CategoryGrid
        title="Registradoras"
        description="Entidades que registram URs e gravames sob a Resolução BCB 150/2021."
        brands={BRAND_CATEGORIES.registradoras}
      />
      <CategoryGrid
        title="Produto"
        description="Marcas próprias da plataforma Tupi/Yby e parceiros white-label."
        brands={BRAND_CATEGORIES.produto}
      />
    </div>
  ),
}

export const Bandeiras: Story = {
  name: 'Bandeiras (cards)',
  render: () => (
    <div style={{ background: '#F2F4F8', padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <CategoryGrid
        title="Bandeiras"
        description="Logos das bandeiras com cores oficiais. Use em tabelas de transações, breakdowns por bandeira e cards de pricing."
        brands={BRAND_CATEGORIES.bandeiras}
        size={32}
      />
    </div>
  ),
}

export const Adquirentes: Story = {
  render: () => (
    <div style={{ background: '#F2F4F8', padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <CategoryGrid
        title="Adquirentes"
        description="Logos das adquirentes em parceria. Use em settlements, agenda de funding e cards de comparação de preço/custo."
        brands={BRAND_CATEGORIES.adquirentes}
        size={32}
      />
    </div>
  ),
}

export const Registradoras: Story = {
  render: () => (
    <div style={{ background: '#F2F4F8', padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <CategoryGrid
        title="Registradoras"
        description="Núclea, CIP, CERC e TAG. Use em telas de gravames e oneração."
        brands={BRAND_CATEGORIES.registradoras}
        size={32}
      />
    </div>
  ),
}

export const Comparativo: Story = {
  name: 'Tamanhos lado a lado',
  parameters: {
    docs: {
      description: {
        story:
          'Mesma marca em 5 tamanhos comuns (16, 20, 24, 32, 48px). Use 16 em chips compactos, 20-24 em linhas de tabela, 32 em cards, 48 em cabeçalhos de detalhe.',
      },
    },
  },
  render: () => {
    const samples = ['Visa', 'Mastercard', 'Elo', 'Hipercard', 'Amex', 'Adiq', 'Rede', 'Cielo', 'Getnet', 'Stone', 'PagSeguro', 'Núclea', 'CIP', 'CERC', 'TAG', 'Tupi', 'Yby', 'Vero']
    return (
      <div style={{ background: '#F2F4F8', padding: 24, fontFamily: 'Roboto, sans-serif' }}>
        <h2 style={SECTION_TITLE_STYLE}>Tamanhos por marca</h2>
        <p style={SECTION_SUBTITLE_STYLE}>
          Cada linha mostra a mesma marca renderizada em 16, 20, 24, 32 e 48px. Verifique legibilidade nos
          tamanhos pequenos antes de adotar em uma nova tela.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(5, 1fr)', gap: 16, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Marca</span>
            {LOGO_SIZES.map((s) => (
              <span key={s} style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{s}px</span>
            ))}
          </div>
          {samples.map((brand) => (
            <div
              key={brand}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px repeat(5, 1fr)',
                gap: 16,
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
              role="row"
              aria-label={`Tamanhos da marca ${brand}`}
            >
              <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{brand}</span>
              {LOGO_SIZES.map((size) => (
                <div
                  key={size}
                  style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44 }}
                  aria-label={`${brand} ${size} pixels`}
                  title={`${brand} ${size}px`}
                >
                  <BrandLogo brand={brand} size={size} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const ComLabel: Story = {
  name: 'Com label inline',
  parameters: {
    docs: {
      description: {
        story:
          'Use `showLabel` quando o logo precisa ser identificado fora do contexto de uma tabela ou card. Comum em legendas, breadcrumbs e seletores.',
      },
    },
  },
  render: () => (
    <div style={{ background: '#fff', padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, fontFamily: 'Roboto, sans-serif' }}>
      {Object.values(BRAND_CATEGORIES).flat().map((b) => (
        <BrandLogo key={b} brand={b} size={20} showLabel />
      ))}
    </div>
  ),
}