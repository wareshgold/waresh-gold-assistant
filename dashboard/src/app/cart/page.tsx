"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { formatToman, formatWeight, type Product } from "@/data/products";
import { getVariantLabel } from "@/data/productVariants";
import { calculateCurrentProductPrices } from "@/lib/api";
import { getProducts } from "@/lib/products";
import { CART_CHANGE_EVENT, getCartCount, readCart, removeFromCart, updateCartQuantity, writeCart, type CartItem } from "@/lib/cart";

const PRICE_REFRESH_MS = 30_000;

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(false);
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState(false);

  useEffect(() => {
    const sync = () => setCart(readCart());
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
    async function loadProducts() {
      setLoadingProducts(true);
      setProductError(false);
      try {
        const result = await getProducts();
        if (!cancelled) setCatalogProducts(result);
      } catch {
        if (!cancelled) {
          setCatalogProducts([]);
          setProductError(true);
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    }
    void loadProducts();
    return () => { cancelled = true; };
  }, []);

  const products = useMemo(() => cart.flatMap((item) => {
    const product = catalogProducts.find((candidate) => candidate.id === item.productId);
    return product ? [{ item, product }] : [];
  }), [cart, catalogProducts]);

  useEffect(() => {
    let cancelled = false;
    async function loadPrices() {
      if (!products.length) {
        setPrices({});
        setLoadingPrices(!loadingProducts);
        setPriceError(false);
        return;
      }
      setLoadingPrices(true);
      setPriceError(false);
      try {
        const result = await calculateCurrentProductPrices(products.map(({ product }) => product));
        if (!cancelled) {
          setPrices(result);
          setPriceError(Object.keys(result).length !== products.length);
        }
      } catch {
        if (!cancelled) {
          setPrices({});
          setPriceError(true);
        }
      } finally {
        if (!cancelled) setLoadingPrices(false);
      }
    }
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
  }, [products, loadingProducts]);

  const missingCartItems = !loadingProducts && !productError && cart.length !== products.length;
  const total = products.reduce((sum, { item, product }) => sum + (prices[product.id] ?? 0) * item.quantity, 0);
  const count = getCartCount(cart);

  useEffect(() => {
    if (!missingCartItems) return;
    const validKeys = new Set(products.map(({ item }) => `${item.productId}:${item.variantId}`));
    const cleanedCart = cart.filter((item) => validKeys.has(`${item.productId}:${item.variantId}`));
    if (cleanedCart.length !== cart.length) {
      const timer = window.setTimeout(() => setCart(writeCart(cleanedCart)), 0);
      return () => window.clearTimeout(timer);
    }
  }, [cart, missingCartItems, products]);

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-4">
          <Link href="/" aria-label="وارش گلد" className="shrink-0"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto object-contain" /></Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex" aria-label="ناوبری اصلی">
            <Link className="waresh-link" href="/#products">محصولات</Link><Link className="waresh-link" href="/#gifts">هدیه</Link><Link className="waresh-link" href="/#prices">قیمت امروز</Link><Link className="waresh-link" href="/tools">ابزار طلا</Link><Link className="waresh-link" href="/about">درباره وارش</Link>
          </nav>
          <div className="flex items-center gap-2"><Link href="/cart" className="inline-flex min-h-11 items-center rounded-full border border-[#d9c69e] bg-[#fffaf0] px-4 text-xs font-bold text-[#765728]">سبد خرید {count > 0 ? `(${count})` : ""}</Link><MobileMenu /></div>
        </div>
      </header>

      <section className="waresh-container py-10 sm:py-16">
        <div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">YOUR CART</p><h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">سبد خرید</h1><p className="mt-4 text-sm leading-8 text-[#70766d]">محصولات انتخابی شما اینجا نگه‌داری می‌شوند. قیمت‌ها بر اساس نرخ جاری بازار محاسبه می‌شوند.</p></div>
        {loadingProducts ? (
          <div className="mt-10 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><h2 className="text-xl font-extrabold">در حال بررسی سبد خرید</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#85857c]">در حال دریافت آخرین اطلاعات محصولات از کاتالوگ وارش هستیم.</p></div>
        ) : !products.length ? (
          <div className="mt-10 rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-8 text-center sm:p-14"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2eadb] text-2xl text-[#9b753c]">🛒</div><h2 className="mt-5 text-xl font-extrabold">{productError ? "دریافت محصولات ناموفق بود" : "سبد خرید شما خالی است"}</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#85857c]">{productError ? "کاتالوگ محصولات در حال حاضر در دسترس نیست. لطفاً دوباره تلاش کنید." : "از بین محصولات وارش یک انتخاب بردارید و بعد به سبد خرید برگردید."}</p><Link href="/#products" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#25392f] px-6 py-2.5 text-sm font-bold text-white">مشاهده محصولات</Link></div>
        ) : (
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="space-y-3">
              {products.map(({ item, product }) => <article key={`${item.productId}-${item.variantId}`} className="flex gap-4 rounded-[1.5rem] border border-[#e0dbd1] bg-[#fffdf8] p-4 sm:p-5"><Link href={`/products/${product.id}`} className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#eee8dc] sm:h-28 sm:w-24"><img src={product.image} alt={product.name} className="h-full w-full object-cover" /></Link><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold text-[#a17c45]">{getVariantLabel(product, item.variantId)}</p><Link href={`/products/${product.id}`} className="mt-1 block text-sm font-extrabold leading-7 hover:text-[#8b6732]">{product.name}</Link><p className="mt-1 text-xs text-[#85857c]">{formatWeight(product.weight)}</p></div><button type="button" onClick={() => setCart(removeFromCart(item.productId, item.variantId))} className="text-xs font-bold text-[#9a6258]">حذف</button></div><div className="mt-3 flex items-center justify-between gap-3"><div className="flex items-center rounded-full border border-[#ded8cc] bg-white"><button type="button" onClick={() => setCart(updateCartQuantity(item.productId, item.variantId, item.quantity - 1))} className="h-9 w-9 text-sm">−</button><span className="min-w-8 text-center text-xs font-bold">{item.quantity}</span><button type="button" onClick={() => setCart(updateCartQuantity(item.productId, item.variantId, item.quantity + 1))} className="h-9 w-9 text-sm">+</button></div><p className="text-sm font-extrabold text-[#9b753c]">{prices[product.id] ? formatToman(prices[product.id] * item.quantity) : loadingPrices ? "در حال محاسبه" : "قیمت در دسترس نیست"}</p></div></div></article>)}
            </div>
            <aside className="lg:sticky lg:top-28 rounded-[1.75rem] border border-[#ded8cc] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(55,52,43,0.06)] sm:p-6"><p className="text-xs font-bold text-[#929188]">خلاصه سفارش</p><div className="mt-5 flex items-center justify-between text-sm"><span className="text-[#777970]">تعداد</span><strong>{count} عدد</strong></div><div className="mt-3 flex items-center justify-between text-sm"><span className="text-[#777970]">جمع فعلی</span><strong className="text-[#9b753c]">{total > 0 ? formatToman(total) : "—"}</strong></div>{(priceError || productError) && <p className="mt-4 rounded-2xl bg-[#f8eee9] px-3 py-2 text-[11px] leading-6 text-[#94675f]">اطلاعات کامل قیمت یا محصول در دسترس نیست؛ برای ثبت سفارش باید اطلاعات دوباره دریافت شود.</p>}<div className="mt-5 border-t border-[#e6e0d5] pt-5 text-[11px] leading-6 text-[#88877f]">قیمت نهایی هنگام ادامه فرایند خرید دوباره با نرخ بازار بررسی خواهد شد.</div><Link href={total > 0 && !priceError && !productError ? "/checkout" : "#"} aria-disabled={total <= 0 || priceError || productError} onClick={(event) => { if (total <= 0 || priceError || productError) event.preventDefault(); }} className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(55,52,43,0.14)] transition hover:-translate-y-0.5 hover:bg-[#1d3028] aria-disabled:pointer-events-none aria-disabled:opacity-45">ادامه و ثبت سفارش</Link><Link href="/#products" className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-[#ded8cc] bg-white px-5 text-xs font-bold text-[#62685e]">بازگشت به محصولات</Link></aside>
          </div>
        )}
      </section>

      <footer className="bg-[#1f2d26] py-10 text-white"><div className="waresh-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-10 w-auto object-contain" /><p className="mt-3 text-xs text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div><div className="text-sm text-white/65"><Link href="/">فروشگاه</Link></div></div></footer>
    </main>
  );
}
