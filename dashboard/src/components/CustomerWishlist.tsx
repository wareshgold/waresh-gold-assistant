"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type WishlistProduct = {
  productId: string;
  name: string;
  sku: string;
  weightGrams: number;
  laborPercent: number;
  profitPercent: number;
  taxPercent: number;
  stockStatus: "in-stock" | "limited" | "out-of-stock";
};

type WishlistItem = { productId: string; product: WishlistProduct };

const stockLabel: Record<WishlistProduct["stockStatus"], string> = {
  "in-stock": "موجود",
  limited: "موجودی محدود",
  "out-of-stock": "ناموجود",
};

export default function CustomerWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/account/wishlist", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "دریافت علاقه‌مندی‌ها انجام نشد.");
      setItems(Array.isArray(payload.items) ? payload.items : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "دریافت علاقه‌مندی‌ها انجام نشد.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function remove(productId: string) {
    setError("");
    try {
      const response = await fetch(`/api/account/wishlist/${encodeURIComponent(productId)}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "حذف انجام نشد.");
      setItems((current) => current.filter((item) => item.productId !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف از علاقه‌مندی‌ها انجام نشد.");
    }
  }

  return (
    <section className="mt-8 rounded-[28px] border border-[#ded8ca] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="wishlist-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-[#a27a32]">SAVED ITEMS</p>
          <h2 id="wishlist-title" className="mt-2 text-xl font-black text-[#292b26]">علاقه‌مندی‌ها</h2>
          <p className="mt-2 text-sm text-[#77786f]">محصولات ذخیره‌شده‌ات اینجا می‌مانند؛ قیمت همیشه از نرخ روز محاسبه می‌شود.</p>
        </div>
        <span className="rounded-full bg-[#f6f1e7] px-3 py-1 text-xs font-bold text-[#765728]">{items.length} محصول</span>
      </div>

      {error && <p className="mt-4 rounded-2xl bg-[#fff1ed] px-4 py-3 text-sm font-semibold text-[#9c3d28]">{error}</p>}
      {loading ? <p className="mt-6 text-sm text-[#77786f]">در حال دریافت علاقه‌مندی‌ها…</p> : items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d8d0c2] px-5 py-8 text-center">
          <p className="font-bold text-[#45483f]">هنوز محصولی ذخیره نکرده‌ای.</p>
          <Link href="/#products" className="mt-4 inline-flex min-h-10 items-center rounded-full bg-[#263b30] px-5 text-xs font-bold text-white">مشاهده محصولات</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map(({ product }) => (
            <article key={product.productId} className="rounded-2xl border border-[#e4ded2] bg-[#fcfaf6] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/product/${product.productId}`} className="font-black text-[#292b26] hover:underline">{product.name}</Link>
                  <p className="mt-1 text-xs text-[#85867d]">{product.weightGrams} گرم · {stockLabel[product.stockStatus]}</p>
                </div>
                <button type="button" onClick={() => void remove(product.productId)} className="rounded-full border border-[#decfc0] px-3 py-1.5 text-xs font-bold text-[#8b4939]">حذف</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
