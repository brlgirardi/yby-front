// src/features/subadquirente/v1/MerchantOnboarding/types.ts
// Tipos do wizard de Onboarding de Estabelecimento Comercial (EC) — Sub-adquirente.
// Fase 1: estrutura visual + Step 1 (Dados do Estabelecimento) com mocks.

export type Step = 1 | 2 | 3 | 4

export type StepStatus = 'active' | 'pending' | 'done'

export type TipoConta = 'corrente' | 'poupanca'

export interface StepDef {
  key: Step
  label: string
}

export interface MerchantFormData {
  // --- Seção A: Dados básicos ---
  semCnpj: boolean
  cnpj: string
  cpf: string
  rg: string
  razaoSocial: string
  nomeFantasia: string
  cnae: string
  mcc: string
  faturamento: string

  // --- Seção B: Endereço ---
  cep: string
  estado: string
  cidade: string
  endereco: string
  numero: string
  complemento: string

  // --- Seção C: Recebimento ---
  banco: string
  agencia: string
  conta: string
  tipoConta: TipoConta | ''
}

export const emptyForm: MerchantFormData = {
  semCnpj: false,
  cnpj: '',
  cpf: '',
  rg: '',
  razaoSocial: '',
  nomeFantasia: '',
  cnae: '',
  mcc: '',
  faturamento: '',
  cep: '',
  estado: '',
  cidade: '',
  endereco: '',
  numero: '',
  complemento: '',
  banco: '',
  agencia: '',
  conta: '',
  tipoConta: '',
}

export const STEPS: StepDef[] = [
  { key: 1, label: 'Dados' },
  { key: 2, label: 'Tabela de preço' },
  { key: 3, label: 'Adquirentes' },
  { key: 4, label: 'Confirmação' },
]

/** Campos obrigatórios mínimos do Step 1 para habilitar o botão Próximo. */
export function step1IsValid(form: MerchantFormData): boolean {
  const documentoOk = form.semCnpj
    ? form.cpf.trim().length > 0 && form.rg.trim().length > 0
    : form.cnpj.trim().length > 0

  return (
    documentoOk &&
    form.razaoSocial.trim().length > 0 &&
    form.cnae.trim().length > 0 &&
    form.mcc.trim().length > 0 &&
    form.faturamento.trim().length > 0 &&
    form.cep.trim().length > 0 &&
    form.estado.trim().length > 0 &&
    form.cidade.trim().length > 0 &&
    form.endereco.trim().length > 0 &&
    form.numero.trim().length > 0 &&
    form.banco.trim().length > 0 &&
    form.agencia.trim().length > 0 &&
    form.conta.trim().length > 0 &&
    form.tipoConta.length > 0
  )
}
