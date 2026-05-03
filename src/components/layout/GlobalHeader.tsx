'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/shared/Icon'
import Badge from '@/components/shared/Badge'
import { useNavStore } from '@/store/nav.store'
import { useAuthStore } from '@/store/auth.store'
import { logout as apiLogout } from '@/services/authService'
import ChangelogModal from './ChangelogModal'

export default function GlobalHeader() {
  const router = useRouter()
  const toggleSidebar = useNavStore((s) => s.toggleSidebar)
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [changelogOpen, setChangelogOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const initials = (user?.name ?? 'Sub Adquirente')
    .split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')

  const handleLogout = async () => {
    setUserMenuOpen(false)
    try { await apiLogout() } catch { /* ignore */ }
    clearAuth()
    router.replace('/login')
  }

  const expand = () => {
    setSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 60)
  }

  const collapse = useCallback(() => {
    if (!query) setSearchOpen(false)
  }, [query])

  const clear = () => {
    setQuery('')
    setSearchOpen(false)
  }

  // Escape fecha e limpa
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) clear()
      if (e.key === 'Escape' && userMenuOpen) setUserMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen, userMenuOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Click fora fecha o user menu
  useEffect(() => {
    if (!userMenuOpen) return
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [userMenuOpen])

  return (
    <div style={{
      width: '100%', height: 48, background: '#fff',
      borderBottom: '1px solid #f0f0f0', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)', zIndex: 100,
    }}>
      {/* Esquerda: menu + logo + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={toggleSidebar}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center' }}
        >
          <Icon name="menu" size={18} />
        </button>
        <img src="/logo-tupi.svg" alt="TUPI" style={{ height: 20, display: 'block' }} />
        <span style={{ fontSize: 12, background: 'rgba(24,144,255,0.1)', color: '#1890FF', border: '1px solid #91d5ff', borderRadius: 2, padding: '1px 8px', fontWeight: 500 }}>
          Sub-adquirente
        </span>
      </div>

      {/* Direita: search + bell + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

        {/* Search — ícone que expande para input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          width: searchOpen ? 220 : 32,
          height: 32,
          border: searchOpen ? '1px solid #91d5ff' : 'none',
          borderRadius: 2,
          background: searchOpen ? '#fff' : 'transparent',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease, background 0.2s ease',
        }}>
          {/* Ícone — clicável só quando fechado */}
          <button
            onClick={searchOpen ? undefined : expand}
            tabIndex={searchOpen ? -1 : 0}
            style={{
              background: 'none', border: 'none',
              cursor: searchOpen ? 'default' : 'pointer',
              color: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, flexShrink: 0,
              transition: 'color 0.2s ease',
            }}
          >
            <Icon name="search" size={16} color={searchOpen ? '#1890FF' : 'rgba(0,0,0,0.45)'} />
          </button>

          {/* Input — visível apenas quando expandido */}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={collapse}
            placeholder="Buscar..."
            style={{
              border: 'none', outline: 'none',
              fontSize: 13, fontFamily: 'Roboto',
              color: 'rgba(0,0,0,0.85)',
              background: 'transparent',
              flex: 1, minWidth: 0,
              padding: '0 8px 0 0',
              opacity: searchOpen ? 1 : 0,
              transition: 'opacity 0.15s ease 0.1s',
            }}
          />

          {/* X para limpar quando tem conteúdo */}
          {searchOpen && query && (
            <button
              onMouseDown={(e) => { e.preventDefault(); clear() }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center',
                padding: '0 8px 0 0', flexShrink: 0, fontSize: 12,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Bell */}
        <Badge count={5}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center' }}>
            <Icon name="bell" size={18} />
          </button>
        </Badge>

        {/* User */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setUserMenuOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#722ED1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600 }}>{initials || 'SA'}</div>
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>{user?.name ?? 'Sub Adquirente'}</span>
            <Icon name="chevronDown" size={12} color="rgba(0,0,0,0.45)" />
          </div>

          {userMenuOpen && (
            <div style={{ position:'absolute', top:38, right:0, minWidth:220, background:'#fff', border:'1px solid #f0f0f0', borderRadius:2, boxShadow:'0 4px 12px rgba(0,0,0,0.12)', zIndex:120, padding:'6px 0' }}>
              {user && (
                <div style={{ padding:'8px 14px', borderBottom:'1px solid #f0f0f0' }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'rgba(0,0,0,0.85)' }}>{user.name}</div>
                  <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)' }}>{user.email}</div>
                  {user.organization?.name && (
                    <div style={{ fontSize:11, color:'rgba(0,0,0,0.45)', marginTop:2 }}>{user.organization.name}</div>
                  )}
                </div>
              )}
              <button onClick={() => { setUserMenuOpen(false); setChangelogOpen(true) }}
                style={{ width:'100%', textAlign:'left', padding:'8px 14px', background:'none', border:'none', cursor:'pointer', fontSize:13, color:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', gap:8 }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#f5f5f5'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='none'}>
                <Icon name="info" size={14} color="rgba(0,0,0,0.45)" />
                Novidades
              </button>
              <button onClick={handleLogout}
                style={{ width:'100%', textAlign:'left', padding:'8px 14px', background:'none', border:'none', cursor:'pointer', fontSize:13, color:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', gap:8 }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#f5f5f5'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='none'}>
                <Icon name="logOut" size={14} color="rgba(0,0,0,0.45)" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      <ChangelogModal open={changelogOpen} onClose={() => setChangelogOpen(false)} />
    </div>
  )
}
