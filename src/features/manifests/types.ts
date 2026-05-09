// Tipos compartilhados para manifests de persona.

export type Persona = 'estabelecimento' | 'subadquirente' | 'adquirente'
export type Version = 'v0' | 'v1'

export type ModuleKey =
  | 'dashboard'
  | 'cobrancas'
  | 'agendas'
  | 'financeiro'
  | 'loja'
  | 'configuracoes'
  | 'suporte'
  | 'merchants'
  | 'transactions'
  | 'agenda'
  | 'pricing'
  | 'usuarios'
  | 'reconciliation'
  | 'settings'
  // V1++ EC
  | 'preferencias'
  | 'antecipacao-programada'
  // V1++ SUB
  | 'aprovacoes'
  | 'antecipacao'

export interface PersonaManifest {
  label: string
  persona: Persona
  version: Version
  modules: ModuleKey[]
  submenus: Partial<Record<ModuleKey, string[]>>
  defaultExpanded?: ModuleKey
  onboarding?: {
    autoAdvance?: boolean
    autoSettlement?: boolean
  }
  badges?: {
    dev?: string
  }
}
