"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import type { Product, Transaction, CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

const transactionEditSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  items: z.array(z.object({
      id: z.number(),
      name: z.string(),
      price: z.coerce.number(),
      category: z.string(),
      barcodes: z.array(z.string()),
      stock: z.coerce.number(),
      image: z.string(),
      'data-ai-hint': z.string().optional(),
      quantity: z.coerce.number().min(1, "Kuantitas minimal 1."),
  })).min(1, "Minimal harus ada satu barang dalam transaksi."),
  payment: z.coerce.number().min(0, "Pembayaran harus angka positif."),
});

interface TransactionEditDialogProps {
  transaction: Transaction | null;
  products: Product[];
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);


export function TransactionEditDialog({ transaction, products, onClose, onSave }: TransactionEditDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof transactionEditSchema>>({
    resolver: zodResolver(transactionEditSchema),
    defaultValues: {
      customerName: transaction?.customerName || "",
      customerPhone: transaction?.customerPhone || "",
      items: transaction?.items || [],
      payment: transaction?.payment || 0,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const watchedItems = form.watch("items");
  const total = useMemo(() => {
    return watchedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [watchedItems]);

  const onSubmit = (values: z.infer<typeof transactionEditSchema>) => {
    if (!transaction) return;
    
    if (values.payment < total) {
        toast({
            variant: "destructive",
            title: "Pembayaran Kurang",
            description: `Total belanja adalah ${formatCurrency(total)}, tapi pembayaran hanya ${formatCurrency(values.payment)}.`,
        });
        return;
    }

    const updatedTransaction: Transaction = {
        ...transaction,
        ...values,
        items: values.items as CartItem[],
        total: total,
        change: values.payment - total,
        cogs: total * 0.4,
        profit: total * 0.6,
    };
    onSave(updatedTransaction);
    toast({
      title: "Transaksi Diperbarui",
      description: `Transaksi ${transaction.id} telah berhasil diperbarui.`,
    });
    onClose();
  };
  
  const handleProductChange = (productId: number, fieldIndex: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
        const currentItem = form.getValues(`items.${fieldIndex}`);
        update(fieldIndex, { ...product, quantity: currentItem.quantity || 1 });
    }
  }
  
  const handleAddNewItem = () => {
    const defaultProduct = products[0];
    if (defaultProduct) {
        append({ ...defaultProduct, quantity: 1 });
    }
  }

  if (!transaction) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ubah Transaksi</DialogTitle>
          <DialogDescription>ID Transaksi: {transaction.id}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Pelanggan (Opsional)</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nama Pelanggan" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nomor Pelanggan (Opsional)</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nomor Telepon" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Separator />
            <FormLabel>Barang</FormLabel>
            <ScrollArea className="h-[250px] pr-4">
                <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                        <div className="col-span-5">
                             <Controller
                                control={form.control}
                                name={`items.${index}.id`}
                                render={({ field: controllerField }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            controllerField.onChange(parseInt(value));
                                            handleProductChange(parseInt(value), index);
                                        }}
                                        defaultValue={String(controllerField.value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih barang..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => (
                                                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="col-span-2">
                            <Input
                                type="text"
                                value={formatCurrency(watchedItems[index]?.price || 0)}
                                readOnly
                                className="bg-muted text-right"
                            />
                        </div>
                        <div className="col-span-1">
                            <FormField
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Input type="number" {...field} className="text-center" />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-3 text-right">
                            <p className="font-medium h-10 flex items-center justify-end">{formatCurrency((watchedItems[index]?.price || 0) * (watchedItems[index]?.quantity || 0))}</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-10 w-10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleAddNewItem}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Barang
            </Button>
            
            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-8 items-end">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="payment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jumlah Pembayaran</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="text-right space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">Total:</span>
                        <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                        <span>Pembayaran:</span>
                        <span>{formatCurrency(form.watch('payment'))}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                        <span>Kembalian:</span>
                        <span>{formatCurrency(Math.max(0, form.watch('payment') - total))}</span>
                    </div>
                </div>
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
