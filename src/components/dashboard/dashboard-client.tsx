"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats } from "./dashboard-stats";
import { DashboardCharts } from "./dashboard-charts";
import { DashboardRecentList } from "./dashboard-recent-list";
import type { User, TaxSlip, DashboardData } from "@/types";

interface DashboardClientProps {
  user: User;
  taxSlips: TaxSlip[];
  dashboardData: DashboardData;
}

function getMonthlyTrend(taxSlips: TaxSlip[]) {
  const now = new Date();
  const monthsData: Record<string, number> = {};

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString("en-PK", { month: "short", year: "numeric" });
    monthsData[monthKey] = 0;
  }

  taxSlips.forEach((slip) => {
    const slipDate = new Date(slip.date);
    const monthKey = slipDate.toLocaleDateString("en-PK", { month: "short", year: "numeric" });
    if (monthKey in monthsData) {
      monthsData[monthKey] += slip.amount;
    }
  });

  return Object.entries(monthsData).map(([month, amount]) => ({ month, amount }));
}

import { PageBackground } from "@/components/ui/page-background";

export function DashboardClient({ user, taxSlips, dashboardData }: DashboardClientProps) {
  const categoryBreakdown = Object.entries(dashboardData.categoryBreakdown).map(
    ([category, amount]) => ({
      category,
      amount,
      percentage: dashboardData.totalAmount > 0 ? (amount / dashboardData.totalAmount) * 100 : 0,
    })
  );

  const recentTaxSlips = taxSlips.slice(0, 5);

  const COLORS = {
    income: "hsl(var(--chart-1))",
    food: "hsl(var(--chart-2))",
    travel: "hsl(var(--chart-3))",
    utilities: "hsl(var(--chart-4))",
    healthcare: "hsl(var(--chart-5))",
    education: "hsl(var(--chart-1))",
    entertainment: "hsl(var(--chart-2))",
    other: "hsl(var(--chart-3))",
  };

  const pieChartData = categoryBreakdown.map(({ category, amount }) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    color: COLORS[category as keyof typeof COLORS],
  }));

  const barChartData = categoryBreakdown.map(({ category, amount }) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount,
  }));

  const monthlyTrend = getMonthlyTrend(taxSlips);

  return (
    <PageBackground>
      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Welcome back, {user.first_name}! Track your tax contributions and transparency data.
          </p>
        </div>

        <DashboardStats
          dashboardData={dashboardData}
          taxSlips={taxSlips}
          categoryBreakdown={categoryBreakdown}
        />

        {taxSlips.length > 0 && (
          <DashboardCharts
            pieChartData={pieChartData}
            barChartData={barChartData}
            monthlyTrend={monthlyTrend}
          />
        )}

        <DashboardRecentList recentTaxSlips={recentTaxSlips} categoryBreakdown={categoryBreakdown} />

        {dashboardData.totalSlips === 0 && (
          <Card className="mt-8 glass glass-border">
            <CardContent className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Get Started with Tax Transparency
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Upload your first tax slip to start contributing to government transparency and see
                your impact.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/upload"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary-hover h-10 px-4 py-2 shadow-lg hover-lift"
                >
                  Upload Tax Slip
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 shadow-lg hover-lift"
                >
                  Learn More
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageBackground>
  );
}

