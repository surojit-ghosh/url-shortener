import DashboardSidebar from "./components/sidebar";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <DashboardSidebar>{children}</DashboardSidebar>;
}
