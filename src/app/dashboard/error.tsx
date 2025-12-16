"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Dashboard Error Component
 * Handles errors specific to the dashboard page
 */
export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard Error:", error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="glass glass-border max-w-lg mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Dashboard Error</CardTitle>
                    <CardDescription>
                        Unable to load your dashboard. This might be a temporary issue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {process.env.NODE_ENV === "development" && (
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm font-medium text-foreground mb-2">Error Details:</p>
                            <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
                                {error.message}
                            </pre>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={reset}
                        className="gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Reload Dashboard
                    </Button>
                    <Button
                        onClick={() => window.location.href = "/"}
                        className="gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
