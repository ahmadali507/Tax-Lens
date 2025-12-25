"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/projects", label: "Projects" },
    { href: "/category", label: "Categories" },
    { href: "/track-expenditure", label: "Track Expenditure" },
    { href: "/upload", label: "Upload" },
    { href: "/about", label: "About" },
    { href: "/connect", label: "Connect" },
];

interface NavbarClientProps {
    user: User | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setIsSigningOut(false);
        }
    };

    if (isAuthPage) return null;

    // Progressive link visibility based on screen size
    const getVisibleLinks = (breakpoint: string) => {
        switch (breakpoint) {
            case "xl": // 1280px+: Show all 8 links
                return navLinks;
            case "lg": // 1024-1279px: Hide Connect (7 links)
                return navLinks.filter(link => link.label !== "Connect");
            case "md": // 768-1023px: Hide Connect, About (6 links)
                return navLinks.filter(link => !["Connect", "About"].includes(link.label));
            case "sm": // 640-767px: Show only Home, Dashboard, Upload (3 links)
                return navLinks.filter(link => ["Home", "Dashboard", "Upload"].includes(link.label));
            default: // xs: Show 0 links (all in sidebar)
                return [];
        }
    };

    // Get links that are hidden from navbar (for sidebar)
    const getHiddenLinks = (breakpoint: string) => {
        const visibleLinks = getVisibleLinks(breakpoint);
        const visibleHrefs = new Set(visibleLinks.map(l => l.href));
        return navLinks.filter(link => !visibleHrefs.has(link.href));
    };

    // Check if hamburger should show (when any links are hidden)
    const shouldShowHamburger = (breakpoint: string) => {
        return getHiddenLinks(breakpoint).length > 0;
    };

    return (
        <>
            <nav className="fixed top-4 inset-x-0 max-w-7xl mx-auto z-50 px-4">
                <div className="rounded-full border border-border/40 backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60 transition-all duration-300 shadow-lg overflow-hidden">
                    <div className="px-3 sm:px-4 lg:px-6">
                        <div className="flex h-14 items-center justify-between gap-2">
                            {/* Left: Logo + TaxLens Title (Always Visible) */}
                            <Link href="/" className="flex items-center space-x-2 transition-all hover:opacity-90 group flex-shrink-0">
                                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/50">
                                    <span className="text-sm sm:text-base font-bold">TL</span>
                                </div>
                                <span className="text-sm sm:text-base md:text-lg font-bold text-foreground whitespace-nowrap">
                                    TaxLens
                                </span>
                            </Link>

                            {/* Center: Progressive Navigation Links */}
                            {/* XL: All 8 links */}
                            <div className="hidden xl:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-0.5">
                                {getVisibleLinks("xl").map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "px-2 lg:px-2.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                                            pathname === link.href
                                                ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/90 dark:text-primary-foreground dark:ring-0 dark:shadow-lg dark:shadow-primary/30"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* LG: 7 links (hide Connect) */}
                            <div className="hidden lg:flex xl:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-0.5">
                                {getVisibleLinks("lg").map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "px-2 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                                            pathname === link.href
                                                ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/90 dark:text-primary-foreground dark:ring-0 dark:shadow-lg dark:shadow-primary/30"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* MD: 6 links (hide Connect, About) */}
                            <div className="hidden md:flex lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-0.5">
                                {getVisibleLinks("md").map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "px-1.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                                            pathname === link.href
                                                ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/90 dark:text-primary-foreground dark:ring-0 dark:shadow-lg dark:shadow-primary/30"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* SM: 3 links (Home, Dashboard, Upload) */}
                            <div className="hidden sm:flex md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-0.5">
                                {getVisibleLinks("sm").map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "px-1.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                                            pathname === link.href
                                                ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/90 dark:text-primary-foreground dark:ring-0 dark:shadow-lg dark:shadow-primary/30"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Right: Theme Toggle + User Profile + Hamburger (Always Visible) */}
                            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
                                {/* Theme Toggle - Always Visible */}
                                <div className="flex-shrink-0">
                                    <ThemeToggle />
                                </div>

                                {/* User Profile - Always Visible */}
                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="border-border hover:bg-accent transition-theme h-9 px-2 sm:px-3 flex-shrink-0"
                                            >
                                                <UserIcon className="h-4 w-4 flex-shrink-0" />
                                                <span className="hidden sm:inline ml-1.5 max-w-[80px] lg:max-w-[100px] truncate text-xs">
                                                    {user.first_name}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-md border-border">
                                            <div className="px-2 py-1.5 text-sm font-medium">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </div>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard">
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/upload">
                                                    Upload Tax Slip
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={handleSignOut}
                                                disabled={isSigningOut}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                {isSigningOut ? "Signing out..." : "Sign Out"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Button 
                                        asChild 
                                        variant="outline" 
                                        size="sm"
                                        className="border-border hover:bg-accent transition-theme h-9 px-2 sm:px-3 text-xs flex-shrink-0"
                                    >
                                        <Link href="/login">Sign In</Link>
                                    </Button>
                                )}

                                {/* Hamburger - Shows when any links are hidden */}
                                {/* XL: hide hamburger (all links visible) */}
                                {shouldShowHamburger("xl") && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSidebarOpen(true)}
                                        aria-label="Open menu"
                                        className="hover:bg-accent h-9 w-9 flex-shrink-0 hidden xl:flex"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                )}

                                {/* LG: show hamburger (1 link hidden) */}
                                {shouldShowHamburger("lg") && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSidebarOpen(true)}
                                        aria-label="Open menu"
                                        className="hover:bg-accent h-9 w-9 flex-shrink-0 hidden lg:flex xl:hidden"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                )}

                                {/* MD: show hamburger (2 links hidden) */}
                                {shouldShowHamburger("md") && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSidebarOpen(true)}
                                        aria-label="Open menu"
                                        className="hover:bg-accent h-9 w-9 flex-shrink-0 hidden md:flex lg:hidden"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                )}

                                {/* SM: show hamburger (5 links hidden) */}
                                {shouldShowHamburger("sm") && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSidebarOpen(true)}
                                        aria-label="Open menu"
                                        className="hover:bg-accent h-9 w-9 flex-shrink-0 hidden sm:flex md:hidden"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                )}

                                {/* XS: show hamburger (all 8 links hidden) */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarOpen(true)}
                                    aria-label="Open menu"
                                    className="hover:bg-accent h-9 w-9 flex-shrink-0 flex sm:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Overlay Backdrop - Transparent (clickable to close sidebar) */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-transparent z-[60] transition-opacity duration-300 ease-in-out"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Slide-out Sidebar */}
            <div 
                className={cn(
                    "fixed top-0 right-0 h-screen w-80 z-[70] border-l border-border/40 backdrop-blur-xl bg-background/95 dark:bg-background/90 supports-[backdrop-filter]:bg-background/90 shadow-2xl transition-transform duration-300 ease-in-out",
                    sidebarOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground">Menu</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="hover:bg-accent h-9 w-9"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Sidebar Content - Scrollable */}
                <div className="flex flex-col h-[calc(100vh-73px)] overflow-y-auto">
                    {/* Navigation Links - Only show hidden links (smart filtering) */}
                    <div className="flex-1 px-4 py-6 space-y-2">
                        {/* XL breakpoint - show only hidden links */}
                        <div className="hidden xl:block">
                            {getHiddenLinks("xl").length > 0 ? (
                                getHiddenLinks("xl").map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={cn(
                                            "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                            pathname === link.href
                                                ? "bg-primary/20 text-primary ring-2 ring-primary/50 dark:bg-primary/90 dark:text-primary-foreground dark:ring-0"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground px-4 py-2">All links visible in navbar</p>
                            )}
                        </div>

                        {/* LG breakpoint - show Connect */}
                        <div className="hidden lg:block xl:hidden">
                            {getHiddenLinks("lg").map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 dark:bg-primary/90 dark:text-primary-foreground dark:ring-0"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* MD breakpoint - show Connect, About */}
                        <div className="hidden md:block lg:hidden">
                            {getHiddenLinks("md").map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 dark:bg-primary/90 dark:text-primary-foreground dark:ring-0"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* SM breakpoint - show 5 hidden links */}
                        <div className="hidden sm:block md:hidden">
                            {getHiddenLinks("sm").map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 dark:bg-primary/90 dark:text-primary-foreground dark:ring-0"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* XS breakpoint - show all 8 links */}
                        <div className="block sm:hidden">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 dark:bg-primary/90 dark:text-primary-foreground dark:ring-0"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/70"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section - Logout Button */}
                    {user && (
                        <div className="border-t border-border/40 p-6">
                            <Button
                                onClick={() => {
                                    handleSignOut();
                                    setSidebarOpen(false);
                                }}
                                disabled={isSigningOut}
                                variant="outline"
                                size="default"
                                className="w-full min-h-[44px] text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                {isSigningOut ? "Signing out..." : "Sign Out"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
