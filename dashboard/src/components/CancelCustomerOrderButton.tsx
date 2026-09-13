"use client";

import { useState } from "react";

type Props = {
  orderId: string;
  onCancelled?: () => void;
};

export default function CancelCustomerOrderButton({ orderId, onCancelled }: Props) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (cancelling) return;
    if (!window.confirm("آیا از لغو این سفارش مطمئن هستید؟ این عملیات قابل بازگشت نیست.")) return;

    setCancelling(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json().catch(() => null) as { error?: string } | null;

      if (!response.ok) {
        setError(data?.error ?? "لغو سفارش انجام نشد. دوباره تلاش کنید.");
        return;
      }

      onCancelled?.();
    } catch {
      setError("ارتباط با سامانه لغو سفارش برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <button
        type="button"
        onClick={() => void handleCancel()}
        disabled={cancelling}
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#e3cfc7] bg-[#fffaf7] px-4 text-xs font-bold text-[#80594e] transition hover:bg-[#fbf1ed] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancelling ? "در حال لغو..." : "لغو سفارش"}
      </button>
      {error ? <p role="alert" className="max-w-48 text-[10px] leading-5 text-[#80594e]">{error}</p> : null}
    </div>
  );
}
