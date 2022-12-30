import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { setupRateLimitHeaders } from "./helpers/edgeMiddleware";

const ephemeralCache = new Map();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(20, "10 s"),
  ephemeralCache,
});

const authPaths = ["/", "/auth", "/courses", "/notes", "search"];

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const ip = req.ip ?? "127.0.0.1";

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    `mw_${ip}`
  );
  ev.waitUntil(pending);

  const setupResponse = (res: NextResponse) =>
    setupRateLimitHeaders(res, { limit, remaining, reset });

  // redirect to "/api/blocked" if exceed ratelimiter's limit
  if (!success)
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
