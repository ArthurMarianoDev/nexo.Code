import { useEffect, useRef } from "react"

/**
 * Nexo Lab / real-time interactive canvas studies.
 * One GPU-free 2D canvas, reusable across all laboratory experiments.
 * Pointer events write to refs (no React rerenders); capped DPR and 30 FPS.
 */
export type LabMode = "field" | "optics" | "ribbon" | "type" | "constellation"

type Particle={x:number;y:number;vx:number;vy:number;radius:number;offset:number}

export default function LabSimulations({mode}:{mode:LabMode}){
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const modeRef=useRef<LabMode>(mode)
  modeRef.current=mode

  useEffect(()=>{
    const canvas=canvasRef.current
    if(!canvas)return
    const ctx=canvas.getContext("2d",{alpha:true})
    if(!ctx)return
    const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches
    let width=1,height=1,mouseX=.5,mouseY=.5,pressed=false
    let frameId=0,last=0,elapsed=0,active=true
    const particles:Particle[]=Array.from({length:reduceMotion?32:90},(_,i)=>({
      x:((i*53.7)%101)/101,y:((i*29.3)%103)/103,
      vx:0,vy:0,radius:1+(i%4)*.65,offset:i*2.399963
    }))
    const resize=()=>{
      const rect=canvas.getBoundingClientRect()
      width=Math.max(1,rect.width);height=Math.max(1,rect.height)
      const dpr=Math.min(devicePixelRatio||1,1.5)
      canvas.width=Math.max(1,Math.floor(width*dpr))
      canvas.height=Math.max(1,Math.floor(height*dpr))
      ctx.setTransform(dpr,0,0,dpr,0,0)
    }
    const draw=(now:number)=>{
      if(!active)return
      frameId=requestAnimationFrame(draw)
      if(document.hidden||now-last<33)return
      const dt=Math.min((now-last)/1000,.05)
      last=now;elapsed+=dt
      ctx.clearRect(0,0,width,height)
      const mx=mouseX*width,my=mouseY*height
      const mode=modeRef.current
      const time=reduceMotion?0:elapsed
      const gradients=ctx.createRadialGradient(mx,my,2,mx,my,Math.min(width,height)*.56)
      gradients.addColorStop(0,pressed?"rgba(185,255,79,.17)":"rgba(134,217,255,.10)")
      gradients.addColorStop(1,"rgba(8,18,20,0)")
      ctx.fillStyle=gradients;ctx.fillRect(0,0,width,height)
      if(mode==="field"||mode==="constellation"){
        const dots=particles.slice(0,mode==="field"?80:62)
        for(const p of dots){
          const dx=mouseX-p.x,dy=mouseY-p.y
          const dist=Math.max(.02,Math.hypot(dx,dy))
          const pull=mode==="field"?(pressed?.0012:.0005):-.00022
          if(!reduceMotion){
            p.vx=(p.vx+(dx/dist)*pull/(dist+.06))*.93
            p.vy=(p.vy+(dy/dist)*pull/(dist+.06))*.93
            p.x+=p.vx+Math.cos(time*.2+p.offset)*.00025
            p.y+=p.vy+Math.sin(time*.2+p.offset)*.00025
            p.x=(p.x+1)%1;p.y=(p.y+1)%1
          }
          const x=p.x*width,y=p.y*height
          ctx.beginPath();ctx.arc(x,y,p.radius,0,Math.PI*2)
          ctx.fillStyle=mode==="field"?"rgba(185,255,79,.72)":"rgba(134,217,255,.85)"
          ctx.fill()
        }
        if(mode==="constellation"){
          ctx.strokeStyle="rgba(134,217,255,.14)"
          ctx.lineWidth=.7
          for(let i=0;i<dots.length;i++){
            for(let j=i+1;j<dots.length;j++){
              const a=dots[i],b=dots[j]
              const d=Math.hypot((a.x-b.x)*width,(a.y-b.y)*height)
              if(d>0&&d<Math.min(width,height)*.16){
                ctx.globalAlpha=Math.max(0,1-d/(Math.min(width,height)*.16))
                ctx.beginPath();ctx.moveTo(a.x*width,a.y*height);ctx.lineTo(b.x*width,b.y*height);ctx.stroke()
              }
            }
          }
          ctx.globalAlpha=1
        }
      }else if(mode==="optics"){
        const rings=13
        for(let i=rings;i>0;i--){
          const radius=(i*14+Math.sin(time*.8+i*.3)*7)*(Math.min(width,height)/450)
          ctx.beginPath()
          ctx.ellipse(mx+(i-6)*1.6,my,Math.max(2,radius),Math.max(2,radius*.74),time*.06+i*.06,0,Math.PI*2)
          ctx.strokeStyle=i%3===0?"rgba(185,255,79,.52)":"rgba(134,217,255,.36)"
          ctx.lineWidth=i%2===0?2:1
          ctx.stroke()
        }
        const gradient=ctx.createRadialGradient(mx-width*.055,my-height*.07,3,mx,my,Math.min(width,height)*.32)
        gradient.addColorStop(0,"rgba(235,255,215,.85)")
        gradient.addColorStop(.2,"rgba(185,255,79,.36)")
        gradient.addColorStop(.65,"rgba(42,146,132,.1)")
        gradient.addColorStop(1,"rgba(134,217,255,0)")
        ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(mx,my,Math.min(width,height)*.32,0,Math.PI*2);ctx.fill()
      }else if(mode==="ribbon"){
        for(let band=0;band<9;band++){
          ctx.beginPath()
          const y=height*(.23+band*.064)
          for(let x=0;x<=width;x+=5){
            const d=Math.abs(x-mx)/Math.max(1,width)
            const influence=Math.exp(-d*d*22)*(my-height*.5)*.16
            const wav=Math.sin(x*.013+band*.48+time*1.35)*(14+band*2)
            const py=y+wav+influence
            if(x===0)ctx.moveTo(x,py);else ctx.lineTo(x,py)
          }
          ctx.strokeStyle=band%2?"rgba(134,217,255,.44)":"rgba(185,255,79,.52)"
          ctx.lineWidth=1.5+band*.13;ctx.stroke()
        }
      }else if(mode==="type"){
        const fontSize=Math.max(55,Math.min(180,width*.24))
        ctx.font=`700 ${fontSize}px "Space Grotesk", sans-serif`
        ctx.textAlign="center";ctx.textBaseline="middle"
        for(let layer=8;layer>=0;layer--){
          const amount=layer*2.5
          const dx=(mouseX-.5)*amount*4
          const dy=(mouseY-.5)*amount*4
          ctx.fillStyle=layer===0?"rgba(226,255,205,.95)":layer%2?"rgba(134,217,255,.08)":"rgba(185,255,79,.09)"
          ctx.fillText("N/C",width*.5+dx,height*.48+dy)
        }
        ctx.textAlign="left"
        ctx.font='500 12px "DM Mono", monospace'
        ctx.fillStyle="#86d9ff"
        ctx.fillText("MOVE TO DISTORT TYPOGRAPHY",20,height-26)
      }
      if(mode!=="type"){
        ctx.strokeStyle="rgba(185,255,79,.55)";ctx.lineWidth=1
        ctx.beginPath();ctx.arc(mx,my,pressed?21:10,0,Math.PI*2);ctx.stroke()
        ctx.fillStyle="#d8ffb1";ctx.beginPath();ctx.arc(mx,my,2,0,Math.PI*2);ctx.fill()
      }
      if(reduceMotion){cancelAnimationFrame(frameId);frameId=0}
    }
    const move=(e:PointerEvent)=>{
      const rect=canvas.getBoundingClientRect()
      mouseX=Math.max(0,Math.min(1,(e.clientX-rect.left)/Math.max(1,rect.width)))
      mouseY=Math.max(0,Math.min(1,(e.clientY-rect.top)/Math.max(1,rect.height)))
    }
    const down=()=>{pressed=true}
    const up=()=>{pressed=false}
    const observer=new IntersectionObserver(entries=>{
      active=entries[0]?.isIntersecting??false
      if(active&&!frameId)frameId=requestAnimationFrame(draw)
      if(!active&&frameId){cancelAnimationFrame(frameId);frameId=0;last=0}
    },{rootMargin:"100px"})
    observer.observe(canvas)
    canvas.addEventListener("pointermove",move,{passive:true})
    canvas.addEventListener("pointerdown",down)
    window.addEventListener("pointerup",up)
    window.addEventListener("resize",resize,{passive:true})
    resize()
    return()=>{
      active=false;cancelAnimationFrame(frameId);observer.disconnect()
      canvas.removeEventListener("pointermove",move)
      canvas.removeEventListener("pointerdown",down)
      window.removeEventListener("pointerup",up)
      window.removeEventListener("resize",resize)
    }
  },[])

  return <canvas ref={canvasRef} className="nexo-lab__simulation" aria-hidden="true"/>
}
