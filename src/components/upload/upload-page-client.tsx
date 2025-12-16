"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Upload as UploadIcon, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { taxSlipSchema } from "@/lib/validations/tax-slip";
import { uploadTaxSlip } from "@/actions/tax-slip.actions";
import { LoadingButton } from "@/components/ui/loading-button";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
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

// Helper function to calculate form completion progress
function calculateFormProgress(values: UploadFormData, file: File | null): number {
    const fields = [
        values.category,
        values.amount,
        values.date,
        file,
    ];
    
    const filledFields = fields.filter(field => {
        if (typeof field === 'string') return field.trim() !== '';
        return field !== null;
    }).length;
    
    return Math.round((filledFields / fields.length) * 100);
}

export function UploadPageClient({ user, initialTaxSlips }: UploadPageClientProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [fileUploadProgress, setFileUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    
    // Form draft persistence
    const [draft, setDraft, clearDraft] = useLocalStorage<Partial<UploadFormData>>(
        `tax-slip-draft-${user.id}`,
        {}
    );

    const form = useForm<UploadFormData>({
        defaultValues: {
            category: "",
            amount: "",
            date: "",
            description: "",
            file: null,
        },
    });

    // Hydrate form from localStorage after mount (client-only)
    useEffect(() => {
        if (draft.category) form.setValue('category', draft.category);
        if (draft.amount) form.setValue('amount', draft.amount);
        if (draft.date) form.setValue('date', draft.date);
        if (draft.description) form.setValue('description', draft.description);
        setIsHydrated(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Calculate form completion progress
    const formValues = form.watch();
    const formProgress = calculateFormProgress(formValues, file);

    // Auto-save draft on form change (debounced to avoid performance issues)
    useEffect(() => {
        const { category, amount, date, description } = formValues;
        
        // Only update if values actually changed
        const hasChanges = 
            draft.category !== category ||
            draft.amount !== amount ||
            draft.date !== date ||
            draft.description !== description;
        
        if (hasChanges) {
            const timer = setTimeout(() => {
                setDraft({ category, amount, date, description });
            }, 500); // Debounce for 500ms
            
            return () => clearTimeout(timer);
        }
    }, [formValues.category, formValues.amount, formValues.date, formValues.description, draft, setDraft]);

    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            // Simulate file upload progress
            setFileUploadProgress(0);
            const progressInterval = setInterval(() => {
                setFileUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const result = await uploadTaxSlip(formData);
            clearInterval(progressInterval);
            setFileUploadProgress(100);
            
            return result;
        },
        onSuccess: (result) => {
            if (result.error) {
                toast.error("Upload Failed", {
                    description: result.error,
                });
            } else {
                toast.success("Success!", {
                    description: "Your tax slip has been uploaded successfully.",
                });
                form.reset();
                setFile(null);
                setFileUploadProgress(0);
                clearDraft(); // Clear saved draft
                
                // Refresh the page to get updated data
                router.refresh();
            }
        },
        onError: (error: Error) => {
            toast.error("Upload Failed", {
                description: error.message || "Failed to upload tax slip. Please try again.",
            });
            setFileUploadProgress(0);
        },
    });

    const handleFileChange = (selectedFile: File | null) => {
        if (!selectedFile) return;

        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

        if (!allowedTypes.includes(selectedFile.type)) {
            toast.error("Invalid File Type", {
                description: "Only .jpg, .jpeg, .png, and .pdf files are accepted",
            });
            return;
        }

        if (selectedFile.size > maxSize) {
            toast.error("File Too Large", {
                description: "File size must be less than 5MB",
            });
            return;
        }

        setFile(selectedFile);
        form.setValue("file", selectedFile);
    };

    // Drag and drop handlers
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    }, []);

    const removeFile = () => {
        setFile(null);
        form.setValue("file", null);
    };

    const onSubmit = (data: UploadFormData) => {
        if (!file) {
            toast.error("Missing File", {
                description: "Please select a file to upload",
            });
            return;
        }

        const formData = new FormData();
        formData.append("category", data.category);
        formData.append("amount", data.amount);
        formData.append("date", data.date);
        formData.append("description", data.description || "");
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

                {/* Form Completion Progress */}
                <Card className="glass glass-border mb-6 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Form Completion</span>
                                <span suppressHydrationWarning className="text-lg font-bold text-primary">{formProgress}%</span>
                            </div>
                            <div className="relative">
                                <div suppressHydrationWarning className="h-4 w-full rounded-full bg-secondary/50">
                                    <div 
                                        suppressHydrationWarning
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
                                        style={{ width: `${formProgress}%` }}
                                    />
                                </div>
                            </div>
                            {formProgress < 100 && (
                                <p className="text-xs text-muted-foreground">
                                    Fill all required fields (category, amount, date, file) to submit
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass glass-border">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Tax Slip Information</CardTitle>
                        <CardDescription>
                            Fill in the details and upload a copy of your tax slip or receipt
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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

                                {/* File Upload with Drag & Drop */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-foreground">
                                        Tax Slip File *
                                    </label>
                                    
                                    <div
                                        onDragEnter={handleDragEnter}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`relative rounded-lg border-2 border-dashed transition-all ${
                                            isDragging
                                                ? "border-primary bg-primary/5"
                                                : "border-border bg-muted/20"
                                        }`}
                                    >
                                        {!file ? (
                                            <label className="flex cursor-pointer flex-col items-center justify-center py-8 px-4">
                                                <UploadIcon className={`h-10 w-10 mb-3 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                                                <span className="text-sm font-medium text-foreground">
                                                    {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    PDF, JPG, PNG (Max 5MB)
                                                </span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                                    className="hidden"
                                                />
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-primary/10 p-2">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(file.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeFile}
                                                    className="rounded-full p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* File Upload Progress */}
                                {uploadMutation.isPending && fileUploadProgress > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-foreground">Uploading...</span>
                                            <span className="text-muted-foreground">{fileUploadProgress}%</span>
                                        </div>
                                        <Progress value={fileUploadProgress} className="h-2" />
                                    </div>
                                )}

                                <LoadingButton
                                    type="submit"
                                    className="w-full shadow-lg hover-lift flex items-center justify-center"
                                    isLoading={uploadMutation.isPending}
                                    disabled={formProgress < 100}
                                    loadingText="Uploading..."
                                >
                                    <div className="flex items-center gap-2">
                                        <UploadIcon className="h-4 w-4" />
                                        <span>Upload Tax Slip</span>
                                    </div>
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
