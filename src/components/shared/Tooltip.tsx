'use client'

import { useEffect, useRef, useState } from 'react'

type TooltipProps = {
  text: string
  children: React.ReactNode
  /** Delay in ms before showing on hover. Default 0. Use 1000 for "1s hover" pattern. */
  delay?: number
  /** When true, omits the inline "?" help icon and just wraps the children. */
  bare?: boolean
}

export default function Tooltip({ text, children, delay = 0, bare = false }: TooltipProps) {
  const [show, setShow] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onEnter = () => {
    if (delay > 0) {
      timer.current = setTimeout(() => setShow(true), delay)
    } else {
      setShow(true)
    }
  }
  const onLeave = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
    setShow(false)
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  return (
    <span
      style={{ position:'relative', display:'inline-flex', alignItems:'center', gap: bare ? 0 : 4 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {!bare && (
        <span style={{ cursor:'help', color:'rgba(0,0,0,0.35)', display:'inline-flex', alignItems:'center' }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </span>
      )}
      {show && (
        <div style={{ position:'absolute', left:'50%', bottom:'calc(100% + 6px)', transform:'translateX(-50%)', background:'rgba(0,0,0,0.85)', color:'#fff', fontSize:11, lineHeight:'16px', padding:'6px 10px', borderRadius:4, width:220, zIndex:9999, pointerEvents:'none', whiteSpace:'normal', boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
          {text}
          <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)', width:8, height:8, background:'rgba(0,0,0,0.85)', rotate:'45deg' }} />
        </div>
      )}
    </span>
  )
}
