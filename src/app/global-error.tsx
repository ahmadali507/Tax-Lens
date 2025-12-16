"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Global Error Component
 * Next.js 13+ error boundary for handling runtime errors at page level
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to console or error reporting service
        console.error("Global Error:", error);
    }, [error]);

    const handleGoHome = () => {
        window.location.href = "/";
    };

    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <Card className="max-w-lg w-full border-destructive/50">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl text-foreground">Critical Error</CardTitle>
                            <CardDescription>
                                The application encountered a critical error and needs to restart.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {process.env.NODE_ENV === "development" && (
                                <div className="rounded-lg bg-muted p-4">
                                    <p className="text-sm font-medium text-foreground mb-2">Error Details:</p>
                                    <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
                                        {error.message}
                                        {error.digest && `\nDigest: ${error.digest}`}
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
                                onClick={handleGoHome}
                                className="gap-2"
                            >
                                <Home className="h-4 w-4" />
                                Go Home
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </body>
        </html>
    );
}
