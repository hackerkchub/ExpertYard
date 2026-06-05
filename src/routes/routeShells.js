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
    pathname === "/categories" ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/expert") ||
    pathname.startsWith("/admin")
  );
}

export function shouldShowBottomNavbar(pathname) {
  if (pathname.startsWith("/admin")) return false;
  if (isImmersiveUserRoute(pathname) || isImmersiveExpertRoute(pathname)) return false;

  return pathname.startsWith("/category") || pathname.startsWith("/user") || pathname.startsWith("/expert");
}

export function isImmersiveUserRoute(pathname) {
  return USER_IMMERSIVE_PREFIXES.some((prefix) => {
    if (prefix === "/user/chat") {
      return pathname === "/user/chat" || pathname.startsWith("/user/chat/");
    }

    return pathname.startsWith(prefix);
  });
}

export function isImmersiveExpertRoute(pathname) {
  return EXPERT_IMMERSIVE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
