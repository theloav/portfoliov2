import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { FiArrowUpRight, FiGithub, FiX, FiExternalLink } from 'react-icons/fi'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import Magnetic from './Magnetic'
import { useReducedMotion } from '../lib/hooks'
import { PROJECTS, SOCIALS } from '../data'

function ProjectCard({ p, index, onOpen }) {
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

  const hasCase = !!p.caseStudy

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => (hasCase ? onOpen(p) : window.open(p.href, '_blank', 'noopener'))}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-base-800/60 p-6 transition-colors duration-300 will-change-transform hover:border-term/40"
      data-cursor
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

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        {p.stack.map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
        {hasCase && (
          <span className="ml-auto font-mono text-[10px] tracking-wide text-term/80">
            read case study →
          </span>
        )}
      </div>
    </motion.div>
  )
}

function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const cs = project.caseStudy
  const blocks = [
    { k: 'the_problem', label: '// the problem', body: cs.problem, tone: 'text-danger' },
    { k: 'what_i_built', label: '// what i built', body: cs.build, tone: 'text-term' },
    { k: 'security_impact', label: '// security impact', body: cs.impact, tone: 'text-cyan' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[95] grid place-items-center bg-base-900/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 24, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 24, scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="panel relative w-full max-w-2xl overflow-hidden"
      >
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-term/70" />
          <span className="ml-2 truncate font-mono text-xs text-muted">
            ~/ops/{project.title.toLowerCase().replace(/\s+/g, '-')}/CASE_STUDY.md
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-cursor
            className="ml-auto grid h-7 w-7 place-items-center rounded text-muted transition-colors hover:text-slate-100"
          >
            <FiX />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <h3 className="font-display text-2xl font-bold text-slate-50">{project.title}</h3>
            <span className="rounded border border-cyan/30 px-2 py-0.5 font-mono text-[10px] text-cyan">
              {project.tag}
            </span>
          </div>

          <div className="space-y-5">
            {blocks.map((b) => (
              <div key={b.k}>
                <p className={`mb-1.5 font-mono text-xs ${b.tone}`}>{b.label}</p>
                <p className="text-sm leading-relaxed text-slate-300">{b.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.06] pt-5">
            {project.stack.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>

          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="btn-term mt-6 w-full justify-center"
          >
            <FiGithub /> View source on GitHub <FiExternalLink className="opacity-70" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [open, setOpen] = useState(null)

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
            <ProjectCard p={p} index={i} onOpen={setOpen} />
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {open && <CaseStudyModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  )
}
