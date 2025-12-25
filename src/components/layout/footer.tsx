"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

    if (isAuthPage) return null;
    return (
        <footer className="border-t border-border/40 glass glass-border transition-theme">
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* About */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105">
                                <span className="text-sm font-bold">TL</span>
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                TaxLens
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Promoting transparency and accountability through crowdsourced tax
                            data and government spending insights.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-muted-foreground transition-colors hover:text-foreground inline-block py-1 min-h-[28px]"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-muted-foreground transition-colors hover:text-foreground inline-block py-1 min-h-[28px]"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/projects"
                                    className="text-muted-foreground transition-colors hover:text-foreground inline-block py-1 min-h-[28px]"
                                >
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-muted-foreground transition-colors hover:text-foreground inline-block py-1 min-h-[28px]"
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Resources
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/upload"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Upload Tax Slip
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/category"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/connect"
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Connect
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Connect With Us
                        </h3>
                        <div className="flex space-x-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card transition-all duration-200 hover:scale-110 hover:bg-accent hover:border-accent-foreground"
                                aria-label="GitHub"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card transition-all duration-200 hover:scale-110 hover:bg-accent hover:border-accent-foreground"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a
                                href="mailto:contact@taxlens.com"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card transition-all duration-200 hover:scale-110 hover:bg-accent hover:border-accent-foreground"
                                aria-label="Email"
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} TaxLens. All rights reserved. Built for
                        transparency and accountability.
                    </p>
                </div>
            </div>
        </footer>
    );
}
