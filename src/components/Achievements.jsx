import { FiAward } from 'react-icons/fi'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import CountUp from './CountUp'
import { ACHIEVEMENTS, STATS } from '../data'

const TONE = {
  gold: { bar: 'from-yellow-400 to-orange-500', badge: 'border-yellow-400/40 text-yellow-300' },
  term: { bar: 'from-term to-cyan', badge: 'border-term/40 text-term' },
  cyan: { bar: 'from-cyan to-blue-500', badge: 'border-cyan/40 text-cyan' },
}

export default function Achievements() {
  return (
    <section id="achievements" className="relative mx-auto max-w-5xl scroll-mt-24 px-5 py-28">
      <SectionTitle index="05" eyebrow="recognition" title="Trophy" highlight="Wall" />

      <div className="mb-12 space-y-4">
        {ACHIEVEMENTS.map((a, i) => {
          const tone = TONE[a.tone] || TONE.term
          return (
            <Reveal key={a.title} delay={i * 0.05}>
              <div className="panel relative overflow-hidden p-6 pl-7">
                <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${tone.bar}`} />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <FiAward className="text-lg text-slate-300" />
                    <h3 className="font-display text-base font-semibold text-slate-100">{a.title}</h3>
                  </div>
                  <span className={`rounded border px-2.5 py-0.5 font-mono text-xs ${tone.badge}`}>
                    {a.badge}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{a.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>

      {/* stat counters */}
      <Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="panel bracket relative p-5 text-center">
              <div className="font-display text-3xl font-bold text-term text-glow-term">
                <CountUp value={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
              </div>
              <div className="mt-1 font-mono text-[11px] tracking-wide text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
