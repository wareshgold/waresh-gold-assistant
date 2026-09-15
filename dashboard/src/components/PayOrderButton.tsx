"use client";

import { useState } from "react";
import { formatToman } from "@/data/products";

type PayOrderButtonProps = {
  orderId: string;
  amount: number;
};

type CreatePaymentResponse = {
  paymentUrl?: string;
  payment?: {
    paymentId?: string;
    amount?: number;
  };
  error?: string;
};

export default function PayOrderButton({ orderId, amount }: PayOrderButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startPayment = async () => {
    if (loading || !orderId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json().catch(() => null) as CreatePaymentResponse | null;
      if (!response.ok || !data?.paymentUrl) {
        setError(data?.error ?? "ایجاد پرداخت انجام نشد.");
        return;
      }

      window.location.assign(data.paymentUrl);
    } catch {
      setError("ارتباط با سرویس پرداخت برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:col-span-4">
      <button
        type="button"
        onClick={() => void startPayment()}
        disabled={loading}
        className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#9b753c] px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(155,117,60,0.18)] transition hover:bg-[#866331] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "در حال انتقال به پرداخت..." : `پرداخت سفارش · ${formatToman(amount)}`}
      </button>
      {error ? (
        <p role="alert" className="mt-3 rounded-2xl border border-[#e3cfc7] bg-[#fbf1ed] px-4 py-3 text-center text-xs leading-6 text-[#80594e]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
