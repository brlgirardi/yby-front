'use client'
// Análise de Platinização — drag & drop arquivo único + Loading + redirect.
// Mesmo destino do fluxo Pricing: /adquirente/vendas/resultado?origem=platinizacao.
// Layout 2 colunas com side panel TUPI Analytics — paridade visual com IA Pricing.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import LoadingTupi from '@/features/adquirente/v0/shared/LoadingTupi'
import { useTheme } from '@/stores/themeStore'

export default function AqAnalisePlatinizacao() {
  const router = useRouter()
  const theme = useTheme()
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  const onAnalisar = () => setLoading(true)
  const onLoadingComplete = () => router.push('/adquirente/vendas/resultado?origem=platinizacao')

  if (loading) return <LoadingTupi onComplete={onLoadingComplete} />

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <PageHeader
        title="Análise de Platinização"
        breadcrumb="Adquirente / Ferramentas de Vendas / Análise de Platinização"
      />

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
        {/* Coluna esquerda — drag & drop full-height */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflowY: 'auto' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>
              Arraste o arquivo do lead para iniciar a análise
            </div>
            <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>
              Aceitamos extratos, relatórios comerciais ou bases CSV. A IA estima o potencial de platinização do estabelecimento.
            </div>
          </div>

          <label
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            style={{
              flex: 1,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '32px',
              cursor: 'pointer',
              border: `2px dashed ${dragActive ? theme.primary : file ? '#52C41A' : theme.primarySoft}`,
              borderRadius: 4,
              background: dragActive ? theme.primaryBg : file ? '#F6FFED' : '#FAFAFA',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: file ? '#F6FFED' : theme.primaryBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={file ? 'checkCircle' : 'upload'} size={26} color={file ? '#52C41A' : theme.primary} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
              {file ? file.name : 'Solte o arquivo aqui'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>
              {file ? 'Clique para trocar' : 'ou clique para selecionar do computador'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 6 }}>
              Formatos aceitos: .csv, .xlsx, .pdf — até 20MB
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
            {file && (
              <Button variant="ghost" onClick={() => setFile(null)}>Remover</Button>
            )}
            <Button
              variant="primary"
              onClick={onAnalisar}
              disabled={!file}
              icon="sparkles"
            >
              Analisar com IA
            </Button>
          </div>
        </div>

        {/* Side panel — paridade visual com IA Pricing, full-height */}
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
          <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
            Análise de carteira via arquivo
          </div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', lineHeight: '18px' }}>
            A IA cruza dados do extrato ou base comercial com benchmarks de varejo BR pra estimar tier de platinização, ticket médio e potencial de upsell.
          </div>

          <div style={{ borderTop: `1px solid ${theme.primarySoft}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.65)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              O que a IA infere
            </div>
            {[
              { icon: 'barChart',     label: 'Score 0–100 e tier estimado'      },
              { icon: 'creditCard',   label: 'Mix de pagamento e ticket médio' },
              { icon: 'sparkles',     label: 'Insights pra negociação de MDR'  },
            ].map((it) => (
              <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
                <Icon name={it.icon} size={12} color={theme.primary} />
                <span>{it.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
