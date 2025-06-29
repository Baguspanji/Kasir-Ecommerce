"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import { StockAdjustmentDialog } from "@/components/stock-adjustment-dialog";
import type { StockItem } from "@/types";
import { getAllProducts, getProduct, saveProduct } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchStockItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const products = await getAllProducts();
      // Assuming threshold is a static value for display or a future feature.
      // If threshold needs to be stored, it should be added to the Product type and DB.
      setStockItems(products.map(p => ({ ...p, threshold: 20 }))); 
    } catch (error) {
      console.error("Failed to fetch stock items:", error);
      toast({ variant: "destructive", title: "Gagal memuat data stok." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStockItems();
  }, [fetchStockItems]);


  const filteredStockItems = useMemo(() => {
    if (!searchTerm) return stockItems;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return stockItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.barcodes.some((barcode) =>
          barcode.toLowerCase().includes(lowerCaseSearchTerm)
        )
    );
  }, [stockItems, searchTerm]);

  const handleAdjustStock = (item: StockItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleSaveAdjustment = async (itemId: number, newStock: number) => {
    try {
        const productToUpdate = await getProduct(itemId);
        if (productToUpdate) {
            await saveProduct({ ...productToUpdate, stock: newStock });
            await fetchStockItems();
        }
    } catch (error) {
        console.error("Failed to save adjustment:", error);
        toast({ variant: "destructive", title: "Gagal menyesuaikan stok." });
    }
  };

  const columns = getColumns({ onAdjust: handleAdjustStock });

  return (
    <>
      <Header title="Level Stok" />
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Cari barang berdasarkan nama atau barcode..."
            className="pl-10 text-base bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredStockItems} isLoading={isLoading} />
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
