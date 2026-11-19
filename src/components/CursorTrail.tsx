import { useEffect, useRef } from "react"

/**
 * Nexo Silk Cursor v4
 * Event-sampled, not animation-frame-sampled: retains the true pointer trajectory.
 * Coalesced pointer samples + 2.8px spatial interpolation + quadratic Bézier midpoints
 * prevent the polygonal edges that appeared while drawing large circles.
 * Time-based fade, bounded DPR and a single passive, pointer-transparent canvas.
 */
type TrailPoint = { x: number; y: number; born: number }
type Spark = { x: number; y: number; vx: number; vy: number; born: number }

const MAX_POINTS = 165
const TRAIL_MS = 475
const MAX_SPARKS = 48

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !matchMedia("(pointer:fine)").matches ||
      matchMedia("(prefers-reduced-motion:reduce)").matches) return
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return

    const trail: TrailPoint[] = []
    let sparks: Spark[] = []
    let mx = -100, my = -100, visible = false, overControl = false
    let magnetX = 0, magnetY = 0, previousPointTime = 0
    let width = 0, height = 0, raf = 0, running = true

    const resize = () => {
      width = innerWidth
      height = innerHeight
      // Enough resolution for retina-quality lines, without huge 4K textures.
      const dpr = Math.min(devicePixelRatio || 1, 2.25,
        Math.sqrt(3800000 / Math.max(1, width * height)))
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }

    const append = (px: number, py: number, time: number) => {
      const last = trail[trail.length - 1]
      if (!last) {
        trail.push({ x: px, y: py, born: time })
        previousPointTime = time
        return
      }
      const dx = px - last.x, dy = py - last.y
      const distance = Math.hypot(dx, dy)
      if (distance < .9) return
      // A new fast movement after a pause must not draw a long straight chord.
      if (time - previousPointTime > 115 || distance > 310) {
        trail.length = 0
        trail.push({ x: px, y: py, born: time })
      } else {
        const count = Math.min(125, Math.ceil(distance / 2.8))
        for (let j = 1; j <= count; j++) {
          const t = j / count
          trail.push({
            x: last.x + dx * t,
            y: last.y + dy * t,
            born: time,
          })
        }
      }
      previousPointTime = time
      if (trail.length > MAX_POINTS) trail.splice(0, trail.length - MAX_POINTS)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      // Use high-frequency hardware samples when supported. No smoothed positions
      // from animation frames, so curves keep their actual shape.
      const coalesced = event.getCoalescedEvents?.()
      const samples = coalesced && coalesced.length ? coalesced : [event]
      const time = performance.now()
      if (!visible) trail.length = 0
      for (const sample of samples) append(sample.clientX, sample.clientY, time)
      mx = event.clientX
      my = event.clientY
      visible = true
      const interactive = event.target instanceof Element
        ? event.target.closest<HTMLElement>("a,button,[role='button'],input,textarea,select")
        : null
      overControl = !!interactive
      if (interactive) {
        const bounds = interactive.getBoundingClientRect()
        magnetX = bounds.left + bounds.width * .5
        magnetY = bounds.top + bounds.height * .5
      }
      requestDraw()
    }

    const onLeave = () => { visible = false; overControl = false }
    const onDown = (event: PointerEvent) => {
      if (!visible || event.pointerType === "touch") return
      const born = performance.now()
      if (sparks.length > MAX_SPARKS - 12) sparks = sparks.slice(-30)
      for (let j = 0; j < 12; j++) {
        const angle = j * Math.PI / 6
        const speed = 1.2 + j % 3 * .45
        sparks.push({
          x: mx, y: my, vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed, born,
        })
      }
      requestDraw()
    }

    const makeCurve = (points: TrailPoint[]) => {
      const path = new Path2D()
      if (!points.length) return path
      path.moveTo(points[0].x, points[0].y)
      if (points.length === 1) return path
      for (let i = 1; i < points.length - 1; i++) {
        const p = points[i], n = points[i + 1]
        path.quadraticCurveTo(p.x, p.y, (p.x + n.x) * .5, (p.y + n.y) * .5)
      }
      const end = points[points.length - 1]
      path.lineTo(end.x, end.y)
      return path
    }

    const draw = (now: number) => {
      raf = 0
      if (!running || document.hidden) return
      ctx.clearRect(0, 0, width, height)
      while (trail.length && now - trail[0].born > TRAIL_MS) trail.shift()
      sparks = sparks.filter(p => now - p.born < 420)
      if (trail.length > 1) {
        // Short tapered tail from precisely sampled points. The fade is
        // time-based; the moving head is never snapped to an old frame.
        const points = trail
        const oldest = points[0], newest = points[points.length - 1]
        const path = makeCurve(points)
        const color = ctx.createLinearGradient(oldest.x, oldest.y,
          newest.x + .001, newest.y + .001)
        color.addColorStop(0, "rgba(134,217,255,0)")
        color.addColorStop(.25, "rgba(134,217,255,.24)")
        color.addColorStop(.72, "rgba(185,255,79,.75)")
        color.addColorStop(1, "rgba(231,255,209,.99)")
        const fade = Math.max(0, Math.min(1, (TRAIL_MS - (now - newest.born)) / 220))
        ctx.globalAlpha = fade
        ctx.strokeStyle = color
        ctx.lineWidth = overControl ? 7.5 : 5.2
        ctx.shadowBlur = 12
        ctx.shadowColor = "#b9ff4f"
        ctx.globalAlpha = fade * .17
        ctx.stroke(path)
        ctx.shadowBlur = 0
        ctx.globalAlpha = fade
        ctx.lineWidth = overControl ? 2.8 : 2.1
        ctx.stroke(path)
        ctx.strokeStyle = "rgba(236,255,239,.56)"
        ctx.lineWidth = .65
        ctx.stroke(path)
        ctx.globalAlpha = 1
      }

      for (const p of sparks) {
        const age = Math.min(1, (now - p.born) / 420)
        p.x += p.vx * (1 - age) * .9
        p.y += p.vy * (1 - age) * .9
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(.45, (1 - age) * 1.65), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(185,255,79,${(1-age)*.7})`
        ctx.fill()
      }

      if (visible) {
        if (overControl) {
          const dx = magnetX - mx, dy = magnetY - my
          if (Math.hypot(dx, dy) < 160) {
            ctx.beginPath()
            ctx.moveTo(mx, my)
            ctx.quadraticCurveTo(mx + dx * .5, my + dy * .25, magnetX, magnetY)
            ctx.strokeStyle = "rgba(185,255,79,.19)"
            ctx.lineWidth = .85
            ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.arc(mx, my, overControl ? 12 : 4.8, 0, Math.PI * 2)
        ctx.lineWidth = 1
        ctx.strokeStyle = overControl ? "rgba(185,255,79,.9)" : "rgba(134,217,255,.7)"
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(mx, my, overControl ? 2.4 : 1.7, 0, Math.PI * 2)
        ctx.fillStyle = "#e4ffd1"
        ctx.fill()
      }

      if (visible || trail.length || sparks.length) raf = requestAnimationFrame(draw)
    }

    const requestDraw = () => {
      if (!raf && running && !document.hidden) raf = requestAnimationFrame(draw)
    }
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
        visible = false
        trail.length = 0
        sparks = []
      }
    }
    resize()
    addEventListener("resize", resize, { passive: true })
    document.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerdown", onDown, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      removeEventListener("resize", resize)
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="nexo-cursor-trail" aria-hidden="true"/>
}
