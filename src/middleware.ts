import { NextRequest, NextResponse } from 'next/server';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').trim();

function normalizePath(p: string) {
  if (!p || p === '/') return '/';
  let end = p.length;
  while (end > 1 && p.charCodeAt(end - 1) === 47) end--; // '/'
  return p.slice(0, end);
}

const LOGIN_PATH = normalizePath(`${basePath}/login`);
const RESET_PATH = normalizePath(`${basePath}/reset-password`);
const TERMS_PATH = normalizePath(`${basePath}/terms`);
const PUBLIC = new Set([LOGIN_PATH, RESET_PATH, TERMS_PATH]);

// Also allow raw paths as public in case a proxy stripped the base path
PUBLIC.add('/login');
PUBLIC.add('/reset-password')
PUBLIC.add('/terms')

function redirectTo(req: NextRequest, pathname: string, addNextFrom?: string) {
  const url = new URL(pathname, req.url);
  if (addNextFrom) {
    url.searchParams.set('next', addNextFrom);
  }
  return NextResponse.redirect(url);
}

export default function middleware(req: NextRequest) {
  const rawPath = req.nextUrl.pathname;
  const path = normalizePath(rawPath);
  const token = req.cookies.get('auth')?.value;

  if (PUBLIC.has(path) && (path.endsWith('/login') || path === LOGIN_PATH)) {
    return NextResponse.next();
  }

  if (!token) {
    if (!PUBLIC.has(path)) {
      const hasNext = req.nextUrl.searchParams.has('next');
      return redirectTo(
        req,
        LOGIN_PATH,
        hasNext ? undefined : rawPath + req.nextUrl.search
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {

  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
