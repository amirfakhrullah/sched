import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { setupRateLimitHeaders } from "./helpers/edgeMiddleware";
import { setupProdRateLimiter } from "./lib/ratelimit";

const authPaths = ["/", "/auth", "/courses", "/notes", "search"];

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const ip = req.ip ?? "127.0.0.1";
  const ratelimit = await setupProdRateLimiter(`mw_${ip}`);

  if (ratelimit?.pending) {
    ev.waitUntil(ratelimit.pending);
  }

  const setupResponse = (res: NextResponse) =>
    setupRateLimitHeaders(res, {
      limit: ratelimit?.limit,
      remaining: ratelimit?.remaining,
      reset: ratelimit?.reset,
    });

  // redirect to "/api/blocked" if exceed ratelimiter's limit
  if (ratelimit && !ratelimit.success)
    return setupResponse(
      NextResponse.rewrite(new URL("/api/blocked", req.url), req)
    );

  // early escape for routes that don't need auth checking
  if (!authPaths.includes(req.nextUrl.pathname))
    return setupResponse(NextResponse.next(req));

  const BASE_URL = req.nextUrl.origin;

  const checkAuth = await fetch(`${BASE_URL}/api/auth-check`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  // if authed, redirect "/auth" route to "/"
  if (checkAuth.status === 200 && req.nextUrl.pathname === "/auth") {
    return setupResponse(NextResponse.redirect(BASE_URL));
  }
  // if not authed, redirect all routes to "/auth"
  if (checkAuth.status === 401 && req.nextUrl.pathname !== "/auth") {
    return setupResponse(NextResponse.redirect(`${BASE_URL}/auth`));
  }
  return setupResponse(NextResponse.next(req));
}

export const config = {
  // all routes except "/api", "_next/static", "/favicon.ico"
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
