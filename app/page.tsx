import Link from "next/link";
import { ArrowRight, BarChart3, Check, ExternalLink, Globe, Link2, Lock, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex w-full border-b backdrop-blur">
                <div className="container mx-auto flex h-16 w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <Link2 className="h-5 w-5" />
                        <span>LinkShort</span>
                    </div>
                    <nav className="hidden gap-6 md:flex">
                        <Link
                            href="#features"
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#testimonials"
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                        >
                            Testimonials
                        </Link>
                        <Link
                            href="#faq"
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                        >
                            FAQ
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/auth/login" className="hidden sm:block">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </Link>
                        <Link href="/auth/signup">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <section className="from-background to-muted/30 relative overflow-hidden bg-gradient-to-b py-20 sm:py-32">
                    <div className="bg-grid-black/[0.02] absolute inset-0 bg-[size:20px_20px]"></div>
                    <div className="relative container mx-auto w-full">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                Shorten links, <span className="text-primary">amplify results</span>
                            </h1>
                            <p className="text-muted-foreground mt-6 text-lg md:text-xl">
                                Create branded links, QR codes, and link-in-bio pages. Track
                                what&apos;s working and what&apos;s not with powerful analytics.
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link href="/auth/signup">
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-background mt-16 rounded-lg border p-4 shadow-lg sm:p-6 lg:p-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                    <div className="bg-muted text-muted-foreground flex h-10 w-full items-center rounded-md border px-3 text-sm sm:w-auto sm:rounded-l-md sm:rounded-r-none">
                                        linkshort.sh/
                                    </div>
                                    <div className="relative w-full flex-1">
                                        <input
                                            type="text"
                                            placeholder="your-custom-link"
                                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-l-none"
                                        />
                                    </div>
                                    <Button className="w-full sm:w-auto">Shorten</Button>
                                </div>
                                <div className="bg-muted/50 flex items-center justify-between rounded-md border p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                                            <Link2 className="text-primary h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">linkshort.sh/demo</p>
                                            <p className="text-muted-foreground text-xs">
                                                https://example.com/very-long-url-example
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Copy
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="bg-background flex items-center gap-2 rounded-lg border p-4">
                                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                    <Zap className="text-primary h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Fast & Easy</p>
                                    <p className="text-muted-foreground text-sm">
                                        Create links in seconds
                                    </p>
                                </div>
                            </div>
                            <div className="bg-background flex items-center gap-2 rounded-lg border p-4">
                                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                    <BarChart3 className="text-primary h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Detailed Analytics</p>
                                    <p className="text-muted-foreground text-sm">
                                        Track performance
                                    </p>
                                </div>
                            </div>
                            <div className="bg-background flex items-center gap-2 rounded-lg border p-4">
                                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                    <Lock className="text-primary h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Secure Links</p>
                                    <p className="text-muted-foreground text-sm">
                                        Password protection
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="py-20 sm:py-32">
                    <div className="container mx-auto w-full">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Powerful Features
                            </h2>
                            <p className="text-muted-foreground mt-4">
                                Everything you need to create, manage, and track your links in one
                                place.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                            <Zap className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Fast & Easy</h3>
                                        <p className="text-muted-foreground mt-2">
                                            Create short links in seconds with our intuitive
                                            interface. No technical knowledge required.
                                        </p>
                                        <ul className="mt-4 space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Custom branded links</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Bulk link creation</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Link management dashboard</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                            <BarChart3 className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Detailed Analytics</h3>
                                        <p className="text-muted-foreground mt-2">
                                            Track clicks, locations, devices, and more with
                                            real-time data and beautiful visualizations.
                                        </p>
                                        <ul className="mt-4 space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Real-time click tracking</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Geographic data</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Device & referrer tracking</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                            <Globe className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Advanced Targeting</h3>
                                        <p className="text-muted-foreground mt-2">
                                            Redirect users based on location, device, or other
                                            parameters for a personalized experience.
                                        </p>
                                        <ul className="mt-4 space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Geo-targeting</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Device targeting</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Time-based redirects</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                            <Lock className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Secure Links</h3>
                                        <p className="text-muted-foreground mt-2">
                                            Add password protection and expiration dates to your
                                            links for enhanced security.
                                        </p>
                                        <ul className="mt-4 space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Password protection</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Link expiration</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Access controls</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                            <Link2 className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Custom URLs</h3>
                                        <p className="text-muted-foreground mt-2">
                                            Create branded, memorable links with custom URL keys
                                            that reflect your brand.
                                        </p>
                                        <ul className="mt-4 space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Custom domains</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Branded links</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>QR code generation</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                            <ExternalLink className="text-primary h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">API Access</h3>
                                        <p className="text-muted-foreground mt-2">
                                            Integrate link shortening into your applications with
                                            our comprehensive API.
                                        </p>
                                        <ul className="mt-4 space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>RESTful API</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Webhooks</span>
                                            </li>
                                            <li className="flex items-center">
                                                <Check className="text-primary mr-2 h-4 w-4" />
                                                <span>Developer documentation</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section id="pricing" className="bg-muted/30 py-20 sm:py-32">
                    <div className="container mx-auto w-full">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-muted-foreground mt-4">
                                Choose the plan that&apos;s right for you, from free to enterprise.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="flex flex-col">
                                <CardContent className="flex flex-1 flex-col pt-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold">Free</h3>
                                        <p className="text-3xl font-bold">$0</p>
                                        <p className="text-muted-foreground text-sm">
                                            Forever free
                                        </p>
                                    </div>
                                    <ul className="mb-8 space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Up to 50 links</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Basic analytics</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>QR code generation</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Link customization</span>
                                        </li>
                                    </ul>
                                    <div className="mt-auto">
                                        <Button variant="outline" className="w-full">
                                            Get Started
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-primary flex flex-col">
                                <CardContent className="flex flex-1 flex-col pt-6">
                                    <div className="mb-4">
                                        <div className="bg-primary/10 text-primary mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium">
                                            Popular
                                        </div>
                                        <h3 className="text-lg font-bold">Pro</h3>
                                        <p className="text-3xl font-bold">$19</p>
                                        <p className="text-muted-foreground text-sm">per month</p>
                                    </div>
                                    <ul className="mb-8 space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Unlimited links</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Advanced analytics</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Custom domains</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Password protection</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Link expiration</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>API access</span>
                                        </li>
                                    </ul>
                                    <div className="mt-auto">
                                        <Button className="w-full">Get Started</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="flex flex-col">
                                <CardContent className="flex flex-1 flex-col pt-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold">Enterprise</h3>
                                        <p className="text-3xl font-bold">Custom</p>
                                        <p className="text-muted-foreground text-sm">
                                            Contact for pricing
                                        </p>
                                    </div>
                                    <ul className="mb-8 space-y-2 text-sm">
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Everything in Pro</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Team collaboration</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Advanced security</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Priority support</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>Custom integrations</span>
                                        </li>
                                        <li className="flex items-center">
                                            <Check className="text-primary mr-2 h-4 w-4" />
                                            <span>SLA guarantees</span>
                                        </li>
                                    </ul>
                                    <div className="mt-auto">
                                        <Button variant="outline" className="w-full">
                                            Contact Sales
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section id="testimonials" className="py-20 sm:py-32">
                    <div className="container mx-auto w-full">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Trusted by thousands
                            </h2>
                            <p className="text-muted-foreground mt-4">
                                See what our customers have to say about LinkShort.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i}>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-0.5">
                                                {Array(5)
                                                    .fill(null)
                                                    .map((_, j) => (
                                                        <svg
                                                            key={j}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className="h-5 w-5 text-yellow-400"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    ))}
                                            </div>
                                            <p className="text-muted-foreground">
                                                &quot;LinkShort has transformed how we share links
                                                with our customers. The analytics are incredibly
                                                detailed and have helped us optimize our marketing
                                                campaigns.&quot;
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-muted-foreground h-5 w-5"
                                                    >
                                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Jane Smith</p>
                                                    <p className="text-muted-foreground text-xs">
                                                        Marketing Director, Acme Inc
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="faq" className="bg-muted/30 py-20 sm:py-32">
                    <div className="container mx-auto w-full">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-muted-foreground mt-4">
                                Find answers to common questions about LinkShort.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 md:grid-cols-2">
                            <div>
                                <h3 className="text-lg font-bold">What is LinkShort?</h3>
                                <p className="text-muted-foreground mt-2">
                                    LinkShort is a link management platform that lets you create
                                    short, branded links, QR codes, and link-in-bio pages. Track
                                    what&apos;s working with powerful analytics and optimize your
                                    marketing campaigns.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">How much does LinkShort cost?</h3>
                                <p className="text-muted-foreground mt-2">
                                    LinkShort offers a free plan with basic features. Our Pro plan
                                    starts at $19/month and includes advanced features like custom
                                    domains and unlimited links. Enterprise plans are available for
                                    larger teams.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Can I use my own domain?</h3>
                                <p className="text-muted-foreground mt-2">
                                    Yes! Pro and Enterprise plans allow you to use your own custom
                                    domain for branded links. This helps maintain brand consistency
                                    and increases trust with your audience.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    How detailed are the analytics?
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    Our analytics track clicks, geographic location, devices,
                                    referrers, and more. Pro and Enterprise plans include even more
                                    detailed analytics with custom reporting options.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                ;
                <section className="py-20 sm:py-32">
                    <div className="container mx-auto w-full">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Ready to get started?
                            </h2>
                            <p className="text-muted-foreground mt-4">
                                Join thousands of marketers, content creators, and businesses who
                                use LinkShort to optimize their link sharing.
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link href="/auth/signup">
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Sign Up for Free <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="#pricing">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        View Pricing
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t py-8">
                <div className="container mx-auto flex w-full flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-2 font-bold">
                        <Link2 className="h-4 w-4" />
                        <span>LinkShort</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        © 2024 LinkShort. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Terms
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
