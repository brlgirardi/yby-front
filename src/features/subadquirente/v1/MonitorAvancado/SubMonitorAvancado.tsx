'use client'
// SUB v1 — Monitorando operação avançada (FigJam 140:491).
// Dashboard real-time com KPIs por categoria + alertas + drill-down + ações.
//
// Pixel/Rian (Enviesados):
// - cap. 7 (fadiga): KPIs agrupados por categoria, alertas ordenados por severidade
// - cap. 8 (afeto): vermelho só pra alertas críticos · amarelo pra avisos
// - cap. 1 (ancoragem): exposição atual vs máxima sempre lado a lado

import { useState } from 'react'
import KpiCard from '@/components/ui/KpiCard'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import PageHeader from '@/components/shared/PageHeader'
import Tag from '@/components/shared/Tag'
import Icon from '@/components/shared/Icon'
import Drawer from '@/components/shared/Drawer'
import { Tag as AntTag, Progress } from 'antd'
import {
  subKpisCategoria,
  subAlertas,
  subTopEcs,
  type KpisCategoria,
  type Alerta,
  type TopEc,
  type Categoria,
  type AlertaSeveridade,
} from '@/mocks/sub/monitor-avancado'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

const fmtBRLShort = (v: number) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (v >= 1_000)     return `R$ ${(v / 1_000).toFixed(0)}k`
  return fmtBRL(v)
}

const sevColor: Record<AlertaSeveridade, { bg: string; border: string; text: string; label: string }> = {
  critico: { bg: '#FFF1F0', border: '#FFA39E', text: '#FF4D4F', label: 'Crítico' },
  aviso:   { bg: '#FFFBE6', border: '#FFE58F', text: '#D48806', label: 'Aviso' },
  info:    { bg: '#E6F7FF', border: '#91D5FF', text: '#1890FF', label: 'Info' },
}

const categoriaTag = (cat: Categoria) => {
  const map: Record<Categoria, { color: string; label: string }> = {
    Bronze: { color: 'orange',  label: 'Bronze' },
    Prata:  { color: 'default', label: 'Prata' },
    Ouro:   { color: 'gold',    label: 'Ouro' },
  }
  const { color, label } = map[cat]
  return <AntTag color={color} style={{ marginInlineEnd: 0 }}>{label}</AntTag>
}

export default function SubMonitorAvancado() {
  const [selectedAlerta, setSelectedAlerta] = useState<Alerta | null>(null)

  const totalVolume = subKpisCategoria.reduce((acc, k) => acc + k.volume30d, 0)
  const totalExposicao = subKpisCategoria.reduce((acc, k) => acc + k.exposicaoAtual, 0)
  const totalEcs = subKpisCategoria.reduce((acc, k) => acc + k.ecsAtivos, 0)
  const alertasCriticos = subAlertas.filter((a) => a.severidade === 'critico').length

  const topEcsCols: ColumnType<TopEc>[] = [
    { title: '#', dataIndex: 'rank', key: 'rank', width: 50, align: 'center' },
    {
      title:  'EC',
      key:    'ec',
      render: (_: unknown, row: TopEc) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500 }}>{row.ec}</span>
          {categoriaTag(row.categoria)}
        </span>
      ),
    },
    {
      title:  'Volume 30d',
      key:    'volume',
      align:  'right',
      width:  140,
      render: (_: unknown, row: TopEc) => fmtBRLShort(row.volume30d),
    },
    {
      title:  'Exposição atual',
      key:    'exposicao',
      align:  'right',
      width:  150,
      render: (_: unknown, row: TopEc) => (
        <span style={{ color: '#FA8C16', fontWeight: 500 }}>{fmtBRLShort(row.exposicaoAtual)}</span>
      ),
    },
    { title: 'Última atividade', dataIndex: 'ultimaAtividade', key: 'ultima', width: 170 },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader title="Visão geral" breadcrumb="Sub-adquirente · v1 / Antecipação / Visão geral" />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPIs globais */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><KpiCard label="Volume total 30d"   value={fmtBRLShort(totalVolume)}    subLabel="Antecipado nos últimos 30 dias" variant="info" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Exposição corrente" value={fmtBRLShort(totalExposicao)} subLabel="Capital comprometido agora"      variant="warning" /></div>
          <div style={{ flex: 1 }}><KpiCard label="ECs ativos"          value={String(totalEcs)}             subLabel="Com operação no mês"            variant="success" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Alertas críticos"   value={String(alertasCriticos)}      subLabel={alertasCriticos > 0 ? 'Ação operacional necessária' : 'Tudo nominal'} variant={alertasCriticos > 0 ? 'error' : 'success'} /></div>
        </div>

        {/* KPIs por categoria */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>KPIs por categoria</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Volume, exposição vs limite, aprovação manual e SLA por nível de EC</div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', gap: 16 }}>
            {subKpisCategoria.map((cat) => {
              const expoPct = (cat.exposicaoAtual / cat.exposicaoMax) * 100
              const expoCor = expoPct > 80 ? '#FF4D4F' : expoPct > 50 ? '#FA8C16' : '#52C41A'
              return (
                <div key={cat.categoria} style={{ flex: 1, border: '1px solid #f0f0f0', borderRadius: 2, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    {categoriaTag(cat.categoria)}
                    <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{cat.ecsAtivos} ECs ativos</span>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Volume 30d</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1890FF' }}>{fmtBRLShort(cat.volume30d)}</div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>
                      <span>Exposição</span>
                      <span style={{ color: expoCor, fontWeight: 600 }}>{expoPct.toFixed(0)}%</span>
                    </div>
                    <Progress percent={expoPct} showInfo={false} size="small" strokeColor={expoCor} />
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>
                      {fmtBRLShort(cat.exposicaoAtual)} / {fmtBRLShort(cat.exposicaoMax)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Aprov. manual</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: cat.aprovacaoManualPct > 20 ? '#FA8C16' : '#52C41A' }}>{cat.aprovacaoManualPct}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>SLA hit</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: cat.slaHitRate >= 95 ? '#52C41A' : '#FA8C16' }}>{cat.slaHitRate}%</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alertas */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Alertas inteligentes</div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Ordenados por severidade · ações operacionais sugeridas</div>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{subAlertas.length} alertas ativos</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {subAlertas.map((alerta, i) => {
              const sev = sevColor[alerta.severidade]
              return (
                <div
                  key={alerta.id}
                  onClick={() => setSelectedAlerta(alerta)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 20px',
                    borderBottom: i < subAlertas.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#fafafa')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <div style={{ width: 6, height: 36, background: sev.text, borderRadius: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, padding: '1px 8px', background: sev.bg, color: sev.text, border: `1px solid ${sev.border}`, borderRadius: 2, fontWeight: 600 }}>{sev.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{alerta.titulo}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', marginBottom: 4 }}>{alerta.contexto}</div>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{alerta.detectadoEm}</div>
                  </div>
                  <Icon name="chevronRight" size={14} color="rgba(0,0,0,0.35)" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Top ECs (drill-down) */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Top ECs por volume</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>Drill-down: clique pra ver detalhe do EC e timeline de transações</div>
          </div>
          <div style={{ padding: '0 20px 16px' }}>
            <DataTable<TopEc>
              columns={topEcsCols}
              dataSource={subTopEcs}
              rowKey="ecId"
              showPagination={false}
            />
          </div>
        </div>
      </div>

      {/* Drawer detalhe do alerta */}
      <Drawer
        open={selectedAlerta !== null}
        onClose={() => setSelectedAlerta(null)}
        title="Detalhes do alerta"
        width={520}
        footer={
          <>
            <button style={{ flex: 1, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }}>Marcar como resolvido</button>
            <button style={{ flex: 1, border: 'none', background: '#1890FF', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: '#fff', fontWeight: 500 }}>Tomar ação</button>
          </>
        }
      >
        {selectedAlerta && (
          <>
            <div style={{ marginBottom: 16, padding: '12px 14px', background: sevColor[selectedAlerta.severidade].bg, border: `1px solid ${sevColor[selectedAlerta.severidade].border}`, borderRadius: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, padding: '1px 8px', background: '#fff', color: sevColor[selectedAlerta.severidade].text, border: `1px solid ${sevColor[selectedAlerta.severidade].border}`, borderRadius: 2, fontWeight: 600 }}>
                  {sevColor[selectedAlerta.severidade].label}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedAlerta.titulo}</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.75)' }}>{selectedAlerta.contexto}</div>
            </div>

            {[
              { label: 'ID',           value: selectedAlerta.id },
              { label: 'Tipo',         value: selectedAlerta.tipo.replaceAll('-', ' ') },
              { label: 'Detectado em', value: selectedAlerta.detectadoEm },
              ...(selectedAlerta.ec ? [{ label: 'EC envolvido', value: `${selectedAlerta.ec} (${selectedAlerta.ecId})` }] : []),
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>{r.label}</span>
                <span style={{ fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}

            {selectedAlerta.acaoSugerida && (
              <div style={{ marginTop: 20, padding: '12px 14px', background: '#E6F7FF', border: '1px solid #91D5FF', borderRadius: 2 }}>
                <div style={{ fontSize: 12, color: '#1890FF', fontWeight: 600, marginBottom: 6 }}>Ação sugerida</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.75)' }}>{selectedAlerta.acaoSugerida}</div>
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Ações operacionais disponíveis</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: 'logOut',     label: 'Pausar antecipação por EC',  desc: 'Bloqueia novas operações enquanto a investigação roda' },
                  { icon: 'reconcile',  label: 'Forçar retry imediato',       desc: 'Tenta reprocessar operações com falha' },
                  { icon: 'x',          label: 'Cancelar operação ativa',     desc: 'Reverte transação não liquidada' },
                  { icon: 'edit',       label: 'Ajustar limite temporário',   desc: 'Eleva o teto da categoria por X horas' },
                ].map((a) => (
                  <div key={a.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#fafafa', borderRadius: 2, border: '1px solid #f0f0f0', cursor: 'pointer' }}>
                    <Icon name={a.icon} size={14} color="rgba(0,0,0,0.65)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}
