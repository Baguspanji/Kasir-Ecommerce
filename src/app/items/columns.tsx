"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

interface GetColumnsProps {
  onEdit: (item: Product) => void;
  onDelete: (itemId: number) => void;
}

export const getColumns = ({ onEdit, onDelete }: GetColumnsProps): ColumnDef<Product>[] => [
  {
    accessorKey: "image",
    header: "Gambar",
    cell: ({ row }) => {
      const imageUrl = row.original.image;
      const imageName = row.original.name;
      return (
        <Image
          src={imageUrl || "https://placehold.co/40x40.png"}
          alt={imageName}
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Harga</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "barcodes",
    header: "Barcode",
    cell: ({ row }) => {
      const barcodes = row.getValue("barcodes") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {barcodes.map((barcode) => (
            <Badge key={barcode} variant="secondary">
              {barcode}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right">Stok</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("stock")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(item)}>
              Ubah
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(item.id)}
            >
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      );
    },
  },
];
