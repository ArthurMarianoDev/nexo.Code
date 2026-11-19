import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "./editorial.css"
import "./digital-matter.css"
import "./kinetic.css"
import "./immersive-v2.css"
import "./motion-refinements.css"
import "./beyond-interface.css"
import "./matter-engine-v3.css"

const root = document.getElementById("root")!
const content = <React.StrictMode><App /></React.StrictMode>

// Hydrate the real prerendered homepage and shop instead of erasing their HTML.
// The Figma preview and Vite dev server still mount the empty container.
if (root.hasChildNodes() && !window.location.hash.startsWith("#/loja")) {
  ReactDOM.hydrateRoot(root, content)
} else {
  ReactDOM.createRoot(root).render(content)
}
