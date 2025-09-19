"use server";

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

export async function trackClickAction(data: ClickData) {
    try {
        const link = await prisma.link.findUnique({
            where: { key: data.linkKey },
            select: { id: true },
        });

        if (!link) {
            throw new Error("Link not found");
        }

        const click = await prisma.click.create({
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

        return { success: true, clickId: click.id };
    } catch (error) {
        console.error("Error tracking click:", error);
        throw error;
    }
}