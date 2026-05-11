'use client'
// Loading screen full-screen TUPI Analytics — usado pelos 2 fluxos AI.
// Visual AI-first com gradient roxo + spinner + steps rotativos.

import { useEffect, useState } from 'react'
import Icon from '@/components/atoms/Icon'
import { useTheme } from '@/stores/themeStore'
import { LOADING_STEPS } from '@/mocks/adquirente/resultado-ia'

interface LoadingTupiProps {
  /** Disparado ao final do último step. */
  onComplete: () => void
  /** Tempo (ms) por step. Default 1500ms × N = ~9s. */
  msPerStep?: number
}

export default function LoadingTupi({ onComplete, msPerStep = 1500 }: LoadingTupiProps) {
  const [stepIdx, setStepIdx] = useState(0)
  const total = LOADING_STEPS.length
  const theme = useTheme()

  useEffect(() => {
    if (stepIdx >= total - 1) {
      const t = setTimeout(() => onComplete(), msPerStep)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStepIdx((i) => i + 1), msPerStep)
    return () => clearTimeout(t)
  }, [stepIdx, total, msPerStep, onComplete])

  const progress = ((stepIdx + 1) / total) * 100

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `linear-gradient(135deg, ${theme.deep} 0%, ${theme.primaryDark} 35%, ${theme.primary} 70%, ${theme.deep} 100%)`,
      backgroundSize: '200% 200%',
      animation: 'tupiGradient 8s ease infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      zIndex: 9999,
      color: '#fff',
      overflow: 'hidden',
    }}>
      {/* Partículas de fundo */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left:  `${(i * 37) % 100}%`,
              top:   `${(i * 53) % 100}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background: '#fff',
              borderRadius: '50%',
              opacity: 0.4 + (i % 6) * 0.1,
              animation: `tupiTwinkle ${2 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.13) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Badge TUPI Analytics */}
      <div style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 999,
        marginBottom: 32,
        fontSize: 13,
        fontWeight: 500,
        backdropFilter: 'blur(8px)',
      }}>
        <Icon name="sparkles" size={14} color="#fff" />
        <span>{theme.label.toUpperCase()} Analytics</span>
      </div>

      {/* Spinner */}
      <div style={{
        position: 'relative',
        width: 80,
        height: 80,
        marginBottom: 28,
      }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ animation: 'tupiSpin 1.4s linear infinite' }}>
          <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" />
          <circle cx="40" cy="40" r="34" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="60 200" />
        </svg>
      </div>

      {/* Texto principal — etapa rotativa */}
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, textAlign: 'center', minHeight: 24 }}>
        {LOADING_STEPS[stepIdx]}
      </div>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 24 }}>
        Etapa {stepIdx + 1} de {total}
      </div>
      <div style={{ fontSize: 11, opacity: 0.55, maxWidth: 400, textAlign: 'center' }}>
        Não feche ou saia desta tela até concluir a análise.
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 360,
        maxWidth: '80%',
      }}>
        <div style={{
          height: 4,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FFF 0%, #FCD34D 50%, #FFF 100%)',
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
          {LOADING_STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i <= stepIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes tupiSpin { to { transform: rotate(360deg); } }
        @keyframes tupiGradient {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes tupiTwinkle {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
