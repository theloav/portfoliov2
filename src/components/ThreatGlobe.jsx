import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const R = 1.6

// Convert lat/long (degrees) to a point on a sphere of radius `r`.
function toVec3(lat, lon, r = R) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

// A handful of real-ish nodes so arcs look like a live attack map.
const NODES = [
  [13.08, 80.27], // Chennai
  [51.5, -0.12], // London
  [40.71, -74.0], // New York
  [35.68, 139.69], // Tokyo
  [1.35, 103.82], // Singapore
  [-33.86, 151.2], // Sydney
  [52.52, 13.4], // Berlin
  [37.77, -122.4], // San Francisco
  [55.75, 37.61], // Moscow
  [-23.55, -46.63], // São Paulo
]

// Pairs (indices into NODES) that get animated attack arcs.
const ARCS = [
  [0, 1], [0, 4], [2, 1], [3, 4], [5, 4],
  [7, 2], [6, 1], [8, 6], [9, 7], [0, 3],
]

function Arc({ from, to, color, offset }) {
  const pulseRef = useRef()
  const { points, curve } = useMemo(() => {
    const a = toVec3(from[0], from[1])
    const b = toVec3(to[0], to[1])
    const mid = a.clone().add(b).multiplyScalar(0.5)
    // Cap the arc height so long arcs never shoot outside the camera frustum.
    const lift = Math.min(1.2, 1 + a.distanceTo(b) * 0.12)
    mid.normalize().multiplyScalar(R * lift)
    const c = new THREE.QuadraticBezierCurve3(a, mid, b)
    return { points: c.getPoints(48), curve: c }
  }, [from, to])

  useFrame((state) => {
    if (!pulseRef.current) return
    const t = (state.clock.elapsedTime * 0.18 + offset) % 1
    const p = curve.getPoint(t)
    pulseRef.current.position.set(p.x, p.y, p.z)
    const s = 0.035 + Math.sin(t * Math.PI) * 0.03
    pulseRef.current.scale.setScalar(s)
  })

  return (
    <group>
      <Line points={points} color={color} lineWidth={1} transparent opacity={0.35} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Globe() {
  const group = useRef()
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.06
  })

  const nodePoints = useMemo(() => NODES.map((n) => toVec3(n[0], n[1])), [])

  return (
    <group ref={group} rotation={[0.35, 0, 0.1]}>
      {/* solid dark occluder so back-facing arcs/nodes are hidden → real depth */}
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color="#060a10" />
      </mesh>

      {/* wireframe shell */}
      <mesh>
        <sphereGeometry args={[R, 34, 34]} />
        <meshBasicMaterial color="#124b46" wireframe transparent opacity={0.5} />
      </mesh>

      {/* glowing city nodes */}
      {nodePoints.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshBasicMaterial color="#00ff9c" toneMapped={false} />
        </mesh>
      ))}

      {/* attack arcs */}
      {ARCS.map((pair, i) => (
        <Arc
          key={i}
          from={NODES[pair[0]]}
          to={NODES[pair[1]]}
          color={i % 3 === 0 ? '#38c2ff' : '#00ff9c'}
          offset={i / ARCS.length}
        />
      ))}
    </group>
  )
}

export default function ThreatGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <Globe />
      </Suspense>
    </Canvas>
  )
}
