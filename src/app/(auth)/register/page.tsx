"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { signUp } from "@/actions/auth.actions";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
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

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            cnic: "",
            contactNo: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const registerMutation = useMutation({
        mutationFn: signUp,
        onSuccess: (data) => {
            if (data.error) {
                setError(data.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        setError(null);
        registerMutation.mutate(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 dark:from-blue-950/50 dark:to-blue-900/30">
            <Card className="w-full max-w-lg border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40 dark:backdrop-blur-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md dark:bg-blue-500 dark:shadow-blue-500/50">
                        <span className="text-2xl font-bold">TL</span>
                    </div>
                    <CardTitle className="text-2xl font-bold dark:text-blue-100">Create Account</CardTitle>
                    <CardDescription className="dark:text-blue-200/80">
                        Join TaxLens to contribute to tax transparency
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-300">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:bg-green-500/20 dark:text-green-300">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Account created successfully! Redirecting to login...</span>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-blue-100">First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John"
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
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-blue-100">Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Doe"
                                                    {...field}
                                                    className="dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="cnic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-blue-100">CNIC No</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="12345-1234567-1"
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
                                name="contactNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-blue-100">Contact No</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="+92 300 1234567"
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
                                                placeholder="Create a strong password"
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
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-blue-100">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Re-enter your password"
                                                {...field}
                                                className="dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <LoadingButton
                                type="submit"
                                className="w-full dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
                                isLoading={registerMutation.isPending}
                                disabled={success}
                                loadingText="Creating account..."
                            >
                                Create Account
                            </LoadingButton>
                        </form>
                    </Form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground dark:text-blue-200/70">
                            Already have an account?{" "}
                        </span>
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline dark:text-blue-300"
                        >
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
