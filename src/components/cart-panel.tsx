"use client";

import { useState } from "react";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CartItem } from "@/types";
import CheckoutDialog from "./checkout-dialog";

interface CartPanelProps {
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
}

export default function CartPanel({
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  onClearCart,
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
      <CardHeader className="flex flex-row items-center justify-between">
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
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-320px)]">
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
