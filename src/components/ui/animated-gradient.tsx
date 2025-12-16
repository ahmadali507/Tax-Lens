"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const AnimatedGradient = ({
  children,
  className,
  containerClassName,
}: AnimatedGradientProps) => {
  return (
    <div className={cn("relative", containerClassName)}>
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20",
          "animate-gradient",
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
