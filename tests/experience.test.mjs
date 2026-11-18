import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const src = path => readFileSync(join(process.cwd(), path), "utf8")
const app = src("src/App.tsx")
const shaders = src("src/components/SignalMatter.tsx")
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
  for (const value of ["<SignalMatter", "<ScrollArtifact", "<NexoLab", "<PackageMorph",
    "<CursorTrail", "<IntroSequence", "<KineticTypography", "<PageDepth", "nexo-page-transition"]) {
    assert.ok(app.includes(value), `Missing integration: ${value}`)
  }
  assert.match(experience, /aria-pressed=/)
  assert.match(experience, /prefers-reduced-motion/)
})

test("WebGL artwork has reduced motion and fallback", () => {
  assert.match(shaders,/webgl2/)
  assert.match(shaders,/signal-matter--fallback/)
  assert.match(shaders,/prefers-reduced-motion/)
  assert.match(shaders,/uScroll/)
})

test("visual system is imported, responsive and respects motion preferences", () => {
  for(const stylesheet of ["digital-matter.css","kinetic.css","immersive-v2.css","motion-refinements.css"]) {
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
    "<CursorTrail", "<SignalMatter", "<ScrollArtifact", "nexo-page-transition"]) {
    assert.ok(app.includes(key), `Experience component missing: ${key}`)
  }
})

test("persistent studio systems render with safeguards", () => {
  const studio = src("src/components/StudioSystems.tsx")
  const css = src("src/beyond-interface.css")
  for(const value of ["<MatterContinuum", "<StudioNavigation", "<SoundToggle"]) assert.ok(app.includes(value))
  for(const value of ["visibilitychange", "prefers-reduced-motion", "aria-expanded", "aria-pressed", "pointer-events:none", "mix-blend-mode:screen"]) {
    assert.ok((studio+css).includes(value), `Expected studio safeguard: ${value}`)
  }
  assert.match(css, /@media\(max-width:767px\)/)
  assert.match(src("src/main.tsx"), /beyond-interface.css/)
})
