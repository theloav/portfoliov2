import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import { SKILLS } from '../data'

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <SectionTitle index="02" eyebrow="capabilities" title="The" highlight="Arsenal" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((cat, i) => (
          <Reveal key={cat.title} delay={(i % 3) * 0.08}>
            <div className="group panel relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-term/30">
              <span aria-hidden className="card-scan" />
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-slate-100">{cat.title}</h3>
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <span
                    key={s}
                    className="chip transition-colors group-hover:border-term/20 group-hover:text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
