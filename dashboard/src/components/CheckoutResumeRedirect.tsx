"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CHECKOUT_QUOTE_STORAGE_KEY = "waresh_checkout_quote_id";

export default function CheckoutResumeRedirect() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const check = async () => {
      if (cancelled) return;
      const pendingQuoteId = window.sessionStorage.getItem(CHECKOUT_QUOTE_STORAGE_KEY);
      if (!pendingQuoteId) return;

      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json().catch(() => null) as { customer?: unknown } | null;
        if (!cancelled && response.ok && data?.customer) {
          router.replace("/checkout");
          return;
        }
      } catch {
        // Keep polling while the account session is being established.
      }

      attempts += 1;
      if (!cancelled && attempts < 60) window.setTimeout(() => void check(), 500);
    };

    void check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
