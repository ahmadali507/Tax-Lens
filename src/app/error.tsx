"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Error Component
 * Next.js 13+ error boundary for handling runtime errors at page level
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Page Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="glass glass-border max-w-lg w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Something went wrong</CardTitle>
                    <CardDescription>
                        We encountered an unexpected error. Please try refreshing the page.
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
                        Try Again
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
