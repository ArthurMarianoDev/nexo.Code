import { useEffect, useRef, useState } from "react"

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Stage-driven typographic reveals, with IntersectionObserver and no continuous animation loop. */
export function KineticTypography() {
  useEffect(() => {
    const targets = [...document.querySelectorAll<HTMLElement>(
      ".hero-title, .section-heading h2, .kinetic-interlude h2, .about-intro h2, .cta-section h2, .store-hero h1, .store-intro h2"
    )]
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add("kinetic-type--visible")
        observer.unobserve(entry.target)
      }
    }, { rootMargin: "0px 0px -7% 0px", threshold: 0.05 })
    targets.forEach(element => {
      element.classList.add("kinetic-type")
      observer.observe(element)
    })
    return () => {
      observer.disconnect()
      targets.forEach(element => element.classList.remove("kinetic-type", "kinetic-type--visible"))
    }
  }, [])
  return null
}

export function IntroSequence() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    // First entrance per browser tab, never block following visits or reduced-motion users.
    if (reduceMotion() || sessionStorage.getItem("nexo-intro-v2")) return
    sessionStorage.setItem("nexo-intro-v2", "1")
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 1450)
    return () => clearTimeout(timer)
  }, [])
  return <div className={`nexo-intro ${visible ? "nexo-intro--visible" : ""}`} aria-hidden="true">
    <div className="nexo-intro__plane" />
    <div className="nexo-intro__mark">nexo<span>.</span></div>
    <div className="nexo-intro__index">CREATIVE ENGINEERING / EST. 2026</div>
  </div>
}

const experiments = [
  { number: "01", label: "Campo magnético", summary: "Um campo de atração que acompanha o cursor.", type: "magnet" },
  { number: "02", label: "Refração sintética", summary: "Luz, transparência e profundidade em camadas.", type: "refraction" },
  { number: "03", label: "Forma generativa", summary: "Geometria que reage ao seu movimento.", type: "form" },
] as const

/** Real local browser interaction, not a fake client portfolio or case study. */
export function NexoLab() {
  const stage = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [pressed, setPressed] = useState(false)
  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || reduceMotion()) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)))
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)))
    event.currentTarget.style.setProperty("--lab-x-shift", `${(x * 44).toFixed(1)}px`)
    event.currentTarget.style.setProperty("--lab-y-shift", `${(y * 39).toFixed(1)}px`)
    event.currentTarget.style.setProperty("--lab-rotate", `${(x * 45).toFixed(1)}deg`)
  }
  return <section id="laboratorio" className="nexo-lab" aria-labelledby="lab-title">
    <div className="shell nexo-lab__shell">
      <div className="nexo-lab__heading" data-reveal>
        <p className="kicker">N/C EXPERIMENTS — LAB 001</p>
        <h2 id="lab-title">Não contamos.<br/><em>Demonstramos.</em></h2>
        <p>Um laboratório aberto de experiências feitas para o navegador. Explore as interações — sem vídeos, cases fictícios ou promessas vazias.</p>
      </div>
      <div className="nexo-lab__layout">
        <div className="nexo-lab__options" role="group" aria-label="Experiências do laboratório">
          {experiments.map((item, index) => <button
            type="button" key={item.number}
            className={`nexo-lab__option ${active === index ? "nexo-lab__option--active" : ""}`}
            aria-pressed={active === index}
            onClick={() => {setActive(index);stage.current?.style.setProperty("--lab-x-shift","0px");stage.current?.style.setProperty("--lab-y-shift","0px");stage.current?.style.setProperty("--lab-rotate","0deg");setPressed(false)}}>
            <span>{item.number}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span>
          </button>)}
          <p className="nexo-lab__note">DEMONSTRAÇÕES AUTORAIS · NÃO SÃO PROJETOS DE CLIENTES</p>
        </div>
        <div ref={stage} className={`nexo-lab__stage nexo-lab__stage--${experiments[active].type} ${pressed ? "nexo-lab__stage--pressed" : ""}`}
          onPointerMove={onMove} onPointerLeave={() => {stage.current?.style.setProperty("--lab-x-shift","0px");stage.current?.style.setProperty("--lab-y-shift","0px");stage.current?.style.setProperty("--lab-rotate","0deg");setPressed(false)}}
          onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerCancel={() => setPressed(false)}
          aria-label={experiments[active].summary}>
          <div className="nexo-lab__orb nexo-lab__orb--a" aria-hidden="true" />
          <div className="nexo-lab__orb nexo-lab__orb--b" aria-hidden="true" />
          <div className="nexo-lab__orb nexo-lab__orb--c" aria-hidden="true" />
          <span className="nexo-lab__stage-id">N/C FORM // 00{active+1}</span>
          <span className="nexo-lab__stage-hint">{experiments[active].summary}</span>
        </div>
      </div>
    </div>
  </section>
}

const packageShapes = ["landing","business","premium"] as const

export function PackageMorph({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return <div className="package-morph" aria-label="Prévia interativa dos três tipos de projeto">
    <div className="package-morph__intro"><p className="kicker">INTERACTIVE / SOLUTION FORMS</p><strong>Uma forma para cada ambição.</strong></div>
    <div className={`package-morph__stage package-morph__stage--${packageShapes[selected]}`} aria-hidden="true">
      <div className="package-morph__shape package-morph__shape--one"/>
      <div className="package-morph__shape package-morph__shape--two"/>
      <div className="package-morph__shape package-morph__shape--three"/>
      <span className="package-morph__stage-label">N/C — SOLUTION 0{selected+1}</span>
    </div>
    <div className="package-morph__tabs" role="group" aria-label="Visualizar o tipo de projeto">
      {["Landing Essencial","Site Profissional","Experiência Premium"].map((label,index)=><button
        key={label} type="button" aria-pressed={selected===index}
        className={selected===index?"package-morph__tab package-morph__tab--active":"package-morph__tab"}
        onClick={()=>{onSelect(index);document.querySelectorAll(".pricing-card")[index]?.scrollIntoView({behavior: reduceMotion()?"auto":"smooth",block:"nearest"})}}
      ><span>0{index+1}</span>{label}</button>)}
    </div>
  </div>
}

export function PageDepth() {
  useEffect(() => {
    if (reduceMotion()) return
    const items = [...document.querySelectorAll<HTMLElement>(".service-card,.value-item,.process-step,.about-founder__photo,.pricing-card")]
    let raf = 0
    const render = () => {
      raf = 0
      for(const item of items) {
        const rect = item.getBoundingClientRect()
        if (rect.bottom < -100 || rect.top > innerHeight + 100) continue
        const p = (rect.top + rect.height/2 - innerHeight/2) / innerHeight
        item.style.setProperty("--depth-shift", `${(-p*16).toFixed(1)}px`)
      }
    }
    const scroll = () => { if (!raf) raf=requestAnimationFrame(render) }
    window.addEventListener("scroll",scroll,{passive:true})
    window.addEventListener("resize",scroll,{passive:true})
    render()
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("scroll",scroll);window.removeEventListener("resize",scroll);items.forEach(x=>x.style.removeProperty("--depth-shift"))}
  },[])
  return null
}
