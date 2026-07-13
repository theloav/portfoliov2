import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerformanceMonitor, Stars } from '@react-three/drei'
import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import countries from '../assets/countries.json'

// City nodes { lat, lng, color }. Chennai (home) is the orange marker.
const NODES = [
  { lat: 13.08, lng: 80.27, color: '#ff6b3d' }, // Chennai (home)
  { lat: 51.5, lng: -0.12, color: '#38c2ff' }, // London
  { lat: 40.71, lng: -74.0, color: '#38c2ff' }, // New York
  { lat: 35.68, lng: 139.69, color: '#38c2ff' }, // Tokyo
  { lat: 1.35, lng: 103.82, color: '#38c2ff' }, // Singapore
  { lat: -33.86, lng: 151.2, color: '#38c2ff' }, // Sydney
  { lat: 52.52, lng: 13.4, color: '#38c2ff' }, // Berlin
  { lat: 37.77, lng: -122.4, color: '#38c2ff' }, // San Francisco
  { lat: 55.75, lng: 37.61, color: '#38c2ff' }, // Moscow
  { lat: -23.55, lng: -46.63, color: '#38c2ff' }, // São Paulo
]

// Attack arcs (indices into NODES). Chennai is the common origin.
const PAIRS = [
  [0, 1], [0, 4], [0, 3], [0, 8], [2, 1],
  [7, 2], [6, 1], [5, 4], [9, 7], [3, 4],
]

function GlobeMesh({ apiRef, onStrike }) {
  const userRef = useRef([]) // live user-triggered strikes
  const timeouts = useRef([])

  const { globe, baseArcs, baseRings } = useMemo(() => {
    const arcs = PAIRS.map(([a, b]) => ({
      startLat: NODES[a].lat,
      startLng: NODES[a].lng,
      endLat: NODES[b].lat,
      endLng: NODES[b].lng,
    }))
    const rings = NODES.map((n) => ({
      ...n,
      rgb: n.color === '#ff6b3d' ? '255,107,61' : '0,255,156',
    }))

    const g = new ThreeGlobe({ animateIn: false })
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor('#2f9bff')
      .atmosphereAltitude(0.16)
      .showGraticules(true)
      // countries
      .polygonsData(countries.features)
      .polygonAltitude(0.008)
      .polygonCapColor(() => 'rgba(74, 108, 143, 0.5)')
      .polygonSideColor(() => 'rgba(20, 34, 52, 0.25)')
      .polygonStrokeColor(() => 'rgba(120, 158, 196, 0.45)')
      // city markers
      .pointsData(NODES)
      .pointColor('color')
      .pointAltitude(0.012)
      .pointRadius(0.32)
      .pointResolution(18)
      // attack arcs — animated dash "travels" along the line.
      // User strikes render red/orange, faster, and start instantly.
      .arcsData(arcs)
      .arcColor((d) =>
        d.user
          ? ['rgba(255,77,94,0)', '#ff4d5e', 'rgba(255,107,61,0.25)']
          : ['rgba(0,255,156,0)', '#00ff9c', 'rgba(56,194,255,0.1)']
      )
      .arcStroke((d) => (d.user ? 0.8 : 0.5))
      .arcDashLength(0.45)
      .arcDashGap((d) => (d.user ? 0.8 : 1.6))
      .arcDashInitialGap((d) => (d.user ? 0 : Math.random() * 5))
      .arcDashAnimateTime((d) => (d.user ? 1300 : 2200))
      .arcAltitudeAutoScale(0.45)
      // radar impact rings pulsing out of every city (orange at home base)
      .ringsData(rings)
      .ringColor((d) => (t) => `rgba(${d.rgb},${Math.max(0, 0.55 * (1 - t))})`)
      .ringMaxRadius((d) => (d.user ? 5 : 3.6))
      .ringPropagationSpeed((d) => (d.user ? 2.2 : 1.1))
      .ringRepeatPeriod(() => 1100 + Math.random() * 900)
      .ringAltitude(0.011)

    // Dark ocean material.
    const mat = g.globeMaterial()
    mat.color = new THREE.Color('#0c1a2b')
    mat.emissive = new THREE.Color('#060d16')
    mat.emissiveIntensity = 0.9
    mat.shininess = 0.3

    // Face Asia/India toward the camera.
    g.rotation.y = -Math.PI * 0.52
    g.rotation.x = 0.32
    return { globe: g, baseArcs: arcs, baseRings: rings }
  }, [])

  useEffect(() => () => timeouts.current.forEach(clearTimeout), [])

  const refresh = () => {
    const u = userRef.current
    globe.arcsData([...baseArcs, ...u.flatMap((e) => e.arcs)])
    globe.ringsData([...baseRings, ...u.map((e) => e.ring)])
    globe.pointsData([...NODES, ...u.map((e) => e.pt)])
  }

  // Land a strike at lat/lng: red danger ring + impact marker, plus
  // `nArcs` red arcs racing in from random cities. Fades after 4.5s.
  const strikeAt = (lat, lng, nArcs = 2) => {
    const srcs = [...NODES].sort(() => Math.random() - 0.5).slice(0, nArcs)
    const entry = {
      arcs: srcs.map((s) => ({
        startLat: s.lat,
        startLng: s.lng,
        endLat: lat,
        endLng: lng,
        user: true,
      })),
      ring: { lat, lng, rgb: '255,77,94', user: true },
      pt: { lat, lng, color: '#ff4d5e' },
    }
    userRef.current.push(entry)
    refresh()
    timeouts.current.push(
      setTimeout(() => {
        userRef.current = userRef.current.filter((x) => x !== entry)
        refresh()
      }, 4500)
    )
  }

  // Expose the globe + strike API so the UFO can bombard the planet too.
  useEffect(() => {
    if (apiRef) apiRef.current = { globe, strike: strikeAt }
    return () => {
      if (apiRef) apiRef.current = null
    }
  })

  // Click (not drag) anywhere on the earth → strike that exact lat/lng.
  const onClick = (e) => {
    if (e.delta > 6) return // that was an orbit drag, not a click
    e.stopPropagation()
    const local = globe.worldToLocal(e.point.clone())
    const r = local.length()
    if (!r) return
    const lat = 90 - (Math.acos(local.y / r) * 180) / Math.PI
    const lng = ((90 - (Math.atan2(local.z, local.x) * 180) / Math.PI + 540) % 360) - 180
    strikeAt(lat, lng, 2)
    onStrike?.()
  }

  return <primitive object={globe} onClick={onClick} />
}

/**
 * Alien raider: a saucer orbits the planet and every few seconds fires a
 * flickering red beam at a random spot — which lands as a real strike
 * (danger ring + impact marker) on the globe below.
 */
function Ufo({ apiRef }) {
  const grp = useRef()
  const beamRef = useRef()
  const s = useRef({ nextAt: 2.2, until: 0, target: new THREE.Vector3() })

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const g = grp.current
    if (!g) return

    // tilted, wandering orbit outside the atmosphere
    const R = 152
    g.position.set(
      Math.cos(t * 0.3) * R,
      58 * Math.sin(t * 0.17) + 12,
      Math.sin(t * 0.3) * R
    )
    g.rotation.y = t * 1.6
    g.rotation.z = Math.sin(t * 0.8) * 0.1

    const st = s.current
    const api = apiRef.current
    if (api && t > st.nextAt) {
      const lat = -55 + Math.random() * 115
      const lng = -180 + Math.random() * 360
      const c = api.globe.getCoords(lat, lng, 0.02)
      st.target.copy(api.globe.localToWorld(new THREE.Vector3(c.x, c.y, c.z)))
      api.strike(lat, lng, 0) // beam is the delivery — no arcs needed
      st.until = t + 0.9
      st.nextAt = t + 3 + Math.random() * 3.5
    }

    const beam = beamRef.current
    if (beam) {
      const active = t < st.until
      beam.visible = active
      if (active) {
        beam.geometry.setFromPoints([g.position, st.target])
        beam.material.opacity = 0.35 + Math.random() * 0.55 // electric flicker
      }
    }
  })

  return (
    <>
      <group ref={grp}>
        {/* hull */}
        <mesh scale={[1, 0.28, 1]}>
          <sphereGeometry args={[7, 24, 16]} />
          <meshStandardMaterial color="#93a5bb" metalness={0.85} roughness={0.35} />
        </mesh>
        {/* glass dome */}
        <mesh position={[0, 1.5, 0]} scale={[1, 0.78, 1]}>
          <sphereGeometry args={[3.1, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#38c2ff"
            emissive="#1e7fb8"
            emissiveIntensity={0.9}
            transparent
            opacity={0.75}
            roughness={0.15}
            metalness={0.2}
          />
        </mesh>
        {/* glowing anti-grav ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.6, 0.35, 10, 40]} />
          <meshBasicMaterial color="#00ff9c" />
        </mesh>
        <pointLight color="#00ff9c" intensity={5} distance={45} />
      </group>

      {/* attack beam */}
      <line ref={beamRef} visible={false}>
        <bufferGeometry />
        <lineBasicMaterial color="#ff4d5e" transparent opacity={0.8} />
      </line>
    </>
  )
}

/**
 * @param {boolean} active  When false (hero scrolled off-screen) the render loop
 *   is frozen so the globe stops consuming GPU — the main lag fix on slow devices.
 */
export default function ThreatGlobe({ active = true, onStrike }) {
  // Start modest; PerformanceMonitor scales down further if frames drop.
  const [dpr, setDpr] = useState(1.4)
  const apiRef = useRef(null) // GlobeMesh strike API, shared with the UFO

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 340], fov: 44, near: 0.1, far: 2000 }}
      dpr={dpr}
      performance={{ min: 0.5 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.4)}
        onFallback={() => setDpr(1)}
      />
      <ambientLight intensity={2.2} color="#c9ddff" />
      <directionalLight position={[1, 1, 1]} intensity={1.1} color="#ffffff" />
      {/* faint starfield drifting behind the earth */}
      <Stars radius={300} depth={60} count={1400} factor={3.2} saturation={0} fade speed={0.5} />
      <GlobeMesh apiRef={apiRef} onStrike={onStrike} />
      <Ufo apiRef={apiRef} />
      {/* Drag to spin (left or right button); idle auto-rotate; no zoom/pan so the page still scrolls. */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.4}
        rotateSpeed={0.5}
        enableDamping
        dampingFactor={0.08}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
      />
    </Canvas>
  )
}
