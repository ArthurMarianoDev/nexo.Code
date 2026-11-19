/**
 * Catálogo público dos projetos autorais da Nexo.Code.
 * Adicione um objeto novo para publicar mais um projeto no /projetos/.
 * Não inclua credenciais, URLs privadas ou resultados fictícios.
 */
export type AuthorialProject = {
  slug: string
  name: string
  eyebrow: string
  category: string
  year: string
  description: string
  services: string[]
  stage: "development" | "published"
  /** Endereço público do projeto publicado. Deixe null durante o desenvolvimento. */
  liveUrl: string | null
  /** Imagem em /public/projects; caminho começa com /projects/. Opcional. */
  cover: string | null
  tone: "champagne" | "cyan" | "violet" | "lime"
}

export const authorialProjects: AuthorialProject[] = [
  {
    slug: "aurea-residences",
    name: "AUREA RESIDENCES",
    eyebrow: "01 / REAL ESTATE EXPERIENCE",
    category: "Plataforma imobiliária",
    year: "2026",
    description:
      "Um estudo autoral de experiência imobiliária de alto padrão: linguagem editorial, exploração de imóveis e interfaces pensadas para transformar a descoberta de propriedades.",
    services: ["Direção de arte", "Experiência digital", "Web app"],
    stage: "development",
    liveUrl: null,
    cover: null,
    tone: "champagne",
  },
]
