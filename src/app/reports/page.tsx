"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import type { Transaction, Product } from "@/types";
import { getAllTransactions, updateTransaction, getAllProducts } from "@/lib/db";
import { TransactionDetailDialog } from "@/components/transaction-detail-dialog";
import { TransactionEditDialog } from "@/components/transaction-edit-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
        const [transactionsData, productsData] = await Promise.all([
            getAllTransactions(),
            getAllProducts()
        ]);
        setTransactions(transactionsData);
        setProducts(productsData);
    } catch (error) {
        console.error("Failed to fetch reports data:", error);
        toast({ variant: "destructive", title: "Gagal memuat laporan." });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (dateRange?.from && dateRange?.to) {
       filtered = transactions.filter(
        (t) =>
          new Date(t.date) >= (dateRange.from as Date) && new Date(t.date) <= (dateRange.to as Date)
      );
    }
    
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        String(t.id).toLowerCase().includes(lowerCaseSearchTerm) ||
        (t.customerName && t.customerName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (t.customerPhone && t.customerPhone.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    return filtered.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, dateRange, searchTerm]);

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

  const handleSaveTransaction = async (updatedTransaction: Transaction) => {
    try {
        await updateTransaction(updatedTransaction);
        handleCloseEdit();
        await fetchAllData();
    } catch (error) {
        console.error("Failed to save transaction:", error);
        toast({ variant: "destructive", title: "Gagal menyimpan transaksi." });
    }
  };

  const columns = getColumns({ onShowDetails: handleShowDetails, onEdit: handleEdit });

  return (
    <>
      <Header title="Laporan & Analitik" />
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4">
          <DateRangePicker onDateChange={setDateRange} />
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Cari ID, nama, atau no. telp pelanggan..."
              className="pl-10 text-base bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
          <DataTable columns={columns} data={filteredTransactions} isLoading={isLoading}/>
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
