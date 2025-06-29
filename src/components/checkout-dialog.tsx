"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CheckoutDialogProps {
  total: number;
  onClose: () => void;
  onConfirmPayment: (payment: number) => void;
}

export default function CheckoutDialog({
  total,
  onClose,
  onConfirmPayment,
}: CheckoutDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [change, setChange] = useState<number>(0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
  
  const formatCurrencyNoSymbol = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    if (typeof paymentAmount === 'number' && paymentAmount >= total) {
      setChange(paymentAmount - total);
    } else {
      setChange(0);
    }
  }, [paymentAmount, total]);

  const handleConfirm = () => {
    if (typeof paymentAmount === 'number' && paymentAmount >= total) {
      onConfirmPayment(paymentAmount);
    }
  };

  const quickCashValues = [10000, 20000, 50000, 100000]
    .reduce((acc, val) => {
        if (total < val && !acc.some(v => v > total)) {
            const nextHigher = Math.ceil(total / val) * val;
            if (total < nextHigher) acc.push(nextHigher);
        }
        acc.push(val);
        return acc;
    }, [] as number[])
    .filter((v, i, a) => a.indexOf(v) === i) 
    .sort((a,b) => a-b);
    
    if (!quickCashValues.includes(Math.ceil(total))) {
      quickCashValues.unshift(Math.ceil(total));
    }


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">Total yang Harus Dibayar</p>
            <p className="text-4xl font-bold">{formatCurrency(total)}</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="payment-amount">Jumlah Pembayaran</Label>
            <Input
              id="payment-amount"
              type="number"
              placeholder="0"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="text-2xl h-14 text-center"
            />
             <div className="grid grid-cols-3 gap-2">
                {quickCashValues.sort((a,b) => a-b).slice(0,6).map(val => (
                  <Button key={val} variant="outline" onClick={() => setPaymentAmount(val)}>
                    {formatCurrencyNoSymbol(val)}
                  </Button>
                ))}
              </div>
          </div>
          
          {typeof paymentAmount === 'number' && paymentAmount >= total && (
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-muted-foreground">Kembalian</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(change)}</p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={typeof paymentAmount !== 'number' || paymentAmount < total}
          >
            Konfirmasi Pembayaran
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
