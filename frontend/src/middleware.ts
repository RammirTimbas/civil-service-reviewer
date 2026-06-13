import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPrefixes = ['/dashboard', '/learn', '/mock-exam', '/practice', '/settings']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('access_token')?.value

  // If user visits root and has a session, redirect to dashboard to avoid flash
  if (pathname === '/') {
    if (token) {
      const url = req.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Protect certain prefixes server-side; if no cookie, redirect to login
  if (protectedPrefixes.some(p => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/learn/:path*',
    '/mock-exam/:path*',
    '/practice/:path*',
    '/settings/:path*',
  ],
}
