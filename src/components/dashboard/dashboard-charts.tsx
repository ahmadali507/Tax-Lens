"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import type { TaxSlip } from "@/types";

interface DashboardChartsProps {
  pieChartData: Array<{ name: string; value: number; color: string }>;
  barChartData: Array<{ category: string; amount: number }>;
  monthlyTrend: Array<{ month: string; amount: number }>;
}

export function DashboardCharts({ pieChartData, barChartData, monthlyTrend }: DashboardChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="mb-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
      {/* Pie Chart - Category Distribution */}
      <Card className="glass glass-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Category Distribution</CardTitle>
          <CardDescription>Breakdown of your tax contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300} className="[&_.recharts-surface]:overflow-visible">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  // Simplified labels on small screens
                  if (typeof window !== 'undefined' && window.innerWidth < 640) {
                    return `${(percent || 0) * 100 < 10 ? '' : name.substring(0, 3)}`;
                  }
                  return `${name}: ${((percent || 0) * 100).toFixed(0)}%`;
                }}
                outerRadius={typeof window !== 'undefined' && window.innerWidth < 640 ? 70 : 80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Category Comparison */}
      <Card className="glass glass-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Category Comparison</CardTitle>
          <CardDescription>Compare tax amounts across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} margin={{ bottom: 60, left: 0, right: 10, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="category"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Monthly Trend (full width if enough data) */}
      {monthlyTrend.length > 1 && (
        <Card className="glass glass-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Monthly Trend</CardTitle>
            <CardDescription>Your tax contributions over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend} margin={{ bottom: 10, left: 0, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Tax Amount"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
