import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import Magnetic from './Magnetic'
import { useReducedMotion } from '../lib/hooks'
import { PROJECTS, SOCIALS } from '../data'

function ProjectCard({ p, index }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  // 3D tilt — springs keep it silky; touch devices never fire mousemove.
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18, mass: 0.4 })
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 18, mass: 0.4 })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    if (!reduced) {
      rx.set(-py * 7)
      ry.set(px * 9)
    }
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={p.href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-base-800/60 p-6 transition-colors duration-300 will-change-transform hover:border-term/40"
    >
      {/* cursor spotlight + glare */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(340px circle at var(--mx,-100px) var(--my,-100px), rgba(0,255,156,0.08), transparent 60%), radial-gradient(200px circle at var(--mx,-100px) var(--my,-100px), rgba(255,255,255,0.04), transparent 70%)',
        }}
      />
      <span aria-hidden className="card-scan" />

      <div className="relative mb-4 flex items-center justify-between">
        <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
        <div className="flex items-center gap-2">
          {p.featured && (
            <span className="rounded border border-term/40 px-2 py-0.5 font-mono text-[10px] text-term">
              FEATURED
            </span>
          )}
          <span className="rounded border border-cyan/30 px-2 py-0.5 font-mono text-[10px] text-cyan">
            {p.tag}
          </span>
        </div>
      </div>

      <h3 className="relative flex items-center gap-2 font-display text-xl font-semibold text-slate-100">
        {p.title}
        <FiArrowUpRight className="text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-term" />
      </h3>

      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-slate-400">{p.desc}</p>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>
    </motion.a>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle index="04" eyebrow="operations" title="Built &" highlight="Shipped" />
        <Magnetic className="mb-12 hidden sm:inline-block">
          <a href={SOCIALS.github} target="_blank" rel="noreferrer" className="btn-ghost">
            <FiGithub /> All repositories
          </a>
        </Magnetic>
      </div>

      <div className="grid gap-5 [perspective:1200px] md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.08}>
            <ProjectCard p={p} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
