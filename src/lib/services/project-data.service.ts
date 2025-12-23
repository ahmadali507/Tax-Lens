/**
 * Project data service - manages scraped project data
 * Can be used to fetch, filter, and manage project information
 */

export type Project = {
    id: string;
    name: string;
    description: string;
    status: "completed" | "ongoing" | "planned" | "cancelled";
    progress_percentage: number;
    allocated_budget: number;
    spent_amount: number;
    details_url?: string;
};

export type ProjectFilter = {
    status?: Project['status'];
    minProgress?: number;
    maxProgress?: number;
    minBudget?: number;
    maxBudget?: number;
    searchTerm?: string;
};

/**
 * Service class for managing project data
 */
class ProjectDataService {
    /**
     * Filters projects based on criteria
     */
    static filterProjects(projects: Project[], filters: ProjectFilter): Project[] {
        return projects.filter(project => {
            if (filters.status && project.status !== filters.status) {
                return false;
            }

            if (filters.minProgress !== undefined && project.progress_percentage < filters.minProgress) {
                return false;
            }

            if (filters.maxProgress !== undefined && project.progress_percentage > filters.maxProgress) {
                return false;
            }

            if (filters.minBudget !== undefined && project.allocated_budget < filters.minBudget) {
                return false;
            }

            if (filters.maxBudget !== undefined && project.allocated_budget > filters.maxBudget) {
                return false;
            }

            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const matchesName = project.name.toLowerCase().includes(searchLower);
                const matchesDescription = project.description.toLowerCase().includes(searchLower);
                if (!matchesName && !matchesDescription) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Sorts projects by specified field
     */
    static sortProjects(
        projects: Project[],
        sortBy: keyof Project,
        order: 'asc' | 'desc' = 'asc'
    ): Project[] {
        const sorted = [...projects].sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            return 0;
        });

        return sorted;
    }

    /**
     * Gets statistics for a project list
     */
    static getStatistics(projects: Project[]) {
        if (projects.length === 0) {
            return {
                totalProjects: 0,
                totalAllocatedBudget: 0,
                totalSpent: 0,
                totalRemaining: 0,
                averageProgress: 0,
                byStatus: {
                    ongoing: 0,
                    completed: 0,
                    planned: 0,
                    cancelled: 0,
                },
            };
        }

        const totalAllocatedBudget = projects.reduce((sum, p) => sum + p.allocated_budget, 0);
        const totalSpent = projects.reduce((sum, p) => sum + p.spent_amount, 0);
        const byStatus = {
            ongoing: projects.filter(p => p.status === 'ongoing').length,
            completed: projects.filter(p => p.status === 'completed').length,
            planned: projects.filter(p => p.status === 'planned').length,
            cancelled: projects.filter(p => p.status === 'cancelled').length,
        };

        return {
            totalProjects: projects.length,
            totalAllocatedBudget,
            totalSpent,
            totalRemaining: totalAllocatedBudget - totalSpent,
            averageProgress: Math.round(
                projects.reduce((sum, p) => sum + p.progress_percentage, 0) / projects.length
            ),
            byStatus,
        };
    }

    /**
     * Groups projects by status
     */
    static groupByStatus(projects: Project[]): Record<Project['status'], Project[]> {
        return {
            ongoing: projects.filter(p => p.status === 'ongoing'),
            completed: projects.filter(p => p.status === 'completed'),
            planned: projects.filter(p => p.status === 'planned'),
            cancelled: projects.filter(p => p.status === 'cancelled'),
        };
    }

    /**
     * Gets projects in a specific budget range
     */
    static getProjectsByBudgetRange(projects: Project[], min: number, max: number): Project[] {
        return projects.filter(p => p.allocated_budget >= min && p.allocated_budget <= max);
    }

    /**
     * Calculates spending efficiency for a project
     */
    static getSpendingEfficiency(project: Project): number {
        if (project.allocated_budget === 0) return 0;
        return Math.round((project.spent_amount / project.allocated_budget) * 100);
    }

    /**
     * Gets the most expensive projects
     */
    static getMostExpensiveProjects(projects: Project[], limit: number = 5): Project[] {
        return this.sortProjects(projects, 'allocated_budget', 'desc').slice(0, limit);
    }

    /**
     * Gets projects with highest progress
     */
    static getHighestProgressProjects(projects: Project[], limit: number = 5): Project[] {
        return this.sortProjects(projects, 'progress_percentage', 'desc').slice(0, limit);
    }
}

export default ProjectDataService;
