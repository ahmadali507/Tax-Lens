import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { scrapedProjects } from "@/data/scraped-projects";

import { PageBackground } from "@/components/ui/page-background";

export default function ProjectsPage() {
    const projects = scrapedProjects;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500/10 text-green-700 border-green-500/20";
            case "ongoing":
                return "bg-blue-500/10 text-blue-700 border-blue-500/20";
            case "planned":
                return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
            case "cancelled":
                return "bg-red-500/10 text-red-700 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-700 border-gray-500/20";
        }
    };

    return (
        <PageBackground>
            <div className="container mx-auto px-4 py-24">
                <div className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                        Government Projects
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Track government spending and project progress across various sectors
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="flex flex-col glass glass-border hover-lift">
                            <CardHeader>
                                <div className="mb-2 flex items-start justify-between">
                                    <CardTitle className="text-lg leading-tight text-card-foreground">
                                        {project.name}
                                    </CardTitle>
                                    <Badge className={getStatusColor(project.status)}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <CardDescription className="line-clamp-2">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    <div>
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-medium text-foreground">
                                                {project.progress_percentage}%
                                            </span>
                                        </div>
                                        <Progress value={project.progress_percentage} />
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Allocated Budget
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {formatCurrency(project.allocated_budget)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Spent</span>
                                            <span className="font-medium text-foreground">
                                                {formatCurrency(project.spent_amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Remaining</span>
                                            <span className="font-medium text-foreground">
                                                {formatCurrency(
                                                    project.allocated_budget - project.spent_amount
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {project.details_url && (
                                        <Link
                                            href={project.details_url}
                                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                                        >
                                            View Details
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No projects found. Check back later for updates.
                        </p>
                    </div>
                )}
            </div>
        </PageBackground>
    );
}
