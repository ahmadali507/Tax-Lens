import { ProjectGridSkeleton } from "@/components/skeletons/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-6 w-96" />
            </div>
            <ProjectGridSkeleton count={6} />
        </div>
    );
}

