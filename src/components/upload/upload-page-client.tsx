"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Upload as UploadIcon } from "lucide-react";
import { taxSlipSchema } from "@/lib/validations/tax-slip";
import { uploadTaxSlip } from "@/actions/tax-slip.actions";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RecentUploadsClient } from "./recent-uploads-client";
import type { User, TaxSlip } from "@/types";

type UploadFormData = {
    category: string;
    amount: string;
    date: string;
    description: string;
    file: File | null;
};

interface UploadPageClientProps {
    user: User;
    initialTaxSlips: TaxSlip[];
}

export function UploadPageClient({ user, initialTaxSlips }: UploadPageClientProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<UploadFormData>({
        defaultValues: {
            category: "",
            amount: "",
            date: "",
            description: "",
            file: null,
        },
    });

    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await uploadTaxSlip(formData);
        },
        onSuccess: (result) => {
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                form.reset();
                setFile(null);
                
                // Refresh the page to get updated data
                router.refresh();
                
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            }
        },
        onError: (error: Error) => {
            setError(error.message || "Failed to upload tax slip. Please try again.");
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

            if (!allowedTypes.includes(selectedFile.type)) {
                setError("Only .jpg, .jpeg, .png, and .pdf files are accepted");
                setFile(null);
                return;
            }

            if (selectedFile.size > maxSize) {
                setError("File size must be less than 5MB");
                setFile(null);
                return;
            }

            setFile(selectedFile);
            setError(null);
            form.setValue("file", selectedFile);
        }
    };

    const onSubmit = (data: UploadFormData) => {
        if (!file) {
            setError("Please select a file to upload");
            return;
        }

        setError(null);

        const formData = new FormData();
        formData.append("category", data.category);
        formData.append("amount", data.amount);
        formData.append("date", data.date);
        if (data.description) formData.append("description", data.description);
        formData.append("file", file);

        uploadMutation.mutate(formData);
    };

    return (
        <div className="container mx-auto px-4 py-12 bg-background">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight dark:text-blue-100">
                        Upload Tax Slip
                    </h1>
                    <p className="text-lg text-muted-foreground dark:text-blue-200/80">
                        Contribute to transparency by uploading your tax records
                    </p>
                </div>

                <Card className="border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 dark:border-blue-500/20 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/40 dark:backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="dark:text-blue-100">Tax Slip Information</CardTitle>
                        <CardDescription className="dark:text-blue-200/80">
                            Fill in the details and upload a copy of your tax slip or receipt
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
                            <div className="mb-4 flex items-center gap-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-600 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-300">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Tax slip uploaded successfully!</span>
                            </div>
                        )}

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Category */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-blue-100">Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-blue-400/50">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="dark:border-blue-500/30 dark:bg-blue-950/90">
                                                    <SelectItem value="income">Income Tax</SelectItem>
                                                    <SelectItem value="food">Food</SelectItem>
                                                    <SelectItem value="travel">Travel</SelectItem>
                                                    <SelectItem value="utilities">Utilities</SelectItem>
                                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="education">Education</SelectItem>
                                                    <SelectItem value="entertainment">Entertainment</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Amount */}
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-blue-100">Amount (PKR)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="10,000"
                                                    {...field}
                                                    className="dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-blue-400/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date */}
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-blue-100">Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    className="dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-blue-400/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-blue-100">Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Add any additional details about this tax payment..."
                                                    className="min-h-[80px] dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-blue-400/50 resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none dark:text-blue-100">
                                        Tax Slip File *
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                className="cursor-pointer file:cursor-pointer file:border-0 file:bg-primary/10 file:text-primary file:hover:bg-primary/20 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100 dark:file:bg-blue-500/20 dark:file:text-blue-200 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-blue-400/50"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground dark:text-blue-200/60">
                                            Accepted formats: PDF, JPG, PNG (Max 5MB)
                                        </p>
                                        {file && (
                                            <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm border dark:border-blue-500/20 dark:bg-blue-500/10">
                                                <UploadIcon className="h-4 w-4 text-primary dark:text-blue-400" />
                                                <span className="truncate dark:text-blue-100">{file.name}</span>
                                                <span className="text-muted-foreground dark:text-blue-200/70">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <LoadingButton
                                    type="submit"
                                    className="w-full dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
                                    isLoading={uploadMutation.isPending}
                                    disabled={success}
                                    loadingText="Uploading..."
                                >
                                    <UploadIcon className="mr-2 h-4 w-4" />
                                    Upload Tax Slip
                                </LoadingButton>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Recent Uploads */}
                <RecentUploadsClient 
                    taxSlips={initialTaxSlips}
                    onRefresh={() => router.refresh()}
                />
            </div>
        </div>
    );
}
