import { FiMapPin, FiMail, FiPhone, FiCheckCircle, FiClock } from 'react-icons/fi'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import { PROFILE, CERTS } from '../data'

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <SectionTitle index="01" eyebrow="whoami" title="Operator" highlight="Dossier" />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* bio */}
        <Reveal className="lg:col-span-3">
          <div className="bracket panel relative h-full p-7">
            <p className="mb-2 font-mono text-xs text-term">// profile</p>
            <h3 className="font-display text-2xl font-semibold text-slate-100">{PROFILE.name}</h3>
            <p className="mb-5 font-mono text-sm text-cyan">
              {PROFILE.role} @ {PROFILE.company}
            </p>
            <p className="mb-4 leading-relaxed text-slate-400">{PROFILE.bio}</p>
            <p className="leading-relaxed text-slate-400">{PROFILE.subBio}</p>

            <div className="mt-7 grid gap-3 border-t border-white/[0.06] pt-6 sm:grid-cols-2">
              {[
                { Icon: FiMapPin, text: PROFILE.location },
                { Icon: FiMail, text: PROFILE.email },
                { Icon: FiPhone, text: PROFILE.phone },
                { Icon: HiOutlineAcademicCap, text: PROFILE.education },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-slate-300">
                  <Icon className="shrink-0 text-term" />
                  <span className="truncate">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* certs */}
        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="panel h-full p-7">
            <p className="mb-5 font-mono text-xs text-term">// certifications</p>
            <ul className="space-y-2.5">
              {CERTS.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5"
                >
                  {c.done ? (
                    <FiCheckCircle className="shrink-0 text-term" />
                  ) : (
                    <FiClock className="shrink-0 text-danger" />
                  )}
                  <div className="min-w-0">
                    <p className={`font-mono text-sm font-semibold ${c.done ? 'text-slate-200' : 'text-danger'}`}>
                      {c.name}
                    </p>
                    <p className="truncate text-xs text-muted">{c.full}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
