'use client'

import { Suspense } from 'react'
import MerchantOnboarding from '@/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding'

// useSearchParams precisa de Suspense boundary no App Router.
export default function NovoMerchantPage() {
  return (
    <Suspense fallback={null}>
      <MerchantOnboarding />
    </Suspense>
  )
}
