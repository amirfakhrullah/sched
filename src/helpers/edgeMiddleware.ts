import { NextResponse } from "next/server";

export const setupRateLimitHeaders = (
  res: NextResponse,
  {
    limit,
    reset,
    remaining,
  }: {
    limit: number;
    remaining: number;
    reset: number;
  }
): NextResponse => {
  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());
  res.headers.set("X-RateLimit-Reset", reset.toString());

  return res;
};
