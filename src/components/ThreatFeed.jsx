import { useEffect, useRef, useState } from 'react'

const CITIES = [
  'MOSCOW', 'BEIJING', 'PYONGYANG', 'SÃO PAULO', 'LAGOS', 'KYIV',
  'LONDON', 'NEW YORK', 'TOKYO', 'SINGAPORE', 'BERLIN', 'TEHRAN',
]
const EVENTS = [
  { txt: 'blocked intrusion attempt', tone: 'term' },
  { txt: 'dropped C2 callback', tone: 'term' },
  { txt: 'quarantined payload', tone: 'term' },
  { txt: 'rotated session keys', tone: 'cyan' },
  { txt: 'flagged anomalous login', tone: 'cyan' },
  { txt: 'sinkholed botnet node', tone: 'term' },
  { txt: 'patched exposed endpoint', tone: 'cyan' },
  { txt: 'CRITICAL: brute-force burst', tone: 'danger' },
  { txt: 'CRITICAL: zero-day probe', tone: 'danger' },
  { txt: 'honeypot engaged attacker', tone: 'term' },
]

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)]
const ip = () =>
  `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.x.x`

function makeLine() {
  const now = new Date()
  const ts = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
  const ev = rnd(EVENTS)
  return {
    id: Math.random().toString(36).slice(2),
    ts,
    ev,
    ip: ip(),
    src: rnd(CITIES),
  }
}

/**
 * Fake-but-plausible SOC feed. New line every couple of seconds while
 * visible; keeps the last few, oldest fading out. Pure text — free.
 */
export default function ThreatFeed({ active = true }) {
  const [lines, setLines] = useState(() => [makeLine()])
  const timer = useRef(null)

  useEffect(() => {
    if (!active) return
    const tick = () => {
      setLines((l) => [...l.slice(-3), makeLine()])
      timer.current = setTimeout(tick, 1800 + Math.random() * 1800)
    }
    timer.current = setTimeout(tick, 1500)
    return () => clearTimeout(timer.current)
  }, [active])

  const toneCls = {
    term: 'text-term',
    cyan: 'text-cyan',
    danger: 'text-danger',
  }

  return (
    <div className="pointer-events-none select-none font-mono text-[11px] leading-5">
      <p className="mb-1 tracking-[0.25em] text-muted/70">// LIVE THREAT FEED</p>
      {lines.map((l, i) => (
        <p
          key={l.id}
          className="whitespace-nowrap transition-opacity duration-500"
          style={{ opacity: 0.25 + (i / Math.max(1, lines.length - 1)) * 0.75 }}
        >
          <span className="text-muted">[{l.ts}]</span>{' '}
          <span className={toneCls[l.ev.tone]}>{l.ev.txt}</span>{' '}
          <span className="text-muted">
            · SRC {l.ip} · {l.src} → CHENNAI
          </span>
        </p>
      ))}
    </div>
  )
}
