'use client'
// src/app/(app)/merchants/novo/page.tsx
// Rota da página dedicada de Onboarding EC. Wrapper em Suspense para
// suportar hooks client-side (useRouter / useSearchParams) sob App Router.

import { Suspense } from 'react'
import MerchantOnboarding from '@/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding'

export default function NovoMerchantPage() {
  return (
    <Suspense fallback={null}>
      <MerchantOnboarding />
    </Suspense>
  )
}
