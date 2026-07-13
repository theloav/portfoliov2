import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrambleText from './ScrambleText'

const rise = { duration: 0.75, ease: [0.22, 1, 0.36, 1] }

/**
 * Cinematic section header: eyebrow slides in, the big title rises out of a
 * clip mask, and the accent word live-decrypts the moment it enters view.
 */
export default function SectionTitle({ index, eyebrow, title, highlight }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="mb-12">
      <motion.p
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ ...rise, duration: 0.5 }}
        className="eyebrow mb-3"
      >
        <span className="text-muted">{index}</span> // {eyebrow}
      </motion.p>

      <h2 className="glitch overflow-hidden font-display text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
        <motion.span
          className="block will-change-transform"
          initial={{ y: '110%' }}
          animate={inView ? { y: 0 } : undefined}
          transition={rise}
        >
          {title}{' '}
          <span className="text-term text-glow-term">
            {inView ? <ScrambleText text={highlight} /> : highlight}
          </span>
        </motion.span>
      </h2>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ ...rise, delay: 0.2 }}
        className="mt-5 h-px w-24 origin-left bg-gradient-to-r from-term/70 to-transparent"
      />
    </div>
  )
}
