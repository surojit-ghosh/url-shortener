import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const { data: session } = await axios.get<Session>("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
        withCredentials: true,
    });

    if (pathname.startsWith("/dashboard") && !session) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Protect API routes except `/api/auth/**`
    if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth") && !session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    // runtime: "nodejs",
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth/).*)"
    ],
};