'use client'

import { useAuthStore } from '@/store/auth.store'

/**
 * Devolve o id do merchant ativo do contexto atual.
 *
 * Para sub-adquirentes/acquirers que operam SOBRE merchants, o id selecionado
 * vem da rota (ex: /merchants/[id]). Para usuários logados como merchant,
 * vem direto da organização.
 *
 * Fallback `merchant_yby_demo` é usado APENAS em mock quando não há contexto
 * disponível (ex.: tela de /integrations sem merchant selecionado ainda).
 */
const DEMO_MERCHANT_ID = 'merchant_yby_demo'

export function useCurrentMerchantId(routeId?: string): string {
  const organization = useAuthStore((s) => s.user?.organization)
  if (routeId) return routeId
  if (organization?.type === 'merchant' && organization.id) return organization.id
  return DEMO_MERCHANT_ID
}
