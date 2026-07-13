import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '../lib/hooks'

/**
 * Buttery smooth-scroll via Lenis. Disabled entirely under reduced-motion so
 * the page uses native scrolling. Exposes nothing — mount once near the root.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Let anchor links drive Lenis for a smooth glide to sections.
    const onClick = (e) => {
      const a = e.target?.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -70 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced])

  return null
}
