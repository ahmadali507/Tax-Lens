"use server";

import { createClient } from "../../supabase/server";
import type { GovernmentProject } from "@/types";

// Get projects by date range - Query function
export async function getProjectsByDateRange(startDate: string, endDate: string): Promise<GovernmentProject[]> {
    try {
        const supabase = await createClient();

        console.log(`[getProjectsByDateRange] Fetching projects between ${startDate} and ${endDate}`);

        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .gte('scraped_at', startDate)
            .lte('scraped_at', endDate)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[getProjectsByDateRange] Error:', error.message, error.details);
            return [];
        }

        console.log(`[getProjectsByDateRange] Found ${projects?.length || 0} projects`);

        if (projects && projects.length > 0) {
            console.log('[getProjectsByDateRange] Sample data:', {
                count: projects.length,
                firstRecord: projects[0],
            });
        }

        return (projects as GovernmentProject[]) || [];
    } catch (error) {
        console.error('[getProjectsByDateRange] Exception:', error);
        return [];
    }
}
