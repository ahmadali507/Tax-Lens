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
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
                        Upload Tax Slip
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Contribute to transparency by uploading your tax records
                    </p>
                </div>

                <Card className="glass glass-border">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Tax Slip Information</CardTitle>
                        <CardDescription>
                            Fill in the details and upload a copy of your tax slip or receipt
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 flex items-center gap-2 rounded-md bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-600">
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
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
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
                                            <FormLabel>Amount (PKR)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="10,000"
                                                    {...field}
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
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
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
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Add any additional details about this tax payment..."
                                                    className="min-h-[80px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-foreground">
                                        Tax Slip File *
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                className="cursor-pointer file:cursor-pointer file:border-0 file:bg-primary/10 file:text-primary file:hover:bg-primary/20"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Accepted formats: PDF, JPG, PNG (Max 5MB)
                                        </p>
                                        {file && (
                                            <div className="flex items-center gap-2 rounded-md bg-muted border border-border p-2 text-sm">
                                                <UploadIcon className="h-4 w-4 text-primary" />
                                                <span className="truncate text-foreground">{file.name}</span>
                                                <span className="text-muted-foreground">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <LoadingButton
                                    type="submit"
                                    className="w-full shadow-lg hover-lift"
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
