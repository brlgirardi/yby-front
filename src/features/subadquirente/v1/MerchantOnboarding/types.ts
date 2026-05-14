// src/features/subadquirente/v1/MerchantOnboarding/types.ts
// Tipos do Onboarding de Estabelecimento Comercial (EC) — Sub-adquirente.
// Estrutura: página dedicada com tabs (Detalhes do EC | Canais | Terminais).
// Validação acontece por card/section — não há mais wizard linear.

export type OnboardingTab = 'detalhes' | 'canais' | 'terminais'

export interface AdquirenteCanal {
  id: string
  adquirenteId: string
  mid: string
}

export interface CanalConfig {
  enabled: boolean
  adquirentes: AdquirenteCanal[]
}

export interface MerchantFormData {
  // --- Card A: Dados do estabelecimento ---
  semCnpj: boolean
  cnpj: string
  razaoSocial: string
  mcc: string

  // --- Card B: Endereço do estabelecimento ---
  cep: string
  estado: string
  cidade: string
  endereco: string
  numero: string
  complemento: string

  // --- Tab Canais ---
  canais: {
    cp: CanalConfig
    cnp: CanalConfig
  }
}

export const emptyForm: MerchantFormData = {
  semCnpj: false,
  cnpj: '',
  razaoSocial: '',
  mcc: '',
  cep: '',
  estado: '',
  cidade: '',
  endereco: '',
  numero: '',
  complemento: '',
  canais: {
    cp: { enabled: true, adquirentes: [] },
    cnp: { enabled: true, adquirentes: [] },
  },
}

/** Card "Dados do estabelecimento" — válido quando documento + razão social + MCC ok. */
export function dadosCardIsValid(form: MerchantFormData): boolean {
  const documentoOk = form.semCnpj || form.cnpj.trim().length > 0
  return documentoOk && form.razaoSocial.trim().length > 0 && form.mcc.trim().length > 0
}

/** Card "Endereço do estabelecimento" — válido quando todos os obrigatórios preenchidos. */
export function enderecoCardIsValid(form: MerchantFormData): boolean {
  return (
    form.cep.trim().length > 0 &&
    form.estado.trim().length > 0 &&
    form.cidade.trim().length > 0 &&
    form.endereco.trim().length > 0 &&
    form.numero.trim().length > 0
  )
}
