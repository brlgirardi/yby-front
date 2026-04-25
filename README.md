# Yby Front — Backoffice Fintech (Sub-adquirente)

Interface de gestão para sub-adquirentes da plataforma Tupi Fintech (OBN). Cobre agenda de recebíveis, chargebacks, merchants, financeiro e operações de adquirência.

---

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 14 |
| UI Base | Ant Design | **6** |
| State | Zustand | 5 |
| Icons | Lucide React + SVGs inline | 1.x |
| Tipagem | TypeScript | 6 |
| Package Manager | pnpm | ≥ 9 |
| Design System | Storybook (Vite) | 8 |
| Estilo | Inline styles + Tailwind (utilitários) | — |

> **Nota:** este projeto é 100% frontend com mock data. Não há backend ou banco de dados acoplado — os dados são estáticos nos próprios arquivos de página para validação de produto.

---

## Pré-requisitos

- Node.js ≥ 18 (recomendado: LTS v20+)
- pnpm ≥ 9 (`npm install -g pnpm`)

---

## Rodando localmente

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento (porta 3000)
pnpm dev
```

Acesse `http://localhost:3000`.

---

## Storybook — Design System

O Storybook é a **fonte de verdade do design system**. Todos os componentes compartilhados estão documentados lá com variantes, props e exemplos de uso.

```bash
pnpm storybook   # http://localhost:6006
```

### Componentes documentados

| Story | Componente | Descrição |
|---|---|---|
| `Design System/Atoms/Tag` | `src/components/shared/Tag.tsx` | Badge de status semântico com ícone SVG |
| `Design System/Atoms/Input` | `src/components/shared/Input.tsx` | Input com prefix/suffix icon e estados de foco/erro |
| `Design System/Organisms/DataTable` | `src/components/ui/DataTable.tsx` | Tabela com toolbar, filtros pill, busca, período e paginação |
| `Design System/Organisms/AppSelect` | `src/components/ui/AppSelect.tsx` | Wrapper padronizado do Select do Ant Design |
| `Patterns/WhiteCard` | `src/stories/WhiteCardPattern.stories.tsx` | Padrão de seção com card branco, header + divider + body |
| `KpiCard` | `src/components/ui/KpiCard.tsx` | Cards de métricas no topo das páginas |

---

## Design System — Padrões principais

### `<DataTable>` — padrão único para listagens

O componente `<DataTable>` entrega:

- Card branco com `border: 1px solid rgba(0,0,0,0.06)`
- Header com título + `borderBottom: 1px solid #f0f0f0`
- Toolbar com busca, FilterPills, PeriodPill, Exportar e filtro avançado
- Paginação PT-BR integrada

```tsx
import DataTable, { PERIOD_OPTIONS } from '@/components/ui/DataTable'

<DataTable
  title="Nome da seção"
  titleExtra={<Button>Ação</Button>}
  columns={columns}
  dataSource={data}
  rowKey="id"
  // Busca
  searchPlaceholder="Pesquisar..."
  searchValue={search}
  onSearch={setSearch}
  // Filtros pill (multi-select dropdown)
  filters={[
    { label: 'Status', options: [...], value: statusFilter, onChange: setStatusFilter }
  ]}
  // Filtro de período (single-select dropdown com ícone de calendário)
  periodOptions={PERIOD_OPTIONS}   // Hoje / Esta semana / Este mês / Mês anterior / Últimos 3 meses
  defaultPeriod="hoje"             // valor inicial (não controlado) — use periodValue para controlado
  // Ações
  onExport={() => {}}
  onAdvancedFilter={() => {}}
  // Tabela
  pageSize={10}
  showPagination={true}
/>
```

**Nunca** crie um `<div>` branco manual em volta de `<table>` — use sempre `<DataTable>`.

### `<Tag>` — badges de status semântico

```tsx
import Tag from '@/components/shared/Tag'

<Tag status="Liquidado" />              // ícone + texto (default)
<Tag status="Pendente" showIcon={false} /> // só texto
<Tag status="Antecipado" label="Desc. antecip." /> // label customizado
```

**Statuses disponíveis e seu grupo semântico:**

| Grupo | Statuses | Cor |
|---|---|---|
| Sucesso | Aprovado, Pago, Ativo, Liquidado, Quitado, Recuperado | Verde |
| Aviso | Pendente, Em aberto, A recuperar, Antecipado, Suspenso | Amarelo/Laranja |
| Erro | Recusado, Chargeback, Erro | Vermelho |
| Neutro | Cancelado, Inativo | Cinza |
| Info | Em análise, Info, Previsto | Azul |

### `<Input>` — input com ícone

```tsx
import Input from '@/components/shared/Input'

<Input
  prefix="search"         // icon name do Icon component (left)
  suffix="eye"            // icon name (right, clicável via onSuffixClick)
  placeholder="Buscar..."
  label="Campo"
  error="Mensagem de erro"
  hint="Texto auxiliar"
/>
```

### WhiteCard (seções sem tabela)

```tsx
<div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
  {/* Header com divider — obrigatório quando há título */}
  <div style={{ padding: '16px 21px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ fontSize: 16, fontWeight: 600 }}>Título</span>
  </div>
  {/* Body */}
  <div style={{ padding: '16px 21px' }}>
    {/* conteúdo livre */}
  </div>
</div>
```

> Não usar `borderBottom` no título de `<DataTable>` — o componente já gerencia isso internamente.

### Tokens de cor

| Token | Valor | Uso |
|---|---|---|
| Primary | `#1890FF` | CTAs, links, selecionado |
| Success | `#52c41a` | Valores positivos, status Ativo/Liquidado |
| Warning | `#fa8c16` | Antecipações, alertas |
| Danger | `#ff4d4f` | Valores negativos, erros |
| Text primary | `rgba(0,0,0,0.85)` | Texto principal |
| Text secondary | `rgba(0,0,0,0.65)` | Labels, dados secundários |
| Text muted | `rgba(0,0,0,0.45)` | Placeholders, desabilitados |
| Border card | `rgba(0,0,0,0.06)` | Borda de cards |
| Divider | `#f0f0f0` | Separadores internos |
| Background | `#F2F4F8` | Fundo da aplicação |
| Header table | `#fafafa` | Cabeçalho de tabelas |

---

## Estrutura do projeto

```
src/
├── app/
│   └── (app)/
│       ├── agenda/         # Agenda de recebíveis
│       │                   #   → calendário (bruto/repasse/líquido, por adquirente)
│       │                   #   → parcelas detalhadas, por lote, antecipações, funding, pagamentos
│       ├── merchants/      # Lista e detalhe de merchants (ECs)
│       ├── financial/      # Financeiro
│       │                   #   → extrato, liquidações (eventos + domicílio), antecipações a ECs
│       ├── charges/        # Cobranças / chargebacks
│       ├── reconciliation/ # Conciliação
│       ├── pricing/        # Custos & Pricing (MDR por arranjo/bandeira)
│       ├── users/          # Gestão de usuários
│       └── settings/       # Configurações
├── components/
│   ├── shared/             # Átomos: PageHeader, Icon, Tag, BrandLogo, Input
│   └── ui/                 # Organismos: DataTable, KpiCard, AppSelect
├── store/
│   └── nav.store.ts        # Estado global de navegação (Zustand)
└── stories/                # Stories extras (WhiteCardPattern, etc.)
```

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Dev server (porta 3000) |
| `pnpm build` | Build de produção |
| `pnpm start` | Serve o build de produção |
| `pnpm lint` | ESLint |
| `pnpm storybook` | Storybook dev (porta 6006) |
| `pnpm build-storybook` | Build estático do Storybook |

---

## Contexto de negócio

**Domínio:** Sub-adquirência / Adquirência  
**Empresa:** Tupi Fintech (OBN)  
**Plataforma:** YBY — backoffice operacional para gestão de recebíveis, merchants e chargebacks

### Conceitos-chave

| Conceito | Definição |
|---|---|
| **MDR** | Taxa cobrada do lojista por transação (%) |
| **Agenda de recebíveis** | Calendário de URs (Unidades de Recebíveis) — bruto vs líquido vs repasse, por adquirente |
| **Antecipação** | Adiantamento de recebíveis futuros com deságio (taxa a.m.) |
| **Funding / Liquidação** | Evento de crédito do adquirente na conta do sub-adquirente |
| **Chargeback** | Contestação de transação pelo portador do cartão |
| **Split** | Divisão automática de pagamentos entre marketplace e lojistas |
| **Gravame / Oneração** | Garantia registrada em registradora (CIP/CERC/TAG) vinculada a antecipação |
| **Rolling reserve** | Reserva operacional retida pelo sub (% do volume) como garantia |
| **Registradora** | Entidade que registra URs e gravames (CIP, CERC, TAG — Resolução BCB 150/2021) |

### Fluxo financeiro resumido

```
Portador paga → Adquirente liquida lote → Sub recebe (bruto - MDR)
                                        → Sub repassa EC (bruto - MDR sub)
                                        → Sub retém margem (~7% do bruto)
                                        → Antecipação desconta do próximo crédito
```

---

## Ambiente de desenvolvimento recomendado

- **Editor:** VS Code
- **Extensões:** ESLint, Prettier, Tailwind CSS IntelliSense
- **Node:** LTS v20+
- **Package manager:** pnpm — **não use npm ou yarn**
