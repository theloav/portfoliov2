import { useEffect, useRef, useState } from 'react'
import { PROFILE, SOCIALS, RESUME, PROJECTS, SKILLS } from '../data'

const PROMPT = 'operator@shrivarshan:~$'

const HELP = [
  '  help              show this menu',
  '  whoami            operator profile',
  '  ls projects       list shipped operations',
  '  skills            capability clusters',
  '  resume            download the résumé (pdf)',
  '  contact           comms channels',
  '  breach            attempt to hack this site',
  '  sudo hire         escalate privileges',
  '  clear             wipe the console',
]

/**
 * Interactive easter-egg terminal. Static command map — no eval, no network.
 * Type `help` to explore; `breach` runs a staged fake-intrusion bit.
 */
export default function Terminal() {
  const [rows, setRows] = useState([
    { t: 'out', s: 'secure shell v2.0 — type `help` to begin' },
  ])
  const [val, setVal] = useState('')
  const [hist, setHist] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [rows])

  const print = (lines) =>
    setRows((r) => [...r, ...lines.map((s) => ({ t: 'out', s }))])

  const later = (ms, lines, done) => {
    timers.current.push(
      setTimeout(() => {
        print(lines)
        if (done) setBusy(false)
      }, ms)
    )
  }

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase()
    setRows((r) => [...r, { t: 'in', s: raw }])
    if (!cmd) return

    if (cmd === 'clear') {
      setRows([])
      return
    }
    if (cmd === 'help') return print(HELP)
    if (cmd === 'whoami') {
      return print([
        `${PROFILE.name} — ${PROFILE.role} @ ${PROFILE.company}`,
        `${PROFILE.tagline}`,
        `base of operations: ${PROFILE.location}`,
      ])
    }
    if (cmd === 'ls' || cmd === 'ls projects' || cmd === 'projects') {
      return print(PROJECTS.map((p) => `  drwxr-x---  ${p.tag.padEnd(14)} ${p.title}`))
    }
    if (cmd === 'skills') {
      return print(SKILLS.map((c) => `  [${String(c.skills.length).padStart(2, '0')}]  ${c.title}`))
    }
    if (cmd === 'resume' || cmd === 'cat resume' || cmd === 'cat resume.pdf') {
      const a = document.createElement('a')
      a.href = RESUME.href
      a.download = RESUME.filename
      a.click()
      return print(['transferring resume.pdf ... ██████████ 100%', 'saved to your downloads. use it wisely.'])
    }
    if (cmd === 'contact' || cmd === 'socials') {
      return print([
        `  email    ${PROFILE.email}`,
        `  github   ${SOCIALS.github}`,
        `  linkedin ${SOCIALS.linkedin}`,
        `  medium   ${SOCIALS.medium}`,
      ])
    }
    if (cmd === 'breach' || cmd === 'hack' || cmd.startsWith('nmap') || cmd.startsWith('sqlmap')) {
      setBusy(true)
      print(['initiating breach sequence...'])
      later(600, ['  [1/4] scanning perimeter......... 0 open ports'])
      later(1300, ['  [2/4] fuzzing endpoints.......... all sanitized'])
      later(2000, ['  [3/4] injecting payload.......... neutralized by WAF'])
      later(2700, ['  [4/4] social engineering......... operator uninterested'])
      later(3400, ['BREACH FAILED — defenses held. nice try though ;)'], true)
      return
    }
    if (cmd === 'sudo hire' || cmd === 'sudo hire shrivarshan') {
      setBusy(true)
      print(['[sudo] password accepted (it was blank. concerning.)'])
      later(700, ['ACCESS GRANTED — recruitment protocol initiated'])
      later(1400, [`  → drop a line: ${PROFILE.email}`, '  → or use the send_message tab. response SLA: fast.'], true)
      return
    }
    if (cmd.startsWith('sudo')) return print(['permission denied: nice privilege-escalation attempt, operator'])
    if (cmd === 'exit' || cmd === 'logout') {
      return print(['you can check out any time you like, but you can never leave...'])
    }
    return print([`command not found: ${cmd} — try \`help\``])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !busy) {
      run(val)
      if (val.trim()) setHist((h) => [...h, val])
      setHistIdx(-1)
      setVal('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistIdx((i) => {
        const ni = i === -1 ? hist.length - 1 : Math.max(0, i - 1)
        setVal(hist[ni] ?? '')
        return ni
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistIdx((i) => {
        const ni = i === -1 ? -1 : Math.min(hist.length - 1, i + 1)
        setVal(i === hist.length - 1 ? '' : hist[ni] ?? '')
        return ni
      })
    }
  }

  return (
    <div
      className="flex h-[380px] flex-col p-4 font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto pr-1">
        {rows.map((r, i) =>
          r.t === 'in' ? (
            <p key={i} className="text-slate-200">
              <span className="text-term">{PROMPT}</span> {r.s}
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap text-slate-400">{r.s}</p>
          )
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-white/[0.06] pt-3">
        <span className="shrink-0 text-term">{PROMPT}</span>
        <input
          ref={inputRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          spellCheck={false}
          autoComplete="off"
          aria-label="terminal input"
          className="w-full bg-transparent text-slate-200 caret-term outline-none placeholder:text-muted/50"
          placeholder="type `help`"
        />
      </div>
    </div>
  )
}
