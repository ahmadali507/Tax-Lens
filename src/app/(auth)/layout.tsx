import { PageBackground } from "@/components/ui/page-background";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageBackground>
            <div className="flex min-h-screen items-center justify-center px-4 py-12">
                {children}
            </div>
        </PageBackground>
    );
}
