import { Mail, Github, Linkedin } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
    return (
        <div className="containermx-auto px-4 py-12">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight">
                        About TaxLens
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Building trust through financial transparency
                    </p>
                </div>

                {/* Mission */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>
                            TaxLens is a grassroots initiative designed to promote government
                            accountability through financial transparency. We believe that
                            every citizen deserves to know how their tax contributions are
                            being utilized by the government.
                        </p>
                        <p>
                            By crowdsourcing tax data from individual contributors, we create
                            a comprehensive public record of tax collection that can be
                            compared against government spending on various projects and
                            initiatives.
                        </p>
                    </CardContent>
                </Card>

                {/* Core Features */}
                <div className="mb-12">
                    <h2 className="mb-6 text-2xl font-bold">Core Features</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Crowdsourced Tax Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Citizens can upload their paid tax slips and records, creating a
                                transparent database of tax contributions with historical
                                tracking and categorization.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Government Spending Monitor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Track government projects and their allocated budgets, enabling
                                citizens to stay informed about how public funds are being
                                invested.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Data Visualization</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Interactive dashboards compare crowdsourced tax inflow with
                                government expenditure, making complex financial data
                                accessible.
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Personal Insights</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Monthly breakdowns help users understand their own tax
                                contributions by category, identifying spending patterns.
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Design Identity */}
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Design Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <div>
                            <h3 className="mb-2 font-semibold text-foreground">
                                Blue Primary Color
                            </h3>
                            <p className="text-sm">
                                Establishes trust, security, and professionalism - critical for
                                a financial transparency platform.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-semibold text-foreground">
                                Modern Typography
                            </h3>
                            <p className="text-sm">
                                Clean, sans-serif typeface ensures maximum readability for
                                data-heavy content and objective presentation.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-semibold text-foreground">
                                Dual-Theme System
                            </h3>
                            <p className="text-sm">
                                Light mode offers clean accessibility, while dark mode is
                                optimized for data analysis with reduced eye strain.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Team */}
                <div>
                    <h2 className="mb-6 text-2xl font-bold">Our Team</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Ahmad Ali Shahid</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Lead Developer
                                </p>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Full-stack engineer responsible for platform development and
                                    technical implementation.
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href="https://github.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                    >
                                        <Github className="h-4 w-4" />
                                    </a>
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Abdul Hadi Asad</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    UI/UX Designer
                                </p>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Oversees user interfaces, experience design, wireframing, and
                                    prototypes for the platform.
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                    <a
                                        href="mailto:designer@taxlens.com"
                                        className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                    >
                                        <Mail className="h-4 w-4" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Muhammad Hassan Ali</CardTitle>
                                <p className="text-sm text-muted-foreground">Project Lead</p>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Drives project strategy, execution, task management, and team
                                    coordination.
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                    <a
                                        href="mailto:lead@taxlens.com"
                                        className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-accent"
                                    >
                                        <Mail className="h-4 w-4" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
