import { useInfiniteLinks } from "@/lib/queries/links";
import { useEffect, useRef } from "react";
import LinkCard from "./link-card";
import { Button } from "@/components/ui/button";

interface AllLinksProps {
    searchTerm: string;
}

const AllLinks = ({ searchTerm }: AllLinksProps) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
        useInfiniteLinks(10, searchTerm);

    // Ref for the intersection observer element
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Debug logging
    console.log("AllLinks Debug:", {
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        pagesCount: data?.pages?.length,
        totalLinks: data?.pages.flatMap((page) => page.data).length,
        lastPage: data?.pages?.[data.pages.length - 1],
    });

    // Intersection observer to trigger loading more when scrolled to bottom
    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                console.log("Intersection Observer:", {
                    isIntersecting: entry.isIntersecting,
                    hasNextPage,
                    isFetchingNextPage,
                });
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    console.log("Fetching next page...");
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
                        className="border-muted flex animate-pulse items-center gap-4 border p-4"
                    >
                        <div className="bg-muted h-12 w-12 rounded-full"></div>
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
                />
            ))}

            {/* Invisible element to trigger intersection observer */}
            <div ref={loadMoreRef} className="h-10 py-4">
                {isFetchingNextPage && (
                    <div className="py-4 text-center">
                        <div className="inline-flex items-center">
                            <div className="border-primary mr-2 h-4 w-4 animate-spin rounded-full border-b-2"></div>
                            Loading more links...
                        </div>
                    </div>
                )}
                {hasNextPage && !isFetchingNextPage && (
                    <div className="space-y-2 text-center">
                        <div className="text-muted-foreground py-2 text-sm">
                            Scroll down to load more...
                        </div>
                        <Button onClick={() => fetchNextPage()} variant="outline" size="sm">
                            Load More Links
                        </Button>
                    </div>
                )}
            </div>

            {/* End of list indicator */}
            {!hasNextPage && allLinks.length > 0 && (
                <div className="text-muted-foreground py-4 text-center text-sm">
                    You&apos;ve reached the end of your links
                </div>
            )}

            {/* Empty state */}
            {allLinks.length === 0 && !isLoading && (
                <div className="py-8 text-center">
                    {searchTerm ? (
                        <div className="space-y-2">
                            <p className="text-muted-foreground">
                                No links found matching &ldquo;{searchTerm}&rdquo;
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Try adjusting your search or create a new link
                            </p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No links found. Create your first link!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllLinks;
