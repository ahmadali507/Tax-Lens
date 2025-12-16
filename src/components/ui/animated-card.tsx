"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cardEntry, lift, smoothSpring } from "@/lib/animations";
import { forwardRef } from "react";

type CardProps = React.ComponentProps<typeof Card>;

interface AnimatedCardProps extends CardProps {
  delay?: number;
  enableHover?: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, delay = 0, enableHover = true, ...props }, ref) => {
    const variants = {
      ...cardEntry,
      animate: {
        // @ts-ignore
        ...cardEntry.animate,
        transition: {
          ...smoothSpring,
          delay,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        whileHover={enableHover ? "hover" : undefined}
        variants={{ ...variants, ...(enableHover ? lift : {}) }}
      >
        <Card className={className} {...props}>
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";
