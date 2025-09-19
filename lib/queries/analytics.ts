import { useQuery, useMutation } from "@tanstack/react-query";
import { trackClick, getAnalytics, getDashboardAnalytics } from "../api/analytics";
import { trackClickAction } from "../actions/analytics.action";

interface AnalyticsData {
    linkKey: string;
    targetUrl: string;
    clientIP?: string;
    userAgent?: string;
    countryCode?: string;
    deviceType?: string;
    referer?: string;
}

export const useAnalytics = (linkKey: string) => {
    return useQuery({
        queryKey: ["analytics", linkKey],
        queryFn: () => getAnalytics(linkKey),
        staleTime: 30_000,
        enabled: !!linkKey,
    });
};

export const useDashboardAnalytics = () => {
    return useQuery({
        queryKey: ["analytics", "dashboard"],
        queryFn: getDashboardAnalytics,
        staleTime: 60_000,
    });
};

export const useTrackClick = () => {
    return useMutation({
        mutationFn: (data: AnalyticsData) => trackClickAction(data),
        onError: (error) => {
            console.error("Failed to track click:", error);
        },
    });
};

export const useTrackClickAPI = () => {
    return useMutation({
        mutationFn: (data: AnalyticsData) => trackClick(data),
        onError: (error) => {
            console.error("Failed to track click:", error);
        },
    });
};