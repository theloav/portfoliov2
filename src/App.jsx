import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import SmoothScroll from './components/SmoothScroll'
import CustomCursor from './components/CustomCursor'
import Hud from './components/Hud'
import Boot from './components/Boot'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Marquee from './components/Marquee'

// Each section isolated: a throw in one can never blank the others.
function Guarded({ name, children }) {
  return <ErrorBoundary name={name}>{children}</ErrorBoundary>
}

function Site() {
  return (
    <div className="relative">
      <Guarded name="nav"><Nav /></Guarded>
      <main>
        <Guarded name="hero"><Hero /></Guarded>
        <Guarded name="marquee-1">
          <Marquee text="Breach the surface" accent="Defend the core" />
        </Guarded>
        <Guarded name="about"><About /></Guarded>
        <Guarded name="skills"><Skills /></Guarded>
        <Guarded name="marquee-2">
          <Marquee text="Offense informs defense" accent="Break to build" baseVelocity={-1.4} />
        </Guarded>
        <Guarded name="experience"><Experience /></Guarded>
        <Guarded name="projects"><Projects /></Guarded>
        <Guarded name="achievements"><Achievements /></Guarded>
        <Guarded name="marquee-3">
          <Marquee text="Establish uplink" accent="Transmission open" />
        </Guarded>
        <Guarded name="contact"><Contact /></Guarded>
      </main>
      <Guarded name="footer"><Footer /></Guarded>
    </div>
  )
}

export default function App() {
  const [booted, setBooted] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem('booted_v2') === '1'
  )

  return (
    <>
      {/* Every decorative/heavy piece is isolated — a crash can never blank the page. */}
      <ErrorBoundary name="smooth-scroll">
        <SmoothScroll />
      </ErrorBoundary>
      <ErrorBoundary name="cursor">
        <CustomCursor />
      </ErrorBoundary>
      <ErrorBoundary name="hud">
        <Hud />
      </ErrorBoundary>

      <ErrorBoundary name="boot">
        <AnimatePresence>
          {!booted && (
            <Boot
              key="boot"
              onDone={() => {
                try {
                  sessionStorage.setItem('booted_v2', '1')
                } catch {
                  /* ignore */
                }
                setBooted(true)
              }}
            />
          )}
        </AnimatePresence>
      </ErrorBoundary>

      <ErrorBoundary name="site">
        <Site />
      </ErrorBoundary>
    </>
  )
}
