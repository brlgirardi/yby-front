import type { Meta, StoryObj } from '@storybook/react'
import Sparkline from './Sparkline'

const meta: Meta<typeof Sparkline> = {
  title: 'Shared/Sparkline',
  component: Sparkline,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Mini-gráfico de tendência inline para KPIs. Sem eixos, labels ou tooltips — pura indicação visual de movimento.',
          '',
          '**Quando usar:** sempre que um KPI numérico tiver série temporal disponível (últimos 7-30 pontos). O sparkline elimina a pergunta "tá subindo ou caindo?" sem o usuário precisar abrir um gráfico.',
          '',
          '**Quando NÃO usar:** valores sem variação significativa, séries com <2 pontos (renderiza null), ou onde o leitor precisa de eixos/escala absoluta.',
          '',
          '**Cor:** o default `#1890FF` é neutro. Para deltas, passar `color` semântico — verde (`#52C41A`) para tendência boa, vermelho (`#FF4D4F`) para ruim. Cor segue a interpretação do KPI, não a direção da linha.',
          '',
          '**Heurística:** redução de carga cognitiva — o usuário lê o número e o trend em um único movimento ocular (Pixel/Nielsen #6).',
        ].join('\n'),
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof Sparkline>

const trendUp = [12, 15, 14, 18, 22, 25, 28, 32]
const trendDown = [40, 38, 35, 36, 30, 28, 22, 18]
const flat = [20, 22, 19, 21, 20, 22, 20, 21]

export const Default: Story = {
  name: 'Default (azul, preenchido)',
  args: { data: trendUp },
}

export const TendenciaPositiva: Story = {
  name: 'Tendência positiva (verde)',
  args: { data: trendUp, color: '#52C41A' },
}

export const TendenciaNegativa: Story = {
  name: 'Tendência negativa (vermelho)',
  args: { data: trendDown, color: '#FF4D4F' },
}

export const SemPreenchimento: Story = {
  name: 'Linha pura (sem fill)',
  args: { data: trendUp, filled: false },
}

export const Compacto: Story = {
  name: 'Compacto (60×16) — para tabelas',
  args: { data: trendUp, width: 60, height: 16 },
}

export const PadraoNoYby: Story = {
  name: 'Padrão de uso no Yby — KPI hero com trend',
  render: () => (
    <div style={{ display: 'flex', gap: 16, fontFamily: 'Roboto, sans-serif' }}>
      <div style={{ background: '#F6FFED', border: '1px solid #B7EB8F', borderRadius: 2, padding: '14px 18px', minWidth: 200 }}>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', fontWeight: 500, marginBottom: 6 }}>Volume liquidado</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#237804', lineHeight: '32px' }}>R$ 1.287.420</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#52C41A', fontWeight: 500 }}>+12,4% vs mês ant.</span>
          <Sparkline data={trendUp} color="#52C41A" width={70} height={20} />
        </div>
      </div>

      <div style={{ background: '#FFF1F0', border: '1px solid #FFCCC7', borderRadius: 2, padding: '14px 18px', minWidth: 200 }}>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', fontWeight: 500, marginBottom: 6 }}>Chargebacks</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#820014', lineHeight: '32px' }}>R$ 8.230</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#FF4D4F', fontWeight: 500 }}>+38% vs mês ant.</span>
          <Sparkline data={trendUp} color="#FF4D4F" width={70} height={20} />
        </div>
      </div>

      <div style={{ background: '#F5F5F5', border: '1px solid #D9D9D9', borderRadius: 2, padding: '14px 18px', minWidth: 200 }}>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', fontWeight: 500, marginBottom: 6 }}>Ticket médio</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'rgba(0,0,0,0.85)', lineHeight: '32px' }}>R$ 142,30</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>estável</span>
          <Sparkline data={flat} color="#8C8C8C" width={70} height={20} />
        </div>
      </div>
    </div>
  ),
}
