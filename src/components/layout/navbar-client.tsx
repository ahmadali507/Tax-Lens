"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
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
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-background/95 supports-[backdrop-filter]:bg-background/90 transition-theme shadow-sm">
            <div className="container mx-auto px-4">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80 z-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105">
                            <span className="text-xl font-bold">TL</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">
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
                                        ? "bg-primary/90 text-primary-foreground shadow-lg ring-2 ring-primary/50"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-2 z-10">
                        <ThemeToggle />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="border-border hover:bg-accent transition-theme"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        {user.first_name} {user.last_name}
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
                        ) : (
                            <Button 
                                asChild 
                                variant="outline" 
                                size="sm"
                                className="border-border hover:bg-accent transition-theme"
                            >
                                <Link href="/login">Sign In</Link>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center space-x-2 md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            className="hover:bg-accent"
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
                    <div className="border-t border-border py-4 md:hidden">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                        pathname === link.href
                                            ? "bg-primary/90 text-primary-foreground shadow-lg ring-2 ring-primary/50"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            
                            {user ? (
                                <div className="pt-2 border-t border-border">
                                    <div className="px-3 py-2 text-sm font-medium">
                                        {user.first_name} {user.last_name}
                                    </div>
                                    <Button
                                        onClick={handleSignOut}
                                        disabled={isSigningOut}
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        {isSigningOut ? "Signing out..." : "Sign Out"}
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    asChild 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-border hover:bg-accent"
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
        </nav>
    );
}
