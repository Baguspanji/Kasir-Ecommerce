"use client";

import { useState, useMemo, type KeyboardEvent, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import CartPanel from "@/components/cart-panel";
import type { Product, CartItem, Transaction, DraftCart } from "@/types";
import { MOCK_PRODUCTS } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { TransactionDetailDialog } from "@/components/transaction-detail-dialog";

export default function CashierPage() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [drafts, setDrafts] = useState<DraftCart[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [completedTransaction, setCompletedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    if (drafts.length === 0) {
      const newDraftId = `draft-${Date.now()}`;
      setDrafts([{ id: newDraftId, name: "Sesi 1", items: [] }]);
      setActiveDraftId(newDraftId);
    } else if (!activeDraftId && drafts.length > 0) {
      setActiveDraftId(drafts[0].id);
    }
  }, [drafts, activeDraftId]);

  const activeCartItems = useMemo(() => {
    if (!activeDraftId) return [];
    const activeDraft = drafts.find((d) => d.id === activeDraftId);
    return activeDraft ? activeDraft.items : [];
  }, [drafts, activeDraftId]);

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
  
  const updateActiveDraft = (updater: (draft: DraftCart) => DraftCart) => {
    if (!activeDraftId) return;
    setDrafts((prevDrafts) =>
      prevDrafts.map((d) => (d.id === activeDraftId ? updater(d) : d))
    );
  };

  const addToCart = (product: Product) => {
     if (!activeDraftId) {
      toast({
        variant: "destructive",
        title: "Tidak ada sesi aktif",
        description: "Silakan buat sesi baru terlebih dahulu.",
      });
      return;
    }
    updateActiveDraft((draft) => {
      const existingItem = draft.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          ...draft,
          items: draft.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...draft,
        items: [...draft.items, { ...product, quantity: 1 }],
      };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    updateActiveDraft((draft) => {
      if (quantity <= 0) {
        return {
          ...draft,
          items: draft.items.filter((item) => item.id !== productId),
        };
      } else {
        return {
          ...draft,
          items: draft.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        };
      }
    });
  };

  const removeFromCart = (productId: number) => {
    updateActiveDraft((draft) => ({
      ...draft,
      items: draft.items.filter((item) => item.id !== productId),
    }));
  };

  const clearCart = () => {
    updateActiveDraft((draft) => ({ ...draft, items: [] }));
  };
  
  const handleNewDraft = () => {
    const newDraftId = `draft-${Date.now()}`;
    const newDraftName = `Sesi ${drafts.length + 1}`;
    const newDraft: DraftCart = { id: newDraftId, name: newDraftName, items: [] };
    setDrafts((prev) => [...prev, newDraft]);
    setActiveDraftId(newDraftId);
  };
  
  const handleDeleteDraft = (draftIdToDelete: string) => {
    setDrafts(prev => {
        const remainingDrafts = prev.filter(d => d.id !== draftIdToDelete);
        
        if (remainingDrafts.length === 0) {
            const newDraftId = `draft-${Date.now()}`;
            setActiveDraftId(newDraftId);
            return [{ id: newDraftId, name: "Sesi 1", items: [] }];
        }
        
        if (activeDraftId === draftIdToDelete) {
            setActiveDraftId(remainingDrafts[0].id);
        }
        
        return remainingDrafts;
    });
  };

  const handleSwitchDraft = (draftId: string) => {
    setActiveDraftId(draftId);
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
      items: activeCartItems,
      total,
      payment,
      change: payment - total,
      cogs: total * 0.4, // Mock calculation
      profit: total * 0.6, // Mock calculation
      customerName,
      customerPhone,
    };

    setCompletedTransaction(newTransaction);
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
    const completedDraftId = activeDraftId;
    setCompletedTransaction(null);
    if(completedDraftId) {
        handleDeleteDraft(completedDraftId);
    }
    toast({
      title: "Transaksi Berhasil",
      description: "Sesi keranjang telah diselesaikan.",
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
            drafts={drafts}
            activeDraftId={activeDraftId}
            cartItems={activeCartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onCheckout={handleCheckout}
            onClearCart={clearCart}
            onNewDraft={handleNewDraft}
            onDeleteDraft={handleDeleteDraft}
            onSwitchDraft={handleSwitchDraft}
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
