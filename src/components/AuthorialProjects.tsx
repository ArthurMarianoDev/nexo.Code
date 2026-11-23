import { authorialProjects } from "../data/projects"

const root = import.meta.env.BASE_URL

function ProjectVisual({ index, cover, tone, name, slug }: { index: number; cover: string | null; tone: string; name: string; slug: string }) {
  return (
    <div className={`authorial-project__visual authorial-project__visual--${tone}`}>
      {cover ? (
        <img src={`${root}${cover.replace(/^\//, "")}`} alt={`Prévia do projeto ${name}`} loading="lazy" decoding="async" />
      ) : (
        <div className="authorial-project__art" aria-hidden="true">
          <span className="authorial-project__art-orbit authorial-project__art-orbit--one" />
          <span className="authorial-project__art-orbit authorial-project__art-orbit--two" />
          <span className="authorial-project__art-monogram">{slug === "volterra" ? "V" : "A"}<span>·</span></span>
          <span className="authorial-project__art-caption">{slug === "volterra" ? "SMART ESSENTIALS" : "PRIVATE COLLECTION"} <i /> {slug === "volterra" ? "REFINED TECHNOLOGY" : "ARCHITECTURAL LIVING"}</span>
        </div>
      )}
      <span className="authorial-project__number">{String(index + 1).padStart(2, "0")} / {String(authorialProjects.length).padStart(2, "0")}</span>
      <span className="authorial-project__visual-label">NEXO.CODE — INDEPENDENT WORK</span>
    </div>
  )
}

export function AuthorialProjectsPage() {
  return (
    <div className="authorial-page">
      <header className="authorial-header">
        <a className="brand" href={root} aria-label="Nexo.Code, voltar à página inicial">nexo<span>.</span></a>
        <span className="authorial-header__edition">N/C — INDEPENDENT EDITION / 2026</span>
        <a className="authorial-header__back" href={root}>Voltar ao estúdio <span aria-hidden="true">↗</span></a>
      </header>

      <main id="conteudo" className="authorial-main">
        <section className="authorial-intro" aria-labelledby="authorial-title">
          <div className="authorial-intro__topline"><span className="authorial-status-dot" /> UM LABORATÓRIO DE IDEIAS REAIS <span>001 — PORTFÓLIO EXPERIMENTAL</span></div>
          <p className="authorial-intro__kicker">PROJETOS AUTORAIS / NEXO.CODE</p>
          <h1 id="authorial-title">Ideias que não<br /><em>pedem permissão.</em></h1>
          <div className="authorial-intro__foot">
            <p>Construímos experiências para explorar o que vem depois do convencional. Sem briefing engessado. Sem fórmulas prontas. Apenas conceito, design e engenharia em movimento.</p>
            <a href="#colecao" className="authorial-intro__explore">Explorar coleção <span aria-hidden="true">↓</span></a>
          </div>
          <span className="authorial-intro__giant" aria-hidden="true">N/C</span>
        </section>

        <section id="colecao" className="authorial-collection" aria-labelledby="authorial-collection-title">
          <div className="authorial-collection__heading">
            <div><p className="authorial-intro__kicker">CURADORIA AUTORAL</p><h2 id="authorial-collection-title">O nosso <em>próximo.</em></h2></div>
            <span>{String(authorialProjects.length).padStart(2, "0")} PROJETO{authorialProjects.length === 1 ? "" : "S"}</span>
          </div>
          <div className="authorial-projects">
            {authorialProjects.map((project, index) => (
              <article className="authorial-project" key={project.slug}>
                <ProjectVisual index={index} cover={project.cover} tone={project.tone} name={project.name} slug={project.slug} />
                <div className="authorial-project__details">
                  <div className="authorial-project__metadata">
                    <span>{project.eyebrow}</span><span>{project.year}</span>
                  </div>
                  <div>
                    <div className="authorial-project__status"><span className={`authorial-project__status-dot authorial-project__status-dot--${project.stage}`} />{project.stage === "published" ? "EXPERIÊNCIA DISPONÍVEL" : "EM DESENVOLVIMENTO"}</div>
                    <h3>{project.name}</h3>
                    <p className="authorial-project__category">{project.category}</p>
                    <p className="authorial-project__description">{project.description}</p>
                  </div>
                  <div className="authorial-project__footer">
                    <div className="authorial-project__tags">{project.services.map(tag => <span key={tag}>{tag}</span>)}</div>
                    {project.stage === "published" && project.liveUrl ? (
                      <a className="authorial-project__cta" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Explorar ${project.name} em uma nova aba`}>Explorar experiência <span aria-hidden="true">↗</span></a>
                    ) : (
                      <span className="authorial-project__coming">Projeto em criação <span aria-hidden="true">✳</span></span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="authorial-collection__disclaimer">Projetos conceituais e experimentais desenvolvidos pela Nexo.Code. Não representam contratos, clientes ou resultados comerciais.</p>
        </section>

        <section className="authorial-outro" aria-labelledby="authorial-outro-title">
          <p className="authorial-intro__kicker">AGORA É A SUA VEZ</p>
          <h2 id="authorial-outro-title">O próximo projeto<br />pode ser <em>o seu.</em></h2>
          <div><p>Quer criar algo impossível de confundir com o resto do mercado?</p><a href={`${root}#contato`} className="authorial-outro__cta">Vamos conversar <span aria-hidden="true">↗</span></a></div>
        </section>
      </main>
      <footer className="authorial-bottom"><a href={root} className="brand">nexo<span>.</span></a><span>© {new Date().getFullYear()} Nexo.Code</span><a href={`${root}privacidade.html`}>Privacidade</a></footer>
    </div>
  )
}
