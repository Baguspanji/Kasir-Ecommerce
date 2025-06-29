"use client";

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Receipt from './receipt';
import type { Transaction } from '@/types';

interface TransactionDetailDialogProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailDialog({
  transaction,
  onClose,
}: TransactionDetailDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=400');
    if (printWindow && receiptRef.current) {
      const receiptHtml = receiptRef.current.innerHTML;
      printWindow.document.write(`
        <html>
          <head>
            <title>Struk Transaksi</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: 80mm auto; margin: 0; }
              body { margin: 0; background-color: white; }
              .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
              .text-black { color: black; }
              .p-4 { padding: 1rem; }
              .text-xs { font-size: 0.75rem; }
              .w-\\[320px\\] { width: 320px; }
              /* Add other necessary styles here to match Receipt component */
            </style>
          </head>
          <body>${receiptHtml}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      // Use timeout to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleDownload = () => {
    if (receiptRef.current) {
      html2canvas(receiptRef.current, { 
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2 // Increase resolution for better quality
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `struk-${transaction?.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
            <div ref={receiptRef} className="transform scale-90 md:scale-100">
                <Receipt transaction={transaction} />
            </div>
        </div>
        <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
            <DialogClose asChild>
                <Button variant="outline">Tutup</Button>
            </DialogClose>
            <div className="flex gap-2">
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Cetak
                </Button>
                <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" /> Unduh
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
