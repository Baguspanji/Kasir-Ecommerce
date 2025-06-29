"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppSettings } from "@/types";

const SETTINGS_KEY = "app-settings";

const DEFAULT_SETTINGS: AppSettings = {
  appName: "E-Kasir",
  address: "Jl. Jenderal Sudirman No. 1, Jakarta",
  phone: "021-12345678",
  receiptFooter: "Terima kasih atas kunjungan Anda!",
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, []);

  return { settings, updateSettings, isLoading: settings === null };
}
