import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { FaMediumM } from 'react-icons/fa'
import { SOCIALS } from '../data'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-white/[0.06] px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-xs text-muted">
          © {year} Shrivarshan Kasi Arul
        </p>

        <div className="flex items-center gap-2">
          {[
            { href: SOCIALS.github, Icon: FiGithub },
            { href: SOCIALS.linkedin, Icon: FiLinkedin },
            { href: SOCIALS.medium, Icon: FaMediumM },
            { href: SOCIALS.email, Icon: FiMail },
          ].map(({ href, Icon }, i) => (
            <a
              key={i}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-muted transition-colors hover:border-term/50 hover:text-term"
            >
              <Icon />
            </a>
          ))}
        </div>

        <p className="font-mono text-[11px] text-muted/70">secured by design</p>
      </div>
    </footer>
  )
}
