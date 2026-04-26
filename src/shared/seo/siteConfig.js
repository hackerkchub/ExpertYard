export const SITE_CONFIG = {
  siteName: "G9Expert",
  baseUrl: (import.meta.env.VITE_SITE_URL || "https://softmaxs.com").replace(/\/$/, ""),
  defaultOgImage: "/logo-512.webp",
  organizationName: "G9Expert",
};

export function toAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.baseUrl}${normalizedPath}`;
}
