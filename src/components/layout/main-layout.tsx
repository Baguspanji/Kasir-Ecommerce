"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Package,
  Boxes,
  BarChart3,
  Building,
  Settings,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SyncStatusIndicator from "@/components/sync-status-indicator";
import { useSettings } from "@/hooks/use-settings";
import { getAllProducts } from "@/lib/db";
import type { Product } from "@/types";

const navItems = [
  { href: "/", label: "Kasir", icon: ShoppingCart },
  { href: "/items", label: "Barang", icon: Package },
  { href: "/stock", label: "Stok", icon: Boxes },
  { href: "/reports", label: "Laporan", icon: BarChart3 },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

const LOW_STOCK_THRESHOLD = 20;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, isLoading } = useSettings();
  const [hasLowStock, setHasLowStock] = useState(false);

  const checkLowStock = useCallback(async () => {
    try {
      const products: Product[] = await getAllProducts();
      const lowStockItems = products.filter(
        (p) => p.stock < LOW_STOCK_THRESHOLD
      );
      setHasLowStock(lowStockItems.length > 0);
    } catch (error) {
      console.error("Failed to check low stock:", error);
      // Don't show notification if there's an error
      setHasLowStock(false); 
    }
  }, []);

  useEffect(() => {
    // Check stock on initial load and whenever the path changes,
    // as stock might have been updated.
    checkLowStock();
  }, [checkLowStock, pathname]);

  useEffect(() => {
    if (settings) {
      const currentPage = navItems.find((item) => item.href === pathname);
      const pageTitle = currentPage
        ? `${currentPage.label} - ${settings.appName}`
        : settings.appName;
      document.title = pageTitle;
    }
  }, [pathname, settings]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2">
              <Building className="w-6 h-6 text-primary" />
              <span className="font-bold">
                {isLoading ? "Memuat..." : settings?.appName}
              </span>
            </Link>
          </div>

          <nav className="flex-shrink-0 flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80 flex items-center gap-2 relative",
                  pathname === item.href
                    ? "text-foreground font-semibold"
                    : "text-foreground/60"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.href === "/stock" && hasLowStock && (
                  <span className="absolute -top-1 -right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex-1 flex items-center justify-end">
            <SyncStatusIndicator />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-4 md:py-6">{children}</main>
    </div>
  );
}
