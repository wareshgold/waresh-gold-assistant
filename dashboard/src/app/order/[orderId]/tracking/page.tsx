"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { formatToman } from "@/data/products";

type Order = {
  orderId: string;
  quoteId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  total: number;
};

const statuses = [
  { key: "pending_confirmation", label: "ثبت سفارش", description: "سفارش شما ثبت شده و در حال بررسی است." },
  { key: "confirmed", label: "تأیید سفارش", description: "سفارش شما توسط وارش گلد تأیید شده است." },
  { key: "paid", label: "پرداخت شده", description: "پرداخت سفارش ثبت شده است." },
  { key: "processing", label: "آماده‌سازی", description: "سفارش شما در حال آماده‌سازی است." },
  { key: "completed", label: "تکمیل شده", description: "فرآیند سفارش با موفقیت تکمیل شده است." },
] as const;

const statusAliases: Record<string, string> = {
  pending: "pending_confirmation",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("fa-IR");
}

export default function OrderTrackingPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = typeof params?.orderId === "string" ? params.orderId : "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const loadOrder = useCallback(async (background = false) => {
    if (!orderId) return;
    if (background) setRefreshing(true);
    else setLoading(true);
    setError(false);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const data = await response.json().catch(() => null) as { order?: Order } | null;
      if (!response.ok || !data?.order) {
        setError(true);
        if (!background) setOrder(null);
        return;
      }
      setOrder(data.order);
    } catch {
      if (!background) {
        setOrder(null);
        setError(true);
      }
    } finally {
      if (background) setRefreshing(false);
      else setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
    const interval = window.setInterval(() => void loadOrder(true), 30_000);
    return () => window.clearInterval(interval);
  }, [loadOrder]);

  const currentKey = order ? (statusAliases[order.status] ?? order.status) : "";
  const currentIndex = statuses.findIndex((status) => status.key === currentKey);
  const terminal = currentKey === "cancelled" || currentKey === "expired";

  const progressText = useMemo(() => {
    if (!order) return "";
    if (currentKey === "cancelled") return "این سفارش لغو شده است.";
    if (currentKey === "expired") return "اعتبار این سفارش به پایان رسیده است.";
    if (currentIndex < 0) return `وضعیت فعلی: ${order.status}`;
    return statuses[currentIndex].description;
  }, [currentIndex, currentKey, order]);

  const currentLabel = currentKey === "cancelled"
    ? "لغو شده"
    : currentKey === "expired"
      ? "منقضی شده"
      : currentIndex >= 0
        ? statuses[currentIndex].label
        : order?.status ?? "—";

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-4">
          <Link href="/" aria-label="وارش گلد" className="shrink-0">
            <img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/account" className="hidden min-h-11 items-center rounded-full border border-[#ded8cc] bg-white px-4 text-xs font-bold text-[#62685e] sm:inline-flex">حساب کاربری</Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      <section className="waresh-container py-10 sm:py-16 lg:py-20">
        {loading ? (
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-8 text-center shadow-[0_18px_50px_rgba(55,52,43,0.05)]">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">ORDER TRACKING</p>
            <h1 className="mt-4 text-2xl font-extrabold sm:text-4xl">در حال دریافت وضعیت سفارش...</h1>
          </div>
        ) : error || !order ? (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-8 text-center shadow-[0_18px_50px_rgba(55,52,43,0.05)]">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">ORDER TRACKING</p>
            <h1 className="mt-4 text-2xl font-extrabold sm:text-4xl">وضعیت سفارش قابل دریافت نیست</h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-[#777970]">اگر سفارش را تازه ثبت کرده‌اید، چند لحظه بعد دوباره تلاش کنید.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => void loadOrder()} className="min-h-12 rounded-full bg-[#25392f] px-6 text-sm font-bold text-white">تلاش دوباره</button>
              <Link href="/account" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-6 text-sm font-bold text-[#62685e]">حساب کاربری</Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-9">
              <div className="flex flex-col gap-5 border-b border-[#e6e0d5] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">ORDER TRACKING</p>
                  <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">پیگیری سفارش</h1>
                  <p className="mt-3 text-xs text-[#777970]">شناسه سفارش: <strong dir="ltr" className="text-[#292b26]">{order.orderId}</strong></p>
                </div>
                <div className="rounded-2xl bg-[#faf8f2] px-4 py-3 text-right">
                  <span className="text-[10px] text-[#99978f]">مبلغ سفارش</span>
                  <strong className="mt-1 block text-sm text-[#9b753c]">{formatToman(order.total)}</strong>
                </div>
              </div>

              <div className="mt-7 rounded-2xl bg-[#edf4ee] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#708076]">وضعیت فعلی</p>
                    <p className="mt-1 text-lg font-extrabold text-[#35543e]">{currentLabel}</p>
                  </div>
                  {refreshing ? <span className="text-[10px] text-[#708076]">در حال به‌روزرسانی...</span> : null}
                </div>
                <p className="mt-3 text-xs leading-6 text-[#58705f]">{progressText}</p>
              </div>

              {terminal ? (
                <div className="mt-7 rounded-2xl border border-[#e3cfc7] bg-[#fbf1ed] p-5 text-sm leading-7 text-[#80594e]">
                  وضعیت نهایی این سفارش «{currentLabel}» است. برای پیگیری بیشتر می‌توانید با پشتیبانی وارش گلد در تماس باشید.
                </div>
              ) : (
                <div className="mt-8">
                  <div className="space-y-0">
                    {statuses.map((status, index) => {
                      const reached = currentIndex >= 0 && index <= currentIndex;
                      const current = index === currentIndex;
                      return (
                        <div key={status.key} className="relative flex gap-4 pb-8 last:pb-0">
                          {index < statuses.length - 1 ? <span className={`absolute right-[11px] top-7 h-[calc(100%-4px)] w-px ${reached && index < currentIndex ? "bg-[#58705f]" : "bg-[#ded8cc]"}`} /> : null}
                          <span className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${current ? "border-[#35543e] bg-[#35543e] text-white" : reached ? "border-[#58705f] bg-[#edf4ee] text-[#35543e]" : "border-[#ded8cc] bg-[#fffdf8] text-[#aaa79d]"}`}>
                            {reached ? "✓" : index + 1}
                          </span>
                          <div className="min-w-0 pt-0.5">
                            <p className={`text-sm font-extrabold ${current ? "text-[#35543e]" : reached ? "text-[#62685e]" : "text-[#aaa79d]"}`}>{status.label}</p>
                            <p className={`mt-1 text-xs leading-6 ${reached ? "text-[#777970]" : "text-[#b0ada4]"}`}>{status.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 grid gap-3 border-t border-[#e6e0d5] pt-6 sm:grid-cols-3">
                <Link href={`/order/${encodeURIComponent(order.orderId)}`} className="flex min-h-12 items-center justify-center rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white">جزئیات سفارش</Link>
                <button type="button" onClick={() => void loadOrder(true)} disabled={refreshing} className="min-h-12 rounded-full border border-[#ded8cc] bg-white px-5 py-3.5 text-sm font-bold text-[#62685e] disabled:opacity-50">به‌روزرسانی وضعیت</button>
                <Link href="/account" className="flex min-h-12 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-5 py-3.5 text-sm font-bold text-[#62685e]">حساب کاربری</Link>
              </div>
              <p className="mt-4 text-center text-[10px] text-[#aaa79d]">آخرین به‌روزرسانی: {formatDate(order.updatedAt)} · وضعیت هر ۳۰ ثانیه بررسی می‌شود.</p>
            </div>
          </div>
        )}
      </section>

      <footer className="bg-[#1f2d26] py-10 text-white">
        <div className="waresh-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-10 w-auto object-contain" />
            <p className="mt-3 text-xs text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p>
          </div>
          <Link href="/" className="text-sm text-white/65">بازگشت به فروشگاه</Link>
        </div>
      </footer>
    </main>
  );
}
