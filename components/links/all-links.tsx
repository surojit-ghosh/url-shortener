import { useInfiniteLinks } from "@/lib/queries/links";
import { useEffect, useRef } from "react";
import LinkCard from "./link-card";

const AllLinks = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteLinks(10);

    // Ref for the intersection observer element
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Intersection observer to trigger loading more when scrolled to bottom
    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten all pages into a single array of links
    const allLinks = data?.pages.flatMap((page) => page.data) ?? [];

    if (isLoading) {
        return (
            <div className="mt-8 space-y-4">
                {/* Loading skeleton */}
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="border-muted flex items-center gap-4 border p-4 animate-pulse"
                    >
                        <div className="bg-muted rounded-full h-12 w-12"></div>
                        <div className="flex-1 space-y-2">
                            <div className="bg-muted h-4 w-3/4 rounded"></div>
                            <div className="bg-muted h-3 w-1/2 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 text-center">
                <p className="text-red-500">Failed to load links. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            {allLinks.map((link) => (
                <LinkCard
                    key={link.key}
                    shortKey={link.key}
                    url={link.url}
                    createdAt={link.createdAt as string}
                    expiresAt={link.expiresAt}
                />
            ))}

            {/* Invisible element to trigger intersection observer */}
            <div ref={loadMoreRef} className="h-4">
                {isFetchingNextPage && (
                    <div className="text-center py-4">
                        <div className="inline-flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                            Loading more links...
                        </div>
                    </div>
                )}
            </div>

            {/* End of list indicator */}
            {!hasNextPage && allLinks.length > 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                    You&apos;ve reached the end of your links
                </div>
            )}

            {/* Empty state */}
            {allLinks.length === 0 && !isLoading && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No links found. Create your first link!</p>
                </div>
            )}
        </div>
    );
};

export default AllLinks;
