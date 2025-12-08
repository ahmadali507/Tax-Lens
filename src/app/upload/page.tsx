import { getCurrentUser } from "@/actions/auth.actions";
import { getUserTaxSlips } from "@/actions/tax-slip.actions";
import { redirect } from "next/navigation";
import { UploadPageClient } from "@/components/upload/upload-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Upload Tax Slip - TaxLens",
    description: "Upload your tax receipts to contribute to government transparency and accountability tracking. Help build a comprehensive database of tax collection data.",
};

export default async function UploadPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/login');
    }

    // Server-side data fetching
    const userTaxSlips = await getUserTaxSlips(user.id);

    return (
        <UploadPageClient 
            user={user}
            initialTaxSlips={userTaxSlips}
        />
    );
}
