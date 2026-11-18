import { useEffect, useRef, useState } from "react"

type SceneName = "hero" | "lab" | "services" | "manifesto" | "about" | "contact" | "store"

/** Single persistent cross-section, DOM-powered 3D stage.
 * Only transforms and opacity animate; no React updates during scrolling.
 * The WebGL hero remains the high-detail close-up of the same visual identity.
 */
export function MatterContinuum() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const layer = ref.current
    if (!layer) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0, on = true, scrollProgress = 0
    const targets = ([
      ["hero",document.getElementById("inicio")],
      ["lab",document.getElementById("laboratorio")],
      ["services",document.getElementById("servicos")],
      ["manifesto",document.getElementById("diferenciais")],
      ["about",document.getElementById("sobre")],
      ["contact",document.getElementById("contato")],
      ["store",document.querySelector(".store-hero")],
    ] as Array<[SceneName, Element | null]>).filter((entry): entry is [SceneName, Element] => entry[1] !== null).map(([scene,element])=>({scene,element}))
    const render=()=>{
      raf=0
      if (!on || document.hidden) return
      let selected: SceneName = "hero", nearest = Infinity
      for (const target of targets) {
        const box=target.element.getBoundingClientRect()
        const delta=Math.abs(box.top+box.height*.5-innerHeight*.5)
        if (delta<nearest){nearest=delta;selected=target.scene}
      }
      if (layer.dataset.scene!==selected) layer.dataset.scene=selected
      const total=Math.max(1,document.documentElement.scrollHeight-innerHeight)
      const progress=Math.min(1,Math.max(0,scrollY/total))
      scrollProgress+=(progress-scrollProgress)*.14
      layer.style.setProperty("--matter-progress",String(scrollProgress))
      layer.style.setProperty("--matter-turn",`${(scrollProgress*520).toFixed(1)}deg`)
      layer.style.setProperty("--matter-rise",`${(scrollProgress*-130).toFixed(1)}px`)
      // Per-section morphing uses CSS class/data transitions.
    }
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(render)}
    const visible=()=>{on=!document.hidden;if(on)schedule()}
    addEventListener("scroll",schedule,{passive:true})
    addEventListener("resize",schedule,{passive:true})
    document.addEventListener("visibilitychange",visible)
    schedule()
    return()=>{cancelAnimationFrame(raf);removeEventListener("scroll",schedule);removeEventListener("resize",schedule);document.removeEventListener("visibilitychange",visible)}
  },[])
  return <div ref={ref} className="matter-continuum" data-scene="hero" aria-hidden="true">
    <div className="matter-continuum__aura" />
    <div className="matter-continuum__object">
      <div className="matter-continuum__ring matter-continuum__ring--one" />
      <div className="matter-continuum__ring matter-continuum__ring--two" />
      <div className="matter-continuum__ring matter-continuum__ring--three" />
      <div className="matter-continuum__core" />
    </div>
  </div>
}

/** An accessible full screen navigation experience, mounted once across routes. */
export function StudioNavigation() {
  const [open,setOpen]=useState(false)
  const container=useRef<HTMLDivElement>(null)
  const button=useRef<HTMLButtonElement>(null)
  useEffect(()=>{
    if(!open)return
    const old=document.body.style.overflow
    document.body.style.overflow="hidden"
    const first=container.current?.querySelector<HTMLAnchorElement>("a")
    first?.focus()
    const key=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){setOpen(false);button.current?.focus()}
      if(e.key!=="Tab")return
      const links=[...(container.current?.querySelectorAll<HTMLElement>("a,button")??[])]
      if(!links.length)return
      const current=links.indexOf(document.activeElement as HTMLElement)
      if(e.shiftKey&&current<=0){e.preventDefault();links[links.length-1].focus()}
      if(!e.shiftKey&&current===links.length-1){e.preventDefault();links[0].focus()}
    }
    document.addEventListener("keydown",key)
    return()=>{document.body.style.overflow=old;document.removeEventListener("keydown",key)}
  },[open])
  const home=import.meta.env.BASE_URL
  const sections=[["01","Início",home+"#inicio"],["02","Experiências",home+"#laboratorio"],["03","Serviços",home+"#servicos"],["04","A Nexo",home+"#sobre"],["05","Loja",home+"#/loja"],["06","Contato",home+"#contato"]]
  return <>
    <button ref={button} className="studio-menu-button" aria-label={open?"Fechar navegação imersiva":"Abrir navegação imersiva"}
      aria-expanded={open} aria-controls="studio-menu-panel" type="button" onClick={()=>setOpen(x=>!x)}>
      <span className="studio-menu-button__glyph" aria-hidden="true">{open?"×":"✳"}</span>
      <span>{open?"FECHAR":"EXPLORAR"}</span>
    </button>
    <div ref={container} id="studio-menu-panel" className={`studio-menu ${open?"studio-menu--open":""}`} inert={!open} aria-hidden={!open}>
      <div className="studio-menu__ambient" aria-hidden="true"><span/><span/><span/></div>
      <div className="studio-menu__inner">
        <p className="studio-menu__eyebrow">N/C — EXPLORE O UNIVERSO DIGITAL</p>
        <nav aria-label="Navegação imersiva">
          {sections.map(([index,name,url])=><a href={url} key={name} onClick={()=>setOpen(false)}>
            <small>{index}</small><strong>{name}</strong><span aria-hidden="true">↗</span>
          </a>)}
        </nav>
        <p className="studio-menu__bottom">DESIGN, TECNOLOGIA E IDEIAS EM MOVIMENTO — NEXO.CODE</p>
      </div>
    </div>
  </>
}

export function SoundToggle() {
  const [enabled,setEnabled]=useState(false)
  const context=useRef<AudioContext|null>(null)
  useEffect(()=>{
    if(!enabled)return
    // Only sounds triggered by deliberate user actions, never on first load.
    const click=(event:MouseEvent)=>{
      if(!(event.target instanceof Element) || !event.target.closest("a,button"))return
      try{
        const ac=context.current??new AudioContext()
        context.current=ac
        if(ac.state==="suspended")void ac.resume()
        const oscillator=ac.createOscillator(),gain=ac.createGain()
        oscillator.type="sine"
        oscillator.frequency.setValueAtTime(460,ac.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(690,ac.currentTime+.075)
        gain.gain.setValueAtTime(.0001,ac.currentTime)
        gain.gain.exponentialRampToValueAtTime(.018,ac.currentTime+.006)
        gain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.105)
        oscillator.connect(gain);gain.connect(ac.destination)
        oscillator.start();oscillator.stop(ac.currentTime+.11)
      }catch{ /* Unsupported audio is always silent. */ }
    }
    document.addEventListener("click",click)
    return()=>document.removeEventListener("click",click)
  },[enabled])
  useEffect(()=>()=>{void context.current?.close()},[])
  return <button type="button" className="studio-audio-toggle" aria-pressed={enabled} aria-label={enabled?"Desativar sons das interações":"Ativar sons das interações"}
    onClick={()=>setEnabled(x=>!x)}><span aria-hidden="true">{enabled?"◖))":"◖)"}</span>{enabled?"SOM ON":"SOM OFF"}</button>
}
