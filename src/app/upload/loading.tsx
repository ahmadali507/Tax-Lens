import { DashboardPageSkeleton } from "@/components/skeletons";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 text-center">
                    <div className="h-10 w-1/2 mx-auto mb-4 bg-muted rounded-md animate-pulse" />
                    <div className="h-6 w-3/4 mx-auto bg-muted rounded-md animate-pulse" />
                </div>
                
                {/* Upload form skeleton */}
                <div className="glass glass-border rounded-lg p-6 space-y-6">
                    <div className="h-6 w-1/3 bg-muted rounded-md animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted rounded-md animate-pulse" />
                    
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-1/4 bg-muted rounded-md animate-pulse" />
                                <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
                            </div>
                        ))}
                    </div>
                    
                    <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
                </div>

                {/* Recent uploads skeleton */}
                <div className="mt-8 glass glass-border rounded-lg p-6">
                    <div className="h-6 w-1/3 bg-muted rounded-md animate-pulse mb-2" />
                    <div className="h-4 w-2/3 bg-muted rounded-md animate-pulse mb-4" />
                    <div className="text-center">
                        <div className="h-4 w-1/2 mx-auto bg-muted rounded-md animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
