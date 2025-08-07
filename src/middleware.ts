import {NextRequest, NextResponse} from 'next/server';
import {BASE_PATH} from '@/libs/constants';

const basePath = BASE_PATH ?? '';

const PUBLIC_ROUTES = [`${basePath}/login`, `${basePath}/reset-password`, `${basePath}/terms`];

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
    const isPublicRoute = PUBLIC_ROUTES.includes(path);

    const token = req.cookies.get('auth')?.value;

    if (!token) {
        if (!isPublicRoute && path !== `${basePath}/login`) {
            return NextResponse.redirect(new URL(`${basePath}/login`, req.nextUrl));
        }
        return NextResponse.next();
    }

    const session = parseJwt(token);
    const isLoggedIn = !!session?.sub;

    if (session?.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (now >= session.exp) {
            return NextResponse.redirect(new URL(`${basePath}/login`, req.nextUrl));
        }
    }

    if (!isPublicRoute && !isLoggedIn && path !== `${basePath}/login`) {
        return NextResponse.redirect(new URL(`${basePath}/login`, req.nextUrl));
    }

    if (isPublicRoute && isLoggedIn && [`${basePath}/login`, `${basePath}/reset-password`].includes(path)) {
        return NextResponse.redirect(new URL(`${basePath}`, req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
