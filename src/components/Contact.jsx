import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { FiMail, FiGithub, FiLinkedin, FiMapPin, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { FaMediumM } from 'react-icons/fa'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import { PROFILE, SOCIALS, EMAILJS } from '../data'

const LINKS = [
  { Icon: FiMail, label: 'Email', value: PROFILE.email, href: SOCIALS.email },
  { Icon: FiGithub, label: 'GitHub', value: 'github.com/theloav', href: SOCIALS.github },
  { Icon: FiLinkedin, label: 'LinkedIn', value: 'in/shri-arshan', href: SOCIALS.linkedin },
  { Icon: FaMediumM, label: 'Medium', value: '@shrivarshan81', href: SOCIALS.medium },
  { Icon: FiMapPin, label: 'Location', value: PROFILE.location, href: null },
]

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState(null) // null | sending | sent | error

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.sendForm(EMAILJS.serviceId, EMAILJS.templateId, formRef.current, EMAILJS.publicKey)
      setStatus('sent')
      formRef.current.reset()
      setTimeout(() => setStatus(null), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(null), 5000)
    }
  }

  const input =
    'w-full rounded-md border border-white/10 bg-base-900/60 px-4 py-3 font-mono text-sm text-slate-200 outline-none transition-colors placeholder:text-muted/60 focus:border-term/50 focus:ring-1 focus:ring-term/20'

  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <SectionTitle index="06" eyebrow="uplink" title="Establish" highlight="Contact" />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* channels */}
        <Reveal className="lg:col-span-2">
          <div className="panel h-full p-7">
            <p className="mb-6 leading-relaxed text-slate-400">
              Open to security engineering roles, red-team collaborations, and AI-security research.
              Drop a line — encrypted or otherwise.
            </p>
            <ul className="space-y-3">
              {LINKS.map(({ Icon, label, value, href }) => {
                const body = (
                  <>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 text-term">
                      <Icon />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[11px] uppercase tracking-wide text-muted">
                        {label}
                      </span>
                      <span className="block truncate text-sm text-slate-200">{value}</span>
                    </span>
                  </>
                )
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5 transition-colors hover:border-term/30"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
                        {body}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>

        {/* terminal form */}
        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="panel overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-term/70" />
              <span className="ml-2 font-mono text-xs text-muted">operator@shrivarshan: ~/send_message</span>
            </div>

            <form ref={formRef} onSubmit={submit} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="from_name" required placeholder="// your name" className={input} />
                <input name="from_email" type="email" required placeholder="// your email" className={input} />
              </div>
              <input name="subject" required placeholder="// subject" className={input} />
              <textarea name="message" required rows={5} placeholder="// message payload..." className={input} />

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-term w-full justify-center disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-term/40 border-t-term" />
                    TRANSMITTING...
                  </>
                ) : status === 'sent' ? (
                  <>
                    <FiCheckCircle /> MESSAGE SENT
                  </>
                ) : status === 'error' ? (
                  <>
                    <FiAlertCircle /> FAILED — TRY EMAIL
                  </>
                ) : (
                  <>
                    <FiSend /> Transmit Message
                  </>
                )}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
