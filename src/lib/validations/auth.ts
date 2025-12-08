import { z } from "zod";

// CNIC validation: Pakistani CNIC format (13 digits, can have dashes)
const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$|^[0-9]{13}$/;

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "First name must be at least 2 characters")
            .max(100, "First name must not exceed 100 characters"),
        lastName: z
            .string()
            .min(2, "Last name must be at least 2 characters")
            .max(100, "Last name must not exceed 100 characters"),
        cnic: z
            .string()
            .min(1, "CNIC is required")
            .regex(cnicRegex, "Please enter a valid CNIC (format: 12345-1234567-1 or 1234512345671)"),
        contactNo: z
            .string()
            .min(10, "Contact number must be at least 10 digits")
            .max(20, "Contact number must not exceed 20 characters")
            .regex(/^[0-9+\-\s()]+$/, "Please enter a valid contact number"),
        email: z.string().email("Please enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
