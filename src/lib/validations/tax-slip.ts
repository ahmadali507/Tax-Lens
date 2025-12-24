import { z } from "zod";

// File validation - accept any file but check it exists
const fileSchema = z.instanceof(File, { message: "Please upload a valid file" })
    .refine(file => file.size > 0, "File cannot be empty")
    .refine(file => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB");

export const taxSlipSchema = z.object({
    category: z.string().min(1, "Category is required"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional().or(z.literal("")),
    file: fileSchema,
});

export type TaxSlipSchema = z.infer<typeof taxSlipSchema>;
