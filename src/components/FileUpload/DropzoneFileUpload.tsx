// components/FileUpload/DropzoneFileUpload.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadFilesMutation } from "@/services/uploadApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Upload,
  X,
  File,
  Image,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface UploadFile {
  file: File;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}

const getFileIcon = (file: File) => {
  const type = file.type;
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("pdf")) return FileText;
  if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
  if (type.includes("document") || type.includes("word")) return FileText;
  if (type.includes("code") || type.includes("javascript") || type.includes("json")) return FileCode;
  return File;
};

export function DropzoneFileUpload() {
  const [uploadFiles] = useUploadFilesMutation();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "idle",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    const filesToUpload = files.map((f) => f.file);

    try {
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "uploading" as const,
        }))
      );

      // Simulate progress for each file
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.status === "uploading" && f.progress < 90) {
              return { ...f, progress: Math.min(f.progress + 10, 90) };
            }
            return f;
          })
        );
      }, 200);

      const result = await uploadFiles(filesToUpload).unwrap();

      clearInterval(progressInterval);

      if (result.success) {
        setFiles((prev) =>
          prev.map((f) => ({
            ...f,
            status: "success" as const,
            progress: 100,
          }))
        );
        toast.success(`Successfully uploaded ${filesToUpload.length} file(s)`);
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
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "uploading":
        return <Upload className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Drag & Drop File Upload</CardTitle>
        <CardDescription>
          Drag and drop files here or click to browse. Max 10 files, 5MB each.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }
            ${isUploading ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-12 w-12 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-lg font-medium">
                  Drag & drop files here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Supported: Images, PDF, Word, Excel
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                {files.length} file(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || files.length === 0}
                  size="sm"
                >
                  {isUploading ? "Uploading..." : "Upload All"}
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {files.map((fileData, index) => {
                const FileIcon = getFileIcon(fileData.file);
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 border rounded-lg ${
                      fileData.status === "success"
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : fileData.status === "error"
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : fileData.status === "uploading"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-muted"
                    }`}
                  >
                    <FileIcon className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {fileData.file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{(fileData.file.size / 1024).toFixed(1)} KB</span>
                        {fileData.status === "success" && (
                          <span className="text-green-600">Uploaded</span>
                        )}
                        {fileData.status === "error" && (
                          <span className="text-red-500">{fileData.error}</span>
                        )}
                      </div>
                      {fileData.status === "uploading" && (
                        <Progress value={fileData.progress} className="h-1 mt-1" />
                      )}
                    </div>
                    {getStatusIcon(fileData.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={fileData.status === "uploading"}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}