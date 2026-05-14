import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isDashboardPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/cashier") ||
    pathname.startsWith("/kitchen") ||
    pathname.startsWith("/menu") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/reports");

  if (!token && isDashboardPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && pathname === "/") {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
