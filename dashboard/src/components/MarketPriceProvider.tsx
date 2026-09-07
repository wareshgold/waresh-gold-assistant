"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMarketPrice } from "@/lib/api";
import type { MarketPrice } from "@/types/market";

const MARKET_REFRESH_MS = 30_000;

type MarketPriceContextValue = {
  market: MarketPrice | null;
  isRefreshing: boolean;
  lastUpdatedAt: number | null;
  refresh: () => Promise<void>;
};

const MarketPriceContext = createContext<MarketPriceContextValue | null>(null);

type MarketPriceProviderProps = {
  initialMarket?: MarketPrice | null;
  children: React.ReactNode;
};

export default function MarketPriceProvider({ initialMarket = null, children }: MarketPriceProviderProps) {
  const [market, setMarket] = useState<MarketPrice | null>(initialMarket);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(initialMarket ? Date.now() : null);

  const refresh = async () => {
    if (document.visibilityState !== "visible") return;

    setIsRefreshing(true);
    try {
      const nextMarket = await getMarketPrice();
      setMarket(nextMarket);
      setLastUpdatedAt(Date.now());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled || document.visibilityState !== "visible") return;
      setIsRefreshing(true);
      try {
        const nextMarket = await getMarketPrice();
        if (cancelled) return;
        setMarket(nextMarket);
        setLastUpdatedAt(Date.now());
      } catch {
        // Keep the last known good market snapshot on transient failures.
      } finally {
        if (!cancelled) setIsRefreshing(false);
      }
    };

    const interval = window.setInterval(run, MARKET_REFRESH_MS);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void run();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const value = useMemo(
    () => ({ market, isRefreshing, lastUpdatedAt, refresh }),
    [market, isRefreshing, lastUpdatedAt],
  );

  return <MarketPriceContext.Provider value={value}>{children}</MarketPriceContext.Provider>;
}

export function useMarketPrice(): MarketPriceContextValue {
  const context = useContext(MarketPriceContext);
  if (!context) {
    throw new Error("useMarketPrice must be used inside MarketPriceProvider");
  }
  return context;
}
