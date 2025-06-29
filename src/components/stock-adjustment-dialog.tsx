"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import type { StockItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

const stockAdjustmentSchema = z.object({
  newStock: z.coerce.number().int().min(0, "Stok harus bilangan bulat non-negatif."),
  reason: z.string().optional(),
});

interface StockAdjustmentDialogProps {
  item: StockItem;
  onClose: () => void;
  onAdjust: (itemId: number, newStock: number) => void;
}

export function StockAdjustmentDialog({ item, onClose, onAdjust }: StockAdjustmentDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof stockAdjustmentSchema>>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      newStock: item.stock,
      reason: "",
    },
  });

  const onSubmit = (values: z.infer<typeof stockAdjustmentSchema>) => {
    onAdjust(item.id, values.newStock);
    toast({
      title: "Stok Disesuaikan",
      description: `Stok untuk ${item.name} telah diperbarui menjadi ${values.newStock}.`,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sesuaikan Stok untuk {item.name}</DialogTitle>
          <DialogDescription>
            Stok saat ini: {item.stock}. Perbarui kuantitas di bawah.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas Stok Baru</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="cth., Koreksi stok, Barang rusak" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit">Sesuaikan Stok</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
