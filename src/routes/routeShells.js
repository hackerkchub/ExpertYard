const USER_IMMERSIVE_PREFIXES = [
  "/user/auth",
  "/user/chat",
  "/user/voice-call",
];

const EXPERT_IMMERSIVE_PREFIXES = [
  "/expert/register",
  "/expert/voice-call",
];

export function isKnownAppRoute(pathname) {
  return (
    pathname === "/" ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/expert") ||
    pathname.startsWith("/admin")
  );
}

export function shouldShowBottomNavbar(pathname) {
  if (pathname.startsWith("/admin")) return false;

  const hiddenPrefixes = [
    ...USER_IMMERSIVE_PREFIXES,
    ...EXPERT_IMMERSIVE_PREFIXES,
  ];

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }

  return pathname.startsWith("/user") || pathname.startsWith("/expert");
}

export function isImmersiveUserRoute(pathname) {
  return USER_IMMERSIVE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isImmersiveExpertRoute(pathname) {
  return EXPERT_IMMERSIVE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
