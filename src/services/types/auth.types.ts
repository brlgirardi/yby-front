export type OrganizationType =
  | 'merchant'
  | 'acquirer'
  | 'subacquirer'
  | 'independent_sales_organization'

export type Organization = {
  id: string
  taxId: string
  name: string
  type: OrganizationType
}

export type User = {
  name: string
  email: string
  phone?: string
  organization: Organization
  roles: string[]
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  user: User
  isFirstAccess?: boolean
}
