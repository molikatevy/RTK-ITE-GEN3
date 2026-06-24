"use client";
import { useState } from "react";
import {
  columns,
  ProductHeader,
  UpdateProductType,
} from "@/components/tables/Columns";
import { DataTable } from "@/components/tables/TableComponent";
import { ViewProductDetail } from "@/components/ui/view-detail-product";
import {
  useDeleteProductMutation,
  useGetAllProductQuery,
  useUpdateProductMutation,
} from "@/services/ecommerce";
import { toast } from "sonner";

export default function DataTablePage() {
  const { data } = useGetAllProductQuery({
    page: 0,
    size: 10000,
  });

  const product: UpdateProductType = {
    name: "Jong yy tha nh update hxhx my gang",
    description: "string",
    stockQuantity: 0,
    priceIn: 1,
    priceOut: 1,
    discount: 0,
    color: [
      {
        color: "string",
        images: [
          "https://i.pinimg.com/736x/75/24/e6/7524e662fe48a9a49b8f3e96227a5dc6.jpg",
        ],
      },
    ],
    thumbnail:
      "https://i.pinimg.com/736x/75/24/e6/7524e662fe48a9a49b8f3e96227a5dc6.jpg",
    warranty: "string",
    availability: true,
    images: ["string"],
    categoryUuid: "462d9f60-8346-45ab-b8b3-a597d240965b",
    supplierUuid: "a34496d2-370e-4332-8c6d-b4a6bc069bf1",
    brandUuid: "8f2e3bcb-bb0b-45a1-b9bc-1d43f08f0ddb",
  };
  const tableData = Array.isArray(data?.content) ? data?.content : [];

  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const handleViewDetail = (uuid: string) => {
    setSelectedUuid(uuid);
  };

  const handleClose = () => {
    setSelectedUuid(null);
  };
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const handleDelete = async (uuid: string) => {
    try {
      await deleteProduct(uuid).unwrap();
      toast.success("Product deleted successfully.", {
        position: "top-center",
      });
    } catch (error: unknown) {
      const err = error as { data?: { description?: string } };
      toast.error(err.data?.description || "Failed to delete product", {
        position: "top-center",
      });
    }
  };
  const handleUpdate = async (uuid: string, row: unknown) => {
    try {
      await updateProduct({ uuid, data: product }).unwrap();
      toast.success("Product updated successfully.", {
        position: "top-center",
      });
    } catch (error: unknown) {
      const err = error as { data?: { description?: string } };
      toast.error(err.data?.description || "Failed to update product", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns({
          onViewDetail: handleViewDetail,
          onDelete: handleDelete,
          onUpdate: (uuid, row) => handleUpdate(uuid, row),
        })}
        data={tableData}
      />

      {/* Modal */}
      {selectedUuid && (
        <ViewProductDetail
          uuid={selectedUuid}
          open={true}
          onOpenChange={(open) => {
            if (!open) handleClose();
          }}
        />
      )}
    </div>
  );
}
