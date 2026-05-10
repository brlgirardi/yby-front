# Storybook — Taxonomia Atomic Design

**Premissa cravada com o Bruno em 08/05/2026:** toda Story do Yby Front segue
a mesma taxonomia do `chargeback-portal`. Quando criar componente novo, o
`title:` da Story já entra no slot correto. Quando tocar componente
existente que está no slot errado, migrar na hora.

## Slots

```
Design System/
├ Foundations/   ← tokens visuais (Colors, Typography, Spacing). NÃO componentes.
├ Atoms/         ← primitivos sem dependência de domínio (Button, Input, Tag,
│                  Badge, Tooltip, Skeleton, ShiftInput, Icon, AppSelect)
├ Molecules/     ← composições de Atoms com responsabilidade clara
│                  (KpiCard, PageHeader, EmptyState, Loading, Sparkline)
└ Organisms/     ← composições complexas que orquestram Molecules
                   (DataTable)

Domain/          ← componentes específicos de negócio. NÃO entram em Atoms/Molecules
                   mesmo que pareçam genéricos.
                   Subpastas:
                   - Domain/PersonaSwitcher, Domain/PersonaBadge
                   - Domain/BrandLogo (logos de bandeiras)
                   - Domain/Estabelecimento V0/{Dashboard, AgendaRecebiveis, ...}
                   - Domain/Conciliation/* (legacy SUB)
                   - Domain/Pricing/* (legacy SUB)
                   - Domain/Auth/* (legacy SUB)
                   - Domain/Interchange/* (legacy SUB)

Layout/          ← shell components (GlobalHeader, Sidebar, EcSidebar, AqSidebar,
                   SidebarRouter, AppShell). Pode-se mover pra Organisms/ depois.
```

## Migração já aplicada (08/05/2026)

| Antes                  | Depois                              |
|------------------------|-------------------------------------|
| `Shared/Skeleton`      | `Design System/Atoms/Skeleton`      |
| `Shared/Tooltip`       | `Design System/Atoms/Tooltip`       |
| `Shared/ShiftInput`    | `Design System/Atoms/ShiftInput`    |
| `Shared/Loading`       | `Design System/Molecules/Loading`   |
| `Shared/EmptyState`    | `Design System/Molecules/EmptyState`|
| `Shared/Sparkline`     | `Design System/Molecules/Sparkline` |
| `Shared/BrandLogo`     | `Domain/BrandLogo`                  |

## Backlog técnico de migração

Estes ainda precisam ser movidos pra `Domain/<área>/` — fica como dívida pra
limpar incrementalmente quando o componente for tocado:

- `Auth/LoginForm` → `Domain/Auth/LoginForm`
- `Auth/RedefinePasswordStep` → `Domain/Auth/RedefinePasswordStep`
- `Auth/SendEmailStep` → `Domain/Auth/SendEmailStep`
- `Auth/VerifyCodeStep` → `Domain/Auth/VerifyCodeStep`
- `Conciliation/*` (10 stories) → `Domain/Conciliation/*`
- `Interchange/InterchangeRateCard` → `Domain/Interchange/InterchangeRateCard`
- `Pricing/*` (8 stories) → `Domain/Pricing/*`
- `Layout/*` → mantém ou move pra `Organisms/Layout/`
- Stories soltas com title de string (Adquirente, Agenda, Cobranças, Dashboard, Merchants…) → revisar caso a caso

## Regra dura

Ao criar Story nova, sempre:

```ts
const meta = {
  title: 'Domain/<Area>/<Component>',  // ou Atoms/Molecules/Organisms/Foundations
  ...
}
```

Componentes do Estabelecimento Comercial v0 já seguem essa regra:
`Domain/Estabelecimento V0/{Dashboard,AgendaRecebiveis,AgendaPagamentos,...}`.

## Premissas Pixel/Rian (Enviesados)

Stories que têm trade-off ético (default ON, framing de ganho/perda, copy
sensível) devem incluir nota nos `parameters.docs.description.component`
explicando qual capítulo do Enviesados foi aplicado, pra que revisores
futuros entendam a intenção. Exemplos no `EcOnboarding.stories.tsx` e
`EcAgendaRecebiveis.stories.tsx`.
