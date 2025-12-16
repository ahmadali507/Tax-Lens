"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Spotlight = ({ className }: { className?: string }) => {
  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute -top-40 left-0 h-[169%] w-full opacity-0",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary/50 via-primary/30 to-transparent blur-3xl" />
    </motion.div>
  );
};

export const SpotlightCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />
      </div>
      {children}
    </div>
  );
};
