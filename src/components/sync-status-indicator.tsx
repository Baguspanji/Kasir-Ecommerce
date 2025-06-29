"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Loader } from "lucide-react";

type SyncStatus = "Online" | "Sinkronisasi" | "Offline";

const statusConfig: { [key in SyncStatus]: { icon: React.ElementType, color: string, text: string } } = {
  Online: { icon: Wifi, color: "bg-green-500 hover:bg-green-500", text: "Online" },
  Sinkronisasi: { icon: Loader, color: "bg-yellow-500 hover:bg-yellow-500", text: "Sinkronisasi" },
  Offline: { icon: WifiOff, color: "bg-red-500 hover:bg-red-500", text: "Offline" },
};

export default function SyncStatusIndicator() {
  const [status, setStatus] = useState<SyncStatus>("Online");

  useEffect(() => {
    const statuses: SyncStatus[] = ["Online", "Sinkronisasi", "Offline"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
       if (statuses[currentIndex] === 'Sinkronisasi') {
          setTimeout(() => {
             currentIndex = (currentIndex + 1) % statuses.length;
             if (currentIndex >= statuses.length) currentIndex = 0; // loop back
             setStatus(statuses[currentIndex]);
          }, 2000);
      }
      setStatus(statuses[currentIndex]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const { icon: Icon, color, text } = statusConfig[status];

  return (
    <Badge variant="outline" className={`border-0 text-white gap-2 ${color}`}>
      <Icon className={`h-4 w-4 ${status === "Sinkronisasi" ? "animate-spin" : ""}`} />
      <span>{text}</span>
    </Badge>
  );
}
