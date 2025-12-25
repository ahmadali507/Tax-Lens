"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, TrendingUp, Calendar } from "lucide-react";
import type { DashboardData, TaxSlip } from "@/types";

interface DashboardStatsProps {
  dashboardData: DashboardData;
  taxSlips: TaxSlip[];
  categoryBreakdown: Array<{ category: string; amount: number; percentage: number }>;
}

export function DashboardStats({ dashboardData, taxSlips, categoryBreakdown }: DashboardStatsProps) {
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

  return (
    <div className="mb-8 grid gap-4 grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4">
      {/* Total Contributions */}
      <Card className="glass glass-border hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Total Contributions
          </CardTitle>
          <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-foreground break-words">
            {formatCurrency(dashboardData.totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">From {dashboardData.totalSlips} tax slips</p>
        </CardContent>
      </Card>

      {/* Tax Slips Uploaded */}
      <Card className="glass glass-border hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">
            Tax Slips Uploaded
          </CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{dashboardData.totalSlips}</div>
          <p className="text-xs text-muted-foreground">Contributing to transparency</p>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card className="glass glass-border hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Top Category</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {categoryBreakdown.length > 0
              ? categoryBreakdown[0].category.charAt(0).toUpperCase() +
                categoryBreakdown[0].category.slice(1)
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {categoryBreakdown.length > 0 ? formatCurrency(categoryBreakdown[0].amount) : "No data"}
          </p>
        </CardContent>
      </Card>

      {/* Last Upload */}
      <Card className="glass glass-border hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-card-foreground">Last Upload</CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {taxSlips.length > 0 ? formatDate(taxSlips[0].date) : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {taxSlips.length > 0 ? formatCurrency(taxSlips[0].amount) : "No uploads yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
