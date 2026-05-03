import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import ShiftInput from './ShiftInput'

const meta: Meta<typeof ShiftInput> = {
  title: 'Shared/ShiftInput',
  component: ShiftInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input numérico Tupi: digite só dígitos e a vírgula desloca sozinha (1 → 0,01 → 0,10 → 1,00). Backspace anda na direção contrária. Usado em tabelas de Custos e Preços.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ShiftInput>

const Wrapper = ({ initial = 0, suffix }: { initial?: number; suffix?: string }) => {
  const [v, setV] = useState(initial)
  return (
    <div style={{ width: 220, padding: 16, background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ShiftInput value={v} onChange={setV} suffix={suffix} />
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Valor numérico: {v}</div>
    </div>
  )
}

export const Default: Story = { render: () => <Wrapper /> }
export const ComSufixo: Story = { name: 'Com sufixo "%"', render: () => <Wrapper suffix="%" /> }
export const Inicial: Story = { name: 'Pre-preenchido (1,45)', render: () => <Wrapper initial={1.45} /> }
export const Disabled: Story = {
  args: { value: 1.45, onChange: () => undefined, disabled: true },
}
