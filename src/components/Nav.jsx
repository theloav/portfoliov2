import { useEffect, useState } from 'react'
import { FiGithub } from 'react-icons/fi'
import { NAV, SOCIALS } from '../data'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV.map((n) => n.id)
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/[0.06] bg-base-900/80 backdrop-blur-md' : ''
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#top" className="group font-mono text-sm font-semibold tracking-widest text-slate-200">
          <span className="text-term">~/</span>shrivarshan
          <span className="ml-1 animate-pulse text-term">_</span>
        </a>

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

        <a
          href={SOCIALS.github}
          target="_blank"
          rel="noreferrer"
          className="btn-term !px-3 !py-1.5 !text-xs"
        >
          <FiGithub /> GitHub
        </a>
      </nav>
    </header>
  )
}
