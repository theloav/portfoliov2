import { FiMapPin, FiMail, FiPhone, FiCheckCircle, FiClock } from 'react-icons/fi'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import { PROFILE, CERTS } from '../data'

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <SectionTitle index="01" eyebrow="whoami" title="Operator" highlight="Dossier" />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* photo */}
        <Reveal className="lg:col-span-5">
          <div className="bracket group relative h-full min-h-[420px] overflow-hidden rounded-xl border border-white/[0.08]">
            <img
              src="/profile.jpg"
              alt={PROFILE.name}
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] [filter:grayscale(0.12)_contrast(1.05)]"
            />
            {/* theme wash + scanlines */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-900 via-base-900/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 mix-blend-overlay [background:linear-gradient(120deg,rgba(0,255,156,0.12),transparent_40%,rgba(56,194,255,0.12))]" />
            <div className="pointer-events-none absolute inset-0 opacity-30 [background:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,255,156,0.05)_3px,rgba(0,255,156,0.05)_4px)]" />

            {/* overlay */}
            <span className="absolute left-3 top-3 rounded border border-term/40 bg-base-900/60 px-2 py-0.5 font-mono text-[10px] tracking-widest text-term backdrop-blur-sm">
              OPERATOR
            </span>
          </div>
        </Reveal>

        {/* bio */}
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="panel relative h-full p-7">
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
                <div key={text} className="flex items-start gap-3 text-sm text-slate-300">
                  <Icon className="mt-0.5 shrink-0 text-term" />
                  <span className="break-words leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* certs — full width */}
      <Reveal delay={0.05} className="mt-6">
        <div className="panel p-7">
          <p className="mb-5 font-mono text-xs text-term">// certifications</p>
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  )
}
