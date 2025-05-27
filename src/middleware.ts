import {NextRequest, NextResponse} from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/reset-password'];

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
    const session = parseJwt(token);
    const isLoggedIn = !!session?.sub; //creates boolean

    if (session?.exp) {
        const now = Math.floor(Date.now() / 1000);
        const isExpired = now >= session.exp;

        if (isExpired) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
    }

    if (!isPublicRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (isPublicRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
