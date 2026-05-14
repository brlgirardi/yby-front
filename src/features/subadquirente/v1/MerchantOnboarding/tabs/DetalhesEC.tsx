'use client'
// src/features/subadquirente/v1/MerchantOnboarding/tabs/DetalhesEC.tsx
// Tab "Detalhes do EC" — 2 cards brancos no padrão DS Yby:
//  1. Dados do estabelecimento (CNPJ + Razão Social + MCC)
//  2. Endereço do estabelecimento (CEP + Estado + Cidade + Endereço + Número + Complemento)
//
// Ações (Cancelar/Salvar) ficam no header global — não há footer por card.

import { useEffect, useState } from 'react'
import AccordionCard from '@/components/shared/AccordionCard'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import {
  CIDADES_POR_UF,
  ESTADOS,
  MCCS,
  lookupCep,
} from '@/mocks/sub/merchant-onboarding'
import { type MerchantFormData } from '../types'

interface DetalhesECProps {
  form: MerchantFormData
  onChange: (next: MerchantFormData) => void
}

function maskCnpj(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function maskCep(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 8)
  return d.replace(/^(\d{5})(\d)/, '$1-$2')
}

const FIELD_GRID: React.CSSProperties = {
  display: 'grid',
  gap: 16,
}

const CARD_TITLE: React.CSSProperties = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: 16,
  fontWeight: 500,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
}

export default function DetalhesEC({ form, onChange }: DetalhesECProps) {
  const [cepLoading, setCepLoading] = useState(false)
  const [cepNotFound, setCepNotFound] = useState(false)

  function set<K extends keyof MerchantFormData>(field: K, value: MerchantFormData[K]) {
    onChange({ ...form, [field]: value })
  }

  // Busca CEP quando 8 dígitos são preenchidos.
  useEffect(() => {
    const digits = form.cep.replace(/\D/g, '')
    if (digits.length !== 8) {
      setCepNotFound(false)
      return
    }
    let cancelled = false
    setCepLoading(true)
    setCepNotFound(false)
    lookupCep(digits).then((res) => {
      if (cancelled) return
      setCepLoading(false)
      if (!res) {
        setCepNotFound(true)
        return
      }
      onChange({
        ...form,
        estado: res.estado,
        cidade: res.cidade,
        endereco: form.endereco || res.endereco,
      })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.cep])

  const cidadesUf = form.estado ? CIDADES_POR_UF[form.estado] ?? [] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AccordionCard
        header={<span style={CARD_TITLE}>Dados do estabelecimento</span>}
        defaultOpen
      >
        <div style={FIELD_GRID}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              label={form.semCnpj ? 'CNPJ da empresa (não aplicável)' : 'CNPJ da empresa*'}
              placeholder="00.000.000/0000-00"
              value={form.cnpj}
              onChange={(e) => set('cnpj', maskCnpj(e.target.value))}
              disabled={form.semCnpj}
              aria-required={!form.semCnpj}
            />
            <Input
              label="Razão social*"
              placeholder="Ex: Padaria do João LTDA"
              value={form.razaoSocial}
              onChange={(e) => set('razaoSocial', e.target.value.slice(0, 100))}
              maxLength={100}
              aria-required
            />
          </div>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'Roboto, sans-serif',
              fontSize: 14,
              color: 'rgba(0,0,0,0.85)',
              cursor: 'pointer',
              userSelect: 'none',
              padding: '8px 0',
              minHeight: 44,
            }}
          >
            <input
              type="checkbox"
              checked={form.semCnpj}
              onChange={(e) => {
                const semCnpj = e.target.checked
                onChange({ ...form, semCnpj, cnpj: semCnpj ? '' : form.cnpj })
              }}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            Não possuo CNPJ
          </label>

          <AppSelect
            label="Código da Atividade Econômica (MCC)*"
            placeholder="Selecione o MCC"
            value={form.mcc || undefined}
            options={MCCS}
            onChange={(v) => set('mcc', String(v ?? ''))}
            showSearch
            optionFilterProp="label"
          />
        </div>
      </AccordionCard>

      <AccordionCard
        header={<span style={CARD_TITLE}>Endereço do estabelecimento</span>}
        defaultOpen
      >
        <div style={FIELD_GRID}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 16 }}>
            <Input
              label="CEP*"
              placeholder="00000-000"
              value={form.cep}
              onChange={(e) => set('cep', maskCep(e.target.value))}
              error={cepNotFound ? 'CEP não encontrado — preencha manualmente' : undefined}
              hint={cepLoading ? 'Buscando endereço…' : undefined}
              suffix={cepLoading ? 'search' : undefined}
              aria-required
            />
            <AppSelect
              label="Estado*"
              placeholder="UF"
              value={form.estado || undefined}
              options={ESTADOS}
              onChange={(v) => onChange({ ...form, estado: String(v ?? ''), cidade: '' })}
              showSearch
              optionFilterProp="label"
            />
            <AppSelect
              label="Cidade*"
              placeholder={form.estado ? 'Selecione a cidade' : 'Escolha o estado primeiro'}
              value={form.cidade || undefined}
              options={cidadesUf}
              onChange={(v) => set('cidade', String(v ?? ''))}
              showSearch
              optionFilterProp="label"
              disabled={!form.estado || cidadesUf.length === 0}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 2fr', gap: 16 }}>
            <Input
              label="Endereço*"
              placeholder="Rua, avenida..."
              value={form.endereco}
              onChange={(e) => set('endereco', e.target.value.slice(0, 120))}
              aria-required
            />
            <Input
              label="Número*"
              placeholder="123"
              value={form.numero}
              onChange={(e) => set('numero', e.target.value.slice(0, 10))}
              aria-required
            />
            <Input
              label="Complemento"
              placeholder="Ex: Apto 101"
              value={form.complemento}
              onChange={(e) => set('complemento', e.target.value.slice(0, 60))}
            />
          </div>
        </div>
      </AccordionCard>
    </div>
  )
}