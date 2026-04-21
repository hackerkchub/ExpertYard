export const SITE_CONFIG = {
  siteName: "ExpertYard",
  baseUrl: (import.meta.env.VITE_SITE_URL || "https://softmaxs.com").replace(/\/$/, ""),
  defaultOgImage: "/logo-512.webp",
  organizationName: "ExpertYard",
};

export function toAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.baseUrl}${normalizedPath}`;
}
