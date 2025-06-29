"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import { ItemFormDialog } from "@/components/item-form-dialog";
import type { Product } from "@/types";
import { getAllProducts, saveProduct, deleteProduct } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function ItemsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const products = await getAllProducts();
      setItems(products.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast({ variant: "destructive", title: "Gagal memuat barang." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const categories = useMemo(() => {
    if (!items) return [];
    const allCategories = items.map((item) => item.category);
    return [...new Set(allCategories)].sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.barcodes.some((barcode) =>
          barcode.toLowerCase().includes(lowerCaseSearchTerm)
        )
    );
  }, [items, searchTerm]);

  const handleEdit = (item: Product) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (itemId: number) => {
    try {
      await deleteProduct(itemId);
      toast({ title: "Barang dihapus", description: "Barang telah berhasil dihapus." });
      fetchItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast({ variant: "destructive", title: "Gagal menghapus barang." });
    }
  };

  const handleSave = async (itemData: Product) => {
    try {
      await saveProduct(itemData);
      fetchItems();
    } catch (error) {
      console.error("Failed to save item:", error);
      toast({ variant: "destructive", title: "Gagal menyimpan barang." });
    }
  };

  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <>
      <Header title="Manajemen Barang">
        <Button
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Barang Baru
        </Button>
      </Header>
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
      <DataTable columns={columns} data={filteredItems} isLoading={isLoading} />
      {isFormOpen && (
        <ItemFormDialog
          item={selectedItem}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          categories={categories}
        />
      )}
    </>
  );
}
