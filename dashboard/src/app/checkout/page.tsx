"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { PRODUCTS, formatToman, formatWeight } from "@/data/products";
import { getVariantLabel } from "@/data/productVariants";
import { calculateCurrentProductPrices, TELEGRAM_BOT_URL } from "@/lib/api";
import { CART_CHANGE_EVENT, getCartCount, readCart, type CartItem } from "@/lib/cart";

const PRICE_REFRESH_MS = 30_000;

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validatingOrder, setValidatingOrder] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const sync = () => {
      setCart(readCart());
      setSubmitted(false);
    };
    sync();
    window.addEventListener(CART_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const products = useMemo(() => cart.flatMap((item) => {
    const product = PRODUCTS.find((candidate) => candidate.id === item.productId);
    return product ? [{ item, product }] : [];
  }), [cart]);

  const refreshPrices = async () => {
    if (!products.length) {
      setPrices({});
      setLoadingPrices(false);
      setPriceError(false);
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
  };

  useEffect(() => {
    let cancelled = false;

    const loadPrices = async () => {
      if (cancelled) return;
      await refreshPrices();
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
  }, [products]);

  const count = getCartCount(cart);
  const total = products.reduce((sum, { item, product }) => sum + (prices[product.id] ?? 0) * item.quantity, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim() || !products.length || validatingOrder) return;

    setValidatingOrder(true);
    setSubmitted(false);

    try {
      const isFresh = await refreshPrices();
      if (!isFresh) return;
      setSubmitted(true);
    } finally {
      setValidatingOrder(false);
    }
  };

  const telegramMessage = useMemo(() => {
    const lines = [
      "سلام وارش گلد، می‌خواهم این سفارش را ثبت کنم:",
      ...products.map(({ item, product }) => `• ${product.name} | ${getVariantLabel(product, item.variantId)} | ${item.quantity} عدد | ${formatToman((prices[product.id] ?? 0) * item.quantity)}`),
      `جمع فعلی: ${formatToman(total)}`,
      `نام: ${name.trim()}`,
      `شماره تماس: ${phone.trim()}`,
      note.trim() ? `توضیحات: ${note.trim()}` : "",
    ].filter(Boolean);
    return `${TELEGRAM_BOT_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [name, note, phone, prices, products, total]);

  if (!products.length) {
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
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block"><span className="text-xs font-bold text-[#55584f]">نام و نام خانوادگی</span><input value={name} onChange={(event) => setName(event.target.value)} required className="mt-2 min-h-12 w-full rounded-2xl border border-[#ded8cc] bg-white px-4 text-sm outline-none transition focus:border-[#b28b4c]" placeholder="مثلاً علی رضایی" /></label>
              <label className="block"><span className="text-xs font-bold text-[#55584f]">شماره تماس</span><input value={phone} onChange={(event) => setPhone(event.target.value)} required inputMode="tel" className="mt-2 min-h-12 w-full rounded-2xl border border-[#ded8cc] bg-white px-4 text-sm outline-none transition focus:border-[#b28b4c]" placeholder="۰۹۱۲..." /></label>
            </div>
            <label className="mt-5 block"><span className="text-xs font-bold text-[#55584f]">توضیحات سفارش <span className="font-normal text-[#99978f]">(اختیاری)</span></span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={5} className="mt-2 w-full rounded-2xl border border-[#ded8cc] bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#b28b4c]" placeholder="مثلاً زمان مناسب برای تماس یا توضیح درباره مدل..." /></label>
            {priceError && <p className="mt-5 rounded-2xl bg-[#f8eee9] px-4 py-3 text-[11px] leading-6 text-[#94675f]">برای آماده‌سازی سفارش باید قیمت همه محصولات با نرخ جاری بازار با موفقیت دریافت شود.</p>}
            {!submitted ? <button type="submit" disabled={loadingPrices || validatingOrder || priceError || !total} className="mt-6 min-h-13 w-full rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(37,57,47,0.14)] transition hover:-translate-y-0.5 hover:bg-[#1d3028] disabled:cursor-not-allowed disabled:opacity-45">{validatingOrder ? "در حال بررسی نهایی قیمت..." : loadingPrices ? "در حال بررسی قیمت..." : "ادامه و آماده‌سازی سفارش"}</button> : <div className="mt-6 rounded-[1.5rem] border border-[#cddbcf] bg-[#edf4ee] p-5"><p className="text-sm font-extrabold text-[#35543e]">سفارش آماده ارسال است ✓</p><p className="mt-2 text-xs leading-6 text-[#58705f]">قیمت‌ها همین حالا دوباره از نرخ جاری بازار محاسبه شده‌اند. برای تأیید نهایی قیمت و هماهنگی خرید، سفارش را در تلگرام برای وارش ارسال کنید.</p><a href={telegramMessage} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white">ارسال سفارش در تلگرام</a></div>}
            <Link href="/cart" className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-5 py-3 text-xs font-bold text-[#62685e]">بازگشت و ویرایش سبد</Link>
          </form>

          <aside className="lg:sticky lg:top-28 rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(55,52,43,0.06)] sm:p-7"><p className="text-xs font-bold text-[#929188]">خلاصه سفارش</p><div className="mt-5 space-y-4">{products.map(({ item, product }) => <div key={`${item.productId}-${item.variantId}`} className="flex gap-3"><img src={product.image} alt="" className="h-16 w-14 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="text-xs font-extrabold leading-6">{product.name}</p><p className="text-[10px] text-[#88877f]">{getVariantLabel(product, item.variantId)} · {item.quantity} عدد · {formatWeight(product.weight)}</p><p className="mt-1 text-xs font-bold text-[#9b753c]">{prices[product.id] ? formatToman(prices[product.id] * item.quantity) : loadingPrices ? "در حال محاسبه" : "قیمت در دسترس نیست"}</p></div></div>)}</div><div className="mt-6 border-t border-[#e6e0d5] pt-5"><div className="flex items-center justify-between"><span className="text-sm text-[#777970]">جمع فعلی</span><strong className="text-lg text-[#9b753c]">{total && !priceError ? formatToman(total) : "—"}</strong></div><p className="mt-3 text-[11px] leading-6 text-[#88877f]">این مبلغ با نرخ جاری بازار محاسبه می‌شود و درست قبل از آماده‌سازی سفارش دوباره اعتبارسنجی خواهد شد.</p></div></aside>
        </div>
      </section>

      <footer className="bg-[#1f2d26] py-10 text-white"><div className="waresh-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-10 w-auto object-contain" /><p className="mt-3 text-xs text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div><Link href="/" className="text-sm text-white/65">بازگشت به فروشگاه</Link></div></footer>
    </main>
  );
}
