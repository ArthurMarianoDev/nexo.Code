import { useEffect, useRef } from "react"

/**
 * Silk Cursor v3 — retina anti-aliased, eased spline trail, light bloom.
 * Pointer events only update position; a single canvas paints at up to 60fps.
 * Disabled on coarse pointers, reduced motion and hidden documents.
 */
type TrailPoint = { x: number; y: number; life: number }
type Spark = { x: number; y: number; vx: number; vy: number; life: number }

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const fine = matchMedia("(pointer: fine)").matches
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduceMotion) return
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true })
    if (!ctx) return

    const points: TrailPoint[] = []
    let sparks: Spark[] = []
    let mx = -100, my = -100, x = -100, y = -100
    let visible = false, overLink = false, magnetX = 0, magnetY = 0
    let raf = 0, last = 0, running = true
    let w = 0, h = 0
    const resize = () => {
      w = innerWidth
      h = innerHeight
      // HiDPI backing resolution eliminates jagged / pixelated streaks.
      const dpr = Math.min(devicePixelRatio || 1, 2.5, Math.sqrt(3800000 / Math.max(1, w * h)))
      const width = Math.round(w * dpr), height = Math.round(h * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      mx = event.clientX
      my = event.clientY
      if (!visible) { x = mx; y = my; points.length = 0 }
      visible = true
      const link = event.target instanceof Element
        ? event.target.closest<HTMLElement>("a,button,[role='button'],input,textarea")
        : null
      overLink = !!link
      if (link) {
        const bounds = link.getBoundingClientRect()
        magnetX = bounds.left + bounds.width * .5
        magnetY = bounds.top + bounds.height * .5
      }
    }
    const leave = () => { visible = false; overLink = false }
    const down = (event: PointerEvent) => {
      if (!visible || event.pointerType === "touch") return
      if (sparks.length > 55) sparks = sparks.slice(-40)
      for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI * 2 / 12
        const speed = 1.5 + (i % 4) * .65
        sparks.push({ x: mx, y: my, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 1 })
      }
    }

    const paint = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(paint)
      if (document.hidden) return
      // 60fps cap; time-based easing makes the trail fluid regardless of refresh rate.
      const elapsed = last ? Math.min(now - last, 44) : 16.67
      if (last && now - last < 14) return
      last = now
      const frameScale = elapsed / 16.67
      ctx.clearRect(0, 0, w, h)

      if (visible) {
        const ease = 1 - Math.pow(1 - .28, frameScale)
        x += (mx - x) * ease
        y += (my - y) * ease
        // Resample along the distance travelled to avoid sharp line segments on fast moves.
        const previous = points[points.length-1]
        const distance = previous ? Math.hypot(x-previous.x,y-previous.y) : 0
        const steps = previous ? Math.min(12,Math.max(1,Math.ceil(distance / 5))) : 1
        for (let i=1;i<=steps;i++) {
          const t=i/steps
          points.push({ x: previous ? previous.x+(x-previous.x)*t : x,
            y: previous ? previous.y+(y-previous.y)*t : y, life: 1 })
        }
      }

      for (const p of points) p.life -= .045*frameScale
      while (points.length && points[0].life <= 0) points.shift()
      if (points.length>95) points.splice(0,points.length-95)

      if (points.length > 2) {
        const path = new Path2D()
        path.moveTo(points[0].x,points[0].y)
        for(let i=1;i<points.length-1;i++) {
          const p=points[i],n=points[i+1]
          path.quadraticCurveTo(p.x,p.y,(p.x+n.x)*.5,(p.y+n.y)*.5)
        }
        const end=points[points.length-1]
        path.lineTo(end.x,end.y)

        const start=points[0]
        const gradient=ctx.createLinearGradient(start.x,start.y,end.x,end.y)
        gradient.addColorStop(0,"rgba(134,217,255,0)")
        gradient.addColorStop(.35,"rgba(134,217,255,.38)")
        gradient.addColorStop(.8,"rgba(185,255,79,.76)")
        gradient.addColorStop(1,"rgba(230,255,205,.96)")

        ctx.strokeStyle=gradient
        ctx.lineWidth=overLink?8:5.8
        ctx.globalAlpha=.17
        ctx.shadowColor="#b9ff4f"
        ctx.shadowBlur=17
        ctx.stroke(path)
        ctx.shadowBlur=0
        ctx.globalAlpha=1
        ctx.lineWidth=overLink?2.6:2.1
        ctx.stroke(path)
        ctx.strokeStyle="rgba(231,255,228,.54)"
        ctx.lineWidth=.72
        ctx.stroke(path)
      }

      sparks=sparks.filter(p=>p.life>0)
      for(const p of sparks){
        p.x+=p.vx*frameScale*1.65;p.y+=p.vy*frameScale*1.65
        p.vx*=Math.pow(.95,frameScale);p.vy*=Math.pow(.95,frameScale)
        p.life-=.046*frameScale
        ctx.fillStyle=`rgba(185,255,79,${Math.max(0,p.life)*.8})`
        ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.4,p.life*1.8),0,Math.PI*2);ctx.fill()
      }

      if(visible){
        if(overLink){
          const dx=magnetX-mx,dy=magnetY-my
          const distance=Math.hypot(dx,dy)
          if(distance<210){
            ctx.beginPath();ctx.moveTo(mx,my)
            ctx.quadraticCurveTo(mx+dx*.5,my+dy*.2,magnetX,magnetY)
            ctx.strokeStyle=`rgba(185,255,79,${.17*(1-distance/210)})`
            ctx.lineWidth=.85;ctx.stroke()
          }
        }
        const radius=overLink?13:5
        ctx.beginPath();ctx.arc(mx,my,radius,0,Math.PI*2)
        ctx.strokeStyle=overLink?"rgba(185,255,79,.9)":"rgba(134,217,255,.72)"
        ctx.lineWidth=1;ctx.stroke()
        ctx.beginPath();ctx.arc(mx,my,overLink?2.3:1.7,0,Math.PI*2)
        ctx.fillStyle="#e4ffd1";ctx.fill()
      }
      // Idle canvas still fades gracefully, without a busy extra particle engine.
    }

    resize()
    addEventListener("resize",resize,{passive:true})
    document.addEventListener("pointermove",move,{passive:true})
    document.addEventListener("pointerdown",down,{passive:true})
    document.addEventListener("pointerleave",leave)
    raf=requestAnimationFrame(paint)
    return()=>{
      running=false
      cancelAnimationFrame(raf)
      removeEventListener("resize",resize)
      document.removeEventListener("pointermove",move)
      document.removeEventListener("pointerdown",down)
      document.removeEventListener("pointerleave",leave)
    }
  },[])

  return <canvas ref={canvasRef} className="nexo-cursor-trail" aria-hidden="true"/>
}
