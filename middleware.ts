import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Fetch session using cookies from the request
    const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard") && !session) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Redirect logged-in users away from login/signup pages
    if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/api") && session) {
        return NextResponse.redirect(new URL("/dashboard/links", request.url));
    }

    // 🔐 Protect API routes except `/api/auth/**`
    if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth") && !session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};