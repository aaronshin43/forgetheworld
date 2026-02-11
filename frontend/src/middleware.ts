import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    // Check if Basic Auth is enabled via ENV
    const authUser = process.env.BASIC_AUTH_USER;
    const authPass = process.env.BASIC_AUTH_PASSWORD;

    if (!authUser || !authPass) {
        return NextResponse.next();
    }

    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        if (user === authUser && pwd === authPass) {
            return NextResponse.next();
        }
    }

    return new NextResponse('Authentication required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}

export const config = {
    matcher: '/:path*',
};
