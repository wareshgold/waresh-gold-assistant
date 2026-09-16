"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled"
  | "expired";

type OrderItem = {
  name: string;
  quantity: number;
  weightGrams: number;
  unitPrice: number;
  lineTotal: number;
};

type Order = {
  orderId: string;
  customerId: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  total: number;
  market: { gold18Price: number };
  items: OrderItem[];
  address: { recipientName: string; phone: string; city: string; address: string } | null;
};

type OrderStatusHistoryEntry = {
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedAt: string;
};

type OrderDetails = {
  order: Order;
  statusHistory: OrderStatusHistoryEntry[];
};

const labels: Record<OrderStatus, string> = {
  pending_confirmation: "در انتظار تأیید",
  confirmed: "تأیید شده",
  paid: "پرداخت شده",
  processing: "در حال پردازش",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
  expired: "منقضی شده",
};

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  pending_confirmation: ["confirmed", "cancelled", "expired"],
  confirmed: ["paid", "cancelled", "expired"],
  paid: ["processing"],
  processing: ["completed"],
  completed: [],
  cancelled: [],
  expired: [],
};

const allStatuses: Array<OrderStatus | "all"> = [
  "all",
  "pending_confirmation",
  "confirmed",
  "paid",
  "processing",
  "completed",
  "cancelled",
  "expired",
];

const formatMoney = (value: number) => `${new Intl.NumberFormat("fa-IR").format(Math.round(value))} تومان`;
const formatDate = (value: string) => new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function AdminOrderConsole() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [orderId, setOrderId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      setAuthChecking(true);
      try {
        const response = await fetch("/api/admin/auth", { cache: "no-store" });
        if (cancelled) return;

        if (response.ok) {
          setAuthenticated(true);
          setError("");
        } else if (response.status === 401) {
          setAuthenticated(false);
        } else {
          const data = await response.json().catch(() => null) as { error?: string } | null;
          setAuthenticated(false);
          setError(data?.error ?? "بررسی نشست ادمین انجام نشد.");
        }
      } catch {
        if (!cancelled) {
          setAuthenticated(false);
          setError("ارتباط با سرویس احراز هویت ادمین برقرار نشد.");
        }
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    };

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadOrders = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (response.status === 401) {
        setAuthenticated(false);
        setOrders([]);
        setSelectedOrder(null);
        throw new Error("نشست ادمین معتبر نیست.");
      }
      if (!response.ok || !Array.isArray(data?.orders)) {
        throw new Error(data?.error ?? "دریافت سفارش‌ها انجام نشد.");
      }
      setOrders(data.orders);
      setSelectedOrder((current) => current ? {
        order: data.orders.find((item: Order) => item.orderId === current.order.orderId) ?? current.order,
        statusHistory: current.statusHistory,
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "دریافت سفارش‌ها انجام نشد.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const timer = window.setTimeout(() => void loadOrders(), 0);
    return () => window.clearTimeout(timer);
  }, [authenticated, loadOrders]);

  async function login() {
    setLoading(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "احراز هویت انجام نشد.");
      setAuthenticated(true); setMessage("ورود ادمین با موفقیت انجام شد.");
    } catch (err) { setError(err instanceof Error ? err.message : "احراز هویت انجام نشد."); }
    finally { setLoading(false); }
  }

  async function loadOrderById(id: string, showLoading = true) {
    const normalizedId = id.trim();
    if (!normalizedId) { setError("شناسه سفارش را وارد کنید."); return; }
    if (showLoading) setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(normalizedId)}`, { cache: "no-store" });
      const data = await response.json().catch(() => null) as OrderDetails & { error?: string } | null;
      if (response.status === 401) { setAuthenticated(false); setSelectedOrder(null); throw new Error("نشست ادمین معتبر نیست."); }
      if (!response.ok || !data?.order) throw new Error(data?.error ?? "سفارش پیدا نشد.");
      setSelectedOrder({ order: data.order, statusHistory: Array.isArray(data.statusHistory) ? data.statusHistory : [] });
      setOrderId(data.order.orderId);
      setSelectedStatus("");
    } catch (err) { setError(err instanceof Error ? err.message : "دریافت سفارش انجام نشد."); }
    finally { if (showLoading) setLoading(false); }
  }

  async function loadOrder() {
    setMessage("");
    await loadOrderById(orderId);
  }

  async function refreshSelectedOrder(orderIdToRefresh: string) {
    const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderIdToRefresh)}`, { cache: "no-store" });
    const data = await response.json().catch(() => null) as OrderDetails & { error?: string } | null;
    if (response.status === 401) {
      setAuthenticated(false);
      setSelectedOrder(null);
      throw new Error("نشست ادمین معتبر نیست.");
    }
    if (!response.ok || !data?.order) throw new Error(data?.error ?? "بازخوانی سفارش انجام نشد.");

    const details = {
      order: data.order,
      statusHistory: Array.isArray(data.statusHistory) ? data.statusHistory : [],
    };
    setSelectedOrder(details);
    setOrders((current) => current.map((item) => item.orderId === details.order.orderId ? details.order : item));
    setOrderId(details.order.orderId);
    setSelectedStatus("");
    return details;
  }

  async function updateStatus() {
    if (!selectedOrder || !selectedStatus || loading) return;
    const currentOrder = selectedOrder.order;
    const requestedStatus = selectedStatus;

    if (requestedStatus === "cancelled" || requestedStatus === "expired") {
      const confirmed = window.confirm(`این عملیات وضعیت سفارش را به «${labels[requestedStatus]}» تغییر می‌دهد و قابل بازگشت نیست. ادامه می‌دهید؟`);
      if (!confirmed) return;
    }

    setLoading(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(currentOrder.orderId)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: requestedStatus }) });
      const data = await response.json().catch(() => null) as { order?: Order; error?: string } | null;

      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("نشست ادمین معتبر نیست.");
      }

      if (response.status === 409) {
        const conflictMessage = data?.error ?? "وضعیت سفارش توسط درخواست دیگری تغییر کرده است.";
        await refreshSelectedOrder(currentOrder.orderId);
        throw new Error(`${conflictMessage} وضعیت فعلی و Timeline دوباره دریافت شد.`);
      }

      if (!response.ok || !data?.order) throw new Error(data?.error ?? "تغییر وضعیت سفارش انجام نشد.");

      setOrders((current) => current.map((item) => item.orderId === data.order!.orderId ? data.order! : item));
      setSelectedStatus("");
      setMessage("وضعیت سفارش با موفقیت تغییر کرد؛ در حال دریافت Timeline جدید...");

      const detailResponse = await fetch(`/api/admin/orders/${encodeURIComponent(currentOrder.orderId)}`, { cache: "no-store" });
      const detailData = await detailResponse.json().catch(() => null) as OrderDetails & { error?: string } | null;
      if (detailResponse.status === 401) { setAuthenticated(false); throw new Error("نشست ادمین معتبر نیست."); }
      if (!detailResponse.ok || !detailData?.order) throw new Error(detailData?.error ?? "وضعیت جدید ثبت شد اما دریافت Timeline انجام نشد.");

      setSelectedOrder({ order: detailData.order, statusHistory: Array.isArray(detailData.statusHistory) ? detailData.statusHistory : [] });
      setMessage("وضعیت سفارش و Timeline با موفقیت به‌روزرسانی شد.");
    } catch (err) { setError(err instanceof Error ? err.message : "تغییر وضعیت سفارش انجام نشد."); }
    finally { setLoading(false); }
  }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false); setToken(""); setOrders([]); setSelectedOrder(null); setOrderId(""); setMessage(""); setError("");
  }

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!query) return true;
      return order.orderId.toLowerCase().includes(query) || (order.customerId ?? "").toLowerCase().includes(query) || (order.address?.recipientName ?? "").toLowerCase().includes(query);
    });
  }, [orders, search, statusFilter]);

  if (authChecking) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-[#ded7c8] bg-[#fffdf8] p-6 text-center shadow-sm sm:p-8">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8a7041]">ADMIN</p>
        <h1 className="mt-2 text-2xl font-black text-[#292b26]">مدیریت سفارش‌ها</h1>
        <p className="mt-4 text-sm text-[#6d7168]">در حال بررسی نشست ادمین...</p>
      </section>
    );
  }

  if (!authenticated) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-[#ded7c8] bg-[#fffdf8] p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8a7041]">ADMIN</p>
        <h1 className="mt-2 text-2xl font-black text-[#292b26]">مدیریت سفارش‌ها</h1>
        <p className="mt-3 text-sm leading-7 text-[#6d7168]">برای ورود، توکن ادمین را وارد کنید. توکن به‌صورت HttpOnly در نشست مرورگر نگهداری می‌شود و جاوااسکریپت صفحه به آن دسترسی ندارد.</p>
        <input value={token} onChange={(event) => setToken(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void login(); }} type="password" placeholder="ADMIN_API_TOKEN" className="mt-6 min-h-12 w-full rounded-2xl border border-[#d8d5ca] bg-white px-4 text-left outline-none focus:border-[#9a7b43]" dir="ltr" />
        <button type="button" onClick={() => void login()} disabled={loading || !token.trim()} className="mt-3 min-h-12 w-full rounded-2xl bg-[#1f2d26] px-5 text-sm font-bold text-white disabled:opacity-50">{loading ? "در حال بررسی..." : "ورود به پنل"}</button>
        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      </section>
    );
  }

  const available = selectedOrder ? nextStatuses[selectedOrder.order.status] : [];
  const history = selectedOrder?.statusHistory ?? [];

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-[#ded7c8] bg-[#fffdf8] p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div><p className="text-xs font-bold tracking-[0.18em] text-[#8a7041]">ADMIN CONSOLE</p><h1 className="mt-2 text-2xl font-black text-[#292b26]">مدیریت سفارش‌ها</h1><p className="mt-2 text-sm text-[#6d7168]">لیست زنده سفارش‌ها و مدیریت lifecycle دامنه.</p></div>
        <div className="flex gap-2"><button type="button" onClick={() => void loadOrders()} disabled={loading} className="min-h-11 rounded-full border border-[#d8d5ca] px-4 text-xs font-bold text-[#62685e] disabled:opacity-50">به‌روزرسانی</button><button type="button" onClick={() => void logout()} className="min-h-11 rounded-full border border-[#d8d5ca] px-4 text-xs font-bold text-[#62685e]">خروج</button></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#ded7c8] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجو با شناسه سفارش، مشتری یا گیرنده" className="min-h-12 flex-1 rounded-2xl border border-[#d8d5ca] px-4 outline-none focus:border-[#9a7b43]" dir="auto" />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "all")} className="min-h-12 rounded-2xl border border-[#d8d5ca] bg-white px-4">
                {allStatuses.map((status) => <option key={status} value={status}>{status === "all" ? "همه وضعیت‌ها" : labels[status]}</option>)}
              </select>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#858a81]"><span>{filteredOrders.length} سفارش</span><span>{orders.length} سفارش در سیستم</span></div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#ded7c8] bg-[#fffdf8] shadow-sm">
            {loading && orders.length === 0 ? <div className="p-10 text-center text-sm text-[#70756c]">در حال دریافت سفارش‌ها...</div> : filteredOrders.length === 0 ? <div className="p-10 text-center text-sm text-[#70756c]">سفارشی با این فیلتر پیدا نشد.</div> : <div className="divide-y divide-[#e7e2d7]">{filteredOrders.map((order) => <button key={order.orderId} type="button" onClick={() => { setOrderId(order.orderId); setSelectedStatus(""); setError(""); setMessage(""); void loadOrderById(order.orderId); }} className={`block w-full p-5 text-right transition hover:bg-[#f8f5ee] ${selectedOrder?.order.orderId === order.orderId ? "bg-[#f5f1e9]" : ""}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="break-all font-mono text-xs text-[#4d514a]" dir="ltr">{order.orderId}</p><p className="mt-2 text-sm font-bold">{order.address?.recipientName ?? "مشتری مهمان"}</p><p className="mt-1 text-xs text-[#858a81]">{formatDate(order.createdAt)} · {order.items.length} قلم</p></div><div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end"><span className="rounded-full bg-[#eee7d8] px-3 py-1.5 text-xs font-bold text-[#765728]">{labels[order.status]}</span><span className="text-sm font-black">{formatMoney(order.total)}</span></div></div></button>)}</div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[#ded7c8] bg-white p-5 shadow-sm sm:p-6">
            <label className="text-sm font-bold text-[#3d423b]" htmlFor="admin-order-id">دسترسی مستقیم به سفارش</label>
            <div className="mt-3 flex gap-3"><input id="admin-order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void loadOrder(); }} placeholder="UUID سفارش" className="min-h-11 min-w-0 flex-1 rounded-2xl border border-[#d8d5ca] px-4 text-sm outline-none focus:border-[#9a7b43]" dir="ltr" /><button type="button" onClick={() => void loadOrder()} disabled={loading} className="min-h-11 rounded-2xl bg-[#1f2d26] px-4 text-xs font-bold text-white disabled:opacity-50">باز کردن</button></div>
          </div>

          {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}

          {selectedOrder ? <article className="rounded-3xl border border-[#ded7c8] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[#e7e2d7] pb-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs text-[#858a81]">شناسه سفارش</p><p className="mt-1 break-all font-mono text-xs text-[#292b26]" dir="ltr">{selectedOrder.order.orderId}</p><p className="mt-2 text-xs text-[#858a81]">ثبت شده در {formatDate(selectedOrder.order.createdAt)}</p></div><span className="inline-flex w-fit rounded-full bg-[#eee7d8] px-4 py-2 text-xs font-bold text-[#765728]">{labels[selectedOrder.order.status]}</span></div>
            <div className="grid gap-4 py-5 sm:grid-cols-2"><div><p className="text-xs text-[#858a81]">مبلغ سفارش</p><p className="mt-1 font-black">{formatMoney(selectedOrder.order.total)}</p></div><div><p className="text-xs text-[#858a81]">قیمت طلای ۱۸</p><p className="mt-1 font-black">{formatMoney(selectedOrder.order.market.gold18Price)}</p></div></div>
            <div className="space-y-3">{selectedOrder.order.items.map((item, index) => <div key={`${item.name}-${index}`} className="rounded-2xl border border-[#e7e2d7] bg-white p-4"><div className="flex justify-between gap-4"><span className="font-bold">{item.name}</span><span className="text-sm">{formatMoney(item.lineTotal)}</span></div><p className="mt-2 text-xs text-[#70756c]">{item.quantity} عدد · {item.weightGrams} گرم · {formatMoney(item.unitPrice)}</p></div>)}</div>
            {selectedOrder.order.address && <div className="mt-5 rounded-2xl bg-[#f5f1e9] p-4 text-sm leading-7"><p className="font-bold">آدرس ارسال</p><p>{selectedOrder.order.address.recipientName} · {selectedOrder.order.address.phone}</p><p>{selectedOrder.order.address.city} · {selectedOrder.order.address.address}</p></div>}

            <div className="mt-5 border-t border-[#e7e2d7] pt-5">
              <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold">Timeline وضعیت سفارش</p><p className="mt-1 text-xs text-[#858a81]">تاریخچه واقعی ثبت‌شده در سمت سرور</p></div><span className="rounded-full bg-[#f5f1e9] px-3 py-1 text-xs font-bold text-[#765728]">{history.length} رویداد</span></div>
              <div className="mt-5 space-y-0">
                {history.length === 0 ? <p className="rounded-2xl border border-dashed border-[#d8d5ca] p-4 text-sm text-[#858a81]">برای این سفارش هنوز Timeline ثبت نشده است.</p> : history.map((entry, index) => <div key={`${entry.orderId}-${entry.changedAt}-${index}`} className="relative flex gap-4 pb-5 last:pb-0">
                  <div className="flex w-5 shrink-0 flex-col items-center"><span className="mt-1 h-3 w-3 rounded-full border-2 border-[#8a7041] bg-[#fffdf8]" />{index < history.length - 1 && <span className="mt-1 h-full w-px bg-[#d8d5ca]" />}</div>
                  <div className="min-w-0 flex-1 rounded-2xl border border-[#e7e2d7] bg-white p-4"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-bold">{entry.fromStatus ? `${labels[entry.fromStatus]} ← ${labels[entry.toStatus]}` : `ایجاد سفارش · ${labels[entry.toStatus]}`}</p><time className="text-xs text-[#858a81]">{formatDate(entry.changedAt)}</time></div>{entry.fromStatus && <p className="mt-2 text-xs text-[#70756c]">تغییر وضعیت ثبت‌شده: {labels[entry.fromStatus]} ← {labels[entry.toStatus]}</p>}</div>
                </div>)}
              </div>
            </div>

            <div className="mt-5 border-t border-[#e7e2d7] pt-5"><p className="text-sm font-bold">تغییر وضعیت</p>{available.length === 0 ? <p className="mt-3 text-sm text-[#858a81]">این سفارش در وضعیت نهایی قرار دارد و transition دیگری ندارد.</p> : <div className="mt-3 space-y-3"><select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as OrderStatus)} disabled={loading} className="min-h-12 w-full rounded-2xl border border-[#d8d5ca] bg-white px-4 disabled:opacity-50"><option value="">وضعیت جدید را انتخاب کنید</option>{available.map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select><button type="button" onClick={() => void updateStatus()} disabled={loading || !selectedStatus} className="min-h-12 w-full rounded-2xl bg-[#8a7041] px-6 text-sm font-bold text-white disabled:opacity-50">{loading ? "در حال ثبت وضعیت..." : "ثبت وضعیت جدید"}</button></div>}</div>
          </article> : <div className="rounded-3xl border border-dashed border-[#d8d5ca] bg-[#fffdf8] p-10 text-center text-sm leading-7 text-[#858a81]">برای مشاهده جزئیات، یک سفارش را از لیست انتخاب کنید.</div>}
        </div>
      </div>
    </section>
  );
}
