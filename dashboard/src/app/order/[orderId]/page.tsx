"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { formatToman } from "@/data/products";
import { TELEGRAM_BOT_URL } from "@/lib/api";

type OrderItem = {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  quantity: number;
  weightGrams: number;
  unitPrice: number;
  lineTotal: number;
};

type Order = {
  orderId: string;
  quoteId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  total: number;
  market?: { gold18Price?: number };
  items?: OrderItem[];
  address?: {
    addressId: string;
    title: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    address: string;
    postalCode: string;
  } | null;
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

export default function OrderResultPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = typeof params?.orderId === "string" ? params.orderId : "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: "no-store" });
        const data = await response.json().catch(() => null) as { order?: Order } | null;
        if (cancelled) return;
        if (!response.ok || !data?.order) {
          setOrder(null);
          setError(true);
          return;
        }
        setOrder(data.order);
      } catch {
        if (!cancelled) {
          setOrder(null);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadOrder();
    return () => { cancelled = true; };
  }, [orderId]);

  const telegramMessage = useMemo(() => {
    if (!order) return "#";
    const lines = [
      "سلام وارش گلد، درباره این سفارش پیگیری دارم:",
      `شناسه سفارش: ${order.orderId}`,
      `شناسه پیش‌فاکتور: ${order.quoteId}`,
      ...(order.items ?? []).map((item) => `• ${item.name} | ${item.quantity} عدد | ${formatToman(item.lineTotal)}`),
      `مبلغ سفارش: ${formatToman(order.total)}`,
      `وضعیت: ${statusLabel[order.status] ?? order.status}`,
    ];
    return `${TELEGRAM_BOT_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [order]);

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="border-b border-[#dedfd7]/80 bg-[#faf8f2]">
        <div className="waresh-container flex h-[76px] items-center justify-between">
          <Link href="/" aria-label="وارش گلد"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto" /></Link>
          <div className="flex items-center gap-2">
            <Link href="/#products" className="hidden rounded-full border border-[#ded8cc] bg-white px-4 py-2.5 text-xs font-bold text-[#62685e] sm:inline-flex">بازگشت به فروشگاه</Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      <section className="waresh-container py-12 sm:py-20">
        {loading ? (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center shadow-[0_18px_50px_rgba(55,52,43,0.05)]">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">ORDER</p>
            <h1 className="mt-4 text-2xl font-extrabold sm:text-4xl">در حال دریافت اطلاعات سفارش...</h1>
          </div>
        ) : error || !order ? (
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center shadow-[0_18px_50px_rgba(55,52,43,0.05)]">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">ORDER RESULT</p>
            <h1 className="mt-4 text-2xl font-extrabold sm:text-4xl">سفارش پیدا نشد</h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-[#777970]">اطلاعات این سفارش در حال حاضر قابل دریافت نیست. اگر سفارش را تازه ثبت کرده‌اید، چند لحظه بعد دوباره تلاش کنید.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => window.location.reload()} className="min-h-12 rounded-full bg-[#25392f] px-6 text-sm font-bold text-white">تلاش دوباره</button>
              <Link href="/account" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-6 text-sm font-bold text-[#62685e]">حساب کاربری</Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[2rem] border border-[#cddbcf] bg-[#edf4ee] p-6 text-center shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-9">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#35543e] text-2xl text-white">✓</div>
              <p className="mt-5 text-xs font-bold tracking-[0.2em] text-[#708076]">ORDER RESULT</p>
              <h1 className="mt-3 text-3xl font-extrabold text-[#35543e] sm:text-5xl">سفارش شما با موفقیت ثبت شد</h1>
              <p className="mt-4 text-sm leading-7 text-[#58705f]">سفارش شما ثبت شده و در وضعیت «{statusLabel[order.status] ?? order.status}» قرار دارد.</p>
              <div className="mt-6 inline-flex flex-col items-center rounded-2xl bg-white/75 px-6 py-4">
                <span className="text-[10px] text-[#88877f]">شناسه سفارش</span>
                <strong dir="ltr" className="mt-1 text-lg text-[#25392f]">{order.orderId}</strong>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
              <section className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-7">
                <div className="flex items-center justify-between gap-4 border-b border-[#e6e0d5] pb-5">
                  <div>
                    <p className="text-xs font-bold text-[#929188]">جزئیات سفارش</p>
                    <p className="mt-1 text-[11px] text-[#aaa79d]">ثبت شده در {formatDate(order.createdAt)}</p>
                  </div>
                  <span className="rounded-full bg-[#f4ead7] px-3 py-1.5 text-[10px] font-bold text-[#765728]">{statusLabel[order.status] ?? order.status}</span>
                </div>
                <div className="mt-5 space-y-4">
                  {(order.items ?? []).map((item) => (
                    <div key={`${item.productId}-${item.variantId}-${item.sku}`} className="flex items-start justify-between gap-4 rounded-2xl bg-[#faf8f2] p-4">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold leading-6">{item.name}</p>
                        <p className="mt-1 text-[10px] leading-5 text-[#88877f]">{item.quantity} عدد · {item.weightGrams} گرم</p>
                      </div>
                      <strong className="shrink-0 text-xs text-[#9b753c]">{formatToman(item.lineTotal)}</strong>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-[#e6e0d5] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#777970]">مبلغ نهایی</span>
                    <strong className="text-xl text-[#9b753c]">{formatToman(order.total)}</strong>
                  </div>
                  {order.market?.gold18Price ? <p className="mt-2 text-[10px] text-[#99978f]">نرخ طلای ۱۸ عیار هنگام ثبت: {formatToman(order.market.gold18Price)}</p> : null}
                </div>
              </section>

              <aside className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-7">
                <p className="text-xs font-bold text-[#929188]">آدرس ارسال</p>
                {order.address ? (
                  <div className="mt-4 rounded-2xl bg-[#faf8f2] p-4 text-xs leading-7 text-[#62685e]">
                    <p className="font-extrabold text-[#292b26]">{order.address.title} · {order.address.recipientName}</p>
                    <p className="mt-1">{order.address.province}، {order.address.city}</p>
                    <p>{order.address.address}</p>
                    <p className="mt-1 text-[10px]">کد پستی: <span dir="ltr">{order.address.postalCode}</span></p>
                  </div>
                ) : (
                  <p className="mt-4 rounded-2xl bg-[#faf8f2] p-4 text-xs leading-6 text-[#777970]">این سفارش بدون آدرس ذخیره‌شده ثبت شده است.</p>
                )}
              </aside>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Link href={`/order/${encodeURIComponent(order.orderId)}/tracking`} className="flex min-h-12 items-center justify-center rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white">پیگیری وضعیت سفارش</Link>
              <a href={telegramMessage} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-5 py-3.5 text-sm font-bold text-[#62685e]">پیگیری در تلگرام</a>
              <Link href="/account" className="flex min-h-12 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-5 py-3.5 text-sm font-bold text-[#62685e]">مشاهده حساب کاربری</Link>
            </div>
          </div>
        )}
      </section>

      <footer className="bg-[#1f2d26] py-10 text-white">
        <div className="waresh-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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
