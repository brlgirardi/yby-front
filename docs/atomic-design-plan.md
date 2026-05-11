# Plano de adoção do Atomic Design no Yby Front

Este documento descreve as fases de adoção da metodologia Atomic Design (Brad Frost, 2016) e o uso do Storybook como verdade única do design system do Yby. A Fase 1 já foi entregue: documentação inicial em `src/stories/foundations/` (AtomicDesign, Regras de Negócio — Status & Tags, Logos). As fases seguintes estão descritas abaixo com escopo, motivação e estimativa.

> Princípio de classificação: ver `src/stories/foundations/AtomicDesign.mdx`. Regras de inclusão são objetivas (composição interna, dependências, função) — não interpretação.

---

## Fase 1 — Foundations (concluída)

**Escopo:**

- `src/stories/foundations/AtomicDesign.mdx` — documentação da metodologia + classificação completa dos componentes existentes (átomos, moléculas, organismos, templates, páginas).
- `src/stories/foundations/RegrasDeNegocio.mdx` — catálogo de status/tags com tons semânticos, telas onde aparecem e inconsistências detectadas.
- `src/stories/foundations/Logos.stories.tsx` — grid interativo com bandeiras, adquirentes, registradoras e marca Tupi/Yby em 5 tamanhos comuns.

**Pré-requisito de execução:** o `.storybook/main.ts` atual carrega apenas `*.stories.@(ts|tsx)`. Para que os MDX da Fase 1 sejam renderizados, é preciso adicionar `'../src/**/*.mdx'` ao array `stories`. Isso é uma mudança de uma linha que ainda precisa ser aplicada — está fora do escopo da Fase 1 por restrição de paths permitidos na tarefa.

---

## Fase 2 — Reorganização física por camada

### Por que

A estrutura atual mistura organização **por domínio** (`shared`, `ui`, `layout`, `agenda`, `chargeback`, `conciliation`, `financial`, `interchange`, `pricing`, `auth`, `charts`) com semântica de camadas Atomic Design. O resultado é que átomos puros (`Tag`, `Badge`, `Button`) vivem em `shared/` junto com moléculas (`PageHeader`, `EmptyState`) e organismos (`Drawer`). Reorganizar por camada deixa explícito o nível de cada peça e reduz risco de regressão ao mudar átomos.

### Escopo

Criar nova hierarquia dentro de `src/components/` mantendo o prefixo `@/components/` (evita migração massiva de imports):

```
src/components/
  atoms/          # átomos hoje em shared/, conciliation/, layout/
  molecules/      # moléculas hoje em shared/, ui/, conciliation/, pricing/
  organisms/      # organismos hoje em chargeback/, auth/, conciliation/, pricing/, agenda/, financial/, charts/, layout/
  templates/      # AppShell, ScreenRouter, SidebarRouter, AuthGuard
```

### Movimentações concretas

**Para `src/components/atoms/`:**

- `shared/Tag.tsx` → `atoms/Tag.tsx`
- `shared/Badge.tsx` → `atoms/Badge.tsx`
- `shared/Button.tsx` → `atoms/Button.tsx`
- `shared/Input.tsx` → `atoms/Input.tsx`
- `shared/Icon.tsx` → `atoms/Icon.tsx`
- `shared/BrandLogo.tsx` → `atoms/BrandLogo.tsx`
- `shared/Loading.tsx` → `atoms/Loading.tsx`
- `shared/Skeleton.tsx` → `atoms/Skeleton.tsx`
- `shared/Sparkline.tsx` → `atoms/Sparkline.tsx`
- `shared/Tooltip.tsx` → `atoms/Tooltip.tsx`
- `shared/ShiftInput.tsx` → `atoms/ShiftInput.tsx`
- `shared/ChannelChip.tsx` → `atoms/ChannelChip.tsx`
- `conciliation/ConciliationBadge.tsx` → `atoms/ConciliationBadge.tsx`
- `layout/PersonaBadge.tsx` → `atoms/PersonaBadge.tsx`

**Para `src/components/molecules/`:**

- `shared/PageHeader.tsx` + `ui/PageHeader.tsx` → consolidar em `molecules/PageHeader.tsx` (decisão de qual implementação manter exige diff em Pixel review).
- `ui/AppSelect.tsx` → `molecules/AppSelect.tsx`
- `ui/KpiCard.tsx` → `molecules/KpiCard.tsx`
- `shared/CardSection.tsx` → `molecules/CardSection.tsx`
- `shared/AccordionCard.tsx` → `molecules/AccordionCard.tsx`
- `shared/EmptyState.tsx` → `molecules/EmptyState.tsx`
- `shared/Drawer.tsx` → `molecules/Drawer.tsx`
- `conciliation/DateScroller.tsx` → `molecules/DateScroller.tsx`
- `conciliation/Metric.tsx` → `molecules/Metric.tsx`
- `pricing/BoxPrice.tsx` → `molecules/BoxPrice.tsx`
- `pricing/TableTabsBar.tsx` → `molecules/TableTabsBar.tsx`

**Para `src/components/organisms/`:**

- `ui/DataTable.tsx` → `organisms/DataTable.tsx`
- `chargeback/ChargebackForm.tsx` → `organisms/ChargebackForm.tsx`
- todos os `auth/*Step.tsx` e `auth/LoginForm.tsx` → `organisms/auth/*`
- `conciliation/{TransactionsTable, BrandSummaryCard, AcquirerSummaryCard, BrandDetail, InterchangeDropdownTable, InterchangeDetailModal, ConciliationOverview, ConciliationSkeleton}.tsx` → `organisms/conciliation/*`
- `interchange/InterchangeRateCard.tsx` → `organisms/InterchangeRateCard.tsx`
- `pricing/{AcquirerPriceCard, AcquirerCostCard, BrandSection, BrandPriceSection, ChannelSection, ChannelPriceSection, AcquirerSection, AcquirerPriceSection, MethodTable, PricingSkeleton}.tsx` → `organisms/pricing/*`
- `agenda/{AgendaCalendar, AgendaFunding, AgendaInstallments, AgendaAdvances, AgendaLots, AgendaPayments}.tsx` → `organisms/agenda/*`
- `financial/{SettlementsTab, StatementTab, AdvancesTab}.tsx` → `organisms/financial/*`
- `charts/index.tsx` → `organisms/charts/index.tsx`
- `layout/{GlobalHeader, Sidebar, EcSidebar, AqSidebar, SubV1Sidebar, ChangelogModal, PersonaSwitcher}.tsx` → `organisms/layout/*`

**Para `src/components/templates/`:**

- `layout/AppShell.tsx` → `templates/AppShell.tsx`
- `layout/ScreenRouter.tsx` → `templates/ScreenRouter.tsx`
- `layout/SidebarRouter.tsx` → `templates/SidebarRouter.tsx`
- `layout/AuthGuard.tsx` → `templates/AuthGuard.tsx`

### Esforço estimado

- **Movimentação de arquivos:** 1 dia de engenharia. Usar `git mv` para preservar histórico.
- **Atualização de imports:** 1 dia. Codemod com `jscodeshift` ou regex find/replace ciente do alias `@/components/`.
- **Atualização de stories existentes:** 0,5 dia. As stories estão acopladas aos paths; mover stories junto com componentes resolve.
- **Smoke test + revisão visual:** 0,5 dia. Storybook + dev server.
- **Total:** ~3 dias de uma pessoa, ou ~1,5 dia em par.

### Critérios de done

- Storybook abre sem erro em todas as stories.
- `npx tsc --noEmit` = 0 erros.
- `pnpm build` passa.
- Cada feature em `src/features/` e cada rota em `src/app/` continua renderizando.
- Documentação `AtomicDesign.mdx` atualizada para refletir os novos caminhos.

### Riscos

- **Diff gigante** dificulta code review. Mitigação: PR por camada (1 PR para átomos, 1 para moléculas, etc.).
- **Conflitos com features em andamento.** Mitigação: agendar janela de freeze de 1 sprint.
- **Convenção dupla `shared/` vs `atoms/`** durante transição. Mitigação: completar fase em uma única semana, evitando duas verdades.

---

## Fase 3 — Componente `<LogoUpload />` com normalização

### Por que

Hoje todos os logos vivem hard-coded em `BrandLogo.tsx` como SVG inline. Adicionar uma nova bandeira, adquirente ou sub-adquirente exige editar código e PR. O time precisa de um mecanismo onde:

1. Bruno (ou outro operador) faz upload de SVG ou PNG via UI.
2. O componente normaliza o arquivo para o slot padrão (proporção 36×24 com fundo branco e borda sutil, padrão atual do `BrandLogo`).
3. O resultado é persistido (próxima fase de back) e indexado por categoria.

### Escopo do componente

```tsx
type LogoUploadProps = {
  category: 'bandeiras' | 'adquirentes' | 'sub-adquirentes' | 'registradoras' | 'produto'
  onConfirm: (logo: { name: string; svg: string; previewUrl: string }) => Promise<void>
  maxBytes?: number          // default 200KB
  acceptedTypes?: string[]   // default ['image/svg+xml', 'image/png']
}
```

**Fluxo:**

1. Drop-zone (drag and drop + click to browse) — usa `<input type="file" />` semântico, com label associado.
2. Validação síncrona: tipo MIME, tamanho, dimensões mínimas.
3. **Normalização:**
   - SVG: parse, extrair `viewBox`, calcular escala para caber em 36×24 mantendo proporção. Centralizar via `<svg viewBox="0 0 36 24"><g transform="translate(...)scale(...)">{original}</g></svg>`. Sanitizar (remover `<script>`, eventos `on*`, URLs externas) com `DOMPurify`.
   - PNG: redimensionar com `<canvas>` para 72×48 (2× retina), letterboxing branco para manter proporção. Resultado convertido para data URI.
4. Preview lado a lado: original × normalizado × renderizado no card padrão `BrandLogo`.
5. Confirmação dispara `onConfirm` com o SVG/PNG já normalizado.

### Decisões abertas

- **Persistência:** localStorage para validação rápida, ou um endpoint na API real? Definir antes da Fase 3.
- **Sub-adquirentes:** hoje `BRAND_CATEGORIES` não inclui "sub-adquirentes" como categoria separada. Decidir entre adicionar nova chave ou usar `produto` como agrupador genérico.

### Esforço estimado

- **Componente + sanitização SVG:** 1,5 dia.
- **Normalização PNG via canvas:** 0,5 dia.
- **Preview comparativo + UX de drop-zone:** 1 dia.
- **Story no Storybook + a11y (label, teclado, anúncios de upload):** 0,5 dia.
- **Total:** ~3,5 dias.

### Critérios de done

- Story no Storybook permite simular upload sem persistência.
- Cobertura de unit tests para o normalizador (≥ 80%).
- Acessibilidade: drop-zone navegável por teclado, mensagens de erro com `aria-live`.
- Validação dos tamanhos suportados (16, 20, 24, 32, 48px) — o logo normalizado deve ficar legível em 16px.

---

## Fase 4 — Expandir regras de negócio documentadas

### Por que

A página `Foundations/Regras de Negócio` começa com Status & Tags porque é a regra mais visível e está concentrada num único átomo. Mas há **regras de negócio críticas espalhadas pelo código** que hoje só vivem em comentários ou em commits. Centralizar em Storybook MDX dá ao time uma única fonte de verdade e força o front a estar alinhado com o produto.

### Tópicos prioritários (em ordem de impacto)

1. **Antecipação de recebíveis.** Origem: `docs/antecipacao-regras.md` (já existe), `src/features/estabelecimento/v1/AntecipacaoProgramada/`, `src/features/estabelecimento/v0/Liquidacoes/`, `src/components/agenda/AgendaAdvances.tsx`. Documentar fórmula de deságio, prazos, condições de elegibilidade, fluxo de aprovação.
2. **MDR (Merchant Discount Rate).** Origem: `src/components/pricing/`, `src/components/interchange/`. Documentar como o MDR é composto (interchange + spread + custos do sub), diferença MDR vs Interchange+, e como aparecem nos cards de pricing.
3. **Conciliação (Reconciliado vs Divergência).** Origem: `src/lib/conciliation/statusUtils.ts`, `src/components/conciliation/`. Documentar critérios de matching, tolerâncias, telas de divergência.
4. **Recuperação de recebíveis.** Origem: agenda + financeiro. Documentar quando um recebível vira "A recuperar", como é tratado o saldo retido e a interação com `rolling reserve`.
5. **Personas e versões.** Origem: `src/features/{estabelecimento,adquirente,subadquirente}/v{0,1}/`, `src/components/layout/PersonaBadge.tsx`. Documentar o modelo de personas (EC, Adquirente, Sub) e o significado de versões (v0 legado vs v1 produto novo).
6. **Cálculos financeiros.** Bruto → Líquido → Repasse → Margem. Origem espalhada em mocks e features. Documentar a equação canônica do README ampliada com exemplos numéricos.

### Estrutura proposta

Adicionar abas dentro de `Foundations/Regras de Negócio` (cada uma um MDX):

- `Foundations/Regras de Negócio/Status & Tags` (já existe)
- `Foundations/Regras de Negócio/Antecipação`
- `Foundations/Regras de Negócio/MDR & Interchange`
- `Foundations/Regras de Negócio/Conciliação`
- `Foundations/Regras de Negócio/Recuperação`
- `Foundations/Regras de Negócio/Personas`
- `Foundations/Regras de Negócio/Cálculos financeiros`

### Esforço estimado

- **Antecipação:** 1 dia (base já existe em `docs/antecipacao-regras.md`, restam exemplos numéricos e ligar com componentes).
- **MDR & Interchange:** 1,5 dia.
- **Conciliação:** 1 dia.
- **Demais tópicos:** 0,5–1 dia cada.
- **Total:** ~6 dias distribuídos. Bom para fazer em paralelo a outros trabalhos, 1 tópico por semana.

### Critérios de done por tópico

- MDX com fonte clara (arquivo + função) para cada cálculo ou regra.
- Pelo menos um exemplo numérico calculado à mão batendo com o que o app exibe.
- Link explícito para a story do componente onde a regra é aplicada.
- Inconsistências entre features documentadas (ex.: regra usada de forma diferente em EC v0 vs EC v1).

---

## Sequenciamento sugerido

1. **Aplicar a linha do `.storybook/main.ts`** para habilitar MDX (15 minutos).
2. **Fase 2** primeiro — reorganização física. Quanto mais cedo for feita, menos imports terão de ser mexidos depois.
3. **Fase 4 em paralelo** — documentação de regras de negócio não bloqueia engenharia e pode rodar enquanto a Fase 2 estabiliza.
4. **Fase 3 por último** — `LogoUpload` exige decisão sobre persistência (front-only vs API). Espera a definição de roadmap de back.

## Referências

- Frost, Brad. *Atomic Design*. atomicdesign.bradfrost.com. 2016. Capítulos 2 e 3.
- `src/stories/foundations/AtomicDesign.mdx` — classificação atual dos componentes.
- `src/stories/foundations/RegrasDeNegocio.mdx` — base sobre a qual as expansões da Fase 4 são construídas.
- `docs/antecipacao-regras.md` — material existente sobre antecipação, ponto de partida para a Fase 4.
- `docs/DOMAIN.md`, `docs/PAGES.md`, `docs/COMPONENTS.md`, `docs/DESIGN_TOKENS.md` — material complementar.
- Brain Harrison `harrison-brain/wiki/ux.md` — heurísticas Nielsen e princípios Krug aplicados ao Yby.
- Brain Harrison `harrison-brain/agents/pixel/taste-profile.md` — diretrizes de hierarquia, ação primária e tokens.
- Brain Harrison `harrison-brain/wiki/methodology/32-openspec.md` — método de spec-driven para conduzir cada uma das fases via OpenSpec.
