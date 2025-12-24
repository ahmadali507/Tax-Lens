"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";

interface ExpenditureData {
    totalTaxCollected: number;
    uniqueUsers: number;
    totalAllocatedBudget: number;
    totalSpentBudget: number;
    taxCount: number;
    projectCount: number;
}

interface ExpenditureStatsProps {
    data: ExpenditureData;
    formatCurrency: (value: number) => string;
}

export function ExpenditureStats({ data, formatCurrency }: ExpenditureStatsProps) {
    const stats = [
        {
            title: "Total Tax Collected",
            value: formatCurrency(data.totalTaxCollected),
            icon: DollarSign,
            color: "from-blue-500/10 to-blue-500/5",
            trend: `${data.taxCount} transactions`,
            trendIcon: TrendingUp,
        },
        {
            title: "Unique Contributors",
            value: data.uniqueUsers.toString(),
            icon: Users,
            color: "from-green-500/10 to-green-500/5",
            trend: `users filed taxes`,
            trendIcon: null,
        },
        {
            title: "Allocated Budget",
            value: formatCurrency(data.totalAllocatedBudget),
            icon: TrendingUp,
            color: "from-purple-500/10 to-purple-500/5",
            trend: `${data.projectCount} projects`,
            trendIcon: TrendingUp,
        },
        {
            title: "Spent Amount",
            value: formatCurrency(data.totalSpentBudget),
            icon: TrendingDown,
            color: "from-orange-500/10 to-orange-500/5",
            trend: `${((data.totalSpentBudget / data.totalAllocatedBudget) * 100 || 0).toFixed(1)}% of allocated`,
            trendIcon: null,
        },
    ];

    return (
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trendIcon;

                return (
                    <Card
                        key={index}
                        className="glass glass-border bg-gradient-to-br transition-all hover:shadow-lg"
                        style={{
                            backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                        }}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        {TrendIcon && <TrendIcon className="h-3 w-3" />}
                                        <span>{stat.trend}</span>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-gradient-to-br p-3 opacity-80">
                                    <Icon className="h-6 w-6 text-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
