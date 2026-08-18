import { useEffect } from "react";
import { useLocation } from "wouter";
import { DEFAULT_OG_IMAGE, getSeoMetadata, toAbsoluteUrl } from "@/lib/seo";

function upsertMeta(selector: string, attribute: "name" | "property", key: string, value: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

export default function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const metadata = getSeoMetadata(location);
    const canonicalUrl = metadata.canonical ? toAbsoluteUrl(metadata.canonical) : undefined;

    document.title = metadata.title;
    upsertMeta('meta[name="description"]', "name", "description", metadata.description);
    upsertMeta('meta[name="keywords"]', "name", "keywords", metadata.keywords);
    upsertMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      metadata.noIndex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    );
    upsertMeta('meta[property="og:title"]', "property", "og:title", metadata.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", metadata.description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", metadata.ogType || "website");
    upsertMeta('meta[property="og:image"]', "property", "og:image", DEFAULT_OG_IMAGE);

    const existingOgUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (canonicalUrl) {
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    } else {
      existingOgUrl?.remove();
      document.head.querySelector('link[rel="canonical"]')?.remove();
    }
  }, [location]);

  return null;
}
