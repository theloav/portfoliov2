import Reveal from './Reveal'

/**
 * Consistent section header: monospace index + eyebrow, big display title with
 * an accent highlight, and a thin neon rule.
 */
export default function SectionTitle({ index, eyebrow, title, highlight }) {
  return (
    <Reveal className="mb-12">
      <p className="eyebrow mb-3">
        <span className="text-muted">{index}</span> // {eyebrow}
      </p>
      <h2 className="glitch font-display text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
        {title} <span className="text-term text-glow-term">{highlight}</span>
      </h2>
      <div className="mt-5 h-px w-24 bg-gradient-to-r from-term/70 to-transparent" />
    </Reveal>
  )
}
