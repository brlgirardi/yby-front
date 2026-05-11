'use client'
// Resultado IA — saída consolidada dos 2 fluxos (Pricing + Platinização).
// Mesmo dashboard, alimentado por mocks. Reuso do design system Yby.

import { useRouter, useSearchParams } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import Tooltip from '@/components/atoms/Tooltip'
import Icon from '@/components/atoms/Icon'
import BrandLogo from '@/components/atoms/BrandLogo'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import StarRating from '@/features/adquirente/v0/shared/StarRating'
import ScoreGauge, { tierFromScore } from '@/features/adquirente/v0/shared/ScoreGauge'
import CardSection from '@/components/shared/CardSection'
import { useTheme } from '@/stores/themeStore'
import {
  classificacaoSetor,
  avaliacaoImagens,
  taxasPorBandeira,
  dadosEstabelecimentoMock,
  scoreMock,
  insightsEstrategicos,
  recomendacoesCarteira,
  type BandeiraTaxa,
} from '@/mocks/adquirente/resultado-ia'

const BANDEIRAS: BandeiraTaxa[] = ['Mastercard', 'Visa', 'Elo', 'Amex']

const fmtPct = (v: number) => `${v.toFixed(2).replace('.', ',')}%`

// Reframing ético (Pixel/Rian): rating ≤ 2 vira label de oportunidade.
// Mantém a estrela visível — só muda o título pra abrir conversa de upside.
const REFRAME_LABELS: Record<string, string> = {
  'Engajamento Local':     'Oportunidade de crescimento local',
  'Renda':                 'Potencial de aceleração de renda',
  'Educação':              'Mercado em desenvolvimento educacional',
  'Infraestrutura':        'Espaço para parcerias estruturais',
  'Contexto Habitacional': 'Crescimento residencial em curso',
}
function reframeLabel(label: string, rating: number): string {
  if (rating > 2) return label
  return REFRAME_LABELS[label] ?? label
}

export default function AqResultadoIA() {
  const router = useRouter()
  const params = useSearchParams()
  const theme = useTheme()
  const origem = params.get('origem') ?? 'pricing'  // 'pricing' | 'platinizacao'
  // Bloco "Avaliação das imagens" só aparece se o usuário fez upload no fluxo Pricing.
  const imagensUploaded = params.get('imagens') === 'sim'

  const breadcrumbBase = origem === 'platinizacao'
    ? 'Adquirente / Ferramentas de Vendas / Análise de Platinização / Resultado'
    : 'Adquirente / Ferramentas de Vendas / IA de Precificação / Resultado'

  const onNovaConsulta = () => {
    router.push(origem === 'platinizacao' ? '/adquirente/vendas/platinizacao' : '/adquirente/vendas/pricing')
  }
  const onExportarProposta = () => {
    if (typeof window !== 'undefined') window.print()
  }

  return (
    <div data-aq-print="root" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Resultado da análise"
        breadcrumb={breadcrumbBase}
        extra={
          <div data-aq-print="hide" style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost"   icon="download" onClick={onExportarProposta}>Exportar proposta</Button>
            <Button variant="primary" icon="plus"     onClick={onNovaConsulta}>Nova consulta</Button>
          </div>
        }
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Banner topo: feedback que a análise foi gerada */}
        <div style={{
          background: theme.gradientFrom,
          border: `1px solid ${theme.primarySoft}`,
          borderRadius: 2,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}>
          <Icon name="sparkles" size={16} color={theme.primary} />
          <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.75)', lineHeight: '20px' }}>
            <strong style={{ color: theme.primary }}>Análise concluída pela {theme.label.toUpperCase()} Analytics.</strong>{' '}
            {origem === 'platinizacao'
              ? 'Score de platinização e recomendações de carteira baseadas no arquivo enviado, cruzados com benchmarks de mercado.'
              : 'Score de platinização, taxas sugeridas e insights baseados em perfil comercial, vizinhança e mix de produtos. Margens são editáveis.'}
          </div>
        </div>

        {/* Score de Platinização — número-rei + Tier + Insights estratégicos */}
        {(() => {
          const t = tierFromScore(scoreMock)
          return (
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, padding: 32, display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32, alignItems: 'center' }}>
              {/* Coluna esquerda — gauge + tier */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <ScoreGauge value={scoreMock} tier={t.tier} size={220} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    background: t.color,
                    color: '#fff',
                    borderRadius: 2,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}>
                    Tier {t.tier}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Faixa {t.range} pontos</span>
                </div>
              </div>

              {/* Coluna direita — headline (number-rei do storytelling) + insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
                    Score de Platinização
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: 'rgba(0,0,0,0.88)', lineHeight: '36px', marginBottom: 8 }}>
                    Potencial comercial alto
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)', lineHeight: '22px' }}>
                    Estabelecimento qualificado para portfolio premium. Os insights abaixo destacam oportunidades concretas de pricing, antecipação e crescimento.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {insightsEstrategicos.map((ins) => (
                    <div key={ins.titulo} style={{
                      background: '#FAFAFA',
                      border: '1px solid #f0f0f0',
                      borderRadius: 2,
                      padding: '12px 14px',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: 4, background: theme.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name={ins.icon} size={14} color={theme.primary} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 2 }}>{ins.titulo}</div>
                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)', lineHeight: '16px' }}>{ins.descricao}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Classificação do setor */}
        <CardSection icon="barChart" title="Classificação do setor">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {classificacaoSetor.map((c) => (
              <div key={c.label} style={{
                background: '#FAFAFA',
                border: '1px solid #f0f0f0',
                borderRadius: 2,
                padding: '14px 12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 6,
                  background: theme.primaryBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={c.icon} size={18} color={theme.primary} />
                </div>
                <Tooltip bare text={c.hint}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.85)', borderBottom: '1px dotted rgba(0,0,0,0.25)', cursor: 'help', textAlign: 'center' }}>
                    {reframeLabel(c.label, c.rating)}
                  </span>
                </Tooltip>
                <StarRating value={c.rating} size={11} />
              </div>
            ))}
          </div>
        </CardSection>

        {/* Avaliação das imagens — empty state quando origem=pricing sem upload */}
        {origem === 'pricing' && !imagensUploaded && (
          <CardSection icon="eye" title="Avaliação das imagens">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '20px 24px',
              background: '#FAFAFA',
              border: '1px dashed #d9d9d9',
              borderRadius: 2,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 4, background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="eye" size={18} color="rgba(0,0,0,0.35)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.75)', marginBottom: 2 }}>
                  Análise visual indisponível
                </div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: '18px' }}>
                  Imagens do estabelecimento não foram anexadas. Refazer a consulta com fotos da fachada, interior e produtos enriquece o score com inferências de visão computacional.
                </div>
              </div>
              <Button variant="ghost" icon="upload" onClick={onNovaConsulta}>
                Refazer com imagens
              </Button>
            </div>
          </CardSection>
        )}

        {/* Avaliação das imagens — só renderiza se o usuário fez upload */}
        {imagensUploaded && (
          <CardSection icon="eye" title="Avaliação das imagens">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {avaliacaoImagens.map((a) => (
                <div key={a.label} style={{
                  background: '#FAFAFA',
                  border: '1px solid #f0f0f0',
                  borderRadius: 2,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}>
                  <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{a.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating value={a.rating} />
                    <Tooltip bare text={a.hint}>
                      <Icon name="info" size={12} color="rgba(0,0,0,0.35)" />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </CardSection>
        )}

        {/* Recomendações de carteira — exclusivo do fluxo Platinização */}
        {origem === 'platinizacao' && (
          <CardSection icon="trendingUp" title="Recomendações de carteira">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {recomendacoesCarteira.map((rec) => {
                const palette = rec.tone === 'success'
                  ? { bg: '#F6FFED', border: '#B7EB8F', accent: '#52C41A', iconBg: '#D9F7BE' }
                  : rec.tone === 'warning'
                  ? { bg: '#FFFBE6', border: '#FFE58F', accent: '#D48806', iconBg: '#FFF1B8' }
                  : { bg: '#E6F7FF', border: '#91D5FF', accent: '#1890FF', iconBg: '#BAE7FF' }
                return (
                  <div key={rec.tipo} style={{
                    background: palette.bg,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 2,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 4,
                        background: palette.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon name={rec.icon} size={16} color={palette.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>
                          {rec.titulo}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', lineHeight: '18px' }}>
                          {rec.descricao}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" icon="chevronRight" style={{ alignSelf: 'flex-end', color: palette.accent }}>
                      {rec.acao}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardSection>
        )}

        {/* Taxas detalhadas por bandeira — exclusivo do fluxo IA Pricing.
            Não faz sentido em "Análise de Platinização" (fluxo de carteira). */}
        {origem === 'pricing' && (
        <CardSection icon="filter" title="Taxas detalhadas por bandeira">
          {(() => {
            const brandHeader = (b: BandeiraTaxa) => (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center', width: '100%' }}>
                <BrandLogo brand={b} size={22} />
                <span>{b}</span>
              </div>
            )
            // Demo-friendly: célula mostra só o número-rei (Valor Final).
            // Custo e margem viram tooltip on hover pra quem quiser drill-down.
            // Por linha (modalidade), destaca a bandeira MAIS BARATA (verde) e MAIS CARA (vermelho)
            // — vendedor identifica oportunidade comparativa de uma olhada.
            const renderCell = (b: BandeiraTaxa) => (_: unknown, row: typeof taxasPorBandeira[number]) => {
              const c = row.bandeiras[b]
              const final = c.custo + c.margem
              const finals = BANDEIRAS.map((bb) => row.bandeiras[bb].custo + row.bandeiras[bb].margem)
              const min = Math.min(...finals)
              const max = Math.max(...finals)
              const isMin = final === min
              const isMax = final === max && min !== max  // não destaca se todos iguais
              const color = isMin ? '#52C41A' : isMax ? '#FF4D4F' : '#1890FF'
              const bg    = isMin ? '#F6FFED' : isMax ? '#FFF1F0' : 'transparent'
              const border = isMin ? '1px solid #B7EB8F' : isMax ? '1px solid #FFA39E' : '1px solid transparent'
              const tipParts = [
                `Custo: ${fmtPct(c.custo)} · Margem: ${fmtPct(c.margem)}`,
                isMin ? 'Menor taxa da modalidade' : isMax ? 'Maior taxa da modalidade' : '',
              ].filter(Boolean).join(' — ')
              return (
                <Tooltip bare text={tipParts}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    fontSize: 16,
                    color,
                    fontWeight: 700,
                    background: bg,
                    border,
                    borderRadius: 2,
                    cursor: 'help',
                  }}>
                    {fmtPct(final)}
                  </span>
                </Tooltip>
              )
            }
            const cols: ColumnType<typeof taxasPorBandeira[number]>[] = [
              { title: 'Modalidade', dataIndex: 'modalidade', key: 'modalidade', width: 180, render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
              ...BANDEIRAS.map((b) => ({
                title:  brandHeader(b),
                key:    `b-${b}`,
                align:  'center' as const,
                render: renderCell(b),
              })),
            ]
            return (
              <DataTable<typeof taxasPorBandeira[number]>
                columns={cols}
                dataSource={taxasPorBandeira}
                rowKey="modalidade"
                showPagination={false}
              />
            )
          })()}
        </CardSection>
        )}

        {/* Dados do estabelecimento */}
        <CardSection icon="users" title="Dados do estabelecimento">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'CNPJ',          value: dadosEstabelecimentoMock.cnpj },
              { label: 'Razão Social',  value: dadosEstabelecimentoMock.razaoSocial },
              { label: 'Nome do EC',    value: dadosEstabelecimentoMock.nomeEc },
              { label: 'CNAE',          value: dadosEstabelecimentoMock.cnae },
              { label: 'Endereço',      value: dadosEstabelecimentoMock.endereco },
              { label: 'CEP',           value: dadosEstabelecimentoMock.cep },
              { label: 'Cidade / UF',   value: `${dadosEstabelecimentoMock.cidade} / ${dadosEstabelecimentoMock.estado}` },
              { label: 'Volume mensal', value: dadosEstabelecimentoMock.volumeMensal },
              { label: 'TPV estimado',  value: dadosEstabelecimentoMock.tpvEstimado },
            ].map((r) => (
              <div key={r.label}>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 2 }}>{r.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{r.value}</div>
              </div>
            ))}
          </div>
        </CardSection>
      </div>

      {/* Print styles — geram PDF via window.print() apenas no Adquirente Resultado.
          Escondem chrome do app (sidebar, header, breadcrumbs) e formatam A4. */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 16mm 14mm;
          }
          html, body {
            background: #fff !important;
          }
          /* Esconde tudo do app shell */
          aside, nav,
          [class*="Sidebar"], [class*="sidebar"],
          [class*="GlobalHeader"], [class*="globalHeader"],
          header,
          [data-aq-print="hide"] {
            display: none !important;
          }
          /* Container principal sem scroll/overflow e sem padding extra */
          [data-aq-print="root"] {
            overflow: visible !important;
            display: block !important;
          }
          [data-aq-print="root"] > * {
            page-break-inside: avoid;
          }
          /* Cards do resultado quebram página com sentido */
          [data-aq-print="root"] section,
          [data-aq-print="root"] [class*="CardSection"] {
            break-inside: avoid;
          }
          /* Tipografia ligeiramente menor para caber em A4 */
          body {
            font-size: 11pt;
          }
        }
      `}</style>
    </div>
  )
}
