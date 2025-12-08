"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Upload as UploadIcon } from "lucide-react";
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
    FormDescription,
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
import { z } from "zod";

const uploadSchema = z.object({
    category: z.string().min(1, "Please select a category"),
    amount: z.string().min(1, "Amount is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            category: "",
            amount: "",
            date: "",
            description: "",
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
        }
    };

    const onSubmit = async (data: UploadFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // TODO: Implement file upload to Supabase Storage
            // TODO: Save tax slip data to database

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSuccess(true);
            form.reset();
            setFile(null);

            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } catch (err) {
            setError("Failed to upload tax slip. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight">
                        Upload Tax Slip
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Contribute to transparency by uploading your tax records
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tax Slip Information</CardTitle>
                        <CardDescription>
                            Fill in the details and upload a copy of your tax slip or receipt
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
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
                                                    <SelectItem value="entertainment">
                                                        Entertainment
                                                    </SelectItem>
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
                                                    placeholder="10000"
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
                                                <Input type="date" {...field} />
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
                                                    placeholder="Add any additional details..."
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Tax Slip File
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Accepted formats: PDF, JPG, PNG (Max 5MB)
                                        </p>
                                        {file && (
                                            <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm">
                                                <UploadIcon className="h-4 w-4" />
                                                <span className="truncate">{file.name}</span>
                                                <span className="text-muted-foreground">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting || success}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <UploadIcon className="mr-2 h-4 w-4" />
                                            Upload Tax Slip
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Recent Uploads */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Recent Uploads</CardTitle>
                        <CardDescription>
                            Your recently uploaded tax slips
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-sm text-muted-foreground">
                            No uploads yet. Upload your first tax slip above.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
