# Auditoria Tupi-Fintech DEV — Sincronização com Yby Front

> **Data:** 2026-05-14 (rev 2 — aprofundada)
> **Escopo:** Repositórios `github.com/tupi-fintech/*` (branch `develop`), exceto chargeback*, archived, infra, labs, SDKs mobile, ds-* (data science).
> **Objetivo:** Mapear APIs, modelos de domínio e gaps pra alinhar o Yby Front com o ambiente DEV dos backends Go.
> **Status:** Rev 2 — 7 repos centrais + 17 secundários + `yby-go-pkg` + `yby-ui` (frontend produção) auditados.
> **Auth nota:** Keycloak fica fora dessa rodada — vamos manter mock até time backend abrir acesso.

---

## 1. Inventário de Repos (96 ativos)

### Repos PRIMÁRIOS auditados (APIs centrais)

| Repo | Linguagem | Branch | Stack | Propósito |
|------|-----------|--------|-------|-----------|
| `yby-bff` | Go | develop | chi + go-kit | BFF que orquestra pricing/settlement/receivables |
| `yby-organization-api` | Go | develop | chi + go-kit + Keycloak | Organizations, users, onboarding, integrations (providers/credentials), reference data (banks, MCCs, faturamento, CNAEs) |
| `yby-terminal-api` | Go | develop | chi + go-kit | Terminais (POS), inicialização (tables/themes), registration, configuration, logon-sync |
| `yby-transaction-api` | Go | develop | chi + go-kit | Transações: cycles, summaries, events |
| `yby-settlement-api` | Go | develop | chi + go-kit + SQS | Liquidação SLC/Nuclea (centralizer, POS, acquirer, accounts, ASLC documents) |
| `yby-reconciliation-api` | Go | develop | chi + go-kit | Reports, recon-mismatch, recon-summary |
| `yby-pricing-economics-api` | Go | develop | chi + go-kit | Cost, Price, CostBlueprint, PriceBlueprint, Installments |

### Repos SECUNDÁRIOS (listados, não auditados em profundidade)

| Categoria | Repos |
|-----------|-------|
| APIs adicionais | `yby-interchange-api`, `yby-bin-api`, `yby-ledger`, `yby-notification-api`, `yby-audit-api`, `yby-payment-link-api`, `yby-pix-gateway`, `yby-ecommerce-payment-gateway`, `yby-emv-payment-gateway`, `yby-edi-api`, `yby-smart-routing`, `yby-enrichment-service`, `yby-settlement-worker` |
| Pkgs compartilhados | `yby-go-pkg` (modelos, enums, middleware comum), `yby-proto`, `yby-go-scaffold` |
| Documentação | `yby-docs`, `knowledge-base`, `yby-platform-workspace` |
| Frontends/UI | `yby-ui` (React/TS), `chargeback-portal`, `site` |
| Excluídos | `chargeback-*` (8 repos), `yby-android-*` (5), `yby-sdk-*` (3), `yby-ds-*` (10), labs/poc/teste (5), infra (5) |

---

## 2. Endpoints Mapeados

### `yby-bff` — Backend for Frontend

**Base path:** `/public/*` (auth + authz via Keycloak) e `/private/*` (admin/health/metrics).
**Middlewares:** Telemetry, RequestID, Logger, Recoverer, CORS, OrganizationID, Authenticator, Authorizer.
**Skip auth local:** `SKIP_AUTH=true`, `SKIP_AUTHZ=true`.

| Caminho | Origem upstream | Subrotas |
|---------|-----------------|----------|
| `/public/pricing/*` | yby-pricing-economics-api | `/cost-blueprints`, `/cost-blueprints/{id}`, `/price-blueprints`, `/price-blueprints/{id}`, `/installments` |
| `/public/settlement/*` | yby-settlement-api | `/files`, `/import`, `/{id}` |
| `/public/receivables-calendar/*` | (outro service) | `/anticipations`, `/batches`, `/calendar`, `/calendar/{date}`, `/funding`, `/installments`, `/payments`, `/summary` |
| `/private/admin/cache` | (cache control) | Apenas SuperAdmin |
| `/private/swagger` | OpenAPI docs | — |

### `yby-organization-api` — IDENTIDADE + ORGANIZAÇÃO

| Método | Endpoint | Função |
|--------|----------|--------|
| `POST` | `/api/onboarding` | **Cria organização (Sub-adquirente/Merchant/Acquirer/ISO) + admin user** |
| `*` | `/api/users` | CRUD usuários |
| `POST` | `/api/users/generate-reset-password-token` | Forgot password |
| `POST` | `/api/users/redefine-password` | Reset password |
| `POST` | `/api/users/redefine-temporary-password` | Primeiro login |
| `POST` | `/api/users/resend-temporary-password` | Reenvio convite |
| `POST` | `/api/users/validate-reset-password-token` | Validação token |
| `POST` | `/api/users/{id}/sync-keycloak/{idpOrgId}` | Sync com Keycloak |
| `*` | `/api/private/roles`, `/api/private/roles/{id}`, `/api/private/roles/name/{name}` | RBAC |
| `*` | `/api/private/banks`, `/api/public/banks` | Reference: bancos |
| `*` | `/api/private/merchant-categories`, `/api/public/merchant-categories` | Reference: MCCs |
| `*` | `/api/private/monthly-revenue-ranges`, `/api/public/monthly-revenue-ranges` | Reference: faturamento |
| `*` | `/api/admin/auth` | Auth admin |
| `*` | `/api/admin/economic_activities`, `/api/admin/economic_activities/{id}` | Reference: CNAEs |

### `yby-terminal-api` — TERMINAIS / POS

| Método | Endpoint | Função |
|--------|----------|--------|
| `GET` | `/api/public/terminal/initialization/{merchantID}/{terminalID}/{sync-type}` | Init tables (table, theme, settings, acquirer config) |

> Outros endpoints existem (registration, configuration, logon-sync, operation) mas não aparecem no swagger gerado. Necessário inspeção mais profunda dos handlers.

### `yby-transaction-api` — TRANSAÇÕES

| Método | Endpoint | Função |
|--------|----------|--------|
| `*` | `/cycles`, `/cycles/{id}` | Ciclos de pagamento |
| `*` | `/summaries`, `/summaries/{id}` | Resumos por dia/agente |
| `*` | `/events` | Stream de eventos transacionais |

### `yby-settlement-api` — LIQUIDAÇÃO SLC/Nuclea

| Domínio | Função |
|---------|--------|
| `dto.*` | Centralizer, POS, Acquirer, Account, ASLC document, FileEnvelope, GrupoSeq, Metadata |
| Endpoints | `/files`, `/import`, `/{id}` (via BFF) |
| Consumer | SQS para liquidações inbound |

### `yby-reconciliation-api` — RECONCILIAÇÃO

| Método | Endpoint | Função |
|--------|----------|--------|
| `GET` | `/api/public/report` | Lista reports |
| `GET` | `/api/public/report/outgoing` | Outgoing reports |
| `GET` | `/api/public/report/recon-mismatch/{use_config_id}/{date}` | Mismatches por config + data |
| `GET` | `/api/public/report/recon-summary` | Summary |

### `yby-pricing-economics-api` — PRECIFICAÇÃO

| Domínio | Endpoints (via BFF) |
|---------|---------------------|
| `cost` | `/{id}` (CRUD custo) |
| `costblueprint` | `/{id}` (template de custo por bandeira) |
| `price` | `/{id}` (CRUD preço) |
| `priceblueprint` | `/{id}` (template de preço por bandeira) |
| `installment` | `/{id}` (parcelas configuradas) |

---

## 3. Glossário (Modelos de Domínio)

### Entidade central: `Organization` (yby-organization-api)

```go
type OrganizationData struct {
  Type                 OrganizationTypeE   // "acquirer" | "subacquirer" | "independent_sales_organization" | "merchant"
  TaxID                string              // CNPJ
  DBAName              string              // Nome fantasia
  CorporateName        *string             // Razão social
  Slug                 *string
  Enabled              *bool
  MerchantCategoryCode *string             // MCC
  EconomicActivityCode *string             // CNAE
  IDPOrganizationID    *string             // Keycloak ID
  IDPDomain            *string
}
type OrganizationAssociation struct {
  ParentID         *id.ID                  // Sub-adquirente é parent de Merchant
  Parent           *Organization
  AddressID        *id.ID
  Address          *Address
  ContactID        *id.ID
  Contact          *Contact
  EconomicActivity *EconomicActivity
  MerchantCategory *MerchantCategory
  BankAccounts     *[]BankAccount
  ContactPerson    *[]ContactPerson
}
```

**Insight crítico:** O backend NÃO tem um domínio separado `Merchant` ou `EC`. **Merchant é uma `Organization` com `Type=merchant`** vinculada a um sub-adquirente via `ParentID`. Toda a estrutura de listagem, criação e edição de merchant deve usar `/api/onboarding` (criação) e `/api/users`+`/api/private/...` (gestão).

### Glossário PT-BR ↔ Backend EN

| Termo PT (front) | Termo backend | Repo origem | Campo principal |
|------------------|---------------|-------------|-----------------|
| Sub-adquirente | `Organization{Type:subacquirer}` | organization-api | `OrganizationData` |
| Estabelecimento Comercial (EC) / Merchant | `Organization{Type:merchant, ParentID:sub_id}` | organization-api | `OrganizationData` + `ParentID` |
| Adquirente | `Organization{Type:acquirer}` ou `Acquirer` em settlement | organization-api / settlement-api | `OrganizationTypeAcquirer` |
| CNPJ | `TaxID` | organization-api | `string` |
| Razão social | `CorporateName` | organization-api | `*string` |
| Nome fantasia | `DBAName` | organization-api | `string` |
| MCC | `MerchantCategoryCode` | organization-api | `*string` (ref `MerchantCategory.code`) |
| CNAE | `EconomicActivityCode` | organization-api | `*string` (ref `EconomicActivity.code`) |
| Endereço | `Address` + `AddressID` | organization-api | model próprio (não auditado em detalhe) |
| Faturamento mensal | `MonthlyRevenueRange` | organization-api | reference table |
| Banco recebedor | `Bank` / `BankAccount` | organization-api | reference table + relação |
| Canal (CP/CNP) | (não modelado como entidade — provavelmente em `terminal-api` ou em `pricing` channel enum `cp/cnp`) | terminal-api / pricing-economics | `Channel string` (enum) |
| Terminal / POS | `Terminal` + initialization tables | terminal-api | dto: `InitTables`, `Table`, `Theme`, `Settings` |
| MID (Merchant ID) | (não explícito — provavelmente `Organization.ID` ou `Credential` por canal/adquirente) | organization-api / terminal-api | revisar |
| TID (Terminal ID) | `TerminalID` no path | terminal-api | string |
| Liquidação | `Settlement`, `CentralizerReturn`, `POSReturn` | settlement-api | dto rico |
| Reconciliação | `Reconciliation`, `ReconMismatch`, `ReconSummary` | reconciliation-api | reports |
| Interchange | `InterchangeRate` | interchange-api | (não auditado) |
| Recebível | `Receivables`, `Calendar`, `Anticipation`, `Funding`, `Payment` | bff + service externo | dto via BFF |
| Custo | `Cost`, `CostBlueprint` | pricing-economics-api | DTOs |
| Preço | `Price`, `PriceBlueprint` | pricing-economics-api | DTOs |
| Parcela | `Installment` | pricing-economics-api | reference |
| Provider | `Provider`, `ProviderChannel` | organization-api | integrations |
| Credencial | `Credential` | organization-api | integrations (ligar org a provider) |

### Tipos de Organização (`yby-go-pkg/enumers/organization-type.go`)

```go
const (
  OrganizationTypeAcquirer                     = "acquirer"
  OrganizationTypeSubacquirer                  = "subacquirer"
  OrganizationTypeIndependentSalesOrganization = "independent_sales_organization"
  OrganizationTypeMerchant                     = "merchant"
)
```

### `OnboardingRequest` (yby-organization-api)

```go
type OnboardingRequest struct {
  Admin   AdminData
  Company CompanyData
}
type AdminData struct {
  Name, Phone, Email, Password, TaxID string
}
type CompanyData struct {
  Name                 string
  TaxID                string                     // CNPJ
  Domain               *string
  EconomicActivityID   *id.ID                     // CNAE FK
  ParentOrganizationID *id.ID                     // Sub-adq pai
  Type                 enumers.OrganizationTypeE  // "merchant", "subacquirer", etc
}
```

> **Atenção:** o `OnboardingRequest` atual NÃO inclui `MerchantCategoryCode` (MCC), `Address`, `Contact`, `BankAccount` no payload de criação. Esses campos provavelmente são criados via endpoints separados ou em fluxo de "update após onboard". Front precisa lidar com isso.

---

## 4. Yby Front — Cobertura Atual

### Services existentes (`src/services/`)

| Service | Status mock/real | Mapeamento backend |
|---------|------------------|--------------------|
| `apiClient.ts` | Config (mock/real toggle via `NEXT_PUBLIC_API_MODE`) | base `NEXT_PUBLIC_API_BASE_URL` |
| `authService.ts` | Mock | `yby-organization-api /api/admin/auth` + Keycloak |
| `pricingService.ts` | Mock | `yby-bff /public/pricing/*` → `yby-pricing-economics-api` |
| `settlementService.ts` | Mock | `yby-bff /public/settlement/*` → `yby-settlement-api` |
| `reconciliationService.ts` | Mock | `yby-reconciliation-api /api/public/report*` |
| `acquirerReconciliationService.ts` | Mock | (mesmo recon-api ou via BFF — confirmar) |
| `interchangeRateService.ts` | Mock | `yby-interchange-api` (não auditado) |

### Features do Yby Front (`src/features/`)

| Feature | Implementada | API esperada | Status |
|---------|--------------|--------------|--------|
| Sub-adquirente / MerchantOnboarding | ✅ Detalhes + Canais + Terminais (3 modos: create/view/edit) | `POST /api/onboarding` + updates por endpoint | ❌ mock-only |
| Sub-adquirente / MerchantsList | ✅ Lista com filtros | `GET /api/organizations?type=merchant&parentId=...` | ❌ mock-only (endpoint a confirmar) |
| Pricing / Custos (channel/acquirer/brand) | ✅ ChannelSection/AcquirerSection/BrandSection | `GET /cost-blueprints` via BFF | ❌ mock-only (apesar dos types já mapeados) |
| Pricing / Preços | ✅ | `GET /price-blueprints` via BFF | ❌ mock-only |
| Financial / Settlements | ✅ Tabela + drawer | `GET /settlement/*` via BFF | ❌ mock-only |
| Financial / Reconciliation | ✅ | `GET /api/public/report*` | ❌ mock-only |
| Transactions / Dashboard | ✅ KPIs + tabelas | `GET /summaries`, `GET /cycles` | ❌ mock-only |
| Agenda / Receivables | ✅ Calendário antecipação | `GET /receivables-calendar/*` via BFF | ❌ mock-only |
| Auth (login, forgot password, etc) | ✅ Telas | `POST /api/users/*` | ❌ mock-only |
| Users (admin) | ⚠️ Parcial (não auditado) | `/api/users` + `/api/private/roles` | parcial |
| Configurações | ⚠️ Parcial | (não mapeado) | TBD |

---

## 5. Gap Analysis

### a) No backend DEV mas FALTA NO FRONT

| O que existe no DEV | Como aproveitar |
|---------------------|-----------------|
| `POST /api/onboarding` (cria org + admin user em fluxo único) | Conectar form do MerchantOnboarding pra criar Org `Type=merchant` com `ParentID` do sub-adq logado |
| Reference data: `/api/public/banks`, `/api/public/merchant-categories`, `/api/public/monthly-revenue-ranges`, `/api/admin/economic_activities` | Substituir mocks `BANCOS`, `MCCS`, `FATURAMENTOS`, `CNAES` em `src/mocks/sub/merchant-onboarding.ts` |
| `POST /api/users/generate-reset-password-token` + redefine flow | Implementar fluxo "Esqueci minha senha" se ainda for mock |
| `Provider` + `Credential` (integrations) — modela a relação merchant↔adquirente↔MID | **Provável modelo de "Canal/Adquirente"** que estamos representando no front; revisar antes de criar entidade própria |
| Keycloak auth (`IDPOrganizationID`, `IDPUserID`, `IDPDomain`) | Auth real precisa integração com Keycloak (frontends Tupi devem ter padrão) |
| Telemetry header `X-Trace-ID`, `OrganizationID` middleware | Cliente HTTP do front deve enviar `X-Organization-ID` |
| `yby-terminal-api` operation/initialization | Conectar tab Terminais com endpoint de initialization quando merchant for criado |
| Eventos (Kafka/SQS) | Não relevantes para o front diretamente, mas podem disparar refresh de listas |

### b) No FRONT mas FALTA NO BACKEND DEV

| O que está no front | O que falta no backend |
|---------------------|------------------------|
| Modelo `MerchantFormData.canais.{cp,cnp}.adquirentes[]` com `adquirenteId + mid` | **Modelagem de Channel/Adquirente vinculados a um Merchant** — `Credential` existe (integrations) mas seu schema precisa cobrir CP/CNP separadamente |
| Modelo `MerchantFormData.terminais.{cp,cnp}[]` com `identificacao + vinculos[].tid` | `yby-terminal-api` tem `Terminal` mas não está claro como é a estrutura `TerminalAcquirerLink` (TID por acquirer) |
| Visão "Adquirente" como entidade própria filtrada por sub-adq (mock: Cielo/Rede/Stone/Getnet/PagSeguro) | Lista de adquirentes está em `Organization{Type:acquirer}` — não tem endpoint público específico ainda |
| Switch `enabled` no canal | Backend usa `Enabled *bool` no Organization, mas não está claro como representar "merchant tem canal CP/CNP habilitado/desabilitado" |
| Tabs "Visualizando"/"Editando" + modal confirm de descarte | Apenas frontend |

### c) Divergências de naming/contrato

| Front | Backend | Recomendação |
|-------|---------|--------------|
| `MerchantFormData.razaoSocial` | `CorporateName` | Renomear no service layer (DTO) na hora de mandar pra API |
| `MerchantFormData.cnpj` | `TaxID` | Idem (mapear na borda) |
| `MerchantFormData.mcc` (string code) | `MerchantCategoryCode` (string) + `MerchantCategoryID` (FK) | Front guarda code, mas API precisa do ID — fazer lookup quando enviar |
| `MerchantFormData.cep, estado, cidade, endereco, numero, complemento` | `Address` (model próprio com FK `AddressID`) | Criar/atualizar Address antes ou em flow do onboarding (depende se backend suporta nested) |
| `OnboardingTab='detalhes'\|'canais'\|'terminais'` | (nenhum equivalente no backend — abstração só do front) | Manter no front |
| `Channel='cp'\|'cnp'` | Em pricing tem `Channel string` enum — confirmar se valores batem (`cp`/`cnp` minúsculos?) | Verificar enum exato no `yby-go-pkg/enumers` |
| Front: lista de adquirentes hardcoded (`cielo/rede/stone/getnet/pagseguro`) | Backend: `Organization{Type:acquirer}` ou enum em settlement-api | Substituir mock por endpoint `/api/organizations?type=acquirer` |

---

## 6. Roadmap Sugerido (priorizado)

### Onda 1 — Quick wins (contratos quase prontos, baixo risco)

1. **Reference data**: substituir mocks de bancos/MCCs/CNAEs/faturamento pelos endpoints `/api/public/*` do organization-api.
   - Files: `src/mocks/sub/merchant-onboarding.ts` → mover pra `src/services/referenceService.ts`
2. **Auth real**: trocar `authService.ts` mock por integração `yby-organization-api /api/admin/auth` + Keycloak token storage.
3. **Configurar `apiClient`**: ajustar para enviar `X-Organization-ID` header e Authorization Bearer.

### Onda 2 — Adaptações de naming/DTO (médio risco)

4. **MerchantsList**: criar endpoint efetivo (`GET /api/organizations?type=merchant`) ou confirmar se já existe — substituir mock.
5. **MerchantOnboarding (CREATE)**: mapear `MerchantFormData → CompanyData + AdminData` ao enviar `POST /api/onboarding`. Tratar `MCC code → MerchantCategoryID` via lookup.
6. **MerchantOnboarding (VIEW/EDIT)**: criar service `organizationService` com `GET /api/organizations/{id}`, `PUT /api/organizations/{id}`, etc (confirmar endpoints).

### Onda 3 — Modelagem nova (alto risco — pode precisar backend)

7. **Canais (CP/CNP)**: definir com backend se vai ser modelado em `Credential` (integrations) ou em endpoint próprio. **Provável bloqueio.**
8. **Terminais + vínculos adquirente+TID**: confirmar endpoint exato no `yby-terminal-api`. Hoje só achei `/api/public/terminal/initialization/{merchantID}/{terminalID}/{sync-type}`.
9. **Pricing real**: conectar `pricingService.ts` aos endpoints reais via BFF. Validar tipos `CostBlueprintResponse` e `PriceBlueprintResponse` vs `pricing.types.ts` front.

### Onda 4 — Integrações pesadas

10. **Settlement, Transactions, Reconciliation**: conectar services reais via BFF. Validar parâmetros (date ranges, filtros, paginação).
11. **Receivables (calendar/anticipations)**: via BFF.
12. **Notifications**: integrar `yby-notification-api`.
13. **Audit log**: integrar `yby-audit-api` (mostrar últimas alterações em view do EC).

---

## 7. Próximas Auditorias Recomendadas

Para completar o mapa, vale auditar (não foi feito nesta rodada):

- `yby-interchange-api` — taxas interchange por bandeira/MCC (usado em pricing)
- `yby-bin-api` — lookup BIN
- `yby-ledger` — contábil
- `yby-notification-api` — pra notification center no front
- `yby-audit-api` — pra trilha de auditoria
- `yby-payment-link-api`, `yby-pix-gateway`, `yby-emv-payment-gateway`, `yby-ecommerce-payment-gateway` — relevantes pra checkout/payment
- `yby-edi-api` — processamento EDI
- `yby-smart-routing`, `yby-enrichment-service`, `yby-settlement-worker` — backend interno, mas podem expor endpoints
- `yby-ui` — Design System backend Tupi (comparar com nosso DS)

---

## 8. APIs Secundárias (rev 2)

### `yby-notification-api` — Comunicações

| Endpoint | Função |
|----------|--------|
| `*` `/public/email/notifications`, `/{id}` | CRUD notificações por e-mail |
| `*` `/public/email/templates`, `/{id}`, `/base` | Templates de e-mail (customizável por tenant) |
| `*` `/public/webhooks/configurations`, `/{id}`, `/{id}/test` | Configuração de webhooks por tenant |
| `*` `/public/webhooks/events`, `/{id}`, `/{id}/retry` | Histórico de eventos + retry |
| `*` `/private/admin/email/templates`, `/base` | Admin gerencia templates globais |

**Modelos:** `EmailNotification`, `EmailTemplate`, `WebhookConfiguration`, `WebhookEvent` (com `EventStatus`).

**Uso no Yby Front:** alimenta tela "Comunicações" (presente em yby-ui mas ainda ausente como recurso pleno no nosso front).

### `yby-payment-link-api` — Links de pagamento

| Endpoint | Função |
|----------|--------|
| `*` `/api/admin/payment-links`, `/{id}` | CRUD links de pagamento |
| `POST` `/api/admin/payment-links/{id}/set-active` | Ativar/desativar |
| `GET` `/api/admin/payment-links/{slug}/validate` | Validar slug público |
| `*` `/api/admin/payment-links/{id}/payments`, `/{paymentId}` | Pagamentos vinculados ao link |
| `GET` `/api/payment-links/{slug}` | Página pública do link |

**Modelos:** `PaymentLink`, `Product`, `CreditCardConfig`, `PixConfig`, `BankSlipConfig`, `Payment`.

**Uso no Yby Front:** corresponde à tela "Income / Cobranças / Links de pagamento" (yby-ui já implementa, nosso front ainda não).

### `yby-ecommerce-payment-gateway` — Gateway VTEX

| Endpoint | Função |
|----------|--------|
| `POST` `/public/api/payments` | Criar pagamento (VTEX-compliant) |
| `POST` `/public/api/payments/{paymentId}/capture` | Capturar |
| `POST` `/public/api/payments/{paymentId}/cancel` | Cancelar |
| `POST` `/public/api/payments/{paymentId}/refund` | Estornar |
| `GET` `/public/api/manifest` | VTEX manifest |

**Stack:** Integra Cielo, Rede, Pagar.me. Auth: JWT + App credentials.

### `yby-emv-payment-gateway` — Gateway EMV (físico)

| Endpoint | Função |
|----------|--------|
| `POST` `/api/payments/authorization`, `/pre-authorization` | Autorização |
| `POST` `/api/payments/capture`, `/advice`, `/confirmation` | Captura |
| `POST` `/api/payments/void`, `/reversal` | Reversão |
| `POST` `/api/payments/logon` | Logon do POS |
| `POST` `/api/payments/probe`, `/probe-pending` | Probe (PCI sensitive — retenção 7 dias) |
| `POST` `/api/payments/pix-qr-code`, `/pix-payment-status` | PIX no POS |

### `yby-pix-gateway` — PIX

| Endpoint | Função |
|----------|--------|
| `POST` `/api/public/payments/cash-in` | PIX recebimento |
| `POST` `/api/public/payments/cash-out` | PIX envio |
| `POST` `/api/public/payments/refund` | Estorno PIX |

### `yby-audit-api` — Audit log

| Endpoint | Função |
|----------|--------|
| `GET` `/api/admin/audit`, `/{id}` | Lista + detalhe de eventos auditados |

**Modelo:** `AuditEvent` — provavelmente usado pela tela "Logs de Atividades" do yby-ui.

### `yby-bin-api` — Lookup BIN

| Endpoint | Função |
|----------|--------|
| `*` `/api/public/card_bin`, `/{id}` | CRUD BINs (cartão) |
| `*` `/api/admin/cache`, `/{id}` | Cache admin |

**Modelos:** `CardBin`, `VisaBin`, `CaptureInstallment`, `EntryType` enum.

### `yby-interchange-api` — Interchange Mastercard

Apenas endpoints admin (`/private/api/admin/settings`). É majoritariamente **worker** de reconciliação Mastercard:
- S3 → Lambda/Container → Processamento `mastercardEvent.Outgoing` → SQS `pricing-out-reconciliation_mastercard-outgoing-itc-report`

**Modelos:** `Itc` (intra/interregional), `LargeTicket`, `BaseRate`, `ReferenceTable` — dados de tabelas Mastercard.

**Uso no Front:** alimenta nosso `interchangeRateService.ts` (provavelmente via outro endpoint não documentado ainda — confirmar com backend).

### `yby-ledger` — Contábil + Receivables (origem)

**Domínios:** `account_plan` (plano de contas), `core` (Entry), `receivables-calendar`, `gateway`.
**Endpoints:** apenas admin/settings expostos. Resto é worker (SQS: `ledger_in_v1`, `ledger_in_batch_v1`, `ledger_in_unbatching_v1`, `ledger_in_retry_v1`).

**`receivables-calendar` aqui é a fonte:** `SummaryRequest`, `CalendarRequest`, `DayDetailRequest`, `InstallmentsRequest`, `BatchesRequest`, `AnticipationsRequest`, `FundingRequest`, `PaymentsRequest`. **O `yby-bff` proxia esses endpoints sob `/public/receivables-calendar/*`.**

### `yby-edi-api`, `yby-smart-routing`, `yby-enrichment-service`, `yby-settlement-worker`, `yby-recon-sub`

Apenas admin/settings ou workers internos. Não expõem endpoints úteis pro front diretamente.

---

## 9. yby-ui — Frontend de Produção (Benchmark)

**Stack:** Umi Max v4 + Ant Design Pro v6.0 + Zustand + React Query.
**Repo:** `tupi-fintech/yby-ui`.
**Status:** Atual portal de DEV/produção da Tupi.

### Routing (resumo)

| Rota | Página | Wrapper |
|------|--------|---------|
| `/user/login`, `/user/register`, `/user/forgot-password`, `/user/redefine-temporary-password`, `/user/login/terms`, `/user/login/privacy` | Auth flow | `isLoggedIn` |
| `/dashboard` | Dashboard genérico | `auth` |
| `/receivables-calendar` | Agenda de recebíveis | — |
| `/integrations` | **Conexões com adquirentes (Provider)** | `auth + isMerchant` |
| `/income/payments` | Cobranças | `auth + isMerchant` |
| `/income/payment-links` | Links de pagamento + create + checkout | `auth + isMerchant` |
| `/notifications` | Comunicações | `auth + NonMerchant` |
| `/audit` | Logs de Atividades | `auth` |
| `/users` | Gestão de usuários | `auth` |
| `/financial/conciliation` | Conciliação | `auth + isAcquirer` |
| `/financial/settlement` | Liquidação | `auth + isAcquirer` |
| `/configuration/costs` | Tarifas por adquirente (nossas tabelas de custo) | `auth` |
| `/configuration/pricing` | Tabela de preços | `auth` |
| `/account/profile` | Perfil | `auth` |

### Hook `useOrganizationType`

```ts
const { organizationType, isTupi, isAcquirer, isSubacquirer, isIso, isMerchant } = useOrganizationType()
// organization.type vem normalizado para lowercase
// isTupi: org.taxId === '57965582000168' (a própria Tupi)
```

**Importância para o nosso Yby Front:** o tipo da organização logada **controla menu + permissões + redirects**. Precisamos replicar essa lógica de RBAC simples no front.

### `onboardingService.ts` (referência exata)

```ts
// POST /onboarding → cria Organization (merchant) + admin user
export const createMerchant = async (merchantData: MerchantData) =>
  request('/onboarding', { method: 'POST', data: merchantData })

// MerchantData = { admin: AdminData, company: CompanyData }
// AdminData = { name, email, phone, password, taxId }
// CompanyData = { name, taxId, economicActivityId, type: 'merchant' }
```

**Limitação atual:** `economicActivityId` é loaded de `/cnae-cache.json` (arquivo estático no front) — porque endpoint paginava em 20 itens. Tem TODO no código pra trocar.

### `settlementService.ts` (referência exata)

```ts
// Base: BASE_BFF_URL ou fallback proxy
listSettlements(params)          // GET /public/settlement?page&limit&status&date
getSettlement(id)                 // GET /public/settlement/{id}
importSettlementCSV(file)        // POST /public/settlement/import (multipart)
listSettlementFiles(params)      // GET /public/settlement/files?page&limit
```

**Auth:** Bearer token em todas as chamadas (`useAuthStore.accessToken`).

### `reconciliationService.ts` (referência exata)

```ts
fetchReconciliationSummary()           // GET /report/recon-summary?order_by=consolidation_date&order=DESC
fetchReconciliationIncomingOutgoingByGroupCode(date)
  // GET /report/recon-incoming-outgoing-by-group-code?consolidation_date_eq=YYYY-MM-DD
fetchReconMismatchByConsolidationID(consolidationId)
  // GET /report/recon-mismatch/{consolidationId}
```

### `Settlement` type (idêntico ao nosso!)

```ts
interface Settlement {
  id, messageId, operationId, operationType, settlementDate, movementDate,
  ispbPayer, ispbReceiver, originAgent, destinationAgent, instrumentType,
  paymentArrangement, originalValue: DecimalValue, netValue, feeValue?,
  currency, chamber, settlementCode, priority, payerAccount?: Account,
  receiverAccount?: Account, status, errorCode?, errorMessage?,
  queueSource?, queueReceivedAt?, queueProcessedAt?, createdAt
}
```

> **Confirmação:** nossos `src/services/types/settlement.types.ts` já casam 100% com isso. Só falta plugar a real.

### Integrations — Provider (chave pra Canais!)

```ts
interface Provider {
  id: string
  name: string             // "Cielo", "Rede", "Stone", ...
  logo: string
  merchantId: string       // ← MID por adquirente
  merchantKey: string      // credencial extra
  status: 'connected' | 'pending' | 'processing' | 'error'
}
```

**Insight gigante:** `Provider` no yby-ui é exatamente o nosso conceito de "Canal/Adquirente vinculado" (na tab Canais do Onboarding EC). O backend correspondente é `yby-organization-api /pkg/domains/integrations/providers/` + `credentials/`.

- `Provider` (org-api) → metadados do adquirente disponível (Cielo/Rede/etc) + canais que ele suporta (CP/CNP)
- `Credential` (org-api) → vínculo merchant ↔ provider, com `merchantId` (MID) + `merchantKey`
- **Não há CP/CNP separado no Credential** — provavelmente um `Credential` por canal ou um campo `channel` no Credential.

**Action:** olhar `yby-organization-api/pkg/domains/integrations/credentials/` mais a fundo antes de modelar.

---

## 10. **Modelo Provider/Credential — RESOLVIDO!** (descoberta da rev 2)

Após inspecionar `yby-organization-api/pkg/domains/integrations/`, confirma-se que o backend **já tem modelagem completa** pra Canais e MID-por-adquirente. Não precisa de modelagem nova.

### `Provider` (catálogo de adquirentes disponíveis)

```go
type ProviderData struct {
  Type    ProviderType    // "payment_processor" | "antifraud_processor" | "banking_entity" | "merchant_directory"
  Context ProviderContext // "card_present" | "card_not_present" | "unknown"  ← CP/CNP!
  Name    string          // "Cielo", "Rede", "Stone", "Getnet", "PagSeguro", ...
  Enabled *bool
}
```

**Listagem agrupada por canal:**
```go
type ProvidersListResponse struct {
  Channels []ProviderChannelResponse  // ex: [{name:"card_present", providers:[Cielo,Rede,Stone]}, {name:"card_not_present", providers:[Getnet,PagSeguro]}]
}
type ProviderChannelResponse struct {
  Name      string
  Providers []ProviderItemResponse  // {ID, Name}
}
```

### `Credential` (vínculo merchant ↔ provider com MID)

```go
type CredentialData struct {
  AuthenticationData JSONB    // ← contém MID, secret, etc (esquema livre por provider)
  AdditionalData     JSONB    // ← metadados extras
  TestMode           *bool    // sandbox ou produção
  Enabled            *bool    // habilitar/desabilitar
  ProviderID         id.ID    // FK pra Provider (define qual adquirente + canal)
  // BaseOrganizationModel embute OrganizationID (o EC/Merchant dono)
}
```

**Criação:**
```go
type CredentialRequest struct {
  AcquirerID, SubacquirerID, MerchantID, ISO *id.ID  // owner da credencial
  ProviderType    ProviderType                       // payment_processor
  ProviderContext ProviderContext                    // card_present / card_not_present
}
```

### **Mapeamento perfeito Yby Front ↔ Backend**

| Yby Front (atual) | Backend (existente) |
|-------------------|---------------------|
| `MerchantFormData.canais.cp.enabled` | Não há flag "canal enabled por merchant" — credenciais que existirem **com ProviderContext=card_present** = canal CP ativo. Default visual seria: canal habilitado se houver pelo menos 1 credential ativa. |
| `MerchantFormData.canais.cp.adquirentes[]` | Lista de `Credential` com `ProviderContext=card_present` filtrada por `MerchantID` |
| `adquirenteId` (cielo/rede/stone) | `ProviderID` |
| `mid` | `AuthenticationData.merchantId` (string dentro do JSONB) |

### Implicações para o Yby Front

1. **Tab Canais não precisa de modelo novo** — basta consumir `GET /api/.../integrations/credentials?merchantId=X` e agrupar por `Provider.Context`.
2. **Flag enabled CP/CNP** é deduzida: se `count(credentials where context=card_present)` > 0 → canal ativo. Ou pode usar `Enabled` booleano da credential individual (mais granular).
3. **Lista de adquirentes disponíveis** vem de `GET /api/.../integrations/providers` (agrupada por context).
4. **Naming front:** podemos manter "Adquirente" e "MID" no UI, mas mapear pra `Provider` e `AuthenticationData.merchantId` no service layer.

### Endpoints REST esperados (a confirmar nos handlers)

| Provável endpoint | Função |
|-------------------|--------|
| `GET /api/providers?context=card_present` | Lista adquirentes disponíveis no canal CP |
| `GET /api/providers?context=card_not_present` | Idem CNP |
| `GET /api/credentials?merchantId=X` | Lista credenciais do merchant (todos canais) |
| `POST /api/credentials` | Criar credencial (vincular merchant a provider com MID) |
| `PUT /api/credentials/{id}` | Atualizar (mudar MID, enabled, testMode) |
| `DELETE /api/credentials/{id}` | Remover vínculo |

> **Action:** abrir handlers em `yby-organization-api/pkg/domains/integrations/providers/transport/` e `credentials/transport/` para confirmar paths exatos. Não estavam no swagger gerado da rev 1.

---

## 11. Gloss­ário atualizado (rev 2)

| Termo PT (Yby Front) | Backend EN | Tabela DB |
|----------------------|------------|-----------|
| Sub-adquirente | `Organization{Type:subacquirer}` | `organizations` |
| Estabelecimento Comercial (EC) / Merchant | `Organization{Type:merchant, ParentID:sub_id}` | `organizations` |
| Adquirente (na tab Canais) | `Provider{Type:payment_processor}` | `int_providers` |
| Canal | `ProviderContext` enum (`card_present` / `card_not_present`) | (enum) |
| MID | `Credential.AuthenticationData.merchantId` | `int_credentials` (JSONB) |
| Vínculo merchant ↔ adquirente | `Credential` | `int_credentials` |
| Status de canal habilitado | (não tem campo único; deduzido por `count(credentials)` ou usar `Credential.Enabled`) | — |
| Terminal | `Terminal` (em `yby-terminal-api`) | (não auditado em detalhe) |
| TID | `TerminalID` no path, struct ainda não mapeada | (a confirmar) |
| CNPJ | `TaxID` | `organizations.tax_id` |
| Razão social | `CorporateName` | `organizations.corporate_name` |
| Nome fantasia | `DBAName` | `organizations.dba_name` |
| MCC | `MerchantCategoryCode` | `organizations.merchant_category_code` |
| CNAE | `EconomicActivityCode` | `organizations.economic_activity_code` |
| Faturamento mensal | `MonthlyRevenueRange` | reference table |
| Banco recebedor | `Bank` / `BankAccount` | reference + relation |
| Endereço | `Address` (FK em `organizations.address_id`) | `addresses` |
| Liquidação | `Settlement` | `settlements` |
| Reconciliação | `Reconciliation` | `reconciliations` |
| Recebível | `Receivables` / `Calendar` / `Anticipation` / `Funding` / `Payment` | (`yby-ledger`) |
| Custo (tarifa por bandeira) | `Cost`, `CostBlueprint` | (`yby-pricing-economics-api`) |
| Preço | `Price`, `PriceBlueprint` | (`yby-pricing-economics-api`) |
| Parcela | `Installment` | reference |
| Comunicação | `EmailNotification`, `EmailTemplate` | `email_*` (`yby-notification-api`) |
| Webhook | `WebhookConfiguration`, `WebhookEvent` | `webhook_*` |
| Link de pagamento | `PaymentLink` | (`yby-payment-link-api`) |
| Audit log | `AuditEvent` | `audit_events` (`yby-audit-api`) |
| BIN | `CardBin`, `VisaBin` | (`yby-bin-api`) |
| Interchange | `Itc` (intra/inter), `BaseRate`, `LargeTicket` | (`yby-interchange-api`) |

---

## 12. Roadmap revisado (rev 2)

### Onda 0 — Infra de integração (1-2 dias)

- [ ] **Validar `apiClient.ts`** suporta envio de header `X-Organization-ID` e Bearer token.
- [ ] **Mock auth interim**: criar wrapper em `authService.ts` que simula Keycloak (token + organization mock) até liberação real. Garantir que `useOrganizationType`-equivalente já saiba o tipo da org do mock (`merchant`/`subacquirer`/`acquirer`).
- [ ] **Variável `NEXT_PUBLIC_BFF_URL`** apontando para DEV (validar endpoint).

### Onda 1 — Reference data (1 dia)

- [ ] Service `referenceService.ts`: `getBanks()`, `getMerchantCategories()` (MCCs), `getMonthlyRevenueRanges()`, `getEconomicActivities()` (CNAEs).
- [ ] Substituir mocks `BANCOS`, `MCCS`, `FATURAMENTOS`, `CNAES` em `src/mocks/sub/merchant-onboarding.ts`.

### Onda 2 — Onboarding EC real (2-3 dias)

- [ ] `organizationService.ts`: `createMerchant(MerchantFormData) → MerchantData → POST /api/onboarding`.
- [ ] Mapear DTO front (camelCase PT) ↔ backend (camelCase EN): `razaoSocial → company.name + corporateName`, `cnpj → company.taxId`, `mcc → merchantCategoryId` (via lookup), `cnae → economicActivityId`.
- [ ] `getMerchants(filter)`: confirmar endpoint (provavelmente `GET /api/organizations?type=merchant&parentId=...`).
- [ ] `getMerchant(id)`, `updateMerchant(id, data)`.

### Onda 3 — Canais (Providers + Credentials) (2-3 dias)

- [ ] `providersService.ts`: `getProviders(context: 'card_present' | 'card_not_present')`.
- [ ] `credentialsService.ts`: `getCredentialsByMerchant(merchantId)`, `createCredential(...)`, `updateCredential(id, ...)`, `deleteCredential(id)`.
- [ ] Refactor `CanaisTab.tsx`: substituir mock `ADQUIRENTES` por providers reais; ao salvar, criar `Credential` por adquirente vinculado.

### Onda 4 — Terminais (1-3 dias, depende do backend)

- [ ] Confirmar com backend qual o endpoint correto para CRUD de Terminal (não está no swagger).
- [ ] Mapear `Terminal + TerminalVinculo[]` (front) ↔ backend.
- [ ] Conectar `TerminaisTab.tsx`.

### Onda 5 — Pricing/Cost/Price (1-2 dias)

- [ ] `pricingService.ts` (real): `getCostBlueprints()`, `getCostBlueprint(id)`, `getPriceBlueprints()`, `getPriceBlueprint(id)`, `getInstallments()`.
- [ ] Via BFF: `/public/pricing/*`.

### Onda 6 — Financeiro (Settlement + Reconciliation) (2-3 dias)

- [ ] Atualizar `settlementService.ts` para usar endpoints reais via BFF.
- [ ] Atualizar `reconciliationService.ts` (`/report/recon-summary`, `/report/recon-mismatch/{id}`, `/report/recon-incoming-outgoing-by-group-code`).

### Onda 7 — Agenda (Receivables) (1-2 dias)

- [ ] Service `receivablesService.ts` via BFF: `/public/receivables-calendar/{summary, calendar, calendar/{date}, installments, batches, anticipations, funding, payments}`.

### Onda 8 — Comunicações + Audit + Payment Links (3-5 dias)

- [ ] **Comunicações**: integrar com `yby-notification-api` (e-mail + webhooks).
- [ ] **Audit**: tela "Logs de Atividades" consumindo `yby-audit-api`.
- [ ] **Payment Links**: tela "Income / Cobranças" consumindo `yby-payment-link-api`.

### Onda 9 — Auth real (depende da Tupi liberar Keycloak)

- [ ] Trocar mock auth por integração Keycloak + `/api/admin/auth`.
- [ ] Implementar wrappers `auth`, `isMerchant`, `isAcquirer`, `isSubacquirer` (parecido com yby-ui).
- [ ] Forgot password flow via `/api/users/generate-reset-password-token` + redefine.

---

## 13. Conclusões executivas (rev 2)

### O que mudou em relação à rev 1

1. **Canais e MID-por-adquirente NÃO eram gap** — backend já tem `Provider` (com `Context: card_present | card_not_present`) + `Credential` (com `AuthenticationData JSONB` contendo MID). Modelagem perfeita pro nosso UI.
2. **`yby-ui` (frontend produção)** já implementa Onboarding, Settlement, Reconciliation, Integrations, Payment Links — usaremos como **referência de contratos exatos**.
3. **`Settlement` types do nosso front batem 100%** com yby-ui — só falta plugar BFF.
4. **Recebíveis (agenda)** está em `yby-ledger` mas exposto via `yby-bff /public/receivables-calendar/*`.
5. **Interchange é principalmente worker**, mas pode ter endpoints não documentados — confirmar.
6. **Terminal é o único gap real** — só achei endpoint de initialization. Falta CRUD.

### Top 5 ações imediatas (sem Keycloak)

1. **Mock auth + organization context** — criar fake `useAuthStore` que injeta `organization.type` no Yby Front (sem Keycloak ainda).
2. **Reference data real** — `/api/public/banks`, `/api/public/merchant-categories`, `/api/public/monthly-revenue-ranges`, `/api/admin/economic_activities`. **Substituir nossos 4 mocks**.
3. **Onboarding real** — `POST /api/onboarding` recebe `{admin, company}`. Mapear `MerchantFormData → MerchantData`.
4. **Providers + Credentials** — endpoint exato a confirmar com backend. Refactor `CanaisTab`.
5. **Settlement real** — apenas configurar `BASE_BFF_URL` + ligar nosso `settlementService.ts` ao BFF.

### Riscos / dependências

- ⚠️ **Keycloak**: bloqueado até time backend liberar acesso. Mock interim resolve por enquanto.
- ⚠️ **Endpoint `GET /api/organizations?type=merchant`**: a confirmar — não está documentado no swagger encontrado.
- ⚠️ **Endpoint de Providers/Credentials REST**: a confirmar — modelo existe mas paths não estão no swagger gerado.
- ⚠️ **Terminal CRUD**: gap real, precisa conversa com backend.
- ⚠️ **Schema do `MerchantOnboarding` no front é mais rico** que o `OnboardingRequest` do backend (não tem address, contato, banco, faturamento no payload de criação). Avaliar se backend tem endpoints separados pra completar pós-onboard ou se precisa expandir o `CompanyData`.

### Onde focar essa semana

**Recomendação:** Onda 0 (mock auth + apiClient config) + Onda 1 (reference data) já dão **muito ganho com risco zero** — substitui 4 mocks de uma vez e prepara base pras próximas. ~2 dias de trabalho.

Depois, Onda 2 (onboarding real) é a próxima de maior impacto — conecta diretamente o que acabamos de construir (3 modos create/view/edit).

Ondas 3-5 podem rodar em paralelo conforme backend confirma os endpoints de Providers/Credentials/Terminal/Pricing.

1. **Backend modela Merchant como `Organization{Type:merchant, ParentID:sub_id}`** — não tem entidade "Merchant" separada. Front precisa adaptar terminologia ao enviar/receber.
2. **`/api/onboarding` cria org + admin user num único request** — útil para o fluxo CREATE.
3. **Reference data (banks/MCCs/CNAEs/faturamento) já está exposto** — quick win pra remover mocks.
4. **Channel (CP/CNP) e MID por adquirente NÃO têm modelo claro no backend** — provavelmente precisa modelagem nova ou aproveitamento do `Credential`/`Provider` em integrations. **Conversar com backend antes de implementar a integração**.
5. **Terminais + vínculos com TID ainda têm gap** — só há endpoint de initialization. Conversar com time terminal-api.
6. **Yby Front está com `apiClient.ts` pronto pra modo mock/real** — boa base. Falta plugar os endpoints reais um a um.
7. **Auth precisa integrar Keycloak** — frontends Tupi devem ter padrão (verificar `yby-ui` ou `chargeback-portal` como referência).
8. **Onda 1 (reference data + auth) pode ser entregue rápido**. Ondas 2-3 dependem de alinhamento com backend pra Canais/Terminais.
