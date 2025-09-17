import { z } from "zod";

// Schema for geo targeting rules
export const geoTargetingSchema = z.record(
    z.string().length(2, "Country code must be 2 characters"),
    z.string().url("Must be a valid URL")
).optional();

// Schema for device targeting rules  
export const deviceTargetingSchema = z.record(
    z.enum(["windows", "macos", "linux", "android", "ios"], {
        message: "Invalid device/OS type"
    }),
    z.string().url("Must be a valid URL")
).optional();

// Schema for metadata
export const metadataSchema = z.object({
    title: z.string().optional().refine(
        (title) => {
            if (!title || title === "") return true;
            return title.length <= 100;
        },
        { message: "Title must be at most 100 characters" }
    ),
    description: z.string().optional().refine(
        (description) => {
            if (!description || description === "") return true;
            return description.length <= 300;
        },
        { message: "Description must be at most 300 characters" }
    ),
    image: z.string().optional().refine(
        (image) => {
            if (!image || image === "") return true;
            try {
                new URL(image);
                return true;
            } catch {
                return false;
            }
        },
        { message: "Image must be a valid URL" }
    )
}).optional();

export const linkSchema = z.object({
    id: z.string().optional(), // Optional for forms, present in API responses
    url: z.string().url({ message: "Invalid URL" }),
    key: z.string({ required_error: "Slug is required" })
        .min(1, "Slug is required")
        .max(25, { message: "Slug must be at most 25 characters" })
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Slug can only contain letters, numbers, hyphens, and underscores (no spaces)"
        ),
    password: z.string().optional().refine(
        (password) => {
            if (!password || password === "") return true; // Allow empty string or undefined
            return password.length >= 4; // Minimum 4 characters if provided
        },
        { message: "Password must be at least 4 characters long" }
    ),
    geoTargeting: geoTargetingSchema,
    deviceTargeting: deviceTargetingSchema,
    metadata: metadataSchema,
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

// For form input (excludes auto-generated fields)
export const linkFormSchema = linkSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type ILink = z.infer<typeof linkSchema>;
export type ILinkForm = z.infer<typeof linkFormSchema>;

// Schema for password verification
export const passwordVerificationSchema = z.object({
    password: z.string().min(1, "Password is required"),
});

export type IPasswordVerification = z.infer<typeof passwordVerificationSchema>;

export type IPaginationQuery = {
    page: number;
    limit: number;
    search?: string;
};

export const paginatedLinksSchema = z.object({
    data: z.array(linkSchema),
    page: z.number(),
    total: z.number(),
    totalPages: z.number(),
});

export type ILinkResponse = z.infer<typeof paginatedLinksSchema>;
