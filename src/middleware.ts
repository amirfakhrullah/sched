import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const BASE_URL = req.nextUrl.origin;

  const checkAuth = await fetch(`${BASE_URL}/api/auth-check`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  if (checkAuth.status !== 401) return NextResponse.next(req);
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(`${BASE_URL}/auth`);
  }
  return NextResponse.rewrite(new URL("/404", req.url), req);
}

export const config = {
  matcher: ["/", "/courses/:path*", "/lessons/:path*", "/search"],
};
