'use client'
// Drawer "Simulação de Transação" — usado pelas telas EC Antecipações e
// Taxas e Simulações. Espelha o Figma "Transaction simulation" (500x900).
//
// Componentes: antd Drawer + Form + Select + Input + Button do design system.

import { useState } from 'react'
import { Drawer, Form, InputNumber } from 'antd'
import Button from '@/components/shared/Button'
import AppSelect from '@/components/ui/AppSelect'

interface SimulacaoDrawerProps {
  open: boolean
  onClose: () => void
}

export default function SimulacaoDrawer({ open, onClose }: SimulacaoDrawerProps) {
  const [form] = Form.useForm()
  const [simulating, setSimulating] = useState(false)

  const handleSimulate = async () => {
    try {
      await form.validateFields()
      setSimulating(true)
      // mock delay
      setTimeout(() => setSimulating(false), 600)
    } catch {
      /* validation error */
    }
  }

  return (
    <Drawer
      title="Simulação de Transação"
      placement="right"
      width={500}
      open={open}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <Button variant="ghost" onClick={onClose}>Sair</Button>
          <Button variant="primary" loading={simulating} onClick={handleSimulate}>Simular</Button>
        </div>
      }
    >
      <div style={{ background: '#FAFAFA', padding: '12px 14px', borderRadius: 2, fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
        Detalhes da simulação
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label="Valor da venda"
          name="valor"
          rules={[{ required: true, message: 'Informe o valor da venda' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="R$"
            prefix="R$"
            min={0}
            decimalSeparator=","
          />
        </Form.Item>

        <Form.Item label="Método" name="metodo" rules={[{ required: true, message: 'Selecione o método' }]}>
          <AppSelect
            placeholder="Selecione o método"
            options={[
              { value: 'pix',           label: 'PIX' },
              { value: 'debito',        label: 'Débito' },
              { value: 'credito-1x',    label: 'Crédito 1x' },
              { value: 'credito-2x',    label: 'Crédito 2x' },
              { value: 'credito-3x',    label: 'Crédito 3x' },
              { value: 'credito-4x',    label: 'Crédito 4x' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Bandeira" name="bandeira" rules={[{ required: true, message: 'Selecione a bandeira' }]}>
          <AppSelect
            placeholder="Selecione a bandeira"
            options={[
              { value: 'Visa',       label: 'Visa' },
              { value: 'Mastercard', label: 'Mastercard' },
              { value: 'Elo',        label: 'Elo' },
              { value: 'Amex',       label: 'Amex' },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
