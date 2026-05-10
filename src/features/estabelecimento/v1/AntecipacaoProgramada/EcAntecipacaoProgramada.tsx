'use client'
// EC v1 — Antecipação Automática.
// Lista de regras + KPIs + drawer de criação.
//
// UX: linguagem do lojista (não "trigger" / "MCC"). Progressive disclosure —
// configuração simples por padrão, "+ Opções avançadas" pra quem quer mais.

import { useState } from 'react'
import { InputNumber, Radio, Switch } from 'antd'
import KpiCard from '@/components/ui/KpiCard'
import DataTable, { type ColumnType } from '@/components/ui/DataTable'
import AppSelect from '@/components/ui/AppSelect'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/shared/Button'
import Tag from '@/components/shared/Tag'
import Icon from '@/components/shared/Icon'
import Input from '@/components/shared/Input'
import Drawer from '@/components/shared/Drawer'
import { ecRegrasAntecipacao, ecKpisProgramada, type RegraAntecipacao } from '@/mocks/ec/antecipacao-programada'

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

export default function EcAntecipacaoProgramada() {
  const [selected, setSelected] = useState<RegraAntecipacao | null>(null)
  const [creating, setCreating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [triggerTipo, setTriggerTipo] = useState<'calendario' | 'valor-agenda'>('calendario')
  const [search, setSearch] = useState('')

  const filteredRegras = ecRegrasAntecipacao.filter(r =>
    !search || r.nome.toLowerCase().includes(search.toLowerCase())
  )

  const columns: ColumnType<RegraAntecipacao>[] = [
    { title: 'Nome',            dataIndex: 'nome',            key: 'nome' },
    {
      title:  'Quando antecipa',
      key:    'trigger',
      render: (_: unknown, row: RegraAntecipacao) => (
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>{row.trigger.descricao}</span>
      ),
    },
    {
      title:  'Próxima vez',
      dataIndex: 'proximaExecucao',
      key:    'proximaExecucao',
      width:  180,
      render: (v: string | undefined) => v ?? '—',
    },
    {
      title:  'Antecipado este mês',
      key:    'totalMes',
      align:  'right',
      width:  170,
      render: (_: unknown, row: RegraAntecipacao) => (
        <span style={{ color: row.totalAntecipadoMes > 0 ? '#52c41a' : 'rgba(0,0,0,0.25)', fontWeight: 500 }}>
          {row.totalAntecipadoMes > 0 ? fmtBRL(row.totalAntecipadoMes) : '—'}
        </span>
      ),
    },
    {
      title:  'Status',
      key:    'ativa',
      width:  110,
      render: (_: unknown, row: RegraAntecipacao) => (
        <Tag status={row.ativa ? 'Ativo' : 'Inativo'} label={row.ativa ? 'Ativa' : 'Pausada'} />
      ),
    },
    {
      title:  'Ações',
      key:    'acoes',
      width:  80,
      render: (_: unknown, row: RegraAntecipacao) => (
        <button
          aria-label="Ver detalhes"
          onClick={(e) => { e.stopPropagation(); setSelected(row) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)' }}
        >
          <Icon name="eye" size={16} />
        </button>
      ),
    },
  ]

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Antecipação automática"
        breadcrumb="Estabelecimento Comercial · v1 / Financeiro / Antecipação automática"
        extra={<Button variant="primary" icon="plus" onClick={() => setCreating(true)}>Nova regra</Button>}
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPIs */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><KpiCard label="Regras ativas"           value={String(ecKpisProgramada.regrasAtivas)} subLabel="Antecipam sozinhas"         variant="success" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Próxima vez"             value={ecKpisProgramada.proximaExecucao}      subLabel="Quando uma regra rodar"     variant="info" /></div>
          <div style={{ flex: 1 }}><KpiCard label="Antecipado este mês"     value={fmtBRL(ecKpisProgramada.totalAntecipadoMes)} subLabel="Soma das regras"      variant="success" /></div>
        </div>

        {/* Tabela de regras */}
        <DataTable<RegraAntecipacao>
          title="Suas regras"
          columns={columns}
          dataSource={filteredRegras}
          rowKey="id"
          searchPlaceholder="Pesquise por nome da regra"
          searchValue={search}
          onSearch={setSearch}
          onRow={(row) => ({ onClick: () => setSelected(row) })}
        />
      </div>

      {/* Drawer detalhes da regra */}
      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Detalhes da regra"
        width={520}
        footer={
          <>
            <button style={{ flex: 1, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }}>Editar</button>
            <button style={{ flex: 1, border: '1px solid #ff4d4f', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: '#ff4d4f' }}>{selected?.ativa ? 'Pausar' : 'Ativar'}</button>
          </>
        }
      >
        {selected && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{selected.nome}</span>
              <Tag status={selected.ativa ? 'Ativo' : 'Inativo'} label={selected.ativa ? 'Ativa' : 'Pausada'} />
            </div>
            {[
              { label: 'Quando antecipa',  value: selected.trigger.descricao },
              { label: 'Última vez',       value: selected.ultimaExecucao ?? '—' },
              { label: 'Próxima vez',      value: selected.proximaExecucao ?? '—' },
              { label: 'Cartões',          value: selected.filtros.bandeiras?.join(', ') ?? 'Todos' },
              { label: 'A partir da parcela', value: selected.filtros.minParcela ? `${selected.filtros.minParcela}` : '—' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>{r.label}</span>
                <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 12 }}>Performance este mês</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Antecipado</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#52c41a' }}>{fmtBRL(selected.totalAntecipadoMes)}</div>
                </div>
                <div style={{ flex: 1, background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 2, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>Vezes que rodou</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1890FF' }}>{selected.qtdExecucoesMes}x</div>
                </div>
              </div>
            </div>
          </>
        )}
      </Drawer>

      {/* Drawer criar regra — progressive disclosure */}
      <Drawer
        open={creating}
        onClose={() => { setCreating(false); setShowAdvanced(false) }}
        title="Nova regra de antecipação"
        width={540}
        footer={
          <>
            <button onClick={() => { setCreating(false); setShowAdvanced(false) }} style={{ flex: 1, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }}>Cancelar</button>
            <button style={{ flex: 1, border: 'none', background: '#1890FF', borderRadius: 2, padding: '8px 0', fontSize: 13, cursor: 'pointer', color: '#fff', fontWeight: 500 }}>Simular antes de salvar</button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Nome */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 6 }}>Nome da regra</div>
            <Input placeholder="Ex: Antecipa toda sexta" />
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>Para você reconhecer depois.</div>
          </div>

          {/* Quando antecipar */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 8 }}>Quando antecipar</div>
            <Radio.Group
              value={triggerTipo}
              onChange={(e) => setTriggerTipo(e.target.value)}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}
            >
              <Radio value="calendario" style={{ alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.85)' }}>Em datas certas</span>
                  <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Toda semana, todo mês ou em um dia fixo.</span>
                </div>
              </Radio>
              <Radio value="valor-agenda" style={{ alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.85)' }}>Quando minha agenda crescer</span>
                  <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Antecipa sempre que a agenda futura passar de um valor.</span>
                </div>
              </Radio>
            </Radio.Group>

            {/* Configuração específica do trigger */}
            <div style={{ marginTop: 12, padding: 12, background: '#fafafa', borderRadius: 2, border: '1px solid #f0f0f0' }}>
              {triggerTipo === 'calendario' ? (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <AppSelect
                    style={{ flex: 1 }}
                    defaultValue="semanal"
                    options={[
                      { value: 'semanal', label: 'Toda semana' },
                      { value: 'mensal',  label: 'Todo mês'    },
                      { value: 'dia',     label: 'Em um dia fixo' },
                    ]}
                  />
                  <AppSelect
                    style={{ flex: 1 }}
                    defaultValue="sexta"
                    options={[
                      { value: 'segunda', label: 'na segunda' },
                      { value: 'terca',   label: 'na terça'   },
                      { value: 'quarta',  label: 'na quarta'  },
                      { value: 'quinta',  label: 'na quinta'  },
                      { value: 'sexta',   label: 'na sexta'   },
                    ]}
                  />
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', marginBottom: 6 }}>Antecipar quando minha agenda passar de</div>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1000}
                    step={1000}
                    placeholder="50000"
                    formatter={(v) => `R$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Cartões a antecipar */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 6 }}>Cartões a antecipar</div>
            <AppSelect
              mode="multiple"
              placeholder="Todos os cartões"
              options={[
                { value: 'visa',       label: 'Visa' },
                { value: 'mastercard', label: 'Mastercard' },
                { value: 'elo',        label: 'Elo' },
                { value: 'amex',       label: 'Amex' },
                { value: 'hipercard',  label: 'Hipercard' },
              ]}
            />
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>Deixe vazio para antecipar todos.</div>
          </div>

          {/* Opções avançadas — progressive disclosure */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#1890FF', fontSize: 13, padding: 0, fontWeight: 500 }}
            >
              <Icon name={showAdvanced ? 'chevronDown' : 'chevronRight'} size={14} />
              {showAdvanced ? 'Ocultar opções avançadas' : 'Mostrar opções avançadas'}
            </button>

            {showAdvanced && (
              <div style={{ marginTop: 12, padding: 16, background: '#fafafa', borderRadius: 2, border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', marginBottom: 6 }}>Antecipar a partir da parcela</div>
                    <InputNumber min={1} max={18} style={{ width: '100%' }} placeholder="1" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', marginBottom: 6 }}>Antecipar até a parcela</div>
                    <InputNumber min={1} max={18} style={{ width: '100%' }} placeholder="18" />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
                  Útil para antecipar só as parcelas mais distantes (que rendem mais).
                </div>
              </div>
            )}
          </div>

          {/* Ativar ao criar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #f0f0f0' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)' }}>Começar a usar agora</div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>A regra começa a antecipar automaticamente.</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Drawer>
    </div>
  )
}
