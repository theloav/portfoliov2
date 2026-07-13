import { Suspense, lazy } from 'react'
import { FiArrowDownRight, FiGithub, FiLinkedin } from 'react-icons/fi'
import { FaMediumM } from 'react-icons/fa'
import ScrambleText from './ScrambleText'
import ErrorBoundary from './ErrorBoundary'
import { useCanRenderWebGL } from '../lib/hooks'
import { PROFILE, SOCIALS } from '../data'

const ThreatGlobe = lazy(() => import('./ThreatGlobe'))

// Static fallback when WebGL is off / mobile / reduced-motion.
function GlobeFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="h-64 w-64 rounded-full border border-term/20 [background:radial-gradient(circle_at_50%_40%,rgba(0,255,156,0.12),transparent_60%)]">
        <div className="absolute inset-0 rounded-full border border-cyan/10" />
        <div className="absolute inset-6 rounded-full border border-term/10" />
        <div className="absolute inset-12 rounded-full border border-cyan/10" />
      </div>
    </div>
  )
}

export default function Hero() {
  const webgl = useCanRenderWebGL()

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* 3D centerpiece — right/behind on desktop */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center md:justify-end md:pr-[2%]">
        <div className="h-[82vh] max-h-[760px] w-full max-w-[720px] opacity-95">
          <ErrorBoundary name="threat-globe" fallback={<GlobeFallback />}>
            {webgl ? (
              <Suspense fallback={<GlobeFallback />}>
                <ThreatGlobe />
              </Suspense>
            ) : (
              <GlobeFallback />
            )}
          </ErrorBoundary>
        </div>
      </div>

      {/* fade so the copy stays readable over the globe */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-base-900 via-base-900/70 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-term shadow-glow-term" />
          SYSTEM ONLINE // STATUS: OPERATIONAL
        </p>

        <h1 className="font-display text-[13vw] font-bold leading-[0.9] tracking-tight text-slate-50 sm:text-7xl md:text-8xl">
          SHRIVARSHAN
        </h1>

        <div className="mt-4 font-mono text-lg text-cyan text-glow-cyan sm:text-xl">
          <span className="text-muted">&gt;</span>{' '}
          <ScrambleText text={`${PROFILE.role} · ${PROFILE.tagline}`} />
        </div>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400">
          {PROFILE.subBio} Currently securing production systems @{' '}
          <span className="text-slate-200">{PROFILE.company}</span>.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href="#projects" className="btn-term">
            <FiArrowDownRight /> View Operations
          </a>
          <a href="#contact" className="btn-ghost">Establish Contact</a>

          <div className="ml-1 flex items-center gap-1">
            {[
              { href: SOCIALS.github, Icon: FiGithub, label: 'GitHub' },
              { href: SOCIALS.linkedin, Icon: FiLinkedin, label: 'LinkedIn' },
              { href: SOCIALS.medium, Icon: FaMediumM, label: 'Medium' },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-muted transition-colors hover:border-term/50 hover:text-term"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-muted">
        <span className="mb-2 block text-center">SCROLL TO BREACH</span>
        <div className="mx-auto h-8 w-px animate-pulse bg-gradient-to-b from-term to-transparent" />
      </div>
    </section>
  )
}
