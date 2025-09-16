import DashboardSidebar from "@/components/dashboard-sidebar";
import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import React from "react";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();

    if (!session) {
        redirect("/");
    }

    return <DashboardSidebar>{children}</DashboardSidebar>;
}
