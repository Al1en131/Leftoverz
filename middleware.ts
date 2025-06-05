import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
const protectedRoutes = ['/seller', '/admin', '/buyer']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const url = request.nextUrl

  // Cek kalau user akses halaman yang dilindungi dan belum login
  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}
