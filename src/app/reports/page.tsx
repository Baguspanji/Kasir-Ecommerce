"use client";

import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import Header from "@/components/layout/header";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import type { Transaction } from "@/types";
import { MOCK_TRANSACTIONS } from "@/lib/data";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function ReportsPage() {
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredTransactions = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return transactions;
    }
    return transactions.filter(
      (t) =>
        t.date >= (dateRange.from as Date) && t.date <= (dateRange.to as Date)
    );
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

  return (
    <>
      <Header title="Reports & Analytics" />
      <div className="space-y-6">
        <div>
          <DateRangePicker onDateChange={setDateRange} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cost of Goods Sold (COGS)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.cogs)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gross Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(summary.grossProfit)}</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Transaction History</h2>
          <DataTable columns={columns} data={filteredTransactions} />
        </div>
      </div>
    </>
  );
}
