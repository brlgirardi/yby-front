'use client'
// src/features/subadquirente/v1/MerchantOnboarding/steps/Step1Dados.tsx
// Step 1 do Onboarding EC: Dados básicos + Endereço + Recebimento.
// Mantém apenas validação visual (required) — não valida dígito verificador
// nesta fase. CEP usa mock com delay 800ms.

import { useEffect, useState } from 'react'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import {
  BANCOS,
  CIDADES_POR_UF,
  CNAES,
  ESTADOS,
  FATURAMENTOS,
  MCCS,
  lookupCep,
} from '@/mocks/sub/merchant-onboarding'
import type { MerchantFormData, TipoConta } from '../types'

interface Step1DadosProps {
  form: MerchantFormData
  onChange: (next: MerchantFormData) => void
  /** Quando true, mostra erros nos campos required vazios. */
  showErrors: boolean
}

function maskCnpj(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function maskCpf(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

function maskCep(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 8)
  return d.replace(/^(\d{5})(\d)/, '$1-$2')
}

function onlyDigits(v: string, max: number): string {
  return v.replace(/\D/g, '').slice(0, max)
}

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.45)',
  marginBottom: 12,
}

const FIELD_GRID: React.CSSProperties = {
  display: 'grid',
  gap: 16,
}

export default function Step1Dados({ form, onChange, showErrors }: Step1DadosProps) {
  const [cepLoading, setCepLoading] = useState(false)
  const [cepNotFound, setCepNotFound] = useState(false)
  const cidadesUf = form.estado ? CIDADES_POR_UF[form.estado] ?? [] : []

  function set<K extends keyof MerchantFormData>(field: K, value: MerchantFormData[K]) {
    onChange({ ...form, [field]: value })
  }

  // CEP — quando completa 8 dígitos, dispara busca mock.
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
        cep: form.cep,
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

  const reqError = (val: string) => (showErrors && val.trim().length === 0 ? 'Campo obrigatório' : undefined)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* SEÇÃO A — Dados básicos */}
      <section>
        <h3 style={SECTION_TITLE}>Dados básicos</h3>

        <div style={FIELD_GRID}>
          {!form.semCnpj && (
            <Input
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              value={form.cnpj}
              onChange={(e) => set('cnpj', maskCnpj(e.target.value))}
              error={!form.semCnpj ? reqError(form.cnpj) : undefined}
            />
          )}

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'rgba(0,0,0,0.85)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={form.semCnpj}
              onChange={(e) => {
                const semCnpj = e.target.checked
                onChange({
                  ...form,
                  semCnpj,
                  cnpj: semCnpj ? '' : form.cnpj,
                  cpf: semCnpj ? form.cpf : '',
                  rg: semCnpj ? form.rg : '',
                })
              }}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            Não possuo CNPJ (cadastrar como pessoa física)
          </label>

          {form.semCnpj && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) => set('cpf', maskCpf(e.target.value))}
                error={reqError(form.cpf)}
              />
              <Input
                label="RG"
                placeholder="00.000.000-0"
                value={form.rg}
                onChange={(e) => set('rg', e.target.value.slice(0, 15))}
                error={reqError(form.rg)}
              />
            </div>
          )}

          <Input
            label="Razão Social"
            placeholder="Ex: Padaria do João LTDA"
            value={form.razaoSocial}
            onChange={(e) => set('razaoSocial', e.target.value.slice(0, 100))}
            error={reqError(form.razaoSocial)}
            maxLength={100}
          />

          <Input
            label="Nome Fantasia (opcional)"
            placeholder="Ex: Padaria do João"
            value={form.nomeFantasia}
            onChange={(e) => set('nomeFantasia', e.target.value.slice(0, 80))}
            maxLength={80}
          />

          <AppSelect
            label="CNAE Principal"
            placeholder="Selecione o CNAE"
            value={form.cnae || undefined}
            options={CNAES}
            onChange={(v) => set('cnae', String(v ?? ''))}
            showSearch
            optionFilterProp="label"
            error={reqError(form.cnae)}
          />

          <AppSelect
            label="Código MCC"
            placeholder="Selecione o MCC"
            value={form.mcc || undefined}
            options={MCCS}
            onChange={(v) => set('mcc', String(v ?? ''))}
            showSearch
            optionFilterProp="label"
            error={reqError(form.mcc)}
          />

          <AppSelect
            label="Faturamento mensal estimado"
            placeholder="Selecione a faixa"
            value={form.faturamento || undefined}
            options={FATURAMENTOS}
            onChange={(v) => set('faturamento', String(v ?? ''))}
            error={reqError(form.faturamento)}
          />
        </div>
      </section>

      {/* SEÇÃO B — Endereço */}
      <section>
        <h3 style={SECTION_TITLE}>Endereço</h3>

        <div style={FIELD_GRID}>
          <Input
            label="CEP"
            placeholder="00.000-000"
            value={form.cep}
            onChange={(e) => set('cep', maskCep(e.target.value))}
            error={reqError(form.cep) || (cepNotFound ? 'CEP não encontrado' : undefined)}
            hint={cepLoading ? 'Buscando endereço…' : undefined}
            suffix={cepLoading ? 'search' : undefined}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <AppSelect
              label="Estado (UF)"
              placeholder="UF"
              value={form.estado || undefined}
              options={ESTADOS}
              onChange={(v) => {
                onChange({ ...form, estado: String(v ?? ''), cidade: '' })
              }}
              showSearch
              optionFilterProp="label"
              error={reqError(form.estado)}
            />
            <AppSelect
              label="Cidade"
              placeholder={form.estado ? 'Selecione a cidade' : 'Escolha o estado primeiro'}
              value={form.cidade || undefined}
              options={cidadesUf}
              onChange={(v) => set('cidade', String(v ?? ''))}
              showSearch
              optionFilterProp="label"
              disabled={!form.estado || cidadesUf.length === 0}
              error={reqError(form.cidade)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 12 }}>
            <Input
              label="Endereço"
              placeholder="Rua, avenida..."
              value={form.endereco}
              onChange={(e) => set('endereco', e.target.value.slice(0, 120))}
              error={reqError(form.endereco)}
            />
            <Input
              label="Número"
              placeholder="123"
              value={form.numero}
              onChange={(e) => set('numero', e.target.value.slice(0, 10))}
              error={reqError(form.numero)}
            />
          </div>

          <Input
            label="Complemento (opcional)"
            placeholder="Sala 4, bloco B..."
            value={form.complemento}
            onChange={(e) => set('complemento', e.target.value.slice(0, 60))}
          />
        </div>
      </section>

      {/* SEÇÃO C — Recebimento */}
      <section>
        <h3 style={SECTION_TITLE}>Dados de recebimento</h3>

        <div style={FIELD_GRID}>
          <AppSelect
            label="Banco"
            placeholder="Selecione o banco"
            value={form.banco || undefined}
            options={BANCOS.map((b) => ({ value: b.value, label: `${b.codigo} — ${b.label}` }))}
            onChange={(v) => set('banco', String(v ?? ''))}
            showSearch
            optionFilterProp="label"
            error={reqError(form.banco)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <Input
              label="Agência"
              placeholder="0000"
              value={form.agencia}
              onChange={(e) => set('agencia', onlyDigits(e.target.value, 5))}
              error={reqError(form.agencia)}
              inputMode="numeric"
            />
            <Input
              label="Conta (com dígito)"
              placeholder="00000000-0"
              value={form.conta}
              onChange={(e) => set('conta', e.target.value.replace(/[^\d-]/g, '').slice(0, 12))}
              error={reqError(form.conta)}
              inputMode="numeric"
            />
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend
              style={{
                fontSize: 14,
                color: 'rgba(0,0,0,0.85)',
                fontFamily: 'Roboto, sans-serif',
                marginBottom: 8,
              }}
            >
              Tipo de conta
            </legend>
            <div style={{ display: 'flex', gap: 16 }}>
              {(['corrente', 'poupanca'] as TipoConta[]).map((t) => (
                <label
                  key={t}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: 'rgba(0,0,0,0.85)',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    border: `1px solid ${form.tipoConta === t ? '#1890FF' : '#D9D9D9'}`,
                    borderRadius: 2,
                    background: form.tipoConta === t ? '#E6F7FF' : '#fff',
                    minWidth: 140,
                  }}
                >
                  <input
                    type="radio"
                    name="tipoConta"
                    value={t}
                    checked={form.tipoConta === t}
                    onChange={() => set('tipoConta', t)}
                    style={{ cursor: 'pointer' }}
                  />
                  {t === 'corrente' ? 'Corrente' : 'Poupança'}
                </label>
              ))}
            </div>
            {showErrors && form.tipoConta === '' && (
              <span style={{ fontSize: 12, color: '#FF4D4F', marginTop: 6, display: 'block' }}>
                Selecione o tipo de conta
              </span>
            )}
          </fieldset>
        </div>
      </section>
    </div>
  )
}
