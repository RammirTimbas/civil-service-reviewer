import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

  // NOTE: avoid protecting internal app prefixes here to prevent
  // server/client route segment mismatches during client-side navigation.
  // Keep only the root redirect to dashboard to remove UI flash.
  // API and backend routes should enforce auth server-side.

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
