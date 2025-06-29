"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID Transaksi",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tanggal
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    cell: ({ row }) => format(row.getValue("date"), "PPp", { locale: id }),
  },
  {
    accessorKey: "items",
    header: "Barang",
    cell: ({ row }) => {
      const items = row.getValue("items") as Transaction["items"];
      return <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Total
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
    },
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("total"))}</div>
    ),
  },
  {
    accessorKey: "profit",
    header: () => <div className="text-right">Keuntungan</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("profit"))}</div>
    ),
  },
];
