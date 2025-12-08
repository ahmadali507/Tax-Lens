export interface User {
    id: string;
    cnic: string;
    first_name: string;
    last_name: string;
    contact_no: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface TaxSlip {
    id: string;
    user_id: string;
    category: string;
    amount: number;
    date: string;
    description: string | null;
    file_url: string;
    file_name: string;
    file_size: number;
    file_type: string;
    created_at: string;
    updated_at: string;
}

export type TaxCategory =
    | "income"
    | "food"
    | "travel"
    | "utilities"
    | "healthcare"
    | "education"
    | "entertainment"
    | "other";

export interface GovernmentProject {
    id: string;
    name: string;
    description: string;
    allocated_budget: number;
    spent_amount: number;
    progress_percentage: number;
    start_date: string;
    end_date?: string;
    status: ProjectStatus;
    details_url?: string;
    created_at: string;
}

export type ProjectStatus = "planned" | "ongoing" | "completed" | "cancelled";

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    created_at: string;
}

export interface TaxStatistics {
    total_tax_collected: number;
    total_contributors: number;
    total_government_spending: number;
    total_projects: number;
}

export interface CategoryBreakdown {
    category: TaxCategory;
    amount: number;
    percentage: number;
}

export interface MonthlyTaxData {
    month: string;
    tax_collected: number;
    government_spending: number;
}

export interface DashboardData {
    totalAmount: number;
    totalSlips: number;
    categoryBreakdown: Record<string, number>;
    monthlyData: TaxSlip[];
}
