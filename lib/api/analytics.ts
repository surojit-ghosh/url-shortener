interface AnalyticsData {
    linkKey: string;
    targetUrl: string;
    clientIP?: string;
    userAgent?: string;
    countryCode?: string;
    deviceType?: string;
    referer?: string;
}

interface AnalyticsResponse {
    link: {
        id: string;
        url: string;
        key: string;
        createdAt: string;
    };
    stats: {
        totalClicks: number;
        uniqueCountries: number;
        uniqueDevices: number;
    };
    charts: {
        clicksByDate: Record<string, number>;
        clicksByCountry: Record<string, number>;
        clicksByDevice: Record<string, number>;
    };
    recentClicks: Array<{
        id: string;
        clickedAt: string;
        countryCode: string | null;
        deviceType: string | null;
        referer: string | null;
    }>;
}

export async function trackClick(data: AnalyticsData): Promise<void> {
    try {
        const response = await fetch("/api/analytics/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Failed to track click:", response.statusText);
        }
    } catch (error) {
        console.error("Error tracking click:", error);
    }
}

export async function getAnalytics(linkKey: string): Promise<AnalyticsResponse> {
    const response = await fetch(`/api/analytics/${linkKey}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
    }

    return response.json();
}