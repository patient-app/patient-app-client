import { NextRequest, NextResponse } from 'next/server';
import { BASE_PATH } from '@/libs/constants';

const PUBLIC_ROUTES = ['/login', '/reset-password', '/terms'];

function parseJwt(token: string | undefined) {
    if (!token) return null;

    try {
        const [, payload] = token.split('.');
        const decoded = atob(payload);
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Failed to decode JWT:', e);
        return null;
    }
}

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const relativePath = path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) || '/' : path;
    const isPublicRoute = PUBLIC_ROUTES.includes(relativePath);

    const token = req.cookies.get('auth')?.value;
    const session = parseJwt(token);
    const isLoggedIn = !!session?.sub;

    if (session?.exp) {
        const now = Math.floor(Date.now() / 1000);
        const isExpired = now >= session.exp;

        if (isExpired) {
            return NextResponse.redirect(new URL(`${BASE_PATH}/login`, req.nextUrl));
        }
    }

    if (!isPublicRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL(`${BASE_PATH}/login`, req.nextUrl));
    }

    if (isPublicRoute && isLoggedIn && [`${BASE_PATH}/login`, `${BASE_PATH}/reset-password`].includes(path)) {
        return NextResponse.redirect(new URL(`${BASE_PATH}`, req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
