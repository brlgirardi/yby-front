'use client'

import { useState } from 'react'
import { Table, type TableProps } from 'antd'
import type { ColumnType } from 'antd/es/table'
import Icon from '@/components/shared/Icon'

export type { ColumnType }

export type TableFilterConfig = {
  label: string
  options: { label: string; value: string }[]
  value: string[]
  onChange: (values: string[]) => void
}

type DataTableProps<T extends object> = {
  columns: ColumnType<T>[]
  dataSource: T[]
  rowKey: TableProps<T>['rowKey']
  // Section title (above toolbar)
  title?: string
  titleExtra?: React.ReactNode
  // Toolbar
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  filters?: TableFilterConfig[]
  onExport?: () => void
  onAdvancedFilter?: () => void
  toolbarExtra?: React.ReactNode
  // Table
  loading?: boolean
  pageSize?: number
  showPagination?: boolean
  expandable?: TableProps<T>['expandable']
  onRow?: TableProps<T>['onRow']
}

function FilterPill({ config }: { config: TableFilterConfig }) {
  const [open, setOpen] = useState(false)
  const hasActive = config.value.length > 0 && config.value.length < config.options.length
  const label = hasActive
    ? config.value.length === 1
      ? `${config.label}: ${config.options.find(o => o.value === config.value[0])?.label ?? config.value[0]}`
      : `${config.label} (${config.value.length})`
    : config.label

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          border: 'none',
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 14,
          color: hasActive ? '#1890FF' : 'rgba(0,0,0,0.85)',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: 2,
          whiteSpace: 'nowrap',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: hasActive ? 500 : 400,
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f5f5f5'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 12 8" fill="none" style={{ flexShrink: 0 }}>
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute',
            top: 36,
            left: 0,
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: 4,
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            zIndex: 100,
            minWidth: 160,
            padding: '4px 0',
          }}>
            {config.options.map(opt => {
              const checked = config.value.includes(opt.value)
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    config.onChange(
                      checked
                        ? config.value.filter(v => v !== opt.value)
                        : [...config.value, opt.value]
                    )
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 12px',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: 'rgba(0,0,0,0.85)',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f5f5f5'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div style={{
                    width: 14,
                    height: 14,
                    border: checked ? '2px solid #1890FF' : '1px solid #d9d9d9',
                    borderRadius: 2,
                    background: checked ? '#1890FF' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {checked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {opt.label}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function DataTable<T extends object>({
  columns,
  dataSource,
  rowKey,
  title,
  titleExtra,
  searchPlaceholder = 'Pesquisar...',
  searchValue,
  onSearch,
  filters,
  onExport,
  onAdvancedFilter,
  toolbarExtra,
  loading,
  pageSize = 10,
  showPagination = true,
  expandable,
  onRow,
}: DataTableProps<T>) {
  const showTitle = title || titleExtra
  const showToolbar = onSearch || (filters && filters.length > 0) || onExport || onAdvancedFilter || toolbarExtra

  return (
    <div style={{
      background: '#fff',
      borderRadius: 2,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 2px 0 rgba(0,0,0,0.02)',
    }}>
      {/* Title row */}
      {showTitle && (
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {title && (
            <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.85)', fontFamily: 'Roboto, sans-serif' }}>
              {title}
            </span>
          )}
          {titleExtra}
        </div>
      )}

      {/* Toolbar */}
      {showToolbar && (
        <div style={{
          padding: '12px 21px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexWrap: 'wrap',
        }}>
          {/* Search — icon on RIGHT */}
          {onSearch && (
            <div style={{
              display: 'flex',
              border: '1px solid #d9d9d9',
              borderRadius: 2,
              overflow: 'hidden',
              width: 232,
              flexShrink: 0,
            }}>
              <input
                value={searchValue ?? ''}
                onChange={e => onSearch(e.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '5px 12px',
                  fontSize: 14,
                  fontFamily: 'Roboto, sans-serif',
                  color: 'rgba(0,0,0,0.85)',
                  background: 'transparent',
                  minWidth: 0,
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 9px',
                borderLeft: '1px solid #d9d9d9',
                color: 'rgba(0,0,0,0.45)',
                cursor: 'pointer',
                flexShrink: 0,
              }}>
                <Icon name="search" size={14} color="rgba(0,0,0,0.45)" />
              </div>
            </div>
          )}

          {/* Separator dot between search and filters */}
          {onSearch && filters && filters.length > 0 && (
            <div style={{ width: 8 }} />
          )}

          {/* Flat filter pills */}
          {filters?.map(f => (
            <FilterPill key={f.label} config={f} />
          ))}

          {toolbarExtra}

          {/* Right-aligned actions */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {onExport && (
              <button
                onClick={onExport}
                style={{
                  border: '1px solid #d9d9d9',
                  background: '#fff',
                  borderRadius: 2,
                  padding: '5px 16px',
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'rgba(0,0,0,0.85)',
                  height: 32,
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                <Icon name="download" size={14} color="rgba(0,0,0,0.45)" />
                Exportar
              </button>
            )}
            {onAdvancedFilter && (
              <button
                onClick={onAdvancedFilter}
                style={{
                  border: '1px solid #d9d9d9',
                  background: '#fff',
                  borderRadius: 2,
                  padding: '5px 16px',
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'rgba(0,0,0,0.85)',
                  height: 32,
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                <Icon name="filter" size={14} color="rgba(0,0,0,0.45)" />
                Filtro avançado
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: '0 21px' }}>
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        expandable={expandable}
        onRow={onRow}
        size="large"
        scroll={{ x: 'max-content' }}
        components={{
          header: {
            cell: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  background: '#fafafa',
                  fontWeight: 400,
                  fontSize: 14,
                  color: 'rgba(0,0,0,0.85)',
                  padding: '16px',
                }}
              />
            ),
          },
        }}
        pagination={showPagination ? {
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}–${range[1]} de ${total} itens`,
          locale: { items_per_page: ' por página' },
          style: { padding: '12px 16px', margin: 0, borderTop: '1px solid #f0f0f0' },
        } : false}
        style={{ fontSize: 14 }}
      />
      </div>
    </div>
  )
}
