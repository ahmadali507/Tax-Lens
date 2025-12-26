"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

/**
 * Toast notification provider using Sonner
 * Theme-aware toasts with consistent styling
 */
export function Toaster() {
    const { theme } = useTheme();

    return (
        <SonnerToaster
            theme={theme as "light" | "dark"}
            position="bottom-right"
            duration={3000}
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: "glass glass-border",
                    title: "text-foreground font-medium",
                    description: "text-muted-foreground",
                    actionButton: "bg-primary text-primary-foreground",
                    cancelButton: "bg-muted text-muted-foreground",
                    error: "border-destructive/50",
                    success: "border-success/50",
                    warning: "border-warning/50",
                    info: "border-primary/50",
                },
            }}
        />
    );
}
