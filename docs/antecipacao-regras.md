# Antecipação — regras de visualização e cálculo

> Documento vivo. Toda mudança de regra precisa atualizar este arquivo
> antes de mexer em código de Antecipações, Liquidações ou Agenda.

## Conceitos

- **Operação de antecipação** — ato único onde o EC (ou Sub/Adquirente) decide
  trocar valor futuro por valor presente, com desconto de taxa. Uma operação
  consolida 1+ parcelas antecipadas.
- **Parcela antecipada** — parcela específica de uma transação parcelada cujo
  valor (total ou parcial) foi adiantado.
- **Antecipação parcial** — quando o valor antecipado de uma parcela é menor
  que o valor original. O restante continua previsto pra data original.
- **Gravame** — termo contábil pra "compromisso/garantia" do recebível
  antecipado. Aparece na Agenda como **antecipações recebidas** (entrada do
  dia em que cai) e **antecipações já feitas** (saída futura, porque o
  dinheiro já caiu antes).

## Visualização — princípio

> *"Interface fácil que pode ser expandida com vários detalhes."*
> — Bruno, 08/05/2026

1. Linha **consolidada por operação** é o default. Mostra:
   - ID da operação · Data · Quantidade de parcelas · Valor bruto · Taxa · Valor líquido.
   - Tag "X parcial" quando alguma das parcelas tem antecipação parcial.
2. **Expand row** revela tabela aninhada com cada parcela:
   - NSU · Parcela (X/N) · Bandeira · Data prevista original · Valor original ·
     Valor antecipado · Taxa · Valor líquido.
   - Cada linha de parcela parcial tem **Tag "Antecipado"** + tooltip explicando
     o valor restante e a data em que cairá.

## Regras de cálculo

### Antecipação de uma parcela inteira
```
valorAntecipado  = valorOriginal
valorLiquido     = valorAntecipado − taxa
parcial          = false
```

### Antecipação parcial
```
valorAntecipado  < valorOriginal
valorRestante    = valorOriginal − valorAntecipado     // continua previsto
valorLiquido     = valorAntecipado − taxa
parcial          = true
```

### Operação consolidada (várias parcelas)
```
valorBruto  = Σ valorAntecipado  das parcelas
taxa        = Σ taxa            das parcelas
valorLiquido = Σ valorLiquido   das parcelas
quantidadeTransacoes = parcelas.length
```

### Exemplo realista
EC tem R$ 70.000 a receber em parcelas futuras. Quer antecipar R$ 50.000.

```
Operação OP-001  — alvo R$ 50.000
├── Parcela 4/12 (NSU 374958673)  — R$ 20.000 inteira, taxa R$ 200
├── Parcela 5/12 (NSU 374958673)  — R$ 20.000 inteira, taxa R$ 200
└── Parcela 3/4  (NSU 290838391)  — R$ 10.000 PARCIAL (de R$ 15.000), taxa R$ 100
                                     R$ 5.000 restantes continuam previstos
                                     pra 15/03/2026

→ Valor bruto antecipado: R$ 50.000
→ Taxas:                  R$ 500
→ Líquido na conta:       R$ 49.500
```

## Reflexo na Agenda

- **No dia em que a antecipação cai**: aparece em "Vou receber" como
  *"Antecipações recebidas (gravame)"*.
- **No dia em que a parcela CAIRIA originalmente**: aparece em "O que sai"
  como *"Parcelas já antecipadas (gravame)"* — porque o dinheiro já entrou
  antes via antecipação.
- Saldo **líquido a receber no dia** continua coerente porque +entrada e
  −dedução se compensam pelo que já foi pago.

## Validação cruzada

| Tela | Como antecipação aparece |
|---|---|
| `EcAntecipacoes` | Operações consolidadas + expand parcela-a-parcela |
| `EcLiquidacoes`  | Cada parcela liquidada com status "Crédito Vendido" quando foi antecipada antes |
| `EcAgenda`       | "Antecipações recebidas (gravame)" no dia da queda + "Parcelas já antecipadas (gravame)" no dia original |
| `EcExtrato`      | Movimentações com descrição mencionando antecipação quando aplicável |

## Aplicabilidade entre personas

- **EC v0**: antecipação automática default (FigJam V0 EC). UI mostra resultado.
- **SUB v0**: hoje gerencia antecipações concedidas a ECs (já existe `/financial/antecipacoes`).
- **AQ v0**: stub — backlog futuro.
- **V1++**: configuração avançada (programada, regras por MCC, etc.) — backlog.

## Pixel/Rian — heurísticas aplicadas

- **Cap. 9 (não-impostor)**: o tooltip da parcela parcial sempre mostra o valor
  exato restante e a data em que cairá. Sem esconder.
- **Cap. 6 (enquadramento)**: KPI "Líquido na conta" em verde como número-rei.
  Taxa cobrada em vermelho mas tipograficamente menor — não dramatizar.
- **Cap. 7 (fadiga)**: linha consolidada como default. Detalhe é opt-in via
  expand. EC pequeno não precisa lidar com 30 parcelas se quer só saber
  quanto entrou.
- **Cap. 4 (custo afundado)**: a tela permite simular antes (botão "Simular
  antecipação" → Drawer). Custo de explorar é zero — não prende em decisão.
