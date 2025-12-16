/**
 * Environment variable validation and type-safe access
 * Ensures all required environment variables are present at build/runtime
 */

const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

type EnvVar = (typeof requiredEnvVars)[number];

/**
 * Validates that all required environment variables are present
 * Throws error with helpful message if any are missing
 */
export function validateEnv(): void {
    const missing: string[] = [];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missing.join("\n")}\n\n` +
            `Please check your .env.local file and ensure all required variables are set.\n` +
            `See .env.example for reference.`
        );
    }
}

/**
 * Type-safe getter for environment variables
 */
export function getEnv(key: EnvVar): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}

/**
 * Environment configuration object with validated values
 */
export const env = {
    supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
} as const;

// Validate environment on module load (only in Node.js environment)
if (typeof window === "undefined") {
    validateEnv();
}
