"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatToman,
  formatWeight,
  PRODUCTS,
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/data/products";

const priceBands = [
  { value: "under-10", label: "تا ۱۰ میلیون", min: 0, max: 10_000_000 },
  { value: "10-20", label: "۱۰ تا ۲۰ میلیون", min: 10_000_000, max: 20_000_000 },
  { value: "20-30", label: "۲۰ تا ۳۰ میلیون", min: 20_000_000, max: 30_000_000 },
  { value: "over-30", label: "بیشتر از ۳۰ میلیون", min: 30_000_000, max: Number.POSITIVE_INFINITY },
] as const;

export type ProductPriceBand = (typeof priceBands)[number]["value"];

type ProductCatalogProps = {
  initialPriceBand?: ProductPriceBand | "all";
};

const giftPriceBands: Record<string, string> = {
  "۳ تا ۱۰ میلیون": "under-10",
  "۱۰ تا ۲۰ میلیون": "10-20",
  "۲۰ تا ۳۰ میلیون": "20-30",
};

export default function ProductCatalog({ initialPriceBand = "all" }: ProductCatalogProps) {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [priceBand, setPriceBand] = useState<string>(initialPriceBand);

  useEffect(() => {
    const syncFromUrl = () => {
      const value = new URLSearchParams(window.location.search).get("price") ?? "all";
      setPriceBand(value);
    };

    const handleGiftRangeClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href="#products"]');
      if (!link) return;

      const range = Object.keys(giftPriceBands).find((item) => link.textContent?.includes(item));
      if (!range) return;

      event.preventDefault();
      const value = giftPriceBands[range];
      setPriceBand(value);

      const url = new URL(window.location.href);
      url.searchParams.set("price", value);
      window.history.replaceState(null, "", `${url.pathname}${url.search}#products`);
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    syncFromUrl();
    document.addEventListener("click", handleGiftRangeClick);
    window.addEventListener("popstate", syncFromUrl);

    return () => {
      document.removeEventListener("click", handleGiftRangeClick);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  const products = useMemo(() => {
    const band = priceBands.find((item) => item.value === priceBand);
    return PRODUCTS.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const priceMatch = !band || (product.price >= band.min && product.price <= band.max);
      return categoryMatch && priceMatch;
    });
  }, [category, priceBand]);

  const selectPriceBand = (value: string) => {
    setPriceBand(value);
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete("price");
    else url.searchParams.set("price", value);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 border-y border-[#dcd8cd] py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setCategory("all")} className={`rounded-full px-4 py-2 text-sm font-bold transition ${category === "all" ? "bg-[#25392f] text-white" : "bg-white/70 text-[#686c64] hover:bg-white"}`}>همه</button>
          {PRODUCT_CATEGORIES.map((item) => (
            <button key={item.value} type="button" onClick={() => setCategory(item.value)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${category === item.value ? "bg-[#25392f] text-white" : "bg-white/70 text-[#686c64] hover:bg-white"}`}>
              {item.label}
            </button>
          ))}
        </div>
        <select value={priceBand} onChange={(event) => selectPriceBand(event.target.value)} className="min-w-48 border border-[#d8d1c5] bg-[#fffdf8] px-4 py-2.5 text-sm font-semibold text-[#4f514a] outline-none focus:border-[#a47d3f]" aria-label="فیلتر بازه قیمت">
          <option value="all">بازه قیمت</option>
          {priceBands.map((band) => <option key={band.value} value={band.value}>{band.label}</option>)}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="border border-dashed border-[#cfc8bb] bg-[#faf7f0] px-6 py-16 text-center text-[#77776f]">محصولی در این محدوده پیدا نشد.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="group overflow-hidden rounded-[2rem] border border-[#e2ddd3] bg-[#fffdf8] shadow-[0_14px_45px_rgba(55,52,43,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(55,52,43,0.11)]">
              <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,#f3ead5_0%,#e8e3d8_48%,#d6ddd3_100%)]">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.5),transparent_45%,rgba(38,57,47,0.08))]" />
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#b28b4c]/35 bg-[#f8f3e7]/70 text-7xl text-[#a47d3f] shadow-[0_20px_50px_rgba(80,68,43,0.12)] transition duration-700 group-hover:scale-105 group-hover:rotate-3">{product.icon}</div>
                <span className="absolute right-5 top-5 rounded-full border border-white/70 bg-white/65 px-3 py-1 text-[11px] font-bold text-[#746a5d] backdrop-blur">{product.subcategory ?? product.category}</span>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-[0.12em] text-[#a17c45]">{product.category}</p>
                <h3 className="mt-2 text-lg font-extrabold text-[#292c27]">{product.name}</h3>
                <p className="mt-2 text-sm leading-7 text-[#7b7d76]">{product.description}</p>
                <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#ebe6dc] pt-5">
                  <div><p className="text-xs text-[#96968d]">وزن</p><p className="mt-1 text-sm font-bold text-[#55584f]">{formatWeight(product.weight)}</p></div>
                  <p className="text-lg font-extrabold text-[#9b753c]">{formatToman(product.price)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
