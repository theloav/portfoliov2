import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________01'

/**
 * Decrypts `text` from random glyphs into the final string on mount (and
 * optionally when it re-enters view). Cheap, no deps.
 */
export default function ScrambleText({ text, className = '', speed = 1 }) {
  const [display, setDisplay] = useState(text)
  const frame = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    const chars = text.split('')
    let f = 0
    const total = 28 / speed
    const tick = () => {
      const out = chars.map((c, i) => {
        if (c === ' ') return ' '
        const start = i * 1.4
        if (f < start) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        if (f < start + 8) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        return c
      })
      setDisplay(out.join(''))
      f += 1
      if (f < total + chars.length * 1.4) {
        raf.current = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }
    frame.current = 0
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [text, speed])

  return <span className={className}>{display}</span>
}
