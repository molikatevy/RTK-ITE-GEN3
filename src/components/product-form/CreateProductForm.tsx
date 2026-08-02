// components/product-form/CreateProductForm.tsx
"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 
import { ProductForm, productFormSchema } from "./product-form-schema";   
import { productFields } from "./form-fields-config";
import { DynamicFormField } from "./DynamicFormField";
import { FileUploadFillProgressDemo } from "../FileUpload/FileUploadComponent";

type ProductFormValue = z.infer<typeof productFormSchema>;

export function CreateProductForm() {
  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema) as Resolver<ProductFormValue>,
    defaultValues: {
      name: "",
      description: "",
      stockQuantity: 0,
      priceIn: 0,
      priceOut: 0,
      discount: 0,
      warranty: "",
      availability: true,
      categoryUuid: "",
      supplierUuid: "",
      brandUuid: "",
      thumbnail: "",
    },
  });

  console.log("Form errors:", form.formState.errors);

  const onSubmit = (data: ProductForm) => {
    console.log("Product Data:", data);
    toast.success("Product created successfully!");
    // TODO: Call API to create product
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
        <CardDescription>
          Fill in all the necessary information for the new product.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {productFields.map((fieldConfig) => (
            <DynamicFormField
              key={fieldConfig.name}
              fieldConfig={fieldConfig}
              control={form.control}
            />
          ))}
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" type="reset" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="product-form">
          Create Product
        </Button>
      </CardFooter>
    </Card>
  );
}

// Separate component for file upload if needed
export function ProductFormWithUpload() {
  return (
    <div className="space-y-6">
      <CreateProductForm />
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>
            Upload product images (max 10 files, up to 5MB each)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadFillProgressDemo />
        </CardContent>
      </Card>
    </div>
  );
}