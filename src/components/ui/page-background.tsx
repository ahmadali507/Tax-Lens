"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "blue-green" | "green-blue" | "blue" | "green";
}

export const PageBackground = ({
  children,
  className,
  variant = "blue-green",
}: PageBackgroundProps) => {
  const getGradientClasses = () => {
    switch (variant) {
      case "green-blue":
        return "bg-gradient-to-br from-background via-amber-50/15 to-rose-50/18 dark:from-background dark:via-green-950/40 dark:to-blue-950/50";
      case "blue":
        return "bg-gradient-to-br from-background via-amber-50/18 to-orange-50/15 dark:from-background dark:via-blue-950/50 dark:to-blue-900/40";
      case "green":
        return "bg-gradient-to-br from-background via-rose-50/15 to-pink-50/18 dark:from-background dark:via-green-950/50 dark:to-green-900/40";
      case "blue-green":
      default:
        return "bg-gradient-to-br from-background via-amber-50/20 to-rose-50/22 dark:from-background dark:via-blue-950/45 dark:to-green-950/45";
    }
  };

  return (
    <div className={cn(
      "relative min-h-screen w-full overflow-hidden",
      getGradientClasses(),
      className
    )}>
      {/* Animated radial gradient overlay for depth */}
      <div className="absolute inset-0 opacity-40 dark:opacity-50">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-300/20 dark:bg-blue-500/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-300/18 dark:bg-green-500/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-rose-200/15 dark:bg-blue-400/15 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 pointer-events-none opacity-25 dark:opacity-40" />
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
