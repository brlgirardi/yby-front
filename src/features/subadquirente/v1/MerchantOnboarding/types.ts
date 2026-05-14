// src/features/subadquirente/v1/MerchantOnboarding/types.ts
// Tipos do Onboarding de Estabelecimento Comercial (EC) — Sub-adquirente.
// Estrutura: página dedicada com tabs (Detalhes do EC | Canais | Terminais).

export type OnboardingTab = 'detalhes' | 'canais' | 'terminais'

export type ChannelKey = 'cp' | 'cnp'

export interface AdquirenteCanal {
  /** ID local pra reconciliar adquirentes adicionados na UI (random id ou index). */
  id: string
  /** Valor selecionado no AppSelect — referencia ADQUIRENTES do mock. */
  adquirenteId: string
  /** MID atribuído pelo adquirente ao EC nesse canal. */
  mid: string
}

export interface CanalConfig {
  enabled: boolean
  adquirentes: AdquirenteCanal[]
}

export interface TerminalVinculo {
  id: string
  /** Referencia AdquirenteCanal.adquirenteId vinculado em Canais (mesmo channel). */
  adquirenteId: string
  /** TID — identificador do terminal × adquirente. Texto livre. */
  tid: string
}

export interface Terminal {
  id: string
  /** Identificação livre do terminal (ex: "928132 - Loja"). */
  identificacao: string
  /** Lista de vínculos terminal × adquirente (cada um com TID próprio). */
  vinculos: TerminalVinculo[]
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
  canais: Record<ChannelKey, CanalConfig>

  // --- Tab Terminais ---
  terminais: Record<ChannelKey, Terminal[]>
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
  terminais: {
    cp: [],
    cnp: [],
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

/**
 * Validação consolidada do MerchantFormData antes de chamar createMerchant.
 * Devolve a lista de erros (vazia quando válido). Cada erro é um par
 * { field, message } para mostrar ao usuário (toast/modal).
 */
export function validateMerchantForm(form: MerchantFormData): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = []

  if (!form.semCnpj && form.cnpj.replace(/\D/g, '').length < 11) {
    errors.push({ field: 'cnpj', message: 'CNPJ ou CPF é obrigatório' })
  }
  if (form.razaoSocial.trim().length === 0) {
    errors.push({ field: 'razaoSocial', message: 'Razão social é obrigatória' })
  }
  if (form.mcc.trim().length === 0) {
    errors.push({ field: 'mcc', message: 'MCC é obrigatório' })
  }
  if (form.cep.replace(/\D/g, '').length !== 8) {
    errors.push({ field: 'cep', message: 'CEP inválido (8 dígitos)' })
  }
  if (form.estado.trim().length === 0) {
    errors.push({ field: 'estado', message: 'Estado é obrigatório' })
  }
  if (form.cidade.trim().length === 0) {
    errors.push({ field: 'cidade', message: 'Cidade é obrigatória' })
  }
  if (form.endereco.trim().length === 0) {
    errors.push({ field: 'endereco', message: 'Endereço é obrigatório' })
  }
  if (form.numero.trim().length === 0) {
    errors.push({ field: 'numero', message: 'Número é obrigatório' })
  }

  // Canais habilitados precisam ter pelo menos 1 adquirente com MID preenchido.
  for (const ch of ['cp', 'cnp'] as const) {
    const c = form.canais[ch]
    if (c.enabled && c.adquirentes.length === 0) {
      // Não bloqueia (canal pode estar habilitado sem adquirente ainda) — só warning.
      continue
    }
    for (const adq of c.adquirentes) {
      if (!adq.adquirenteId) {
        errors.push({ field: `canais.${ch}`, message: `Canal ${ch.toUpperCase()}: adquirente não selecionado` })
      }
      if (!adq.mid.trim()) {
        errors.push({ field: `canais.${ch}.mid`, message: `Canal ${ch.toUpperCase()}: MID é obrigatório` })
      }
    }
  }

  return errors
}
