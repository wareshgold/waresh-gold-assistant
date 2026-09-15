"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { formatToman } from "@/data/products";

export default function MockPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const paymentId = searchParams.get("paymentId")?.trim() ?? "";
  const orderId = searchParams.get("orderId")?.trim() ?? "";
  const amountValue = Number(searchParams.get("amount") ?? "0");
  const amount = Number.isFinite(amountValue) && amountValue > 0 ? amountValue : 0;
  const authority = useMemo(() => paymentId ? `MOCK-${paymentId}` : "", [paymentId]);

  const verifyPayment = async () => {
    if (!paymentId || !orderId || !authority || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/payment/verify/${encodeURIComponent(paymentId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ authority }),
      });
      const data = await response.json().catch(() => null) as { error?: string } | null;

      if (!response.ok) {
        setError(data?.error ?? "تأیید پرداخت انجام نشد.");
        return;
      }

      router.replace(`/order/${encodeURIComponent(orderId)}`);
    } catch {
      setError("ارتباط با سرویس پرداخت برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  if (!paymentId || !orderId || !authority) {
    return (
      <main className="min-h-screen bg-[#f5f1e9] px-4 py-16 text-[#292b26]">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center shadow-[0_18px_50px_rgba(55,52,43,0.05)]">
          <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">MOCK PAYMENT</p>
          <h1 className="mt-4 text-2xl font-extrabold">اطلاعات پرداخت ناقص است</h1>
          <p className="mt-4 text-sm leading-7 text-[#777970]">برای ادامه پرداخت، از صفحه سفارش دوباره وارد درگاه شوید.</p>
          <Link href="/account" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#25392f] px-6 text-sm font-bold text-white">بازگشت به حساب کاربری</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] px-4 py-12 text-[#292b26] sm:py-20">
      <div className="mx-auto max-w-xl">
        <div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-7 text-center shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-9">
          <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">MOCK PAYMENT GATEWAY</p>
          <h1 className="mt-4 text-3xl font-extrabold text-[#25392f]">پرداخت آزمایشی</h1>
          <p className="mt-4 text-sm leading-7 text-[#777970]">این صفحه فقط برای تست جریان پرداخت فروشگاه است و به درگاه بانکی واقعی متصل نیست.</p>

          <div className="mt-7 rounded-2xl bg-[#faf8f2] p-5 text-right">
            <div className="flex items-center justify-between gap-4 border-b border-[#e6e0d5] pb-4">
              <span className="text-xs text-[#88877f]">سفارش</span>
              <strong dir="ltr" className="text-xs text-[#25392f]">{orderId}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 pt-4">
              <span className="text-xs text-[#88877f]">مبلغ</span>
              <strong className="text-lg text-[#9b753c]">{amount > 0 ? formatToman(amount) : "مبلغ از سرور تعیین می‌شود"}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void verifyPayment()}
            disabled={loading}
            className="mt-7 min-h-14 w-full rounded-full bg-[#25392f] px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#1c2c24] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال تأیید پرداخت..." : "تأیید پرداخت آزمایشی"}
          </button>

          {error ? (
            <p role="alert" className="mt-4 rounded-2xl border border-[#e3cfc7] bg-[#fbf1ed] px-4 py-3 text-xs leading-6 text-[#80594e]">
              {error}
            </p>
          ) : null}

          <Link href={`/order/${encodeURIComponent(orderId)}`} className="mt-4 inline-flex text-xs font-bold text-[#777970] hover:text-[#25392f]">
            بازگشت به سفارش
          </Link>
        </div>
      </div>
    </main>
  );
}
