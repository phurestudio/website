import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function isAuthenticated(req) {
  if (!ADMIN_TOKEN) return false;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return token === ADMIN_TOKEN;
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const isLoginRoute = pathname.startsWith("/admin/login") || pathname.startsWith("/api/admin/login");
  const isLogoutRoute = pathname.startsWith("/api/admin/logout");

  if (isLoginRoute || isLogoutRoute) {
    if (isLoginRoute && isAuthenticated(req)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if ((isAdminPage || isAdminApi) && !isAuthenticated(req)) {
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
