import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { useReducedMotion } from '../lib/hooks'

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/**
 * Kinetic divider strip: huge outlined type that drifts sideways forever and
 * reacts to scroll velocity (speeds up + skews with a fast flick, reverses
 * when you scroll back). Single GPU transform — costs nothing.
 */
export default function Marquee({ text, accent, baseVelocity = 1.4 }) {
  const reduced = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [-1500, 0, 1500], [-4, 0, 4], {
    clamp: false,
  })
  const skewX = useTransform(smoothVelocity, [-1500, 1500], [-5, 5])

  const dir = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  useAnimationFrame((t, delta) => {
    if (reduced) return
    let moveBy = dir.current * baseVelocity * (delta / 1000)
    const vf = velocityFactor.get()
    if (vf < 0) dir.current = -1
    else if (vf > 0) dir.current = 1
    moveBy += dir.current * moveBy * Math.abs(vf)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div
      aria-hidden
      className="pointer-events-none relative select-none overflow-hidden py-8 sm:py-10"
    >
      <motion.div
        style={reduced ? undefined : { x, skewX }}
        className="flex w-max whitespace-nowrap will-change-transform"
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="mr-12 flex items-center gap-12 font-display text-[clamp(2.2rem,6.5vw,4.6rem)] font-bold uppercase leading-none tracking-tight"
          >
            <span className="text-transparent [-webkit-text-stroke:1px_rgba(125,136,153,0.38)]">
              {text}
            </span>
            <span className="font-mono text-[0.45em] text-term/70">▚▚</span>
            <span className="text-term/90 text-glow-term">{accent}</span>
            <span className="font-mono text-[0.45em] text-cyan/60">//</span>
          </span>
        ))}
      </motion.div>

      {/* edge fades so the strip melts into the page */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-base-900 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-base-900 to-transparent" />
    </div>
  )
}
