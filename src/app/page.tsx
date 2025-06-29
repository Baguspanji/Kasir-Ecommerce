
"use client";

import { useState, useMemo, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import CartPanel from "@/components/cart-panel";
import type { Product, CartItem, Transaction } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { TransactionDetailDialog } from "@/components/transaction-detail-dialog";

export default function CashierPage() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [completedTransaction, setCompletedTransaction] =
    useState<Transaction | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        p.barcodes.some((barcode) =>
          barcode.toLowerCase().includes(lowerCaseSearchTerm)
        )
    );
  }, [products, searchTerm]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = (
    total: number,
    payment: number,
    customerName?: string,
    customerPhone?: string
  ) => {
    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      date: new Date(),
      items: cart,
      total,
      payment,
      change: payment - total,
      cogs: total * 0.4, // Mock calculation
      profit: total * 0.6, // Mock calculation
      customerName,
      customerPhone,
    };

    setCompletedTransaction(newTransaction);
    // Cart is cleared and toast is shown when the receipt dialog is closed.
  };

  const handleBarcodeScan = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const code = searchTerm.trim();
      if (!code) return;

      const product = products.find((p) =>
        p.barcodes.some((b) => b.toLowerCase() === code.toLowerCase())
      );

      if (product) {
        addToCart(product);
        setSearchTerm("");
        toast({
          title: "Barang Ditambahkan",
          description: `${product.name} telah ditambahkan ke keranjang.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Barang Tidak Ditemukan",
          description: `Tidak ada barang dengan barcode "${code}".`,
        });
      }
    }
  };

  const handleCloseReceiptDialog = () => {
    setCompletedTransaction(null);
    clearCart();
    toast({
      title: "Transaksi Berhasil",
      description: "Keranjang telah dikosongkan.",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start h-full">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari produk atau pindai barcode..."
                className="pl-10 text-base bg-card"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleBarcodeScan}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <CartPanel
            cartItems={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onCheckout={handleCheckout}
            onClearCart={clearCart}
          />
        </div>
      </div>
      {completedTransaction && (
        <TransactionDetailDialog
          transaction={completedTransaction}
          onClose={handleCloseReceiptDialog}
        />
      )}
    </>
  );
}
