import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ClickData {
    linkKey: string;
    targetUrl: string;
    clientIP?: string;
    userAgent?: string;
    countryCode?: string;
    deviceType?: string;
    referer?: string;
}

export async function POST(request: NextRequest) {
    try {
        const data: ClickData = await request.json();

        if (!data.linkKey || !data.targetUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const link = await prisma.link.findUnique({
            where: { key: data.linkKey },
            select: { id: true },
        });

        if (!link) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }

        await prisma.click.create({
            data: {
                linkId: link.id,
                targetUrl: data.targetUrl,
                clientIP: data.clientIP || null,
                userAgent: data.userAgent || null,
                countryCode: data.countryCode || null,
                deviceType: data.deviceType || null,
                referer: data.referer || null,
                clickedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking click:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}