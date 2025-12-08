"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

    if (isAuthPage) return null;
    return (
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 dark:border-blue-500/20 dark:bg-gradient-to-r dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40 dark:backdrop-blur-md">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* About */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 dark:bg-blue-500 dark:shadow-blue-500/50">
                                <span className="text-sm font-bold">TL</span>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent dark:from-blue-100 dark:to-blue-300">
                                TaxLens
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-blue-100/70">
                            Promoting transparency and accountability through crowdsourced tax
                            data and government spending insights.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground dark:text-blue-100">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-muted-foreground transition-colors hover:text-foreground dark:text-blue-100/70 dark:hover:text-blue-200"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-muted-foreground transition-colors hover:text-foreground dark:text-blue-100/70 dark:hover:text-blue-200"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/projects"
                                    className="text-muted-foreground transition-colors hover:text-foreground dark:text-blue-100/70 dark:hover:text-blue-200"
                                >
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-muted-foreground transition-colors hover:text-foreground dark:text-blue-100/70 dark:hover:text-blue-200"
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground dark:text-blue-100">
                            Resources
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/upload"
                                    className="text-muted-foreground transition-colors hover:text-foreground dark:text-blue-100/70 dark:hover:text-blue-200"
                                >
                                    Upload Tax Slip
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/category"
                                    className="text-muted-foreground transition-colors hover:text-foreground dark:text-blue-100/70 dark:hover:text-blue-200"
                                >
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/connect"
                                    className="text-muted-foreground transition-colors hover:text-foreground dark:text-blue-100/70 dark:hover:text-blue-200"
                                >
                                    Connect
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground dark:text-blue-100">
                            Connect With Us
                        </h3>
                        <div className="flex space-x-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-accent hover:border-accent dark:border-blue-500/30 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:hover:border-blue-500/50 dark:text-blue-200"
                                aria-label="GitHub"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-accent hover:border-accent dark:border-blue-500/30 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:hover:border-blue-500/50 dark:text-blue-200"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a
                                href="mailto:contact@taxlens.com"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-accent hover:border-accent dark:border-blue-500/30 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:hover:border-blue-500/50 dark:text-blue-200"
                                aria-label="Email"
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground dark:border-blue-500/20 dark:text-blue-100/70">
                    <p>
                        © {new Date().getFullYear()} TaxLens. All rights reserved. Built for
                        transparency and accountability.
                    </p>
                </div>
            </div>
        </footer>
    );
}
