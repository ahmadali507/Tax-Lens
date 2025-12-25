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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    return (
        <nav className="fixed top-4 inset-x-0 max-w-7xl mx-auto z-50 px-4">
            <div className="rounded-full border border-border/40 backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60 transition-all duration-300 shadow-lg">
                <div className="px-4 lg:px-6">
                    <div className="relative flex h-14 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 transition-all hover:opacity-90 z-10 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/50">
                                <span className="text-base font-bold">TL</span>
                            </div>
                            <span className="text-lg font-bold text-foreground hidden sm:block">
                                TaxLens
                            </span>
                        </Link>

                        {/* Desktop Navigation - Centered - Progressive Responsive */}
                        {/* Show all links on xl screens */}
                        <div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-0.5 xl:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-2.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/90 dark:text-primary-foreground dark:ring-0 dark:shadow-lg dark:shadow-primary/30"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        
                        {/* Show reduced links on lg screens (hide Track Expenditure, Connect) */}
                        <div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-0.5 lg:flex xl:hidden">
                            {navLinks.filter(link => !["Track Expenditure", "Connect"].includes(link.label)).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-2.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/90 dark:text-primary-foreground dark:ring-0 dark:shadow-lg dark:shadow-primary/30"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        
                        {/* Show minimal links on md screens (only Home, Dashboard, Projects, Upload) */}
                        <div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-0.5 md:flex lg:hidden">
                            {navLinks.filter(link => ["Home", "Dashboard", "Projects", "Upload"].includes(link.label)).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-2.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/90 dark:text-primary-foreground dark:ring-0 dark:shadow-lg dark:shadow-primary/30"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2 z-10">
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                            {user ? (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="border-border hover:bg-accent transition-theme hidden md:flex"
                                            >
                                                <UserIcon className="h-4 w-4 mr-2" />
                                                <span className="max-w-[120px] truncate">{user.first_name} {user.last_name}</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-md border-border">
                                            <div className="px-2 py-1.5 text-sm font-medium">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="px-2 py-1.5 text-xs text-muted-foreground">
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
                                </>
                            ) : (
                                <Button 
                                    asChild 
                                    variant="outline" 
                                    size="sm"
                                    className="border-border hover:bg-accent transition-theme hidden md:flex"
                                >
                                    <Link href="/login">Sign In</Link>
                                </Button>
                            )}
                            
                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                                className="hover:bg-accent md:hidden"
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="border-t border-border py-4 md:hidden animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col space-y-3 px-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 min-h-[44px] flex items-center",
                                        pathname === link.href
                                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/90 dark:text-primary-foreground dark:ring-0 dark:shadow-lg dark:shadow-primary/30"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/70 active:bg-accent"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            
                            <div className="pt-3 mt-2 border-t border-border flex items-center justify-between px-2">
                                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                                <ThemeToggle />
                            </div>
                            
                            {user ? (
                                <div className="pt-3 mt-2 border-t border-border space-y-3">
                                    <div className="px-2">
                                        <div className="text-sm font-semibold text-foreground">
                                            {user.first_name} {user.last_name}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {user.email}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleSignOut}
                                        disabled={isSigningOut}
                                        variant="outline"
                                        size="default"
                                        className="w-full min-h-[44px] text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        {isSigningOut ? "Signing out..." : "Sign Out"}
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    asChild 
                                    variant="outline" 
                                    size="default" 
                                    className="w-full min-h-[44px] border-border hover:bg-accent mt-2"
                                >
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        Sign In
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </nav>
    );
}
