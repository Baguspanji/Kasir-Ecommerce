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
  name: z.string().min(2, "Name must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  sku: z.string().min(2, "SKU is required."),
  stock: z.coerce.number().int().min(0, "Stock must be a non-negative integer."),
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
      title: `Item ${item ? "updated" : "created"}`,
      description: `${values.name} has been saved successfully.`,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Coffee" {...field} />
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
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
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
                        <FormLabel>Stock</FormLabel>
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
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
