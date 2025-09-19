import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params;

        if (!key) {
            return NextResponse.json(
                { error: "Link key is required" },
                { status: 400 }
            );
        }

        const link = await prisma.link.findUnique({
            where: { key },
            select: {
                id: true,
                url: true,
                key: true,
                createdAt: true,
                clicks: {
                    select: {
                        id: true,
                        clickedAt: true,
                        countryCode: true,
                        deviceType: true,
                        referer: true,
                    },
                    orderBy: {
                        clickedAt: "desc",
                    },
                },
            },
        });

        if (!link) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }

        const totalClicks = link.clicks.length;
        const uniqueCountries = new Set(
            link.clicks.map((click) => click.countryCode).filter(Boolean)
        ).size;
        const uniqueDevices = new Set(
            link.clicks.map((click) => click.deviceType).filter(Boolean)
        ).size;

        const clicksByDate = link.clicks.reduce((acc, click) => {
            const date = click.clickedAt.toISOString().split("T")[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const clicksByCountry = link.clicks.reduce((acc, click) => {
            const country = click.countryCode || "Unknown";
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const clicksByDevice = link.clicks.reduce((acc, click) => {
            const device = click.deviceType || "Unknown";
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const analytics = {
            link: {
                id: link.id,
                url: link.url,
                key: link.key,
                createdAt: link.createdAt.toISOString(),
            },
            stats: {
                totalClicks,
                uniqueCountries,
                uniqueDevices,
            },
            charts: {
                clicksByDate,
                clicksByCountry,
                clicksByDevice,
            },
            recentClicks: link.clicks.slice(0, 10),
        };

        return NextResponse.json(analytics);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}