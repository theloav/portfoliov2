import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import { EXPERIENCE } from '../data'

export default function Experience() {
  const railRef = useRef(null)
  // The timeline rail literally draws itself as you scroll through the log.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 78%', 'end 55%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  return (
    <section id="experience" className="relative mx-auto max-w-5xl scroll-mt-24 px-5 py-28">
      <SectionTitle index="03" eyebrow="mission log" title="Field" highlight="Operations" />

      <div ref={railRef} className="relative">
        {/* timeline rail — faint track + scroll-drawn glow */}
        <div className="absolute left-2 top-1 bottom-1 w-px bg-white/[0.07]" />
        <motion.div
          style={{ scaleY }}
          className="absolute left-2 top-1 bottom-1 w-px origin-top bg-gradient-to-b from-term via-cyan to-term/30 shadow-glow-term"
        />

        <div className="space-y-8">
          {EXPERIENCE.map((exp, i) => (
            <Reveal key={exp.company} delay={i * 0.05}>
              <div className="relative pl-10">
                {/* node */}
                <span
                  className={`absolute left-0 top-2 grid h-4 w-4 place-items-center rounded-full border ${
                    exp.active
                      ? 'border-term bg-term/20 shadow-glow-term'
                      : 'border-white/20 bg-base-800'
                  }`}
                >
                  {exp.active && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-term" />}
                </span>

                <div className="panel p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-slate-100">{exp.role}</h3>
                      <p className="font-mono text-sm text-cyan">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block rounded border px-2.5 py-0.5 font-mono text-xs ${
                          exp.active
                            ? 'border-term/40 text-term'
                            : 'border-white/10 text-muted'
                        }`}
                      >
                        {exp.active ? 'ACTIVE' : 'CLOSED'}
                      </span>
                      <p className="mt-1.5 font-mono text-xs text-muted">{exp.period}</p>
                      <p className="font-mono text-[11px] text-muted/70">{exp.location}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-slate-400">
                        <span className="mt-1 shrink-0 text-term">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
