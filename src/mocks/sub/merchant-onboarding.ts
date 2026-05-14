// src/mocks/sub/merchant-onboarding.ts
// Mocks do fluxo de Onboarding de Estabelecimento Comercial (Sub-adquirente).
// Listas usadas nos AppSelects do Step 1 (CNAE, MCC, faturamento, bancos)
// e mock de busca de CEP que devolve estado/cidade.

export interface Option {
  value: string
  label: string
}

export interface Banco extends Option {
  /** Código ISPB-friendly só pra dar identidade no mock — não é o ISPB real. */
  codigo: string
}

export interface CepLookupResult {
  estado: string
  cidade: string
  endereco: string
}

/** 10 CNAEs comuns em comércio/serviços que costumam onboardar em sub-adquirentes. */
export const CNAES: Option[] = [
  { value: '4721-1/02', label: '4721-1/02 — Padaria e confeitaria com predominância de revenda' },
  { value: '4781-4/00', label: '4781-4/00 — Comércio varejista de artigos do vestuário e acessórios' },
  { value: '5611-2/01', label: '5611-2/01 — Restaurantes e similares' },
  { value: '5611-2/03', label: '5611-2/03 — Lanchonetes, casas de chá, de sucos e similares' },
  { value: '4712-1/00', label: '4712-1/00 — Comércio varejista de mercadorias em geral (minimercados)' },
  { value: '9602-5/01', label: '9602-5/01 — Cabeleireiros, manicure e pedicure' },
  { value: '4744-0/01', label: '4744-0/01 — Comércio varejista de ferragens e ferramentas' },
  { value: '4763-6/02', label: '4763-6/02 — Comércio varejista de artigos esportivos' },
  { value: '4789-0/05', label: '4789-0/05 — Comércio varejista de produtos saudáveis e naturais' },
  { value: '8650-0/01', label: '8650-0/01 — Atividades de profissionais da nutrição' },
]

/** 10 MCCs comuns. Labels descrevem o ramo em PT-BR. */
export const MCCS: Option[] = [
  { value: '5411', label: '5411 — Supermercados e mercearias' },
  { value: '5812', label: '5812 — Restaurantes e refeições' },
  { value: '5814', label: '5814 — Lanchonetes / fast food' },
  { value: '5912', label: '5912 — Farmácias e drogarias' },
  { value: '5651', label: '5651 — Vestuário em geral' },
  { value: '5732', label: '5732 — Eletrônicos' },
  { value: '7230', label: '7230 — Salões de beleza e barbearia' },
  { value: '5999', label: '5999 — Varejo diversificado' },
  { value: '5251', label: '5251 — Ferragens e materiais de construção' },
  { value: '5941', label: '5941 — Artigos esportivos' },
]

/** Faixas de faturamento mensal estimado (declaração do EC no cadastro). */
export const FATURAMENTOS: Option[] = [
  { value: 'ate-10k',     label: 'Até R$ 10.000' },
  { value: '10k-50k',     label: 'R$ 10.001 a R$ 50.000' },
  { value: '50k-100k',    label: 'R$ 50.001 a R$ 100.000' },
  { value: '100k-300k',   label: 'R$ 100.001 a R$ 300.000' },
  { value: '300k-1m',     label: 'R$ 300.001 a R$ 1.000.000' },
  { value: '1m-5m',       label: 'R$ 1.000.001 a R$ 5.000.000' },
  { value: 'acima-5m',    label: 'Acima de R$ 5.000.000' },
]

/** Adquirentes credenciadores disponíveis para vínculo no Onboarding EC. */
export const ADQUIRENTES: Option[] = [
  { value: 'cielo',     label: 'Cielo'     },
  { value: 'rede',      label: 'Rede'      },
  { value: 'stone',     label: 'Stone'     },
  { value: 'getnet',    label: 'Getnet'    },
  { value: 'pagseguro', label: 'PagSeguro' },
]

/** Bancos atendidos pelo recebimento. Códigos COMPE para referência. */
export const BANCOS: Banco[] = [
  { value: 'itau',      label: 'Itaú Unibanco',     codigo: '341' },
  { value: 'bradesco',  label: 'Bradesco',          codigo: '237' },
  { value: 'santander', label: 'Santander',         codigo: '033' },
  { value: 'bb',        label: 'Banco do Brasil',   codigo: '001' },
  { value: 'caixa',     label: 'Caixa Econômica',   codigo: '104' },
  { value: 'nubank',    label: 'Nubank',            codigo: '260' },
  { value: 'inter',     label: 'Banco Inter',       codigo: '077' },
]

/** Estados (UF) — preenchidos pelo CEP no mock; também aceitam edição manual. */
export const ESTADOS: Option[] = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

/** Cidades por UF — subset por enquanto. Suficiente pra validar o fluxo. */
export const CIDADES_POR_UF: Record<string, Option[]> = {
  SP: [
    { value: 'sao-paulo',       label: 'São Paulo' },
    { value: 'campinas',        label: 'Campinas' },
    { value: 'santos',          label: 'Santos' },
    { value: 'sorocaba',        label: 'Sorocaba' },
    { value: 'ribeirao-preto',  label: 'Ribeirão Preto' },
    { value: 'sao-jose-campos', label: 'São José dos Campos' },
  ],
  RJ: [
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
    { value: 'niteroi',        label: 'Niterói' },
    { value: 'petropolis',     label: 'Petrópolis' },
    { value: 'nova-iguacu',    label: 'Nova Iguaçu' },
  ],
  MG: [
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
    { value: 'uberlandia',     label: 'Uberlândia' },
    { value: 'contagem',       label: 'Contagem' },
    { value: 'juiz-de-fora',   label: 'Juiz de Fora' },
  ],
  PR: [
    { value: 'curitiba',       label: 'Curitiba' },
    { value: 'londrina',       label: 'Londrina' },
    { value: 'maringa',        label: 'Maringá' },
  ],
  RS: [
    { value: 'porto-alegre',   label: 'Porto Alegre' },
    { value: 'caxias-do-sul',  label: 'Caxias do Sul' },
    { value: 'pelotas',        label: 'Pelotas' },
  ],
  SC: [
    { value: 'florianopolis',  label: 'Florianópolis' },
    { value: 'joinville',      label: 'Joinville' },
    { value: 'blumenau',       label: 'Blumenau' },
  ],
}

/** Faixas-prefixo de CEP usadas para inferir UF no mock. Não é IBGE, é didático. */
const CEP_PREFIX_TO_UF: Array<{ from: number; to: number; uf: string; defaultCity: string; sample: string }> = [
  { from: 1000,  to: 19999, uf: 'SP', defaultCity: 'sao-paulo',      sample: 'Av. Paulista' },
  { from: 20000, to: 28999, uf: 'RJ', defaultCity: 'rio-de-janeiro', sample: 'Av. Atlântica' },
  { from: 29000, to: 29999, uf: 'ES', defaultCity: '',               sample: 'Av. Beira-Mar' },
  { from: 30000, to: 39999, uf: 'MG', defaultCity: 'belo-horizonte', sample: 'Av. Afonso Pena' },
  { from: 80000, to: 87999, uf: 'PR', defaultCity: 'curitiba',       sample: 'Rua XV de Novembro' },
  { from: 88000, to: 89999, uf: 'SC', defaultCity: 'florianopolis',  sample: 'Av. Beira-Mar Norte' },
  { from: 90000, to: 99999, uf: 'RS', defaultCity: 'porto-alegre',   sample: 'Av. Ipiranga' },
]

/**
 * Mock de busca de CEP — recebe string só dígitos (8) e devolve UF+cidade.
 * Faz delay de 800ms simulando latência de rede.
 */
export function lookupCep(cep: string): Promise<CepLookupResult | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const digits = cep.replace(/\D/g, '')
      if (digits.length !== 8) {
        resolve(null)
        return
      }
      const prefix = parseInt(digits.slice(0, 5), 10)
      const match = CEP_PREFIX_TO_UF.find((r) => prefix >= r.from && prefix <= r.to)
      if (!match) {
        resolve(null)
        return
      }
      resolve({
        estado: match.uf,
        cidade: match.defaultCity,
        endereco: match.sample,
      })
    }, 800)
  })
}
