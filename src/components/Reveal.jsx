import { motion } from 'framer-motion'

/**
 * Scroll-reveal wrapper. Fades + rises into view once. Reduced-motion users
 * still get the content (framer respects the OS setting for transforms via our
 * global CSS clamp, and `once` keeps it stable).
 */
export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
