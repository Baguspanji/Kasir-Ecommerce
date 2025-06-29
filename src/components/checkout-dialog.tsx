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

  const quickCashValues = [5, 10, 20, 50, 100].map(val => {
    if (total > val) {
      return Math.ceil(total / val) * val;
    }
    return val;
  }).filter((v, i, a) => a.indexOf(v) === i); // unique values

  const exactCash = Math.ceil(total);
  if (!quickCashValues.includes(exactCash)) {
    quickCashValues.unshift(exactCash);
  }
  
  // Get next rounded dollar amount
  if (total !== exactCash && !quickCashValues.includes(exactCash)) {
    quickCashValues.unshift(exactCash);
  } else if (!quickCashValues.includes(exactCash + 1) && total > exactCash) {
    quickCashValues.unshift(exactCash + 1);
  }


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">Total Amount Due</p>
            <p className="text-4xl font-bold">${total.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="payment-amount">Payment Amount</Label>
            <Input
              id="payment-amount"
              type="number"
              placeholder="0.00"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="text-2xl h-14 text-center"
            />
             <div className="grid grid-cols-3 gap-2">
                {quickCashValues.sort((a,b) => a-b).slice(0,6).map(val => (
                  <Button key={val} variant="outline" onClick={() => setPaymentAmount(val)}>
                    ${val.toFixed(2)}
                  </Button>
                ))}
              </div>
          </div>
          
          {typeof paymentAmount === 'number' && paymentAmount >= total && (
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-muted-foreground">Change Due</p>
              <p className="text-3xl font-bold text-primary">${change.toFixed(2)}</p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={typeof paymentAmount !== 'number' || paymentAmount < total}
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
