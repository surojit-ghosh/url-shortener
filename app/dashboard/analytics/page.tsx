"use client";

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, MousePointer, Link as LinkIcon, Target } from "lucide-react";
import { useDashboardAnalytics } from "@/lib/queries/analytics";

function AnalyticsContent() {
    const { data: analytics, isLoading, error } = useDashboardAnalytics();

    if (isLoading) {
        return <AnalyticsLoading />;
    }

    if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        Failed to load analytics
                    </h3>
                    <p className="mb-4 text-gray-600">
                        There was an error loading your analytics data.
                    </p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return null;
    }

    return (
        <div className="w-full max-w-full space-y-4 overflow-hidden sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Analytics Dashboard
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Track your link performance and engagement metrics
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clicks Today</CardTitle>
                        <MousePointer className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.clicksToday}</div>
                        <p className="text-muted-foreground text-xs">Total clicks received today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                        <LinkIcon className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.totalLinks}</div>
                        <p className="text-muted-foreground text-xs">Links created by you</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                        <TrendingUp className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.overview.totalClicks}</div>
                        <p className="text-muted-foreground text-xs">
                            All-time clicks across all links
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Clicks/Link</CardTitle>
                        <Target className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.overview.avgClicksPerLink}
                        </div>
                        <p className="text-muted-foreground text-xs">Average clicks per link</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Top Links */}
            <div className="grid h-full grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5">
                {/* Last 7 Days Chart */}
                <Card className="h-full w-full overflow-hidden lg:col-span-3">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                            Last 7 Days
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Click activity over the past week
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-full px-3 pb-4 sm:px-6">
                        <ClicksChart data={analytics.charts.last7Days} />
                    </CardContent>
                </Card>

                {/* Top Links */}
                <Card className="w-full overflow-hidden lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                            Top Links
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Your most clicked links
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-3 pb-4 sm:px-6">
                        <div className="space-y-2 sm:space-y-3">
                            {analytics.topLinks.length === 0 ? (
                                <div className="py-6 text-center sm:py-8">
                                    <LinkIcon className="text-muted-foreground mx-auto mb-2 h-8 w-8 opacity-50 sm:h-10 sm:w-10" />
                                    <p className="text-muted-foreground text-xs sm:text-sm">
                                        No links created yet
                                    </p>
                                </div>
                            ) : (
                                analytics.topLinks.map((link, index) => (
                                    <div
                                        key={link.id}
                                        className="group bg-card hover:bg-accent/50 flex min-w-0 items-center justify-between rounded-lg border p-3 transition-all"
                                    >
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                            <div className="bg-muted text-muted-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-medium">
                                                        /{link.key}
                                                    </p>
                                                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                                                        {link.clicks}
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                                                    {link.url}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ClicksChart({ data }: { data: Array<{ date: string; day: string; clicks: number }> }) {
    const maxClicks = Math.max(...data.map((d) => d.clicks), 1);

    return (
        <div
            className="flex h-full w-full max-w-full flex-col overflow-hidden"
            style={{ minHeight: "250px" }}
        >
            <div className="flex flex-1 items-end justify-between gap-0.5 pb-6 sm:gap-1 sm:pb-8">
                {data.map((item) => {
                    return (
                        <div
                            key={item.date}
                            className="flex h-full max-w-[14.28%] min-w-0 flex-1 flex-col items-center"
                        >
                            <div className="flex h-full w-full flex-col items-center justify-end pb-2">
                                <div className="text-muted-foreground mb-1 hidden text-xs sm:block">
                                    {item.clicks > 0 ? item.clicks : ""}
                                </div>
                                <div
                                    className="bg-primary hover:bg-primary/80 mx-auto w-3 rounded-t-sm transition-all sm:w-4 md:w-6"
                                    style={{
                                        height:
                                            maxClicks > 0
                                                ? `${Math.max((item.clicks / maxClicks) * 100, 2)}%`
                                                : "2px",
                                        minHeight: "2px",
                                    }}
                                    title={`${item.day}: ${item.clicks} clicks`}
                                />
                            </div>
                            <div className="text-muted-foreground w-full truncate text-center text-xs font-medium">
                                {item.day}
                            </div>
                            <div className="text-muted-foreground text-xs sm:hidden">
                                {item.clicks}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile summary */}
            <div className="mt-3 border-t pt-2 sm:hidden">
                <div className="text-muted-foreground text-center text-xs">
                    Total: {data.reduce((sum, item) => sum + item.clicks, 0)} clicks this week
                </div>
            </div>
        </div>
    );
}

function AnalyticsLoading() {
    return (
        <div className="w-full max-w-full space-y-4 overflow-hidden sm:space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-7 w-48 sm:h-8 sm:w-64" />
                <Skeleton className="h-4 w-64 sm:w-96" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="w-full overflow-hidden">
                        <CardHeader className="space-y-0 pb-2">
                            <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="mb-2 h-6 w-10 sm:h-8 sm:w-12" />
                            <Skeleton className="h-2 w-20 sm:h-3 sm:w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                <Card className="w-full overflow-hidden lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-5 w-24 sm:h-6 sm:w-32" />
                        <Skeleton className="h-3 w-32 sm:h-4 sm:w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-32 w-full sm:h-36" />
                    </CardContent>
                </Card>

                <Card className="w-full overflow-hidden lg:col-span-1">
                    <CardHeader>
                        <Skeleton className="h-5 w-20 sm:h-6 sm:w-24" />
                        <Skeleton className="h-3 w-28 sm:h-4 sm:w-36" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 sm:space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex min-w-0 items-center gap-2 p-2">
                                    <Skeleton className="h-5 w-5 flex-shrink-0 rounded" />
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <Skeleton className="h-3 w-12 sm:h-4 sm:w-16" />
                                        <Skeleton className="h-2 w-16 sm:h-3 sm:w-24" />
                                    </div>
                                    <div className="flex flex-shrink-0 gap-1">
                                        <Skeleton className="h-6 w-6" />
                                        <Skeleton className="h-6 w-6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function Analytics() {
    return (
        <div className="mx-auto w-full max-w-7xl px-2 py-4 sm:px-4 sm:py-6">
            <Suspense fallback={<AnalyticsLoading />}>
                <AnalyticsContent />
            </Suspense>
        </div>
    );
}
