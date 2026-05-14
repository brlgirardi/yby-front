'use client'

import { useAuthStore } from '@/store/auth.store'
import type { OrganizationType } from '@/services/types/auth.types'

/**
 * Espelho do hook `useOrganizationType` do yby-ui (frontend de produção Tupi).
 *
 * Lê o tipo da organização do usuário logado e expõe flags booleanas
 * pra usar em wrappers, guards e renderização condicional de menu/telas.
 *
 * Identifica também a própria Tupi via `taxId === '57965582000168'`.
 */
export function useOrganizationType() {
  const org = useAuthStore((state) => state.user?.organization)
  const type = org?.type as OrganizationType | undefined

  return {
    organizationId: org?.id,
    organizationType: type,
    isTupi: org?.taxId === '57965582000168',
    isAcquirer: type === 'acquirer',
    isSubacquirer: type === 'subacquirer',
    isISO: type === 'independent_sales_organization',
    isMerchant: type === 'merchant',
  }
}
