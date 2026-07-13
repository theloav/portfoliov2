import { useEffect, useState } from 'react'

/**
 * Fixed heads-up-display frame: corner ticks, a live scroll-progress rail on
 * the right, and a status readout bottom-left. Purely decorative + inert.
 */
export default function Hud() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? h.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const pct = Math.round(progress * 100)

  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden md:block">
      {/* corner ticks */}
      <span className="absolute left-5 top-5 h-5 w-5 border-l border-t border-term/40" />
      <span className="absolute right-5 top-5 h-5 w-5 border-r border-t border-term/40" />
      <span className="absolute bottom-5 left-5 h-5 w-5 border-b border-l border-term/40" />
      <span className="absolute bottom-5 right-5 h-5 w-5 border-b border-r border-term/40" />

      {/* scroll rail */}
      <div className="absolute right-6 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-white/10 lg:block">
        <div
          className="w-px bg-gradient-to-b from-term to-cyan shadow-glow-term"
          style={{ height: `${pct}%` }}
        />
        <span className="absolute -right-1 top-full mt-2 -translate-x-1/2 font-mono text-[10px] text-muted">
          {String(pct).padStart(2, '0')}
        </span>
      </div>

      {/* status readout */}
      <div className="absolute bottom-5 left-12 font-mono text-[10px] tracking-[0.25em] text-muted">
        <span className="text-term">●</span> SECURE&nbsp;·&nbsp;SESSION&nbsp;ACTIVE
      </div>
    </div>
  )
}
