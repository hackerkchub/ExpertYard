import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEOHead({
  title = "G9Expert - Dynamic Service Marketplace",
  description = "Book expert digital services online. Fast, verified, and guaranteed fulfillment.",
  canonicalUrl = "",
  ogImage = "",
  schemaJson = null
}) {
  const currentUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Structured Data (JSON-LD) */}
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
}
