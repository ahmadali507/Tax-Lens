"use server";

import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../../supabase/server";

// Normalize CNIC (remove dashes for storage)
function normalizeCnic(cnic: string): string {
    return cnic.replace(/-/g, "");
}

export async function signUp(formData: z.infer<typeof registerSchema>) {
    try {
        const validatedData = registerSchema.parse(formData);
        const supabase = await createClient();

        // Normalize CNIC
        const normalizedCnic = normalizeCnic(validatedData.cnic);

        // Check if CNIC already exists in users table
        const { data: existingUser } = await supabase
            .from("users")
            .select("cnic")
            .eq("cnic", normalizedCnic)
            .single();

        if (existingUser) {
            return { error: "CNIC already registered. Please use a different CNIC." };
        }

        // Check if email already exists in users table
        const { data: existingEmail } = await supabase
            .from("users")
            .select("email")
            .eq("email", validatedData.email)
            .single();

        if (existingEmail) {
            return { error: "Email already registered. Please use a different email." };
        }

        // Create Supabase Auth user first (handles password hashing automatically)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: validatedData.email,
            password: validatedData.password,
            options: {
                data: {
                    cnic: normalizedCnic,
                    first_name: validatedData.firstName,
                    last_name: validatedData.lastName,
                    contact_no: validatedData.contactNo,
                },
            },
        });

        if (authError) {
            return { error: authError.message };
        }

        if (!authData.user) {
            return { error: "Failed to create user account" };
        }

        // Insert user data into users table (without password)
        const { data: userData, error: insertError } = await supabase
            .from("users")
            .insert({
                id: authData.user.id,
                cnic: normalizedCnic,
                first_name: validatedData.firstName,
                last_name: validatedData.lastName,
                contact_no: validatedData.contactNo,
                email: validatedData.email,
            })
            .select()
            .single();

        if (insertError) {
            // If insert fails, try to clean up auth user
            // Note: Supabase doesn't provide a direct way to delete auth users from client
            // This would need to be handled server-side or manually
            return { error: insertError.message };
        }

        return { success: true, user: userData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return { error: firstError ? firstError.message : "Validation error" };
        }
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unexpected error occurred" };
    }
}

export async function signIn(formData: z.infer<typeof loginSchema>) {
    try {
        const validatedData = loginSchema.parse(formData);
        const supabase = await createClient();

        // Use Supabase Auth to sign in with email and password
        // Supabase handles password verification automatically
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: validatedData.email,
            password: validatedData.password,
        });

        if (authError) {
            return { error: "Invalid email or password" };
        }

        if (!authData.user) {
            return { error: "Authentication failed" };
        }

        // Get user data from our users table
        const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", authData.user.id)
            .single();

        return { success: true, user: userData || authData.user };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return { error: firstError ? firstError.message : "Validation error" };
        }
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unexpected error occurred" };
    }
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function getCurrentUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    // Get user data from our users table using auth user ID
    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    return userData || user;
}
