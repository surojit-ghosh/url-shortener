import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IPaginationQuery, ILinkResponse, ILinkForm, ILink } from "../zod/link.schema";
import { getLinks, createLink, updateLink, deleteLink } from "../api/link";

export const useLinks = (params: IPaginationQuery) => {
    return useQuery<ILinkResponse>({
        queryKey: ["links", params.page, params.limit, params.search],
        queryFn: () => getLinks(params),
        staleTime: 60_000,
    });
};

// Infinite query hook for paginated links with infinite scroll
export const useInfiniteLinks = (limit: number = 10, search?: string) => {
    return useInfiniteQuery({
        queryKey: ["links", "infinite", search],
        queryFn: ({ pageParam = 1 }) => getLinks({ page: pageParam, limit, search }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            // If current page is less than total pages, return next page
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            // No more pages
            return undefined;
        },
        staleTime: 60_000,
    });
};

// Mutation hook for creating new links
export const useCreateLink = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (linkData: ILinkForm): Promise<ILink> => {
            return await createLink(linkData);
        },
        onSuccess: () => {
            // Invalidate and refetch all links queries (including different search terms)
            queryClient.invalidateQueries({
                queryKey: ["links"],
                exact: false // This will invalidate all queries that start with ["links"]
            });

            // Reset the infinite query to start from page 1 to show the new link
            queryClient.resetQueries({
                queryKey: ["links", "infinite"],
                exact: false // This will reset all infinite queries regardless of search term
            });
        },
        onError: (error) => {
            console.error("Failed to create link:", error);
        },
    });
};

// Mutation hook for updating links
export const useUpdateLink = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...linkData }: { id: string } & Partial<ILinkForm>): Promise<ILink> => {
            return await updateLink(id, linkData);
        },
        onSuccess: () => {
            // For update operations, it's safer to just invalidate and refetch
            // This ensures data consistency and avoids cache update errors
            queryClient.invalidateQueries({
                queryKey: ["links"],
                exact: false // This will invalidate all queries that start with ["links"]
            });
        },
        onError: (error) => {
            console.error("Failed to update link:", error);
        },
    });
};

// Mutation hook for deleting links
export const useDeleteLink = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            return await deleteLink(id);
        },
        onSuccess: () => {
            // For delete operations, invalidate all queries to ensure consistency
            queryClient.invalidateQueries({
                queryKey: ["links"],
                exact: false // This will invalidate all queries that start with ["links"]
            });
        },
        onError: (error) => {
            console.error("Failed to delete link:", error);
        },
    });
};
