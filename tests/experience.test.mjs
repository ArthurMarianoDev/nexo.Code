import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const src = path => readFileSync(join(process.cwd(), path), "utf8")
const app = src("src/App.tsx")
const shaders = src("src/components/MatterEngine.tsx")
const experience = src("src/components/ImmersiveExperiences.tsx")
const styles = src("src/immersive-v2.css")
const entry = src("src/main.tsx")

test("commercial data and contact routes remain intact", () => {
  for (const value of [
    "Landing Essencial", "Site Profissional", "Experiência Premium",
    "R$ 2.490", "R$ 5.900", "R$ 9.800",
    "R$ 830", "R$ 1.475", "50% DE DESCONTO",
    "nexocodebrasil@gmail.com", "5594991164544",
    "instagram.com/nexocodebrasil",
  ]) assert.ok(app.includes(value), `Missing commercial content: ${value}`)
})

test("all interactive experience components are wired", () => {
  for (const value of ["<MatterEngine", "<ScrollArtifact", "<NexoLab", "<PackageMorph",
    "<CursorTrail", "<IntroSequence", "<KineticTypography", "<PageDepth", "nexo-page-transition"]) {
    assert.ok(app.includes(value), `Missing integration: ${value}`)
  }
  assert.match(experience, /aria-pressed=/)
  assert.match(experience, /prefers-reduced-motion/)
})

test("WebGL artwork has reduced motion and fallback", () => {
  assert.match(shaders,/webgl2/)
  assert.match(shaders,/matter-engine--fallback/)
  assert.match(shaders,/prefers-reduced-motion/)
  assert.match(shaders,/uScroll/)
})

test("visual system is imported, responsive and respects motion preferences", () => {
  for(const stylesheet of ["digital-matter.css","kinetic.css","immersive-v2.css","motion-refinements.css","matter-engine-v3.css"]) {
    assert.ok(entry.includes(stylesheet), `Stylesheet not imported: ${stylesheet}`)
  }
  assert.match(styles,/@media\(max-width:/)
  assert.match(styles,/@media\(prefers-reduced-motion:reduce\)/)
})

test("pricing cards do not disappear on pointer hover", () => {
  assert.doesNotMatch(app, /onPointerEnter=\{\(\) => setPreviewPackage/)
  const markup = app.slice(app.indexOf('className={`pricing-card'), app.indexOf('className={`pricing-card') + 500)
  assert.doesNotMatch(markup, /data-reveal/)
  const css = src("src/immersive-v2.css")
  assert.match(css, /\.pricing-grid \.pricing-card:hover/)
  assert.match(css, /opacity:1!important/)
  assert.doesNotMatch(experience, /\.about-founder__photo,\.pricing-card/)
})

test("CTA response-time text is solid black on bright green", () => {
  assert.match(app,/className="cta-response-note/)
  const css = src("src/motion-refinements.css")
  assert.match(css,/\.cta-section \.cta-response-note/)
  assert.match(css,/color:#0a0d0f!important/)
})

test("original experience remains accessible from both pages", () => {
  for (const key of ["<NexoLab", "<PackageMorph", "<IntroSequence", "<KineticTypography",
    "<CursorTrail", "<MatterEngine", "<ScrollArtifact", "nexo-page-transition"]) {
    assert.ok(app.includes(key), `Experience component missing: ${key}`)
  }
})

test("persistent studio systems render with safeguards", () => {
  const studio = src("src/components/StudioSystems.tsx")
  const css = src("src/beyond-interface.css")
  for(const value of ["<MatterEngine", "<StudioNavigation", "<SoundToggle"]) assert.ok(app.includes(value))
  for(const value of ["visibilitychange", "prefers-reduced-motion", "aria-expanded", "aria-pressed", "pointer-events:none", "mix-blend-mode:screen"]) {
    assert.ok((studio+css).includes(value), `Expected studio safeguard: ${value}`)
  }
  assert.match(css, /@media\(max-width:767px\)/)
  assert.match(src("src/main.tsx"), /beyond-interface.css/)
})

test("Cloudflare static assets publish security headers", () => {
  const headers = src("public/_headers")
  for (const name of ["Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy",
    "X-Frame-Options", "Permissions-Policy", "Content-Security-Policy-Report-Only"]) {
    assert.ok(headers.includes(name + ":"), "Missing header: " + name)
  }
  assert.match(headers,/script-src 'self'/)
  assert.match(headers,/object-src 'none'/)
})

test("form inputs bound lengths and privacy notice", () => {
  assert.ok(app.includes('name="name"\n              maxLength={100}'))
  assert.ok(app.includes('name="email"\n              maxLength={254}'))
  assert.ok(app.includes('maxLength={22}'))
  assert.ok(app.includes('maxLength={1200}'))
  assert.match(app,/Política de Privacidade/)
  assert.match(app,/privacidade.html/)
  const privacy = src("public/privacidade.html")
  assert.match(privacy,/LGPD/)
  assert.match(privacy,/WhatsApp/)
  assert.match(privacy,/nexocodebrasil@gmail.com/)
})

test("CI audits runtime dependencies and Dependabot is configured", () => {
  assert.match(src(".github/workflows/verify-design.yml"),/npm audit --omit=dev --audit-level=high/)
  const dep = src(".github/dependabot.yml")
  assert.match(dep,/package-ecosystem: npm/)
  assert.match(dep,/package-ecosystem: github-actions/)
})

test("all six visual pillars are connected in the rendered application",()=>{
  const engine=src("src/components/MatterEngine.tsx")
  const lab=src("src/components/LabSimulations.tsx")
  const art=src("src/matter-engine-v3.css")
  assert.match(app,/studio-manifesto-title/)
  assert.match(app,/store-hero--cinematic/)
  assert.match(app,/<MatterEngine/)
  assert.doesNotMatch(app,/<SignalMatter/)
  assert.match(experience,/nexo:package-change/)
  assert.match(experience,/Constelação/)
  assert.match(experience,/<LabSimulations/)
  assert.match(engine,/canvas\.getContext\("webgl2"/)
  assert.match(engine,/uniform float uScroll/)
  assert.match(engine,/uniform float uScene/)
  assert.match(engine,/uniform float uPackage/)
  assert.match(engine,/uniform float uTransition/)
  assert.match(engine,/getNormal\(vec3 p\)/)
  assert.match(engine,/float fresnel=/)
  assert.match(engine,/transitionMix/)
  assert.match(engine,/nexo:route-change/)
  assert.match(engine,/webglcontextlost/)
  assert.match(engine,/prefers-reduced-motion/)
  assert.match(art,/studio-manifesto/)
  assert.match(art,/store-hero--cinematic/)
  assert.match(art,/matter-engine\[data-chapter="services"\]/)
  assert.match(art,/matter-engine\[data-chapter="store"\]/)
  assert.match(art,/\.pricing-card,.pricing-card:hover/)
  for(const mode of ["field","optics","ribbon","type","constellation"])assert.ok(lab.includes('mode==="'+mode+'"'),"Missing interactive Lab mode: "+mode)
})

test("the full manifesto headline remains readable on small screens", () => {
  const css = src("src/matter-engine-v3.css")
  assert.match(app,/studio-manifesto__line">Não criamos/)
  assert.match(app,/studio-manifesto__line">mais do mesmo\./)
  assert.match(app,/Criamos o <strong>próximo\.<\/strong>/)
  assert.match(css,/studio-manifesto h2\.studio-manifesto__title/)
  assert.match(css,/animation:none!important;clip-path:none!important/)
  assert.match(css,/@media\(max-width:350px\)/)
  assert.match(css,/\.studio-manifesto__line::after\{content:none!important\}/)
})

test("silk cursor uses smooth hiDPI vector paths with a safe pixel budget", () => {
  const cursor = src("src/components/CursorTrail.tsx")
  assert.match(cursor,/new Path2D\(\)/)
  assert.match(cursor,/quadraticCurveTo/)
  assert.match(cursor,/createLinearGradient/)
  assert.match(cursor,/devicePixelRatio/)
  assert.match(cursor,/3800000/)
  assert.match(cursor,/prefers-reduced-motion/)
  assert.match(cursor,/pointer:\\s*fine/)
  assert.match(cursor,/pointer-events:none|className="nexo-cursor-trail"/)
})

test("every prominent contact CTA opens the same purchase lead form", () => {
  const calls = [...app.matchAll(/data-contact-form="/g)]
  assert.equal(calls.length, 6, "Expected six unified lead CTA triggers across home and shop")
  assert.match(app, /a\[data-contact-form\]/)
  assert.match(app, /setContactRequest\(contactTrigger\.dataset\.contactForm/)
  assert.match(app, /<PurchaseForm\s+packageName=\{contactRequest\}/)
  assert.match(app, /general \? `Interesse:/)
  assert.match(app, /general \? `Interesse: \$\{packageName\}` : `Pacote:/)
  assert.match(app, /<PurchaseForm\s+packageName=\{selectedPackage\}/)
  assert.match(app, /noopener,noreferrer/)
})

test("coalesced pointer events and dense interpolation prevent jagged cursor paths", () => {
  const cursor = src("src/components/CursorTrail.tsx")
  assert.match(cursor, /getCoalescedEvents/)
  assert.match(cursor, /Math\.ceil\(distance \/ 2\.8\)/)
  assert.match(cursor, /quadraticCurveTo/)
  assert.match(cursor, /MAX_POINTS = 165/)
  assert.match(cursor, /TRAIL_MS = 475/)
  assert.match(cursor, /devicePixelRatio/)
  assert.match(cursor, /3800000/)
  assert.match(cursor, /prefers-reduced-motion:reduce/)
  assert.match(cursor, /pointer:fine/)
  assert.match(cursor, /visibilitychange/)
})
