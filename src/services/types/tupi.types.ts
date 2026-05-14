/**
 * Tipos compartilhados da API pública Tupi (`https://yby-dev.positivolabs.com.br/v1`).
 * Convenção: camelCase em todos os campos. IDs são XIDs de 20 caracteres.
 *
 * Fonte: github.com/tupi-fintech/yby-docs/docs/apis/*
 */

/* ─── Comum ────────────────────────────────────────────────────────────── */

export interface TupiTimestamps {
  createdAt: string
  updatedAt: string
}

export interface TupiPaginatedResponse<T> {
  metadata: {
    cursor?: string
    limit: number
  }
  data: T[]
}

export interface TupiListParams {
  cursor?: string
  limit?: number
  order_by?: string
  order?: 'ASC' | 'DESC'
}

/* ─── Address / Contact / BankAccount / ContactPerson ─────────────────── */

export interface TupiAddress {
  id?: string
  postalCode: string
  state: string
  city: string
  neighborhood: string
  street: string
  number: string
  country?: string
  complement?: string
}

export interface TupiContact {
  id?: string
  site?: string
  email?: string
  phone?: string
}

export interface TupiBankAccount {
  id?: string
  bankId?: string
  accountType: 'checking' | 'savings'
  routingNumber: string
  accountNumber: string
}

export interface TupiContactPerson {
  id?: string
  name?: string
  taxId?: string
  email?: string
  phone?: string
  position?: string
}

/* ─── Merchant ─────────────────────────────────────────────────────────── */

export type TupiOrganizationType =
  | 'merchant'
  | 'subacquirer'
  | 'acquirer'
  | 'independent_sales_organization'

export interface TupiMerchant extends TupiTimestamps {
  id: string
  type: 'merchant'
  parentId?: string
  dbaName: string
  corporateName: string
  taxId: string
  merchantCategoryCode: string
  economicActivityCode?: string
  enabled?: boolean
  address?: TupiAddress
  contact?: TupiContact
  bankAccounts?: TupiBankAccount[]
  contactPerson?: TupiContactPerson[]
}

export interface TupiCreateMerchantRequest {
  dbaName: string
  corporateName: string
  taxId: string
  merchantCategoryCode: string
  economicActivityCode?: string
  address: TupiAddress
  contact?: TupiContact
  bankAccounts?: TupiBankAccount[]
  contactPerson?: TupiContactPerson[]
}

export interface TupiUpdateMerchantRequest {
  dbaName?: string
  corporateName?: string
  taxId?: string
  address?: TupiAddress
  contact?: TupiContact
}

export interface TupiVerificationCodeRequest {
  numberOfCodes: number
  expiresAt?: string
}

export interface TupiVerificationCodesResponse {
  data: Array<{ code: string; expiresAt: string }>
}

/* ─── Provider / Credential ───────────────────────────────────────────── */

export type TupiProviderName =
  | 'pagseguro'
  | 'cielo'
  | 'rede'
  | 'stone'
  | 'getnet'
  | 'adiq'

export interface TupiProvider extends TupiTimestamps {
  id: string
  name: TupiProviderName
  /** Quando documentado, virá: type ('payment_processor'|...), context ('card_present'|'card_not_present'). */
  type?: string
  context?: 'card_present' | 'card_not_present'
  enabled?: boolean
}

export interface TupiCredentialAuthData {
  /** MID — código de comerciante do provedor. */
  merchantIdentifier?: string
  /** TID — código de terminal do provedor (quando aplicável no nível de credential). */
  terminalIdentifier?: string
  /** Campos adicionais por provedor (livre). */
  [key: string]: unknown
}

export interface TupiCredential extends TupiTimestamps {
  id: string
  subacquirerId: string
  merchantId: string
  providerId: string
  authenticationData: TupiCredentialAuthData
  testMode?: boolean
  enabled?: boolean
  status?: string
  additionalData?: Record<string, unknown>
}

export interface TupiCreateCredentialRequest {
  merchantId: string
  providerId: string
  providerName: TupiProviderName
  authenticationData: TupiCredentialAuthData
  status?: string
  additionalData?: Record<string, unknown>
}

/* ─── Terminal ────────────────────────────────────────────────────────── */

export interface TupiTerminal extends TupiTimestamps {
  id: string
  merchantId: string
  serialNumber: string
  /** Devolvido só na criação. */
  verificationCode?: string
  verificationCodeExpiresAt?: string
  enabled?: boolean
}

export interface TupiCreateTerminalRequest {
  merchantId: string
  serialNumber: string
}

export interface TupiUpdateTerminalRequest {
  serialNumber?: string
  enabled?: boolean
}

/* ─── Transaction Summary ─────────────────────────────────────────────── */

export interface TupiTransactionSummary extends TupiTimestamps {
  id: string
  /** Estrutura detalhada não está totalmente documentada — manter loose até consolidar. */
  [key: string]: unknown
}

/* ─── Auth ────────────────────────────────────────────────────────────── */

export interface TupiAuthRequest {
  username: string
  password: string
}

export interface TupiAuthResponse {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: 'Bearer'
}
