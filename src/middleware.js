import { auth } from "@/auth"
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  const user = req.auth?.user; 
  const isVerified = user?.isEmailVerified; 

  if (isLoggedIn && pathname === '/join-now') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  if (!isLoggedIn && (pathname === '/dashboard' || pathname === '/verify')) {
    return NextResponse.redirect(new URL('/join-now', nextUrl));
  }
  
  if (isLoggedIn && pathname === '/dashboard') {
    if (isVerified === false) {
      return NextResponse.redirect(new URL('/verify', nextUrl));
    }
  }

  if (isLoggedIn && pathname === '/verify') {
    if (isVerified === true) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/join-now',
    '/dashboard', 
    '/verify',
  ],
}