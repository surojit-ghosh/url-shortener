"use client";

import React from "react";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChartBar, Link as LinkIcon, LogOut, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { ModeToggle } from "./mode-toggle";

const items = [
    {
        title: "Links",
        url: "/dashboard/links",
        icon: LinkIcon,
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: ChartBar,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

const DashboardSidebar = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

    return (
        <SidebarProvider>
            <Sidebar variant="inset" className="">
                <SidebarHeader className="p-4 pb-2 md:p-2 md:pb-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard/links" className="flex items-center gap-2">
                            <Logo />
                            <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
                        </Link>
                        <ModeToggle />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu className="space-y-1 p-2 md:p-0">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    className="h-9"
                                    asChild
                                    isActive={pathname === item.url}
                                >
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="p-2 pb-4 md:p-0 md:pb-2">
                    <div className="bg-secondary flex items-center gap-2 p-2">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src={session?.user.image ?? undefined}
                                alt={session?.user.name}
                            />
                            <AvatarFallback className="rounded-lg">
                                {session?.user.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{session?.user.name}</span>
                            <span className="truncate text-xs">{session?.user.email}</span>
                        </div>
                    </div>

                    <Button variant={"destructive"} onClick={handleSignOut}>
                        <LogOut />
                        Log out
                    </Button>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="">
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="">
                                    <BreadcrumbLink href="/dashboard/links">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {items.filter((i) => pathname.startsWith(i.url))?.[0].title}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardSidebar;
