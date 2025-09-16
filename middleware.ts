import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Get session cookie (better-auth default cookie name is 'better-auth.session_token')
    const sessionCookie = request.cookies.get("better-auth.session_token");
    const hasSession = !!sessionCookie?.value;

    // Redirect to login if accessing dashboard without session
    if (pathname.startsWith("/dashboard") && !hasSession) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Protect API routes except `/api/auth/**` by checking for session cookie
    if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth") && !hasSession) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth/).*)"
    ],
};