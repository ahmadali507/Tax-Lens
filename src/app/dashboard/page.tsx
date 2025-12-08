import { getCurrentUser } from "@/actions/auth.actions";
import { getUserTaxSlips, getDashboardData } from "@/actions/tax-slip.actions";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - TaxLens",
    description: "View comprehensive analytics of tax collection and government spending transparency data. Monitor your tax contributions and their impact on public services.",
};

export default async function DashboardPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/login');
    }

    // Server-side data fetching
    const taxSlips = await getUserTaxSlips(user.id);
    const dashboardData = await getDashboardData(user.id);

    return (
        <DashboardClient 
            user={user}
            taxSlips={taxSlips}
            dashboardData={dashboardData}
        />
    );
}