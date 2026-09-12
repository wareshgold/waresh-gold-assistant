"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { formatToman } from "@/data/products";

type OrderItem = { name: string; quantity: number };
type Order = {
  orderId: string;
  status: string;
  createdAt: string;
  total: number;
  items?: OrderItem[];
};

const statusLabel: Record<string, string> = {
  pending: "در انتظار تأیید",
  pending_confirmation: "در انتظار تأیید",
  confirmed: "تأیید شده",
  paid: "پرداخت شده",
  processing: "در حال آماده‌سازی",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  expired: "منقضی شده",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("fa-IR");
}

export default function OrderDetailPage() {
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
      setError(false);
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

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-4">
          <Link href="/" aria-label="وارش گلد" className="shrink-0"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto object-contain" /></Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex" aria-label="ناوبری اصلی">
            <Link className="waresh-link" href="/#products">محصولات</Link><Link className="waresh-link" href="/#prices">قیمت امروز</Link><Link className="waresh-link" href="/tools">ابزار طلا</Link><Link className="waresh-link" href="/account">حساب کاربری</Link>
          </nav>
          <div className="flex items-center gap-2"><Link href="/cart" className="hidden min-h-11 items-center rounded-full border border-[#d9c69e] bg-[#fffaf0] px-4 text-xs font-bold text-[#765728] sm:inline-flex">سبد خرید</Link><MobileMenu /></div>
        </div>
      </header>

      <section className="waresh-container py-10 sm:py-16">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#88877f]"><Link href="/account" className="hover:text-[#765728]">حساب کاربری</Link><span>/</span><span>جزئیات سفارش</span></div>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><h1 className="text-xl font-extrabold">در حال دریافت سفارش</h1><p className="mt-3 text-sm text-[#85857c]">اطلاعات سفارش شما در حال بارگذاری است.</p></div>
        ) : unauthorized ? (
          <div className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><h1 className="text-xl font-extrabold">ورود به حساب لازم است</h1><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#85857c]">برای مشاهده جزئیات سفارش، ابتدا وارد حساب کاربری وارش شوید.</p><Link href="/account" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#25392f] px-5 text-sm font-bold text-white">حساب کاربری</Link></div>
        ) : error ? (
          <div className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><h1 className="text-xl font-extrabold">دریافت سفارش ناموفق بود</h1><p className="mt-3 text-sm text-[#85857c]">لطفاً دوباره تلاش کنید.</p><Link href="/account" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#ded8cc] bg-white px-5 text-sm font-bold text-[#62685e]">بازگشت به حساب</Link></div>
        ) : !order ? (
          <div className="mt-8 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><h1 className="text-xl font-extrabold">سفارش پیدا نشد</h1><p className="mt-3 text-sm text-[#85857c]">این سفارش در حساب کاربری شما وجود ندارد یا دیگر در دسترس نیست.</p><Link href="/account" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#25392f] px-5 text-sm font-bold text-white">بازگشت به سفارش‌ها</Link></div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold tracking-[0.16em] text-[#9b7b48]">ORDER</p><h1 className="mt-2 break-all text-2xl font-extrabold text-[#25392f] sm:text-3xl" dir="ltr">{order.orderId}</h1><p className="mt-2 text-xs text-[#88877f]">ثبت شده در {formatDate(order.createdAt)}</p></div><span className="inline-flex w-fit rounded-full bg-[#f4ead7] px-3 py-2 text-xs font-bold text-[#765728]">{statusLabel[order.status] ?? order.status}</span></div>
              <div className="mt-7 space-y-3">
                {(order.items ?? []).map((item, index) => <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl border border-[#e8e2d8] bg-white p-4"><div className="min-w-0"><p className="text-sm font-extrabold leading-7">{item.name}</p><p className="mt-1 text-xs text-[#88877f]">تعداد: {item.quantity}</p></div><span className="shrink-0 rounded-full bg-[#f5f1e9] px-3 py-1.5 text-xs font-bold text-[#62685e]">× {item.quantity}</span></div>)}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#e6e0d5] pt-5"><span className="text-sm text-[#777970]">جمع سفارش</span><strong className="text-lg text-[#9b753c]">{formatToman(order.total)}</strong></div>
            </div>
            <aside className="rounded-[1.75rem] border border-[#ded8cc] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-6"><p className="text-xs font-bold text-[#929188]">پیگیری سفارش</p><h2 className="mt-2 text-lg font-extrabold">وضعیت سفارش را دنبال کنید</h2><p className="mt-3 text-xs leading-6 text-[#777970]">آخرین وضعیت سفارش از سرویس سفارش وارش دریافت می‌شود.</p><Link href={`/order/${encodeURIComponent(order.orderId)}/tracking`} className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-[#25392f] px-5 text-sm font-bold text-white">مشاهده روند سفارش</Link><Link href="/account" className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-5 text-xs font-bold text-[#62685e]">بازگشت به حساب</Link></aside>
          </div>
        )}
      </section>
    </main>
  );
}
