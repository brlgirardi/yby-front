'use client'
// src/app/(app)/merchants/[id]/page.tsx
// Tela de visualização / edição de um EC já cadastrado.
// Reusa MerchantOnboarding em modo view (default) ou edit (?edit=1).

import { Suspense, useMemo } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import MerchantOnboarding from '@/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding'
import { getMerchantRecord } from '@/mocks/sub/merchant-onboarding'
import { emptyForm, type MerchantFormData } from '@/features/subadquirente/v1/MerchantOnboarding/types'

function MerchantPageContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const isEdit = searchParams.get('edit') === '1'

  const record = useMemo(() => getMerchantRecord(id), [id])

  if (!record) {
    notFound()
  }

  const initialForm: MerchantFormData = {
    ...emptyForm,
    semCnpj: record.semCnpj,
    cnpj: record.cnpj,
    razaoSocial: record.razaoSocial,
    mcc: record.mcc,
    cep: record.cep,
    estado: record.estado,
    cidade: record.cidade,
    endereco: record.endereco,
    numero: record.numero,
    complemento: record.complemento,
    canais: record.canais,
  }

  return (
    <MerchantOnboarding
      mode={isEdit ? 'edit' : 'view'}
      initialForm={initialForm}
      merchantId={record.id}
    />
  )
}

export default function MerchantDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={null}>
      <MerchantPageContent id={params.id} />
    </Suspense>
  )
}
