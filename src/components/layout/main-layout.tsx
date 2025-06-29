"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Package,
  Boxes,
  BarChart3,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SyncStatusIndicator from "@/components/sync-status-indicator";

const navItems = [
  { href: "/", label: "Kasir", icon: ShoppingCart },
  { href: "/items", label: "Barang", icon: Package },
  { href: "/stock", label: "Stok", icon: Boxes },
  { href: "/reports", label: "Laporan", icon: BarChart3 },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2">
              <Building className="w-6 h-6 text-primary" />
              <span className="font-bold">E-Kasir</span>
            </Link>
          </div>

          <nav className="flex-shrink-0 flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80 flex items-center gap-2",
                  pathname === item.href
                    ? "text-foreground font-semibold"
                    : "text-foreground/60"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
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
