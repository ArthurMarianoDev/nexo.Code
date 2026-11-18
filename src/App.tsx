import MatterEngine from "./components/MatterEngine"
import { StudioNavigation, SoundToggle } from "./components/StudioSystems"
import { KineticTypography, IntroSequence, NexoLab, PackageMorph, PageDepth } from "./components/ImmersiveExperiences"
import CursorTrail from "./components/CursorTrail"
import ScrollArtifact from "./components/ScrollArtifact"
import { useEffect, useRef, useState } from "react"

const homeHref = import.meta.env.BASE_URL
const contactHref = `${homeHref}#contato`
const storeHref = `${homeHref}#/loja`
const contactEmail = "nexocodebrasil@gmail.com"
const whatsappUrl = "https://wa.me/5594991164544"

type IconName = "arrow" | "check" | "clock" | "code" | "design" | "growth" | "menu" | "shield" | "spark" | "x"

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    code: (
      <>
        <path d="m8 9-3 3 3 3" />
        <path d="m16 9 3 3-3 3" />
        <path d="m14 5-4 14" />
      </>
    ),
    design: (
      <>
        <path d="M12 3 4 7l8 4 8-4-8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 17 8 4 8-4" />
      </>
    ),
    growth: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-5 3 3 5-7" />
      </>
    ),
    menu: (
      <>
        <path d="M4 8h16" />
        <path d="M4 16h16" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    spark: (
      <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" />
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  )
}

const services = [
  {
    number: "01",
    icon: "design" as IconName,
    title: "Landing pages",
    description:
      "Páginas focadas em conversão, com mensagem clara, visual premium e cada detalhe pensado para transformar visitas em contatos.",
  },
  {
    number: "02",
    icon: "code" as IconName,
    title: "Sites institucionais",
    description:
      "Sites rápidos e responsivos que posicionam sua marca, apresentam seu negócio e geram confiança desde o primeiro clique.",
  },
  {
    number: "03",
    icon: "growth" as IconName,
    title: "E-commerce & projetos",
    description:
      "Experiências digitais sob medida para vender produtos, serviços ou tirar do papel uma ideia com potencial de escala.",
  },
]

const packages = [
  {
    name: "Landing Essencial",
    label: "Campanhas e ofertas",
    price: "R$ 2.490",
    installment: "ou 3x de R$ 830",
    description:
      "Uma página estratégica para campanhas, lançamentos ou serviços com uma oferta principal.",
    timeline: "10 a 15 dias úteis",
    features: [
      "Diagnóstico e direção estratégica",
      "Copy e estrutura de conversão",
      "Design responsivo exclusivo",
      "Desenvolvimento e publicação",
      "SEO técnico essencial",
      "1 rodada de refinamentos",
    ],
    cta: "Quero esta landing",
  },
  {
    name: "Site Profissional",
    label: "Para empresas em crescimento",
    price: "R$ 5.900",
    installment: "ou 4x de R$ 1.475",
    description:
      "Presença digital completa para empresas que precisam transmitir confiança e gerar oportunidades.",
    timeline: "20 a 30 dias úteis",
    featured: true,
    features: [
      "Tudo do plano Essencial",
      "Até 5 páginas estratégicas",
      "Arquitetura de conteúdo e UX",
      "Integração com WhatsApp e formulários",
      "Analytics e Search Console",
      "2 rodadas de refinamentos",
    ],
    cta: "Quero um site profissional",
  },
  {
    name: "Experiência Premium",
    label: "Solução personalizada",
    price: "A partir de R$ 9.800",
    installment: "condições definidas na proposta",
    description:
      "Projeto autoral para marcas que buscam diferenciação, interações avançadas e uma experiência memorável.",
    timeline: "A partir de 30 dias úteis",
    features: [
      "Estratégia e direção criativa",
      "Sistema visual digital exclusivo",
      "Motion e microinterações",
      "Integrações personalizadas",
      "Otimização avançada de performance",
      "Acompanhamento pós-lançamento",
    ],
    cta: "Solicitar proposta",
  },
]

const faqs = [
  {
    question: "Quanto tempo leva para o site ficar pronto?",
    answer:
      "Projetos de landing page costumam levar de 2 a 3 semanas. Sites institucionais mais completos levam, em média, de 4 a 6 semanas. Você recebe um cronograma claro antes de começarmos.",
  },
  {
    question: "Vocês cuidam dos textos e das imagens?",
    answer:
      "Sim. Estruturamos toda a narrativa da página, refinamos os textos para conversão e orientamos a seleção de imagens. Também podemos incluir copywriting completo como parte do projeto.",
  },
  {
    question: "O site funciona bem no celular?",
    answer:
      "Sempre. Todos os projetos são desenhados com abordagem responsiva, testados em diferentes tamanhos de tela e otimizados para carregamento rápido.",
  },
  {
    question: "Consigo editar o conteúdo depois?",
    answer:
      "Sim. Conforme a necessidade do projeto, entregamos um painel de conteúdo simples ou oferecemos um plano de evolução e suporte contínuo.",
  },
]

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]")
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.14 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

function AmbientBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const background = backgroundRef.current
    if (!background) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    let frame = 0
    let pointerX = window.innerWidth * 0.72
    let pointerY = window.innerHeight * 0.28

    const update = () => {
      const scrollY = window.scrollY
      const scrollRange = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      )
      const progress = Math.min(scrollY / scrollRange, 1)

      background.style.setProperty("--ambient-slow", `${scrollY * -0.045}px`)
      background.style.setProperty("--ambient-medium", `${scrollY * 0.08}px`)
      background.style.setProperty("--ambient-fast", `${scrollY * -0.13}px`)
      background.style.setProperty(
        "--ambient-grid",
        `${(scrollY * 0.12) % 72}px`,
      )
      background.style.setProperty("--ambient-progress", `${progress}`)
      background.style.setProperty("--pointer-x", `${pointerX}px`)
      background.style.setProperty("--pointer-y", `${pointerY}px`)
      frame = 0
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      scheduleUpdate()
    }

    update()
    if (!reducedMotion) {
      window.addEventListener("scroll", scheduleUpdate, { passive: true })
      window.addEventListener("resize", scheduleUpdate)
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      })
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [])

  return (
    <div className="ambient-background" ref={backgroundRef} aria-hidden="true">
      <div className="ambient-background__mesh" />
      <div className="ambient-background__grid" />
      <div className="ambient-orb ambient-orb--green" />
      <div className="ambient-orb ambient-orb--violet" />
      <div className="ambient-orb ambient-orb--blue" />
      <div className="ambient-beam ambient-beam--one" />
      <div className="ambient-beam ambient-beam--two" />
      <div className="ambient-scroll-progress" />
    </div>
  )
}

function trackCardGlow(event: React.PointerEvent<HTMLElement>) {
  const card = event.currentTarget
  const bounds = card.getBoundingClientRect()
  card.style.setProperty("--card-x", `${event.clientX - bounds.left}px`)
  card.style.setProperty("--card-y", `${event.clientY - bounds.top}px`)
}

function resetCardGlow(event: React.PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--card-x", "50%")
  event.currentTarget.style.setProperty("--card-y", "50%")
}

function PurchaseForm({
  packageName,
  onClose,
}: {
  packageName: string
  onClose: () => void
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const phone = String(formData.get("phone") ?? "").trim()
    const note = String(formData.get("message") ?? "").trim()
    const message = [
      "Olá, Nexo Code! Tenho interesse em contratar um projeto.",
      "",
      `Pacote: ${packageName}`,
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `Telefone: ${phone}`,
      note ? `Mensagem: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    window.open(
      `${whatsappUrl}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    )
  }

  return (
    <div
      className="purchase-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="purchase-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-title"
      >
        <div className="purchase-modal__header">
          <div>
            <p className="kicker">INICIAR PROJETO</p>
            <span>{packageName}</span>
          </div>
          <button
            className="purchase-close"
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário"
          >
            <Icon name="x" className="size-5" />
          </button>
        </div>

        <h2 id="purchase-title">Conte um pouco sobre você.</h2>
        <p className="purchase-intro">
          Preencha seus dados para continuar a conversa com a Nexo Code pelo
          WhatsApp.
        </p>

        <form className="purchase-form" onSubmit={handleSubmit}>
          <label>
            <span>Nome completo</span>
            <input
              type="text"
              name="name"
              maxLength={100}
              autoComplete="name"
              placeholder="Como podemos chamar você?"
              required
              autoFocus
            />
          </label>
          <label>
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              maxLength={254}
              autoComplete="email"
              placeholder="voce@empresa.com"
              required
            />
          </label>
          <label className="purchase-form__wide">
            <span>Número de telefone</span>
            <input
              type="tel"
              name="phone"
              maxLength={22}
              minLength={8}
              pattern="[+0-9() -]{8,22}"
              title="Digite um telefone válido com 8 a 22 caracteres, usando números, espaços, parênteses, hífen ou +."
              autoComplete="tel"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              required
            />
          </label>
          <label className="purchase-form__wide">
            <span>
              Mensagem <i>opcional</i>
            </span>
            <textarea
              name="message"
              maxLength={1200}
              rows={4}
              placeholder="Conte sobre seu negócio, objetivo ou prazo desejado."
            />
          </label>
          <div className="purchase-form__footer">
            <p>Ao continuar, seus dados serão compartilhados com o WhatsApp para atendimento. Leia a <a href={`${homeHref}privacidade.html`} target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.</p>
            <button className="button" type="submit">
              Continuar no WhatsApp <Icon name="arrow" className="size-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function StorePage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [previewPackage, setPreviewPackage] = useState(1)
  useScrollReveal()

  useEffect(() => {
    document.title = "Soluções e valores — Nexo.Code"
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="site-page min-h-screen bg-ink text-white selection:bg-electric selection:text-ink">
      <header className="site-header site-header--scrolled">
        <nav
          className="shell flex h-20 items-center justify-between"
          aria-label="Navegação da loja"
        >
          <a
            className="brand"
            href={homeHref}
            aria-label="Nexo, página inicial"
          >
            nexo<span>.</span>
          </a>
          <a className="portfolio-back" href={homeHref}>
            <span aria-hidden="true">←</span> Voltar para o início
          </a>
          <a
            className="button button--small hidden sm:inline-flex"
            href={contactHref}
          >
            Começar projeto
            <Icon name="arrow" className="size-4" />
          </a>
        </nav>
      </header>

      <main>
        <section className="store-hero store-hero--cinematic">
          <div className="orb orb--one" />
          <div className="store-hero__art-index" aria-hidden="true">N/C — YOUR NEXT DIMENSION <span>006 — COMMERCE AS EXPERIENCE</span></div>
          <div className="shell relative z-10">
            <div className="eyebrow reveal">
              <span className="eyebrow-dot" />
              SOLUÇÕES DIGITAIS
            </div>
            <div className="store-hero__heading">
              <h1 className="reveal reveal--delay-1">
                Escolha o próximo passo
                <br />
                da sua <span>marca.</span>
              </h1>
              <p className="reveal reveal--delay-2">
                Escopos definidos, investimento transparente e desenvolvimento acompanhado de perto.
                Escolha um ponto de partida; nós adaptamos a solução ao seu
                negócio.
              </p>
            </div>
            <div className="store-trust reveal reveal--delay-3">
              <span>
                <Icon name="shield" className="size-4" /> Contrato e escopo
                claros
              </span>
              <span>
                <Icon name="clock" className="size-4" /> Cronograma definido
              </span>
              <span>
                <Icon name="spark" className="size-4" /> Design exclusivo
              </span>
            </div>
          </div>
        </section>

        <section className="store-section">
          <div className="shell">
            <div className="store-intro" data-reveal>
              <div>
                <p className="kicker">PACOTES DE CRIAÇÃO</p>
                <h2>
                  Investimento claro.
                  <br />
                  Entrega sem atalhos.
                </h2>
              </div>
              <p>
                Valores-base para projetos com conteúdo em português. Após uma
                conversa breve, você recebe escopo, prazo e condições finais.
              </p>
            </div>
            <div className="store-promo" data-reveal role="note">
              <div className="store-promo__signal">
                <span />
                OFERTA PARA NOVOS CLIENTES
              </div>
              <div className="store-promo__message">
                <Icon name="spark" className="size-6" />
                <strong>50% DE DESCONTO NO SEU PRIMEIRO SITE!</strong>
              </div>
              <p>Condição especial sujeita à disponibilidade de agenda.</p>
            </div>
            <PackageMorph selected={previewPackage} onSelect={setPreviewPackage} />
            <div className="pricing-grid">
              {packages.map((item) => (
                <article
                  className={`pricing-card interactive-card ${
                    item.featured ? "pricing-card--featured" : ""
                  } ${packages.indexOf(item) === previewPackage ? "pricing-card--active" : ""}`}
                  key={item.name}
                  onPointerMove={trackCardGlow}
                  onPointerLeave={resetCardGlow}
                >
                  {item.featured && (
                    <span className="pricing-badge">RECOMENDADO</span>
                  )}
                  <p className="pricing-label">{item.label}</p>
                  <h2>{item.name}</h2>
                  <p className="pricing-description">{item.description}</p>
                  <div className="pricing-price">
                    <strong>{item.price}</strong>
                    <span>{item.installment}</span>
                  </div>
                  <div className="pricing-timeline">
                    <Icon name="clock" className="size-4" /> {item.timeline}
                  </div>
                  <ul>
                    {item.features.map((feature) => (
                      <li key={feature}>
                        <Icon name="check" className="size-4" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`button ${item.featured ? "" : "button--ghost"}`}
                    type="button"
                    onClick={() => setSelectedPackage(item.name)}
                  >
                    {item.cta} <Icon name="arrow" className="size-4" />
                  </button>
                </article>
              ))}
            </div>
            <p className="store-note" data-reveal>
              Hospedagem, domínio, banco de imagens pago e integrações de
              terceiros não estão incluídos. E-commerce e plataformas são
              orçados sob medida.
            </p>
          </div>
        </section>

        <section className="store-assurance">
          <div className="shell">
            <div className="store-assurance__heading" data-reveal>
              <p className="kicker">COMO FUNCIONA</p>
              <h2>
                Profissional do início
                <br />
                ao lançamento.
              </h2>
            </div>
            <div className="assurance-grid">
              {[
                [
                  "01",
                  "Conversa inicial",
                  "Alinhamos objetivos, momento do negócio e o pacote ideal sem compromisso.",
                ],
                [
                  "02",
                  "Proposta e contrato",
                  "Você recebe escopo, responsabilidades, etapas, prazo e forma de pagamento.",
                ],
                [
                  "03",
                  "Criação acompanhada",
                  "Apresentamos cada fase para validar decisões antes de avançar.",
                ],
                [
                  "04",
                  "Publicação assistida",
                  "Colocamos tudo no ar, testamos e orientamos os próximos passos.",
                ],
              ].map(([number, title, description]) => (
                <article
                  className="assurance-item interactive-card"
                  key={number}
                  data-reveal
                  onPointerMove={trackCardGlow}
                  onPointerLeave={resetCardGlow}
                >
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="portfolio-cta">
          <div className="shell" data-reveal>
            <p className="kicker">PRECISA DE ALGO DIFERENTE?</p>
            <h2>
              Vamos desenhar o escopo
              <br />
              certo para seu negócio.
            </h2>
            <a
              className="button"
              href={`mailto:${contactEmail}?subject=Projeto%20personalizado`}
            >
              Solicitar proposta personalizada{" "}
              <Icon name="arrow" className="size-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} Nexo.Code. Todos os direitos reservados.</span>
          <a href={`${homeHref}privacidade.html`}>Política de Privacidade</a>
          <a href={homeHref}>
            nexo<span>.</span>
          </a>
        </div>
      </footer>
      {selectedPackage && (
        <PurchaseForm
          packageName={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  )
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  useScrollReveal()

  useEffect(() => {
    document.title = "Nexo.Code — Sites profissionais e soluções digitais"
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-page min-h-screen bg-ink text-white selection:bg-electric selection:text-ink">
      <header
        className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}
      >
        <nav
          className="shell flex h-20 items-center justify-between"
          aria-label="Navegação principal"
        >
          <a
            className="brand"
            href="#inicio"
            onClick={closeMenu}
            aria-label="Nexo, início"
          >
            nexo<span>.</span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            <a className="nav-link" href="#servicos">
              Serviços
            </a>
            <a className="nav-link nav-link--store" href={storeHref}>
              Loja
            </a>
            <a className="nav-link" href="#diferenciais">
              Diferenciais
            </a>
            <a className="nav-link" href="#processo">
              Processo
            </a>
            <a className="nav-link" href="#sobre">
              Sobre
            </a>
          </div>

          <a
            className="button button--small hidden md:inline-flex"
            href="#contato"
          >
            Começar projeto
            <Icon name="arrow" className="size-4" />
          </a>

          <button
            className="icon-button md:hidden"
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? "x" : "menu"} className="size-6" />
          </button>
        </nav>

        {menuOpen && (
          <div className="mobile-menu md:hidden">
            {["servicos", "diferenciais", "processo", "sobre"].map((item) => (
              <a key={item} href={`#${item}`} onClick={closeMenu}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
            <a href={storeHref} onClick={closeMenu}>
              Loja — ver pacotes e valores
            </a>
            <a
              className="button mt-3 justify-center"
              href="#contato"
              onClick={closeMenu}
            >
              Começar projeto
            </a>
          </div>
        )}
      </header>

      <main>
        <section
          id="inicio"
          className="hero-grid relative overflow-hidden pt-32 md:pt-44"
        >
          <div className="orb orb--one" />
          <div className="orb orb--two" />
          <div className="shell relative z-10">
            <div className="eyebrow reveal">
              <span className="eyebrow-dot" />
              NEXO.CODE — DESENVOLVIMENTO DIGITAL
            </div>
            <h1 className="hero-title reveal reveal--delay-1">
              O digital não
              <br />
              nasceu para ser <span>comum.</span>
            </h1>
            <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
              <p className="max-w-xl text-lg leading-relaxed text-mist reveal reveal--delay-2 md:text-xl">
                Desenvolvemos sites e experiências digitais com direção criativa,
                tecnologia e um propósito claro: fazer sua marca se destacar.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row reveal reveal--delay-3">
                <a className="button" href="#contato">
                  Iniciar projeto
                  <Icon name="arrow" className="size-5" />
                </a>
                <a className="button button--ghost" href={storeHref}>
                  Ver pacotes e valores
                </a>
              </div>
            </div>

            <div className="matter-hero-portal" aria-hidden="true">
              <span className="matter-hero-portal__orbit">N/C / 003</span>
              <span className="matter-hero-portal__signature">MATTER IN MOTION — 01/06</span>
              <span className="matter-hero-portal__corner matter-hero-portal__corner--a" />
              <span className="matter-hero-portal__corner matter-hero-portal__corner--b" />
            </div>

            <div className="stats-grid">
              <div>
                <strong>Estratégia</strong>
                <span>antes de qualquer pixel</span>
              </div>
              <div>
                <strong>Exclusividade</strong>
                <span>sem templates genéricos</span>
              </div>
              <div>
                <strong>Performance</strong>
                <span>rápido em toda tela</span>
              </div>
              <div>
                <strong>Transparência</strong>
                <span>escopo, prazo e processo</span>
              </div>
            </div>
          </div>
        </section>

        <div className="kinetic-interlude shell">
          <div className="kinetic-interlude__copy" data-reveal>
            <p className="kicker">N/C — DIGITAL MATTER / 002</p>
            <h2>O movimento<br />faz parte da <em>ideia.</em></h2>
            <p>Cada interação é uma oportunidade para criar uma experiência que permanece na memória.</p>
            <span className="kinetic-interlude__hint">↓ EXPLORE E VEJA A FORMA REAGIR</span>
          </div>
          <ScrollArtifact />
        </div>

        <NexoLab />

        <section className="studio-manifesto" aria-labelledby="studio-manifesto-title">
          <div className="shell studio-manifesto__inner">
            <div className="studio-manifesto__index">
              <span>CHAPTER 02 — DESIGN AS LANGUAGE</span>
              <span>SCROLL TO REVEAL / N-C 003</span>
            </div>
            <h2 id="studio-manifesto-title">Não criamos<br/><em>mais do mesmo.</em><br/>Criamos o <span>próximo.</span></h2>
            <div className="studio-manifesto__bottom">
              <p>A tecnologia constrói a forma. A direção criativa dá significado. E cada interação faz a marca ganhar vida.</p>
              <span>INOVAÇÃO SEM RUÍDO. IMPACTO COM INTENÇÃO.</span>
            </div>
          </div>
        </section>

        <section id="servicos" className="section shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="kicker">O QUE FAZEMOS</p>
              <h2>
                Da ideia à presença
                <br />que deixa marca.
              </h2>
            </div>
            <p>
              Unimos estratégia, design e tecnologia para construir presenças
              digitais que não passam despercebidas.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article
                className="service-card interactive-card"
                key={service.title}
                data-reveal
                onPointerMove={trackCardGlow}
                onPointerLeave={resetCardGlow}
              >
                <div className="flex items-start justify-between">
                  <div className="service-icon">
                    <Icon name={service.icon} className="size-6" />
                  </div>
                  <span className="service-number">{service.number}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a
                  href="#contato"
                  aria-label={`Saiba mais sobre ${service.title}`}
                >
                  Saiba mais <Icon name="arrow" className="size-4" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          id="diferenciais"
          className="section border-y border-white/10 bg-charcoal"
        >
          <div className="shell">
            <div className="section-heading" data-reveal>
              <div>
                <p className="kicker">O PADRÃO NEXO</p>
                <h2>
                  Não é só estética.
                  <br />
                  É intenção em cada detalhe.
                </h2>
              </div>
              <a className="text-link" href={storeHref}>
                Conhecer pacotes e valores{" "}
                <Icon name="arrow" className="size-4" />
              </a>
            </div>

            <div className="value-grid">
              {[
                [
                  "01",
                  "Mensagem que posiciona",
                  "Organizamos sua proposta para o cliente entender, confiar e agir sem esforço.",
                ],
                [
                  "02",
                  "Visual com personalidade",
                  "Uma direção criativa própria, coerente com a qualidade e o momento da sua marca.",
                ],
                [
                  "03",
                  "Experiência que conduz",
                  "Cada seção, interação e chamada tem uma função clara na jornada de conversão.",
                ],
                [
                  "04",
                  "Código feito para durar",
                  "Desenvolvimento responsivo, leve e organizado para evoluir junto com o negócio.",
                ],
              ].map(([number, title, description]) => (
                <article
                  className="value-item interactive-card"
                  key={number}
                  data-reveal
                  onPointerMove={trackCardGlow}
                  onPointerLeave={resetCardGlow}
                >
                  <span>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="processo" className="section shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="kicker">NOSSO PROCESSO</p>
              <h2>
                Simples, próximo
                <br />e sem surpresas.
              </h2>
            </div>
            <p>
              Você acompanha cada etapa e sabe exatamente o que está
              acontecendo, do briefing ao lançamento.
            </p>
          </div>
          <div className="process-grid">
            {[
              [
                "01",
                "Imersão",
                "Entendemos o negócio, o público e os objetivos para definir a direção certa.",
              ],
              [
                "02",
                "Estratégia",
                "Organizamos conteúdo, jornada e mensagem para guiar o visitante até a ação.",
              ],
              [
                "03",
                "Design & código",
                "Criamos a experiência visual e desenvolvemos tudo com precisão e performance.",
              ],
              [
                "04",
                "Lançamento",
                "Testamos, refinamos e colocamos seu novo site no ar com todo o suporte.",
              ],
            ].map(([number, title, description]) => (
              <article
                className="process-step interactive-card"
                key={number}
                data-reveal
                onPointerMove={trackCardGlow}
                onPointerLeave={resetCardGlow}
              >
                <span>{number}</span>
                <div className="process-line">
                  <i />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="sobre" className="section shell">
          <div className="about-institutional">
            <div className="about-intro" data-reveal>
              <div className="about-intro__header">
                <p className="kicker">SOBRE A NEXO.CODE</p>
                <span>N/C — INSTITUCIONAL</span>
              </div>
              <div className="about-intro__content">
                <h2>
                  Tecnologia, estratégia e compromisso{" "}
                  <span>com o seu negócio.</span>
                </h2>
                <div>
                  <p>
                    A Nexo.Code nasceu com o propósito de desenvolver soluções
                    digitais que ajudem empresas a construir uma presença online
                    profissional, fortalecer suas marcas e criar novas
                    oportunidades de negócio.
                  </p>
                  <p>
                    Nossa atuação combina desenvolvimento web, planejamento e
                    atenção à experiência do usuário, com foco em soluções
                    alinhadas às necessidades de cada cliente.
                  </p>
                </div>
              </div>
            </div>

            <article className="about-founder" data-reveal>
              <div className="about-founder__photo">
                <img
                  src={`${homeHref}founder/arthur-mariano.webp`}
                  alt="Arthur Mariano, fundador e CEO da Nexo.Code."
                  width="1448"
                  height="1086"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-founder__content">
                <p className="kicker">LIDERANÇA & VISÃO</p>
                <div className="about-founder__identity">
                  <h3>Arthur Mariano</h3>
                  <span>Fundador & CEO da Nexo.Code</span>
                </div>
                <div className="about-founder__bio">
                  <p>
                    Arthur Mariano é o fundador e CEO da Nexo.Code, responsável
                    pela direção estratégica da empresa, pelo desenvolvimento
                    das soluções digitais e pelo relacionamento com os clientes.
                  </p>
                  <p>
                    Sua proposta é construir uma empresa orientada à qualidade,
                    à transparência e à criação de soluções tecnológicas que
                    atendam às necessidades reais de cada negócio.
                  </p>
                </div>
                <blockquote>
                  <span>VISÃO INSTITUCIONAL</span>
                  <p>
                    “Construir soluções digitais com planejamento, transparência
                    e atenção aos detalhes, priorizando as necessidades reais de
                    cada empresa.”
                  </p>
                </blockquote>
              </div>
            </article>
          </div>
        </section>

        <section className="section shell pt-8">
          <div className="faq-layout" data-reveal>
            <div>
              <p className="kicker">PERGUNTAS FREQUENTES</p>
              <h2>
                Ainda tem
                <br />
                alguma dúvida?
              </h2>
              <p className="mt-5 max-w-sm text-mist">
                Se não encontrar sua resposta aqui, mande uma mensagem.
                Respondemos em até um dia útil.
              </p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div
                    className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                    key={faq.question}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <i>{isOpen ? "−" : "+"}</i>
                    </button>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="contato" className="cta-section">
          <div className="cta-orb" />
          <div className="shell relative z-10 text-center" data-reveal>
            <p className="kicker justify-center">
              AGENDA ABERTA PARA NOVOS PROJETOS
            </p>
            <h2>
              Sua próxima ideia
              <br />
              merece ganhar forma.
            </h2>
            <p>
              Conte sobre o momento do negócio e receba uma recomendação de
              escopo.
            </p>
            <a
              className="button button--light mt-8"
              href={`mailto:${contactEmail}`}
            >
              Solicitar diagnóstico inicial{" "}
              <Icon name="arrow" className="size-5" />
            </a>
            <span className="cta-response-note mt-5 block text-sm">
              Resposta em até 1 dia útil • Sem compromisso
            </span>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div>
            <a className="brand" href="#inicio">
              nexo<span>.</span>
            </a>
            <p>
              Sites que conectam marcas
              <br />a pessoas e resultados.
            </p>
          </div>
          <div>
            <strong>NAVEGUE</strong>
            <a href="#servicos">Serviços</a>
            <a href={storeHref}>Loja</a>
            <a href="#processo">Processo</a>
            <a href="#sobre">Sobre</a>
            <a href={`${homeHref}privacidade.html`}>Privacidade</a>
          </div>
          <div>
            <strong>CONTATO</strong>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Conversar com a Nexo Code pelo WhatsApp"
            >
              +55 (94) 99116-4544
            </a>
            <span>Em todo território nacional.</span>
          </div>
          <div>
            <strong>SOCIAL</strong>
            <a
              href="https://www.instagram.com/nexocodebrasil/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} Nexo.Code. Todos os direitos reservados.</span>
          <span>Feito com estratégia, café e boas ideias.</span>
        </div>
      </footer>
    </div>
  )
}

function isStoreRoute() {
  const basePath = import.meta.env.BASE_URL.replace(/\/+$/, "")
  const currentPath = window.location.pathname
    .slice(basePath.length)
    .replace(/\/+$/, "")
  return window.location.hash === "#/loja" || currentPath === "/loja"
}

function App() {
  const [isStore, setIsStore] = useState(isStoreRoute)
  const [transition, setTransition] = useState<"idle" | "out" | "in">("idle")
  const transitionRef = useRef<"idle" | "out" | "in">("idle")
  const timers = useRef<number[]>([])
  const navigateRef = useRef<(href: string) => void>(() => {})

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }
  navigateRef.current = (href: string) => {
    if (transitionRef.current !== "idle") return
    const target = new URL(href, location.href)
    const toStore = target.hash.startsWith("#/loja")
    if (toStore === isStoreRoute()) {
      // Keep normal in-page anchor behavior if no full route change is needed.
      location.assign(target.href)
      return
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      history.pushState({}, "", target.pathname + target.search + target.hash)
      setIsStore(toStore)
      window.dispatchEvent(new Event("nexo:route-change"))
      window.scrollTo(0, 0)
      return
    }
    transitionRef.current = "out"
    window.dispatchEvent(new CustomEvent("nexo:transition",{detail:"out"}))
    setTransition("out")
    timers.current.push(window.setTimeout(() => {
      history.pushState({}, "", target.pathname + target.search + target.hash)
      setIsStore(toStore)
      window.dispatchEvent(new Event("nexo:route-change"))
      window.scrollTo(0, 0)
      transitionRef.current = "in"
      window.dispatchEvent(new CustomEvent("nexo:transition",{detail:"in"}))
      setTransition("in")
      if (!toStore && target.hash && !target.hash.startsWith("#/")) {
        timers.current.push(window.setTimeout(() => {
          document.querySelector(target.hash)?.scrollIntoView({ behavior: "smooth" })
        }, 180))
      }
      timers.current.push(window.setTimeout(() => {
        transitionRef.current = "idle"
        window.dispatchEvent(new CustomEvent("nexo:transition",{detail:"idle"}))
        setTransition("idle")
      }, 860))
    }, 610))
  }

  useEffect(() => {
    const syncRoute = () => {
      clearTimers()
      transitionRef.current = "idle"
      setTransition("idle")
      setIsStore(isStoreRoute())
      window.dispatchEvent(new Event("nexo:route-change"))
    }
    const intercept = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!(event.target instanceof Element)) return
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]")
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return
      const next = new URL(anchor.href, window.location.href)
      if (next.origin !== window.location.origin) return
      const fromStore = isStoreRoute()
      const toStore = next.hash.startsWith("#/loja")
      if (fromStore === toStore) return
      event.preventDefault()
      navigateRef.current(next.href)
    }
    window.addEventListener("hashchange", syncRoute)
    window.addEventListener("popstate", syncRoute)
    document.addEventListener("click", intercept, true)
    return () => {
      clearTimers()
      window.removeEventListener("hashchange", syncRoute)
      window.removeEventListener("popstate", syncRoute)
      document.removeEventListener("click", intercept, true)
    }
  }, [])

  return (
    <>
      <MatterEngine />
      <CursorTrail />
      <IntroSequence />
      <StudioNavigation />
      <SoundToggle />
      {isStore ? <StorePage /> : <LandingPage />}
      <KineticTypography key={isStore ? "store-typography" : "home-typography"} />
      <PageDepth key={isStore ? "store-depth" : "home-depth"} />
      <div className={`nexo-page-transition nexo-page-transition--${transition}`}
        role="presentation" aria-hidden="true">
        <div className="nexo-page-transition__surface" />
        <div className="nexo-page-transition__halo" />
        <div className="nexo-page-transition__symbol">nexo<span>.</span></div>
        <div className="nexo-page-transition__micro">TRANSFORMANDO IDEIAS EM PRESENÇA DIGITAL</div>
      </div>
    </>
  )
}

export default App
