import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // SEO: uppercase URLs are duplicates of the lowercase page -> 301 (skip files with an extension).
  if (/[A-Z]/.test(pathname) && !/\.[a-z0-9]+$/i.test(pathname) && !pathname.startsWith("/order/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // Fast gate for admin pages; real verification happens in requireAdmin() on every page/action.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !request.cookies.has("fvf_admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/|api/|images/|media/|favicon|icon|apple-icon|robots.txt|sitemap).*)"] };
