"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { signIn } from "@/actions/auth.actions";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { LoadingButton } from "@/components/ui/loading-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginMutation = useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            if (data.error) {
                setError(data.error);
            } else {
                router.push("/dashboard");
            }
        },
    });

    const onSubmit = (data: LoginFormData) => {
        setError(null);
        loginMutation.mutate(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center animate-gradient px-4">
            <Card className="w-full max-w-md glass glass-border">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg hover-lift">
                        <span className="text-2xl font-bold">TL</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-card-foreground">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your TaxLens account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <LoadingButton
                                type="submit"
                                className="w-full shadow-lg hover-lift"
                                isLoading={loginMutation.isPending}
                                loadingText="Signing in..."
                            >
                                Sign In
                            </LoadingButton>
                        </form>
                    </Form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">
                            Don&apos;t have an account?{" "}
                        </span>
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
