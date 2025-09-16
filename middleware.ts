import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    try {
        // Create the session check URL - use http for localhost, https for production
        const sessionUrl = new URL("/api/auth/get-session", request.nextUrl.origin);
        
        const response = await fetch(sessionUrl.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Cookie": request.headers.get("cookie") || "",
            },
            credentials: "include",
        });

        let session = null;
        if (response.ok) {
            session = await response.json();
        }

        if (pathname.startsWith("/dashboard") && !session) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        // Protect API routes except `/api/auth/**`
        if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth") && !session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware session check failed:", error);
        
        // If session check fails, redirect to login for protected routes
        if (pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
        
        // For API routes, return unauthorized
        if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        return NextResponse.next();
    }
}

export const config = {
    // runtime: "nodejs",
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth/).*)"
    ],
};