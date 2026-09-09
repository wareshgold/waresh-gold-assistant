"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatToman } from "@/data/products";

type OrderItem = {
  name: string;
  quantity: number;
};

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
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("fa-IR");
}

export default function CustomerOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/account/orders", { cache: "no-store" });
      const data = await response.json().catch(() => null) as { orders?: Order[] } | null;
      if (!response.ok || !Array.isArray(data?.orders)) {
        setOrders([]);
        setError(response.status !== 401);
        return;
      }
      setOrders(data.orders);
    } catch {
      setOrders([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return (
    <section className="mt-8 rounded-[1.75rem] border border-[#e3ddd2] bg-white p-5 shadow-[0_12px_35px_rgba(55,52,43,0.04)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-[#9b7b48]">ORDERS</p>
          <h2 className="mt-2 text-lg font-extrabold">تاریخچه سفارش‌ها</h2>
          <p className="mt-1 text-xs leading-6 text-[#777970]">سفارش‌های ثبت‌شده این حساب را مشاهده و پیگیری کنید.</p>
        </div>
        <button type="button" onClick={() => void loadOrders()} disabled={loading} className="min-h-10 rounded-full border border-[#ded8cc] px-4 text-xs font-bold text-[#62685e] disabled:opacity-50">
          {loading ? "در حال دریافت..." : "به‌روزرسانی"}
        </button>
      </div>

      {loading ? (
        <div className="mt-5 rounded-2xl bg-[#faf8f2] p-5 text-xs text-[#777970]">در حال دریافت سفارش‌ها...</div>
      ) : error ? (
        <div className="mt-5 rounded-2xl bg-[#faf8f2] p-5 text-xs leading-6 text-[#777970]">دریافت تاریخچه سفارش‌ها انجام نشد. دوباره تلاش کنید.</div>
      ) : orders.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-[#faf8f2] p-5 text-xs leading-6 text-[#777970]">هنوز سفارشی برای این حساب ثبت نشده است.</div>
      ) : (
        <div className="mt-5 space-y-3">
          {orders.map((order) => {
            const itemCount = (order.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
            return (
              <article key={order.orderId} className="rounded-2xl border border-[#e6e0d5] bg-[#fffdf8] p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong dir="ltr" className="text-sm text-[#25392f]">{order.orderId}</strong>
                      <span className="rounded-full bg-[#f4ead7] px-3 py-1.5 text-[10px] font-bold text-[#765728]">{statusLabel[order.status] ?? order.status}</span>
                    </div>
                    <p className="mt-2 text-[11px] text-[#88877f]">{formatDate(order.createdAt)} · {itemCount} عدد</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                    <strong className="text-sm text-[#9b753c]">{formatToman(order.total)}</strong>
                    <Link href={`/order/${encodeURIComponent(order.orderId)}`} className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-4 text-xs font-bold text-[#62685e]">جزئیات</Link>
                    <Link href={`/order/${encodeURIComponent(order.orderId)}/tracking`} className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#25392f] px-4 text-xs font-bold text-white">پیگیری</Link>
                  </div>
                </div>
                {order.items?.length ? <p className="mt-3 border-t border-[#eee9df] pt-3 text-[10px] leading-6 text-[#88877f]">{order.items.slice(0, 2).map((item) => `${item.name} × ${item.quantity}`).join(" · ")}{order.items.length > 2 ? " · …" : ""}</p> : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
