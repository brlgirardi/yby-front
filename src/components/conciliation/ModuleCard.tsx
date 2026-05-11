'use client'

import { type LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export interface ConciliationModule {
  id: string
  name: string
  description: string
  icon: LucideIcon
  status: 'active' | 'soon'
  href?: string
}

interface ModuleCardProps {
  module: ConciliationModule
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const router = useRouter()
  const isActive = module.status === 'active'
  const IconComponent = module.icon

  const handleClick = () => {
    if (isActive && module.href) {
      router.push(module.href)
    }
  }

  return (
    <div
      onClick={isActive ? handleClick : undefined}
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 4,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: isActive ? 'pointer' : 'default',
        opacity: isActive ? 1 : 0.6,
        transition: 'box-shadow 0.15s, border-color 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (isActive) {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
          ;(e.currentTarget as HTMLElement).style.borderColor = '#d9d9d9'
        }
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 4,
          background: isActive ? '#E6F4FF' : '#F5F5F5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconComponent
            size={20}
            color={isActive ? '#1677FF' : 'rgba(0,0,0,0.25)'}
            strokeWidth={1.75}
          />
        </div>

        <span style={{
          fontSize: 11,
          fontWeight: 600,
          lineHeight: '16px',
          padding: '2px 8px',
          borderRadius: 2,
          background: isActive ? '#D9F7BE' : '#F5F5F5',
          color: isActive ? '#237804' : 'rgba(0,0,0,0.45)',
          whiteSpace: 'nowrap',
        }}>
          {isActive ? 'Ativo' : 'Em breve'}
        </span>
      </div>

      <div>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: isActive ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.45)',
          marginBottom: 4,
          lineHeight: '20px',
        }}>
          {module.name}
        </div>
        <div style={{
          fontSize: 12,
          color: 'rgba(0,0,0,0.45)',
          lineHeight: '18px',
        }}>
          {module.description}
        </div>
      </div>

      {isActive && (
        <div style={{
          marginTop: 'auto',
          paddingTop: 4,
        }}>
          <button
            onClick={handleClick}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#1677FF',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Acessar
          </button>
        </div>
      )}
    </div>
  )
}
