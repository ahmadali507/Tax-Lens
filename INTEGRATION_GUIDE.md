/**
 * INTEGRATION GUIDE: Using Scraped Projects in Your App
 * 
 * This guide shows you exactly how to update your projects/page.tsx
 * to use the real scraped data instead of dummy data.
 */

// ============================================================================
// OPTION 1: Replace dummyProjects with scrapedProjects (Simple)
// ============================================================================
/*
import { scrapedProjects } from "@/data/scraped-projects";
import { Progress } from "@/components/ui/progress";
// ... other imports ...

export default function ProjectsPage() {
    const projects = scrapedProjects; // Use real scraped data
    
    // ... rest of your component remains the same
}
*/

// ============================================================================
// OPTION 2: Use ProjectDataService for advanced filtering (Recommended)
// ============================================================================
/*
import { scrapedProjects } from "@/data/scraped-projects";
import ProjectDataService from "@/lib/services/project-data.service";
import { Progress } from "@/components/ui/progress";
// ... other imports ...

export default function ProjectsPage() {
    // Filter for only ongoing projects
    const projects = ProjectDataService.filterProjects(scrapedProjects, {
        status: "ongoing"
    });
    
    // Get statistics
    const stats = ProjectDataService.getStatistics(projects);
    
    // ... rest of your component
    // Now include stats in your render
}
*/

// ============================================================================
// OPTION 3: Advanced - With Search and Filtering UI
// ============================================================================
/*
'use client';

import { useState } from 'react';
import { scrapedProjects } from "@/data/scraped-projects";
import ProjectDataService, { ProjectFilter } from "@/lib/services/project-data.service";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function ProjectsPage() {
    const [filters, setFilters] = useState<ProjectFilter>({
        status: 'ongoing'
    });

    const filteredProjects = ProjectDataService.filterProjects(scrapedProjects, filters);
    const stats = ProjectDataService.getStatistics(filteredProjects);

    return (
        <div className="container mx-auto px-4 py-24">
            {/* Filter Section */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div>
                    <label className="text-sm font-medium">Search Projects</label>
                    <Input
                        placeholder="Search by name or description..."
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            searchTerm: e.target.value
                        }))}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                        value={filters.status || ''}
                        onChange={(value) => setFilters(prev => ({
                            ...prev,
                            status: value as any
                        }))}
                    >
                        <option value="">All Status</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="planned">Planned</option>
                        <option value="cancelled">Cancelled</option>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium">Min. Budget</label>
                    <Input
                        type="number"
                        placeholder="Minimum budget in PKR"
                        onChange={(e) => setFilters(prev => ({
                            ...prev,
                            minBudget: parseInt(e.target.value) || undefined
                        }))}
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div className="mb-8 grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-2xl font-bold">
                        {(stats.totalAllocatedBudget / 1000000000).toFixed(1)}B PKR
                    </p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">
                        {(stats.totalSpent / 1000000000).toFixed(1)}B PKR
                    </p>
                </div>
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Avg. Progress</p>
                    <p className="text-2xl font-bold">{stats.averageProgress}%</p>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    // ... your existing Card component
                ))}
            </div>
        </div>
    );
}
*/

// ============================================================================
// STEP-BY-STEP MIGRATION GUIDE
// ============================================================================

/*
STEP 1: Update Imports
-----------------------
BEFORE:
  // import dummyProjects...

AFTER:
  import { scrapedProjects } from "@/data/scraped-projects";
  import ProjectDataService from "@/lib/services/project-data.service";


STEP 2: Replace Project Data Source
------------------------------------
BEFORE:
  const projects = dummyProjects;

AFTER:
  const projects = scrapedProjects;
  // OR for filtered data:
  const projects = ProjectDataService.filterProjects(scrapedProjects, {
      status: 'ongoing'
  });


STEP 3: Optional - Add Statistics Display
------------------------------------------
Add this to show project statistics:

  const stats = ProjectDataService.getStatistics(projects);

Then in your JSX, you can display:
  - stats.totalProjects
  - stats.totalAllocatedBudget
  - stats.totalSpent
  - stats.totalRemaining
  - stats.averageProgress
  - stats.byStatus


STEP 4: Update Browser Data Cache (if applicable)
--------------------------------------------------
If you're caching project data, update your cache invalidation:

  revalidatePath('/projects', 'page');

Or use React Query:
  const { data: projects } = useQuery({
      queryKey: ['projects'],
      queryFn: () => scrapedProjects
  });
*/

// ============================================================================
// USEFUL DATA TRANSFORMATIONS
// ============================================================================

export const DataTransformations = {
    /**
     * Convert scraped projects for export to CSV
     */
    toCSV(projects: typeof scrapedProjects) {
        const headers = ['ID', 'Name', 'Status', 'Progress %', 'Budget (PKR)', 'Spent (PKR)'];
        const rows = projects.map(p => [
            p.id,
            p.name,
            p.status,
            p.progress_percentage,
            p.allocated_budget,
            p.spent_amount
        ]);
        
        return [headers, ...rows];
    },

    /**
     * Group projects by sector/category
     */
    groupBySector(projects: typeof scrapedProjects) {
        const sectors = {
            'Transportation': ['Railway', 'Metro', 'BRT', 'Expressway', 'Ring Road'],
            'Water & Utilities': ['Water Supply', 'Barrage'],
            'Ports & Trade': ['Port', 'Industrial Zone'],
        };

        const grouped: Record<string, typeof scrapedProjects> = {};

        projects.forEach(project => {
            let sector = 'Other';
            for (const [sec, keywords] of Object.entries(sectors)) {
                if (keywords.some(kw => project.name.includes(kw))) {
                    sector = sec;
                    break;
                }
            }
            if (!grouped[sector]) grouped[sector] = [];
            grouped[sector].push(project);
        });

        return grouped;
    },

    /**
     * Get budget vs progress analysis
     */
    getBudgetVsProgress(projects: typeof scrapedProjects) {
        return projects.map(p => ({
            name: p.name,
            budget: p.allocated_budget,
            progress: p.progress_percentage,
            expected_spend: (p.progress_percentage / 100) * p.allocated_budget,
            actual_spend: p.spent_amount,
            variance: p.spent_amount - ((p.progress_percentage / 100) * p.allocated_budget),
        }));
    },
};
