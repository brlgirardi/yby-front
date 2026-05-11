'use client'
// IA de Precificação — stepper alinhado ao briefing original:
//   1) CNPJ → 2) Localização (confirmar) → 3) Imagens (5 categorias)
//   → Loading TUPI Analytics → Resultado consolidado.
//
// Layout web enterprise (não mobile-first): 2 colunas no body, side panel IA-first
// explicando o que vai acontecer enquanto o usuário avança.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Input from '@/components/atoms/Input'
import AppSelect from '@/components/ui/AppSelect'
import LoadingTupi from '@/features/adquirente/v0/shared/LoadingTupi'
import { useTheme } from '@/stores/themeStore'
import { dadosEstabelecimentoMock, VOLUME_OPTIONS } from '@/mocks/adquirente/resultado-ia'

type StepKey = 'cnpj' | 'localizacao' | 'imagens'
interface StepDef { key: StepKey; label: string; icon: string; sidePanel: { title: string; body: string } }

const STEPS: StepDef[] = [
  {
    key: 'cnpj',
    label: 'CNPJ',
    icon: 'users',
    sidePanel: {
      title: 'Dados públicos do varejista',
      body: 'A IA cruza CNAE, regime tributário e histórico Receita Federal pra estimar perfil comercial. Nenhum dado é enviado a terceiros.',
    },
  },
  {
    key: 'localizacao',
    label: 'Localização',
    icon: 'landmark',
    sidePanel: {
      title: 'Vizinhança e contexto urbano',
      body: 'A localização ajuda a IA a inferir poder aquisitivo da região, fluxo comercial e benchmarks de varejistas próximos.',
    },
  },
  {
    key: 'imagens',
    label: 'Imagens',
    icon: 'eye',
    sidePanel: {
      title: 'Visão computacional do estabelecimento',
      body: 'Fotos da fachada, interior, produtos, fluxo e estrutura permitem inferir sofisticação visual, ticket médio e mix de produtos.',
    },
  },
]

interface UploadCardProps {
  label: string
  hint: string
  onChange?: (hasFile: boolean) => void
}
function UploadCard({ label, hint, onChange }: UploadCardProps) {
  const [file, setFileState] = useState<File | null>(null)
  const setFile = (f: File | null) => { setFileState(f); onChange?.(!!f) }
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{label}</div>
          <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{hint}</div>
        </div>
        {file && (
          <button
            onClick={() => setFile(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF4D4F', display: 'flex', alignItems: 'center' }}
            aria-label="Remover"
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>
      <label style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: 24,
        cursor: 'pointer',
        border: '1px dashed #d9d9d9',
        margin: 16,
        borderRadius: 2,
        background: file ? '#F6FFED' : '#FAFAFA',
        color: file ? '#52C41A' : '#1890FF',
        minHeight: 130,
      }}>
        <Icon name={file ? 'checkCircle' : 'upload'} size={22} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          {file ? file.name : 'Fazer upload'}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
          {file ? 'Clique para trocar' : 'Clique ou arraste para selecionar'}
        </span>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  )
}

export default function AqIAPrecificacao() {
  const router = useRouter()
  const theme = useTheme()
  const [step, setStep] = useState<StepKey>('cnpj')
  const [cnpj, setCnpj] = useState('')
  const [resolved, setResolved] = useState(false)
  const [volume, setVolume] = useState<string | undefined>(undefined)
  const [localizacaoConfirmada, setLocalizacaoConfirmada] = useState(false)
  const [imagens, setImagens] = useState<boolean[]>([false, false, false, false, false])
  const [loading, setLoading] = useState(false)

  const stepIdx = STEPS.findIndex((s) => s.key === step)
  const sidePanel = STEPS[stepIdx]?.sidePanel

  const setImagem = (i: number) => (has: boolean) =>
    setImagens((prev) => prev.map((v, idx) => (idx === i ? has : v)))
  const algumaImagem = imagens.some(Boolean)

  const onConsultarCnpj = () => {
    if (!cnpj.trim()) return
    setResolved(true)
  }

  const onAvancar = () => {
    if (step === 'cnpj') return setStep('localizacao')
    if (step === 'localizacao') return setStep('imagens')
    if (step === 'imagens') return setLoading(true)
  }
  const onVoltar = () => {
    if (step === 'localizacao') return setStep('cnpj')
    if (step === 'imagens') return setStep('localizacao')
  }

  const onLoadingComplete = () => {
    const qs = new URLSearchParams({ origem: 'pricing' })
    if (algumaImagem) qs.set('imagens', 'sim')
    router.push(`/adquirente/vendas/resultado?${qs.toString()}`)
  }

  const canAvancar =
    (step === 'cnpj'        && resolved && !!volume) ||
    (step === 'localizacao' && localizacaoConfirmada) ||
    step === 'imagens'

  if (loading) return <LoadingTupi onComplete={onLoadingComplete} />

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <PageHeader
        title="IA de Precificação"
        breadcrumb="Adquirente / Ferramentas de Vendas / IA de Precificação"
        noBorder
      />

      {/* Stepper */}
      <div style={{ background: '#fff', padding: '16px 32px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, maxWidth: 720, margin: '0 auto' }}>
          {STEPS.map((s, i) => {
            const isActive = s.key === step
            const isDone = i < stepIdx
            const color = isActive ? theme.primary : isDone ? '#52C41A' : 'rgba(0,0,0,0.35)'
            return (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? theme.primaryBg : isDone ? '#F6FFED' : '#F5F5F5',
                    color,
                    border: `1px solid ${isActive ? theme.primarySoft : isDone ? '#B7EB8F' : '#D9D9D9'}`,
                  }}>
                    <Icon name={isDone ? 'checkCircle' : s.icon} size={14} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400, color }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: isDone ? '#B7EB8F' : '#f0f0f0', margin: '0 12px', position: 'relative', top: -10 }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Body 2 colunas: form + side panel IA-first — full height, sem scroll externo */}
      <div style={{
        flex: 1,
        minHeight: 0,
        padding: 24,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 24,
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Coluna esquerda — conteúdo do step */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {step === 'cnpj' && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 32, display: 'flex', flexDirection: 'column', gap: 20, flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>Identifique o varejista</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>Comece pelo CNPJ — a IA preenche o restante automaticamente.</div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 6 }}>CNPJ</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder="00.000.000/0000-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                    />
                  </div>
                  <Button variant="primary" icon="search" onClick={onConsultarCnpj}>
                    Consultar
                  </Button>
                </div>
              </div>

              {resolved && (
                <>
                  {/* Origem dos dados — vendedor mostra que vem da Receita, não foi inventado */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: '#F6FFED',
                    border: '1px solid #B7EB8F',
                    borderRadius: 2,
                    fontSize: 12,
                    color: 'rgba(0,0,0,0.65)',
                  }}>
                    <Icon name="checkCircle" size={14} color="#52C41A" />
                    <span>
                      <strong style={{ color: '#52C41A' }}>Dados auto-preenchidos da Receita Federal.</strong>{' '}
                      Confira antes de avançar.
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { label: 'Razão Social',           value: dadosEstabelecimentoMock.razaoSocial },
                      { label: 'Nome do Estabelecimento', value: dadosEstabelecimentoMock.nomeEc },
                      { label: 'CNAE',                    value: dadosEstabelecimentoMock.cnae },
                      { label: 'Endereço',                value: `${dadosEstabelecimentoMock.endereco} — ${dadosEstabelecimentoMock.cep}` },
                    ].map((r) => (
                      <div key={r.label}>
                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 2 }}>{r.label}</div>
                        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{r.value}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 6 }}>Volume mensal estimado</div>
                    <AppSelect
                      placeholder="Selecione o volume mensal"
                      value={volume}
                      onChange={(v) => setVolume(v as string)}
                      options={VOLUME_OPTIONS}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'localizacao' && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 32, display: 'flex', flexDirection: 'column', gap: 20, flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>Confirme a localização</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>Identificamos o endereço a partir do CNPJ. Confirme se está correto pra continuar.</div>
              </div>

              {/* Card consultivo com endereço + ilustração de mapa */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
                <div style={{ background: '#FAFAFA', border: '1px solid #f0f0f0', borderRadius: 2, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#52C41A' }}>
                    <Icon name="checkCircle" size={16} />
                    <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Endereço identificado</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Logradouro</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{dadosEstabelecimentoMock.endereco}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>CEP</div>
                      <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{dadosEstabelecimentoMock.cep}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Cidade / UF</div>
                      <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.85)', fontWeight: 500 }}>{dadosEstabelecimentoMock.cidade} / {dadosEstabelecimentoMock.estado}</div>
                    </div>
                  </div>
                </div>

                {/* Ilustração de mapa SVG (sem libs) */}
                <div style={{ background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`, border: `1px solid ${theme.primarySoft}`, borderRadius: 2, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, position: 'relative', overflow: 'hidden' }}>
                  <svg width="100%" height="100%" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
                    <rect width="320" height="200" fill="transparent" />
                    <path d="M0 80 Q 80 60 160 100 T 320 90" stroke={theme.primarySoft} strokeWidth="2" fill="none" opacity="0.6" />
                    <path d="M40 0 L 60 200" stroke={theme.primarySoft} strokeWidth="1.5" fill="none" opacity="0.5" />
                    <path d="M260 0 L 280 200" stroke={theme.primarySoft} strokeWidth="1.5" fill="none" opacity="0.5" />
                  </svg>
                  {/* Pin central */}
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: theme.primary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 6px 16px ${theme.primaryBg}`,
                      animation: 'aqPinPulse 2s ease-in-out infinite',
                    }}>
                      <Icon name="landmark" size={20} color="#fff" />
                    </div>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: theme.primaryBg, marginTop: 4 }} />
                  </div>
                  {/* Disclaimer ilustrativo — vendedor não promete mapa real na demo */}
                  <span style={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    fontSize: 10,
                    color: 'rgba(0,0,0,0.45)',
                    background: 'rgba(255,255,255,0.7)',
                    padding: '2px 6px',
                    borderRadius: 2,
                    backdropFilter: 'blur(4px)',
                    zIndex: 3,
                  }}>
                    Visualização ilustrativa
                  </span>
                  <style jsx>{`
                    @keyframes aqPinPulse {
                      0%, 100% { transform: translateY(0); }
                      50%      { transform: translateY(-6px); }
                    }
                  `}</style>
                </div>
              </div>

              {/* Toggle confirmar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: localizacaoConfirmada ? '#F6FFED' : '#FAFAFA',
                border: `1px solid ${localizacaoConfirmada ? '#B7EB8F' : '#f0f0f0'}`,
                borderRadius: 2,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name={localizacaoConfirmada ? 'checkCircle' : 'info'} size={16} color={localizacaoConfirmada ? '#52C41A' : theme.primary} />
                  <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.85)' }}>
                    {localizacaoConfirmada ? 'Localização confirmada' : 'Confirmar localização identificada?'}
                  </span>
                </div>
                <Button
                  variant={localizacaoConfirmada ? 'ghost' : 'primary'}
                  icon={localizacaoConfirmada ? 'edit' : 'checkCircle'}
                  onClick={() => setLocalizacaoConfirmada((v) => !v)}
                >
                  {localizacaoConfirmada ? 'Alterar' : 'Confirmar'}
                </Button>
              </div>
            </div>
          )}

          {step === 'imagens' && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>Imagens do estabelecimento</div>
                <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>Anexe pelo menos uma categoria — a IA infere ticket médio, sofisticação e mix de produtos via visão computacional. Pular essa etapa também é possível.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <UploadCard label="Fachada"   hint="Frente da loja, identidade visual" onChange={setImagem(0)} />
                <UploadCard label="Interior"  hint="Layout interno, ambientação"        onChange={setImagem(1)} />
                <UploadCard label="Produtos"  hint="Mix e exposição"                    onChange={setImagem(2)} />
                <UploadCard label="Fluxo"     hint="Movimento de clientes / fila"       onChange={setImagem(3)} />
                <UploadCard label="Estrutura" hint="Caixa, área de atendimento"          onChange={setImagem(4)} />
              </div>
            </div>
          )}
        </div>

        {/* Coluna direita — Side panel IA-first explicando o step atual */}
        {sidePanel && (
          <aside style={{
            background: `linear-gradient(180deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`,
            border: `1px solid ${theme.primarySoft}`,
            borderRadius: 2,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: 0,
            overflowY: 'auto',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: theme.primary, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <Icon name="sparkles" size={14} />
              {theme.label.toUpperCase()} Analytics
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{sidePanel.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', lineHeight: '18px' }}>{sidePanel.body}</div>

            <div style={{ marginTop: 'auto', borderTop: `1px solid ${theme.primarySoft}`, paddingTop: 12, fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
              Passo {stepIdx + 1} de {STEPS.length}
            </div>
          </aside>
        )}
      </div>

      {/* Footer fixo */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        padding: '12px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          {step !== 'cnpj' && (
            <Button variant="ghost" icon="chevronLeft" onClick={onVoltar}>Voltar</Button>
          )}
        </div>
        <Button
          variant="primary"
          onClick={onAvancar}
          disabled={!canAvancar}
        >
          {step === 'imagens' ? 'Analisar com IA' : 'Avançar'}
        </Button>
      </div>
    </div>
  )
}
