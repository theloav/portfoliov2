import { useEffect, useRef } from 'react'
import { sfx } from '../lib/sound'

/**
 * Viewfinder cursor: corner-bracket frame + center crosshair move as one rigid
 * unit; the frame opens over interactive elements. Desktop / fine-pointer only.
 *
 * Both elements are ALWAYS rendered so their refs exist before the effect runs
 * (v1 crash lesson). `has-cursor` — which hides the native cursor — is only
 * added once we know a fine pointer is present.
 */
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const mx = window.innerWidth / 2
    const my = window.innerHeight / 2
    dot.style.transform = `translate(${mx}px, ${my}px)`
    ring.style.transform = `translate(${mx}px, ${my}px)`

    // Frame and crosshair move as ONE rigid viewfinder — no lag between them.
    const onMove = (e) => {
      const t = `translate(${e.clientX}px, ${e.clientY}px)`
      dot.style.transform = t
      ring.style.transform = t
      const interactive = e.target?.closest?.('a, button, [data-cursor], input, textarea')
      const wasActive = ring.classList.contains('cursor-ring--active')
      ring.classList.toggle('cursor-ring--active', !!interactive)
      if (interactive && !wasActive) sfx.lock() // chirp on target lock-on
    }

    document.body.classList.add('has-cursor')
    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      {/* viewfinder frame: four corner brackets that lag behind the crosshair */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      {/* center crosshair "+" */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
