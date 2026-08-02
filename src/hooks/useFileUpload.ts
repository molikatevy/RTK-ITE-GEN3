// hooks/useFileUpload.ts
"use client";

import { useState, useCallback } from "react";
import { useUploadFilesMutation } from "@/services/uploadApi";
import { toast } from "sonner";

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxFiles = 10,
    maxSize = 5 * 1024 * 1024, // 5MB
    acceptedTypes = ["image/*", "application/pdf"],
    onSuccess,
    onError,
  } = options;

  const [uploadFiles] = useUploadFilesMutation();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const validFiles: UploadFile[] = [];

      for (const file of newFiles) {
        // Validate file size
        if (file.size > maxSize) {
          toast.error(`"${file.name}" exceeds ${maxSize / (1024 * 1024)}MB limit`);
          continue;
        }

        // Validate file type
        const isValidType = acceptedTypes.some((type) => {
          if (type.includes("*")) {
            const [category] = type.split("/");
            return file.type.startsWith(category);
          }
          return file.type === type;
        });

        if (!isValidType) {
          toast.error(`"${file.name}" is not an accepted file type`);
          continue;
        }

        validFiles.push({
          file,
          progress: 0,
          status: "idle",
        });
      }

      setFiles((prev) => {
        const total = prev.length + validFiles.length;
        if (total > maxFiles) {
          toast.error(`Maximum ${maxFiles} files allowed`);
          return prev;
        }
        return [...prev, ...validFiles];
      });
    },
    [maxFiles, maxSize, acceptedTypes]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setProgress(0);
  }, []);

  const upload = useCallback(async () => {
    if (files.length === 0) {
      toast.error("No files to upload");
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    const filesToUpload = files.map((f) => f.file);

    try {
      // Update status
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "uploading" as const,
        }))
      );

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
        setFiles((prev) =>
          prev.map((f) => ({
            ...f,
            progress: Math.min(f.progress + 10, 90),
          }))
        );
      }, 300);

      const result = await uploadFiles(filesToUpload).unwrap();

      clearInterval(interval);

      if (result.success) {
        setProgress(100);
        setFiles((prev) =>
          prev.map((f) => ({
            ...f,
            status: "success" as const,
            progress: 100,
          }))
        );
        toast.success(`Uploaded ${filesToUpload.length} file(s) successfully`);
        onSuccess?.(result);
        return result;
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "error" as const,
          error: error instanceof Error ? error.message : "Upload failed",
        }))
      );
      toast.error("Upload failed");
      onError?.(error as Error);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [files, uploadFiles, onSuccess, onError]);

  return {
    files,
    isUploading,
    progress,
    addFiles,
    removeFile,
    clearFiles,
    upload,
    setFiles,
  };
}