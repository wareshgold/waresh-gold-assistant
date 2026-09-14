"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PaymentButtonProps = {
  orderId: string;
};

export default function PaymentButton({ orderId }: PaymentButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startPayment = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json().catch(() => null) as { paymentUrl?: unknown; error?: string } | null;

      if (!response.ok || typeof data?.paymentUrl !== "string" || !data.paymentUrl) {
        setError(data?.error || "شروع پرداخت انجام نشد. لطفاً دوباره تلاش کنید.");
        return;
      }

      if (data.paymentUrl.startsWith("/")) {
        router.push(data.paymentUrl);
      } else {
        window.location.assign(data.paymentUrl);
      }
    } catch {
      setError("ارتباط با سرویس پرداخت برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-[#e1d6bc] bg-[#fffaf0] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-[#9b7b48]">پرداخت آنلاین</p>
          <h2 className="mt-1 text-sm font-extrabold text-[#3d4039]">پرداخت امن سفارش</h2>
          <p className="mt-1 text-[11px] leading-6 text-[#777970]">پس از شروع پرداخت، به درگاه پرداخت منتقل می‌شوید. مبلغ از روی سفارش تأییدشده محاسبه شده است.</p>
        </div>
        <button type="button" onClick={() => void startPayment()} disabled={loading} className="min-h-12 w-full rounded-full bg-[#b28b4c] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(178,139,76,0.18)] transition hover:-translate-y-0.5 hover:bg-[#9d773d] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-52">
          {loading ? "در حال انتقال..." : "پرداخت سفارش"}
        </button>
      </div>
      {error ? <p role="alert" className="mt-3 rounded-2xl bg-[#fbf1ed] px-4 py-3 text-xs leading-6 text-[#80594e]">{error}</p> : null}
    </div>
  );
}
