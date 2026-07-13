import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiGithub, FiFileText, FiMenu, FiX, FiVolume2, FiVolumeX } from 'react-icons/fi'
import { NAV, SOCIALS, RESUME } from '../data'
import { isSoundOn, toggleSound, onSoundChange } from '../lib/sound'

function SoundToggle() {
  const [on, setOn] = useState(isSoundOn())
  useEffect(() => onSoundChange(setOn), [])
  return (
    <button
      type="button"
      onClick={() => setOn(toggleSound())}
      aria-label={on ? 'Mute sound' : 'Enable sound'}
      title={on ? 'Sound: on' : 'Sound: off'}
      className={`grid h-9 w-9 place-items-center rounded-md border transition-colors ${
        on ? 'border-term/50 text-term' : 'border-white/10 text-muted hover:text-slate-200'
      }`}
    >
      {on ? <FiVolume2 className="text-sm" /> : <FiVolumeX className="text-sm" />}
    </button>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    NAV.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'border-b border-white/[0.06] bg-base-900/85 backdrop-blur-md' : ''
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="font-mono text-sm font-semibold tracking-widest text-slate-200"
        >
          <span className="text-term">~/</span>shrivarshan
          <span className="ml-1 animate-pulse text-term">_</span>
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`rounded px-3 py-1.5 font-mono text-xs tracking-wide transition-colors ${
                  active === n.id ? 'text-term' : 'text-muted hover:text-slate-200'
                }`}
              >
                <span className="text-term/50">/</span>
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        {/* desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <SoundToggle />
          <a href={RESUME.href} download={RESUME.filename} className="btn-ghost !px-3 !py-1.5 !text-xs">
            <FiFileText /> Resume
          </a>
          <a
            href={SOCIALS.github}
            target="_blank"
            rel="noreferrer"
            className="btn-term !px-3 !py-1.5 !text-xs"
          >
            <FiGithub /> GitHub
          </a>
        </div>

        {/* mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <SoundToggle />
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-200"
          >
            {open ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/[0.06] bg-base-900/95 backdrop-blur-md md:hidden"
          >
            <ul className="mx-auto max-w-6xl px-5 py-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-2 py-3 font-mono text-sm ${
                      active === n.id ? 'text-term' : 'text-slate-300'
                    }`}
                  >
                    <span className="text-term/50">/</span>
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3">
                <a
                  href={RESUME.href}
                  download={RESUME.filename}
                  onClick={() => setOpen(false)}
                  className="btn-ghost justify-center !text-xs"
                >
                  <FiFileText /> Resume
                </a>
                <a
                  href={SOCIALS.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="btn-term justify-center !text-xs"
                >
                  <FiGithub /> GitHub
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
