// Tiny synth SFX engine — no audio files, all Web Audio oscillators.
// OFF by default; only wakes after the user flips the toggle (browsers block
// autoplay anyway). Every sound is short + quiet so it never annoys.

let ctx = null
let enabled = false
const listeners = new Set()

function ac() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function isSoundOn() {
  return enabled
}
export function onSoundChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
export function toggleSound() {
  enabled = !enabled
  if (enabled) blip(660, 0.05, 'sine', 0.05) // confirmation chirp
  listeners.forEach((f) => f(enabled))
  return enabled
}

// Core one-shot: freq sweep from f0→f1 over dur seconds.
function tone(f0, f1, dur, type = 'sine', gain = 0.06) {
  const a = ac()
  if (!a || !enabled) return
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(f0, a.currentTime)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), a.currentTime + dur)
  g.gain.setValueAtTime(gain, a.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur)
  osc.connect(g).connect(a.destination)
  osc.start()
  osc.stop(a.currentTime + dur)
}

function blip(f, dur, type, gain) {
  tone(f, f, dur, type, gain)
}

// Named cues used around the site.
export const sfx = {
  lock: () => tone(880, 1320, 0.06, 'square', 0.03), // crosshair snaps onto a target
  strike: () => {
    tone(180, 40, 0.35, 'sawtooth', 0.09) // globe impact "thoom"
    tone(520, 120, 0.12, 'square', 0.03)
  },
  hover: () => blip(440, 0.03, 'sine', 0.02),
  glitch: () => tone(120, 1400, 0.5, 'sawtooth', 0.05),
}
