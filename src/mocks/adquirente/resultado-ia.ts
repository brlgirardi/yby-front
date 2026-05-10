// Mocks Resultado IA — saída consolidada dos 2 fluxos (Pricing + Platinização).

export interface SetorClassificacao {
  label: string
  icon: string
  rating: 1 | 2 | 3 | 4 | 5
  hint: string
}

export const classificacaoSetor: SetorClassificacao[] = [
  { label: 'Contexto Habitacional', icon: 'shoppingCart', rating: 3, hint: 'Região com renda média alta, perfil residencial estabelecido.' },
  { label: 'Infraestrutura',        icon: 'landmark',     rating: 2, hint: 'Acesso a transporte público regular, comércio fragmentado.' },
  { label: 'Educação',              icon: 'sparkles',     rating: 2, hint: 'Escolas públicas e particulares, sem polo universitário próximo.' },
  { label: 'Renda',                 icon: 'creditCard',   rating: 3, hint: 'Faixa de renda 5 (classe média), poder de compra estável.' },
  { label: 'Engajamento Local',     icon: 'trendingUp',   rating: 1, hint: 'Baixa atividade digital observada, baixo NPS estimado.' },
]

export interface ImagemAvaliada {
  label: string
  rating: 1 | 2 | 3 | 4 | 5
  hint: string
}

export const avaliacaoImagens: ImagemAvaliada[] = [
  { label: 'Fachada',                  rating: 2, hint: 'Identidade visual modesta, sinalização discreta.' },
  { label: 'Interior',                 rating: 1, hint: 'Layout funcional, baixa sofisticação de exposição.' },
  { label: 'Tabela de Preço e Produtos', rating: 2, hint: 'Mix de produtos básico/intermediário, ticket médio R$ 78.' },
]

export interface TaxaAgregada {
  modalidade: string
  custoBase: number
  margemSugerida: number
  hintIa: string
}

export const taxasAgregadas: TaxaAgregada[] = [
  { modalidade: 'Débito',          custoBase: 0.42, margemSugerida: 0.15, hintIa: 'Margem otimizada pela IA' },
  { modalidade: 'PIX',             custoBase: 0.50, margemSugerida: 0.30, hintIa: 'Margem otimizada pela IA' },
  { modalidade: 'Crédito 1× a 6×', custoBase: 1.47, margemSugerida: 0.30, hintIa: 'Margem otimizada pela IA' },
  { modalidade: 'Crédito 7× a 12×',custoBase: 1.87, margemSugerida: 0.40, hintIa: 'Margem otimizada pela IA' },
  { modalidade: 'Crédito 12×+',    custoBase: 3.45, margemSugerida: 0.30, hintIa: 'Margem otimizada pela IA' },
]

export interface TaxaPorBandeiraCelula {
  custo: number
  margem: number
}
export type BandeiraTaxa = 'Mastercard' | 'Visa' | 'Elo' | 'Amex'
export interface TaxaPorBandeiraLinha {
  modalidade: string
  bandeiras: Record<BandeiraTaxa, TaxaPorBandeiraCelula>
}

export const taxasPorBandeira: TaxaPorBandeiraLinha[] = [
  {
    modalidade: 'Débito',
    bandeiras: {
      Mastercard: { custo: 0.42, margem: 0.20 },
      Visa:       { custo: 0.45, margem: 0.18 },
      Elo:        { custo: 0.48, margem: 0.20 },
      Amex:       { custo: 0.62, margem: 0.30 },
    },
  },
  {
    modalidade: 'PIX',
    bandeiras: {
      Mastercard: { custo: 0.50, margem: 0.30 },
      Visa:       { custo: 0.50, margem: 0.30 },
      Elo:        { custo: 0.50, margem: 0.30 },
      Amex:       { custo: 0.50, margem: 0.30 },
    },
  },
  {
    modalidade: 'Crédito 1× a 6×',
    bandeiras: {
      Mastercard: { custo: 1.47, margem: 0.30 },
      Visa:       { custo: 1.51, margem: 0.32 },
      Elo:        { custo: 1.62, margem: 0.35 },
      Amex:       { custo: 2.10, margem: 0.45 },
    },
  },
  {
    modalidade: 'Crédito 7× a 12×',
    bandeiras: {
      Mastercard: { custo: 1.87, margem: 0.40 },
      Visa:       { custo: 1.92, margem: 0.42 },
      Elo:        { custo: 2.05, margem: 0.45 },
      Amex:       { custo: 2.65, margem: 0.55 },
    },
  },
  {
    modalidade: 'Crédito 12×+',
    bandeiras: {
      Mastercard: { custo: 3.45, margem: 0.30 },
      Visa:       { custo: 3.62, margem: 0.32 },
      Elo:        { custo: 3.78, margem: 0.34 },
      Amex:       { custo: 4.20, margem: 0.45 },
    },
  },
]

export interface DadosEstabelecimento {
  cnpj: string
  razaoSocial: string
  nomeEc: string
  cnae: string
  endereco: string
  cep: string
  cidade: string
  estado: string
  volumeMensal: string
  tpvEstimado: string
}

export const dadosEstabelecimentoMock: DadosEstabelecimento = {
  cnpj:         '12.345.678/0001-90',
  razaoSocial:  'EMPRESA EXEMPLO LTDA',
  nomeEc:       'Loja Matriz',
  cnae:         '47.11-3-02 — Comércio varejista de mercadorias em geral',
  endereco:     'Rua Exemplo, 123 — Centro',
  cep:          '01310-100',
  cidade:       'São Paulo',
  estado:       'SP',
  volumeMensal: 'R$ 50.000 — R$ 200.000',
  tpvEstimado:  'R$ 96.500/mês',
}

export const VOLUME_OPTIONS = [
  { value: 'ate_10k',     label: 'Até R$ 10.000' },
  { value: '10k_50k',     label: 'R$ 10.000 — R$ 50.000' },
  { value: '50k_200k',    label: 'R$ 50.000 — R$ 200.000' },
  { value: 'acima_200k',  label: 'Acima de R$ 200.000' },
]

// Score de platinização (mock fixo na demo)
export const scoreMock = 87

// Insights estratégicos — recomendações IA (sales enablement do briefing).
export interface Insight { titulo: string; descricao: string; icon: string }
export const insightsEstrategicos: Insight[] = [
  { titulo: 'Alto potencial para MDR competitivo', descricao: 'Perfil compatível com programas de desconto regionais — explorar negociação de pricing diferenciado.', icon: 'trendingUp' },
  { titulo: 'Segmento premium identificado',        descricao: 'Ticket médio elevado e mix consistente. Recomendado portfolio com benefícios expandidos.',        icon: 'sparkles'   },
  { titulo: 'Oportunidade de antecipação',          descricao: 'Volume estável projeta uso recorrente de antecipação automática — proposta de longo prazo viável.', icon: 'creditCard' },
  { titulo: 'Bandeira Mastercard dominante',        descricao: 'Mastercard concentra 68% do volume — estruturar incentivos específicos pra essa bandeira.',        icon: 'zap'        },
]

// Recomendações de carteira — exclusivas do fluxo "Análise de Platinização".
// Foco: upsell, churn risk, expansão. Diferente das taxas (que são do fluxo Pricing).
export interface RecomendacaoCarteira {
  tipo: 'upsell' | 'risco' | 'expansao' | 'fidelizacao'
  titulo: string
  descricao: string
  acao: string
  icon: string
  tone: 'success' | 'warning' | 'info'
}
export const recomendacoesCarteira: RecomendacaoCarteira[] = [
  {
    tipo:      'upsell',
    titulo:    'Top oportunidade de upsell',
    descricao: 'Volume e ticket médio do EC compatíveis com produtos premium (cartão Black, antecipação automática, terminais smart). Estimativa de uplift: +18% em receita por EC.',
    acao:      'Abrir proposta premium',
    icon:      'trendingUp',
    tone:      'success',
  },
  {
    tipo:      'risco',
    titulo:    'Risco de churn moderado',
    descricao: 'Padrão de queda de 12% no TPV nos últimos 60 dias. Recomenda-se contato proativo do gerente de conta antes do próximo ciclo de fatura.',
    acao:      'Agendar contato',
    icon:      'alertTriangle',
    tone:      'warning',
  },
  {
    tipo:      'expansao',
    titulo:    'Potencial multiunidade',
    descricao: 'CNAE e estrutura indicam grupo com mais de uma loja. Cross-check Receita Federal aponta 3 CNPJs relacionados — oportunidade de portfolio integrado.',
    acao:      'Ver CNPJs relacionados',
    icon:      'landmark',
    tone:      'info',
  },
  {
    tipo:      'fidelizacao',
    titulo:    'Fidelização via antecipação',
    descricao: 'Volume estável projeta uso recorrente de antecipação automática. Ofertar plano fidelidade com taxa progressiva reduz fricção competitiva.',
    acao:      'Simular plano fidelidade',
    icon:      'sparkles',
    tone:      'success',
  },
]

// Etapas do loading (texto rotativo, "Etapa X de N")
export const LOADING_STEPS = [
  'Identificando perfil comercial...',
  'Analisando vizinhança e MCC...',
  'Inferindo potencial de platinização...',
  'Calibrando margens por bandeira...',
  'Consolidando recomendações estratégicas...',
  'Finalizando relatório...',
]
