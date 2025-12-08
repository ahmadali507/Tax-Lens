"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { deleteTaxSlip } from "@/actions/tax-slip.actions";
import { FileText, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import type { TaxSlip } from "@/types";

interface RecentUploadsClientProps {
    taxSlips: TaxSlip[];
    onRefresh: () => void;
}

export function RecentUploadsClient({ taxSlips, onRefresh }: RecentUploadsClientProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            setDeletingId(id);
            return await deleteTaxSlip(id);
        },
        onSuccess: (result) => {
            if (result.error) {
                setError(result.error);
            } else {
                // Refresh the page to get updated data
                onRefresh();
            }
        },
        onError: (error: Error) => {
            setError(error.message || "Failed to delete tax slip");
        },
        onSettled: () => {
            setDeletingId(null);
        },
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(amount);
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

    return (
        <Card className="mt-8 border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40 dark:backdrop-blur-md">
            <CardHeader>
                <CardTitle className="dark:text-blue-100">Recent Uploads</CardTitle>
                <CardDescription className="dark:text-blue-200/80">
                    Your recently uploaded tax slips ({taxSlips.length} total)
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {taxSlips.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground dark:text-blue-300/50 mb-4" />
                        <p className="text-sm text-muted-foreground dark:text-blue-200/70">
                            No uploads yet. Upload your first tax slip above.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {taxSlips.map((slip) => (
                            <div
                                key={slip.id}
                                className="flex items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:shadow-md dark:border-blue-500/20 dark:bg-blue-500/5 dark:hover:bg-blue-500/10"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className={getCategoryColor(slip.category)}>
                                            {slip.category.charAt(0).toUpperCase() + slip.category.slice(1)}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground dark:text-blue-200/70">
                                            {formatDate(slip.date)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-lg dark:text-blue-100">
                                            {formatCurrency(slip.amount)}
                                        </span>
                                        <span className="text-sm text-muted-foreground dark:text-blue-200/70">
                                            {slip.file_name}
                                        </span>
                                    </div>
                                    {slip.description && (
                                        <p className="text-sm text-muted-foreground mt-1 dark:text-blue-200/70">
                                            {slip.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="dark:border-blue-500/30 dark:hover:bg-blue-500/20 dark:text-blue-200"
                                    >
                                        <a
                                            href={slip.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            View
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteMutation.mutate(slip.id)}
                                        disabled={deletingId === slip.id}
                                        className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/20"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        {deletingId === slip.id ? "Deleting..." : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
