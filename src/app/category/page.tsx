"use client";

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

// Mock data for category breakdown
const categoryBreakdown = [
    { category: "Income Tax", amount: 350000, percentage: 50, trend: "up" },
    { category: "Food", amount: 120000, percentage: 17.14, trend: "down" },
    { category: "Travel", amount: 85000, percentage: 12.14, trend: "up" },
    { category: "Utilities", amount: 65000, percentage: 9.29, trend: "down" },
    { category: "Healthcare", amount: 45000, percentage: 6.43, trend: "up" },
    { category: "Other", amount: 35000, percentage: 5, trend: "neutral" },
];

const monthlyTrend = [
    { month: "Jan", income: 65000, food: 18000, travel: 12000, utilities: 9000, healthcare: 7000, other: 5000 },
    { month: "Feb", income: 58000, food: 20000, travel: 14000, utilities: 11000, healthcare: 7500, other: 5500 },
    { month: "Mar", income: 62000, food: 19000, travel: 15000, utilities: 10000, healthcare: 8000, other: 6000 },
    { month: "Apr", income: 70000, food: 21000, travel: 16000, utilities: 12000, healthcare: 6000, other: 4500 },
    { month: "May", income: 55000, food: 22000, travel: 14000, utilities: 11000, healthcare: 7000, other: 6000 },
    { month: "Jun", income: 40000, food: 20000, travel: 14000, utilities: 12000, healthcare: 10000, other: 8000 },
];

export default function CategoryPage() {
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

    return (
        <PageBackground>
            <div className="container mx-auto px-4 py-24">
                <div className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                        Tax Categories
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Personal tax breakdown by category and monthly trends
                    </p>
                </div>

                {/* Category Breakdown */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-foreground">Monthly Breakdown</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryBreakdown.map((item) => (
                            <Card key={item.category} className="glass glass-border hover-lift">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-medium text-card-foreground">
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
                </div>

                {/* Monthly Trend Chart */}
                <Card className="glass glass-border">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">6-Month Category Trend</CardTitle>
                        <CardDescription>
                            Monthly tax contributions across all categories
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
                                <Bar dataKey="income" stackId="a" fill="#3b82f6" name="Income Tax" />
                                <Bar dataKey="food" stackId="a" fill="#10b981" name="Food" />
                                <Bar dataKey="travel" stackId="a" fill="#f59e0b" name="Travel" />
                                <Bar dataKey="utilities" stackId="a" fill="#ef4444" name="Utilities" />
                                <Bar dataKey="healthcare" stackId="a" fill="#8b5cf6" name="Healthcare" />
                                <Bar dataKey="other" stackId="a" fill="#6b7280" name="Other" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Insights */}
                <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-semibold text-foreground">Insights</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="glass glass-border hover-lift">
                            <CardHeader>
                                <CardTitle className="text-lg text-card-foreground">Highest Contribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Income Tax accounts for your highest tax contribution at{" "}
                                    <span className="font-semibold text-foreground">
                                        {formatCurrency(350000)}
                                    </span>
                                    , representing 50% of your total tax payments.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="glass glass-border hover-lift">
                            <CardHeader>
                                <CardTitle className="text-lg text-card-foreground">Growth Area</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Healthcare tax has shown a consistent upward trend, increasing
                                    by <span className="font-semibold text-foreground">28%</span> over
                                    the past 6 months.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageBackground>
    );
}
