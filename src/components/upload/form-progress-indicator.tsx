"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface FormProgressIndicatorProps {
  progress: number;
  isUploading: boolean;
  uploadProgress: number;
}

export function FormProgressIndicator({
  progress,
  isUploading,
  uploadProgress,
}: FormProgressIndicatorProps) {
  return (
    <Card className="glass glass-border">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Form Completion */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Form Completion
              </span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="mt-1 text-xs text-muted-foreground">
                Fill in all required fields to enable submission
            </p>
          </div>

          {/* Upload Progress (only shown when uploading) */}
          {isUploading && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Upload Progress
                </span>
                <span className="text-sm font-bold text-primary">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Completion Message */}
          {progress === 100 && !isUploading && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">Ready to submit!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
