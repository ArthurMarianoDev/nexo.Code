import { useEffect, useState } from "react"

type IconName = "arrow" | "check" | "clock" | "code" | "design" | "growth" | "menu" | "shield" | "spark" | "x"

function Icon({ name, className = "" }: { name: IconName className?: string }) {
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
    label: "Para validar e vender",
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
    label: "Mais escolhido",
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
    label: "Sob medida",
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

function StorePage() {
  useScrollReveal()

  useEffect(() => {
    document.title = "Loja — Nexo Studio"
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-electric selection:text-ink">
      <header className="site-header site-header--scrolled">
        <nav
          className="shell flex h-20 items-center justify-between"
          aria-label="Navegação da loja"
        >
          <a className="brand" href="/" aria-label="Nexo, página inicial">
            nexo<span>.</span>
          </a>
          <a className="portfolio-back" href="/">
            <span aria-hidden="true">←</span> Voltar para o início
          </a>
          <a
            className="button button--small hidden sm:inline-flex"
            href="/#contato"
          >
            Começar projeto
            <Icon name="arrow" className="size-4" />
          </a>
        </nav>
      </header>

      <main>
        <section className="store-hero">
          <div className="orb orb--one" />
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
                Escopos objetivos, investimento transparente e execução sênior.
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
            <div className="pricing-grid">
              {packages.map((item) => (
                <article
                  className={`pricing-card ${
                    item.featured ? "pricing-card--featured" : ""
                  }`}
                  key={item.name}
                  data-reveal
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
                  <a
                    className={`button ${item.featured ? "" : "button--ghost"}`}
                    href={`mailto:ola@nexo.studio?subject=${encodeURIComponent(item.name)}`}
                  >
                    {item.cta} <Icon name="arrow" className="size-4" />
                  </a>
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
                <article className="assurance-item" key={number} data-reveal>
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
              href="mailto:ola@nexo.studio?subject=Projeto%20personalizado"
            >
              Solicitar proposta personalizada{" "}
              <Icon name="arrow" className="size-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="shell footer-bottom">
          <span>© 2025 Nexo Studio. Todos os direitos reservados.</span>
          <a href="/">
            nexo<span>.</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  useScrollReveal()

  useEffect(() => {
    document.title = "Nexo Studio — Sites estratégicos para negócios"
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-electric selection:text-ink">
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
            <a className="nav-link nav-link--store" href="/loja">
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
            <a href="/loja" onClick={closeMenu}>
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
              DESIGN + TECNOLOGIA + ESTRATÉGIA
            </div>
            <h1 className="hero-title reveal reveal--delay-1">
              Seu site precisa
              <br />
              trabalhar pelo <span>negócio.</span>
            </h1>
            <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
              <p className="max-w-xl text-lg leading-relaxed text-mist reveal reveal--delay-2 md:text-xl">
                Estratégia, design e tecnologia para transformar sua presença
                digital em um ativo de marca, vendas e confiança.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row reveal reveal--delay-3">
                <a className="button" href="#contato">
                  Solicitar diagnóstico
                  <Icon name="arrow" className="size-5" />
                </a>
                <a className="button button--ghost" href="/loja">
                  Ver pacotes e valores
                </a>
              </div>
            </div>

            <div
              className="browser-stage reveal reveal--delay-3"
              aria-label="Método de criação da Nexo Studio"
            >
              <div className="browser-top">
                <div className="flex gap-2">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="browser-url">nexo.studio/método</div>
                <span className="browser-action" />
              </div>
              <div className="browser-body">
                <div className="mock-nav">
                  <strong>nexo.</strong>
                  <div>
                    <span />
                    <span />
                    <span />
                  </div>
                  <b>Começar</b>
                </div>
                <div className="mock-content">
                  <p>ESTRATÉGIA → DESIGN → CÓDIGO</p>
                  <div className="mock-heading">
                    Clareza para
                    <br />
                    crescer.
                  </div>
                  <div className="mock-cta">
                    Conheça nosso método{" "}
                    <Icon name="arrow" className="size-4" />
                  </div>
                </div>
                <div className="mock-object">
                  <div className="mock-object__glow" />
                  <div className="mock-object__card">
                    NEXO
                    <br />
                    <span>STUDIO DIGITAL</span>
                  </div>
                </div>
                <div className="floating-tag">
                  <Icon name="spark" className="size-4 text-electric" />
                  Design que converte
                </div>
              </div>
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

        <section id="servicos" className="section shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="kicker">O QUE FAZEMOS</p>
              <h2>
                Da primeira impressão
                <br />à decisão de compra.
              </h2>
            </div>
            <p>
              Unimos estratégia, design e tecnologia para construir presenças
              digitais que não passam despercebidas.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title} data-reveal>
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
                  Bonito por fora.
                  <br />
                  Estratégico por inteiro.
                </h2>
              </div>
              <a className="text-link" href="/loja">
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
                <article className="value-item" key={number} data-reveal>
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
              <article className="process-step" key={number} data-reveal>
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
          <div className="studio-statement" data-reveal>
            <div>
              <p className="kicker">SOBRE O STUDIO</p>
              <span className="statement-index">N/S — 01</span>
            </div>
            <h2>
              Não vendemos páginas decoradas. Construímos uma presença digital
              <span> à altura do seu negócio.</span>
            </h2>
            <div className="statement-footer">
              <p>
                A Nexo une pensamento estratégico, direção de design e
                desenvolvimento em um processo direto, próximo e criterioso.
              </p>
              <a className="button button--ghost" href="/loja">
                Ver formas de começar <Icon name="arrow" className="size-4" />
              </a>
            </div>
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
              Seu próximo site
              <br />
              começa com clareza.
            </h2>
            <p>
              Conte sobre o momento do negócio e receba uma recomendação de
              escopo.
            </p>
            <a
              className="button button--light mt-8"
              href="mailto:ola@nexo.studio"
            >
              Solicitar diagnóstico inicial{" "}
              <Icon name="arrow" className="size-5" />
            </a>
            <span className="mt-5 block text-sm text-white/60">
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
            <a href="/loja">Loja</a>
            <a href="#processo">Processo</a>
            <a href="#sobre">Sobre</a>
          </div>
          <div>
            <strong>CONTATO</strong>
            <a href="mailto:ola@nexo.studio">ola@nexo.studio</a>
            <a href="tel:+5511999999999">+55 11 99999-9999</a>
            <span>São Paulo, Brasil</span>
          </div>
          <div>
            <strong>SOCIAL</strong>
            <a href="#inicio">Instagram</a>
            <a href="#inicio">LinkedIn</a>
            <a href="#inicio">Behance</a>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2025 Nexo Studio. Todos os direitos reservados.</span>
          <span>Feito com estratégia, café e boas ideias.</span>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return window.location.pathname.replace(/\/+$/, "") === "/loja" ? (
    <StorePage />
  ) : (
    <LandingPage />
  )
}

export default App
