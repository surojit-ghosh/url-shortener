import { Link2, BarChart3, Shield, Globe, Zap, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Create shortened links instantly with our optimized infrastructure. No delays, just results.",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description:
            "Get detailed insights into your link performance with real-time click tracking and geographic data.",
    },
    {
        icon: Link2,
        title: "Custom Links",
        description:
            "Create branded, memorable links with custom domains and personalized short codes.",
    },
    {
        icon: Shield,
        title: "Secure & Protected",
        description:
            "Add password protection, expiration dates, and advanced security features to your links.",
    },
    {
        icon: Globe,
        title: "Smart Targeting",
        description:
            "Redirect users based on their location, device, or other parameters for personalized experiences.",
    },
    {
        icon: QrCode,
        title: "QR Code Generation",
        description: "Automatically generate high-quality QR codes for all your shortened links.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to manage your links
                    </h2>
                    <p className="text-muted-foreground mt-6 text-lg leading-8">
                        Powerful features designed to help you create, manage, and track your
                        shortened links with ease and precision.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {features.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                            <Card
                                key={feature.title}
                                className="group transition-all duration-300 hover:shadow-lg"
                            >
                                <CardContent className="p-8">
                                    <div className="flex flex-col items-start">
                                        <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-3 transition-colors">
                                            <IconComponent className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="mt-6 text-lg leading-8 font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground mt-2 text-base leading-7">
                                            {feature.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
