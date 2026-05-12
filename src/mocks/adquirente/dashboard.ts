// Mocks Dashboard Financeiro Adquirente — V0 demo.
// 3 abas: Geral / Planitização / Conciliação ITC.

// ── Aba Geral ────────────────────────────────────────────────
export interface DashboardGeralKpis {
  cobrancasCriadas: number
  cobrancasAutorizadas: number
  numeroCobrancas: number
  ticketMedio: number
}

export const dashboardGeralKpis: DashboardGeralKpis = {
  cobrancasCriadas:     1480000,
  cobrancasAutorizadas: 1320000,
  numeroCobrancas:      8420,
  ticketMedio:          156.78,
}

export interface TpvPoint { date: string; value: number }
export const tpvSeries: TpvPoint[] = [
  { date: '18/04', value: 320 }, { date: '20/04', value: 480 }, { date: '22/04', value: 360 },
  { date: '24/04', value: 620 }, { date: '26/04', value: 540 }, { date: '28/04', value: 760 },
  { date: '30/04', value: 690 }, { date: '02/05', value: 920 }, { date: '04/05', value: 770 },
  { date: '06/05', value: 1080 }, { date: '08/05', value: 1020 }, { date: '10/05', value: 1300 },
  { date: '12/05', value: 1180 }, { date: '14/05', value: 980 }, { date: '16/05', value: 870 },
  { date: '18/05', value: 740 }, { date: '20/05', value: 610 }, { date: '22/05', value: 820 },
  { date: '24/05', value: 790 }, { date: '26/05', value: 720 }, { date: '28/05', value: 640 },
  { date: '30/05', value: 580 }, { date: '01/06', value: 600 },
]

export interface StatusCard { status: string; valor: number; qtd: number; tone: 'success' | 'processing' | 'neutral' | 'warning' | 'error' }
export const statusCards: StatusCard[] = [
  { status: 'Pago',           valor: 1320000, qtd: 7100, tone: 'success'    },
  { status: 'Pendente',       valor:   84500, qtd:  420, tone: 'processing' },
  { status: 'Cancelado',      valor:   18200, qtd:  120, tone: 'neutral'    },
  { status: 'Não autorizado', valor:   42800, qtd:  580, tone: 'error'      },
  { status: 'Outros',         valor:   12500, qtd:  200, tone: 'warning'    },
]

export interface FormaPagamento { label: string; pct: number }
export const formasMaisUtilizadas: FormaPagamento[] = [
  { label: 'Cartão de crédito', pct: 99.11 },
  { label: 'Pix',               pct:  0.89 },
]
export const bandeirasMaisUtilizadas: FormaPagamento[] = [
  { label: 'Visa',       pct: 56.74 },
  { label: 'Mastercard', pct: 43.34 },
]

export interface ConversaoIndice { canal: string; pct: number }
export const indicesConversao: ConversaoIndice[] = [
  { canal: 'Conversão de cartão', pct: 84 },
  { canal: 'Conversão de boleto', pct: 0 },
  { canal: 'Conversão de pix',    pct: 0 },
  { canal: 'Outros',              pct: 0 },
]

export interface ParcelaBucket { parcela: string; qtd: number }
export const parcelasCredito: ParcelaBucket[] = [
  { parcela: '1x', qtd: 5200 },
  { parcela: '2x', qtd: 1800 },
  { parcela: '3x', qtd:  920 },
  { parcela: '6x', qtd:  340 },
  { parcela: '10x', qtd:  120 },
  { parcela: '12x', qtd:   40 },
]

// ── Aba Planitização ─────────────────────────────────────────

// % de ITC por bandeira × modalidade — base para precificação comercial.
// TODO(backend): substituir mock por endpoint /adquirente/itc-por-bandeira-modalidade.
export type ModalidadeITC = 'Débito' | 'Crédito à vista' | 'Crédito 2-6x' | 'Crédito 6-12x'
export interface ItcBandeiraModalidadeCell { bandeira: string; modalidade: ModalidadeITC; pct: number }
export const itcPorBandeiraModalidade: ItcBandeiraModalidadeCell[] = [
  { bandeira: 'Visa',       modalidade: 'Débito',          pct: 0.49 },
  { bandeira: 'Visa',       modalidade: 'Crédito à vista', pct: 1.32 },
  { bandeira: 'Visa',       modalidade: 'Crédito 2-6x',    pct: 1.98 },
  { bandeira: 'Visa',       modalidade: 'Crédito 6-12x',   pct: 2.45 },
  { bandeira: 'Mastercard', modalidade: 'Débito',          pct: 0.52 },
  { bandeira: 'Mastercard', modalidade: 'Crédito à vista', pct: 1.38 },
  { bandeira: 'Mastercard', modalidade: 'Crédito 2-6x',    pct: 2.05 },
  { bandeira: 'Mastercard', modalidade: 'Crédito 6-12x',   pct: 2.52 },
  { bandeira: 'Elo',        modalidade: 'Débito',          pct: 0.58 },
  { bandeira: 'Elo',        modalidade: 'Crédito à vista', pct: 1.45 },
  { bandeira: 'Elo',        modalidade: 'Crédito 2-6x',    pct: 2.18 },
  { bandeira: 'Elo',        modalidade: 'Crédito 6-12x',   pct: 2.68 },
  { bandeira: 'Amex',       modalidade: 'Débito',          pct: 0.00 },
  { bandeira: 'Amex',       modalidade: 'Crédito à vista', pct: 1.65 },
  { bandeira: 'Amex',       modalidade: 'Crédito 2-6x',    pct: 2.40 },
  { bandeira: 'Amex',       modalidade: 'Crédito 6-12x',   pct: 2.95 },
  { bandeira: 'Hipercard',  modalidade: 'Débito',          pct: 0.55 },
  { bandeira: 'Hipercard',  modalidade: 'Crédito à vista', pct: 1.42 },
  { bandeira: 'Hipercard',  modalidade: 'Crédito 2-6x',    pct: 2.10 },
  { bandeira: 'Hipercard',  modalidade: 'Crédito 6-12x',   pct: 2.60 },
]

// % de cartões por categoria, por bandeira — apoio à precificação por mix.
// Cada linha (bandeira) soma 100%.
// TODO(backend): substituir mock por endpoint /adquirente/mix-categoria-por-bandeira.
export type CategoriaTier = 'Entry Level' | 'Mid-Tier' | 'Premium Core' | 'Ultra Premium' | 'Corporate'
export interface MixCategoriaBandeiraCell { bandeira: string; categoria: CategoriaTier; pct: number }
export const mixCategoriaPorBandeira: MixCategoriaBandeiraCell[] = [
  // Visa — soma 100
  { bandeira: 'Visa',       categoria: 'Entry Level',   pct: 38 },
  { bandeira: 'Visa',       categoria: 'Mid-Tier',      pct: 30 },
  { bandeira: 'Visa',       categoria: 'Premium Core',  pct: 20 },
  { bandeira: 'Visa',       categoria: 'Ultra Premium', pct:  8 },
  { bandeira: 'Visa',       categoria: 'Corporate',     pct:  4 },
  // Mastercard — soma 100
  { bandeira: 'Mastercard', categoria: 'Entry Level',   pct: 40 },
  { bandeira: 'Mastercard', categoria: 'Mid-Tier',      pct: 28 },
  { bandeira: 'Mastercard', categoria: 'Premium Core',  pct: 18 },
  { bandeira: 'Mastercard', categoria: 'Ultra Premium', pct:  9 },
  { bandeira: 'Mastercard', categoria: 'Corporate',     pct:  5 },
  // Elo — soma 100
  { bandeira: 'Elo',        categoria: 'Entry Level',   pct: 56 },
  { bandeira: 'Elo',        categoria: 'Mid-Tier',      pct: 28 },
  { bandeira: 'Elo',        categoria: 'Premium Core',  pct: 12 },
  { bandeira: 'Elo',        categoria: 'Ultra Premium', pct:  3 },
  { bandeira: 'Elo',        categoria: 'Corporate',     pct:  1 },
  // Amex — soma 100
  { bandeira: 'Amex',       categoria: 'Entry Level',   pct: 12 },
  { bandeira: 'Amex',       categoria: 'Mid-Tier',      pct: 22 },
  { bandeira: 'Amex',       categoria: 'Premium Core',  pct: 30 },
  { bandeira: 'Amex',       categoria: 'Ultra Premium', pct: 22 },
  { bandeira: 'Amex',       categoria: 'Corporate',     pct: 14 },
  // Hipercard — soma 100
  { bandeira: 'Hipercard',  categoria: 'Entry Level',   pct: 62 },
  { bandeira: 'Hipercard',  categoria: 'Mid-Tier',      pct: 26 },
  { bandeira: 'Hipercard',  categoria: 'Premium Core',  pct:  9 },
  { bandeira: 'Hipercard',  categoria: 'Ultra Premium', pct:  2 },
  { bandeira: 'Hipercard',  categoria: 'Corporate',     pct:  1 },
]

// Timeline de ITC mensal, por bandeira × modalidade.
// TODO(backend): substituir mock por endpoint /adquirente/itc-timeline?bandeira=&modalidade=.
export interface ItcTimelinePoint { mes: string; bandeira: string; modalidade: ModalidadeITC; pct: number }
const _MESES_ITC = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai']
function _buildTimeline(base: number, drift: number[]): number[] {
  return drift.map((d) => Number((base + d).toFixed(2)))
}
const _drifts: Record<string, Record<ModalidadeITC, number[]>> = {
  Visa: {
    'Débito':          [-0.04, -0.02,  0.00,  0.01,  0.02,  0.00, -0.01,  0.01,  0.02,  0.03,  0.02,  0.00],
    'Crédito à vista': [-0.10, -0.06, -0.03,  0.00,  0.02,  0.04,  0.05,  0.06,  0.08,  0.07,  0.05,  0.03],
    'Crédito 2-6x':    [-0.12, -0.08, -0.04,  0.00,  0.05,  0.08,  0.10,  0.12,  0.10,  0.08,  0.06,  0.04],
    'Crédito 6-12x':   [-0.15, -0.10, -0.05,  0.02,  0.06,  0.10,  0.14,  0.18,  0.16,  0.12,  0.08,  0.05],
  },
  Mastercard: {
    'Débito':          [-0.03, -0.01,  0.01,  0.02,  0.03,  0.02,  0.01,  0.02,  0.03,  0.04,  0.03,  0.02],
    'Crédito à vista': [-0.08, -0.05, -0.02,  0.01,  0.03,  0.05,  0.06,  0.08,  0.09,  0.07,  0.06,  0.04],
    'Crédito 2-6x':    [-0.10, -0.06, -0.03,  0.02,  0.06,  0.09,  0.12,  0.14,  0.12,  0.10,  0.08,  0.06],
    'Crédito 6-12x':   [-0.13, -0.09, -0.04,  0.03,  0.07,  0.12,  0.16,  0.20,  0.18,  0.14,  0.10,  0.07],
  },
  Elo: {
    'Débito':          [-0.05, -0.03, -0.01,  0.01,  0.02,  0.01, -0.01,  0.00,  0.02,  0.03,  0.02,  0.00],
    'Crédito à vista': [-0.09, -0.05, -0.02,  0.01,  0.03,  0.05,  0.07,  0.09,  0.10,  0.08,  0.06,  0.04],
    'Crédito 2-6x':    [-0.11, -0.07, -0.03,  0.01,  0.05,  0.09,  0.12,  0.14,  0.12,  0.10,  0.08,  0.06],
    'Crédito 6-12x':   [-0.14, -0.10, -0.05,  0.02,  0.06,  0.11,  0.15,  0.19,  0.17,  0.13,  0.09,  0.06],
  },
  Amex: {
    'Débito':          [ 0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00,  0.00],
    'Crédito à vista': [-0.12, -0.08, -0.04,  0.00,  0.04,  0.07,  0.10,  0.13,  0.14,  0.10,  0.07,  0.05],
    'Crédito 2-6x':    [-0.15, -0.10, -0.04,  0.02,  0.07,  0.11,  0.14,  0.17,  0.15,  0.12,  0.09,  0.06],
    'Crédito 6-12x':   [-0.18, -0.12, -0.05,  0.03,  0.09,  0.14,  0.18,  0.22,  0.20,  0.16,  0.11,  0.08],
  },
  Hipercard: {
    'Débito':          [-0.04, -0.02,  0.00,  0.02,  0.03,  0.02,  0.01,  0.02,  0.03,  0.04,  0.03,  0.01],
    'Crédito à vista': [-0.09, -0.05, -0.02,  0.01,  0.03,  0.06,  0.07,  0.09,  0.10,  0.08,  0.06,  0.03],
    'Crédito 2-6x':    [-0.11, -0.07, -0.03,  0.01,  0.05,  0.09,  0.12,  0.14,  0.12,  0.10,  0.07,  0.05],
    'Crédito 6-12x':   [-0.14, -0.09, -0.04,  0.02,  0.07,  0.11,  0.15,  0.19,  0.17,  0.13,  0.09,  0.06],
  },
}
const _baseline: Record<string, Record<ModalidadeITC, number>> = {
  Visa:       { 'Débito': 0.49, 'Crédito à vista': 1.32, 'Crédito 2-6x': 1.98, 'Crédito 6-12x': 2.45 },
  Mastercard: { 'Débito': 0.52, 'Crédito à vista': 1.38, 'Crédito 2-6x': 2.05, 'Crédito 6-12x': 2.52 },
  Elo:        { 'Débito': 0.58, 'Crédito à vista': 1.45, 'Crédito 2-6x': 2.18, 'Crédito 6-12x': 2.68 },
  Amex:       { 'Débito': 0.00, 'Crédito à vista': 1.65, 'Crédito 2-6x': 2.40, 'Crédito 6-12x': 2.95 },
  Hipercard:  { 'Débito': 0.55, 'Crédito à vista': 1.42, 'Crédito 2-6x': 2.10, 'Crédito 6-12x': 2.60 },
}
export const itcTimeline: ItcTimelinePoint[] = (() => {
  const out: ItcTimelinePoint[] = []
  for (const bandeira of Object.keys(_drifts)) {
    for (const modalidade of Object.keys(_drifts[bandeira]) as ModalidadeITC[]) {
      const serie = _buildTimeline(_baseline[bandeira][modalidade], _drifts[bandeira][modalidade])
      serie.forEach((pct, i) => {
        out.push({ mes: _MESES_ITC[i], bandeira, modalidade, pct })
      })
    }
  }
  return out
})()

export interface BandeiraDist { bandeira: string; pct: number; color: string }
export const bandeiraDistribuicao: BandeiraDist[] = [
  { bandeira: 'Mastercard', pct: 54.8, color: '#1890FF' },
  { bandeira: 'Visa',       pct: 37.4, color: '#FA8C16' },
  { bandeira: 'Elo',        pct:  7.8, color: '#52C41A' },
]

export interface BandeiraTimeline { mes: string; mastercard: number; visa: number; elo: number }
export const bandeiraTimeline: BandeiraTimeline[] = [
  { mes: 'Jun', mastercard: 3800, visa: 2400, elo: 720 },
  { mes: 'Jul', mastercard: 4100, visa: 2620, elo: 780 },
  { mes: 'Ago', mastercard: 4800, visa: 3050, elo: 820 },
  { mes: 'Set', mastercard: 5200, visa: 3400, elo: 870 },
  { mes: 'Out', mastercard: 5650, visa: 3650, elo: 900 },
  { mes: 'Nov', mastercard: 5980, visa: 3820, elo: 940 },
]

export interface CategoriaCartao { categoria: string; bandeira: 'Mastercard' | 'Visa' | 'Elo'; valor: number }
export const platinizacaoTop15: CategoriaCartao[] = [
  { categoria: 'Gold',        bandeira: 'Mastercard', valor: 11400 },
  { categoria: 'Platinum',    bandeira: 'Mastercard', valor:  6232 },
  { categoria: 'Gold',        bandeira: 'Visa',       valor:  5840 },
  { categoria: 'Platinum',    bandeira: 'Visa',       valor:  4120 },
  { categoria: 'Standard',    bandeira: 'Mastercard', valor:  3650 },
  { categoria: 'Black',       bandeira: 'Mastercard', valor:  2980 },
  { categoria: 'Standard',    bandeira: 'Visa',       valor:  2810 },
  { categoria: 'Infinite',    bandeira: 'Visa',       valor:  2240 },
  { categoria: 'Nanquim',     bandeira: 'Elo',        valor:  1890 },
  { categoria: 'Black',       bandeira: 'Visa',       valor:  1650 },
  { categoria: 'Diners',      bandeira: 'Mastercard', valor:  1320 },
  { categoria: 'Mais',        bandeira: 'Elo',        valor:  1180 },
  { categoria: 'Grafite',     bandeira: 'Elo',        valor:   980 },
  { categoria: 'Conta PJ',    bandeira: 'Visa',       valor:   720 },
  { categoria: 'Empresarial', bandeira: 'Mastercard', valor:   640 },
]

// ── Aba Conciliação ITC ──────────────────────────────────────
export interface ItcKpi { label: string; valor: string; sub: string; delta: string; deltaTone: 'success' | 'error' }
export const itcKpis: ItcKpi[] = [
  { label: 'Total de Transações', valor: '17.370',  sub: 'Período selecionado', delta: '+5.2% vs anterior', deltaTone: 'success' },
  { label: 'Linhas Conciliadas',  valor: '16.220',  sub: '93.4% do total',      delta: '+2.1% vs anterior', deltaTone: 'success' },
  { label: '% Conciliação',       valor: '93.4%',   sub: 'Taxa de cobertura',   delta: '+1.8pp',            deltaTone: 'success' },
  { label: 'Divergência (%)',     valor: '10.1%',   sub: '1.634 linhas',        delta: '-0.5pp',            deltaTone: 'success' },
]

export interface WaterfallItem { label: string; valor: number; tone: 'positive' | 'negative' | 'final' }
export const coberturaWaterfall: WaterfallItem[] = [
  { label: 'Total de Transações',         valor: 17370, tone: 'positive' },
  { label: 'BIN Ambíguo',                 valor:  -850, tone: 'negative' },
  { label: 'BIN NULL AMEX',               valor:  -120, tone: 'negative' },
  { label: 'Transações Internacionais',   valor:  -180, tone: 'negative' },
  { label: 'Linhas Conciliadas',          valor: 16220, tone: 'final'    },
]

export interface ConciliacaoVsDiverg { label: 'Conciliada' | 'Divergente'; valor: number }
export const conciliacaoVsDivergencia: ConciliacaoVsDiverg[] = [
  { label: 'Conciliada', valor: 16094 },
  { label: 'Divergente', valor:  1634 },
]

export interface ImpactoBucket { label: string; valor: number }
export const impactoDivergencias: ImpactoBucket[] = [
  { label: 'Conciliada',     valor: 1000 },
  { label: 'Subprecificada', valor:  700 },
  { label: 'Sobrepreço',     valor:  700 },
]

export interface ResultadoFinanceiroPoint { mes: string; valor: number }
export const resultadoFinanceiroItc: ResultadoFinanceiroPoint[] = [
  { mes: 'Dez', valor:   320 },
  { mes: 'Jan', valor:  -180 },
  { mes: 'Fev', valor:   840 },
  { mes: 'Mar', valor: -1200 },
  { mes: 'Abr', valor:  1640 },
  { mes: 'Mai', valor:  2847 },
]

export interface BandeiraExposicao {
  bandeira: 'Mastercard' | 'Visa' | 'Elo'
  tpvDivergente: number
  saldoLiquido: number
  diffPosPct: number
  diffNegPct: number
  diffPosVal: number
  diffNegVal: number
}
export const irregularidadesPorBandeira: BandeiraExposicao[] = [
  { bandeira: 'Mastercard', tpvDivergente: 1290000, saldoLiquido:  340000, diffPosPct:  4.5, diffNegPct: -2.1, diffPosVal:  1290, diffNegVal: -740 },
  { bandeira: 'Visa',       tpvDivergente:  890000, saldoLiquido:  220000, diffPosPct:  3.8, diffNegPct: -1.9, diffPosVal:   980, diffNegVal: -540 },
  { bandeira: 'Elo',        tpvDivergente:  240000, saldoLiquido:   84000, diffPosPct:  2.4, diffNegPct: -1.2, diffPosVal:   320, diffNegVal: -180 },
]

export interface HeatmapCell { mcc: string; tier: 'Entry' | 'Mid' | 'Premium' | 'Ultra'; pct: number }
export const platinizacaoHeatmap: HeatmapCell[] = [
  // Supermercados
  { mcc: 'Supermercados', tier: 'Entry',   pct: 65 },
  { mcc: 'Supermercados', tier: 'Mid',     pct: 30 },
  { mcc: 'Supermercados', tier: 'Premium', pct: 5  },
  { mcc: 'Supermercados', tier: 'Ultra',   pct: 0  },
  // Postos
  { mcc: 'Postos',        tier: 'Entry',   pct: 58 },
  { mcc: 'Postos',        tier: 'Mid',     pct: 32 },
  { mcc: 'Postos',        tier: 'Premium', pct: 8  },
  { mcc: 'Postos',        tier: 'Ultra',   pct: 2  },
  // Farmácias
  { mcc: 'Farmácias',     tier: 'Entry',   pct: 45 },
  { mcc: 'Farmácias',     tier: 'Mid',     pct: 38 },
  { mcc: 'Farmácias',     tier: 'Premium', pct: 14 },
  { mcc: 'Farmácias',     tier: 'Ultra',   pct: 3  },
  // Restaurantes
  { mcc: 'Restaurantes',  tier: 'Entry',   pct: 32 },
  { mcc: 'Restaurantes',  tier: 'Mid',     pct: 40 },
  { mcc: 'Restaurantes',  tier: 'Premium', pct: 22 },
  { mcc: 'Restaurantes',  tier: 'Ultra',   pct: 6  },
  // Vestuário
  { mcc: 'Vestuário',     tier: 'Entry',   pct: 22 },
  { mcc: 'Vestuário',     tier: 'Mid',     pct: 38 },
  { mcc: 'Vestuário',     tier: 'Premium', pct: 28 },
  { mcc: 'Vestuário',     tier: 'Ultra',   pct: 12 },
]

export const TIER_COLORS: Record<HeatmapCell['tier'], string> = {
  Entry:   '#52C41A',   // verde — alto volume
  Mid:     '#FADB14',   // amarelo
  Premium: '#FA8C16',   // laranja
  Ultra:   '#FF4D4F',   // vermelho — baixo volume
}

export interface TopCardItc {
  rank: number
  bandeira: 'Mastercard' | 'Visa' | 'Elo' | 'Amex'
  cartao: string
  categoria: 'Entry' | 'Mid' | 'Premium' | 'Ultra'
  volume: number
  divergValor: number
  divergPct: number
  saldo: number
}
export const top10CartoesItc: TopCardItc[] = [
  { rank: 1,  bandeira: 'Visa',       cartao: 'Conta de Pagamento PJ',  categoria: 'Entry',   volume: 8910, divergValor:  240, divergPct: 4.5, saldo:  1200 },
  { rank: 2,  bandeira: 'Visa',       cartao: 'Visa Business',          categoria: 'Premium', volume: 7620, divergValor: -180, divergPct: 3.2, saldo:   840 },
  { rank: 3,  bandeira: 'Mastercard', cartao: 'Mastercard Standard',    categoria: 'Mid',     volume: 4744, divergValor:   95, divergPct: 2.8, saldo:   620 },
  { rank: 4,  bandeira: 'Mastercard', cartao: 'Gold',                   categoria: 'Mid',     volume: 4120, divergValor:  140, divergPct: 3.4, saldo:   780 },
  { rank: 5,  bandeira: 'Visa',       cartao: 'Elo Diners',             categoria: 'Premium', volume: 3890, divergValor:  -98, divergPct: 2.5, saldo:   420 },
  { rank: 6,  bandeira: 'Mastercard', cartao: 'Prepaid Mastercard',     categoria: 'Entry',   volume: 3210, divergValor:  -42, divergPct: 1.3, saldo:   220 },
  { rank: 7,  bandeira: 'Amex',       cartao: 'Amex Corporate',         categoria: 'Premium', volume: 2980, divergValor:  142, divergPct: 4.7, saldo:   980 },
  { rank: 8,  bandeira: 'Visa',       cartao: 'Visa Gold',              categoria: 'Mid',     volume: 2740, divergValor:   88, divergPct: 3.2, saldo:   460 },
  { rank: 9,  bandeira: 'Elo',        cartao: 'Elo Mais',               categoria: 'Entry',   volume: 1890, divergValor:  -64, divergPct: 3.4, saldo:   180 },
  { rank: 10, bandeira: 'Mastercard', cartao: 'Mastercard Black',       categoria: 'Ultra',   volume: 1620, divergValor:  220, divergPct: 5.1, saldo:  1140 },
]
