'use client'

import { useEffect, useState } from 'react'
import type { PriceBlueprintTable } from '@/services/types/pricing.types'
import type { TableTab } from '@/components/pricing/TableTabsBar'

export interface UsePriceTableTabsResult {
  tabs: TableTab[]
  activeId: string | null
  setActiveId: (id: string) => void
  addTab: () => void
  renameTab: (id: string, name: string) => void
  deleteTab: (id: string) => void
}

/**
 * Gestão local de abas de tabelas de preço.
 * Espelha o comportamento do branch feat/pricing do yby-ui Tupi:
 *  - Inicializa a partir das PriceBlueprintTables vindas da API
 *  - Sempre tem pelo menos 1 aba
 *  - Adicionar gera "Tabela N" sequencial
 *  - Renomear e excluir são locais (mock; quando API real, adicionar callbacks de persistência)
 */
export function usePriceTableTabs(tables: PriceBlueprintTable[]): UsePriceTableTabsResult {
  const [tabs, setTabs] = useState<TableTab[]>([])
  const [activeId, setActiveIdInternal] = useState<string | null>(null)

  // Inicializa quando as tables chegam
  useEffect(() => {
    if (tabs.length > 0) return // já inicializado
    const initial: TableTab[] = tables.length > 0
      ? tables.map((t, i) => ({ id: t.id, name: t.name ?? `Tabela ${i + 1}` }))
      : [{ id: 'tab-1', name: 'Tabela 1' }]
    setTabs(initial)
    setActiveIdInternal(initial[0].id)
  }, [tables, tabs.length])

  const setActiveId = (id: string) => setActiveIdInternal(id)

  const addTab = () => {
    setTabs(prev => {
      // Encontra o próximo número disponível
      const numbers = prev
        .map(t => /^Tabela (\d+)$/.exec(t.name)?.[1])
        .filter((n): n is string => Boolean(n))
        .map(Number)
      const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : prev.length + 1
      const newTab: TableTab = { id: `tab-new-${Date.now()}`, name: `Tabela ${nextNumber}` }
      const next = [...prev, newTab]
      setActiveIdInternal(newTab.id)
      return next
    })
  }

  const renameTab = (id: string, name: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, name } : t))
  }

  const deleteTab = (id: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id)
      if (activeId === id && next.length > 0) {
        setActiveIdInternal(next[0].id)
      }
      return next
    })
  }

  return { tabs, activeId, setActiveId, addTab, renameTab, deleteTab }
}
