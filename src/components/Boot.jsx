import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINES = [
  'initializing secure console...',
  'loading operator profile: shrivarshan',
  'mounting threat-intel feed... ok',
  'decrypting portfolio payload... ok',
  'access granted — welcome, operator',
]

/**
 * Brief system-boot overlay. Types a few operator log lines, then calls
 * onDone. Kept short; gated once-per-session by the parent.
 */
export default function Boot({ onDone }) {
  const [shown, setShown] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setShown((s) => [...s, LINES[i]])
      i += 1
      if (i >= LINES.length) {
        clearInterval(id)
        setTimeout(() => setDone(true), 550)
      }
    }, 320)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => done && onDone?.()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-base-900"
    >
      <div className="pointer-events-none absolute inset-0 animate-flicker opacity-60 [background:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,156,0.03)_2px,rgba(0,255,156,0.03)_3px)]" />
      <div className="w-[min(90vw,560px)] font-mono text-sm">
        <p className="mb-4 text-xs tracking-[0.35em] text-term/70">SHRIVARSHAN // SECURE BOOT</p>
        {shown.map((l, i) => (
          <div key={i} className="flex gap-2 text-slate-400">
            <span className="text-term">$</span>
            <span>{l}</span>
          </div>
        ))}
        <span className="mt-1 inline-block h-4 w-2 animate-pulse bg-term align-middle" />
      </div>
    </motion.div>
  )
}
