import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define path groups for role-based protection
const ADMIN_PATHS = [/^\/(adminwallet|users|roles-permissions|establishments|funding|log)(\/|$)/i];
const PARTNER_PATHS = [/^\/(invoices|transactions)(\/|$)/i];

function isMatch(pathname: string, patterns: RegExp[]) {
  return patterns.some((re) => re.test(pathname));
}

export function proxy(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  // Public paths that never require auth
  const PUBLIC_PATHS = ["/", "/favicon.ico"];
  const isPublic = PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/public");

  // Read auth/role cookies set at login
  const isSuperUserCookie = cookies.get("is_superuser")?.value; // "1" or "0"
  const isAuthenticatedCookie = cookies.get("authenticated")?.value; // "1"

  const isAuthenticated = isAuthenticatedCookie === "1" || typeof isSuperUserCookie !== "undefined";
  const isSuperUser = isSuperUserCookie === "1";

  // Require authentication for all pages except the auth entry ("/") and favicon
  if (!isAuthenticated) {
    if (pathname === "/" || pathname === "/favicon.ico") {
      return NextResponse.next();
    }
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("redirected", "true");
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // From here, user is authenticated.
  // Public paths are accessible to all authenticated users (is_superuser "1" or "0")
  if (isPublic) return NextResponse.next();

  // Only protect admin and partner namespaces with role checks
  const isAdminSection = isMatch(pathname, ADMIN_PATHS);
  const isPartnerSection = isMatch(pathname, PARTNER_PATHS);

  if (isAdminSection || isPartnerSection) {
    // Role-based protection
    if (isAdminSection && !isSuperUser) {
      return NextResponse.redirect(new URL("/invoices", req.url));
    }

    if (isPartnerSection && isSuperUser) {
      return NextResponse.redirect(new URL("/adminwallet", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except those starting with _next or files with an extension, and API routes
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};