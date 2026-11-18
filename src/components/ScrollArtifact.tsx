import { useEffect, useRef } from "react"

/** Floating geometric stage synchronized with document scroll.
 *  CSS 3D for low cost: geometric rings, filaments, and a luminous core.
 */
export default function ScrollArtifact() {
  const stageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return
    let raf = 0
    let last = 0
    const update = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (!stage.isConnected) return
        const rect = stage.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const p = Math.max(-1.6, Math.min(1.6, (innerHeight / 2 - center) / innerHeight))
        last += (p - last) * .14
        stage.style.setProperty("--artifact-turn", `${(last * 125).toFixed(2)}deg`)
        stage.style.setProperty("--artifact-shift", `${(last * -52).toFixed(1)}px`)
        stage.style.setProperty("--artifact-depth", `${(Math.abs(last) * 72).toFixed(1)}px`)
      })
    }
    const io = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) update()
    }, { rootMargin: "100% 0px" })
    io.observe(stage)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })
    update()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])
  return (
    <div className="scroll-artifact" ref={stageRef} role="img"
      aria-label="Objeto geométrico tridimensional que gira e muda de profundidade conforme a rolagem">
      <div className="scroll-artifact__world">
        <div className="scroll-artifact__ring scroll-artifact__ring--a" />
        <div className="scroll-artifact__ring scroll-artifact__ring--b" />
        <div className="scroll-artifact__ring scroll-artifact__ring--c" />
        <div className="scroll-artifact__core" />
        <span className="scroll-artifact__filament scroll-artifact__filament--a" />
        <span className="scroll-artifact__filament scroll-artifact__filament--b" />
      </div>
      <div className="scroll-artifact__label">N/C — KINETIC OBJECT 002 <span>SCROLL-DRIVEN</span></div>
    </div>
  )
}
