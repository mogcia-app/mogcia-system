import { NextResponse, type NextRequest } from "next/server";

const authCookieName = "mogcia-auth";
const publicPaths = new Set(["/", "/lp/toeihotel"]);
const publicPrefixes = ["/_next/", "/lp/toeihotel/"];
const publicFiles = new Set([
  "/apple-icon.png",
  "/favicon.ico",
  "/ficon.png",
  "/icon.png",
  "/m.png",
]);

function isPublicPath(pathname: string) {
  return (
    publicPaths.has(pathname) ||
    publicFiles.has(pathname) ||
    publicPrefixes.some((prefix) => pathname.startsWith(prefix))
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (request.cookies.get(authCookieName)?.value === "1") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!.*\\.map$).*)"],
};
