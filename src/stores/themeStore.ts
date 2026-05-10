'use client'
// Theme store — alterna entre Tupi (default) e Vero (whitelabel demo).
// Afeta apenas chrome/marca: logo + paleta de marca (sidebar accent, primary
// button, links, brand gradients). Cores semânticas de dado (success/warning/
// error/charts) NÃO mudam — preservam legibilidade e consistência analítica.

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeKey = 'tupi' | 'vero'

export interface BrandTheme {
  key:        ThemeKey
  label:      string
  logoSrc:    string
  brandKey:   'Tupi' | 'Vero'
  primary:    string
  primaryDark:string
  primarySoft:string
  primaryBg:  string
  accent:     string
  deep:       string
  gradientFrom: string
  gradientTo:   string
}

export const THEMES: Record<ThemeKey, BrandTheme> = {
  tupi: {
    key:          'tupi',
    label:        'Tupi',
    logoSrc:      '/logo-tupi.svg',
    brandKey:     'Tupi',
    primary:      '#1890FF',
    primaryDark:  '#096DD9',
    primarySoft:  '#91D5FF',
    primaryBg:    'rgba(24,144,255,0.08)',
    accent:       '#722ED1',
    deep:         '#003A8C',
    gradientFrom: '#F0F7FF',
    gradientTo:   '#FAFAFA',
  },
  vero: {
    // Paleta Vero real (site sejavero.com.br): azul royal saturado como primary
    // (não o lilás do logo, que é só accent secundário). Marinho profundo como
    // deep / loading bg. Lilás vira accent.
    key:          'vero',
    label:        'Vero',
    logoSrc:      'https://www.sejavero.com.br/bom/multimidia/bomd99im_vero_logo-positivo.svg',
    brandKey:     'Vero',
    primary:      '#1E3CFF',
    primaryDark:  '#0A1FCC',
    primarySoft:  '#A8B5FF',
    primaryBg:    'rgba(30,60,255,0.10)',
    accent:       '#A070FE',
    deep:         '#000B5C',
    gradientFrom: '#EEF1FF',
    gradientTo:   '#FAFAFA',
  },
}

interface ThemeState {
  theme: ThemeKey
  setTheme: (t: ThemeKey) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'tupi',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'tupi:theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export function useTheme(): BrandTheme {
  const key = useThemeStore((s) => s.theme)
  return THEMES[key]
}
