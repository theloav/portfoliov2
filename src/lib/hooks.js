import { useEffect, useState } from 'react'

/** True when the user prefers reduced motion. SSR-safe. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduced
}

/**
 * Should we run the heavy WebGL centerpiece?
 * Requires a fine pointer (desktop), a wide-enough screen, no reduced-motion
 * preference, and a working WebGL context. Everything falls back gracefully.
 */
export function useCanRenderWebGL() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const wide = window.innerWidth >= 768
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let hasWebGL = false
    try {
      const c = document.createElement('canvas')
      hasWebGL = !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
      hasWebGL = false
    }
    setOk(finePointer && wide && !reduced && hasWebGL)
  }, [])
  return ok
}
