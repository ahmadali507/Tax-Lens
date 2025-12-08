"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "@/actions/auth.actions";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 dark:from-blue-950/50 dark:to-blue-900/30">
            <Card className="w-full max-w-md border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40 dark:backdrop-blur-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md dark:bg-blue-500 dark:shadow-blue-500/50">
                        <span className="text-2xl font-bold">TL</span>
                    </div>
                    <CardTitle className="text-2xl font-bold dark:text-blue-100">Welcome Back</CardTitle>
                    <CardDescription className="dark:text-blue-200/80">
                        Sign in to your TaxLens account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-300">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
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
                                        <FormLabel className="dark:text-blue-100">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                {...field}
                                                className="dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100"
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
                                        <FormLabel className="dark:text-blue-100">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                                className="dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground dark:text-blue-200/70">
                            Don&apos;t have an account?{" "}
                        </span>
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline dark:text-blue-300"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
