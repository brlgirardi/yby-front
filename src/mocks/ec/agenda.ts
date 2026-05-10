// Mocks da Agenda do Estabelecimento Comercial — V0.
// Espelha o Figma "Receivables schedule" / "Agenda de Recebíveis":
// - 4 KPIs no topo (Entrada, Saída, Líquido do dia, Entradas futuras)
// - calendário mensal com status por dia (Recebido / A receber / vazio)
// - painel lateral do dia selecionado com Entradas e Deduções

export type DayStatus = 'recebido' | 'aReceber' | 'vazio'

export interface AgendaDay {
  day: number
  status: DayStatus
  /** Valor BRUTO do dia (parcelas + antecipações que caem) */
  amount: number
  /** Valor LÍQUIDO efetivo (depois de taxas e débitos de gravame). Se omitido, o consumidor calcula. */
  liquido?: number
  isToday?: boolean
  isSelected?: boolean
}

export interface AgendaKpis {
  entrada: number
  saida: number
  liquidoDoDia: number
  entradasFuturas: number
}

export interface DayDetailEntry {
  label: string
  amount: number  // positivo entrada, negativo dedução
  tooltip?: string
}

export interface DayDetail {
  date: string  // '11 de Janeiro'
  entradas: DayDetailEntry[]
  deducoes: DayDetailEntry[]
  aReceberNoDia: number
}

// Mês de Janeiro 2025 conforme Figma — manteremos como referência
export const ecAgendaKpis: AgendaKpis = {
  entrada: 191400,
  saida: 143550,
  liquidoDoDia: 47850,
  entradasFuturas: 1247350,
}

// Calendário mensal — 31 dias. Status / valor por dia.
// Padrão do Figma: dias passados = "Recebido" (vermelho-cinza), atuais/futuros = "A receber" (azul).
// Hoje é dia 11 (selecionado).
// Bruto = parcelas + antecipações que caem; Líquido = bruto − taxas − débitos de gravame.
// Proporção média: líquido ≈ 32% do bruto (mesma do dia 11: 91.400 / 282.800).
export const ecAgendaJanuary: AgendaDay[] = [
  { day: 1,  status: 'recebido',  amount: 0,      liquido: 0      },
  { day: 2,  status: 'recebido',  amount: 152000, liquido: 49000  },
  { day: 3,  status: 'recebido',  amount: 0,      liquido: 0      },
  { day: 4,  status: 'recebido',  amount: 168000, liquido: 54000  },
  { day: 5,  status: 'recebido',  amount: 0,      liquido: 0      },
  { day: 6,  status: 'recebido',  amount: 145000, liquido: 47000  },
  { day: 7,  status: 'recebido',  amount: 198000, liquido: 64000  },
  { day: 8,  status: 'recebido',  amount: 0,      liquido: 0      },
  { day: 9,  status: 'recebido',  amount: 175000, liquido: 56000  },
  { day: 10, status: 'recebido',  amount: 0,      liquido: 0      },
  { day: 11, status: 'aReceber',  amount: 282800, liquido: 91400, isToday: true, isSelected: true },
  { day: 12, status: 'aReceber',  amount: 0,      liquido: 0      },
  { day: 13, status: 'aReceber',  amount: 162000, liquido: 52000  },
  { day: 14, status: 'aReceber',  amount: 188000, liquido: 60000  },
  { day: 15, status: 'aReceber',  amount: 0,      liquido: 0      },
  { day: 16, status: 'aReceber',  amount: 145000, liquido: 47000  },
  { day: 17, status: 'aReceber',  amount: 172000, liquido: 55000  },
  { day: 18, status: 'aReceber',  amount: 158000, liquido: 51000  },
  { day: 19, status: 'aReceber',  amount: 195000, liquido: 63000  },
  { day: 20, status: 'aReceber',  amount: 142000, liquido: 46000  },
  { day: 21, status: 'aReceber',  amount: 168000, liquido: 54000  },
  { day: 22, status: 'aReceber',  amount: 0,      liquido: 0      },
  { day: 23, status: 'aReceber',  amount: 178000, liquido: 57000  },
  { day: 24, status: 'aReceber',  amount: 152000, liquido: 49000  },
  { day: 25, status: 'aReceber',  amount: 165000, liquido: 53000  },
  { day: 26, status: 'aReceber',  amount: 185000, liquido: 60000  },
  { day: 27, status: 'aReceber',  amount: 0,      liquido: 0      },
  { day: 28, status: 'aReceber',  amount: 192000, liquido: 62000  },
  { day: 29, status: 'aReceber',  amount: 158000, liquido: 51000  },
  { day: 30, status: 'aReceber',  amount: 0,      liquido: 0      },
  { day: 31, status: 'aReceber',  amount: 175000, liquido: 56000  },
]

export const ecAgendaDay11: DayDetail = {
  date: '11 de Janeiro',
  entradas: [
    { label: 'Parcelas a receber',  amount:  191400, tooltip: 'Total bruto de parcelas previstas para o dia' },
    { label: 'Crédito de gravame',  amount:   91400, tooltip: 'Crédito de antecipação atribuído' },
  ],
  deducoes: [
    { label: 'Taxas/tarifas',       amount: -25000, tooltip: 'Taxas e tarifas operacionais' },
    { label: 'Débito de gravame',   amount: -25000, tooltip: 'Débito de antecipação aplicado' },
  ],
  aReceberNoDia: 91400,
}

// Pagamentos (saídas/agendamentos do EC) — versão simples, não vimos Figma específico.
export interface PagamentoAgendado {
  id: string
  data: string
  beneficiario: string
  descricao: string
  valor: number
  status: 'Agendado' | 'Pago' | 'Cancelado' | 'Pendente'
}

export const ecPagamentosAgendados: PagamentoAgendado[] = [
  { id: 'PG-001', data: '15/01/2025', beneficiario: 'Fornecedor SP Ltda',  descricao: 'Reposição de estoque',     valor:  12450, status: 'Agendado' },
  { id: 'PG-002', data: '18/01/2025', beneficiario: 'Aluguel — Galpão',     descricao: 'Aluguel mês 01/2025',      valor:   8900, status: 'Agendado' },
  { id: 'PG-003', data: '20/01/2025', beneficiario: 'Energia Elétrica',     descricao: 'Conta de luz 12/2024',     valor:   1240, status: 'Pendente' },
  { id: 'PG-004', data: '08/01/2025', beneficiario: 'Folha — Funcionários', descricao: 'Salários 01/2025',          valor:  18500, status: 'Pago'     },
  { id: 'PG-005', data: '05/01/2025', beneficiario: 'Marketing Digital',     descricao: 'Campanha janeiro',          valor:   3200, status: 'Pago'     },
  { id: 'PG-006', data: '25/01/2025', beneficiario: 'Manutenção POS',        descricao: 'Reparo maquininha #3',     valor:    480, status: 'Agendado' },
  { id: 'PG-007', data: '03/01/2025', beneficiario: 'Hospedagem site',       descricao: 'Plano anual',              valor:    890, status: 'Cancelado' },
]
