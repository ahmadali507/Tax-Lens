"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ExpenditureData {
    totalTaxCollected: number;
    uniqueUsers: number;
    totalAllocatedBudget: number;
    totalSpentBudget: number;
    taxCount: number;
    projectCount: number;
}

interface ExpenditureChartsProps {
    data: ExpenditureData;
    formatCurrency: (value: number) => string;
}

export function ExpenditureCharts({ data, formatCurrency }: ExpenditureChartsProps) {
    // Prepare data for comparison chart
    const comparisonData = [
        {
            name: "Tax Collected",
            amount: data.totalTaxCollected,
        },
        {
            name: "Allocated Budget",
            amount: data.totalAllocatedBudget,
        },
        {
            name: "Spent Budget",
            amount: data.totalSpentBudget,
        },
    ];

    // Prepare data for budget breakdown pie chart
    const budgetBreakdown = [
        {
            name: "Spent",
            value: data.totalSpentBudget,
        },
        {
            name: "Remaining",
            value: Math.max(0, data.totalAllocatedBudget - data.totalSpentBudget),
        },
    ];

    const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Comparison Bar Chart */}
            <Card className="glass glass-border">
                <CardHeader>
                    <CardTitle className="text-lg">Revenue & Spending Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                                formatter={(value) => formatCurrency(value as number)}
                            />
                            <Bar dataKey="amount" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Budget Breakdown Pie Chart */}
            <Card className="glass glass-border">
                <CardHeader>
                    <CardTitle className="text-lg">Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={budgetBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {budgetBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
