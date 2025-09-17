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

    // Add search parameter if provided
    if (params.search && params.search.trim() !== "") {
        searchParams.append("search", params.search.trim());
    }

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

export async function updateLink(id: string, linkData: Partial<ILinkForm>): Promise<ILink> {
    const response = await fetch("/api/link", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...linkData }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const error: ApiError = new Error(errorData.message || `Failed to update link: ${response.statusText}`);
        error.fieldErrors = errorData.fieldErrors;
        error.status = response.status;
        throw error;
    }

    return response.json();
}

export async function deleteLink(id: string): Promise<void> {
    const response = await fetch("/api/link", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const error: ApiError = new Error(errorData.message || `Failed to delete link: ${response.statusText}`);
        error.status = response.status;
        throw error;
    }
}