import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const BASE_URL = req.nextUrl.origin;

  const checkAuth = await fetch(`${BASE_URL}/api/restricted`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  if (checkAuth.status === 401) {
    return NextResponse.redirect(`${BASE_URL}/auth`);
  }
}

export const config = {
  matcher: ["/", "/courses/:path*", "/search"],
};
