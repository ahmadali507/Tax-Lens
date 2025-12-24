import { getCurrentUser } from "@/actions/auth.actions";
import { getUserTaxSlips } from "@/actions/tax-slip.actions";
import { redirect } from "next/navigation";
import { CategoryPageClient } from "@/components/category/category-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tax Categories - TaxLens",
    description: "View your personal tax breakdown by category",
};

export default async function CategoryPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/login');
    }

    // Server-side data fetching
    const taxSlips = await getUserTaxSlips(user.id);

    return (
        <CategoryPageClient 
            user={user}
            taxSlips={taxSlips}
        />
    );
}
