import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_OG_IMAGE, getSeoMetadata, PUBLIC_PATHS, toAbsoluteUrl } from "../client/src/lib/seo";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, "dist", "public");

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

function replaceMeta(html: string, attribute: "name" | "property", key: string, value: string): string {
  const expression = new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*("\\s*\\/?>)`, "i");
  if (!expression.test(html)) {
    throw new Error(`Missing ${attribute} metadata for ${key} in the Vite HTML template.`);
  }
  return html.replace(expression, `$1${escapeHtml(value)}$2`);
}

function makePageHtml(template: string, routePath: string): string {
  const metadata = getSeoMetadata(routePath);
  if (!metadata.canonical || metadata.noIndex) {
    throw new Error(`Cannot generate an indexable static HTML page for ${routePath}.`);
  }

  const canonicalUrl = toAbsoluteUrl(metadata.canonical);
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapeTitle(metadata.title)}</title>`);
  html = replaceMeta(html, "name", "description", metadata.description);
  html = replaceMeta(html, "name", "keywords", metadata.keywords);
  html = replaceMeta(html, "name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  html = replaceMeta(html, "property", "og:type", metadata.ogType || "website");
  html = replaceMeta(html, "property", "og:title", metadata.title);
  html = replaceMeta(html, "property", "og:description", metadata.description);
  html = replaceMeta(html, "property", "og:url", canonicalUrl);
  html = replaceMeta(html, "property", "og:image", DEFAULT_OG_IMAGE);
  html = replaceMeta(html, "name", "twitter:title", metadata.title);
  html = replaceMeta(html, "name", "twitter:description", metadata.description);
  html = replaceMeta(html, "name", "twitter:image", DEFAULT_OG_IMAGE);

  const canonicalExpression = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  if (!canonicalExpression.test(html)) {
    throw new Error("Missing canonical link in the Vite HTML template.");
  }
  return html.replace(canonicalExpression, `<link rel="canonical" href="${canonicalUrl}" />`);
}

function makeSitemap(): string {
  const urls = PUBLIC_PATHS.map((routePath) => `  <url>\n    <loc>${toAbsoluteUrl(routePath)}</loc>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main(): Promise<void> {
  const template = await readFile(path.join(outputDir, "index.html"), "utf8");
  const uniquePaths = [...new Set(PUBLIC_PATHS)];

  for (const routePath of uniquePaths) {
    const relativeDirectory = routePath === "/" ? "" : routePath.slice(1);
    const destinationDirectory = path.join(outputDir, relativeDirectory);
    await mkdir(destinationDirectory, { recursive: true });
    await writeFile(path.join(destinationDirectory, "index.html"), makePageHtml(template, routePath));
  }

  await writeFile(path.join(outputDir, "sitemap.xml"), makeSitemap());
  await writeFile(
    path.join(outputDir, "robots.txt"),
    "User-agent: *\nAllow: /\n\nSitemap: https://www.shekla.ai/sitemap.xml\n",
  );

  console.log(`Generated ${uniquePaths.length} canonical HTML pages and a matching sitemap.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
