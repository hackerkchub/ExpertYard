import fs from "node:fs/promises";
import path from "node:path";

const siteUrl = process.env.VITE_SITE_URL || "https://softmaxs.com";
const apiUrl = process.env.VITE_API_BASE_URL || "https://softmaxs.com/api";
const distDir = path.resolve("dist");

function toCategorySlug(category) {
  if (category?.slug?.trim()) return category.slug.trim();

  return String(category?.name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function absoluteUrl(urlPath) {
  const normalized = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
  return `${siteUrl.replace(/\/$/, "")}${normalized}`;
}

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function loadCategories() {
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/category/list`);
  if (!response.ok) {
    throw new Error(`Category fetch failed with ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data?.data || [];
}

async function generateSitemap() {
  const categories = await loadCategories();
  const urls = [absoluteUrl("/user"), absoluteUrl("/user/categories")];

  for (const category of categories) {
    const slug = toCategorySlug(category);
    if (slug) {
      urls.push(absoluteUrl(`/user/categories/${slug}`));
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url)}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");
}

generateSitemap().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exitCode = 1;
});
