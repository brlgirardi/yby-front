'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import AccordionCard from '@/components/shared/AccordionCard'
import Icon from '@/components/shared/Icon'

interface AreaConfig {
  id: string
  icon: string
  iconColor: string
  titulo: string
  descricao: string
  bullets: string[]
}

const AREAS: AreaConfig[] = [
  {
    id: 'taxas',
    icon: 'creditCard',
    iconColor: '#1890FF',
    titulo: '1. Configurando taxas',
    descricao: 'Matriz multi-eixo + categoria + prazo + volume',
    bullets: [
      'Editor multi-eixo: Método × Bandeira × Canal × Categoria EC × Prazo × Volume',
      'Persiste tabela versionada (rate_matrix_v[N] com timestamp)',
      'Categoria EC → multiplicador',
      'Prazo → desconto',
      'Volume brackets → desconto progressivo',
      'Promoções com data início/fim',
      'Validação em real-time + vigência destacada',
    ],
  },
  {
    id: 'risco',
    icon: 'alertTriangle',
    iconColor: '#FA8C16',
    titulo: '2. Configurando risco',
    descricao: 'Score, MCC, carência, chargeback, whitelist',
    bullets: [
      'Score mínimo por categoria',
      'MCCs permitidos / bloqueados / carência',
      'Threshold de chargeback (% sobre TPV)',
      'Whitelist de ECs (override do risco automático)',
      'Histórico de mudanças com motivo',
    ],
  },
  {
    id: 'limites',
    icon: 'barChart',
    iconColor: '#52C41A',
    titulo: '3. Definindo limites',
    descricao: '% agenda, diário, min/max, cooldown, colchão',
    bullets: [
      'Teto de % da agenda por categoria (Bronze/Prata/Ouro)',
      'Limite diário por EC',
      'Mín/máx por operação',
      'Cooldown entre operações',
      'Colchão (capital reservado pra cobrir falhas TED/PIX)',
    ],
  },
  {
    id: 'operacional',
    icon: 'settings',
    iconColor: '#722ED1',
    titulo: '4. Ajustando operacional',
    descricao: 'Horário corte, SLA, retry, reconciliação',
    bullets: [
      'Horário de corte (até quando antecipa no mesmo dia)',
      'SLA de aprovação manual (default 48h)',
      'Política de retry em falhas TED/PIX (3x/5min, escala manual)',
      'Janela de reconciliação Núclea',
      'Modo de manutenção (pausa global)',
    ],
  },
  {
    id: 'notificacoes',
    icon: 'bell',
    iconColor: '#EB2F96',
    titulo: '5. Configurando notificações',
    descricao: 'Canais, alertas, templates, audit log',
    bullets: [
      'Templates de mensagem por evento (push, email, SMS)',
      'Configuração de alertas com thresholds',
      'Canais de saída por papel do operador',
      'Audit log de envios',
      'Whitelist de domínios pra email',
    ],
  },
]

const AREA_IDS = ['taxas', 'risco', 'limites', 'operacional', 'notificacoes'] as const

function getAreaFromPath(pathname: string): string {
  const segment = pathname.split('/').pop() ?? ''
  return AREA_IDS.includes(segment as typeof AREA_IDS[number]) ? segment : 'taxas'
}

const AREA_LABEL: Record<string, string> = {
  taxas:        'Taxas',
  risco:        'Risco e limites',
  limites:      'Limites',
  operacional:  'Operacional',
  notificacoes: 'Notificações',
}

export default function SubConfigAvancada() {
  const pathname = usePathname()
  const [activeArea, setActiveArea] = useState<string>(() => getAreaFromPath(pathname))

  useEffect(() => {
    setActiveArea(getAreaFromPath(pathname))
  }, [pathname])

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title={AREA_LABEL[activeArea] ?? 'Antecipação'}
        breadcrumb={`Sub-adquirente · v1 / Antecipação / ${AREA_LABEL[activeArea] ?? ''}`}
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Banner regras V1++ */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 2, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Icon name="info" size={16} color="#1890FF" />
            <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.6 }}>
              <strong>Regras V1++ desta tela:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                <li>Cada save = nova versão com timestamp · auditoria preserva histórico completo</li>
                <li>Mudanças NÃO afetam antecipações em andamento — aplicam-se a partir da próxima execução (D+1 ou próximo ciclo)</li>
                <li>Categorias Bronze/Prata/Ouro atravessam as 5 áreas (Taxas + Limites + Risco se referenciam à categoria do EC)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5 áreas em accordion */}
        {AREAS.map((area) => (
          <AccordionCard
            key={area.id}
            defaultOpen={activeArea === area.id}
            header={
              <>
                <div style={{ width: 32, height: 32, background: '#fafafa', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={area.icon} size={16} color={area.iconColor} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>{area.titulo}</div>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{area.descricao}</div>
                </div>
              </>
            }
            meta={<span>{area.bullets.length} parâmetros</span>}
          >
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 2, padding: '16px 20px' }}>
              <EmptyState
                title="Em construção"
                description={
                  <span>
                    Esta seção estará disponível em breve. Parâmetros previstos:
                    <ul style={{ textAlign: 'left', margin: '12px auto', maxWidth: 520, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
                      {area.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </span>
                }
                paddingY={32}
              />
            </div>
          </AccordionCard>
        ))}
      </div>
    </div>
  )
}
