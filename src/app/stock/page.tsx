"use client";

import { useState } from "react";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import { StockAdjustmentDialog } from "@/components/stock-adjustment-dialog";
import type { StockItem } from "@/types";
import { MOCK_STOCK_ITEMS } from "@/lib/data";

export default function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>(MOCK_STOCK_ITEMS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  const handleAdjustStock = (item: StockItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleSaveAdjustment = (itemId: number, newStock: number) => {
    setStockItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, stock: newStock } : item
      )
    );
  };

  const columns = getColumns({ onAdjust: handleAdjustStock });

  return (
    <>
      <Header title="Level Stok" />
      <DataTable columns={columns} data={stockItems} />
      {isFormOpen && selectedItem && (
        <StockAdjustmentDialog
          item={selectedItem}
          onClose={() => setIsFormOpen(false)}
          onAdjust={handleSaveAdjustment}
        />
      )}
    </>
  );
}
