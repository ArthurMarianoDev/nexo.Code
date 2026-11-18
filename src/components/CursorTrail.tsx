import { useEffect, useRef } from "react"

/**
 * A single lightweight full-screen 2D overlay. The trail follows a damped path,
 * reacts to links and pointer-down, and never obstructs underlying controls.
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduceMotion) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    type Point = { x: number; y: number; age: number }
    let points: Point[] = []
    let x = -100, y = -100, tx = -100, ty = -100
    let active = false, isLink = false, burst = 0
    let raf = 0, previous = 0
    let stopped = false
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(innerWidth * dpr)
      canvas.height = Math.round(innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      tx = event.clientX
      ty = event.clientY
      if (!active) { x = tx; y = ty }
      active = true
      isLink = !!(event.target instanceof Element && event.target.closest("a, button, [role='button']"))
    }
    const leave = () => { active = false }
    const down = () => { burst = 1 }
    const paint = (now: number) => {
      if (stopped) return
      raf = requestAnimationFrame(paint)
      if (document.hidden || now - previous < 16) return
      const delta = previous ? Math.min((now - previous) / 16, 2) : 1
      previous = now
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      if (active) {
        x += (tx - x) * .28
        y += (ty - y) * .28
        if (points.length === 0 || Math.hypot(x - points[points.length - 1].x, y - points[points.length - 1].y) > 3) {
          points.push({ x, y, age: 0 })
        }
      }
      points.forEach(p => p.age += delta)
      points = points.filter(p => p.age < 28).slice(-24)
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i]
        const opacity = Math.max(0, 1 - b.age / 28)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = i % 3 === 0 ? `rgba(134,217,255,${opacity * .68})` : `rgba(185,255,79,${opacity * .8})`
        ctx.lineWidth = Math.max(.3, (i / points.length) * (isLink ? 4 : 2.3) * opacity)
        ctx.lineCap = "round"
        ctx.stroke()
      }
      if (active) {
        ctx.beginPath()
        ctx.arc(tx, ty, isLink ? 15 : 5.5, 0, Math.PI * 2)
        ctx.strokeStyle = isLink ? "rgba(185,255,79,.85)" : "rgba(134,217,255,.65)"
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(tx, ty, isLink ? 2.5 : 1.75, 0, Math.PI * 2)
        ctx.fillStyle = "#d8ff9e"
        ctx.fill()
      }
      if (burst > 0 && active) {
        ctx.beginPath()
        ctx.arc(tx, ty, (1 - burst) * 47 + 6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(185,255,79,${burst * .65})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        burst = Math.max(0, burst - .055 * delta)
      }
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })
    document.addEventListener("pointermove", pointerMove, { passive: true })
    document.addEventListener("pointerdown", down, { passive: true })
    document.addEventListener("pointerleave", leave)
    raf = requestAnimationFrame(paint)
    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("pointermove", pointerMove)
      document.removeEventListener("pointerdown", down)
      document.removeEventListener("pointerleave", leave)
    }
  }, [])

  return <canvas className="nexo-cursor-trail" ref={canvasRef} aria-hidden="true" />
}
