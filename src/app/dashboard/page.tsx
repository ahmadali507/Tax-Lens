"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DollarSign, FileText, TrendingUp, Users } from "lucide-react";
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    Pie,
    PieChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Mock data for visualization
const monthlyData = [
    { month: "Jan", taxCollected: 450000, govSpending: 380000 },
    { month: "Feb", taxCollected: 520000, govSpending: 420000 },
    { month: "Mar", taxCollected: 490000, govSpending: 510000 },
    { month: "Apr", taxCollected: 610000, govSpending: 480000 },
    { month: "May", taxCollected: 580000, govSpending: 550000 },
    { month: "Jun", taxCollected: 670000, govSpending: 590000 },
];

const categoryData = [
    { name: "Income Tax", value: 350000, color: "#3b82f6" },
    { name: "Food", value: 120000, color: "#10b981" },
    { name: "Travel", value: 85000, color: "#f59e0b" },
    { name: "Utilities", value: 65000, color: "#ef4444" },
    { name: "Healthcare", value: 45000, color: "#8b5cf6" },
    { name: "Other", value: 35000, color: "#6b7280" },
];

export default function DashboardPage() {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="mb-4 text-4xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Overview of tax collection and government spending
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Tax Collected
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">PKR 3.32M</div>
                        <p className="text-xs text-muted-foreground">
                            +12.5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Contributors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">
                            +48 from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tax Slips</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5,678</div>
                        <p className="text-xs text-muted-foreground">
                            +234 from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Gov&apos;t Spending
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">PKR 2.93M</div>
                        <p className="text-xs text-muted-foreground">
                            +8.2% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Tax Inflow vs Government Spending</CardTitle>
                        <CardDescription>Monthly comparison over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
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
                                <Line
                                    type="monotone"
                                    dataKey="taxCollected"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    name="Tax Collected"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="govSpending"
                                    stroke="hsl(var(--destructive))"
                                    strokeWidth={2}
                                    name="Gov't Spending"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tax Category Breakdown</CardTitle>
                        <CardDescription>Distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Monthly Tax by Category</CardTitle>
                        <CardDescription>Detailed breakdown of tax contributions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="name"
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
                                <Bar dataKey="value" name="Amount" radius={[8, 8, 0, 0]}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
