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

type Project = {
    id: string;
    name: string;
    description: string;
    status: "completed" | "ongoing" | "planned" | "cancelled";
    progress_percentage: number;
    allocated_budget: number;
    spent_amount: number;
    details_url?: string;
};

// Dummy project data
const dummyProjects: Project[] = [
    {
        id: "1",
        name: "Karachi Circular Railway",
        description:
            "Revitalization of the Karachi Circular Railway to improve public transportation and reduce traffic congestion in the metropolitan area.",
        status: "ongoing",
        progress_percentage: 65,
        allocated_budget: 25000000000,
        spent_amount: 16250000000,
        details_url: "#",
    },
    {
        id: "2",
        name: "Lahore Metro Bus Extension",
        description:
            "Extension of the metro bus network to connect more areas of Lahore, improving accessibility for residents.",
        status: "ongoing",
        progress_percentage: 45,
        allocated_budget: 18000000000,
        spent_amount: 8100000000,
        details_url: "#",
    },
    {
        id: "3",
        name: "Islamabad Expressway Widening",
        description:
            "Widening and improvement of the Islamabad Expressway to accommodate increasing traffic and reduce commute times.",
        status: "completed",
        progress_percentage: 100,
        allocated_budget: 12000000000,
        spent_amount: 11500000000,
        details_url: "#",
    },
    {
        id: "4",
        name: "Quetta Water Supply Project",
        description:
            "New water supply system for Quetta city to address water scarcity and improve access to clean drinking water.",
        status: "ongoing",
        progress_percentage: 78,
        allocated_budget: 15000000000,
        spent_amount: 11700000000,
        details_url: "#",
    },
    {
        id: "5",
        name: "Peshawar BRT Phase 2",
        description:
            "Second phase of the Bus Rapid Transit system in Peshawar to expand coverage and improve public transport.",
        status: "planned",
        progress_percentage: 15,
        allocated_budget: 22000000000,
        spent_amount: 3300000000,
        details_url: "#",
    },
    {
        id: "6",
        name: "Gwadar Port Development",
        description:
            "Infrastructure development for Gwadar Port to enhance trade capacity and economic activity in the region.",
        status: "ongoing",
        progress_percentage: 82,
        allocated_budget: 50000000000,
        spent_amount: 41000000000,
        details_url: "#",
    },
    {
        id: "7",
        name: "Multan Ring Road",
        description:
            "Construction of a ring road around Multan to reduce city traffic and improve connectivity with surrounding areas.",
        status: "ongoing",
        progress_percentage: 58,
        allocated_budget: 30000000000,
        spent_amount: 17400000000,
        details_url: "#",
    },
    {
        id: "8",
        name: "Faisalabad Industrial Zone",
        description:
            "Development of a new industrial zone in Faisalabad to promote manufacturing and create employment opportunities.",
        status: "planned",
        progress_percentage: 25,
        allocated_budget: 40000000000,
        spent_amount: 10000000000,
        details_url: "#",
    },
    {
        id: "9",
        name: "Sukkur Barrage Rehabilitation",
        description:
            "Rehabilitation and modernization of Sukkur Barrage to improve irrigation efficiency and water management.",
        status: "completed",
        progress_percentage: 100,
        allocated_budget: 8000000000,
        spent_amount: 7800000000,
        details_url: "#",
    },
];

export default function ProjectsPage() {
    const projects = dummyProjects;

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
                return "bg-green-500/10 text-green-600 dark:text-green-400";
            case "ongoing":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
            case "planned":
                return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
            case "cancelled":
                return "bg-red-500/10 text-red-600 dark:text-red-400";
            default:
                return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="mb-4 text-4xl font-bold tracking-tight">
                    Government Projects
                </h1>
                <p className="text-lg text-muted-foreground">
                    Track government spending and project progress across various sectors
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                            <div className="mb-2 flex items-start justify-between">
                                <CardTitle className="text-lg leading-tight">
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
                                        <span className="font-medium">
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
                                        <span className="font-medium">
                                            {formatCurrency(project.allocated_budget)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Spent</span>
                                        <span className="font-medium">
                                            {formatCurrency(project.spent_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Remaining</span>
                                        <span className="font-medium">
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
    );
}
