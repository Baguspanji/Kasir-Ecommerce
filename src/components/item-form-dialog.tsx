"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import ImageUploader from "./image-uploader";
import { PlusCircle, Trash2 } from "lucide-react";

const itemSchema = z.object({
  name: z.string().min(2, "Nama minimal harus 2 karakter."),
  category: z.string().min(2, "Kategori wajib diisi."),
  price: z.coerce.number().min(0, "Harga harus angka positif."),
  barcodes: z
    .array(z.string().min(1, "Barcode tidak boleh kosong."))
    .min(1, "Minimal satu barcode wajib diisi."),
  stock: z.coerce.number().int().min(0, "Stok harus bilangan bulat non-negatif."),
  image: z.string().optional(),
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
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "",
      price: item?.price || 0,
      barcodes: item?.barcodes?.length ? item.barcodes : [""] ,
      stock: item?.stock || 0,
      image: item?.image || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "barcodes",
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {item ? "Ubah Barang" : "Tambah Barang Baru"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gambar Produk</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2 space-y-4">
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
                <div>
                  <FormLabel>Barcode</FormLabel>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`barcodes.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input
                                  placeholder="e.g., CF-001 or 899..."
                                  {...field}
                                />
                              </FormControl>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append("")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Barcode
                  </Button>
                </div>

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
