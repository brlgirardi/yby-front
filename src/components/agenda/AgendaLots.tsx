'use client'

import Tag from '@/components/shared/Tag'
import KpiCard from '@/components/ui/KpiCard'

const statusBar: Record<string, string> = {
  liquidado: '#52C41A',
  antecipado: '#FA8C16',
  pendente: '#FAAD14',
}

const lots = [
  { id: 'LOT-2026042401', adquirente: 'Cielo', data: '24/04/2026', qtd: 47, bruto: 'R$ 48.200', comissao: 'R$ 1.446', antecipacao: '—', liquido: 'R$ 46.754', status: 'pendente' },
  { id: 'LOT-2026042402', adquirente: 'Rede', data: '24/04/2026', qtd: 61, bruto: 'R$ 72.100', comissao: 'R$ 2.163', antecipacao: '—', liquido: 'R$ 69.937', status: 'pendente' },
  { id: 'LOT-2026042301', adquirente: 'Adiq', data: '23/04/2026', qtd: 33, bruto: 'R$ 31.500', comissao: 'R$ 945', antecipacao: 'R$ 4.200', liquido: 'R$ 26.355', status: 'antecipado' },
  { id: 'LOT-2026042302', adquirente: 'Getnet', data: '23/04/2026', qtd: 42, bruto: 'R$ 41.620', comissao: 'R$ 1.249', antecipacao: '—', liquido: 'R$ 40.371', status: 'liquidado' },
  { id: 'LOT-2026042201', adquirente: 'Cielo', data: '22/04/2026', qtd: 78, bruto: 'R$ 96.800', comissao: 'R$ 2.904', antecipacao: '—', liquido: 'R$ 93.896', status: 'liquidado' },
]

const statusLabel: Record<string, string> = {
  liquidado: 'Liquidado',
  antecipado: 'Antecipado',
  pendente: 'Pendente',
}
const kpis = [
  { label: 'Total de lotes', value: '5', variant: 'neutral' as const },
  { label: 'Bruto total', value: 'R$ 290.220', variant: 'info' as const },
  { label: 'Antecipado', value: 'R$ 4.200', variant: 'orange' as const },
  { label: 'Líquido total', value: 'R$ 277.313', variant: 'success' as const },
]

export default function AgendaLots() {
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="space-y-3">
        {lots.map(lot => (
          <div key={lot.id} className="bg-white rounded-sm border border-[#f0f0f0] flex overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div className="w-1 flex-shrink-0" style={{ background: statusBar[lot.status] }} />
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-xs text-[#1890FF]">{lot.id}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium">{lot.adquirente}</span>
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>{lot.data}</span>
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>• {lot.qtd} transações</span>
                  </div>
                </div>
                <Tag status={statusLabel[lot.status]} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>Bruto</div>
                  <div className="text-sm font-semibold" style={{ color: '#1890FF' }}>{lot.bruto}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>Comissão</div>
                  <div className="text-sm font-semibold" style={{ color: '#FF4D4F' }}>{lot.comissao}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>Antecipação</div>
                  <div className="text-sm font-semibold" style={{ color: lot.antecipacao === '—' ? 'rgba(0,0,0,0.45)' : '#FA8C16' }}>{lot.antecipacao}</div>
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>Líquido</div>
                  <div className="text-sm font-semibold" style={{ color: '#52C41A' }}>{lot.liquido}</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Totalizador */}
        <div className="flex items-center justify-between px-4 py-3 rounded-sm" style={{ background: '#E6F7FF', border: '1px solid #91D5FF' }}>
          <span className="text-sm font-medium text-[#1890FF]">Totalizador ({lots.length} lotes)</span>
          <div className="flex gap-6">
            <div className="text-right">
              <div className="text-xs" style={{ color: 'rgba(0,0,0,0.65)' }}>Bruto</div>
              <div className="text-sm font-bold text-[#1890FF]">R$ 290.220</div>
            </div>
            <div className="text-right">
              <div className="text-xs" style={{ color: 'rgba(0,0,0,0.65)' }}>Líquido</div>
              <div className="text-sm font-bold text-[#52C41A]">R$ 277.313</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
