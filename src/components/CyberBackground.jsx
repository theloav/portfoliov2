import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'

/**
 * Ambient "living network" background — the cybersecurity answer to sakana's
 * fish. Drifting nodes form a plexus mesh, data packets fire between them,
 * nodes lean toward the cursor, and every tap/click emits a sonar ping that
 * shoves nearby nodes away. Plain 2D canvas, capped DPR, pauses when the tab
 * is hidden — costs almost nothing.
 */
export default function CyberBackground() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0
    let raf = 0
    let running = false
    let frame = 0
    const nodes = []
    const packets = []
    const ripples = []
    const ufos = []
    const pointer = { x: -1e4, y: -1e4 }

    const LINK = 130
    const CURSOR_LINK = 170

    const spawnNode = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: 1 + Math.random() * 1.3,
      hot: Math.random() < 0.16, // a few terminal-green "compromised" nodes
    })

    const spawnUfo = (offscreen) => ({
      x: offscreen ? (Math.random() < 0.5 ? -70 : w + 70) : Math.random() * w,
      y: 50 + Math.random() * h * 0.6,
      dir: Math.random() < 0.5 ? -1 : 1,
      sp: 0.9 + Math.random() * 0.55,
      ph: Math.random() * Math.PI * 2,
      w: 22 + Math.random() * 12,
      zap: null, // { node } or { x, y }, plus t = frames left
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.max(24, Math.min(70, Math.round((w * h) / 26000)))
      while (nodes.length < target) nodes.push(spawnNode())
      nodes.length = target
      const nUfos = w < 640 ? 2 : 3
      while (ufos.length < nUfos) ufos.push(spawnUfo(false))
      ufos.length = nUfos
    }

    const firePacket = () => {
      if (nodes.length < 2) return
      const a = nodes[Math.floor(Math.random() * nodes.length)]
      let b = nodes[Math.floor(Math.random() * nodes.length)]
      for (let tries = 0; tries < 6; tries++) {
        b = nodes[Math.floor(Math.random() * nodes.length)]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d > 180 && d < 640) break
      }
      if (a !== b) packets.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.01 })
    }

    const onPointerMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    const onPointerDown = (e) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, max: 240 + Math.random() * 80 })
      // a ping also flushes a burst of packets — feels alive on tap
      firePacket()
      firePacket()
      // ...and the nearest UFO opens fire on the tap point
      let best = null
      let bestD = Infinity
      for (const u of ufos) {
        const d = Math.hypot(u.x - e.clientX, u.y - e.clientY)
        if (d < bestD) {
          bestD = d
          best = u
        }
      }
      if (best) best.zap = { x: e.clientX, y: e.clientY, t: 28 }
    }

    const step = () => {
      frame++
      ctx.clearRect(0, 0, w, h)

      // ── physics ──
      for (const n of nodes) {
        // gentle cursor pull inside the link radius, repel very close
        const dxp = pointer.x - n.x
        const dyp = pointer.y - n.y
        const dp = Math.hypot(dxp, dyp)
        if (dp < 90 && dp > 0.01) {
          n.vx -= (dxp / dp) * 0.03
          n.vy -= (dyp / dp) * 0.03
        }
        // sonar shove
        for (const rp of ripples) {
          const dxr = n.x - rp.x
          const dyr = n.y - rp.y
          const dr = Math.hypot(dxr, dyr)
          if (dr > 0.01 && Math.abs(dr - rp.r) < 34) {
            n.vx += (dxr / dr) * 0.55
            n.vy += (dyr / dr) * 0.55
          }
        }
        n.x += n.vx
        n.y += n.vy
        // speed cap + soft friction back to drift
        n.vx *= 0.985
        n.vy *= 0.985
        // wrap edges — infinite field, nodes never get stuck
        if (n.x < -20) n.x = w + 20
        if (n.x > w + 20) n.x = -20
        if (n.y < -20) n.y = h + 20
        if (n.y > h + 20) n.y = -20
      }

      // ── mesh lines ──
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue
          const d = Math.hypot(dx, dy)
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.13
            ctx.strokeStyle = `rgba(56,194,255,${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        // link to cursor — the mesh "notices" you
        const dc = Math.hypot(a.x - pointer.x, a.y - pointer.y)
        if (dc < CURSOR_LINK) {
          ctx.strokeStyle = `rgba(0,255,156,${(1 - dc / CURSOR_LINK) * 0.22})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }
      }

      // ── nodes ──
      for (const n of nodes) {
        ctx.fillStyle = n.hot ? 'rgba(0,255,156,0.75)' : 'rgba(56,194,255,0.5)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── data packets (bright dot + fading tail travelling node→node) ──
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.t += p.speed
        if (p.t >= 1) {
          packets.splice(i, 1)
          continue
        }
        const t0 = Math.max(0, p.t - 0.12)
        const x0 = p.a.x + (p.b.x - p.a.x) * t0
        const y0 = p.a.y + (p.b.y - p.a.y) * t0
        const x1 = p.a.x + (p.b.x - p.a.x) * p.t
        const y1 = p.a.y + (p.b.y - p.a.y) * p.t
        const grad = ctx.createLinearGradient(x0, y0, x1, y1)
        grad.addColorStop(0, 'rgba(0,255,156,0)')
        grad.addColorStop(1, 'rgba(0,255,156,0.55)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
        ctx.fillStyle = '#00ff9c'
        ctx.beginPath()
        ctx.arc(x1, y1, 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
      if (frame % 110 === 0) firePacket()

      // ── UFOs cruising the mesh, occasionally hacking a node ──
      for (const u of ufos) {
        u.x += u.dir * u.sp
        u.ph += 0.02
        const uy = u.y + Math.sin(u.ph) * 10
        if (u.x < -90 || u.x > w + 90) {
          Object.assign(u, spawnUfo(true))
          u.x = u.dir === 1 ? -70 : w + 70
          continue
        }

        // random raid: lock onto a nearby node and drain it
        if (!u.zap && Math.random() < 0.0035) {
          let tgt = null
          let td = Infinity
          for (const n of nodes) {
            const d = Math.hypot(n.x - u.x, n.y - uy)
            if (d < td) {
              td = d
              tgt = n
            }
          }
          if (tgt && td < 300) u.zap = { node: tgt, t: 55 }
        }

        // abduction / attack beam
        if (u.zap) {
          u.zap.t--
          const node = u.zap.node
          const tx = node ? node.x : u.zap.x
          const ty = node ? node.y : u.zap.y
          const flick = 0.35 + Math.random() * 0.4

          // tractor cone (wide translucent triangle from saucer down to target)
          if (node) {
            const cone = ctx.createLinearGradient(u.x, uy + 4, tx, ty)
            cone.addColorStop(0, 'rgba(0,255,156,0.18)')
            cone.addColorStop(1, 'rgba(0,255,156,0)')
            ctx.fillStyle = cone
            ctx.beginPath()
            ctx.moveTo(u.x - 3, uy + 4)
            ctx.lineTo(u.x + 3, uy + 4)
            ctx.lineTo(tx + 11, ty)
            ctx.lineTo(tx - 11, ty)
            ctx.closePath()
            ctx.fill()
            // the node gets pulled UP toward the saucer, then vanishes + respawns
            node.hot = true
            node.x += (u.x - node.x) * 0.06
            node.y += (uy + 6 - node.y) * 0.06
            node.vx *= 0.6
            node.vy *= 0.6
            if (u.zap.t <= 0) {
              node.x = Math.random() * w
              node.y = Math.random() * h
              node.vx = (Math.random() - 0.5) * 0.24
              node.vy = (Math.random() - 0.5) * 0.24
              node.hot = Math.random() < 0.16
            }
          }

          // electric beam core
          const grad = ctx.createLinearGradient(u.x, uy + 4, tx, ty)
          grad.addColorStop(0, `rgba(0,255,156,${flick})`)
          grad.addColorStop(1, `rgba(255,77,94,${flick})`)
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(u.x, uy + 4)
          ctx.lineTo((u.x + tx) / 2 + (Math.random() - 0.5) * 7, (uy + ty) / 2 + (Math.random() - 0.5) * 7)
          ctx.lineTo(tx, ty)
          ctx.stroke()
          ctx.fillStyle = `rgba(255,77,94,${flick})`
          ctx.beginPath()
          ctx.arc(tx, ty, 2.6 + Math.random() * 1.6, 0, Math.PI * 2)
          ctx.fill()
          if (u.zap.t <= 0) u.zap = null
        }

        // ── saucer (drawn back-to-front for depth) ──
        const bw = u.w

        // ion trail streaking behind
        const tx0 = u.x - u.dir * bw * 2.1
        const trail = ctx.createLinearGradient(tx0, uy, u.x - u.dir * bw * 0.4, uy)
        trail.addColorStop(0, 'rgba(56,194,255,0)')
        trail.addColorStop(1, 'rgba(56,194,255,0.45)')
        ctx.strokeStyle = trail
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(tx0, uy)
        ctx.lineTo(u.x - u.dir * bw * 0.4, uy)
        ctx.stroke()

        // soft anti-grav glow beneath the hull
        const glow = ctx.createRadialGradient(u.x, uy + 5, 0, u.x, uy + 5, bw * 0.8)
        glow.addColorStop(0, 'rgba(0,255,156,0.16)')
        glow.addColorStop(1, 'rgba(0,255,156,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.ellipse(u.x, uy + 6, bw * 0.8, bw * 0.34, 0, 0, Math.PI * 2)
        ctx.fill()

        // lower hull (dark undercarriage)
        ctx.fillStyle = 'rgba(30,42,58,0.85)'
        ctx.beginPath()
        ctx.ellipse(u.x, uy + 2.5, bw * 0.34, bw * 0.1, 0, 0, Math.PI * 2)
        ctx.fill()

        // main disc — metallic sheen
        const hull = ctx.createLinearGradient(u.x, uy - bw * 0.18, u.x, uy + bw * 0.18)
        hull.addColorStop(0, 'rgba(205,220,238,0.9)')
        hull.addColorStop(0.5, 'rgba(120,138,160,0.85)')
        hull.addColorStop(1, 'rgba(55,70,92,0.9)')
        ctx.fillStyle = hull
        ctx.beginPath()
        ctx.ellipse(u.x, uy, bw * 0.52, bw * 0.16, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(56,194,255,0.55)'
        ctx.lineWidth = 1
        ctx.stroke()

        // glass dome + specular glint + pilot glow
        const dome = ctx.createLinearGradient(u.x, uy - bw * 0.3, u.x, uy)
        dome.addColorStop(0, 'rgba(140,225,255,0.55)')
        dome.addColorStop(1, 'rgba(56,194,255,0.12)')
        ctx.fillStyle = dome
        ctx.beginPath()
        ctx.ellipse(u.x, uy - 2.5, bw * 0.26, bw * 0.22, 0, Math.PI, 0)
        ctx.fill()
        ctx.strokeStyle = 'rgba(180,235,255,0.5)'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.ellipse(u.x - bw * 0.08, uy - bw * 0.14, bw * 0.09, bw * 0.05, -0.5, 0, Math.PI * 2)
        ctx.stroke()
        // the operator inside
        ctx.fillStyle = ((frame >> 3) & 1) ? 'rgba(0,255,156,0.85)' : 'rgba(0,255,156,0.45)'
        ctx.beginPath()
        ctx.arc(u.x, uy - 5, 1.5, 0, Math.PI * 2)
        ctx.fill()

        // chasing rim lights (rotating light band)
        for (let i = 0; i < 5; i++) {
          const on = ((frame >> 3) + i) % 5 === 0
          const lx = u.x + (i - 2) * bw * 0.2
          ctx.fillStyle = on ? '#00ff9c' : 'rgba(0,255,156,0.22)'
          ctx.beginPath()
          ctx.arc(lx, uy + 2.2, on ? 1.5 : 1.1, 0, Math.PI * 2)
          ctx.fill()
        }

        // antenna beacon
        ctx.strokeStyle = 'rgba(180,235,255,0.5)'
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(u.x, uy - bw * 0.22)
        ctx.lineTo(u.x, uy - bw * 0.32)
        ctx.stroke()
        ctx.fillStyle = ((frame >> 4) & 1) ? '#ff4d5e' : 'rgba(255,77,94,0.35)'
        ctx.beginPath()
        ctx.arc(u.x, uy - bw * 0.34, 1.2, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── sonar ripples ──
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += 4.4
        const alpha = Math.max(0, 1 - rp.r / rp.max)
        if (alpha <= 0) {
          ripples.splice(i, 1)
          continue
        }
        ctx.strokeStyle = `rgba(0,255,156,${alpha * 0.5})`
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.stroke()
        // faint inner echo
        ctx.strokeStyle = `rgba(56,194,255,${alpha * 0.25})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r * 0.62, 0, Math.PI * 2)
        ctx.stroke()
      }

      raf = requestAnimationFrame(step)
    }

    const start = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(step)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    resize()
    start()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibility)
      ctx.clearRect(0, 0, w, h)
    }
  }, [reduced])

  if (reduced) return null
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
