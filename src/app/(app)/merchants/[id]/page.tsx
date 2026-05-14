'use client'
// src/app/(app)/merchants/[id]/page.tsx
// Tela de visualização / edição de um EC já cadastrado.
// Reusa MerchantOnboarding em modo view (default) ou edit (?edit=1).

import { Suspense, useEffect, useState } from 'react'
import { notFound, useSearchParams } from 'next/navigation'
import MerchantOnboarding from '@/features/subadquirente/v1/MerchantOnboarding/MerchantOnboarding'
import { emptyForm, type MerchantFormData } from '@/features/subadquirente/v1/MerchantOnboarding/types'
import { getMerchant } from '@/services/organizationService'

function MerchantPageContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const isEdit = searchParams.get('edit') === '1'
  const [initialForm, setInitialForm] = useState<MerchantFormData | null>(null)
  const [notFoundFlag, setNotFoundFlag] = useState(false)

  useEffect(() => {
    let cancelled = false
    getMerchant(id)
      .then((record) => {
        if (cancelled) return
        if (!record) {
          setNotFoundFlag(true)
          return
        }
        setInitialForm({
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
          terminais: record.terminais,
        })
      })
      .catch(() => {
        if (!cancelled) setNotFoundFlag(true)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (notFoundFlag) {
    notFound()
  }

  if (!initialForm) {
    return null
  }

  return (
    <MerchantOnboarding
      mode={isEdit ? 'edit' : 'view'}
      initialForm={initialForm}
      merchantId={id}
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
