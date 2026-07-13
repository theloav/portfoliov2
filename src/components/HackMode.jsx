import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sfx } from '../lib/sound'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
]

// Matrix-rain flash painted on a canvas while the overlay is up.
function useMatrixRain(canvasRef, on) {
  useEffect(() => {
    if (!on) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = (canvas.width = window.innerWidth * dpr)
    const h = (canvas.height = window.innerHeight * dpr)
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    const cols = Math.floor(w / (16 * dpr))
    const drops = Array(cols).fill(0)
    const glyphs = 'ｱｲｳｴｵｶｷｸ01<>[]{}#$%&*'
    let raf
    const draw = () => {
      ctx.fillStyle = 'rgba(5,6,10,0.15)'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#00ff9c'
      ctx.font = `${16 * dpr}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const c = glyphs[Math.floor(Math.random() * glyphs.length)]
        ctx.fillText(c, i * 16 * dpr, drops[i] * 16 * dpr)
        if (drops[i] * 16 * dpr > h && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [on, canvasRef])
}

/**
 * Hidden "system compromised" gag. Trigger by the Konami code or by typing
 * "breach" anywhere. Screen tears red, matrix rain floods, a fake breach log
 * types out, then it resolves to "defenses held" and fades. ~3.5s total.
 */
export default function HackMode() {
  const [phase, setPhase] = useState('idle') // idle | hacking | held
  const canvasRef = useRef(null)
  const seq = useRef([])
  const typed = useRef('')

  useMatrixRain(canvasRef, phase === 'hacking')

  const fire = () => {
    if (phase !== 'idle') return
    setPhase('hacking')
    sfx.glitch()
    setTimeout(() => setPhase('held'), 2600)
    setTimeout(() => setPhase('idle'), 4200)
  }

  useEffect(() => {
    const onKey = (e) => {
      // ignore while typing in the real terminal / form fields
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      seq.current = [...seq.current, e.key].slice(-KONAMI.length)
      if (KONAMI.every((k, i) => k === seq.current[i])) fire()

      if (e.key.length === 1) {
        typed.current = (typed.current + e.key.toLowerCase()).slice(-6)
        if (typed.current.includes('breach')) {
          typed.current = ''
          fire()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
        >
          <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
          {/* red tear + scanlines */}
          <div className="absolute inset-0 mix-blend-screen [background:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,77,94,0.08)_2px,rgba(255,77,94,0.08)_3px)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[min(90vw,560px)] rounded-lg border border-danger/40 bg-base-900/85 p-6 font-mono text-sm backdrop-blur-sm">
              {phase === 'hacking' ? (
                <>
                  <p className="mb-3 tracking-[0.3em] text-danger">⚠ SYSTEM COMPROMISED</p>
                  <p className="text-slate-400">$ injecting payload...</p>
                  <p className="text-slate-400">$ escalating privileges...</p>
                  <p className="text-slate-400">$ exfiltrating /etc/shadow...</p>
                  <p className="text-danger">$ ████████████ 87%</p>
                </>
              ) : (
                <>
                  <p className="mb-3 tracking-[0.3em] text-term">✓ THREAT NEUTRALIZED</p>
                  <p className="text-slate-400">$ intrusion detected &amp; contained</p>
                  <p className="text-term">$ defenses held. just kidding — you're safe ;)</p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
