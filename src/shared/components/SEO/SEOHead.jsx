import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEOHead({
  title = "Verified Experts for Online Consultation | G9EXPERT",
  description = "Connect with verified experts online for legal, health, finance, career, astrology, property, and tax services on G9EXPERT.",
  canonicalUrl = "",
  ogTitle = "",
  ogDescription = "",
  ogImage = "",
  robotsMeta = "index, follow",
  schemaJson = null
}) {
  const currentUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href.split('?')[0] : "https://g9expert.com");
  const metaOgTitle = ogTitle || title;
  const metaOgDesc = ogDescription || description;
  const metaOgImg = ogImage || "https://g9expert.com/logo-512.webp";

  const schemasToRender = Array.isArray(schemaJson)
    ? schemaJson
    : (schemaJson ? [schemaJson] : []);

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsMeta} />
      <link rel="canonical" href={currentUrl} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="G9EXPERT" />
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDesc} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={metaOgImg} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaOgTitle} />
      <meta name="twitter:description" content={metaOgDesc} />
      <meta name="twitter:image" content={metaOgImg} />

      {/* Structured Data (JSON-LD) */}
      {schemasToRender.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
