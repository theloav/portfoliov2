import { useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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

function GlobeMesh() {
  const ref = useRef()

  const globe = useMemo(() => {
    const arcs = PAIRS.map(([a, b]) => ({
      startLat: NODES[a].lat,
      startLng: NODES[a].lng,
      endLat: NODES[b].lat,
      endLng: NODES[b].lng,
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
      // attack arcs — animated dash "travels" along the line
      .arcsData(arcs)
      .arcColor(() => ['rgba(0,255,156,0)', '#00ff9c', 'rgba(56,194,255,0.1)'])
      .arcStroke(0.45)
      .arcDashLength(0.45)
      .arcDashGap(1.6)
      .arcDashInitialGap(() => Math.random() * 5)
      .arcDashAnimateTime(2200)
      .arcAltitudeAutoScale(0.45)

    // Dark ocean material.
    const mat = g.globeMaterial()
    mat.color = new THREE.Color('#0c1a2b')
    mat.emissive = new THREE.Color('#060d16')
    mat.emissiveIntensity = 0.9
    mat.shininess = 0.3

    // Face Asia/India toward the camera.
    g.rotation.y = -Math.PI * 0.52
    g.rotation.x = 0.32
    return g
  }, [])

  return <primitive ref={ref} object={globe} />
}

export default function ThreatGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 340], fov: 44, near: 0.1, far: 2000 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={2.2} color="#c9ddff" />
      <directionalLight position={[1, 1, 1]} intensity={1.1} color="#ffffff" />
      <GlobeMesh />
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
