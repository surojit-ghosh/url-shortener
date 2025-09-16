import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Only protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        try {
            // Use better-auth's session verification
            const session = await auth.api.getSession({
                headers: request.headers,
            });

            if (!session) {
                return NextResponse.redirect(new URL("/auth/login", request.url));
            }
        } catch {
            // If session check fails, redirect to login
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};