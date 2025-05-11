import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
const path = request.nextUrl.pathname;

const isPublicPath = path === '/login' || path === '/signup'
const token = request.cookies.get("Token")?.value || ''

if(isPublicPath && token){
  return NextResponse.redirect(new URL('/', request.nextUrl));
  
}
if (!isPublicPath && !token) {
  return NextResponse.redirect(new URL('/login', request.url));
}


}
 

export const config = {
matcher: ['/', '/profile', '/login', '/signup', '/((?!_next/static|_next/image|favicon.ico).*)'],

} 