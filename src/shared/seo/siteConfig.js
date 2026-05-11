const PRODUCTION_ORIGIN = "https://g9expert.com";
const PRODUCTION_HOSTNAME = "g9expert.com";
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

export const SITE_CONFIG = {
<<<<<<< HEAD
  siteName: "G9Experts",
  baseUrl: PRODUCTION_ORIGIN,
=======
  siteName: "G9Expert",
  siteUrl: "https://g9expert.com",
>>>>>>> edcb54bf3bb37462374c64fccb2eca73f5252b3b
  defaultOgImage: "/logo-512.webp",
  organizationName: "G9Experts",
  productionHostname: PRODUCTION_HOSTNAME,
};

<<<<<<< HEAD
export function toAbsoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    const url = new URL(path);
    return `${PRODUCTION_ORIGIN}${url.pathname}${url.search}${url.hash}`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.baseUrl}${normalizedPath}`;
}

export function getCurrentHostname() {
  if (typeof window === "undefined") return PRODUCTION_HOSTNAME;
  return window.location.hostname;
}

export function isLocalHostname(hostname = getCurrentHostname()) {
  return LOCAL_HOSTNAMES.has(String(hostname).toLowerCase());
}

export function isProductionHostname(hostname = getCurrentHostname()) {
  return String(hostname).toLowerCase() === PRODUCTION_HOSTNAME;
}

function normalizeRobotsValue(robots = "index, follow") {
  return String(robots)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

export function getEnvironmentRobots(robots = "index, follow", hostname = getCurrentHostname()) {
  if (isLocalHostname(hostname)) return "noindex, nofollow";
  if (isProductionHostname(hostname)) return normalizeRobotsValue(robots);

  return "noindex, nofollow";
}
=======
export const toAbsoluteUrl = (path = "") => {
  if (!path) return SITE_CONFIG.siteUrl;

  return path.startsWith("http")
    ? path
    : `${SITE_CONFIG.siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};
>>>>>>> edcb54bf3bb37462374c64fccb2eca73f5252b3b
