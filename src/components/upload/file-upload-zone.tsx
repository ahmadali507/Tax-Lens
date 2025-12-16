"use client";

import { useCallback } from "react";
import { Upload as UploadIcon, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  file: File | null;
  isDragging: boolean;
  onFileSelect: (file: File | null) => void;
  onDragStateChange: (isDragging: boolean) => void;
}

const ACCEPTED_FILE_TYPES = [".pdf", ".png", ".jpg", ".jpeg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUploadZone({
  file,
  isDragging,
  onFileSelect,
  onDragStateChange,
}: FileUploadZoneProps) {
  const validateFile = useCallback((selectedFile: File): boolean => {
    const fileExtension = "." + selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(fileExtension)) {
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      return false;
    }
    return true;
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile && validateFile(selectedFile)) {
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect, validateFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragStateChange(true);
    },
    [onDragStateChange]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragStateChange(false);
    },
    [onDragStateChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragStateChange(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile && validateFile(droppedFile)) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect, onDragStateChange, validateFile]
  );

  const removeFile = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-accent/50"
      }`}
    >
      <input
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        onChange={handleFileChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={!!file}
      />

      {file ? (
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeFile}
            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
            <UploadIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, PNG, JPG (Max 5MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
