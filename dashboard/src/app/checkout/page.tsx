"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { formatToman, formatWeight, type Product } from "@/data/products";
import { getVariantLabel } from "@/data/productVariants";
import { calculateCurrentProductPrices, TELEGRAM_BOT_URL } from "@/lib/api";
import { CART_CHANGE_EVENT, getCartCount, readCart, type CartItem } from "@/lib/cart";
import { getProducts } from "@/lib/products";
import type { CustomerAddress } from "@/lib/customerAccount";

type CheckoutQuote = {
  quoteId: string;
  createdAt: string;
  market: { gold18Price: number; currencyPrice: number; ouncePrice: number | null; updatedAt: string };
  items: Array<{
    productId: string;
    variantId: string;
    sku: string;
    name: string;
    quantity: number;
    weightGrams: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  total: number;
};

type CheckoutOrder = {
  orderId: string;
  quoteId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  market: CheckoutQuote["market"];
  items: CheckoutQuote["items"];
  total: number;
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

type CustomerApi = {
  customerId: string;
  phone: string;
  firstName: string;
  lastName: string;
  addresses?: CustomerAddress[];
};

const PRICE_REFRESH_MS = 30_000;

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(false);
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validatingOrder, setValidatingOrder] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [orderError, setOrderError] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [customer, setCustomer] = useState<CustomerApi | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAccount, setLoadingAccount] = useState(true);

  useEffect(() => {
    const sync = () => {
      setCart(readCart());
      setSubmitted(false);
      setQuote(null);
      setOrder(null);
      setOrderError(false);
    };
    sync();
    window.addEventListener(CART_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setLoadingProducts(true);
      setProductError(false);
      try {
        const products = await getProducts();
        if (cancelled) return;
        setCatalogProducts(products);
      } catch {
        if (cancelled) return;
        setCatalogProducts([]);
        setProductError(true);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };
    void loadProducts();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadAccount = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json().catch(() => null) as { customer?: CustomerApi } | null;
        if (cancelled) return;
        if (response.ok && data?.customer) {
          setCustomer(data.customer);
          const addresses = data.customer.addresses ?? [];
          setSelectedAddressId((current) => current || addresses.find((address) => address.isDefault)?.id || addresses[0]?.id || "");
          setName((current) => current || `${data.customer?.firstName ?? ""} ${data.customer?.lastName ?? ""}`.trim());
          setPhone((current) => current || data.customer?.phone || "");
        } else {
          setCustomer(null);
          setSelectedAddressId("");
        }
      } finally {
        if (!cancelled) setLoadingAccount(false);
      }
    };
    void loadAccount();
    return () => { cancelled = true; };
  }, []);

  const products = useMemo(() => cart.flatMap((item) => {
    const product = catalogProducts.find((candidate) => candidate.id === item.productId);
    return product ? [{ item, product }] : [];
  }), [cart, catalogProducts]);

  const refreshPrices = useCallback(async () => {
    if (!products.length) {
      setPrices({});
      setLoadingPrices(false);
      setPriceError(productError && cart.length > 0);
      return false;
    }
    setLoadingPrices(true);
    setPriceError(false);
    try {
      const result = await calculateCurrentProductPrices(products.map(({ product }) => product));
      setPrices(result);
      const complete = Object.keys(result).length === products.length;
      setPriceError(!complete);
      return complete;
    } catch {
      setPrices({});
      setPriceError(true);
      return false;
    } finally {
      setLoadingPrices(false);
    }
  }, [cart.length, productError, products]);

  useEffect(() => {
    let cancelled = false;
    const loadPrices = async () => {
      if (!cancelled && !loadingProducts) await refreshPrices();
    };
    void loadPrices();
    const interval = window.setInterval(loadPrices, PRICE_REFRESH_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void loadPrices();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadingProducts, refreshPrices]);

  const count = getCartCount(cart);
  const total = products.reduce((sum, { item, product }) => sum + (prices[product.id] ?? 0) * item.quantity, 0);
  const addresses = customer?.addresses ?? [];
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;
  const missingProducts = cart.length > 0 && products.length !== cart.length;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !products.length || validatingOrder || missingProducts) return;
    setValidatingOrder(true);
    setSubmitted(false);
    setQuote(null);
    setOrder(null);
    setOrderError(false);
    try {
      const isFresh = await refreshPrices();
      if (!isFresh) return;
      const response = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ items: cart.map((item) => ({ productId: String(item.productId), variantId: item.variantId, quantity: item.quantity })) }),
      });
      const data = await response.json().catch(() => null) as { quote?: CheckoutQuote; error?: string } | null;
      if (!response.ok || !data?.quote) { setPriceError(true); return; }
      const quoteResponse = await fetch(`/api/checkout/quote?quoteId=${encodeURIComponent(data.quote.quoteId)}`, { method: "GET", cache: "no-store" });
      const quoteData = await quoteResponse.json().catch(() => null) as { quote?: CheckoutQuote; error?: string } | null;
      if (!quoteResponse.ok || !quoteData?.quote) { setPriceError(true); return; }
      setQuote(quoteData.quote);
      setSubmitted(true);
    } finally {
      setValidatingOrder(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!quote || creatingOrder) return;
    if (customer && !selectedAddressId) {
      setOrderError(true);
      return;
    }
    setCreatingOrder(true);
    setOrderError(false);
    try {
      const response = await fetch("/api/orders/from-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ quoteId: quote.quoteId, ...(selectedAddressId ? { addressId: selectedAddressId } : {}) }),
      });
      const data = await response.json().catch(() => null) as { order?: CheckoutOrder; error?: string } | null;
      if (!response.ok || !data?.order) {
        setOrderError(true);
        return;
      }
      setOrder(data.order);
      router.replace(`/order/${encodeURIComponent(data.order.orderId)}`);
    } catch {
      setOrderError(true);
    } finally {
      setCreatingOrder(false);
    }
  };

  const telegramMessage = useMemo(() => {
    if (!quote) return "#";
    const lines = [
      "سلام وارش گلد، می‌خواهم این سفارش را ثبت کنم:",
      order ? `شناسه سفارش: ${order.orderId}` : `شناسه پیش‌فاکتور: ${quote.quoteId}`,
      ...quote.items.map((item) => {
        const product = catalogProducts.find((candidate) => String(candidate.id) === item.productId);
        const variantLabel = product ? getVariantLabel(product, item.variantId) : item.variantId;
        return `• ${item.name} | ${variantLabel} | ${item.quantity} عدد | ${formatToman(item.lineTotal)}`;
      }),
      `جمع نهایی پیش‌فاکتور: ${formatToman(quote.total)}`,
      `نرخ طلای ۱۸ عیار در زمان صدور: ${formatToman(quote.market.gold18Price)}`,
      `زمان صدور: ${new Date(quote.createdAt).toLocaleString("fa-IR")}`,
      `نام: ${name.trim()}`,
      `شماره تماس: ${phone.trim()}`,
      order?.address ? `آدرس ارسال: ${order.address.province}، ${order.address.city}، ${order.address.address} | گیرنده: ${order.address.recipientName} | ${order.address.phone}` : selectedAddress ? `آدرس ارسال: ${selectedAddress.province}، ${selectedAddress.city}، ${selectedAddress.address} | گیرنده: ${selectedAddress.recipientName} | ${selectedAddress.phone}` : "",
      note.trim() ? `توضیحات: ${note.trim()}` : "",
    ].filter(Boolean);
    return `${TELEGRAM_BOT_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [catalogProducts, name, note, order, phone, quote, selectedAddress]);

  if (!cart.length) {
    return (
      <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
        <header className="border-b border-[#dedfd7]/80 bg-[#faf8f2]"><div className="waresh-container flex h-[76px] items-center justify-between"><Link href="/" aria-label="وارش گلد"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto" /></Link><MobileMenu /></div></header>
        <section className="waresh-container py-16 text-center sm:py-24"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">CHECKOUT</p><h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">سبد خرید خالی است</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-8 text-[#70766d]">برای ثبت سفارش ابتدا یک محصول به سبد خرید اضافه کنید.</p><Link href="/#products" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#25392f] px-6 text-sm font-bold text-white">مشاهده محصولات</Link></section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl"><div className="waresh-container flex h-[76px] items-center justify-between gap-4"><Link href="/" aria-label="وارش گلد"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto" /></Link><nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex"><Link className="waresh-link" href="/#products">محصولات</Link><Link className="waresh-link" href="/tools">ابزار طلا</Link><Link className="waresh-link" href="/about">درباره وارش</Link></nav><div className="flex items-center gap-2"><Link href="/cart" className="inline-flex min-h-11 items-center rounded-full border border-[#d9c69e] bg-[#fffaf0] px-4 text-xs font-bold text-[#765728]">سبد خرید ({count})</Link><MobileMenu /></div></div></header>
      <section className="waresh-container py-10 sm:py-16">
        <div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">CHECKOUT</p><h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">ثبت سفارش</h1><p className="mt-4 text-sm leading-8 text-[#70766d]">قیمت طلا لحظه‌ای است. اطلاعات سفارش را وارد کنید تا برای تأیید نهایی و هماهنگی، سفارش را در تلگرام وارش ارسال کنیم.</p></div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-7">
            {loadingAccount ? <div className="mb-5 rounded-2xl bg-[#f5f1e9] p-4 text-xs text-[#777970]">در حال بررسی حساب کاربری و آدرس‌های ذخیره‌شده...</div> : customer ? <section className="mb-5 rounded-[1.5rem] border border-[#ded8cc] bg-white p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold tracking-[0.14em] text-[#9b7b48]">DELIVERY ADDRESS</p><p className="mt-2 text-sm font-extrabold">آدرس ارسال</p></div><Link href="/account" className="text-[11px] font-bold text-[#765728]">مدیریت آدرس‌ها</Link></div>{addresses.length ? <div className="mt-4 space-y-2">{addresses.map((address) => <label key={address.id} className={`block cursor-pointer rounded-2xl border p-4 transition ${selectedAddressId === address.id ? "border-[#b28b4c] bg-[#fffaf0]" : "border-[#e3ddd2] bg-[#fffdf8]"}`}><span className="flex items-start gap-3"><input type="radio" name="delivery-address" value={address.id} checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} className="mt-1" /><span className="min-w-0"><span className="block text-xs font-extrabold">{address.title} · {address.recipientName}</span><span className="mt-1 block text-[11px] leading-6 text-[#777970]">{address.province}، {address.city}، {address.address}</span><span className="mt-1 block text-[10px] text-[#99978f]">کد پستی: <span dir="ltr">{address.postalCode}</span> · <span dir="ltr">{address.phone}</span></span></span></span></label>)}</div> : <div className="mt-4 rounded-2xl bg-[#f8eee9] p-4 text-xs leading-6 text-[#94675f]">برای حساب کاربری شما هنوز آدرسی ثبت نشده است. ابتدا از بخش «مدیریت آدرس‌ها» یک آدرس اضافه کنید.</div>}</section> : <div className="mb-5 rounded-2xl bg-[#f5f1e9] p-4 text-xs leading-6 text-[#777970]">به‌صورت مهمان ادامه می‌دهید. برای ذخیره و انتخاب آدرس ارسال، <Link href="/account" className="font-bold text-[#765728]">وارد حساب کاربری شوید</Link>.</div>}
            <div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="text-xs font-bold text-[#55584f]">نام و نام خانوادگی</span><input value={name} onChange={(event) => setName(event.target.value)} required className="mt-2 min-h-12 w-full rounded-2xl border border-[#ded8cc] bg-white px-4 text-sm outline-none transition focus:border-[#b28b4c]" placeholder="مثلاً علی رضایی" /></label><label className="block"><span className="text-xs font-bold text-[#55584f]">شماره تماس</span><input value={phone} onChange={(event) => setPhone(event.target.value)} required inputMode="tel" className="mt-2 min-h-12 w-full rounded-2xl border border-[#ded8cc] bg-white px-4 text-sm outline-none transition focus:border-[#b28b4c]" placeholder="۰۹۱۲..." /></label></div>
            <label className="mt-5 block"><span className="text-xs font-bold text-[#55584f]">توضیحات سفارش <span className="font-normal text-[#99978f]">(اختیاری)</span></span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={5} className="mt-2 w-full rounded-2xl border border-[#ded8cc] bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#b28b4c]" placeholder="مثلاً زمان مناسب برای تماس یا توضیح درباره مدل..." /></label>
            {(priceError || productError || missingProducts) && <p className="mt-5 rounded-2xl bg-[#f8eee9] px-4 py-3 text-[11px] leading-6 text-[#94675f]">{productError || missingProducts ? "اطلاعات یکی از محصولات سبد خرید در کاتالوگ فعلی در دسترس نیست. لطفاً سبد خرید را بررسی و دوباره تلاش کنید." : "برای آماده‌سازی سفارش باید قیمت همه محصولات با نرخ جاری بازار با موفقیت دریافت شود."}</p>}
            {orderError && <p className="mt-5 rounded-2xl bg-[#f8eee9] px-4 py-3 text-[11px] leading-6 text-[#94675f]">{customer && !selectedAddressId ? "برای ثبت سفارش حساب کاربری، انتخاب آدرس ارسال الزامی است." : "ثبت سفارش انجام نشد. پیش‌فاکتور شما حفظ شده است؛ دوباره تلاش کنید."}</p>}
            {!submitted ? <button type="submit" disabled={loadingProducts || loadingPrices || validatingOrder || priceError || productError || missingProducts || !total} className="mt-6 min-h-13 w-full rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(37,57,47,0.14)] transition hover:-translate-y-0.5 hover:bg-[#1d3028] disabled:cursor-not-allowed disabled:opacity-45">{validatingOrder ? "در حال بررسی نهایی قیمت..." : loadingProducts ? "در حال بررسی محصولات..." : loadingPrices ? "در حال بررسی قیمت..." : "ادامه و آماده‌سازی سفارش"}</button> : <div className="mt-6 rounded-[1.5rem] border border-[#cddbcf] bg-[#edf4ee] p-5"><p className="text-sm font-extrabold text-[#35543e]">پیش‌فاکتور آماده است ✓</p><p className="mt-2 text-xs leading-6 text-[#58705f]">پیش‌فاکتور در سرور ذخیره شده و قیمت آن بر اساس نرخ بازار در لحظه صدور ثابت شده است.</p>{!order ? <><button type="button" onClick={() => void handleCreateOrder()} disabled={creatingOrder || (!!customer && !selectedAddressId)} className="mt-4 flex min-h-12 w-full items-center justify-center rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">{creatingOrder ? "در حال ثبت سفارش..." : customer && !selectedAddressId ? "ابتدا آدرس ارسال را انتخاب کنید" : "ثبت سفارش"}</button><p className="mt-3 text-center text-[10px] leading-5 text-[#708076]">با ثبت سفارش، همین پیش‌فاکتور به یک سفارش با وضعیت «در انتظار تأیید» تبدیل می‌شود.</p></> : <div className="mt-4 rounded-2xl border border-[#cddbcf] bg-white/70 p-4"><p className="text-xs font-extrabold text-[#35543e]">سفارش با موفقیت ثبت شد ✓</p><p className="mt-2 text-[11px] leading-6 text-[#58705f]">شناسه سفارش: <span dir="ltr" className="font-bold">{order.orderId}</span></p><p className="text-[11px] leading-6 text-[#58705f]">وضعیت: در انتظار تأیید</p>{order.address && <p className="mt-2 text-[11px] leading-6 text-[#58705f]">آدرس: {order.address.title} · {order.address.province}، {order.address.city}</p>}</div>}{order && <a href={telegramMessage} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white">ارسال جزئیات در تلگرام</a>}</div>}
            <Link href="/cart" className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-5 py-3 text-xs font-bold text-[#62685e]">بازگشت و ویرایش سبد</Link>
          </form>
          <aside className="lg:sticky lg:top-28 rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(55,52,43,0.06)] sm:p-7"><p className="text-xs font-bold text-[#929188]">خلاصه سفارش</p><div className="mt-5 space-y-4">{products.map(({ item, product }) => <div key={`${item.productId}-${item.variantId}`} className="flex gap-3"><img src={product.image} alt="" className="h-16 w-14 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="text-xs font-extrabold leading-6">{product.name}</p><p className="text-[10px] text-[#88877f]">{getVariantLabel(product, item.variantId)} · {item.quantity} عدد · {formatWeight(product.weight)}</p><p className="mt-1 text-xs font-bold text-[#9b753c]">{prices[product.id] ? formatToman(prices[product.id] * item.quantity) : loadingPrices ? "در حال محاسبه" : "قیمت در دسترس نیست"}</p></div></div>)}</div><div className="mt-6 border-t border-[#e6e0d5] pt-5"><div className="flex items-center justify-between"><span className="text-sm text-[#777970]">جمع فعلی</span><strong className="text-lg text-[#9b753c]">{total && !priceError ? formatToman(total) : "—"}</strong></div><p className="mt-3 text-[11px] leading-6 text-[#88877f]">این مبلغ برای نمایش فعلی است. هنگام ادامه فرایند، سرور محصول و نرخ بازار را دوباره بررسی و پیش‌فاکتور مستقل صادر می‌کند.</p></div></aside>
        </div>
      </section>
      <footer className="bg-[#1f2d26] py-10 text-white"><div className="waresh-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-10 w-auto object-contain" /><p className="mt-3 text-xs text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div><Link href="/" className="text-sm text-white/65">بازگشت به فروشگاه</Link></div></footer>
    </main>
  );
}
