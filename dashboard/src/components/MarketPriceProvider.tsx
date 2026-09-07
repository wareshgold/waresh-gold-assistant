"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MARKET_REFRESH_MS = 30_000;

export default function MarketPriceProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const refreshPage = () => {
      if (cancelled || document.visibilityState !== "visible") return;
      router.refresh();
    };

    const interval = window.setInterval(refreshPage, MARKET_REFRESH_MS);
    document.addEventListener("visibilitychange", refreshPage);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshPage);
    };
  }, [router]);

  return <>{children}</>;
}
