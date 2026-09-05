"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatToman,
  formatWeight,
  PRODUCTS,
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/data/products";
import { calculateProductPrices, TELEGRAM_BOT_URL } from "@/lib/api";

const priceBands = [
  { value: "under-10", label: "تا ۱۰ میلیون", min: 0, max: 10_000_000 },
  { value: "10-20", label: "۱۰ تا ۲۰ میلیون", min: 10_000_000, max: 20_000_000 },
  { value: "20-30", label: "۲۰ تا ۳۰ میلیون", min: 20_000_000, max: 30_000_000 },
  { value: "over-30", label: "بیشتر از ۳۰ میلیون", min: 30_000_000, max: Number.POSITIVE_INFINITY },
] as const;

type ProductCatalogProps = {
  initialPriceBand?: (typeof priceBands)[number]["value"] | "all";
  liveGoldPrice?: number;
};

type ProductPricing = {
  finalPrice: number;
};

type PricingState = {
  goldPrice: number;
  products: Record<number, ProductPricing>;
} | null;

const giftPriceBands: Record<string, string> = {
  "۳ تا ۱۰ میلیون": "under-10",
  "۱۰ تا ۲۰ میلیون": "10-20",
  "۲۰ تا ۳۰ میلیون": "20-30",
};

export default function ProductCatalog({ initialPriceBand = "all", liveGoldPrice }: ProductCatalogProps) {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [priceBand, setPriceBand] = useState<string>(initialPriceBand);
  const [pricing, setPricing] = useState<PricingState>(null);

  useEffect(() => {
    if (!liveGoldPrice || liveGoldPrice <= 0) return;
    let cancelled = false;
    void calculateProductPrices(PRODUCTS, liveGoldPrice).then((prices) => {
      if (cancelled) return;
      setPricing({
        goldPrice: liveGoldPrice,
        products: Object.fromEntries(
          Object.entries(prices).map(([id, finalPrice]) => [Number(id), { finalPrice }]),
        ),
      });
    });
    return () => { cancelled = true; };
  }, [liveGoldPrice]);

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
    const hasPricing = liveGoldPrice !== undefined && liveGoldPrice > 0;
    const currentPricing: Record<number, ProductPricing> = pricing && pricing.goldPrice === liveGoldPrice ? pricing.products : {};
    return PRODUCTS.map((product) => ({ product, pricing: currentPricing[product.id] ?? null })).filter(({ product, pricing: productPricing }) => {
      const categoryMatch = category === "all" || product.category === category;
      const priceMatch = !band || !hasPricing || !productPricing || (productPricing.finalPrice >= band.min && productPricing.finalPrice <= band.max);
      return categoryMatch && priceMatch;
    });
  }, [category, priceBand, pricing, liveGoldPrice]);

  const selectPriceBand = (value: string) => {
    setPriceBand(value);
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete("price");
    else url.searchParams.set("price", value);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const clearFilters = () => {
    setCategory("all");
    selectPriceBand("all");
  };

  const activeFilterCount = (category !== "all" ? 1 : 0) + (priceBand !== "all" ? 1 : 0);

  return (
    <div>
      <div className="mb-5 rounded-[1.75rem] border border-[#dcd8cd] bg-[#faf8f2]/70 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap gap-2" aria-label="دسته‌بندی محصولات">
            <button type="button" onClick={() => setCategory("all")} className={`min-h-11 rounded-full px-4 py-2 text-sm font-bold transition ${category === "all" ? "bg-[#25392f] text-white" : "bg-white/80 text-[#686c64] hover:bg-white"}`}>همه</button>
            {PRODUCT_CATEGORIES.map((item) => (
              <button key={item.value} type="button" onClick={() => setCategory(item.value)} className={`min-h-11 rounded-full px-4 py-2 text-sm font-bold transition ${category === item.value ? "bg-[#25392f] text-white" : "bg-white/80 text-[#686c64] hover:bg-white"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="product-price-band">فیلتر بازه قیمت</label>
            <select id="product-price-band" value={priceBand} onChange={(event) => selectPriceBand(event.target.value)} className="min-h-11 w-full min-w-0 rounded-full border border-[#d8d1c5] bg-[#fffdf8] px-4 py-2.5 text-sm font-semibold text-[#4f514a] outline-none transition focus:border-[#a47d3f] sm:w-52" aria-label="فیلتر بازه قیمت">
              <option value="all">بازه قیمت</option>
              {priceBands.map((band) => <option key={band.value} value={band.value}>{band.label}</option>)}
            </select>
            {activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="min-h-11 whitespace-nowrap rounded-full px-3 text-xs font-bold text-[#92713e] transition hover:bg-[#f2eadb] hover:text-[#6e522b]">پاک کردن فیلترها</button>}
          </div>
        </div>
      </div>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-[#878981]">
        <p>{products.length} محصول قابل انتخاب</p>
        {activeFilterCount > 0 && <p className="rounded-full bg-[#f2eadb] px-3 py-1.5 font-semibold text-[#92713e]">{activeFilterCount} فیلتر فعال</p>}
      </div>

      {products.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-[#cfc8bb] bg-[#faf7f0] px-6 py-16 text-center text-[#77776f]">
          <p className="font-bold text-[#5d6159]">محصولی در این محدوده پیدا نشد.</p>
          <button type="button" onClick={clearFilters} className="mt-4 min-h-11 rounded-full bg-[#263b31] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1c2e26]">نمایش همه محصولات</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map(({ product, pricing: productPricing }) => (
            <article key={product.id} className="group overflow-hidden rounded-[2rem] border border-[#e2ddd3] bg-[#fffdf8] shadow-[0_14px_45px_rgba(55,52,43,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(55,52,43,0.11)]">
              <div className="relative h-56 overflow-hidden bg-[#eee8dc] sm:h-64">
                <img src={product.image} alt={product.name} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.045]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,30,24,0.02)_45%,rgba(20,30,24,0.18)_100%)]" />
                <span className="absolute right-4 top-4 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[11px] font-bold text-[#746a5d] shadow-sm backdrop-blur sm:right-5 sm:top-5">{product.subcategory ?? product.category}</span>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold tracking-[0.12em] text-[#a17c45]">{product.category}</p>
                <h3 className="mt-2 text-lg font-extrabold text-[#292c27]">{product.name}</h3>
                <p className="mt-2 text-sm leading-7 text-[#7b7d76]">{product.description}</p>
                <div className="mt-5 border-t border-[#ebe6dc] pt-4 sm:mt-6 sm:pt-5">
                  <div className="flex items-end justify-between gap-4">
                    <div><p className="text-xs text-[#96968d]">وزن</p><p className="mt-1 text-sm font-bold text-[#55584f]">{formatWeight(product.weight)}</p></div>
                    {productPricing ? <p className="text-base font-extrabold text-[#9b753c] sm:text-lg">{formatToman(productPricing.finalPrice)}</p> : <p className="text-sm font-bold text-[#9b753c]">قیمت در حال دریافت…</p>}
                  </div>
                  {productPricing && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#8b8b82]"><span>اجرت {product.laborPercent}٪</span><span>سود {product.profitPercent}٪</span>{product.taxPercent > 0 && <span>مالیات {product.taxPercent}٪</span>}</div>}
                </div>
                <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-11 w-full items-center justify-center rounded-full border border-[#d9c69f] bg-[#fbf6ea] px-4 py-3 text-sm font-bold text-[#7e6030] transition hover:-translate-y-0.5 hover:bg-[#f5ecd9]">مشاوره و سفارش</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
