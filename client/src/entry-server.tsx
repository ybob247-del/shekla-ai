// Server entry used only at build time by scripts/generate-static-seo.ts.
// It renders each public route to static HTML so crawlers receive real content
// instead of an empty <div id="root">.
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

export function render(routePath: string): string {
  return renderToString(
    <Router ssrPath={routePath}>
      <App />
    </Router>,
  );
}
