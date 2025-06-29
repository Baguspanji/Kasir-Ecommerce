"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import { StockAdjustmentDialog } from "@/components/stock-adjustment-dialog";
import type { StockItem } from "@/types";
import { MOCK_STOCK_ITEMS } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>(MOCK_STOCK_ITEMS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStockItems = useMemo(() => {
    if (!searchTerm) return stockItems;
    return stockItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stockItems, searchTerm]);

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
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Cari barang berdasarkan nama atau SKU..."
            className="pl-10 text-base bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredStockItems} />
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
