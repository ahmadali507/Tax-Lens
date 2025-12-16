import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware for route protection and authentication
 * Protects authenticated routes and redirects unauthorized users
 */
export async function middleware(request: NextRequest) {
    // Create Supabase client for Edge Runtime
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                },
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                      request.nextUrl.pathname.startsWith("/register");
    
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") ||
                            request.nextUrl.pathname.startsWith("/upload") ||
                            request.nextUrl.pathname.startsWith("/projects");

    // Redirect authenticated users away from auth pages
    if (session && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login
    if (!session && isProtectedRoute) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

/**
 * Configure which routes to run middleware on
 */
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/upload/:path*",
        "/projects/:path*",
        "/login",
        "/register",
    ],
};
