"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { formatToman } from "@/data/products";

type OrderItem = { name: string; quantity: number };
type Order = { orderId: string; status: string; createdAt: string; total: number; items?: OrderItem[] };

type Step = { key: string; label: string; description: string };
const steps: Step[] = [
  { key: "pending", label: "ثبت سفارش", description: "سفارش شما ثبت شده و در حال بررسی است." },
  { key: "confirmed", label: "تأیید سفارش", description: "جزئیات سفارش و قیمت نهایی تأیید شده است." },
  { key: "paid", label: "پرداخت", description: "پرداخت سفارش ثبت و تأیید شده است." },
  { key: "processing", label: "آماده‌سازی", description: "سفارش برای ارسال یا تحویل آماده می‌شود." },
  { key: "completed", label: "تکمیل سفارش", description: "فرایند سفارش با موفقیت تکمیل شده است." },
];

const statusIndex: Record<string, number> = {
  pending: 0,
  pending_confirmation: 0,
  confirmed: 1,
  paid: 2,
  processing: 3,
  completed: 4,
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("fa-IR");
}

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const orderId = typeof params?.id === "string" ? params.id : "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!orderId) return;
      setLoading(true);
      try {
        const response = await fetch("/api/account/orders", { cache: "no-store" });
        const data = await response.json().catch(() => null) as { orders?: Order[] } | null;
        if (cancelled) return;
        if (response.status === 401) {
          setUnauthorized(true);
          setOrder(null);
          return;
        }
        if (!response.ok || !Array.isArray(data?.orders)) {
          setError(true);
          setOrder(null);
          return;
        }
        setUnauthorized(false);
        setOrder(data.orders.find((item) => item.orderId === orderId) ?? null);
      } catch {
        if (!cancelled) {
          setError(true);
          setOrder(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [orderId]);

  const currentIndex = order ? statusIndex[order.status] ?? 0 : 0;
  const cancelledOrder = order?.status === "cancelled" || order?.status === "expired";

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl"><div className="waresh-container flex h-[76px] items-center justify-between gap-4"><Link href="/" aria-label="وارش گلد" className="shrink-0"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto object-contain" /></Link><nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex"><Link className="waresh-link" href="/#products">محصولات</Link><Link className="waresh-link" href="/#prices">قیمت امروز</Link><Link className="waresh-link" href="/account">حساب کاربری</Link></nav><div className="flex items-center gap-2"><Link href="/cart" className="hidden min-h-11 items-center rounded-full border border-[#d9c69e] bg-[#fffaf0] px-4 text-xs font-bold text-[#765728] sm:inline-flex">سبد خرید</Link><MobileMenu /></div></div></header>

      <section className="waresh-container py-10 sm:py-16">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#88877f]"><Link href="/account" className="hover:text-[#765728]">حساب کاربری</Link><span>/</span><Link href={orderId ? `/order/${encodeURIComponent(orderId)}` : "/account"} className="hover:text-[#765728]">سفارش</Link><span>/</span><span>پیگیری</span></div>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><h1 className="text-xl font-extrabold">در حال دریافت وضعیت سفارش</h1><p className="mt-3 text-sm text-[#85857c]">آخرین وضعیت سفارش در حال بارگذاری است.</p></div>
        ) : unauthorized ? (
          <div className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><h1 className="text-xl font-extrabold">ورود به حساب لازم است</h1><Link href="/account" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#25392f] px-5 text-sm font-bold text-white">حساب کاربری</Link></div>
        ) : error || !order ? (
          <div className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><h1 className="text-xl font-extrabold">سفارش در دسترس نیست</h1><p className="mt-3 text-sm leading-7 text-[#85857c]">اطلاعات سفارش پیدا نشد یا دریافت آن ناموفق بود.</p><Link href="/account" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#ded8cc] bg-white px-5 text-sm font-bold text-[#62685e]">بازگشت به حساب</Link></div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold tracking-[0.16em] text-[#9b7b48]">ORDER TRACKING</p><h1 className="mt-2 break-all text-2xl font-extrabold text-[#25392f]" dir="ltr">{order.orderId}</h1><p className="mt-2 text-xs text-[#88877f]">ثبت شده در {formatDate(order.createdAt)}</p></div><span className="rounded-full bg-[#f4ead7] px-3 py-2 text-xs font-bold text-[#765728]">{cancelledOrder ? (order.status === "cancelled" ? "لغو شده" : "منقضی شده") : steps[currentIndex]?.label ?? order.status}</span></div>

              {cancelledOrder ? (
                <div className="mt-8 rounded-[1.5rem] bg-[#f8eee9] p-5"><h2 className="text-sm font-extrabold text-[#855b52]">این سفارش ادامه پیدا نمی‌کند.</h2><p className="mt-2 text-xs leading-6 text-[#94675f]">برای ثبت سفارش جدید می‌توانید به فروشگاه برگردید یا با وارش گلد هماهنگ کنید.</p></div>
              ) : (
                <ol className="mt-8 space-y-4" aria-label="مراحل سفارش">
                  {steps.map((step, index) => {
                    const active = index <= currentIndex;
                    const current = index === currentIndex;
                    return <li key={step.key} className={`relative rounded-[1.5rem] border p-4 sm:p-5 ${active ? "border-[#d8c69f] bg-[#fffaf0]" : "border-[#e8e2d8] bg-white"}`}><div className="flex gap-4"><span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${active ? "bg-[#25392f] text-white" : "bg-[#eeeae2] text-[#99968e]"}`}>{active ? "✓" : index + 1}</span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-extrabold">{step.label}</h2>{current && <span className="rounded-full bg-[#e8eee6] px-2 py-1 text-[10px] font-bold text-[#5f755f]">وضعیت فعلی</span>}</div><p className="mt-2 text-xs leading-6 text-[#777970]">{step.description}</p></div></div></li>;
                  })}
                </ol>
              )}
            </div>

            <aside className="rounded-[1.75rem] border border-[#ded8cc] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-6"><p className="text-xs font-bold text-[#929188]">خلاصه</p><div className="mt-4 flex items-center justify-between text-sm"><span className="text-[#777970]">مبلغ سفارش</span><strong className="text-[#9b753c]">{formatToman(order.total)}</strong></div><div className="mt-3 flex items-center justify-between text-sm"><span className="text-[#777970]">تعداد اقلام</span><strong>{(order.items ?? []).reduce((sum, item) => sum + item.quantity, 0)}</strong></div><div className="mt-5 border-t border-[#e6e0d5] pt-5"><Link href={`/order/${encodeURIComponent(order.orderId)}`} className="flex min-h-11 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-5 text-xs font-bold text-[#62685e]">جزئیات سفارش</Link><Link href="/account" className="mt-3 flex min-h-11 items-center justify-center rounded-full bg-[#25392f] px-5 text-xs font-bold text-white">تاریخچه سفارش‌ها</Link></div></aside>
          </div>
        )}
      </section>
    </main>
  );
}
