import { useEffect, useRef, useState } from 'react'

export default function CountUp({ value, prefix = '', suffix = '', duration = 1400 }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true
            const t0 = performance.now()
            const step = (t) => {
              const p = Math.min(1, (t - t0) / duration)
              const eased = 1 - Math.pow(1 - p, 3)
              setN(Math.round(eased * value))
              if (p < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          }
        })
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  )
}
