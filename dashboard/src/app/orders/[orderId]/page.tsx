"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatToman } from "@/data/products";

type Order = {
  orderId: string;
  quoteId: string;
  status: string;
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

const statusLabels: Record<string, string> = {
  pending_confirmation: "در انتظار تأیید",
  confirmed: "تأیید شده",
  paid: "پرداخت شده",
  processing: "در حال آماده‌سازی",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  expired: "منقضی شده",
};

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
    return () => { active = false; };
  }, [params]);

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="border-b border-[#dedfd7]/80 bg-[#faf8f2]"><div className="waresh-container flex h-[76px] items-center justify-between"><Link href="/" aria-label="وارش گلد"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto" /></Link><Link href="/cart" className="text-xs font-bold text-[#765728]">سبد خرید</Link></div></header>
      <section className="waresh-container py-12 sm:py-20">
        {loading ? <div className="rounded-[2rem] bg-[#fffdf8] p-8 text-center text-sm text-[#70766d]">در حال دریافت سفارش...</div> : error || !order ? <div className="rounded-[2rem] bg-[#fffdf8] p-8 text-center"><h1 className="text-2xl font-extrabold">سفارش پیدا نشد</h1><p className="mt-3 text-sm text-[#70766d]">شناسه سفارش معتبر نیست یا سفارش در دسترس نیست.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#25392f] px-6 py-3 text-sm font-bold text-white">بازگشت به فروشگاه</Link></div> : <div className="mx-auto max-w-3xl"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">ORDER TRACKING</p><h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">پیگیری سفارش</h1><div className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs text-[#8a8d84]">شناسه سفارش</p><p className="mt-1 break-all font-mono text-sm font-bold">{order.orderId}</p></div><span className="rounded-full bg-[#edf4ee] px-4 py-2 text-xs font-extrabold text-[#35543e]">{statusLabels[order.status] ?? order.status}</span></div><div className="mt-7 divide-y divide-[#ece7dd]">{order.items.map((item) => <div key={`${item.sku}-${item.name}`} className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-[#888b83]">{item.quantity} عدد · {item.weightGrams} گرم</p></div><p className="text-sm font-extrabold">{formatToman(item.lineTotal)}</p></div>)}</div><div className="mt-5 flex items-center justify-between border-t border-[#ded8cc] pt-5"><span className="text-sm font-bold">مبلغ سفارش</span><span className="text-lg font-extrabold text-[#765728]">{formatToman(order.total)}</span></div><p className="mt-5 text-xs leading-6 text-[#777b72]">قیمت و اقلام نمایش‌داده‌شده از سفارش ثبت‌شده در سرور خوانده شده‌اند.</p></div></div>}
      </section>
    </main>
  );
}
