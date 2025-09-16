import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { passwordVerificationSchema } from "@/lib/zod/link.schema";
import { getClientIP, getCountryFromIP, getDeviceFromUserAgent, findTargetedURL } from "@/lib/utils/targeting";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params;
        const body = await request.json();

        // Validate the input
        const { password } = passwordVerificationSchema.parse(body);

        // Find the link
        const link = await prisma.link.findUnique({
            where: { key },
            select: {
                id: true,
                password: true,
                url: true,
                geoTargeting: true,
                deviceTargeting: true,
                expiresAt: true
            }
        });

        if (!link) {
            return NextResponse.json(
                { success: false, message: "Link not found" },
                { status: 404 }
            );
        }

        // Check if link is expired
        if (link.expiresAt && new Date() > link.expiresAt) {
            return NextResponse.json(
                { success: false, message: "Link has expired" },
                { status: 410 }
            );
        }

        // Check if link has password protection
        if (!link.password) {
            return NextResponse.json(
                { success: false, message: "Link is not password protected" },
                { status: 400 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, link.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid password" },
                { status: 401 }
            );
        }

        // Password is correct, determine the redirect URL based on targeting
        const userAgent = request.headers.get("user-agent") || "";
        const clientIP = getClientIP(request.headers);

        const countryCode = getCountryFromIP(clientIP);
        const deviceType = getDeviceFromUserAgent(userAgent);

        const targetUrl = findTargetedURL(
            link.url,
            link.geoTargeting as Record<string, string> | null,
            link.deviceTargeting as Record<string, string> | null,
            countryCode,
            deviceType
        );

        return NextResponse.json(
            {
                success: true,
                redirectUrl: targetUrl
            },
            { status: 200 }
        );

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid input",
                    fieldErrors: error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        console.error("Error verifying password:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}