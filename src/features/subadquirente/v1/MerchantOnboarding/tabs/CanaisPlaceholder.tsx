'use client'
// src/features/subadquirente/v1/MerchantOnboarding/tabs/CanaisPlaceholder.tsx
// Placeholder da tab "Canais" — implementação real na Fase 2.

import Icon from '@/components/atoms/Icon'

export default function CanaisPlaceholder() {
  return <TabPlaceholder fase="Fase 2" />
}

function TabPlaceholder({ fase }: { fase: string }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        padding: '64px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(0,0,0,0.35)',
        }}
      >
        <Icon name="settings" size={28} />
      </div>
      <h3
        style={{
          margin: 0,
          fontFamily: 'Roboto, sans-serif',
          fontSize: 16,
          fontWeight: 600,
          color: 'rgba(0,0,0,0.85)',
        }}
      >
        Em construção
      </h3>
      <p
        style={{
          margin: 0,
          fontFamily: 'Roboto, sans-serif',
          fontSize: 13,
          color: 'rgba(0,0,0,0.45)',
          maxWidth: 360,
        }}
      >
        {`Esta etapa estará disponível em breve (${fase}).`}
      </p>
    </div>
  )
}

export { TabPlaceholder }