"use client";

import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import type { Transaction, Product } from "@/types";
import { MOCK_TRANSACTIONS, MOCK_PRODUCTS } from "@/lib/data";
import { TransactionDetailDialog } from "@/components/transaction-detail-dialog";
import { TransactionEditDialog } from "@/components/transaction-edit-dialog";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);


  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (dateRange?.from && dateRange?.to) {
       filtered = transactions.filter(
        (t) =>
          t.date >= (dateRange.from as Date) && t.date <= (dateRange.to as Date)
      );
    }
    return filtered.sort((a,b) => b.date.getTime() - a.date.getTime());
  }, [transactions, dateRange]);

  const summary = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        acc.totalRevenue += t.total;
        acc.cogs += t.cogs;
        acc.grossProfit += t.profit;
        return acc;
      },
      { totalRevenue: 0, cogs: 0, grossProfit: 0 }
    );
  }, [filteredTransactions]);

  const handleShowDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };
  
  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseEdit = () => {
    setEditingTransaction(null);
  };

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
        prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    handleCloseEdit();
  };

  const columns = getColumns({ onShowDetails: handleShowDetails, onEdit: handleEdit });

  return (
    <>
      <Header title="Laporan & Analitik" />
      <div className="space-y-6">
        <div>
          <DateRangePicker onDateChange={setDateRange} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Harga Pokok Penjualan (HPP)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.cogs)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Laba Kotor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.grossProfit)}</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Riwayat Transaksi</h2>
          <DataTable columns={columns} data={filteredTransactions} />
        </div>
      </div>
      {selectedTransaction && (
        <TransactionDetailDialog 
            transaction={selectedTransaction}
            onClose={handleCloseDetails}
        />
      )}
      {editingTransaction && (
        <TransactionEditDialog
            transaction={editingTransaction}
            products={products}
            onClose={handleCloseEdit}
            onSave={handleSaveTransaction}
        />
      )}
    </>
  );
}
