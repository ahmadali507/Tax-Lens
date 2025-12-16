import { useState, useEffect } from "react";

/**
 * Custom hook for responsive design with media queries
 * 
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Return early if window is not defined (SSR)
        if (typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia(query);
        
        // Set initial value
        setMatches(mediaQuery.matches);

        // Create event listener
        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add listener (modern browsers)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handler);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handler);
        }

        // Cleanup
        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", handler);
            } else {
                mediaQuery.removeListener(handler);
            }
        };
    }, [query]);

    return matches;
}

/**
 * Predefined breakpoint hooks for common use cases
 */
export const useBreakpoint = () => {
    const isSm = useMediaQuery("(min-width: 640px)");
    const isMd = useMediaQuery("(min-width: 768px)");
    const isLg = useMediaQuery("(min-width: 1024px)");
    const isXl = useMediaQuery("(min-width: 1280px)");
    const is2Xl = useMediaQuery("(min-width: 1536px)");

    return {
        isSm,
        isMd,
        isLg,
        isXl,
        is2Xl,
        isMobile: !isMd,
        isTablet: isMd && !isLg,
        isDesktop: isLg,
    };
};
