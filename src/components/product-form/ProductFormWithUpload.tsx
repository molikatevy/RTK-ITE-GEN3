// components/product-form/ProductFormWithUpload.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUploadSingleFileMutation } from "@/services/uploadApi";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";

// Product schema
const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock must be positive"),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductFormWithUpload() {
  const [uploadFile] = useUploadSingleFileMutation();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const result = await uploadFile(file).unwrap();
      if (result.success && result.data) {
        form.setValue("imageUrl", result.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    form.setValue("imageUrl", "");
  };

  function onSubmit(data: ProductFormData) {
    console.log("Product data:", data);
    toast.success("Product created successfully!");
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>
          Add a new product with image upload
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Image Upload */}
            <Field>
              <FieldLabel>Product Image</FieldLabel>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={uploading}
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 5MB. Supported: JPG, PNG, GIF, WebP
                  </p>
                </div>
                {previewUrl && (
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </Field>

            {/* Product Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Product Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter product name"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    {...field}
                    id="description"
                    placeholder="Enter product description"
                  />
                </Field>
              )}
            />

            {/* Price */}
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Price ($)</FieldLabel>
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Stock */}
            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stock">Stock Quantity</FieldLabel>
                  <Input
                    {...field}
                    id="stock"
                    type="number"
                    placeholder="0"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Hidden image URL */}
            <Controller
              name="imageUrl"
              control={form.control}
              render={({ field }) => (
                <Input type="hidden" {...field} />
              )}
            />
          </FieldGroup>

          <Button type="submit" className="w-full">
            Create Product
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <span>All fields are required</span>
        <span>v1.0.0</span>
      </CardFooter>
    </Card>
  );
}