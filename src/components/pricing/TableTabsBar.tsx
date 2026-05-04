'use client'

import { useState } from 'react'
import { Modal, Typography } from 'antd'
import { Plus, Trash2, X } from 'lucide-react'

const { Text } = Typography

export interface TableTab {
  id: string
  name: string
}

export interface TableTabsBarProps {
  tabs: TableTab[]
  activeId: string | null
  onChangeActive: (id: string) => void
  onAdd?: () => void
  onRename?: (id: string, name: string) => void
  /** Pode excluir? Default true se houver mais de 1 aba. */
  onDelete?: (id: string) => void
  /** Texto do botão "Adicionar" (default: "Adicionar tabela"). */
  addLabel?: string
}

/**
 * Barra de abas dinâmicas para múltiplas tabelas — usado em /pricing/prices.
 * Espelha o padrão do branch feat/pricing do yby-ui Tupi:
 *  - Abas com underline na ativa
 *  - Nome editável inline (click no nome → vira input; Enter confirma; Esc cancela)
 *  - Botão "+" no fim para adicionar
 *  - "×" em cada aba (oculto se for a única) com modal de confirmação
 */
export default function TableTabsBar({
  tabs, activeId, onChangeActive,
  onAdd, onRename, onDelete,
  addLabel = 'Adicionar tabela',
}: TableTabsBarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<TableTab | null>(null)

  const startEdit = (tab: TableTab, e: React.MouseEvent) => {
    if (!onRename) return
    e.stopPropagation()
    setEditingId(tab.id)
    setEditingName(tab.name)
  }

  const commitEdit = () => {
    if (editingId === null) return
    const trimmed = editingName.trim()
    if (trimmed && onRename) onRename(editingId, trimmed)
    setEditingId(null)
  }

  const handleDeleteConfirmed = () => {
    if (confirmDelete && onDelete) onDelete(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <>
      <div role="tablist" aria-label="Tabelas de preço" style={{ display: 'flex', alignItems: 'flex-end', gap: 0, flexWrap: 'wrap' }}>
        {tabs.map(tab => {
          const isActive = tab.id === activeId
          const isOnly = tabs.length <= 1
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChangeActive(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 16px',
                background: '#fff',
                borderBottom: isActive ? '2px solid #1890FF' : '2px solid transparent',
                // marginBottom negativo "cola" o underline na borda inferior do wrapper externo (1px)
                marginBottom: -1,
                cursor: 'pointer',
                userSelect: 'none',
                fontFamily: 'Roboto',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderBottomColor = '#91D5FF' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent' }}
            >
              {editingId === tab.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitEdit()
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  onClick={e => e.stopPropagation()}
                  aria-label="Renomear tabela"
                  style={{
                    fontSize: 13, border: 'none', borderBottom: '1px solid #1890FF',
                    outline: 'none', padding: '0 2px',
                    width: Math.max(80, editingName.length * 8),
                    fontFamily: 'Roboto',
                  }}
                />
              ) : (
                <Text
                  onClick={e => startEdit(tab, e)}
                  style={{
                    fontSize: 13,
                    color: isActive ? '#1890FF' : 'rgba(0,0,0,0.65)',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {tab.name}
                </Text>
              )}

              {!isOnly && onDelete && (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setConfirmDelete(tab) }}
                  aria-label={`Excluir tabela ${tab.name}`}
                  style={{
                    marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer',
                    color: isActive ? '#1890FF' : 'rgba(0,0,0,0.35)',
                    display: 'inline-flex', alignItems: 'center', padding: 0,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#FF4D4F'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = isActive ? '#1890FF' : 'rgba(0,0,0,0.35)'}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )
        })}

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label={addLabel}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '10px 14px', marginBottom: -1,
              background: 'none', border: 'none',
              borderBottom: '2px solid transparent',
              cursor: 'pointer',
              color: '#1890FF', fontSize: 13, fontFamily: 'Roboto',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(24,144,255,0.08)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
          >
            <Plus size={14} />
            {addLabel}
          </button>
        )}
      </div>

      <Modal
        open={!!confirmDelete}
        onCancel={() => setConfirmDelete(null)}
        footer={null}
        closable={false}
        width={400}
        styles={{ body: { padding: '32px 24px 24px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFF1F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Trash2 size={16} color="#FF4D4F" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Text strong style={{ fontSize: 15 }}>Excluir tabela?</Text>
            <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
              A tabela <strong>{confirmDelete?.name}</strong> será removida. Os preços configurados nela serão perdidos.
            </Text>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
          <button
            type="button"
            onClick={() => setConfirmDelete(null)}
            style={{
              padding: '6px 16px', background: '#fff', border: '1px solid #d9d9d9',
              borderRadius: 0, fontSize: 13, cursor: 'pointer', fontFamily: 'Roboto',
            }}
          >
            Sair
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirmed}
            style={{
              padding: '6px 16px', background: '#FF4D4F', border: '1px solid #FF4D4F',
              borderRadius: 0, fontSize: 13, color: '#fff', cursor: 'pointer', fontFamily: 'Roboto',
              fontWeight: 500,
            }}
          >
            Excluir
          </button>
        </div>
      </Modal>
    </>
  )
}
