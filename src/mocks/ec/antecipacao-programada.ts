// Mocks de Antecipação Automática — EC V1.
// Regras agendadas que disparam antecipação conforme cadência ou gatilho financeiro.

export type TriggerTipo = 'calendario' | 'valor-agenda'

export interface RegraAntecipacao {
  id: string
  nome: string
  ativa: boolean
  trigger: {
    tipo: TriggerTipo
    /** Texto descritivo do trigger pra renderizar inline */
    descricao: string
  }
  filtros: {
    bandeiras?: string[]
    minParcela?: number
    maxParcela?: number
  }
  ultimaExecucao?: string
  proximaExecucao?: string
  totalAntecipadoMes: number
  qtdExecucoesMes: number
}

export const ecRegrasAntecipacao: RegraAntecipacao[] = [
  {
    id: 'REG-001',
    nome: 'Antecipa todo dia 5',
    ativa: true,
    trigger: { tipo: 'calendario', descricao: 'Todo dia 5 do mês, às 09:00' },
    filtros: { minParcela: 3, bandeiras: ['Visa', 'Mastercard'] },
    ultimaExecucao: '05/04/2026 09:01',
    proximaExecucao: '05/05/2026 09:00',
    totalAntecipadoMes: 32400,
    qtdExecucoesMes: 1,
  },
  {
    id: 'REG-002',
    nome: 'Antecipa quando agenda > R$ 50k',
    ativa: true,
    trigger: { tipo: 'valor-agenda', descricao: 'Sempre que agenda futura ≥ R$ 50.000,00' },
    filtros: { bandeiras: ['Visa', 'Mastercard', 'Elo'] },
    ultimaExecucao: '12/04/2026 14:32',
    proximaExecucao: '— (depende do volume)',
    totalAntecipadoMes: 87500,
    qtdExecucoesMes: 3,
  },
  {
    id: 'REG-003',
    nome: 'Toda sexta-feira',
    ativa: false,
    trigger: { tipo: 'calendario', descricao: 'Toda sexta-feira, às 14:00' },
    filtros: {},
    ultimaExecucao: '28/02/2026 14:00',
    proximaExecucao: undefined,
    totalAntecipadoMes: 0,
    qtdExecucoesMes: 0,
  },
]

export interface KpiProgramada {
  regrasAtivas: number
  proximaExecucao: string
  totalAntecipadoMes: number
}

export const ecKpisProgramada: KpiProgramada = {
  regrasAtivas: 2,
  proximaExecucao: '05/05/2026 09:00',
  totalAntecipadoMes: 119900,
}
