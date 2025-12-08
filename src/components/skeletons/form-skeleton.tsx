import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
                <Skeleton className="h-12 w-12 rounded-lg mx-auto mb-2" />
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}

export function RegisterFormSkeleton() {
    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="space-y-1 text-center">
                <Skeleton className="h-12 w-12 rounded-lg mx-auto mb-2" />
                <Skeleton className="h-8 w-40 mx-auto mb-2" />
                <Skeleton className="h-4 w-72 mx-auto" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    ))}
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}

