"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, MousePointer, Users, TrendingUp } from "lucide-react";

// Mock data - in a real app, this would come from your API
const statsData = {
    totalLinks: 125000,
    totalClicks: 2400000,
    activeUsers: 15000,
    clickThroughRate: 8.5,
};

export function StatsSection() {
    const [animatedStats, setAnimatedStats] = useState({
        totalLinks: 0,
        totalClicks: 0,
        activeUsers: 0,
        clickThroughRate: 0,
    });

    // Animate numbers on mount
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 steps for smooth animation
        const stepDuration = duration / steps;

        const increment = {
            totalLinks: statsData.totalLinks / steps,
            totalClicks: statsData.totalClicks / steps,
            activeUsers: statsData.activeUsers / steps,
            clickThroughRate: statsData.clickThroughRate / steps,
        };

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;

            setAnimatedStats({
                totalLinks: Math.min(
                    Math.floor(increment.totalLinks * currentStep),
                    statsData.totalLinks
                ),
                totalClicks: Math.min(
                    Math.floor(increment.totalClicks * currentStep),
                    statsData.totalClicks
                ),
                activeUsers: Math.min(
                    Math.floor(increment.activeUsers * currentStep),
                    statsData.activeUsers
                ),
                clickThroughRate: Math.min(
                    +(increment.clickThroughRate * currentStep).toFixed(1),
                    statsData.clickThroughRate
                ),
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setAnimatedStats(statsData);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(0)}K`;
        }
        return num.toString();
    };

    const stats = [
        {
            icon: Link2,
            label: "Links Created",
            value: formatNumber(animatedStats.totalLinks),
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            icon: MousePointer,
            label: "Total Clicks",
            value: formatNumber(animatedStats.totalClicks),
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            icon: Users,
            label: "Active Users",
            value: formatNumber(animatedStats.activeUsers),
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            icon: TrendingUp,
            label: "Avg. CTR",
            value: `${animatedStats.clickThroughRate}%`,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
    ];

    return (
        <section id="stats" className="bg-muted/20 py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Trusted by thousands worldwide
                    </h2>
                    <p className="text-muted-foreground mt-6 text-lg leading-8 text-balance">
                        Join the growing community of users who trust Snippy for their link
                        management needs.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                    {stats.map((stat) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card
                                key={stat.label}
                                className="group transition-all duration-300 hover:shadow-lg"
                            >
                                <CardContent className="p-8 text-center">
                                    <div
                                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${stat.bgColor} transition-transform group-hover:scale-110`}
                                    >
                                        <IconComponent className={`h-8 w-8 ${stat.color}`} />
                                    </div>
                                    <div className="mt-6">
                                        <div className="text-3xl font-bold tracking-tight">
                                            {stat.value}
                                        </div>
                                        <div className="text-muted-foreground mt-1 text-sm font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Additional info */}
                <div className="mx-auto mt-16 max-w-2xl text-center">
                    <p className="text-muted-foreground text-sm">
                        ✨ Statistics update in real-time • 🚀 Growing every day • 🌍 Serving users
                        globally
                    </p>
                </div>
            </div>
        </section>
    );
}
