import { z } from "zod";

export const taxSlipSchema = z.object({
    cnic: z.string().min(13, "Invalid CNIC").max(13, "Invalid CNIC"),
    year: z.number().min(2000).max(new Date().getFullYear()),
    category: z.string().min(1, "Category is required"),
    amount: z.number().min(0, "Amount must be positive"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date",
    }),
    description: z.string().min(5, "Description must be at least 5 characters"),
    document: z.instanceof(File).optional(),
});

export type TaxSlipSchema = z.infer<typeof taxSlipSchema>;
