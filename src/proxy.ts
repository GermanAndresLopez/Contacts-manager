import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_SESSION_COOKIE } from "@/lib/session";

// Chequeo optimista (solo lee la cookie, sin ir a base de datos) para
// redirigir rápido antes de renderizar. La verificación fuerte ocurre en
// cada Server Action / página admin vía lib/dal.ts.
async function hasValidSession(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!cookie || !secret) return false;
  try {
    await jwtVerify(cookie, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = await hasValidSession(request);

  if (pathname.startsWith("/admin") && !isAuthed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && isAuthed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
