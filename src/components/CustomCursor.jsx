import { useEffect, useRef } from 'react'

/**
 * Dual-ring operator cursor. Dot tracks instantly; ring eases behind it and
 * expands over interactive elements. Desktop / fine-pointer only.
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

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf

    dot.style.transform = `translate(${mx}px, ${my}px)`
    ring.style.transform = `translate(${rx}px, ${ry}px)`

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px)`
      const interactive = e.target?.closest?.('a, button, [data-cursor], input, textarea')
      ring.classList.toggle('cursor-ring--active', !!interactive)
    }
    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }

    document.body.classList.add('has-cursor')
    window.addEventListener('mousemove', onMove)
    loop()

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
