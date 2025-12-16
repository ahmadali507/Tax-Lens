"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const PageBackground = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative min-h-screen w-full bg-background", className)}>
      <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 pointer-events-none opacity-40" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
