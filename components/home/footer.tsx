import Link from "next/link";
import { Link2, Github, Twitter, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

const footerLinks = {
    product: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "API Documentation", href: "/docs" },
        { label: "Status", href: "/status" },
    ],
    company: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Security", href: "/security" },
    ],
    social: [
        { label: "Twitter", href: "https://twitter.com/surojitghosh_", icon: Twitter },
        { label: "GitHub", href: "https://github.com/surojit-ghosh", icon: Github },
        { label: "Email", href: "mailto:contact@surojit.in", icon: Mail },
    ],
};

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-16">
                {/* Main footer content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* Brand section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <Link2 className="h-6 w-6" />
                            <span className="text-xl font-bold">{siteConfig.name}</span>
                        </Link>
                        <p className="text-muted-foreground mt-4 max-w-md text-sm">
                            The smart way to shorten, share, and track your links. Built for modern
                            teams and individuals who value simplicity and powerful analytics.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            {footerLinks.social.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.label}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links sections */}
                    <div>
                        <h3 className="text-sm font-semibold">Product</h3>
                        <ul className="mt-6 space-y-4">
                            {footerLinks.product.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Company</h3>
                        <ul className="mt-6 space-y-4">
                            {footerLinks.company.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Legal</h3>
                        <ul className="mt-6 space-y-4">
                            {footerLinks.legal.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom section */}
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-muted-foreground text-sm">
                        © 2024 {siteConfig.name}. All rights reserved.
                    </p>
                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span>Made by Surojit</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
