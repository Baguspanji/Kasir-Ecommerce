"use client";

import type { Transaction } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSettings } from "@/hooks/use-settings";
import { Skeleton } from "./ui/skeleton";

interface ReceiptProps {
  transaction: Transaction;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (date: Date) => format(date, "dd MMM yyyy, HH:mm", { locale: id });

export default function Receipt({ transaction }: ReceiptProps) {
  const { settings, isLoading } = useSettings();

  if (isLoading || !settings) {
    return (
      <div className="bg-white text-black p-4 font-mono text-xs w-[320px] space-y-4">
        <div className="text-center space-y-1">
          <Skeleton className="h-5 w-24 mx-auto bg-gray-300" />
          <Skeleton className="h-3 w-40 mx-auto bg-gray-300" />
          <Skeleton className="h-3 w-32 mx-auto bg-gray-300" />
        </div>
        <div className="border-t border-b border-dashed border-black py-1 mb-2 text-[10px] space-y-1">
          <Skeleton className="h-3 w-full bg-gray-300" />
          <Skeleton className="h-3 w-full bg-gray-300" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-3 w-full bg-gray-300" />
            <Skeleton className="h-3 w-full bg-gray-300" />
        </div>
        <div className="text-center mt-6">
          <Skeleton className="h-4 w-48 mx-auto bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-4 font-mono text-xs w-[320px]">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">{settings.appName}</h2>
        <p className="text-[10px]">{settings.address}</p>
        <p className="text-[10px]">Telp: {settings.phone}</p>
      </div>
      <div className="border-t border-b border-dashed border-black py-1 mb-2 text-[10px]">
        <div className="flex justify-between">
          <span>{formatDate(transaction.date)}</span>
          <span>{transaction.id}</span>
        </div>
        {transaction.customerName && (
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span>{transaction.customerName}</span>
          </div>
        )}
      </div>
      
      {transaction.items.map((item) => (
         <div key={item.id} className="mb-1">
            <p>{item.name}</p>
            <div className="flex justify-between">
                <span>{`${item.quantity} x ${formatCurrency(item.price)}`}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
         </div>
      ))}

      <div className="border-t border-dashed border-black mt-4 pt-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(transaction.total)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(transaction.total)}</span>
        </div>
      </div>
      
      <div className="border-t border-dashed border-black mt-2 pt-2">
        <div className="flex justify-between">
          <span>Tunai</span>
          <span>{formatCurrency(transaction.payment)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembali</span>
          <span>{formatCurrency(transaction.change)}</span>
        </div>
      </div>

      <div className="text-center mt-6">
        <p>{settings.receiptFooter}</p>
      </div>
    </div>
  );
}
