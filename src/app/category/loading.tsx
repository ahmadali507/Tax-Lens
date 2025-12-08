import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
                <Skeleton className="h-10 w-48 mb-4" />
                <Skeleton className="h-6 w-96" />
            </div>

            <div className="mb-8">
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-4 w-4 rounded" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-20 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[400px] w-full rounded" />
                </CardContent>
            </Card>

            <div className="mt-8">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

