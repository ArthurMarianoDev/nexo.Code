/**
 * Real static pre-rendering for Nexo.Code. Builds the actual React App routes
 * with ReactDOMServer and rehydrates the identical markup in the browser.
 * No crawler-only or hidden duplicate content, no new runtime dependency.
 *
 * Runs AFTER Vite's client build, preserving the generated hashed asset links.
 */
import React from "react"
import { renderToString } from "react-dom/server"
import { createServer } from "vite"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const ORIGIN = "https://nexo-code.pages.dev"
const HOME_URL = ORIGIN + "/"
const SHOP_URL = ORIGIN + "/loja/"
const LOGO = ORIGIN + "/social/nexo-profile.png"

const pages = [
  {
    path: "/",
    destination: "index.html",
    title: "Criação de Sites Profissionais e Landing Pages | Nexo.Code",
    description: "Criação de sites profissionais, landing pages e experiências digitais exclusivas. Conheça os serviços da Nexo.Code e solicite um projeto.",
    url: HOME_URL,
    type: "WebPage",
  },
  {
    path: "/loja/",
    destination: "loja/index.html",
    title: "Criação de Sites: Pacotes e Valores | Nexo.Code",
    description: "Conheça os pacotes de criação de sites da Nexo.Code: Landing Essencial, Site Profissional e Experiência Premium. Confira valores e solicite proposta.",
    url: SHOP_URL,
    type: "CollectionPage",
  },
]

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char])

const structuredData = (page) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": HOME_URL + "#organization",
      "name": "Nexo.Code",
      "url": HOME_URL,
      "logo": LOGO,
      "email": "nexocodebrasil@gmail.com",
      "contactPoint": [{
        "@type": "ContactPoint",
        "contactType": "sales",
        "telephone": "+55-94-99116-4544",
        "availableLanguage": ["Portuguese"],
        "url": "https://wa.me/5594991164544",
      }],
      "sameAs": ["https://www.instagram.com/nexocodebrasil/"],
    },
    {
      "@type": "WebSite",
      "@id": HOME_URL + "#website",
      "name": "Nexo.Code",
      "url": HOME_URL,
      "inLanguage": "pt-BR",
      "publisher": { "@id": HOME_URL + "#organization" },
    },
    {
      "@type": page.type,
      "@id": page.url + "#webpage",
      "name": page.title,
      "description": page.description,
      "url": page.url,
      "inLanguage": "pt-BR",
      "isPartOf": { "@id": HOME_URL + "#website" },
      "about": { "@id": HOME_URL + "#organization" },
    },
    {
      "@type": "Service",
      "name": "Criação de sites e landing pages profissionais",
      "serviceType": "Desenvolvimento de sites profissionais e landing pages",
      "provider": { "@id": HOME_URL + "#organization" },
      "areaServed": { "@type": "Country", "name": "Brasil" },
      "url": SHOP_URL,
    },
  ],
})

function decorate(documentHtml, page, bodyHtml) {
  // Vite's Figma metadata is intentionally generic. Replace, rather than
  // duplicate, the primary tags on BOTH static route documents.
  let html = documentHtml
    .replace(/<title>[\s\S]*?<\/title>/i, "<title>" + escapeHtml(page.title) + "</title>")
    .replace(/\s*<meta\s+name="description"[^>]*>/gi, "")
    .replace(/\s*<meta\s+property="og:title"[^>]*>/gi, "")
    .replace(/\s*<meta\s+property="og:description"[^>]*>/gi, "")
    .replace(/\s*<meta\s+property="og:image"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="twitter:card"[^>]*>/gi, "")
    .replace(/\s*<meta\s+name="twitter:image"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "")

  const data = JSON.stringify(structuredData(page)).replace(/</g, "\\u003c")
  const tags = [
    '<meta name="description" content="' + escapeHtml(page.description) + '">',
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    '<link rel="canonical" href="' + page.url + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Nexo.Code">',
    '<meta property="og:locale" content="pt_BR">',
    '<meta property="og:title" content="' + escapeHtml(page.title) + '">',
    '<meta property="og:description" content="' + escapeHtml(page.description) + '">',
    '<meta property="og:url" content="' + page.url + '">',
    '<meta property="og:image" content="' + LOGO + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + escapeHtml(page.title) + '">',
    '<meta name="twitter:description" content="' + escapeHtml(page.description) + '">',
    '<meta name="twitter:image" content="' + LOGO + '">',
    '<script type="application/ld+json">' + data + '</script>',
  ].join("\n")
  html = html.replace("</head>", tags + "\n</head>")
  if (!html.includes('<div id="root"></div>')) {
    throw new Error("Vite HTML mount point missing; aborting SEO pre-render")
  }
  html = html.replace('<div id="root"></div>', '<div id="root">' + bodyHtml + '</div>')
  return html
}

const template = await readFile("dist/index.html", "utf8")
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  logLevel: "error",
})

try {
  const { default: App } = await server.ssrLoadModule("/src/App.tsx")
  for (const page of pages) {
    // App's initial route state requires a location; no client effects run
    // during renderToString, so no browser DOM is needed in Node.
    globalThis.window = {
      location: { pathname: page.path, hash: "", search: "", href: page.url },
    }
    const bodyHtml = renderToString(React.createElement(React.StrictMode, null, React.createElement(App)))
    if (!bodyHtml.includes("<h1")) {
      throw new Error("SSR failed to produce semantic page content: " + page.path)
    }
    const output = decorate(template, page, bodyHtml)
    const destination = join("dist", page.destination)
    await mkdir(join(destination, ".."), { recursive: true })
    await writeFile(destination, output, "utf8")
    console.log("SEO prerender:", page.path, "->", destination, "(", bodyHtml.length, "chars of real HTML )")
  }
} finally {
  delete globalThis.window
  await server.close()
}
