import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const DB_ID_COOKIE = 'pg_advisor_db_id'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const dbId = request.cookies.get(DB_ID_COOKIE)?.value

  // / → redirect based on cached db_id
  if (pathname === '/') {
    if (dbId) {
      return NextResponse.redirect(new URL(`/dashboard/${dbId}`, request.url))
    }
    return NextResponse.redirect(new URL('/connect', request.url))
  }

  // /connect → already have a connection → go straight to dashboard
  if (pathname === '/connect' && dbId) {
    return NextResponse.redirect(new URL(`/dashboard/${dbId}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/connect'],
}
