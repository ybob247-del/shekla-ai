import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DEFAULT_OG_IMAGE, getSeoMetadata, PUBLIC_PATHS, toAbsoluteUrl } from "../client/src/lib/seo";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, "dist", "public");
const serverEntry = path.join(rootDir, "dist", "server", "entry-server.mjs");

const ROOT_DIV = /<div id="root">[\s\S]*?<\/div>/i;
const CANONICAL_LINK = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeTitle(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function metaExpression(attribute: "name" | "property", key: string): RegExp {
  return new RegExp('(<meta\\s+' + attribute + '="' + key + '"\\s+content=")[^"]*("\\s*/?>)', "i");
}

function replaceMeta(html: string, attribute: "name" | "property", key: string, value: string): string {
  const expression = metaExpression(attribute, key);
  if (!expression.test(html)) {
    throw new Error(`Missing ${attribute} metadata for ${key} in the Vite HTML template.`);
  }
  // A replacement string would reinterpret $ sequences, so replace via a function.
  return html.replace(expression, (_match, open: string, close: string) => open + escapeHtml(value) + close);
}

function makePageHtml(template: string, routePath: string, body: string): string {
  const metadata = getSeoMetadata(routePath);
  if (!metadata.canonical) {
    throw new Error(`Cannot generate a static HTML page for ${routePath} without a canonical path.`);
  }

  const canonicalUrl = toAbsoluteUrl(metadata.canonical);

  let html = template.replace(/<title>[^<]*<\/title>/i, () => `<title>${escapeTitle(metadata.title)}</title>`);
  html = replaceMeta(html, "name", "description", metadata.description);
  html = replaceMeta(html, "name", "keywords", metadata.keywords);
  html = replaceMeta(
    html,
    "name",
    "robots",
    metadata.noIndex
      ? "noindex, nofollow"
      : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  );
  html = replaceMeta(html, "property", "og:type", metadata.ogType || "website");
  html = replaceMeta(html, "property", "og:title", metadata.title);
  html = replaceMeta(html, "property", "og:description", metadata.description);
  html = replaceMeta(html, "property", "og:url", canonicalUrl);
  html = replaceMeta(html, "property", "og:image", DEFAULT_OG_IMAGE);
  html = replaceMeta(html, "name", "twitter:title", metadata.title);
  html = replaceMeta(html, "name", "twitter:description", metadata.description);
  html = replaceMeta(html, "name", "twitter:image", DEFAULT_OG_IMAGE);

  if (!CANONICAL_LINK.test(html)) {
    throw new Error("Missing canonical link in the Vite HTML template.");
  }
  // A noindexed page claims no canonical URL of its own.
  html = html.replace(CANONICAL_LINK, () =>
    metadata.noIndex ? "" : `<link rel="canonical" href="${canonicalUrl}" />`,
  );

  if (!ROOT_DIV.test(html)) {
    throw new Error("Missing #root container in the Vite HTML template.");
  }
  return html.replace(ROOT_DIV, () => `<div id="root">${body}</div>`);
}

// Vercel serves this for any path with no matching file, with a real 404
// status. Without it the catch-all rewrite answers unknown URLs with the shell
// and a 200, which search engines read as a soft 404.
function makeNotFoundHtml(template: string, body: string): string {
  const metadata = getSeoMetadata("/__not-found__");

  let html = template.replace(/<title>[^<]*<\/title>/i, () => `<title>${escapeTitle(metadata.title)}</title>`);
  html = replaceMeta(html, "name", "description", metadata.description);
  html = replaceMeta(html, "name", "keywords", "");
  html = replaceMeta(html, "name", "robots", "noindex, nofollow");
  html = replaceMeta(html, "property", "og:title", metadata.title);
  html = replaceMeta(html, "property", "og:description", metadata.description);
  html = replaceMeta(html, "name", "twitter:title", metadata.title);
  html = replaceMeta(html, "name", "twitter:description", metadata.description);

  // A 404 has no canonical URL of its own.
  html = html.replace(CANONICAL_LINK, () => "");
  return html.replace(ROOT_DIV, () => `<div id="root">${body}</div>`);
}

function makeSitemap(routePaths: string[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routePaths
    .map((routePath) => {
      const isArticle = routePath.startsWith("/learn/");
      const priority = routePath === "/" ? "1.0" : isArticle ? "0.7" : "0.8";
      const changefreq = isArticle ? "monthly" : "weekly";
      return [
        "  <url>",
        `    <loc>${toAbsoluteUrl(routePath)}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main(): Promise<void> {
  const template = await readFile(path.join(outputDir, "index.html"), "utf8");
  const { render } = (await import(pathToFileURL(serverEntry).href)) as {
    render: (routePath: string) => string;
  };

  const uniquePaths = [...new Set(PUBLIC_PATHS)];
  let renderedCharacters = 0;

  for (const routePath of uniquePaths) {
    const body = render(routePath);
    // A route that failed to match would still render the shared chrome, so
    // guard against silently shipping shell-only pages.
    if (body.length < 2000) {
      throw new Error(`Prerendered markup for ${routePath} looks too small (${body.length} characters).`);
    }
    renderedCharacters += body.length;

    const relativeDirectory = routePath === "/" ? "" : routePath.slice(1);
    const destinationDirectory = path.join(outputDir, relativeDirectory);
    await mkdir(destinationDirectory, { recursive: true });
    await writeFile(path.join(destinationDirectory, "index.html"), makePageHtml(template, routePath, body));
  }

  await writeFile(path.join(outputDir, "404.html"), makeNotFoundHtml(template, render("/__not-found__")));

  // Prerendered but noindexed pages (the purchase receipt) are served, not listed.
  const indexablePaths = uniquePaths.filter((routePath) => !getSeoMetadata(routePath).noIndex);
  await writeFile(path.join(outputDir, "sitemap.xml"), makeSitemap(indexablePaths));
  await writeFile(
    path.join(outputDir, "robots.txt"),
    "User-agent: *\nAllow: /\n\nDisallow: /api/\n\nSitemap: https://www.shekla.ai/sitemap.xml\n",
  );

  const averageSize = Math.round(renderedCharacters / uniquePaths.length);
  console.log(
    `Prerendered ${uniquePaths.length} pages with unique metadata (average ${averageSize} characters of markup per page).`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
