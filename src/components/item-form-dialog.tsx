"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";

const itemSchema = z.object({
  name: z.string().min(2, "Nama minimal harus 2 karakter."),
  category: z.string().min(2, "Kategori wajib diisi."),
  price: z.coerce.number().min(0, "Harga harus angka positif."),
  sku: z.string().min(2, "SKU wajib diisi."),
  stock: z.coerce.number().int().min(0, "Stok harus bilangan bulat non-negatif."),
});

interface ItemFormDialogProps {
  item?: Product | null;
  onClose: () => void;
  onSave: (item: Product) => void;
}

export function ItemFormDialog({ item, onClose, onSave }: ItemFormDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: item || {
      name: "",
      category: "",
      price: 0,
      sku: "",
      stock: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof itemSchema>) => {
    onSave({ ...values, id: item?.id || Date.now() });
    toast({
      title: `Barang ${item ? "diperbarui" : "dibuat"}`,
      description: `${values.name} telah berhasil disimpan.`,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Ubah Barang" : "Tambah Barang Baru"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Espresso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder="Kopi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input type="number" step="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                        <Input placeholder="CF-001" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Stok</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit">Simpan Barang</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
