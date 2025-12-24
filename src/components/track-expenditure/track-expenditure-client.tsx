"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageBackground } from "@/components/ui/page-background";
import { DollarSign, Users, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { ExpenditureStats } from "./expenditure-stats";
import { ExpenditureCharts } from "./expenditure-charts";
import { getTaxSlipsByDateRange } from "@/actions/tax-slip.actions";
import { getProjectsByDateRange } from "@/actions/project.actions";

interface ExpenditureData {
    totalTaxCollected: number;
    uniqueUsers: number;
    totalAllocatedBudget: number;
    totalSpentBudget: number;
    taxCount: number;
    projectCount: number;
}

export function TrackExpenditureClient() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState<ExpenditureData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = useCallback(async () => {
        if (!startDate || !endDate) {
            setError("Please select both start and end dates");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Start date must be before end date");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`[TrackExpenditure] Fetching data between ${startDate} and ${endDate}`);

            // Fetch data using server actions
            const [taxSlips, projects] = await Promise.all([
                getTaxSlipsByDateRange(startDate, endDate),
                getProjectsByDateRange(startDate, endDate),
            ]);

            console.log(`[TrackExpenditure] Received ${taxSlips?.length || 0} tax slips and ${projects?.length || 0} projects`);

            // Calculate tax statistics
            const totalTaxCollected = (taxSlips || []).reduce((sum, slip) => sum + (slip.amount || 0), 0);
            const uniqueUsers = new Set((taxSlips || []).map(slip => slip.user_id)).size;
            const taxCount = taxSlips?.length || 0;

            // Calculate project statistics
            const totalAllocatedBudget = (projects || []).reduce((sum, project) => sum + (project.allocated_budget || 0), 0);
            const totalSpentBudget = (projects || []).reduce((sum, project) => sum + (project.spent_amount || 0), 0);
            const projectCount = projects?.length || 0;

            const result: ExpenditureData = {
                totalTaxCollected,
                uniqueUsers,
                totalAllocatedBudget,
                totalSpentBudget,
                taxCount,
                projectCount,
            };

            console.log('[TrackExpenditure] Result:', result);

            setData(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An error occurred while fetching data";
            console.error('[TrackExpenditure] Error:', message);
            setError(message);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setData(null);
        setError(null);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    };

    return (
        <PageBackground>
            <div className="container mx-auto px-4 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                        Track Expenditure
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Analyze tax collection and government spending within a custom time range.
                    </p>
                </div>

                {/* Date Selection Card */}
                <Card className="glass glass-border mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Select Time Range
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="glass glass-border"
                                    disabled={loading}
                                />
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="glass glass-border"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-4">
                            <Button
                                onClick={handleSearch}
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? "Analyzing..." : "Analyze"}
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                disabled={loading}
                                className="flex-1"
                            >
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {data && (
                    <>
                        {/* Summary Stats */}
                        <ExpenditureStats data={data} formatCurrency={formatCurrency} />

                        {/* Charts */}
                        <ExpenditureCharts data={data} formatCurrency={formatCurrency} />

                        {/* Diagnostic Info */}
                        {data.taxCount === 0 && (
                            <Card className="glass glass-border mt-8 bg-yellow-50/50 dark:bg-yellow-900/20">
                                <CardHeader>
                                    <CardTitle className="text-yellow-900 dark:text-yellow-400">
                                        ⚠️ No Tax Data Found
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-yellow-800 dark:text-yellow-300">
                                    <p>
                                        No tax slips were found in the selected date range. This could mean:
                                    </p>
                                    <ul className="list-inside list-disc space-y-1 ml-2">
                                        <li>No tax slips have been uploaded for the selected dates</li>
                                        <li>The RLS policy on tax_slips table needs to be updated</li>
                                        <li>The date format in your records differs from the selected range</li>
                                    </ul>
                                    <p className="pt-2">
                                        <strong>To diagnose:</strong> Run <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">DIAGNOSE_TAX_SLIPS.sql</code> in Supabase SQL Editor
                                    </p>
                                    <p>
                                        <strong>To fix:</strong> Run <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">FIX_TAX_SLIPS_RLS_POLICIES.sql</code> in Supabase SQL Editor
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!data && !loading && !error && (
                    <Card className="glass glass-border">
                        <CardContent className="pt-12">
                            <div className="text-center">
                                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold text-foreground">
                                    No Data Selected
                                </h3>
                                <p className="text-muted-foreground">
                                    Select a date range and click "Analyze" to view expenditure data.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PageBackground>
    );
}
