import { Suspense, lazy, useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowDownRight, FiGithub, FiLinkedin, FiDownload } from 'react-icons/fi'
import { FaMediumM } from 'react-icons/fa'
import ScrambleText from './ScrambleText'
import ErrorBoundary from './ErrorBoundary'
import Magnetic from './Magnetic'
import { useCanRenderWebGL, useReducedMotion } from '../lib/hooks'
import { PROFILE, SOCIALS, RESUME } from '../data'

gsap.registerPlugin(ScrollTrigger)

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
  const reduced = useReducedMotion()

  const sectionRef = useRef(null)
  const globeRef = useRef(null)
  const contentRef = useRef(null)

  // Freeze the globe render loop once the hero leaves the viewport (main lag fix).
  const inView = useInView(sectionRef, { margin: '120px 0px 120px 0px' })

  // Mouse parallax — lives on NESTED motion layers so it never fights the
  // GSAP scroll transforms on the outer refs. Springs keep it liquid.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springCfg = { stiffness: 60, damping: 18, mass: 0.6 }
  const globeX = useSpring(useTransform(mx, [-1, 1], [16, -16]), springCfg)
  const globeY = useSpring(useTransform(my, [-1, 1], [12, -12]), springCfg)
  const copyX = useSpring(useTransform(mx, [-1, 1], [-8, 8]), springCfg)
  const copyY = useSpring(useTransform(my, [-1, 1], [-6, 6]), springCfg)

  const onMouseMove = (e) => {
    if (reduced) return
    mx.set((e.clientX / window.innerWidth) * 2 - 1)
    my.set((e.clientY / window.innerHeight) * 2 - 1)
  }

  // Cheap, GPU-composited parallax as you scroll through the hero.
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const st = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
      gsap.to(globeRef.current, { yPercent: 14, ease: 'none', scrollTrigger: st })
      gsap.to(contentRef.current, { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: st })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="top"
      onMouseMove={onMouseMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* 3D centerpiece — right/behind on desktop. Outer layer stays click-through
          so hero buttons work; the globe box itself is interactive (drag to spin). */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center md:justify-end md:pr-[2%]">
        <div
          ref={globeRef}
          className="pointer-events-auto relative h-[82vh] max-h-[760px] w-full max-w-[720px] opacity-95 [will-change:transform]"
        >
          <motion.div style={{ x: globeX, y: globeY }} className="h-full w-full">
            <ErrorBoundary name="threat-globe" fallback={<GlobeFallback />}>
              {webgl ? (
                <Suspense fallback={<GlobeFallback />}>
                  <ThreatGlobe active={inView} />
                  <span className="pointer-events-none absolute bottom-2 right-2 hidden font-mono text-[10px] tracking-widest text-muted/60 lg:block">
                    drag to rotate ↻ · click to strike ✛
                  </span>
                </Suspense>
              ) : (
                <GlobeFallback />
              )}
            </ErrorBoundary>
          </motion.div>
        </div>
      </div>

      {/* fade so the copy stays readable over the globe */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-base-900 via-base-900/70 to-transparent" />

      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-6xl px-5 [will-change:transform]">
        <motion.div style={{ x: copyX, y: copyY }}>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-term shadow-glow-term" />
            SYSTEM ONLINE // STATUS: OPERATIONAL
          </p>

          <h1 className="font-display text-[clamp(2.6rem,12vw,5.5rem)] font-bold leading-[0.9] tracking-tight text-slate-50 sm:text-7xl md:text-8xl">
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
            <Magnetic>
              <a href="#projects" className="btn-term">
                <FiArrowDownRight /> View Operations
              </a>
            </Magnetic>
            <Magnetic>
              <a href={RESUME.href} download={RESUME.filename} className="btn-ghost">
                <FiDownload /> Resume
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn-ghost">Establish Contact</a>
            </Magnetic>

            <div className="ml-1 flex items-center gap-1">
              {[
                { href: SOCIALS.github, Icon: FiGithub, label: 'GitHub' },
                { href: SOCIALS.linkedin, Icon: FiLinkedin, label: 'LinkedIn' },
                { href: SOCIALS.medium, Icon: FaMediumM, label: 'Medium' },
              ].map(({ href, Icon, label }) => (
                <Magnetic key={label} strength={0.4}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-muted transition-colors hover:border-term/50 hover:text-term"
                  >
                    <Icon />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-muted">
        <span className="mb-2 block text-center">SCROLL TO BREACH</span>
        <div className="mx-auto h-8 w-px animate-pulse bg-gradient-to-b from-term to-transparent" />
      </div>
    </section>
  )
}
