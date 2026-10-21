import { useEffect, useState } from "react";

type IconName =
  | "arrow"
  | "check"
  | "code"
  | "design"
  | "growth"
  | "menu"
  | "spark"
  | "x";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    code: <><path d="m8 9-3 3 3 3" /><path d="m16 9 3 3-3 3" /><path d="m14 5-4 14" /></>,
    design: <><path d="M12 3 4 7l8 4 8-4-8-4Z" /><path d="m4 12 8 4 8-4" /><path d="m4 17 8 4 8-4" /></>,
    growth: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-5 3 3 5-7" /></>,
    menu: <><path d="M4 8h16" /><path d="M4 16h16" /></>,
    spark: <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" />,
    x: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
  };

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
  );
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
];

const projects = [
  {
    category: "SAÚDE & BEM-ESTAR",
    title: "Clínica Aurea",
    result: "+184% em agendamentos",
    tone: "aurea",
    headline: "Cuidar é estar presente.",
    description:
      "Site institucional com uma jornada acolhedora e agendamento simplificado para uma clínica multidisciplinar.",
    services: ["Estratégia", "UI Design", "Desenvolvimento"],
    year: "2025",
    url: "https://example.com",
  },
  {
    category: "TECNOLOGIA B2B",
    title: "Nuvem OS",
    result: "3.2x mais conversões",
    tone: "nuvem",
    headline: "Sua operação. Sem limites.",
    description:
      "Landing page de produto que traduz uma plataforma complexa em uma proposta clara, visual e convincente.",
    services: ["Copywriting", "UI Design", "Desenvolvimento"],
    year: "2025",
    url: "https://example.com",
  },
  {
    category: "ARQUITETURA",
    title: "Forma Studio",
    result: "+96% em leads qualificados",
    tone: "forma",
    headline: "Espaços que respiram.",
    description:
      "Portfólio editorial criado para valorizar projetos autorais e transformar visitas em novas oportunidades.",
    services: ["Direção de arte", "UX Design", "Desenvolvimento"],
    year: "2024",
    url: "https://example.com",
  },
  {
    category: "MODA & LIFESTYLE",
    title: "Mono Objects",
    result: "+72% no ticket médio",
    tone: "mono",
    headline: "Menos ruído. Mais essência.",
    description:
      "E-commerce minimalista com foco no produto, na história da marca e em uma compra sem distrações.",
    services: ["E-commerce", "UI Design", "Desenvolvimento"],
    year: "2024",
    url: "https://example.com",
  },
  {
    category: "FINTECH",
    title: "Pulso",
    result: "2.8x mais cadastros",
    tone: "pulso",
    headline: "Seu dinheiro em movimento.",
    description:
      "Experiência digital direta e humana para apresentar uma nova forma de organizar a vida financeira.",
    services: ["Estratégia", "Produto digital", "Motion"],
    year: "2024",
    url: "https://example.com",
  },
  {
    category: "GASTRONOMIA",
    title: "Casa Ocre",
    result: "+134% em reservas",
    tone: "ocre",
    headline: "Sabores para ficar na memória.",
    description:
      "Site sensorial para restaurante autoral, conectando cardápio, ambiente e reserva em poucos passos.",
    services: ["Direção de arte", "UX Design", "Desenvolvimento"],
    year: "2023",
    url: "https://example.com",
  },
];

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
];

function ProjectVisual({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <div className={`project-visual project-visual--${project.tone}`}>
      <div className="project-window">
        <div className="project-window__bar"><span /><span /><span /></div>
        <div className="project-window__content">
          <div className="project-mini-nav" />
          <div className="project-copy">
            <span>{project.category}</span>
            <strong>{project.headline}</strong>
            <i />
          </div>
          <div className="project-shape" />
        </div>
      </div>
    </div>
  );
}

function PortfolioPage() {
  useEffect(() => {
    document.title = "Portfólio — Nexo Studio";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-electric selection:text-ink">
      <header className="site-header site-header--scrolled">
        <nav className="shell flex h-20 items-center justify-between" aria-label="Navegação do portfólio">
          <a className="brand" href="/" aria-label="Nexo, página inicial">
            nexo<span>.</span>
          </a>
          <a className="portfolio-back" href="/">
            <span aria-hidden="true">←</span> Voltar para o início
          </a>
          <a className="button button--small hidden sm:inline-flex" href="/#contato">
            Começar projeto
            <Icon name="arrow" className="size-4" />
          </a>
        </nav>
      </header>

      <main>
        <section className="portfolio-hero">
          <div className="orb orb--one" />
          <div className="shell relative z-10">
            <div className="eyebrow reveal">
              <span className="eyebrow-dot" />
              PORTFÓLIO NEXO
            </div>
            <div className="portfolio-hero__heading">
              <h1 className="reveal reveal--delay-1">
                Projetos que viram<br /><span>resultado.</span>
              </h1>
              <p className="reveal reveal--delay-2">
                Uma seleção de experiências digitais pensadas como produtos:
                bonitas, funcionais e construídas para alcançar objetivos reais.
              </p>
            </div>
            <div className="portfolio-summary reveal reveal--delay-3">
              <span>Sites institucionais</span>
              <span>Landing pages</span>
              <span>E-commerce</span>
              <strong>{String(projects.length).padStart(2, "0")} projetos selecionados</strong>
            </div>
          </div>
        </section>

        <section className="portfolio-section">
          <div className="shell portfolio-grid">
            {projects.map((project, index) => (
              <a
                className="portfolio-card"
                href={project.url}
                target="_blank"
                rel="noreferrer"
                key={project.title}
                aria-label={`Abrir projeto ${project.title} em uma nova aba`}
              >
                <div className="portfolio-card__visual">
                  <ProjectVisual project={project} />
                  <span className="portfolio-card__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="portfolio-card__open">
                    Abrir projeto <Icon name="arrow" className="size-4" />
                  </span>
                </div>
                <div className="portfolio-card__header">
                  <div>
                    <p>{project.category}</p>
                    <h2>{project.title}</h2>
                  </div>
                  <span>{project.year}</span>
                </div>
                <p className="portfolio-card__description">{project.description}</p>
                <div className="portfolio-card__meta">
                  <div>{project.services.map((service) => <span key={service}>{service}</span>)}</div>
                  <strong>{project.result}</strong>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="portfolio-cta">
          <div className="shell">
            <p className="kicker">SEU PROJETO PODE SER O PRÓXIMO</p>
            <h2>Vamos construir algo<br />que dá orgulho de mostrar?</h2>
            <a className="button" href="mailto:ola@nexo.studio">
              Falar sobre meu projeto <Icon name="arrow" className="size-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="shell footer-bottom">
          <span>© 2025 Nexo Studio. Todos os direitos reservados.</span>
          <a href="/">nexo<span>.</span></a>
        </div>
      </footer>
    </div>
  );
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-electric selection:text-ink">
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <nav className="shell flex h-20 items-center justify-between" aria-label="Navegação principal">
          <a className="brand" href="#inicio" onClick={closeMenu} aria-label="Nexo, início">
            nexo<span>.</span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            <a className="nav-link" href="#servicos">Serviços</a>
            <a className="nav-link" href="#projetos">Projetos</a>
            <a className="nav-link" href="#processo">Processo</a>
            <a className="nav-link" href="#sobre">Sobre</a>
          </div>

          <a className="button button--small hidden md:inline-flex" href="#contato">
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
            {["servicos", "projetos", "processo", "sobre"].map((item) => (
              <a key={item} href={`#${item}`} onClick={closeMenu}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
            <a className="button mt-3 justify-center" href="#contato" onClick={closeMenu}>
              Começar projeto
            </a>
          </div>
        )}
      </header>

      <main>
        <section id="inicio" className="hero-grid relative overflow-hidden pt-32 md:pt-44">
          <div className="orb orb--one" />
          <div className="orb orb--two" />
          <div className="shell relative z-10">
            <div className="eyebrow reveal">
              <span className="eyebrow-dot" />
              DESIGN + TECNOLOGIA + ESTRATÉGIA
            </div>
            <h1 className="hero-title reveal reveal--delay-1">
              Seu negócio merece
              <br />
              um site que <span>vende.</span>
            </h1>
            <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
              <p className="max-w-xl text-lg leading-relaxed text-mist reveal reveal--delay-2 md:text-xl">
                Criamos experiências digitais estratégicas para marcas que querem
                crescer, converter mais e parecer tão boas quanto realmente são.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row reveal reveal--delay-3">
                <a className="button" href="#contato">
                  Quero um site incrível
                  <Icon name="arrow" className="size-5" />
                </a>
                <a className="button button--ghost" href="#projetos">
                  Ver projetos
                </a>
              </div>
            </div>

            <div className="browser-stage reveal reveal--delay-3" aria-label="Exemplo de projeto digital">
              <div className="browser-top">
                <div className="flex gap-2">
                  <span /><span /><span />
                </div>
                <div className="browser-url">nexo.studio/projeto</div>
                <span className="browser-action" />
              </div>
              <div className="browser-body">
                <div className="mock-nav">
                  <strong>mono.</strong>
                  <div><span /><span /><span /></div>
                  <b>Explorar</b>
                </div>
                <div className="mock-content">
                  <p>COLEÇÃO 2025</p>
                  <div className="mock-heading">Menos ruído.<br />Mais essência.</div>
                  <div className="mock-cta">Conheça a coleção <Icon name="arrow" className="size-4" /></div>
                </div>
                <div className="mock-object">
                  <div className="mock-object__glow" />
                  <div className="mock-object__card">MONO<br /><span>OBJECTS</span></div>
                </div>
                <div className="floating-tag">
                  <Icon name="spark" className="size-4 text-electric" />
                  Design que converte
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div><strong>+48</strong><span>projetos entregues</span></div>
              <div><strong>7 anos</strong><span>criando no digital</span></div>
              <div><strong>100%</strong><span>feito sob medida</span></div>
              <div><strong>4.9/5</strong><span>avaliação dos clientes</span></div>
            </div>
          </div>
        </section>

        <section id="servicos" className="section shell">
          <div className="section-heading">
            <div>
              <p className="kicker">O QUE FAZEMOS</p>
              <h2>Da primeira impressão<br />à decisão de compra.</h2>
            </div>
            <p>
              Unimos estratégia, design e tecnologia para construir presenças
              digitais que não passam despercebidas.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="flex items-start justify-between">
                  <div className="service-icon"><Icon name={service.icon} className="size-6" /></div>
                  <span className="service-number">{service.number}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#contato" aria-label={`Saiba mais sobre ${service.title}`}>
                  Saiba mais <Icon name="arrow" className="size-4" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="projetos" className="section border-y border-white/10 bg-charcoal">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="kicker">PROJETOS SELECIONADOS</p>
                <h2>Trabalho bonito.<br />Resultado real.</h2>
              </div>
              <a className="text-link" href="/portfolio" target="_blank" rel="noreferrer">
                Ver todos os projetos <Icon name="arrow" className="size-4" />
              </a>
            </div>

            <div className="project-list">
              {projects.slice(0, 3).map((project) => (
                <article className="project-row" key={project.title}>
                  <ProjectVisual project={project} />
                  <div className="project-info">
                    <p>{project.category}</p>
                    <h3>{project.title}</h3>
                    <div><span>RESULTADO</span><strong>{project.result}</strong></div>
                    <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Conhecer projeto ${project.title}`}>
                      Conhecer projeto <Icon name="arrow" className="size-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="processo" className="section shell">
          <div className="section-heading">
            <div>
              <p className="kicker">NOSSO PROCESSO</p>
              <h2>Simples, próximo<br />e sem surpresas.</h2>
            </div>
            <p>Você acompanha cada etapa e sabe exatamente o que está acontecendo, do briefing ao lançamento.</p>
          </div>
          <div className="process-grid">
            {[
              ["01", "Imersão", "Entendemos o negócio, o público e os objetivos para definir a direção certa."],
              ["02", "Estratégia", "Organizamos conteúdo, jornada e mensagem para guiar o visitante até a ação."],
              ["03", "Design & código", "Criamos a experiência visual e desenvolvemos tudo com precisão e performance."],
              ["04", "Lançamento", "Testamos, refinamos e colocamos seu novo site no ar com todo o suporte."],
            ].map(([number, title, description]) => (
              <article className="process-step" key={number}>
                <span>{number}</span>
                <div className="process-line"><i /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="sobre" className="section shell">
          <div className="testimonial">
            <div className="quote-mark">“</div>
            <blockquote>
              A Nexo não entregou apenas um site bonito. Eles entenderam a essência
              da nossa marca e transformaram isso em uma experiência que realmente
              traz novos clientes.
            </blockquote>
            <div className="testimonial-author">
              <div className="avatar">MC</div>
              <div><strong>Marina Costa</strong><span>Fundadora, Clínica Aurea</span></div>
            </div>
            <div className="testimonial-score">
              <span>★★★★★</span>
              <p>Projeto lançado em 21 dias</p>
            </div>
          </div>
        </section>

        <section className="section shell pt-8">
          <div className="faq-layout">
            <div>
              <p className="kicker">PERGUNTAS FREQUENTES</p>
              <h2>Ainda tem<br />alguma dúvida?</h2>
              <p className="mt-5 max-w-sm text-mist">Se não encontrar sua resposta aqui, mande uma mensagem. Respondemos em até um dia útil.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`} key={faq.question}>
                    <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                      <span>{faq.question}</span><i>{isOpen ? "−" : "+"}</i>
                    </button>
                    <div className="faq-answer"><p>{faq.answer}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contato" className="cta-section">
          <div className="cta-orb" />
          <div className="shell relative z-10 text-center">
            <p className="kicker justify-center">VAMOS CRIAR ALGO INCRÍVEL</p>
            <h2>Sua próxima fase<br />começa aqui.</h2>
            <p>Conte um pouco sobre sua ideia e receba uma proposta personalizada.</p>
            <a className="button button--light mt-8" href="mailto:ola@nexo.studio">
              Falar sobre meu projeto <Icon name="arrow" className="size-5" />
            </a>
            <span className="mt-5 block text-sm text-white/60">Resposta em até 1 dia útil • Sem compromisso</span>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div>
            <a className="brand" href="#inicio">nexo<span>.</span></a>
            <p>Sites que conectam marcas<br />a pessoas e resultados.</p>
          </div>
          <div>
            <strong>NAVEGUE</strong>
            <a href="#servicos">Serviços</a><a href="#projetos">Projetos</a><a href="#processo">Processo</a><a href="#sobre">Sobre</a>
          </div>
          <div>
            <strong>CONTATO</strong>
            <a href="mailto:ola@nexo.studio">ola@nexo.studio</a>
            <a href="tel:+5511999999999">+55 11 99999-9999</a>
            <span>São Paulo, Brasil</span>
          </div>
          <div>
            <strong>SOCIAL</strong>
            <a href="#inicio">Instagram</a><a href="#inicio">LinkedIn</a><a href="#inicio">Behance</a>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2025 Nexo Studio. Todos os direitos reservados.</span>
          <span>Feito com estratégia, café e boas ideias.</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return window.location.pathname.replace(/\/+$/, "") === "/portfolio"
    ? <PortfolioPage />
    : <LandingPage />;
}

export default App;
