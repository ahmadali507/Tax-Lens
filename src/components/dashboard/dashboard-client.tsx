"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, FileText, TrendingUp, Calendar } from "lucide-react";
import type { User, TaxSlip, DashboardData } from "@/types";

interface DashboardClientProps {
    user: User;
    taxSlips: TaxSlip[];
    dashboardData: DashboardData;
}

export function DashboardClient({ user, taxSlips, dashboardData }: DashboardClientProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-PK", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            income: "bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20",
            food: "bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20",
            travel: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 dark:bg-yellow-500/20",
            utilities: "bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20",
            healthcare: "bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20",
            education: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-500/20",
            entertainment: "bg-pink-500/10 text-pink-600 dark:text-pink-400 dark:bg-pink-500/20",
            other: "bg-gray-500/10 text-gray-600 dark:text-gray-400 dark:bg-gray-500/20",
        };
        return colors[category as keyof typeof colors] || colors.other;
    };

    // Calculate category breakdown for display
    const categoryBreakdown = Object.entries(dashboardData.categoryBreakdown).map(([category, amount]) => ({
        category,
        amount,
        percentage: dashboardData.totalAmount > 0 ? (amount / dashboardData.totalAmount) * 100 : 0,
    }));

    // Get recent tax slips (last 5)
    const recentTaxSlips = taxSlips.slice(0, 5);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="mb-4 text-4xl font-bold tracking-tight dark:text-blue-100">
                    Dashboard
                </h1>
                <p className="text-lg text-muted-foreground dark:text-blue-200/80">
                    Welcome back, {user.first_name}! Track your tax contributions and transparency data.
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium dark:text-blue-100">
                            Your Total Contributions
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-blue-100">
                            {formatCurrency(dashboardData.totalAmount)}
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-blue-200/70">
                            From {dashboardData.totalSlips} tax slips
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium dark:text-blue-100">
                            Tax Slips Uploaded
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-blue-100">{dashboardData.totalSlips}</div>
                        <p className="text-xs text-muted-foreground dark:text-blue-200/70">
                            Contributing to transparency
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium dark:text-blue-100">
                            Top Category
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-blue-100">
                            {categoryBreakdown.length > 0 
                                ? categoryBreakdown[0].category.charAt(0).toUpperCase() + categoryBreakdown[0].category.slice(1)
                                : "N/A"
                            }
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-blue-200/70">
                            {categoryBreakdown.length > 0 
                                ? formatCurrency(categoryBreakdown[0].amount)
                                : "No data"
                            }
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium dark:text-blue-100">
                            Last Upload
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-blue-100">
                            {taxSlips.length > 0 ? formatDate(taxSlips[0].date) : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-blue-200/70">
                            {taxSlips.length > 0 ? formatCurrency(taxSlips[0].amount) : "No uploads yet"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown and Recent Uploads */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Category Breakdown */}
                <Card className="border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40">
                    <CardHeader>
                        <CardTitle className="dark:text-blue-100">Category Breakdown</CardTitle>
                        <CardDescription className="dark:text-blue-200/80">
                            Your tax contributions by category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categoryBreakdown.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-muted-foreground dark:text-blue-200/70">
                                    No tax slips uploaded yet. 
                                    <br />
                                    Upload your first tax slip to see the breakdown.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {categoryBreakdown.map(({ category, amount, percentage }) => (
                                    <div key={category} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getCategoryColor(category)}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground dark:text-blue-200/70">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <span className="font-semibold dark:text-blue-100">
                                            {formatCurrency(amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Tax Slips */}
                <Card className="border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40">
                    <CardHeader>
                        <CardTitle className="dark:text-blue-100">Recent Uploads</CardTitle>
                        <CardDescription className="dark:text-blue-200/80">
                            Your latest tax slip uploads
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentTaxSlips.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground dark:text-blue-300/50 mb-4" />
                                <p className="text-sm text-muted-foreground dark:text-blue-200/70">
                                    No uploads yet. Upload your first tax slip to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentTaxSlips.map((slip) => (
                                    <div
                                        key={slip.id}
                                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 dark:border-blue-500/20 dark:hover:bg-blue-500/5"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className={getCategoryColor(slip.category)} variant="secondary">
                                                    {slip.category.charAt(0).toUpperCase() + slip.category.slice(1)}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground dark:text-blue-200/70">
                                                {formatDate(slip.date)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold dark:text-blue-100">
                                                {formatCurrency(slip.amount)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Call to Action */}
            {dashboardData.totalSlips === 0 && (
                <Card className="mt-8 border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40">
                    <CardContent className="text-center py-12">
                        <h3 className="text-2xl font-bold mb-4 dark:text-blue-100">
                            Get Started with Tax Transparency
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto dark:text-blue-200/80">
                            Upload your first tax slip to start contributing to government transparency and see your impact.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a 
                                href="/upload" 
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                Upload Tax Slip
                            </a>
                            <a 
                                href="/about" 
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 dark:border-blue-500/30 dark:hover:bg-blue-500/20"
                            >
                                Learn More
                            </a>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
