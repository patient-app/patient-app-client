import { NextRequest, NextResponse } from 'next/server';
import { BASE_PATH } from '@/libs/constants';

const basePath = BASE_PATH ?? '';

const PUBLIC_ROUTES_RAW = [`${basePath}/login`, `${basePath}/reset-password`, `${basePath}/terms`];

function normalizePath(p: string) {
  if (!p || p === '/') return '/';
  while (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p;
}

const PUBLIC_ROUTES = new Set(PUBLIC_ROUTES_RAW.map(normalizePath));

function parseJwt(token: string | undefined) {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = typeof atob === 'function'
      ? atob(b64)
      : Buffer.from(b64, 'base64').toString('binary');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const rawPath = req.nextUrl.pathname;
  const path = normalizePath(rawPath);
  const token = req.cookies.get('auth')?.value;

  const isPublicRoute = PUBLIC_ROUTES.has(path);
  const loginPath = normalizePath(`${basePath}/login`);
  const appRoot = normalizePath(`${basePath}/`);

  // 1) If you're on any login path (with or without slash), don't redirect
  if (path === loginPath) {
    return NextResponse.next();
  }

  // 2) No token: only allow public pages
  if (!token) {
    if (!isPublicRoute) {
      const loginUrl = new URL(`${loginPath}`, req.url);
      loginUrl.searchParams.set('next', rawPath + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3) Token present: validate minimally
  const session = parseJwt(token);
  const isLoggedIn = !!session?.sub;

  if (session?.exp && Math.floor(Date.now() / 1000) >= session.exp) {
    const loginUrl = new URL(`${loginPath}`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4) If logged in and visiting login/reset, send home
  if (isLoggedIn && (path === loginPath || path === normalizePath(`${basePath}/reset-password`))) {
    return NextResponse.redirect(new URL(`${appRoot}`, req.url));
  }

  // 5) Not logged in but non-public (extra guard)
  if (!isPublicRoute && !isLoggedIn) {
    const loginUrl = new URL(`${loginPath}`, req.url);
    loginUrl.searchParams.set('next', rawPath + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Keep your exclusions, but this still runs on /client/** (with or without slash)
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
