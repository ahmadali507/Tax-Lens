/**
 * Design System Constants
 * Central source of truth for colors, spacing, typography, and other design tokens
 */

export const DESIGN_TOKENS = {
    // Spacing scale (in rem)
    spacing: {
        xs: "0.25rem",   // 4px
        sm: "0.5rem",    // 8px
        md: "1rem",      // 16px
        lg: "1.5rem",    // 24px
        xl: "2rem",      // 32px
        "2xl": "3rem",   // 48px
        "3xl": "4rem",   // 64px
    },

    // Typography scale
    typography: {
        fontFamily: {
            sans: "var(--font-sans)",
            mono: "var(--font-mono)",
        },
        fontSize: {
            xs: "0.75rem",    // 12px
            sm: "0.875rem",   // 14px
            base: "1rem",     // 16px
            lg: "1.125rem",   // 18px
            xl: "1.25rem",    // 20px
            "2xl": "1.5rem",  // 24px
            "3xl": "1.875rem", // 30px
            "4xl": "2.25rem",  // 36px
            "5xl": "3rem",     // 48px
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
        },
    },

    // Border radius
    borderRadius: {
        none: "0",
        sm: "0.25rem",   // 4px
        md: "0.5rem",    // 8px
        lg: "0.75rem",   // 12px
        xl: "1rem",      // 16px
        "2xl": "1.5rem", // 24px
        full: "9999px",
    },

    // Shadows
    shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },

    // Z-index scale
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },

    // Breakpoints (matching Tailwind defaults)
    breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
    },

    // Transitions
    transitions: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slower: "500ms",
    },

    // Animation durations
    animation: {
        duration: {
            fast: "150ms",
            normal: "300ms",
            slow: "500ms",
        },
        easing: {
            linear: "linear",
            in: "cubic-bezier(0.4, 0, 1, 1)",
            out: "cubic-bezier(0, 0, 0.2, 1)",
            inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
    },
} as const;

/**
 * Application Constants
 */
export const APP_CONFIG = {
    name: "TaxLens",
    description: "Tax Transparency Platform",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    
    // File upload constraints
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        acceptedFormats: [".pdf", ".jpg", ".jpeg", ".png"],
        acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    },

    // Pagination
    pagination: {
        defaultPageSize: 10,
        maxPageSize: 100,
    },

    // Form validation
    validation: {
        minPasswordLength: 8,
        maxPasswordLength: 128,
        cnicPattern: /^\d{5}-\d{7}-\d$/,
        phonePattern: /^\+?[0-9\s-]{10,}$/,
    },

    // Toast notification duration
    toast: {
        duration: 3000, // 3 seconds
        errorDuration: 5000, // 5 seconds
    },
} as const;

/**
 * Tax Categories
 */
export const TAX_CATEGORIES = [
    { value: "income", label: "Income Tax" },
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "utilities", label: "Utilities" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "other", label: "Other" },
] as const;

/**
 * Project Status Options
 */
export const PROJECT_STATUS = [
    { value: "completed", label: "Completed", color: "green" },
    { value: "ongoing", label: "Ongoing", color: "blue" },
    { value: "planned", label: "Planned", color: "yellow" },
    { value: "cancelled", label: "Cancelled", color: "red" },
] as const;

/**
 * Currency formatting
 */
export const CURRENCY_CONFIG = {
    locale: "en-PK",
    currency: "PKR",
    notation: "compact" as const,
    maximumFractionDigits: 1,
} as const;
