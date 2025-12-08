"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/projects", label: "Projects" },
    { href: "/category", label: "Categories" },
    { href: "/upload", label: "Upload" },
    { href: "/about", label: "About" },
    { href: "/connect", label: "Connect" },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

    if (isAuthPage) return null;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 dark:border-blue-500/20 dark:bg-gradient-to-r dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40 dark:backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80 z-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 dark:bg-blue-500 dark:shadow-blue-500/50">
                            <span className="text-xl font-bold">TL</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent dark:from-blue-100 dark:to-blue-300">
                            TaxLens
                        </span>
                    </Link>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-1 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    pathname === link.href
                                        ? "bg-primary text-primary-foreground shadow-md dark:bg-blue-500 dark:text-white dark:shadow-blue-500/50"
                                        : "text-foreground/70 hover:text-foreground hover:bg-accent/50 dark:text-blue-100/80 dark:hover:text-blue-200 dark:hover:bg-blue-500/20"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-2 z-10">
                        <ThemeToggle />
                        <Button 
                            asChild 
                            variant="outline" 
                            size="sm"
                            className="border-border/50 hover:bg-accent dark:border-blue-500/30 dark:hover:bg-blue-500/20 dark:hover:border-blue-500/50 dark:text-blue-100"
                        >
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center space-x-2 md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            className="dark:hover:bg-blue-500/20"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5 dark:text-blue-200" />
                            ) : (
                                <Menu className="h-5 w-5 dark:text-blue-200" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="border-t border-border/40 py-4 md:hidden dark:border-blue-500/20">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                        pathname === link.href
                                            ? "bg-primary text-primary-foreground shadow-md dark:bg-blue-500 dark:text-white dark:shadow-blue-500/50"
                                            : "text-foreground/70 hover:text-foreground hover:bg-accent/50 dark:text-blue-100/80 dark:hover:text-blue-200 dark:hover:bg-blue-500/20"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Button 
                                asChild 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-border/50 hover:bg-accent dark:border-blue-500/30 dark:hover:bg-blue-500/20 dark:hover:border-blue-500/50 dark:text-blue-100"
                            >
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    Sign In
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
