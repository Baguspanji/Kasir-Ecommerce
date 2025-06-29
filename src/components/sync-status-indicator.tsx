"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Loader } from "lucide-react";

type SyncStatus = "Online" | "Syncing" | "Offline";

const statusConfig = {
  Online: { icon: Wifi, color: "bg-green-500 hover:bg-green-500", text: "Online" },
  Syncing: { icon: Loader, color: "bg-yellow-500 hover:bg-yellow-500", text: "Syncing" },
  Offline: { icon: WifiOff, color: "bg-red-500 hover:bg-red-500", text: "Offline" },
};

export default function SyncStatusIndicator() {
  const [status, setStatus] = useState<SyncStatus>("Online");

  useEffect(() => {
    const statuses: SyncStatus[] = ["Online", "Syncing", "Offline"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
       if (statuses[currentIndex] === 'Syncing') {
          setTimeout(() => {
             currentIndex = (currentIndex + 1) % statuses.length;
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
      <Icon className={`h-4 w-4 ${status === "Syncing" ? "animate-spin" : ""}`} />
      <span>{text}</span>
    </Badge>
  );
}
