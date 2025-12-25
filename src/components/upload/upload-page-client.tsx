"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Upload as UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadTaxSlip } from "@/actions/tax-slip.actions";
import { LoadingButton } from "@/components/ui/loading-button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { RecentUploadsClient } from "./recent-uploads-client";
import { UploadFormFields } from "./upload-form-fields";
import { FileUploadZone } from "./file-upload-zone";
import { FormProgressIndicator } from "./form-progress-indicator";
import { PageBackground } from "@/components/ui/page-background";
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

function calculateFormProgress(values: UploadFormData, file: File | null): number {
  const fields = [values.category, values.amount, values.date, file];
  const filledFields = fields.filter((field) => {
    if (typeof field === "string") return field.trim() !== "";
    return field !== null;
  }).length;
  return Math.round((filledFields / fields.length) * 100);
}

export function UploadPageClient({ user, initialTaxSlips }: UploadPageClientProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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

  // Hydrate form from localStorage
  useEffect(() => {
    if (draft.category) form.setValue("category", draft.category);
    if (draft.amount) form.setValue("amount", draft.amount);
    if (draft.date) form.setValue("date", draft.date);
    if (draft.description) form.setValue("description", draft.description);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formValues = form.watch();
  const formProgress = calculateFormProgress(formValues, file);

  // Auto-save draft
  useEffect(() => {
    const { category, amount, date, description } = formValues;
    const hasChanges =
      draft.category !== category ||
      draft.amount !== amount ||
      draft.date !== date ||
      draft.description !== description;

    if (hasChanges) {
      const timer = setTimeout(() => {
        setDraft({ category, amount, date, description });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formValues.category, formValues.amount, formValues.date, formValues.description, draft, setDraft]);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setFileUploadProgress(0);
      const progressInterval = setInterval(() => {
        setFileUploadProgress((prev) => {
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
        toast.error("Upload Failed", { description: result.error });
      } else {
        toast.success("Success!", {
          description: "Your tax slip has been uploaded successfully.",
        });
        form.reset();
        setFile(null);
        setFileUploadProgress(0);
        clearDraft();
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

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      form.setValue("file", selectedFile);
    }
  }, [form]);

  const onSubmit = (data: UploadFormData) => {
    if (!file) {
      toast.error("Missing File", { description: "Please select a file to upload" });
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
    <PageBackground>
      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-full sm:max-w-2xl space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Upload Tax Slip
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              Contribute to transparency by uploading your tax records
            </p>
          </div>

          {/* Form Progress */}
          <FormProgressIndicator
            progress={formProgress}
            isUploading={uploadMutation.isPending}
            uploadProgress={fileUploadProgress}
          />

          {/* Main Form Card */}
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
                  <UploadFormFields form={form} />

                  <FileUploadZone
                    file={file}
                    isDragging={isDragging}
                    onFileSelect={handleFileSelect}
                    onDragStateChange={setIsDragging}
                  />

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
          <RecentUploadsClient taxSlips={initialTaxSlips} onRefresh={() => router.refresh()} />
        </div>
      </div>
    </PageBackground>
  );
}
