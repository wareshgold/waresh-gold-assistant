"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatToman } from "@/data/products";

type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled"
  | "expired";

type Order = {
  orderId: string;
  quoteId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  total: number;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    weightGrams: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

const statusLabels: Record<OrderStatus, string> = {
  pending_confirmation: "در انتظار تأیید",
  confirmed: "تأیید شده",
  paid: "پرداخت شده",
  processing: "در حال آماده‌سازی",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  expired: "منقضی شده",
};

const timelineSteps: Array<{ status: Exclude<OrderStatus, "cancelled" | "expired">; label: string; description: string }> = [
  { status: "pending_confirmation", label: "ثبت سفارش", description: "سفارش شما در سامانه ثبت شده است." },
  { status: "confirmed", label: "تأیید سفارش", description: "سفارش توسط فروشگاه تأیید شده است." },
  { status: "paid", label: "پرداخت", description: "پرداخت سفارش ثبت و تأیید شده است." },
  { status: "processing", label: "آماده‌سازی", description: "سفارش در حال آماده‌سازی است." },
  { status: "completed", label: "تکمیل سفارش", description: "فرآیند سفارش با موفقیت تکمیل شده است." },
];

const timelineIndex: Record<Exclude<OrderStatus, "cancelled" | "expired">, number> = {
  pending_confirmation: 0,
  confirmed: 1,
  paid: 2,
  processing: 3,
  completed: 4,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function OrderTimeline({ status }: { status: OrderStatus }) {
  const terminal = status === "cancelled" || status === "expired";
  const currentIndex = terminal ? -1 : timelineIndex[status];

  return (
    <section className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-8" aria-label="وضعیت سفارش">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-[#9b7b48]">ORDER STATUS</p>
          <h2 className="mt-2 text-xl font-extrabold">مراحل سفارش</h2>
        </div>
        <span className="text-xs font-bold text-[#777b72]">آخرین بروزرسانی: {formatDate(new Date().toISOString())}</span>
      </div>

      {terminal ? (
        <div className="mt-6 rounded-2xl border border-[#eadfd5] bg-[#fbf5ef] p-5">
          <p className="text-sm font-extrabold">سفارش {statusLabels[status]} است.</p>
          <p className="mt-2 text-xs leading-6 text-[#777b72]">
            {status === "cancelled"
              ? "این سفارش لغو شده و مراحل بعدی برای آن انجام نمی‌شود."
              : "اعتبار این سفارش به پایان رسیده و مراحل بعدی برای آن انجام نمی‌شود."}
          </p>
        </div>
      ) : (
        <ol className="mt-7">
          {timelineSteps.map((step, index) => {
            const isComplete = index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <li key={step.status} className="relative flex gap-4 pb-7 last:pb-0">
                {index < timelineSteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`absolute right-[11px] top-7 h-[calc(100%-0.25rem)] w-px ${index < currentIndex ? "bg-[#5d7b65]" : "bg-[#ded9cf]"}`}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-black ${
                    isComplete
                      ? "border-[#35543e] bg-[#35543e] text-white"
                      : "border-[#d5d0c5] bg-[#fffdf8] text-[#9b9d95]"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-sm font-extrabold ${isCurrent ? "text-[#25392f]" : "text-[#555b53]"}`}>{step.label}</p>
                    {isCurrent ? <span className="rounded-full bg-[#edf4ee] px-2.5 py-1 text-[10px] font-extrabold text-[#35543e]">وضعیت فعلی</span> : null}
                  </div>
                  <p className="mt-1 text-xs leading-6 text-[#858980]">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export default function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void params.then(async ({ orderId }) => {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: "no-store" });
        const data = (await response.json().catch(() => null)) as { order?: Order } | null;
        if (!active) return;
        if (!response.ok || !data?.order) {
          setError(true);
          return;
        }
        setOrder(data.order);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [params]);

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="border-b border-[#dedfd7]/80 bg-[#faf8f2]">
        <div className="waresh-container flex h-[76px] items-center justify-between">
          <Link href="/" aria-label="وارش گلد">
            <img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto" />
          </Link>
          <Link href="/cart" className="text-xs font-bold text-[#765728]">سبد خرید</Link>
        </div>
      </header>

      <section className="waresh-container py-12 sm:py-20">
        {loading ? (
          <div className="rounded-[2rem] bg-[#fffdf8] p-8 text-center text-sm text-[#70766d]">در حال دریافت سفارش...</div>
        ) : error || !order ? (
          <div className="rounded-[2rem] bg-[#fffdf8] p-8 text-center">
            <h1 className="text-2xl font-extrabold">سفارش پیدا نشد</h1>
            <p className="mt-3 text-sm text-[#70766d]">شناسه سفارش معتبر نیست یا سفارش در دسترس نیست.</p>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-[#25392f] px-6 py-3 text-sm font-bold text-white">بازگشت به فروشگاه</Link>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">ORDER TRACKING</p>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">پیگیری سفارش</h1>

            <OrderTimeline status={order.status} />

            <div className="mt-6 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[#8a8d84]">شناسه سفارش</p>
                  <p className="mt-1 break-all font-mono text-sm font-bold">{order.orderId}</p>
                </div>
                <span className="rounded-full bg-[#edf4ee] px-4 py-2 text-xs font-extrabold text-[#35543e]">{statusLabels[order.status]}</span>
              </div>

              <div className="mt-5 grid gap-3 text-xs text-[#777b72] sm:grid-cols-2">
                <div className="rounded-xl bg-[#f7f3eb] px-4 py-3">ثبت سفارش: <span className="font-bold text-[#4c514a]">{formatDate(order.createdAt)}</span></div>
                <div className="rounded-xl bg-[#f7f3eb] px-4 py-3">آخرین تغییر: <span className="font-bold text-[#4c514a]">{formatDate(order.updatedAt)}</span></div>
              </div>

              <div className="mt-7 divide-y divide-[#ece7dd]">
                {order.items.map((item) => (
                  <div key={`${item.sku}-${item.name}`} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="mt-1 text-xs text-[#888b83]">{item.quantity} عدد · {item.weightGrams} گرم</p>
                    </div>
                    <p className="text-sm font-extrabold">{formatToman(item.lineTotal)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#ded8cc] pt-5">
                <span className="text-sm font-bold">مبلغ سفارش</span>
                <span className="text-lg font-extrabold text-[#765728]">{formatToman(order.total)}</span>
              </div>
              <p className="mt-5 text-xs leading-6 text-[#777b72]">قیمت و اقلام نمایش‌داده‌شده از سفارش ثبت‌شده در سرور خوانده شده‌اند.</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
