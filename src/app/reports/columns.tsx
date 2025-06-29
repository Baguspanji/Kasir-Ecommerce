"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    cell: ({ row }) => format(row.getValue("date"), "PPp"),
  },
  {
    accessorKey: "items",
    header: "Items",
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
    header: () => <div className="text-right">Profit</div>,
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.getValue("profit"))}</div>
    ),
  },
];
