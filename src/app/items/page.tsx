"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import { ItemFormDialog } from "@/components/item-form-dialog";
import type { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/data";

export default function ItemsPage() {
  const [items, setItems] = useState<Product[]>(MOCK_PRODUCTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

  const handleEdit = (item: Product) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
  };
  
  const handleSave = (itemData: Product) => {
    const existing = items.find(i => i.id === itemData.id);
    if(existing) {
      setItems(items.map(i => i.id === itemData.id ? itemData : i));
    } else {
      setItems([...items, itemData]);
    }
  }

  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <>
      <Header title="Item Management">
        <Button onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </Header>
      <DataTable columns={columns} data={items} />
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
