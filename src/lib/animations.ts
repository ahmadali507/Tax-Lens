import { Variants } from "framer-motion";

export const buttonTap: Variants = {
    tap: { scale: 0.95 },
};

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
};

export const slideInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export const slideInDown: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
};

export const cardEntry: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
        opacity: 1, 
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        }
    },
};

export const lift: Variants = {
    hover: { 
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 10,
        }
    },
};

export const smoothSpring = {
    type: "spring" as const,
    stiffness: 100,
    damping: 10,
};
