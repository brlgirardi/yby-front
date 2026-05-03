import type { Meta, StoryObj } from '@storybook/react'
import BrandLogo, { BRAND_CATEGORIES } from './BrandLogo'

const meta: Meta<typeof BrandLogo> = {
  title: 'Shared/BrandLogo',
  component: BrandLogo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Biblioteca de logos do produto. Renderiza inline em SVG. Categorias: bandeiras (cards), adquirentes, registradoras e marca do produto (Tupi/Yby).',
      },
    },
  },
  argTypes: {
    brand: { control: 'select', options: Object.values(BRAND_CATEGORIES).flat() },
    size: { control: { type: 'range', min: 14, max: 60, step: 2 } },
    showLabel: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof BrandLogo>

export const Padrao: Story = {
  args: { brand: 'Visa', size: 24, showLabel: true },
}

const Section = ({ title, brands, size = 24, showLabel = true }: { title: string; brands: string[]; size?: number; showLabel?: boolean }) => (
  <div style={{ marginBottom: 32 }}>
    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 12, fontFamily: 'Roboto, sans-serif' }}>{title}</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {brands.map(b => (
        <div key={b} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80 }}>
          <BrandLogo brand={b} size={size} />
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)', fontFamily: 'Roboto, sans-serif' }}>{b}</span>
        </div>
      ))}
    </div>
  </div>
)

export const Catalogo: Story = {
  render: () => (
    <div style={{ background: '#fff', padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <Section title="Bandeiras" brands={BRAND_CATEGORIES.bandeiras} size={28} />
      <Section title="Adquirentes" brands={BRAND_CATEGORIES.adquirentes} size={28} />
      <Section title="Registradoras" brands={BRAND_CATEGORIES.registradoras} size={28} />
      <Section title="Produto" brands={BRAND_CATEGORIES.produto} size={28} />
    </div>
  ),
}

export const ComLabel: Story = {
  render: () => (
    <div style={{ background: '#fff', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Object.values(BRAND_CATEGORIES).flat().map(b => (
        <BrandLogo key={b} brand={b} size={20} showLabel />
      ))}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: () => (
    <div style={{ background: '#fff', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[16, 20, 24, 32, 40, 48].map(size => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', minWidth: 32 }}>{size}px</span>
          <BrandLogo brand="Visa" size={size} />
          <BrandLogo brand="Mastercard" size={size} />
          <BrandLogo brand="Adiq" size={size} />
          <BrandLogo brand="Cielo" size={size} />
          <BrandLogo brand="Núclea" size={size} />
        </div>
      ))}
    </div>
  ),
}
