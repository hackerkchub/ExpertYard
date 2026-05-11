export const SITE_CONFIG = {
  siteName: "G9Expert",
  siteUrl: "https://g9expert.com",
  defaultOgImage: "/logo-512.webp",
  organizationName: "G9Expert",
};

export const toAbsoluteUrl = (path = "") => {
  if (!path) return SITE_CONFIG.siteUrl;

  return path.startsWith("http")
    ? path
    : `${SITE_CONFIG.siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};