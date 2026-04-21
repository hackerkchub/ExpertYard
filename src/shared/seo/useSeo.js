import { useEffect } from "react";

import { SITE_CONFIG, toAbsoluteUrl } from "./siteConfig";

function ensureMeta(selector, attributes) {
  let node = document.head.querySelector(selector);

  if (!node) {
    node = document.createElement("meta");
    document.head.appendChild(node);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
}

function ensureLink(selector, attributes) {
  let node = document.head.querySelector(selector);

  if (!node) {
    node = document.createElement("link");
    document.head.appendChild(node);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
}

function ensureScript(id, json) {
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
  robots = "index,follow",
  keywords,
  og = {},
  twitter = {},
  structuredData = [],
}) {
  const structuredDataKey = JSON.stringify(structuredData);

  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(canonicalPath || window.location.pathname);
    const ogImage = og.image || toAbsoluteUrl(SITE_CONFIG.defaultOgImage);

    document.title = title;

    ensureMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    ensureMeta('meta[name="robots"]', { name: "robots", content: robots });

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

    document.head
      .querySelectorAll('script[id^="seo-structured-data-"]')
      .forEach((node) => node.remove());

    structuredData.forEach((item, index) => {
      ensureScript(`seo-structured-data-${index}`, item);
    });

    return () => {
      document.head
        .querySelectorAll('script[id^="seo-structured-data-"]')
        .forEach((node) => node.remove());
    };
  }, [
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
  ]);
}
