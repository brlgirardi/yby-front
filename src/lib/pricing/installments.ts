import type { Installment, ProductType } from '@/services/types/pricing.types'

export interface PaymentMethodOption {
  key: string
  label: string
  product_type: ProductType
  installment_id: string
  range: string
}

/**
 * Constrói as opções de método de pagamento a partir das `Installment`s da API.
 * Espelha `buildPaymentMethodOptions` do yby-ui.
 *
 * Convenção Tupi:
 *  - inst from=1 to=1: pre_paid, debit, credit_1
 *  - inst from>1 e from===to: credit Nx (parcelado fixo)
 *  - inst from>1 e to>from: credit faixa (ex: 2-6x)
 */
export function buildPaymentMethodOptions(installments: Installment[]): PaymentMethodOption[] {
  const options: PaymentMethodOption[] = []
  const inst1 = installments.find(i => i.from === 1 && i.to === 1)
  if (inst1) {
    options.push({ key: 'pre_paid',  label: 'Pré-pago',         product_type: 'pre_paid', installment_id: inst1.id, range: '—' })
    options.push({ key: 'debit',     label: 'Débito à vista',   product_type: 'debit',    installment_id: inst1.id, range: '—' })
    options.push({ key: 'credit_1',  label: 'Crédito à vista',  product_type: 'credit',   installment_id: inst1.id, range: '1x' })
  }
  for (const inst of installments) {
    if (inst.from > 1 && inst.from === inst.to) {
      options.push({
        key: `credit_${inst.from}`,
        label: `Crédito ${inst.from}x`,
        product_type: 'credit', installment_id: inst.id,
        range: `${inst.from}x`,
      })
    } else if (inst.from > 1 && inst.to > inst.from) {
      options.push({
        key: `credit_${inst.from}_${inst.to}`,
        label: `Crédito ${inst.from} a ${inst.to}x`,
        product_type: 'credit', installment_id: inst.id,
        range: `${inst.from}-${inst.to}x`,
      })
    }
  }
  return options
}

export function findInstallment(installments: Installment[], id: string): Installment | undefined {
  return installments.find(i => i.id === id)
}

export function describeInstallment(installment: Installment | undefined): string {
  if (!installment) return '—'
  if (installment.from === installment.to) return `${installment.from}x`
  return `${installment.from}-${installment.to}x`
}
