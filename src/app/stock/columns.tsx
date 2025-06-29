"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { StockItem } from "@/types";
import { cn } from "@/lib/utils";

interface GetColumnsProps {
  onAdjust: (item: StockItem) => void;
}

export const getColumns = ({ onAdjust }: GetColumnsProps): ColumnDef<StockItem>[] => [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right">Stok Saat Ini</div>,
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      const threshold = row.original.threshold;
      return (
        <div
          className={cn(
            "text-right font-medium",
            stock < threshold && "text-destructive"
          )}
        >
          {stock}
        </div>
      );
    },
  },
  {
    accessorKey: "threshold",
    header: () => <div className="text-right">Ambang Batas</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("threshold")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-right">
          <Button variant="outline" size="sm" onClick={() => onAdjust(item)}>
            Sesuaikan Stok
          </Button>
        </div>
      );
    },
  },
];
