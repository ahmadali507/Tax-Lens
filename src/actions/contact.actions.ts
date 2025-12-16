"use server";

import { contactSchema, type ContactFormData } from "@/lib/validations/contact";

export async function submitContactForm(data: ContactFormData) {
    try {
        // Validate the form data
        const validatedData = contactSchema.parse(data);

        // TODO: Implement actual email sending logic here
        // For now, we'll just simulate a successful submission
        console.log("Contact form submitted:", validatedData);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return { success: true };
    } catch (error) {
        console.error("Contact form submission error:", error);
        return {
            error: "Failed to send message. Please try again later.",
        };
    }
}
