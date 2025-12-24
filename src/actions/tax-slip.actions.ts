"use server";

import { taxSlipSchema } from "@/lib/validations/tax-slip";
import { createClient } from "../../supabase/server";
import { getCurrentUser } from "./auth.actions";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { TaxSlip } from "@/types";

type ActionResponse<T = undefined> = {
    success?: boolean;
    error?: string;
    data?: T;
};

// Generate unique file name for storage
function generateFileName(userId: string, originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileExt = originalName.split('.').pop();
    return `${userId}/${timestamp}-${random}.${fileExt}`;
}

// Upload tax slip - Mutation function
export async function uploadTaxSlip(formData: FormData): Promise<ActionResponse<TaxSlip>> {
    try {
        // Get authenticated user
        const user = await getCurrentUser();
        if (!user) {
            return { error: "Authentication required" };
        }

        // Extract form data
        const file = formData.get("file") as File;
        const category = formData.get("category") as string;
        const amountStr = formData.get("amount") as string;
        const date = formData.get("date") as string;
        const description = formData.get("description") as string || "";

        // Validate data - Zod will handle the type coercion for amount
        const validatedData = taxSlipSchema.parse({
            category,
            amount: amountStr,
            date,
            description,
            file,
        });

        const supabase = await createClient();

        // Generate unique file name
        const fileName = generateFileName(user.id, file.name);

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('tax-slips')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            return { error: `File upload failed: ${uploadError.message}` };
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase
            .storage
            .from('tax-slips')
            .getPublicUrl(fileName);

        // Insert tax slip record into database
        const { data: taxSlipData, error: insertError } = await supabase
            .from('tax_slips')
            .insert({
                user_id: user.id,
                category: validatedData.category,
                amount: validatedData.amount,
                date: validatedData.date,
                description: validatedData.description,
                file_url: urlData.publicUrl,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type,
            })
            .select()
            .single();

        if (insertError) {
            // If database insert fails, clean up uploaded file
            await supabase.storage.from('tax-slips').remove([fileName]);
            return { error: `Database error: ${insertError.message}` };
        }

        return { success: true, data: taxSlipData as TaxSlip };
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

// Get user's tax slips - Query function for server components
export async function getUserTaxSlips(userId: string): Promise<TaxSlip[]> {
    try {
        const supabase = await createClient();

        const { data: taxSlips, error } = await supabase
            .from('tax_slips')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tax slips:', error);
            return [];
        }

        return (taxSlips as TaxSlip[]) || [];
    } catch (error) {
        console.error('Error in getUserTaxSlips:', error);
        return [];
    }
}

// Get single tax slip by ID - Query function for server components
export async function getTaxSlipById(id: string): Promise<TaxSlip | null> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return null;
        }

        const supabase = await createClient();

        const { data: taxSlip, error } = await supabase
            .from('tax_slips')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id) // Ensure user owns the tax slip
            .single();

        if (error) {
            console.error('Error fetching tax slip:', error);
            return null;
        }

        return taxSlip as TaxSlip;
    } catch (error) {
        console.error('Error in getTaxSlipById:', error);
        return null;
    }
}

// Delete tax slip - Mutation function
export async function deleteTaxSlip(id: string): Promise<ActionResponse> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { error: "Authentication required" };
        }

        const supabase = await createClient();

        // First, get the tax slip to verify ownership and get file info
        const { data: taxSlip, error: fetchError } = await supabase
            .from('tax_slips')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !taxSlip) {
            return { error: "Tax slip not found or access denied" };
        }

        // Extract file path from URL for deletion
        const url = new URL(taxSlip.file_url);
        const filePath = url.pathname.split('/').slice(-2).join('/'); // Get userId/filename part

        // Delete file from storage
        const { error: storageError } = await supabase
            .storage
            .from('tax-slips')
            .remove([filePath]);

        if (storageError) {
            console.error('Storage deletion error:', storageError);
            // Continue with database deletion even if file deletion fails
        }

        // Delete record from database
        const { error: deleteError } = await supabase
            .from('tax_slips')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (deleteError) {
            return { error: `Failed to delete tax slip: ${deleteError.message}` };
        }

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "An unexpected error occurred" };
    }
}

// Get dashboard statistics - Query function for server components
export async function getDashboardData(userId: string) {
    try {
        const supabase = await createClient();

        const { data: taxSlips, error } = await supabase
            .from('tax_slips')
            .select('category, amount, date')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching dashboard data:', error);
        return {
            totalAmount: 0,
            totalSlips: 0,
            categoryBreakdown: {},
            monthlyData: [],
        };
        }

        const total = taxSlips?.reduce((sum, slip) => sum + parseFloat(slip.amount.toString()), 0) || 0;
        const categoryBreakdown = taxSlips?.reduce((acc: Record<string, number>, slip) => {
            acc[slip.category] = (acc[slip.category] || 0) + parseFloat(slip.amount.toString());
            return acc;
        }, {}) || {};

        return {
            totalAmount: total,
            totalSlips: taxSlips?.length || 0,
            categoryBreakdown,
            monthlyData: (taxSlips as TaxSlip[]) || [],
        };
    } catch (error) {
        console.error('Error in getDashboardData:', error);
        return {
            totalAmount: 0,
            totalSlips: 0,
            categoryBreakdown: {},
            monthlyData: [],
        };
    }
}

// Get tax slips by date range - Query function
export async function getTaxSlipsByDateRange(startDate: string, endDate: string): Promise<TaxSlip[]> {
    try {
        const supabase = await createClient();

        console.log(`[getTaxSlipsByDateRange] Fetching tax slips between ${startDate} and ${endDate}`);

        // First, try to get ALL tax slips to see if data exists
        const { data: allTaxSlips, error: allError } = await supabase
            .from('tax_slips')
            .select('*')
            .order('date', { ascending: false });

        console.log(`[getTaxSlipsByDateRange] Total tax slips in database: ${allTaxSlips?.length || 0}`);
        
        if (allTaxSlips && allTaxSlips.length > 0) {
            console.log('[getTaxSlipsByDateRange] Date range in database:', {
                earliest: allTaxSlips[allTaxSlips.length - 1]?.date,
                latest: allTaxSlips[0]?.date,
            });
            console.log('[getTaxSlipsByDateRange] Sample record:', allTaxSlips[0]);
        }

        // Ensure dates are in YYYY-MM-DD format for DATE comparison
        const normalizedStartDate = startDate.split('T')[0]; // Remove time if present
        const normalizedEndDate = endDate.split('T')[0]; // Remove time if present
        
        console.log(`[getTaxSlipsByDateRange] Normalized dates: ${normalizedStartDate} to ${normalizedEndDate}`);

        // Now apply date filter - use string comparison for DATE fields
        const { data: taxSlips, error } = await supabase
            .from('tax_slips')
            .select('*')
            .gte('date', normalizedStartDate)
            .lte('date', normalizedEndDate)
            .order('date', { ascending: false });

        if (error) {
            console.error('[getTaxSlipsByDateRange] Error with date filter:', error.message, error.details);
            return [];
        }

        console.log(`[getTaxSlipsByDateRange] Found ${taxSlips?.length || 0} tax slips in date range`);

        if (taxSlips && taxSlips.length > 0) {
            console.log('[getTaxSlipsByDateRange] Sample data:', {
                count: taxSlips.length,
                firstRecord: taxSlips[0],
                amounts: taxSlips.map(t => t.amount),
            });
        }

        return (taxSlips as TaxSlip[]) || [];
    } catch (error) {
        console.error('[getTaxSlipsByDateRange] Exception:', error);
        return [];
    }
}
