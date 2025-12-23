/**
 * Example: How to use scraped projects in your Next.js application
 * This file demonstrates various patterns for working with the scraped project data
 */

import { scrapedProjects } from '@/data/scraped-projects';
import ProjectDataService, { ProjectFilter } from '@/lib/services/project-data.service';

// Example 1: Get only ongoing projects
export function getOngoingProjects() {
    const filter: ProjectFilter = {
        status: 'ongoing',
    };
    return ProjectDataService.filterProjects(scrapedProjects, filter);
}

// Example 2: Get high-value projects (over 20 billion PKR)
export function getHighValueProjects() {
    const filter: ProjectFilter = {
        minBudget: 20000000000,
    };
    return ProjectDataService.filterProjects(scrapedProjects, filter);
}

// Example 3: Search for projects by keyword
export function searchProjects(keyword: string) {
    const filter: ProjectFilter = {
        searchTerm: keyword,
    };
    return ProjectDataService.filterProjects(scrapedProjects, filter);
}

// Example 4: Get projects nearing completion (80%+ progress)
export function getNearCompletionProjects() {
    const filter: ProjectFilter = {
        minProgress: 80,
    };
    return ProjectDataService.filterProjects(scrapedProjects, filter);
}

// Example 5: Get projects that just started (0-20% progress)
export function getEarlyStageProjects() {
    const filter: ProjectFilter = {
        minProgress: 0,
        maxProgress: 20,
    };
    return ProjectDataService.filterProjects(scrapedProjects, filter);
}

// Example 6: Complex filtering - ongoing projects in KP/Balochistan region
export function getRegionalOngoingProjects(region: string) {
    const regionKeywords = {
        KP: 'Peshawar',
        Balochistan: 'Quetta',
        Punjab: 'Lahore|Multan|Faisalabad',
        Sindh: 'Karachi|Sukkur',
    };

    const filter: ProjectFilter = {
        status: 'ongoing',
        searchTerm: regionKeywords[region as keyof typeof regionKeywords],
    };

    return ProjectDataService.filterProjects(scrapedProjects, filter);
}

// Example 7: Dashboard statistics
export function getDashboardStats() {
    const allProjects = scrapedProjects;
    const ongoingProjects = ProjectDataService.filterProjects(allProjects, {
        status: 'ongoing',
    });

    return {
        allStats: ProjectDataService.getStatistics(allProjects),
        ongoingStats: ProjectDataService.getStatistics(ongoingProjects),
        mostExpensive: ProjectDataService.getMostExpensiveProjects(allProjects, 5),
        highestProgress: ProjectDataService.getHighestProgressProjects(allProjects, 5),
        grouped: ProjectDataService.groupByStatus(allProjects),
    };
}

// Example 8: Sort projects by various criteria
export function getSortedProjects(sortBy: 'name' | 'progress' | 'budget' | 'spent') {
    const sortMap = {
        name: 'name' as const,
        progress: 'progress_percentage' as const,
        budget: 'allocated_budget' as const,
        spent: 'spent_amount' as const,
    };

    return ProjectDataService.sortProjects(
        scrapedProjects,
        sortMap[sortBy],
        'desc'
    );
}

// Example 9: Calculate total investment and spending
export function getInvestmentOverview() {
    const ongoingProjects = ProjectDataService.filterProjects(scrapedProjects, {
        status: 'ongoing',
    });

    const totalAllocated = ongoingProjects.reduce((sum, p) => sum + p.allocated_budget, 0);
    const totalSpent = ongoingProjects.reduce((sum, p) => sum + p.spent_amount, 0);
    const totalRemaining = totalAllocated - totalSpent;

    return {
        totalAllocated,
        totalSpent,
        totalRemaining,
        spendingPercentage: (totalSpent / totalAllocated) * 100,
        projectCount: ongoingProjects.length,
    };
}

// Example 10: Find projects by efficiency (spending vs budget)
export function getEfficiencyRanking() {
    return scrapedProjects
        .map(project => ({
            ...project,
            efficiency: ProjectDataService.getSpendingEfficiency(project),
            remaining: project.allocated_budget - project.spent_amount,
        }))
        .sort((a, b) => a.efficiency - b.efficiency);
}

// Example 11: Export data for reporting
export function generateReport() {
    const stats = getDashboardStats();

    return {
        generatedAt: new Date().toISOString(),
        summary: {
            totalProjects: stats.allStats.totalProjects,
            totalBudget: stats.allStats.totalAllocatedBudget,
            totalSpent: stats.allStats.totalSpent,
            totalRemaining: stats.allStats.totalRemaining,
        },
        byStatus: stats.allStats.byStatus,
        ongoingProjects: {
            count: stats.ongoingStats.totalProjects,
            budget: stats.ongoingStats.totalAllocatedBudget,
            spent: stats.ongoingStats.totalSpent,
            averageProgress: stats.ongoingStats.averageProgress,
        },
        topProjects: {
            mostExpensive: stats.mostExpensive.map(p => ({
                name: p.name,
                budget: p.allocated_budget,
            })),
            highestProgress: stats.highestProgress.map(p => ({
                name: p.name,
                progress: p.progress_percentage,
            })),
        },
    };
}

// Example 12: Real-time project updates
export class ProjectUpdateService {
    /**
     * Get projects that need attention (high budget, low progress)
     */
    static getProjectsNeedingAttention() {
        return scrapedProjects.filter(project => {
            const efficiency = ProjectDataService.getSpendingEfficiency(project);
            return (
                project.allocated_budget > 15000000000 &&
                project.progress_percentage < 50 &&
                efficiency > 80
            );
        });
    }

    /**
     * Get projects that are running over budget
     */
    static getOverBudgetProjects() {
        return scrapedProjects.filter(project => {
            const allocated = project.allocated_budget;
            const spent = project.spent_amount;
            return spent > allocated * 0.95; // Over 95% of budget
        });
    }

    /**
     * Get projects that are ahead of schedule
     */
    static getAheadOfScheduleProjects() {
        return scrapedProjects.filter(project => {
            // Assuming projects should spend proportionally to progress
            const expectedSpend = (project.progress_percentage / 100) * project.allocated_budget;
            const actualSpend = project.spent_amount;
            return actualSpend < expectedSpend * 0.9; // Spending 10% less than expected
        });
    }
}

export default {
    getOngoingProjects,
    getHighValueProjects,
    searchProjects,
    getNearCompletionProjects,
    getEarlyStageProjects,
    getRegionalOngoingProjects,
    getDashboardStats,
    getSortedProjects,
    getInvestmentOverview,
    getEfficiencyRanking,
    generateReport,
    ProjectUpdateService,
};
