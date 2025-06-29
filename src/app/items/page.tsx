"use client";

import { useState, useMemo } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import { ItemFormDialog } from "@/components/item-form-dialog";
import type { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/data";
import { Input } from "@/components/ui/input";

export default function ItemsPage() {
  const [items, setItems] = useState<Product[]>(MOCK_PRODUCTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleEdit = (item: Product) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleSave = (itemData: Product) => {
    const existing = items.find((i) => i.id === itemData.id);
    if (existing) {
      setItems(items.map((i) => (i.id === itemData.id ? itemData : i)));
    } else {
      setItems([...items, { ...itemData, id: Date.now() }]);
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
            placeholder="Cari barang berdasarkan nama atau SKU..."
            className="pl-10 text-base bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredItems} />
      {isFormOpen && (
        <ItemFormDialog
          item={selectedItem}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
