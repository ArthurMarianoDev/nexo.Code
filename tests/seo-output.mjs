import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const read = path => readFileSync(join(process.cwd(), path), "utf8")
const home = read("dist/index.html")
const shop = read("dist/loja/index.html")
const projects = read("dist/projetos/index.html")
const base = "https://nexo-code.pages.dev"

test("home, store and projects have unique correct metadata and canonical URLs", () => {
  assert.match(home, /<title>Criação de Sites Profissionais e Landing Pages \| Nexo\.Code<\/title>/)
  assert.match(shop, /<title>Criação de Sites: Pacotes e Valores \| Nexo\.Code<\/title>/)
  assert.match(home, /<link rel="canonical" href="https:\/\/nexo-code\.pages\.dev\/">/)
  assert.match(shop, /<link rel="canonical" href="https:\/\/nexo-code\.pages\.dev\/loja\/">/)
  assert.ok(projects.includes('<title>Projetos Autorais e Experiências Digitais | Nexo.Code</title>'))
  assert.ok(projects.includes('<link rel="canonical" href="https://nexo-code.pages.dev/projetos/">'))
  for (const html of [home, shop, projects]) {
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1)
    assert.equal((html.match(/name="description"/g) ?? []).length, 1)
    assert.equal((html.match(/property="og:title"/g) ?? []).length, 1)
    assert.match(html, /property="og:image"/)
    assert.match(html, /name="twitter:card"/)
    assert.match(html, /name="robots" content="index,follow/)
  }
})

test("both route documents ship real SSR content before any JavaScript", () => {
  for (const [page, html] of [["home", home], ["shop", shop], ["projects", projects]]) {
    assert.match(html, /<div id="root">[\s\S]+?<h1/, "Missing pre-rendered H1: " + page)
    assert.match(html, /<div id="root">[\s\S]+?<main/, "Missing pre-rendered main: " + page)
    assert.match(html, /type="module"/)
  }
  assert.match(projects, /Ideias que não/)
  assert.match(projects, /AUREA RESIDENCES/)
  assert.match(projects, /VOLTÉRRA/)
  assert.match(projects, /E-commerce de eletrônicos/)
  assert.ok(projects.includes("https://aurea-residences-6s0.pages.dev/"))
  assert.match(home, /O digital não/)
  assert.match(shop, /Landing Essencial/)
  assert.match(shop, /Site Profissional/)
  assert.match(shop, /Experiência Premium/)
  assert.match(shop, /R\$ 2\.490/)
  assert.match(shop, /R\$ 5\.900/)
})

test("schema.org JSON-LD is valid and never invents client reviews", () => {
  for (const html of [home, shop, projects]) {
    const match = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)
    assert.ok(match, "Missing JSON-LD")
    const data = JSON.parse(match[1])
    const graph = data["@graph"]
    for (const type of ["Organization", "WebSite", "WebPage", "Service"]) {
      if (type === "WebPage" && html !== home) continue
      assert.ok(graph.some(node => node["@type"] === type), type + " not found")
    }
    assert.ok(graph.some(node => node["@type"] === (html === home ? "WebPage" : "CollectionPage")))
    assert.ok(!html.includes('"aggregateRating"'))
    assert.ok(!html.includes('"review"'))
  }
})

test("robots and sitemap expose only the canonical public destinations", () => {
  assert.ok(existsSync("dist/robots.txt"))
  assert.ok(existsSync("dist/sitemap.xml"))
  const robots=read("dist/robots.txt")
  const sitemap=read("dist/sitemap.xml")
  assert.match(robots,/Allow: \/$/m)
  assert.match(robots,/Sitemap: https:\/\/nexo-code\.pages\.dev\/sitemap\.xml/)
  assert.ok(sitemap.includes(base + "/"))
  assert.ok(sitemap.includes(base + "/loja/"))
  assert.ok(sitemap.includes(base + "/projetos/"))
  assert.doesNotMatch(sitemap,/#\/loja/)
})
