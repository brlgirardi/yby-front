'use client'
// src/app/(app)/integrations/page.tsx
// Gestão de integrações com adquirentes — Provider + Credential.
// Espelha yby-ui /integrations: grid de cards (3 colunas desktop / 1 mobile),
// connected vs available diferenciado por badge, drawer 480px pra criar credencial.

import { useEffect, useState } from 'react'
import { Drawer, Switch, message } from 'antd'
import PageHeader from '@/components/shared/PageHeader'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import { getProviders, type ProviderOption } from '@/services/providersService'
import {
  createCredential,
  listCredentials,
} from '@/services/credentialsService'
import type { TupiCredential, TupiProviderName } from '@/services/types/tupi.types'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 2,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minHeight: 180,
}

const BADGE_CONNECTED: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '2px 8px',
  background: '#f6ffed',
  border: '1px solid #b7eb8f',
  borderRadius: 2,
  fontSize: 12,
  color: '#389e0d',
}

const BADGE_AVAILABLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  background: '#fafafa',
  border: '1px solid #d9d9d9',
  borderRadius: 2,
  fontSize: 12,
  color: 'rgba(0,0,0,0.45)',
}

export default function IntegrationsPage() {
  const [providers, setProviders] = useState<ProviderOption[]>([])
  const [credentials, setCredentials] = useState<TupiCredential[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selected, setSelected] = useState<ProviderOption | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [mid, setMid] = useState('')
  const [tid, setTid] = useState('')
  const [testMode, setTestMode] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([getProviders(), listCredentials()])
      .then(([provs, creds]) => {
        if (cancelled) return
        setProviders(provs)
        setCredentials(creds)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  /** Set de providerIds que já têm credencial cadastrada. */
  const connectedProviderIds = new Set(credentials.map((c) => c.providerId))

  function openCreateDrawer(provider: ProviderOption) {
    setSelected(provider)
    setMid('')
    setTid('')
    setTestMode(true)
    setDrawerOpen(true)
  }

  async function handleSave() {
    if (!selected) return
    if (!mid.trim()) {
      message.error('Informe o MID')
      return
    }
    setSaving(true)
    try {
      const created = await createCredential({
        merchantId: 'merchant_yby_demo', // TODO: vir do contexto do usuário
        providerId: selected.value,
        providerName: (selected.name as TupiProviderName) ?? 'cielo',
        mid: mid.trim(),
        tid: tid.trim() || undefined,
      })
      setCredentials((cur) => [...cur, created])
      message.success(`${selected.label} conectado`)
      setDrawerOpen(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao criar credencial'
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Integrações"
        breadcrumb="Sub-adquirente / Integrações"
        onBack={null}
      />

      <div style={{ padding: 24 }}>
        <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)', marginTop: 0, marginBottom: 24 }}>
          Conecte adquirentes para habilitar o processamento de transações. Cada vínculo
          guarda o MID/TID e credenciais específicas do provedor.
        </p>

        {loading ? (
          <div style={{ fontSize: 13, color: '#999', padding: 24, textAlign: 'center' }}>
            Carregando integrações…
          </div>
        ) : providers.length === 0 ? (
          <div style={{ fontSize: 13, color: '#999', padding: 24, textAlign: 'center' }}>
            Nenhum adquirente disponível.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {providers.map((p) => {
              const isConnected = connectedProviderIds.has(p.value)
              return (
                <div key={p.value} style={CARD}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#21272A' }}>{p.label}</div>
                    <span style={isConnected ? BADGE_CONNECTED : BADGE_AVAILABLE}>
                      {isConnected ? 'Conectado' : 'Disponível'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', flex: 1 }}>
                    {isConnected
                      ? 'Credencial ativa. Edite o MID/TID se precisar atualizar.'
                      : 'Vincule sua credencial deste adquirente para começar a processar.'}
                  </div>
                  <Button
                    variant={isConnected ? 'secondary' : 'primary'}
                    onClick={() => openCreateDrawer(p)}
                  >
                    {isConnected ? 'Detalhes' : 'Conectar'}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Drawer
        title={selected ? `Conectar ${selected.label}` : 'Conectar adquirente'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
        destroyOnClose
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="MID *"
            placeholder="Identificador do MID"
            value={mid}
            onChange={(e) => setMid(e.target.value.slice(0, 64))}
            aria-required
          />
          <Input
            label="TID"
            placeholder="Identificador do terminal (opcional)"
            value={tid}
            onChange={(e) => setTid(e.target.value.slice(0, 32))}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(0,0,0,0.85)' }}>Modo de teste</div>
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                Use sandbox do provedor — desligue quando estiver pronto para produção.
              </div>
            </div>
            <Switch checked={testMode} onChange={setTestMode} />
          </div>
        </div>
      </Drawer>
    </div>
  )
}
