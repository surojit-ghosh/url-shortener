import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IPaginationQuery, ILinkResponse, ILinkForm, ILink } from "../zod/link.schema";
import { getLinks, createLink } from "../api/link";

export const useLinks = (params: IPaginationQuery) => {
    return useQuery<ILinkResponse>({
        queryKey: ["links", params.page, params.limit],
        queryFn: () => getLinks(params),
        staleTime: 60_000,
    });
};

// Infinite query hook for paginated links with infinite scroll
export const useInfiniteLinks = (limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: ["links", "infinite"],
        queryFn: ({ pageParam = 1 }) => getLinks({ page: pageParam, limit }),
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
            // Invalidate and refetch links queries
            queryClient.invalidateQueries({ queryKey: ["links"] });

            // Optionally, you can also reset the infinite query to start from page 1
            queryClient.resetQueries({ queryKey: ["links", "infinite"] });
        },
        onError: (error) => {
            console.error("Failed to create link:", error);
        },
    });
};
