'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type TooltipProps = {
  text: string
  children: React.ReactNode
  /** Delay in ms before showing on hover. Default 0. Use 1000 for "1s hover" pattern. */
  delay?: number
  /** When true, omits the inline "?" help icon and just wraps the children. */
  bare?: boolean
  /** Extra style for the wrapper span (useful to pass flex:1, width, etc.) */
  style?: React.CSSProperties
}

export default function Tooltip({ text, children, delay = 0, bare = false, style }: TooltipProps) {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const computePos = () => {
    if (!wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    setPos({
      left: rect.left + rect.width / 2,
      top: rect.top, // tooltip aparece acima — usamos top como referência e translateY(-100%)
    })
  }

  const onEnter = () => {
    computePos()
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

  // Reposition on scroll/resize while visible
  useEffect(() => {
    if (!show) return
    const onScroll = () => computePos()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [show])

  const tooltipNode = show && pos && typeof document !== 'undefined'
    ? createPortal(
        <div style={{
          position:'fixed',
          left: pos.left,
          top: pos.top - 8, // 8px de gap acima do alvo
          transform:'translate(-50%, -100%)',
          background:'rgba(0,0,0,0.85)', color:'#fff',
          fontSize:11, lineHeight:'16px', padding:'6px 10px',
          borderRadius:4, maxWidth:280,
          zIndex:99999, pointerEvents:'none',
          whiteSpace:'normal', boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
        }}>
          {text}
          <div style={{ position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%) rotate(45deg)', width:8, height:8, background:'rgba(0,0,0,0.85)' }} />
        </div>,
        document.body
      )
    : null

  return (
    <>
      <span
        ref={wrapperRef}
        style={{ position:'relative', display:'inline-flex', alignItems:'center', gap: bare ? 0 : 4, ...style }}
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
      </span>
      {tooltipNode}
    </>
  )
}
