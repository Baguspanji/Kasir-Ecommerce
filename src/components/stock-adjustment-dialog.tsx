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
  newStock: z.coerce.number().int().min(0, "Stock must be a non-negative integer."),
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
      title: "Stock Adjusted",
      description: `Stock for ${item.name} has been updated to ${values.newStock}.`,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock for {item.name}</DialogTitle>
          <DialogDescription>
            Current stock: {item.stock}. Update the quantity below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Stock Quantity</FormLabel>
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
                  <FormLabel>Reason (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Stocktaking correction, Damaged goods" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Adjust Stock</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
