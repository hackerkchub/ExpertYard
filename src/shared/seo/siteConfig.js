const PRODUCTION_ORIGIN = "https://g9expert.com";
const PRODUCTION_HOSTNAME = "g9expert.com";
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

export const SITE_CONFIG = {
  siteName: "G9Experts",
  baseUrl: PRODUCTION_ORIGIN,
  defaultOgImage: "/logo-512.webp",
  organizationName: "G9Experts",
  productionHostname: PRODUCTION_HOSTNAME,
};

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
