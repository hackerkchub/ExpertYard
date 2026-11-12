import { useEffect } from "react";

import { getCurrentHostname, getEnvironmentRobots, SITE_CONFIG, toAbsoluteUrl } from "./siteConfig";

/**
 * Defensive DOM query & attribute setter compatible with SSG / Prerendering environments.
 * Guarded against Node.js / non-browser execution where `document` or `document.head` is undefined.
 */
function ensureMeta(selector, attributes) {
  if (typeof document === "undefined" || !document.head) return;

  let node = document.head.querySelector(selector);

  if (!node) {
    node = document.createElement("meta");
    document.head.appendChild(node);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      node.setAttribute(key, value);
    }
  });
}

function ensureLink(selector, attributes) {
  if (typeof document === "undefined" || !document.head) return;

  let node = document.head.querySelector(selector);

  if (!node) {
    node = document.createElement("link");
    document.head.appendChild(node);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      node.setAttribute(key, value);
    }
  });
}

function ensureScript(id, json) {
  if (typeof document === "undefined" || !document.head) return;

  let node = document.head.querySelector(`#${id}`);

  if (!node) {
    node = document.createElement("script");
    node.type = "application/ld+json";
    node.id = id;
    document.head.appendChild(node);
  }

  node.textContent = JSON.stringify(json);
}

export function useSeo({
  title,
  description,
  canonicalPath,
  robots = "index, follow",
  keywords,
  og = {},
  twitter = {},
  structuredData = [],
  breadcrumbs = null,
}) {
  const structuredDataKey = JSON.stringify(structuredData);
  const breadcrumbsKey = JSON.stringify(breadcrumbs);

  useEffect(() => {
    // Immediate early-exit if running in a non-browser environment
    if (typeof window === "undefined" || typeof document === "undefined" || !document.head) {
      return;
    }

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    const canonicalUrl = toAbsoluteUrl(canonicalPath || currentPath);
    const ogImage = og.image || toAbsoluteUrl(SITE_CONFIG.defaultOgImage);
    const robotsContent = getEnvironmentRobots(robots, getCurrentHostname());

    if (title) {
      document.title = title;
    }

    ensureMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    ensureMeta('meta[name="robots"]', { name: "robots", content: robotsContent });

    if (keywords) {
      ensureMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    }

    ensureLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });

    ensureMeta('meta[property="og:type"]', {
      property: "og:type",
      content: og.type || "website",
    });
    ensureMeta('meta[property="og:title"]', {
      property: "og:title",
      content: og.title || title,
    });
    ensureMeta('meta[property="og:description"]', {
      property: "og:description",
      content: og.description || description,
    });
    ensureMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    ensureMeta('meta[property="og:image"]', {
      property: "og:image",
      content: ogImage,
    });
    ensureMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_CONFIG.siteName,
    });

    ensureMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: twitter.card || "summary_large_image",
    });
    ensureMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: twitter.title || title,
    });
    ensureMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: twitter.description || description,
    });
    ensureMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: twitter.image || ogImage,
    });
    ensureMeta('meta[name="twitter:url"]', {
      name: "twitter:url",
      content: twitter.url ? toAbsoluteUrl(twitter.url) : canonicalUrl,
    });

    // Clean previous structured data nodes before mounting new schemas
    if (document.head) {
      document.head
        .querySelectorAll('script[id^="seo-structured-data-"]')
        .forEach((node) => node.remove());
    }

    const combinedSchemas = [
      ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [])
    ];

    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      const hasBreadcrumbSchema = combinedSchemas.some((s) => s?.["@type"] === "BreadcrumbList");
      if (!hasBreadcrumbSchema) {
        combinedSchemas.push({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((b, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: b.name,
            item: toAbsoluteUrl(b.url || b.path || "/"),
          })),
        });
      }
    }

    combinedSchemas.forEach((item, index) => {
      ensureScript(`seo-structured-data-${index}`, item);
    });

    return () => {
      if (typeof document !== "undefined" && document.head) {
        document.head
          .querySelectorAll('script[id^="seo-structured-data-"]')
          .forEach((node) => node.remove());
      }
    };
  }, [
    breadcrumbsKey,
    canonicalPath,
    description,
    keywords,
    og.description,
    og.image,
    og.title,
    og.type,
    robots,
    structuredDataKey,
    title,
    twitter.card,
    twitter.description,
    twitter.image,
    twitter.title,
    twitter.url,
  ]);
}
