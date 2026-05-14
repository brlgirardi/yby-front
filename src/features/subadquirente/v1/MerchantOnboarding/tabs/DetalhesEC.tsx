'use client'
// src/features/subadquirente/v1/MerchantOnboarding/tabs/DetalhesEC.tsx
// Tab "Detalhes do EC" — 1 white card único com 2 seções (Dados + Endereço) e footer global.
// Layout fiel ao Figma node 185929-90302.

import { useEffect, useState } from 'react'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import {
  CIDADES_POR_UF,
  ESTADOS,
  lookupCep,
  type Option,
} from '@/mocks/sub/merchant-onboarding'
import { getMerchantCategories } from '@/services/referenceService'
import { type MerchantFormData } from '../types'

interface DetalhesECProps {
  form: MerchantFormData
  onChange: (next: MerchantFormData) => void
  /** Quando true, todos os campos ficam disabled (modo view). Default false. */
  readonly?: boolean
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

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 2,
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

const SECTION_TITLE: React.CSSProperties = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: 20,
  fontWeight: 500,
  color: '#21272A',
  lineHeight: '28px',
  margin: 0,
}

const DIVIDER: React.CSSProperties = {
  border: 0,
  borderTop: '1px solid #f0f0f0',
  margin: 0,
}

const SECTION: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

export default function DetalhesEC({ form, onChange, readonly = false }: DetalhesECProps) {
  const [cepLoading, setCepLoading] = useState(false)
  const [cepNotFound, setCepNotFound] = useState(false)
  const [mccs, setMccs] = useState<Option[]>([])

  useEffect(() => {
    let cancelled = false
    getMerchantCategories().then((options) => {
      if (!cancelled) setMccs(options)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function set<K extends keyof MerchantFormData>(field: K, value: MerchantFormData[K]) {
    onChange({ ...form, [field]: value })
  }

  useEffect(() => {
    if (readonly) return
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
    <div style={CARD}>
      <section aria-labelledby="sec-dados" style={SECTION}>
        <h3 id="sec-dados" style={SECTION_TITLE}>Dados do estabelecimento</h3>
        <hr aria-hidden style={DIVIDER} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input
            label={form.semCnpj ? 'CNPJ da empresa (não aplicável)' : 'CNPJ da empresa*'}
            placeholder="00.000.000/0000-00"
            value={form.cnpj}
            onChange={(e) => set('cnpj', maskCnpj(e.target.value))}
            disabled={readonly || form.semCnpj}
            aria-required={!form.semCnpj}
          />
          <Input
            label="Razão social*"
            placeholder="Ex: Padaria do João LTDA"
            value={form.razaoSocial}
            onChange={(e) => set('razaoSocial', e.target.value.slice(0, 100))}
            maxLength={100}
            disabled={readonly}
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
            disabled={readonly}
            onChange={(e) => {
              const semCnpj = e.target.checked
              onChange({ ...form, semCnpj, cnpj: semCnpj ? '' : form.cnpj })
            }}
            style={{ width: 16, height: 16, cursor: readonly ? 'not-allowed' : 'pointer' }}
          />
          Não possuo CNPJ
        </label>

        <AppSelect
          label="Código da Atividade Econômica (MCC)*"
          placeholder="Selecione o MCC"
          value={form.mcc || undefined}
          options={mccs}
          onChange={(v) => set('mcc', String(v ?? ''))}
          showSearch
          optionFilterProp="label"
          disabled={readonly}
        />
      </section>

      <section aria-labelledby="sec-endereco" style={SECTION}>
        <h3 id="sec-endereco" style={SECTION_TITLE}>Endereço do estabelecimento</h3>
        <hr aria-hidden style={DIVIDER} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 16 }}>
          <Input
            label="CEP*"
            placeholder="00000-000"
            value={form.cep}
            onChange={(e) => set('cep', maskCep(e.target.value))}
            error={cepNotFound ? 'CEP não encontrado — preencha manualmente' : undefined}
            hint={cepLoading ? 'Buscando endereço…' : undefined}
            suffix={cepLoading ? 'search' : undefined}
            disabled={readonly}
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
            disabled={readonly}
          />
          <AppSelect
            label="Cidade*"
            placeholder={form.estado ? 'Selecione a cidade' : 'Escolha o estado primeiro'}
            value={form.cidade || undefined}
            options={cidadesUf}
            onChange={(v) => set('cidade', String(v ?? ''))}
            showSearch
            optionFilterProp="label"
            disabled={readonly || !form.estado || cidadesUf.length === 0}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 2fr', gap: 16 }}>
          <Input
            label="Endereço*"
            placeholder="Rua, avenida..."
            value={form.endereco}
            onChange={(e) => set('endereco', e.target.value.slice(0, 120))}
            disabled={readonly}
            aria-required
          />
          <Input
            label="Número*"
            placeholder="123"
            value={form.numero}
            onChange={(e) => set('numero', e.target.value.slice(0, 10))}
            disabled={readonly}
            aria-required
          />
          <Input
            label="Complemento"
            placeholder="Ex: Apto 101"
            value={form.complemento}
            onChange={(e) => set('complemento', e.target.value.slice(0, 60))}
            disabled={readonly}
          />
        </div>
      </section>
    </div>
  )
}
