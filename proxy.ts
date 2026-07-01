import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const PUBLIC_ROUTES = ["/", "/login", "/share"];

export const proxy = auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const path = nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => route === path || path.startsWith("/share"),
  );

  if (isLoggedIn && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
