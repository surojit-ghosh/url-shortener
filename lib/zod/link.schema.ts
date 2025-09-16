import { z } from "zod";

export const linkSchema = z.object({
    url: z.string().url({ message: "Invalid URL" }),
    key: z.string({ required_error: "Slug is required" })
        .min(1, "Slug is required")
        .max(25, { message: "Slug must be at most 25 characters" })
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Slug can only contain letters, numbers, hyphens, and underscores (no spaces)"
        ),
    expiresAt: z.string().optional().refine(
        (date) => {
            if (!date || date === "") return true; // Allow empty string or undefined
            const selectedDate = new Date(date);
            return selectedDate > new Date(); // Must be in the future
        },
        { message: "Expiration date must be in the future" }
    ),
    createdAt: z.string().optional(),  // Optional for form input, required for DB
    updatedAt: z.string().optional(),  // Optional for form input, required for DB
});

// For form input (excludes auto-generated timestamp fields)
export const linkFormSchema = linkSchema.omit({ createdAt: true, updatedAt: true });

export type ILink = z.infer<typeof linkSchema>;
export type ILinkForm = z.infer<typeof linkFormSchema>;

export type IPaginationQuery = {
    page: number;
    limit: number;
};

export const paginatedLinksSchema = z.object({
    data: z.array(linkSchema),
    page: z.number(),
    total: z.number(),
    totalPages: z.number(),
});

export type ILinkResponse = z.infer<typeof paginatedLinksSchema>;
