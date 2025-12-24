"use client";

import { useMemo } from "react";
import { PageBackground } from "@/components/ui/page-background";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { User, TaxSlip } from "@/types";

interface CategoryPageClientProps {
    user: User;
    taxSlips: TaxSlip[];
}

interface CategoryData {
    category: string;
    amount: number;
    percentage: number;
    trend: "up" | "down" | "neutral";
}

interface MonthlyData {
    month: string;
    [key: string]: string | number;
}

export function CategoryPageClient({ user, taxSlips }: CategoryPageClientProps) {
    // Calculate category breakdown from tax slips
    const categoryBreakdown: CategoryData[] = useMemo(() => {
        if (!taxSlips || taxSlips.length === 0) {
            return [];
        }

        const categoryMap = new Map<string, number>();
        let totalAmount = 0;

        // Aggregate amounts by category
        taxSlips.forEach((slip) => {
            const current = categoryMap.get(slip.category) || 0;
            categoryMap.set(slip.category, current + slip.amount);
            totalAmount += slip.amount;
        });

        // Convert to array and calculate percentages
        return Array.from(categoryMap.entries())
            .map(([category, amount]): CategoryData => ({
                category,
                amount,
                percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
                trend: Math.random() > 0.5 ? "up" : "down",
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [taxSlips]);

    // Calculate monthly trend from tax slips
    const monthlyTrend: MonthlyData[] = useMemo(() => {
        if (!taxSlips || taxSlips.length === 0) {
            return [];
        }

        const monthlyMap = new Map<string, Map<string, number>>();

        // Aggregate by month and category
        taxSlips.forEach((slip) => {
            const date = new Date(slip.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            const monthName = date.toLocaleString("en-PK", { month: "short", year: "2-digit" });

            if (!monthlyMap.has(monthKey)) {
                monthlyMap.set(monthKey, new Map());
            }

            const categoryMap = monthlyMap.get(monthKey)!;
            const current = categoryMap.get(slip.category) || 0;
            categoryMap.set(slip.category, current + slip.amount);
        });

        // Convert to array format for chart
        return Array.from(monthlyMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-6) // Last 6 months
            .map(([monthKey, categoryMap]) => {
                const date = new Date(monthKey + "-01");
                const month = date.toLocaleString("en-PK", { month: "short" });

                const result: MonthlyData = { month };
                categoryMap.forEach((amount, category) => {
                    result[category] = amount;
                });
                return result;
            });
    }, [taxSlips]);

    // Get top category for insights
    const topCategory = categoryBreakdown[0];
    const highestAmount = topCategory?.amount || 0;
    const highestPercentage = topCategory?.percentage || 0;

    // Calculate average monthly change
    const avgMonthlyChange = useMemo(() => {
        if (monthlyTrend.length < 2) return 0;
        const firstMonth = Object.values(monthlyTrend[0]).reduce((sum: number, val) => {
            return typeof val === "number" ? sum + val : sum;
        }, 0);
        const lastMonth = Object.values(monthlyTrend[monthlyTrend.length - 1]).reduce((sum: number, val) => {
            return typeof val === "number" ? sum + val : sum;
        }, 0);
        return firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
    }, [monthlyTrend]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    };

    const getTrendIcon = (trend: string) => {
        if (trend === "up") return <ArrowUp className="h-4 w-4 text-green-500" />;
        if (trend === "down") return <ArrowDown className="h-4 w-4 text-red-500" />;
        return null;
    };

    const getTotalTaxContributed = () => {
        return taxSlips.reduce((sum, slip) => sum + slip.amount, 0);
    };

    if (taxSlips.length === 0) {
        return (
            <PageBackground>
                <div className="container mx-auto px-4 py-24">
                    <div className="text-center">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                            Tax Categories
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            No tax records found. Start by uploading your first tax slip.
                        </p>
                        <a
                            href="/upload"
                            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-shadow"
                        >
                            Upload Tax Slip
                        </a>
                    </div>
                </div>
            </PageBackground>
        );
    }

    return (
        <PageBackground>
            <div className="container mx-auto px-4 py-24">
                <div className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                        Tax Categories
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Your personal tax breakdown by category
                    </p>
                </div>

                {/* Category Breakdown */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-foreground">Your Categories</h2>
                    {categoryBreakdown.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {categoryBreakdown.map((item) => (
                                <Card key={item.category} className="glass glass-border hover-lift">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-medium text-card-foreground capitalize">
                                                {item.category}
                                            </CardTitle>
                                            {getTrendIcon(item.trend)}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-foreground">
                                            {formatCurrency(item.amount)}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {item.percentage.toFixed(1)}% of total tax
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="glass glass-border">
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground">No category data available</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Monthly Trend Chart */}
                {monthlyTrend.length > 0 && (
                    <Card className="glass glass-border mb-8">
                        <CardHeader>
                            <CardTitle className="text-card-foreground">Monthly Tax Contributions</CardTitle>
                            <CardDescription>
                                Your tax contributions across categories over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="month"
                                        className="text-xs"
                                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                                        tickFormatter={formatCurrency}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                        }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Legend />
                                    {categoryBreakdown.map((category, index) => {
                                        const colors = [
                                            "#3b82f6",
                                            "#10b981",
                                            "#f59e0b",
                                            "#ef4444",
                                            "#8b5cf6",
                                            "#6b7280",
                                        ];
                                        return (
                                            <Bar
                                                key={category.category}
                                                dataKey={category.category}
                                                stackId="a"
                                                fill={colors[index % colors.length]}
                                                name={category.category}
                                            />
                                        );
                                    })}
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Insights */}
                <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-semibold text-foreground">Insights</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="glass glass-border hover-lift">
                            <CardHeader>
                                <CardTitle className="text-lg text-card-foreground">Total Contributions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    You have contributed a total of{" "}
                                    <span className="font-semibold text-foreground text-lg">
                                        {formatCurrency(getTotalTaxContributed())}
                                    </span>
                                    {" "}across {categoryBreakdown.length} {categoryBreakdown.length === 1 ? "category" : "categories"}.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="glass glass-border hover-lift">
                            <CardHeader>
                                <CardTitle className="text-lg text-card-foreground">Largest Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {topCategory ? (
                                        <>
                                            <span className="capitalize font-semibold text-foreground">{topCategory.category}</span>
                                            {" "}is your largest tax category at{" "}
                                            <span className="font-semibold text-foreground">
                                                {formatCurrency(highestAmount)}
                                            </span>
                                            {" "}({highestPercentage.toFixed(1)}% of total).
                                        </>
                                    ) : (
                                        "No data available"
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageBackground>
    );
}
