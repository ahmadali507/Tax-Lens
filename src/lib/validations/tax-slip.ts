import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

export const taxSlipSchema = z.object({
    category: z.enum([
        "income",
        "food",
        "travel",
        "utilities",
        "healthcare",
        "education",
        "entertainment",
        "other",
    ]),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    date: z.string().min(1, "Date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
    description: z.string().optional(),
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png, and .pdf files are accepted"
        ),
});

// FormData schema for server actions
export const taxSlipFormDataSchema = z.object({
    category: z.string().min(1, "Category is required"),
    amount: z.string().min(1, "Amount is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
    file: z.instanceof(File),
});

export type TaxSlipFormData = z.infer<typeof taxSlipSchema>;
