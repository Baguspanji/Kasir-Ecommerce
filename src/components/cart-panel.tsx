"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, Minus, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { CartItem, DraftCart } from "@/types";
import CheckoutDialog from "./checkout-dialog";
import { cn } from "@/lib/utils";

interface CartPanelProps {
  drafts: DraftCart[];
  activeDraftId: string | null;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: (
    total: number,
    payment: number,
    customerName?: string,
    customerPhone?: string
  ) => void;
  onClearCart: () => void;
  onNewDraft: () => void;
  onDeleteDraft: (draftId: string) => void;
  onSwitchDraft: (draftId: string) => void;
}

export default function CartPanel({
  drafts,
  activeDraftId,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  onClearCart,
  onNewDraft,
  onDeleteDraft,
  onSwitchDraft,
}: CartPanelProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const handleCheckout = (
    payment: number,
    customerName?: string,
    customerPhone?: string
  ) => {
    onCheckout(total, payment, customerName, customerPhone);
    setIsCheckoutOpen(false);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Keranjang</CardTitle>
        {cartItems.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearCart}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Kosongkan Keranjang</span>
          </Button>
        )}
      </CardHeader>
      <div className="px-4 pb-4">
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex items-center gap-2 pb-2">
            {drafts.map((draft) => (
                <div
                key={draft.id}
                className={cn(
                    "flex items-center rounded-md border h-9 px-3 cursor-pointer transition-colors",
                    activeDraftId === draft.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-accent"
                )}
                onClick={() => onSwitchDraft(draft.id)}
                >
                <span className="text-sm font-medium">{draft.name}</span>
                {drafts.length > 1 && (
                    <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-6 w-6 ml-1.5 -mr-1.5",
                        activeDraftId === draft.id
                        ? "hover:bg-primary/80"
                        : "hover:bg-destructive/20 text-destructive"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDraft(draft.id);
                    }}
                    >
                    <X className="h-3 w-3" />
                    </Button>
                )}
                </div>
            ))}
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={onNewDraft}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Tambah Sesi Baru</span>
            </Button>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-380px)]">
          <div className="p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                <ShoppingCart className="h-10 w-10 mb-2" />
                <p>Keranjang Anda kosong</p>
                <p className="text-xs">Klik pada produk untuk menambahkannya.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
        {cartItems.length > 0 && (
          <>
            <Separator />
            <div className="p-4 space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Pembayaran
              </Button>
            </div>
          </>
        )}
      </CardContent>
      {isCheckoutOpen && (
        <CheckoutDialog
          total={total}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirmPayment={handleCheckout}
        />
      )}
    </Card>
  );
}
