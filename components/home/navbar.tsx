"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth-client";
import { ModeToggle } from "@/components/mode-toggle";
import { siteConfig } from "@/config/site";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#stats", label: "Stats" },
    { href: "#faq", label: "FAQ" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Link2 className="h-6 w-6" />
                    <span className="text-xl font-bold">{siteConfig.name}</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center space-x-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden items-center space-x-4 md:flex">
                    <ModeToggle varient="icon" />
                    {session ? (
                        <Link href="/dashboard/links">
                            <Button size="sm">Dashboard</Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <Button size="sm">Login</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex items-center space-x-2 md:hidden">
                    <ModeToggle varient="icon" />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[240px] p-4 sm:w-[300px]">
                            <div className="mt-8 flex flex-col space-y-4">
                                {/* Mobile Navigation Links */}
                                <nav className="flex flex-col space-y-3">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={handleLinkClick}
                                            className="text-muted-foreground hover:text-foreground py-2 text-sm font-medium transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>

                                {/* Mobile Auth Buttons */}
                                <div className="flex flex-col space-y-3 border-t pt-4">
                                    {session ? (
                                        <Link href="/dashboard/links" onClick={handleLinkClick}>
                                            <Button className="w-full">Dashboard</Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" onClick={handleLinkClick}>
                                                <Button className="w-full">Login</Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
