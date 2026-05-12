import fs from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://g9expert.com";
const apiUrl = process.env.VITE_API_BASE_URL || "https://softmaxs.com/api";
const distDir = path.resolve("dist");
const publicDir = path.resolve("public");

const fallbackCategories = [
  { name: "Make Money Steps", slug: "make-money-steps" },
  { name: "Heartbreak and Move On", slug: "heartbreak-and-move-on" },
  { name: "Parenting and Child Care", slug: "parenting-and-child-care" },
  { name: "Job Gateway", slug: "job-gateway" },
  { name: "Doctor", slug: "doctor" },
  { name: "Matrimonial", slug: "matrimonial" },
  { name: "Financial Advisor", slug: "financial-advisor" },
  { name: "Diet and Fitness", slug: "diet-and-fitness" },
  { name: "Property and Loan", slug: "property-and-loan" },
  { name: "Soulmate Guide", slug: "soulmate-guide" },
  { name: "Career Roadmap", slug: "career-roadmap" },
  { name: "Lawyer", slug: "lawyer" },
  { name: "Astrologer", slug: "astrologer" },
];

const fallbackServices = [
  { title: "Lawyer Consultation Online", slug: "lawyer-consultation-online" },
  { title: "Doctor Consultation Online", slug: "doctor-consultation-online" },
  { title: "Astrologer Consultation Online", slug: "astrologer-consultation-online" },
  { title: "Fitness Expert Consultation", slug: "fitness-expert-consultation" },
  { title: "Career Guidance Expert", slug: "career-guidance-expert" },
  { title: "Business Consultant Online", slug: "business-consultant-online" },
  { title: "Property Consultant Online", slug: "property-consultant-online" },
  { title: "Financial Advisor Online", slug: "financial-advisor-online" },
];

function toCategorySlug(category) {
  if (category?.slug?.trim()) return category.slug.trim();

  return String(category?.name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toSeoSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toServiceSlug(service) {
  if (service?.slug?.trim()) return service.slug.trim();
  return toSeoSlug(service?.title || service?.name || service?.service_name || service?.id || "");
}

function toExpertSlug(expert) {
  if (expert?.slug?.trim()) return expert.slug.trim();
  return toSeoSlug(expert?.name || expert?.expert_name || expert?.id || expert?.expert_id || "");
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

async function loadServices() {
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/services`);
  if (!response.ok) {
    throw new Error(`Service fetch failed with ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data?.data || [];
}

async function loadExperts() {
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/expert-profile/list`);
  if (!response.ok) {
    throw new Error(`Expert fetch failed with ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data?.data || [];
}

async function readDynamicData() {
  const [categoryResult, serviceResult, expertResult] = await Promise.allSettled([
    loadCategories(),
    loadServices(),
    loadExperts(),
  ]);

  if (categoryResult.status === "rejected") {
    console.warn(categoryResult.reason?.message || "Category sitemap fetch failed");
  }

  if (serviceResult.status === "rejected") {
    console.warn(serviceResult.reason?.message || "Service sitemap fetch failed");
  }

  if (expertResult.status === "rejected") {
    console.warn(expertResult.reason?.message || "Expert sitemap fetch failed");
  }

  return {
    categories: categoryResult.status === "fulfilled" ? categoryResult.value : fallbackCategories,
    services: serviceResult.status === "fulfilled" ? serviceResult.value : fallbackServices,
    experts: expertResult.status === "fulfilled" ? expertResult.value : [],
  };
}

function pushUrl(urls, pathName, priority = "0.7", changefreq = "weekly") {
  const loc = absoluteUrl(pathName);
  if (urls.some((url) => url.loc === loc)) return;

  urls.push({
    loc,
    priority,
    changefreq,
  });
}

async function generateSitemap() {
  const { categories, services, experts } = await readDynamicData();
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  pushUrl(urls, "/", "1.0", "daily");
  pushUrl(urls, "/user", "1.0", "daily");
  pushUrl(urls, "/categories", "0.9", "weekly");
  pushUrl(urls, "/user/categories", "0.9", "weekly");
  pushUrl(urls, "/user/all-services", "0.9", "weekly");
  pushUrl(urls, "/user/call-chat?page=1", "0.8", "daily");
  pushUrl(urls, "/user/about", "0.6", "monthly");
  pushUrl(urls, "/user/contact", "0.6", "monthly");
  pushUrl(urls, "/user/privacy", "0.4", "yearly");
  pushUrl(urls, "/user/terms", "0.4", "yearly");
  pushUrl(urls, "/user/faq", "0.6", "monthly");

  for (const category of categories) {
    const slug = toCategorySlug(category);
    if (slug) {
      pushUrl(urls, `/category/${slug}`, "0.8", "weekly");
    }
  }

  for (const service of services) {
    const slug = toServiceSlug(service);
    if (slug) {
      pushUrl(urls, `/user/service-details/${slug}`, "0.7", "weekly");
    }
  }

  for (const expert of experts) {
    const slug = toExpertSlug(expert);
    if (slug) {
      pushUrl(urls, `/user/experts/${slug}`, "0.6", "weekly");
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");

  try {
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");
  } catch (error) {
    console.warn("Dist sitemap write skipped:", error?.message || error);
  }
}

generateSitemap().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exitCode = 1;
});
