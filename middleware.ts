import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const DB_ID_COOKIE = 'pg_advisor_db_id'
export const AUTH_COOKIE = 'pg_advisor_authed'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const dbId = request.cookies.get(DB_ID_COOKIE)?.value
  const isAuthed = Boolean(request.cookies.get(AUTH_COOKIE)?.value)

  // /login → already authenticated → skip to app
  if (pathname === '/login') {
    if (isAuthed) {
      const dest = dbId ? `/dashboard/${dbId}` : '/connect'
      return NextResponse.redirect(new URL(dest, request.url))
    }
    return NextResponse.next()
  }

  // / → redirect based on auth + db state
  if (pathname === '/') {
    if (!isAuthed) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const dest = dbId ? `/dashboard/${dbId}` : '/connect'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // /connect → needs auth
  if (pathname === '/connect') {
    if (!isAuthed) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (dbId) {
      return NextResponse.redirect(new URL(`/dashboard/${dbId}`, request.url))
    }
    return NextResponse.next()
  }

  // /dashboard/* → needs auth
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthed) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/connect', '/dashboard/:path*'],
}
