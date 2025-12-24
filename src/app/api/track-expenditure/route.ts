import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}

export async function POST(request: NextRequest) {
    try {
        const { startDate, endDate } = await request.json();

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: "Start date and end date are required" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Convert dates to proper format (add time to handle full day range)
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day

        const startISO = start.toISOString().split('T')[0]; // YYYY-MM-DD
        const endISO = end.toISOString().split('T')[0]; // YYYY-MM-DD

        console.log(`Fetching data between ${startISO} and ${endISO}`);

        // Fetch tax slips within the date range
        const { data: taxSlips, error: taxError } = await supabase
            .from("tax_slips")
            .select("id, user_id, amount, date")
            .gte("date", startISO)
            .lte("date", endISO)
            .order("date", { ascending: false });

        console.log(`Tax slips result - Count: ${taxSlips?.length || 0}, Error: ${taxError?.message || 'none'}`);

        if (taxError) {
            console.error("Error fetching tax slips:", taxError);
            return NextResponse.json(
                { error: `Failed to fetch tax slips: ${taxError.message}` },
                { status: 500 }
            );
        }

        // Fetch projects within the date range
        const { data: projects, error: projectError } = await supabase
            .from("projects")
            .select("id, name, allocated_budget, spent_amount, scraped_at")
            .gte("scraped_at", startISO)
            .lte("scraped_at", endISO);

        console.log(`Projects result - Count: ${projects?.length || 0}, Error: ${projectError?.message || 'none'}`);

        if (projectError) {
            console.error("Error fetching projects:", projectError);
            return NextResponse.json(
                { error: `Failed to fetch projects: ${projectError.message}` },
                { status: 500 }
            );
        }

        // Calculate tax statistics
        const totalTaxCollected = (taxSlips || []).reduce((sum, slip) => sum + (slip.amount || 0), 0);
        const uniqueUsers = new Set((taxSlips || []).map(slip => slip.user_id)).size;
        const taxCount = taxSlips?.length || 0;

        // Calculate project statistics
        const totalAllocatedBudget = (projects || []).reduce((sum, project) => sum + (project.allocated_budget || 0), 0);
        const totalSpentBudget = (projects || []).reduce((sum, project) => sum + (project.spent_amount || 0), 0);
        const projectCount = projects?.length || 0;

        const response = {
            totalTaxCollected,
            uniqueUsers,
            totalAllocatedBudget,
            totalSpentBudget,
            taxCount,
            projectCount,
        };

        console.log("Response:", response);

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in track-expenditure API:", error);
        return NextResponse.json(
            { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
