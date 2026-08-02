// components/product-form/product-form-schema.ts
import * as z from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(5, "Product name must be at least 5 characters.")
    .max(100, "Product name must be at most 100 characters."),
  
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(500, "Description must be at most 500 characters."),
  
  stockQuantity: z.coerce.number().int().min(0, "Stock quantity cannot be negative"),
  
  priceIn: z.coerce.number().min(0, "Price cannot be negative"),
  
  priceOut: z.coerce.number().min(0, "Price cannot be negative"),
  
  discount: z.coerce.number().min(0).max(100).default(0),
  
  warranty: z.string().optional().default(""),
  
  availability: z.boolean().default(true),
  
  categoryUuid: z.string().min(1, "Category is required"),
  
  supplierUuid: z.string().min(1, "Supplier is required"),
  
  brandUuid: z.string().min(1, "Brand is required"),
  
  thumbnail: z.string().url("Please enter a valid URL").optional(),
});

export type ProductForm = z.infer<typeof productFormSchema>;