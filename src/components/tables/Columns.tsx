"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "../ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeleteProductMutation } from "@/services/ecommerce";
import { uuid } from "zod";

// This type is used to define the shape of our data.

export type ProductHeader = {
  uuid: string;
  name: string;
  thumbnail: string;
  priceOut: number;
};
export type UpdateProductType = {
  name: string;
  description: string;
  stockQuantity: number;
  priceIn: number;
  priceOut: number;
  discount: number;
  color: {
    color: string;
    images: string[];
  }[];
  thumbnail: string;
  warranty: string;
  availability: boolean;
  images: string[];
  categoryUuid: string;
  supplierUuid: string;
  brandUuid: string;
};

type ColumnsProps = {
  onViewDetail: (uuid: string) => void;
  onDelete: (uuid: string) => void;
  onUpdate: (uuid: string, row: ProductHeader) => void;
};

export const columns = ({
  onViewDetail,
  onDelete,
  onUpdate,
}: ColumnsProps): ColumnDef<ProductHeader>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "uuid",
    header: "UUID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "thumbnail",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Thumbnail" />;
    },
    cell: ({ getValue }) => {
      const url = getValue();

      const safeUrl =
        typeof url === "string" && url.startsWith("http")
          ? url
          : "/placeholder.png";

      return (
        <Image
          src={safeUrl}
          loading="eager"
          height={75}
          width={75}
          alt="product image"
        />
      );
    },
  },
  {
    accessorKey: "priceOut",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Price$" />;
    },
    cell: ({ getValue }) => {
      const price = getValue();
      return <h1 className="text-red-500 font-bold">{price as number}$</h1>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-12 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="overflow p-0">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.uuid)}
            >
              Copy Product UUID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetail(product?.uuid)}>
              View Product Detail
            </DropdownMenuItem>
            {/* The students will implements these 2 functions */}
            <DropdownMenuItem onClick={() => onUpdate(product.uuid, product)}>
              Update Product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(product.uuid)}>
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
