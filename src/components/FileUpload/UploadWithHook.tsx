// components/FileUpload/UploadWithHook.tsx
"use client";

import { useCallback } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function UploadWithHook() {
  const { files, isUploading, progress, addFiles, removeFile, clearFiles, upload } =
    useFileUpload({
      maxFiles: 5,
      maxSize: 10 * 1024 * 1024, // 10MB
      acceptedTypes: ["image/*", "application/pdf"],
      onSuccess: (result) => {
        console.log("Upload success:", result);
      },
      onError: (error) => {
        console.error("Upload error:", error);
      },
    });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles) {
        addFiles(Array.from(selectedFiles));
      }
      e.target.value = "";
    },
    [addFiles]
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>File Upload with Hook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            type="file"
            onChange={handleFileChange}
            multiple
            disabled={isUploading}
            className="flex-1"
          />
          <Button
            onClick={upload}
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {progress}%
            </p>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                {files.length} file(s)
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFiles}
                disabled={isUploading}
              >
                Clear All
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 border rounded-lg ${
                    file.status === "success"
                      ? "border-green-500 bg-green-50"
                      : file.status === "error"
                      ? "border-red-500 bg-red-50"
                      : file.status === "uploading"
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {file.status === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  {file.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeFile(index)}
                    disabled={file.status === "uploading"}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}