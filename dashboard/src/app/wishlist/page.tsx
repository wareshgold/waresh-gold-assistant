"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import WishlistButton from "@/components/WishlistButton";

type Product = {
  productId: string;
  name: string;
  weightGrams: number;
  stockStatus: "in-stock" | "limited" | "out-of-stock";
};

type WishlistItem = { productId: string; product: Product };

const stockLabel: Record<Product["stockStatus"], string> = {
  "in-stock": "موجود",
  limited: "موجودی محدود",
  "out-of-stock": "ناموجود",
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/account/wishlist", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (response.status === 401) {
          window.location.href = `/account?returnTo=${encodeURIComponent(window.location.pathname)}`;
          return null;
        }
        if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "دریافت علاقه‌مندی‌ها انجام نشد.");
        return payload as { items?: WishlistItem[] };
      })
      .then((payload) => {
        if (!cancelled && payload) setItems(Array.isArray(payload.items) ? payload.items : []);
      })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "دریافت علاقه‌مندی‌ها انجام نشد."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleActiveChange = useCallback((productId: string, active: boolean) => {
    if (!active) {
      setItems((current) => current.filter((item) => item.productId !== productId));
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-4">
          <Link href="/" aria-label="وارش گلد" className="shrink-0"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto object-contain sm:h-12" /></Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex" aria-label="ناوبری اصلی">
            <Link className="waresh-link" href="/#products">محصولات</Link>
            <Link className="waresh-link" href="/#prices">قیمت امروز</Link>
            <Link className="waresh-link" href="/tools">ابزار طلا</Link>
            <Link className="waresh-link" href="/about">درباره وارش</Link>
          </nav>
          <MobileMenu />
        </div>
      </header>

      <section className="waresh-container py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">WISHLIST</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">علاقه‌مندی‌های من</h1>
          <p className="mt-4 text-sm leading-8 text-[#70766d] sm:text-base">محصولات ذخیره‌شده‌ات اینجا می‌مانند؛ قیمت همیشه از نرخ روز محاسبه می‌شود.</p>
        </div>

        {error && <div className="mt-8 rounded-2xl bg-[#fff1ed] px-4 py-3 text-sm font-semibold text-[#9c3d28]">{error}</div>}
        {loading ? <div className="mt-10 rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] px-6 py-16 text-center text-sm text-[#77786f]">در حال دریافت علاقه‌مندی‌ها…</div> : items.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[#cfc8bb] bg-[#faf7f0] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2eadb] text-2xl text-[#9b753c]">♡</div>
            <h2 className="mt-5 text-xl font-extrabold text-[#4f554d]">هنوز محصولی ذخیره نکرده‌اید</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#88877f]">از روی کارت محصولات یا صفحه محصول، روی قلب بزنید تا محصول اینجا ذخیره شود.</p>
            <Link href="/#products" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#25392f] px-6 py-3 text-sm font-bold text-white">مشاهده محصولات</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ product }) => (
              <article key={product.productId} className="rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] p-5 shadow-[0_14px_45px_rgba(55,52,43,0.06)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/products/${product.productId}`} className="text-lg font-extrabold text-[#292c27] hover:underline">{product.name}</Link>
                    <p className="mt-2 text-xs text-[#85857c]">{product.weightGrams} گرم · {stockLabel[product.stockStatus]}</p>
                  </div>
                  <WishlistButton
                    productId={product.productId}
                    size="sm"
                    onActiveChange={(active) => handleActiveChange(product.productId, active)}
                  />
                </div>
                <Link href={`/products/${product.productId}`} className="mt-5 flex min-h-11 items-center justify-center rounded-full bg-[#25392f] px-4 py-3 text-sm font-bold text-white">مشاهده محصول ←</Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#1f2d26] py-10 text-white"><div className="waresh-container"><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-10 w-auto object-contain" /><p className="mt-3 text-xs text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div></footer>
    </main>
  );
}
