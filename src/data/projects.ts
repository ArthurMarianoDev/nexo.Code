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
      "Plataforma imobiliária conceitual com curadoria de 12 residências fictícias, catálogo pesquisável, filtros, galerias, favoritos, comparador e área administrativa com integração Supabase.",
    services: ["Direção de arte", "Catálogo e filtros", "React + Supabase"],
    stage: "published",
    liveUrl: "https://aurea-residences-6s0.pages.dev/",
    cover: null,
    tone: "champagne",
  },
  {
    slug: "volterra",
    name: "VOLTÉRRA",
    eyebrow: "02 / COMMERCE EXPERIENCE",
    category: "E-commerce de eletrônicos",
    year: "2026",
    description:
      "Loja conceitual de tecnologia com identidade editorial, catálogo demonstrativo de 91 produtos em 11 categorias, busca, filtros, favoritos, carrinho e checkout de demonstração — sem pagamentos reais.",
    services: ["E-commerce", "Design editorial", "React + TypeScript"],
    stage: "development",
    liveUrl: null,
    cover: null,
    tone: "cyan",
  },
]
