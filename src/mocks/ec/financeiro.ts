// Mocks do Financeiro do Estabelecimento Comercial — V0.
// Cobre Extrato, Antecipações, Liquidações e Taxas e Simulações.

// ─── Extrato ───

export interface ExtratoKpis {
  saldoAtual: number
  aReceberHoje: number
  recebimentosFuturos: number
  totalEntradas: number
  totalSaidas: number
  totalTaxas: number
  totalLiquido: number
}

export const ecExtratoKpis: ExtratoKpis = {
  saldoAtual: 200,
  aReceberHoje: 20,
  recebimentosFuturos: 20,
  totalEntradas: 200,
  totalSaidas: 20,
  totalTaxas: 20,
  totalLiquido: 20,
}

export interface ExtratoLancamento {
  id: string
  data: string
  idOperacao: string
  idTransacao: string
  forma: 'Crédito' | 'Débito' | 'PIX'
  produto: 'CP' | 'CNP'
  descricao: string
  entrada: number
  saida: number
  total: number
}

export const ecExtratoLancamentos: ExtratoLancamento[] = [
  { id: '1', data: '10/10/2025 10:00', idOperacao: '1321312312', idTransacao: '2313213131', forma: 'Crédito', produto: 'CNP', descricao: '—',                  entrada: 10,    saida: 2,    total: 8     },
  { id: '2', data: '10/10/2025 10:00', idOperacao: '2313213131', idTransacao: '2313213131', forma: 'PIX',     produto: 'CNP', descricao: 'XYZ Merchandising', entrada: 200,   saida: 10,   total: 190   },
  { id: '3', data: '10/10/2025 10:00', idOperacao: '2313213131', idTransacao: '2313213131', forma: 'Débito',  produto: 'CP',  descricao: 'Store Online Ltda', entrada: 2000,  saida: 100,  total: 1900  },
  { id: '4', data: '10/10/2025 10:00', idOperacao: '2313213131', idTransacao: '2313213131', forma: 'Crédito', produto: 'CP',  descricao: 'Calçados e Cia',    entrada: 2000,  saida: 100,  total: 1900  },
]

// ─── Antecipações ───

export interface AntecipacaoKpis {
  totalRecebiveis7Dias: number
  totalHoje: number
  noFuturo: number
}

export const ecAntecipacaoKpis: AntecipacaoKpis = {
  totalRecebiveis7Dias: 20,
  totalHoje: 20,
  noFuturo: 20,
}

/**
 * REGRAS DE ANTECIPAÇÃO (V0 EC)
 * ------------------------------------------------------------------
 * 1) Uma OPERAÇÃO de antecipação consolida várias PARCELAS antecipadas.
 * 2) A antecipação pode ser PARCIAL — pega "pedaço" do valor de uma
 *    parcela. Ex.: parcela 3/6 vale R$1.000; antecipa R$700 dela. Os
 *    R$300 restantes continuam previstos pra data original.
 * 3) Pode ser MIXED — uma operação pega 2 parcelas inteiras + 1 parcial.
 *    Ex.: alvo R$50k → pega P1 (R$20k inteira) + P2 (R$20k inteira) +
 *    P3 (R$10k de R$15k = parcial).
 * 4) A regra de valor parcial vale tanto pro EC quanto pro SUB e Adquirente.
 * 5) Visualização: linha CONSOLIDADA por operação; expand mostra cada
 *    parcela com flag de parcial quando houver.
 * ------------------------------------------------------------------
 */

export interface ParcelaAntecipada {
  /** ID da transação original (NSU) */
  transacaoId: string
  /** "X/N" — qual parcela do parcelamento */
  parcela: string
  /** Bandeira da venda original */
  bandeira: 'Visa' | 'Mastercard' | 'Elo' | 'Amex'
  /** Valor da parcela ANTES da antecipação (pode ser inteiro ou parcial) */
  valorOriginal: number
  /** Valor efetivamente antecipado (pode ser < valorOriginal se parcial) */
  valorAntecipado: number
  /** true quando valorAntecipado < valorOriginal */
  parcial: boolean
  taxa: number
  valorLiquido: number
  /** Data prevista original — quando a parcela cairia sem antecipação */
  dataPrevistaOriginal: string
}

export interface AntecipacaoOperacao {
  id: string
  dataPagamento: string
  quantidadeTransacoes: number
  valorBruto: number
  taxa: number
  valorLiquido: number
  parcelas: ParcelaAntecipada[]
}

export const ecAntecipacoes: AntecipacaoOperacao[] = [
  {
    id: 'OP-2025-001',
    dataPagamento: '10/10/2025 10:00',
    quantidadeTransacoes: 2,
    valorBruto: 10,
    taxa: 1,
    valorLiquido: 9,
    parcelas: [
      { transacaoId: '183726401', parcela: '1/1', bandeira: 'Visa',       valorOriginal: 5,  valorAntecipado: 5, parcial: false, taxa: 0.5, valorLiquido: 4.5, dataPrevistaOriginal: '15/11/2025' },
      { transacaoId: '293847562', parcela: '2/3', bandeira: 'Mastercard', valorOriginal: 5,  valorAntecipado: 5, parcial: false, taxa: 0.5, valorLiquido: 4.5, dataPrevistaOriginal: '20/11/2025' },
    ],
  },
  {
    id: 'OP-2025-002',
    dataPagamento: '10/10/2025 10:00',
    quantidadeTransacoes: 2,
    valorBruto: 200,
    taxa: 1,
    valorLiquido: 199,
    parcelas: [
      { transacaoId: '374958673', parcela: '4/12', bandeira: 'Visa', valorOriginal: 100, valorAntecipado: 100, parcial: false, taxa: 0.5, valorLiquido: 99.5, dataPrevistaOriginal: '01/12/2025' },
      { transacaoId: '374958673', parcela: '5/12', bandeira: 'Visa', valorOriginal: 100, valorAntecipado: 100, parcial: false, taxa: 0.5, valorLiquido: 99.5, dataPrevistaOriginal: '01/01/2026' },
    ],
  },
  {
    id: 'OP-2025-003',
    dataPagamento: '10/10/2025 10:00',
    quantidadeTransacoes: 2,
    valorBruto: 2000,
    taxa: 2,
    valorLiquido: 1998,
    parcelas: [
      { transacaoId: '987638643', parcela: '1/1', bandeira: 'Mastercard', valorOriginal: 1500, valorAntecipado: 1500, parcial: false, taxa: 1.5, valorLiquido: 1498.5, dataPrevistaOriginal: '12/12/2025' },
      { transacaoId: '109837229', parcela: '3/6', bandeira: 'Elo',        valorOriginal:  800, valorAntecipado:  500, parcial: true,  taxa: 0.5, valorLiquido:  499.5, dataPrevistaOriginal: '15/12/2025' },
    ],
  },
  {
    id: 'OP-2025-004',
    dataPagamento: '10/10/2025 10:00',
    quantidadeTransacoes: 3,
    valorBruto: 20000,
    taxa: 20,
    valorLiquido: 19980,
    parcelas: [
      { transacaoId: '290838372', parcela: '1/1',  bandeira: 'Elo',  valorOriginal: 8000,  valorAntecipado: 8000, parcial: false, taxa: 8,  valorLiquido: 7992,  dataPrevistaOriginal: '20/01/2026' },
      { transacaoId: '290838380', parcela: '2/4',  bandeira: 'Visa', valorOriginal: 8000,  valorAntecipado: 8000, parcial: false, taxa: 8,  valorLiquido: 7992,  dataPrevistaOriginal: '15/02/2026' },
      { transacaoId: '290838391', parcela: '3/4',  bandeira: 'Visa', valorOriginal: 6000,  valorAntecipado: 4000, parcial: true,  taxa: 4,  valorLiquido: 3996,  dataPrevistaOriginal: '15/03/2026' },
    ],
  },
]

// ─── Liquidações ───

export interface LiquidacaoKpis {
  totalEntradas: number
  totalSaidas: number
  totalTaxas: number
  totalLiquido: number
}

export const ecLiquidacaoKpis: LiquidacaoKpis = {
  totalEntradas: 200,
  totalSaidas: 20,
  totalTaxas: 20,
  totalLiquido: 20,
}

export type LiquidacaoStatus = 'Pago' | 'Crédito Vendido' | 'Pendente'

export interface LiquidacaoLancamento {
  id: string
  dataPagamento: string
  dataVenda: string
  bandeira: 'Visa' | 'Mastercard' | 'Elo' | 'Amex'
  lancamento: 'Crédito vendido' | 'Venda débito' | 'Crédito 1x' | 'Crédito 2x'
  origem: string
  nsu: string
  valorParcela: number
  taxas: number
  valorLiquido: number
  status: LiquidacaoStatus
}

export const ecLiquidacoes: LiquidacaoLancamento[] = [
  { id: 'L1', dataPagamento: '10/10/2025',       dataVenda: '10/10/2025',       bandeira: 'Visa',       lancamento: 'Crédito vendido', origem: 'Parcela 1/3', nsu: '183726402', valorParcela: 10,    taxas: 1,  valorLiquido: 0,     status: 'Crédito Vendido' },
  { id: 'L2', dataPagamento: '10/10/2025 10:00', dataVenda: '10/10/2025 10:00', bandeira: 'Visa',       lancamento: 'Crédito vendido', origem: 'Parcela 1/3', nsu: '209874928', valorParcela: 10,    taxas: 1,  valorLiquido: 10,    status: 'Pago'            },
  { id: 'L3', dataPagamento: '10/10/2025 10:00', dataVenda: '10/10/2025 10:00', bandeira: 'Mastercard', lancamento: 'Venda débito',    origem: 'Parcela 1/3', nsu: '109837229', valorParcela: 200,   taxas: 1,  valorLiquido: 200,   status: 'Pago'            },
  { id: 'L4', dataPagamento: '10/10/2025 10:00', dataVenda: '10/10/2025 10:00', bandeira: 'Mastercard', lancamento: 'Venda débito',    origem: 'Débito',      nsu: '987638643', valorParcela: 2000,  taxas: 2,  valorLiquido: 2000,  status: 'Pago'            },
  { id: 'L5', dataPagamento: '10/10/2025 10:00', dataVenda: '10/10/2025 10:00', bandeira: 'Elo',        lancamento: 'Venda débito',    origem: 'Débito',      nsu: '290838372', valorParcela: 20000, taxas: 20, valorLiquido: 20000, status: 'Pago'            },
]

// ─── Taxas e Simulações ───

export interface PrazoRecebimento {
  pagamento: string
  recebimento: string
}

export const ecPrazoRecebimento: PrazoRecebimento[] = [
  { pagamento: 'Débito',                 recebimento: 'Mesmo dia'                },
  { pagamento: 'Pix',                    recebimento: 'Mesmo dia'                },
  { pagamento: 'Crédito à vista',        recebimento: '15 dias úteis'            },
  { pagamento: 'Crédito: Parcelado loja',recebimento: '15 dias úteis (parcela única, com antecipação automática)' },
]

export interface TaxaModalidadeBandeira {
  bandeira: 'Mastercard' | 'Visa' | 'Elo' | 'Amex'
  percentText: string  // '0,90% + ITC'
}

export interface TaxaModalidadeForma {
  forma: 'PIX à vista' | 'Débito à vista' | 'Crédito Pré-Pago' | 'Crédito - 1x' | 'Crédito - 2x' | 'Crédito - 3x' | 'Crédito - 4x'
  bandeiras: TaxaModalidadeBandeira[]
}

export interface TaxaModalidade {
  id: string
  nome: string
  descricao: string
  iconKey: 'creditCard' | 'shoppingCart' | 'smartphone'
  formas: TaxaModalidadeForma[]
}

const padraoBandeiras: TaxaModalidadeBandeira[] = [
  { bandeira: 'Mastercard', percentText: '0,90% + ITC' },
  { bandeira: 'Visa',       percentText: '0,90% + ITC' },
  { bandeira: 'Elo',        percentText: '0,90% + ITC' },
  { bandeira: 'Amex',       percentText: '0,90% + ITC' },
]

export const ecTaxasModalidades: TaxaModalidade[] = [
  {
    id: 'cp',
    nome: 'Cartão Presente - CP',
    descricao: 'Configuração das taxas globais para o uso de cartão presente',
    iconKey: 'creditCard',
    formas: [
      { forma: 'PIX à vista',       bandeiras: [{ bandeira: 'Mastercard', percentText: '0,90%' }, { bandeira: 'Visa', percentText: '' }, { bandeira: 'Elo', percentText: '' }, { bandeira: 'Amex', percentText: '' }] },
      { forma: 'Débito à vista',    bandeiras: padraoBandeiras },
      { forma: 'Crédito Pré-Pago',  bandeiras: padraoBandeiras },
      { forma: 'Crédito - 1x',      bandeiras: padraoBandeiras },
      { forma: 'Crédito - 2x',      bandeiras: padraoBandeiras },
      { forma: 'Crédito - 3x',      bandeiras: padraoBandeiras },
      { forma: 'Crédito - 4x',      bandeiras: padraoBandeiras },
    ],
  },
]
