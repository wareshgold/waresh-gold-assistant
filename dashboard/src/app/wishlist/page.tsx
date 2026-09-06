"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import WishlistButton from "@/components/WishlistButton";
import { PRODUCTS, formatWeight } from "@/data/products";

const STORAGE_KEY = "waresh-wishlist";

function readWishlist(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => Number.isInteger(value));
  } catch {
    return [];
  }
}

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    const sync = () => setWishlistIds(readWishlist());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("waresh:wishlist-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("waresh:wishlist-change", sync);
    };
  }, []);

  const products = useMemo(
    () => wishlistIds.map((id) => PRODUCTS.find((product) => product.id === id)).filter((product) => product !== undefined),
    [wishlistIds],
  );

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
          <p className="mt-4 text-sm leading-8 text-[#70766d] sm:text-base">محصولاتی که برای مقایسه یا خرید بعدی نگه داشته‌اید، اینجا در دسترس هستند.</p>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[#cfc8bb] bg-[#faf7f0] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2eadb] text-2xl text-[#9b753c]">♡</div>
            <h2 className="mt-5 text-xl font-extrabold text-[#4f554d]">هنوز محصولی ذخیره نکرده‌اید</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#88877f]">از روی کارت محصولات یا صفحه محصول، روی قلب بزنید تا محصول اینجا ذخیره شود.</p>
            <Link href="/#products" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#25392f] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1d3028]">مشاهده محصولات</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="group overflow-hidden rounded-[2rem] border border-[#e0dbd1] bg-[#fffdf8] shadow-[0_14px_45px_rgba(55,52,43,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(55,52,43,0.1)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eee8dc]">
                  <Link href={`/products/${product.id}`} className="block h-full w-full" aria-label={`مشاهده ${product.name}`}>
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" referrerPolicy="no-referrer" />
                  </Link>
                  <div className="absolute left-4 top-4"><WishlistButton productId={product.id} size="sm" /></div>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[11px] font-bold text-[#a17c45]">{product.subcategory ?? product.category}</p>
                  <Link href={`/products/${product.id}`}><h2 className="mt-2 text-lg font-extrabold leading-7 text-[#292c27]">{product.name}</h2></Link>
                  <p className="mt-2 text-xs text-[#85857c]">{formatWeight(product.weight)}</p>
                  <Link href={`/products/${product.id}`} className="mt-5 flex min-h-11 items-center justify-center rounded-full bg-[#25392f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1d3028]">مشاهده محصول ←</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#1f2d26] py-10 text-white"><div className="waresh-container"><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-10 w-auto object-contain" /><p className="mt-3 text-xs text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div></footer>
    </main>
  );
}
