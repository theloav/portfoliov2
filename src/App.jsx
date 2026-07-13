export default function App() {
  return (
    <main className="hud-grid relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* animated scanline sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan/10 to-transparent animate-scan" />
      </div>

      <div className="relative z-10 text-center">
        <p className="font-mono text-xs tracking-[0.35em] text-term/80">
          [ SYSTEM ONLINE ]
        </p>

        <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-slate-50 sm:text-7xl">
          SHRIVARSHAN
        </h1>

        <p className="mt-4 font-mono text-sm text-cyan text-glow-cyan sm:text-base">
          Security Engineer · Offensive Security Operator
        </p>

        <div className="mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-term/60 to-transparent" />

        <p className="mt-8 font-mono text-xs tracking-[0.3em] text-muted animate-flicker">
          BOOTING OPERATOR CONSOLE — v2 BUILD IN PROGRESS
        </p>
      </div>

      {/* corner HUD ticks */}
      <span className="pointer-events-none absolute left-6 top-6 h-6 w-6 border-l border-t border-term/40" />
      <span className="pointer-events-none absolute right-6 top-6 h-6 w-6 border-r border-t border-term/40" />
      <span className="pointer-events-none absolute bottom-6 left-6 h-6 w-6 border-b border-l border-term/40" />
      <span className="pointer-events-none absolute bottom-6 right-6 h-6 w-6 border-b border-r border-term/40" />
    </main>
  )
}
