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
});

export type LinkData = z.infer<typeof linkSchema>;