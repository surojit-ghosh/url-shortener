import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth-server";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get user's links
        const userLinks = await prisma.link.findMany({
            where: { userId },
            select: { id: true }
        });

        const linkIds = userLinks.map(link => link.id);

        // Parallel queries for better performance
        const [
            totalLinks,
            clicksToday,
            totalClicks,
            last7DaysClicks,
            topLinksData
        ] = await Promise.all([
            // Total links created by user
            prisma.link.count({
                where: { userId }
            }),

            // Clicks today
            prisma.click.count({
                where: {
                    linkId: { in: linkIds },
                    clickedAt: { gte: startOfToday }
                }
            }),

            // Total clicks for user's links
            prisma.click.count({
                where: {
                    linkId: { in: linkIds }
                }
            }),

            // Last 7 days clicks grouped by date
            prisma.click.findMany({
                where: {
                    linkId: { in: linkIds },
                    clickedAt: { gte: sevenDaysAgo }
                },
                select: {
                    clickedAt: true
                }
            }),

            // Top 5 links by click count
            prisma.link.findMany({
                where: { userId },
                select: {
                    id: true,
                    key: true,
                    url: true,
                    createdAt: true,
                    _count: {
                        select: {
                            clicks: true
                        }
                    }
                },
                orderBy: {
                    clicks: {
                        _count: "desc"
                    }
                },
                take: 5
            })
        ]);

        // Process last 7 days data for chart
        const last7DaysData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const dateString = date.toISOString().split("T")[0];
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            const clicksOnDate = last7DaysClicks.filter(click => {
                const clickDate = new Date(click.clickedAt).toISOString().split("T")[0];
                return clickDate === dateString;
            }).length;

            last7DaysData.push({
                date: dateString,
                day: dayName,
                clicks: clicksOnDate
            });
        }

        // Format top links data
        const topLinks = topLinksData.map(link => ({
            id: link.id,
            key: link.key,
            url: link.url,
            createdAt: link.createdAt.toISOString(),
            clicks: link._count.clicks,
            shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${link.key}`
        }));

        const analytics = {
            overview: {
                totalLinks,
                clicksToday,
                totalClicks,
                avgClicksPerLink: totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0
            },
            charts: {
                last7Days: last7DaysData
            },
            topLinks
        };

        return NextResponse.json(analytics);
    } catch (error) {
        console.error("Error fetching dashboard analytics:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}