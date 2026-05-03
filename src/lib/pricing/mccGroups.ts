/**
 * MCC Groups — agrupamentos de Merchant Category Codes usados no modelo
 * Interchange+ para definir taxas diferenciadas por segmento.
 *
 * Mock espelhado de yby-ui feat/pricing/BrandSection.
 */

export interface MCC {
  code: string
  description: string
}

export interface MCCGroup {
  id: string
  code: string
  name: string
  description: string
  mccs: MCC[]
}

export const MCC_GROUPS: MCCGroup[] = [
  {
    id: '1',
    code: '00001',
    name: 'Fuel Group',
    description: 'Combustível',
    mccs: [
      { code: '0763', description: 'Agricultural cooperative' },
      { code: '4468', description: 'Marinas' },
      { code: '5499', description: 'Misc food stores' },
      { code: '5541', description: 'Service stations' },
      { code: '5542', description: 'Automated fuel dispensers' },
      { code: '5548', description: 'Snowmobile dealers' },
      { code: '5983', description: 'Fuel dealers' },
      { code: '9752', description: 'Government fuel' },
    ],
  },
  {
    id: '2',
    code: '00002',
    name: 'Retail Group',
    description: 'Varejo',
    mccs: [
      { code: '5311', description: 'Department stores' },
      { code: '5411', description: 'Grocery stores' },
      { code: '5651', description: 'Family clothing stores' },
      { code: '5912', description: 'Drug stores and pharmacies' },
    ],
  },
  {
    id: '3',
    code: '00003',
    name: 'Travel Group',
    description: 'Viagens',
    mccs: [
      { code: '3000', description: 'Airlines' },
      { code: '4111', description: 'Local commuter transport' },
      { code: '4411', description: 'Cruise lines' },
      { code: '7011', description: 'Lodging — hotels, motels' },
    ],
  },
]
