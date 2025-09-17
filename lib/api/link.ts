import { ILinkResponse, IPaginationQuery, ILinkForm, ILink } from "../zod/link.schema";

// Define custom error type for API errors
interface ApiError extends Error {
    fieldErrors?: Partial<Record<keyof ILinkForm, string[]>>;
    status?: number;
}

export async function getLinks(params: IPaginationQuery): Promise<ILinkResponse> {
    const searchParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
    });

    console.log("Fetching links with params:", params);

    const response = await fetch(`/api/link?${searchParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch links:", response.status, response.statusText);
        throw new Error(`Failed to fetch links: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
}

export async function createLink(linkData: ILinkForm): Promise<ILink> {
    const response = await fetch("/api/link", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(linkData),
    });

    if (!response.ok) {
        const errorData = await response.json();

        // Create a more detailed error object that includes field errors
        const error: ApiError = new Error(errorData.message || `Failed to create link: ${response.statusText}`);
        error.fieldErrors = errorData.fieldErrors;
        error.status = response.status;

        throw error;
    }

    return response.json();
}