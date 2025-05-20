import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("Token")?.value;
  console.log("pathhhhhhhhhh",path)

  const isAuthPage = path === "/login" || path === "/signup";
  const isProtectedPage = path === "/profile";

  console.log("tttttttttttttt", token)


  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }


  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/profile"],
};
