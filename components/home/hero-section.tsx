"use client";

import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function HeroSection() {
    const { data: session } = useSession();

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="from-background via-background to-muted/30 absolute inset-0 bg-gradient-to-br" />

            {/* Radial gradient overlay */}
            <div className="bg-gradient-radial from-primary/5 absolute inset-0 via-transparent to-transparent" />

            {/* Grid pattern overlay */}
            <div className="bg-grid-black/[0.02] absolute inset-0 bg-[size:60px_60px] opacity-40" />

            <div className="relative container mx-auto px-4 text-center">
                <div className="mx-auto max-w-6xl space-y-8">
                    {/* Badge */}
                    <div className="animate-fade-in-up">
                        <div className="bg-muted/50 inline-flex items-center rounded-full border px-6 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
                            <Link2 className="text-primary mr-2 h-4 w-4" />
                            Smart URL shortening made simple
                        </div>
                    </div>

                    {/* Main heading */}
                    <div className="animate-fade-in-up animation-delay-200 space-y-6">
                        <h1 className="font-bold tracking-tight sm:text-7xl">
                            Shorten links.{" "}
                            <span className="from-primary via-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                                Amplify results.
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-muted-foreground mx-auto max-w-5xl text-xl leading-relaxed md:text-2xl">
                            Create powerful shortened links with advanced analytics, custom domains,
                            and smart targeting. Perfect for marketers, businesses, and creators.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="animate-fade-in-up animation-delay-400">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                            {session ? (
                                <Link href="/dashboard/links">
                                    <Button
                                        size="lg"
                                        className="h-12 w-full px-8 text-base sm:w-auto"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/auth/register">
                                        <Button
                                            size="lg"
                                            className="h-12 w-full px-8 text-base shadow-lg transition-shadow hover:shadow-xl sm:w-auto"
                                        >
                                            Start for Free
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="#features">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="hover:border-primary/50 h-12 w-full border-2 px-8 text-base sm:w-auto"
                                        >
                                            Learn More
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="animate-fade-in-up animation-delay-600 pt-8">
                        <div className="flex flex-col items-center gap-6">
                            <p className="text-muted-foreground text-sm font-medium">
                                Trusted by 15,000+ users worldwide
                            </p>
                            <div className="flex items-center justify-center gap-8 opacity-60">
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    99.9% Uptime
                                </div>
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    2M+ Links Created
                                </div>
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                    GDPR Compliant
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
