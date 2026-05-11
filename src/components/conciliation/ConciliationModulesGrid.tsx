'use client'

import {
  ArrowLeftRight,
  AlertTriangle,
  Calendar,
  Building2,
  Zap,
  ArrowDownCircle,
  FileText,
  Landmark,
} from 'lucide-react'
import ModuleCard, { type ConciliationModule } from './ModuleCard'

const MODULES: (ConciliationModule & { group: string })[] = [
  // ── Captura & Disputas ────────────────────────────────────────────────────
  {
    id: 'interchange',
    name: 'Captura vs. Intercâmbio',
    description: 'Transações aprovadas no gateway vs. arquivo EDI do adquirente',
    icon: ArrowLeftRight,
    status: 'active',
    href: '/reconciliation/interchange',
    group: 'Captura & Disputas',
  },
  {
    id: 'chargebacks-edi',
    name: 'Chargebacks vs. EDI',
    description: 'Contestações de compra vs. arquivo de chargebacks EDI',
    icon: AlertTriangle,
    status: 'soon',
    group: 'Captura & Disputas',
  },
  // ── Agenda a Receber ──────────────────────────────────────────────────────
  {
    id: 'receivable-edi',
    name: 'Agenda a Receber vs. EDI',
    description: 'Recebíveis futuros do adquirente vs. arquivo VAN/EDI',
    icon: Calendar,
    status: 'soon',
    group: 'Agenda a Receber',
  },
  {
    id: 'receivable-bank',
    name: 'Agenda a Receber vs. Banco',
    description: 'Recebíveis futuros vs. créditos efetivos na conta bancária',
    icon: Building2,
    status: 'soon',
    group: 'Agenda a Receber',
  },
  {
    id: 'pix-bank',
    name: 'PIX vs. Banco',
    description: 'Agenda de recebíveis PIX vs. recebido no banco',
    icon: Zap,
    status: 'soon',
    group: 'Agenda a Receber',
  },
  // ── Agenda a Pagar & Liquidação ───────────────────────────────────────────
  {
    id: 'payable-edi',
    name: 'Agenda a Pagar vs. EDI',
    description: 'Agenda de pagamentos vs. VAN/EDI, antecipações e chargebacks',
    icon: ArrowDownCircle,
    status: 'soon',
    group: 'Agenda a Pagar & Liquidação',
  },
  {
    id: 'payable-cip',
    name: 'Agenda a Pagar vs. CIP',
    description: 'Agenda de pagamentos vs. débitos eventuais e arquivo CIP',
    icon: FileText,
    status: 'soon',
    group: 'Agenda a Pagar & Liquidação',
  },
  {
    id: 'cip-bank',
    name: 'CIP vs. Banco Liquidante',
    description: 'Arquivo de instrução CIP vs. débitos efetivados no banco liquidante',
    icon: Landmark,
    status: 'soon',
    group: 'Agenda a Pagar & Liquidação',
  },
]

const GROUPS = ['Captura & Disputas', 'Agenda a Receber', 'Agenda a Pagar & Liquidação']

export default function ConciliationModulesGrid() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '24px 24px' }}>
      {GROUPS.map(group => {
        const modules = MODULES.filter(m => m.group === group)
        return (
          <section key={group}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(0,0,0,0.65)',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {group}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 12,
            }}>
              {modules.map(m => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
