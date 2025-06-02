import DashboardSidebar from "@/components/dashboard-sidebar";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <DashboardSidebar>{children}</DashboardSidebar>;
}
