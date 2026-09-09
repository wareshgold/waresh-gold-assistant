import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MobileMenu from "@/components/MobileMenu";
import WishlistButton from "@/components/WishlistButton";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import { calculateProductPrice, getMarketPrice, TELEGRAM_BOT_URL } from "@/lib/api";
import { formatToman, formatWeight } from "@/data/products";
import { getProductServer, getProductsServer, getStaticProduct } from "@/lib/products";
import type { Product } from "@/data/products";

export const dynamic = "force-dynamic";

type ProductPageProps = { params: Promise<{ id: string }> };

async function resolveProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProductServer(id);
    if (product) return product;
  } catch {
    // Keep the existing static catalog as a migration-safe fallback.
  }

  return getStaticProduct(id);
}

async function resolveProducts(): Promise<Product[]> {
  try {
    return await getProductsServer();
  } catch {
    return getStaticProducts();
  }
}

function getStaticProducts(): Product[] {
  return Array.from({ length: 0 });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await resolveProduct(id);
  if (!product) return { title: "محصول پیدا نشد | وارش گلد" };
  return { title: `${product.name} | وارش گلد`, description: product.description, alternates: { canonical: `/products/${product.id}` }, openGraph: { title: product.name, description: product.description, images: [product.image], type: "website", locale: "fa_IR" } };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await resolveProduct(id);
  if (!product) notFound();

  const marketResult = await getMarketPrice().then((value) => ({ ok: true as const, value })).catch(() => ({ ok: false as const, value: null }));
  const market = marketResult.ok ? marketResult.value : null;
  const price = market ? await calculateProductPrice(product, market.gold18Price).catch(() => null) : null;
  const allProducts = await resolveProducts();
  const relatedProducts = allProducts.filter((item) => item.id !== product.id && (item.category === product.category || item.subcategory === product.subcategory)).slice(0, 4);
  const gallery = product.images?.length ? product.images : [product.image];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl"><div className="waresh-container flex h-[76px] items-center justify-between gap-4 sm:gap-5"><Link href="/" aria-label="وارش گلد" className="shrink-0"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto object-contain sm:h-12" /></Link><nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex" aria-label="ناوبری اصلی"><Link className="waresh-link" href="/#products">محصولات</Link><Link className="waresh-link" href="/#gifts">هدیه</Link><Link className="waresh-link" href="/#prices">قیمت امروز</Link><Link className="waresh-link" href="/tools">ابزار طلا</Link><Link className="waresh-link" href="/about">درباره وارش</Link></nav><div className="flex items-center gap-2"><Link href="/cart" className="hidden min-h-11 items-center rounded-full border border-[#d9c69e] bg-[#fffaf0] px-4 text-xs font-bold text-[#765728] sm:inline-flex">سبد خرید</Link><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center rounded-full bg-[#b28b4c] px-5 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#9d773d] sm:inline-flex">مشاوره و سفارش</a><MobileMenu /></div></div></header>
      <div className="border-b border-[#e2ddd3] bg-[#faf8f2]"><div className="waresh-container flex min-h-12 items-center gap-2 text-xs text-[#8a897f]"><Link href="/" className="transition hover:text-[#84632e]">فروشگاه</Link><span>/</span><Link href="/#products" className="transition hover:text-[#84632e]">محصولات</Link><span>/</span><span className="truncate font-semibold text-[#575b53]">{product.name}</span></div></div>

      <section className="waresh-container py-8 sm:py-12 lg:py-16"><div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-12"><div className="grid gap-3 sm:grid-cols-[96px_1fr] sm:gap-4"><div className="order-2 grid grid-cols-2 gap-3 sm:order-1 sm:grid-cols-1">{gallery.map((image, index) => <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.25rem] border border-[#e0dbd1] bg-[#eee8dc]"><img src={image} alt={index === 0 ? product.name : `${product.name} نمای نزدیک`} className="aspect-square h-full w-full object-cover" loading={index === 0 ? "eager" : "lazy"} referrerPolicy="no-referrer" /></div>)}</div><div className="order-1 overflow-hidden rounded-[2rem] border border-[#e0dbd1] bg-[#eee8dc] shadow-[0_24px_70px_rgba(55,52,43,0.08)] sm:order-2 sm:rounded-[2.5rem]"><img src={product.image} alt={product.name} className="aspect-[4/5] h-full w-full object-cover" referrerPolicy="no-referrer" /></div></div>

        <div className="lg:sticky lg:top-28"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e8eee6] px-3 py-1.5 text-[11px] font-bold text-[#5f755f]">{product.category}</span>{product.subcategory && <span className="rounded-full bg-[#f2eadb] px-3 py-1.5 text-[11px] font-bold text-[#84632e]">{product.subcategory}</span>}</div><div className="mt-5 flex items-start justify-between gap-4"><h1 className="text-3xl font-extrabold leading-[1.45] tracking-tight sm:text-5xl">{product.name}</h1><WishlistButton productId={product.id} /></div><p className="mt-4 max-w-xl text-sm leading-8 text-[#70766d] sm:text-base">{product.description}</p>

          <div className="mt-7 rounded-[1.75rem] border border-[#ded8cc] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(55,52,43,0.06)] sm:p-6"><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-semibold text-[#929188]">قیمت نهایی</p><p className="mt-2 text-2xl font-extrabold text-[#9b753c] sm:text-3xl">{price !== null ? formatToman(price) : "در حال دریافت قیمت"}</p></div><div className="text-left" dir="rtl"><p className="text-[10px] text-[#a09d94]">مبنای بازار</p><p className="mt-1 text-sm font-bold text-[#55584f]">{market ? formatToman(market.gold18Price) : "—"}</p><p className="mt-1 text-[10px] text-[#a09d94]">هر گرم طلای ۱۸ عیار</p></div></div><div className="mt-5 grid grid-cols-2 gap-2 text-xs"><div className="rounded-2xl bg-[#f5f1e9] p-3"><span className="text-[#8c8b83]">وزن</span><strong className="mr-2 text-[#4f554d]">{formatWeight(product.weight)}</strong></div><div className="rounded-2xl bg-[#f5f1e9] p-3"><span className="text-[#8c8b83]">اجرت</span><strong className="mr-2 text-[#4f554d]">{product.laborPercent}٪</strong></div><div className="rounded-2xl bg-[#f5f1e9] p-3"><span className="text-[#8c8b83]">سود</span><strong className="mr-2 text-[#4f554d]">{product.profitPercent}٪</strong></div><div className="rounded-2xl bg-[#f5f1e9] p-3"><span className="text-[#8c8b83]">مالیات</span><strong className="mr-2 text-[#4f554d]">{product.taxPercent}٪</strong></div></div><p className="mt-4 text-[11px] leading-6 text-[#88877f]">قیمت بر اساس نرخ لحظه‌ای بازار و پارامترهای این محصول از سرویس محاسباتی وارش محاسبه می‌شود.</p><ProductPurchasePanel product={product} /><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(37,57,47,0.16)] transition hover:-translate-y-0.5 hover:bg-[#1d3028]">مشاوره و سفارش در تلگرام</a></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">{[["ارسال", product.shippingNote],["اصالت", "فاکتور و اطلاعات شفاف محصول"],["پشتیبانی", "مشاوره قبل از خرید"]].map(([title, text]) => <div key={title} className="rounded-2xl border border-[#e0dbd1] bg-white/60 p-4"><p className="text-xs font-bold text-[#55584f]">{title}</p><p className="mt-1 text-[11px] leading-5 text-[#88877f]">{text}</p></div>)}</div>
        </div></div></section>

      <section className="border-y border-[#e1ddd3] bg-[#faf8f2] py-14 sm:py-20"><div className="waresh-container"><div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">PRODUCT DETAILS</p><h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">جزئیات محصول</h2><p className="mt-4 text-sm leading-8 text-[#70766d]">برای تصمیم‌گیری مطمئن، مشخصات اصلی محصول و منطق قیمت‌گذاری در یک نگاه در دسترس است.</p></div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["دسته‌بندی", product.category],["زیرگروه", product.subcategory ?? "—"],["وزن", formatWeight(product.weight)],["مبنای قیمت", "طلای ۱۸ عیار + اجرت + سود + مالیات"]].map(([label, value]) => <div key={label} className="rounded-[1.5rem] border border-[#e1ddd3] bg-white p-5"><p className="text-xs text-[#929188]">{label}</p><p className="mt-2 text-sm font-extrabold leading-7 text-[#4e534c]">{value}</p></div>)}</div></div></section>

      {relatedProducts.length > 0 && <section className="bg-[#f5f1e9] py-16 sm:py-24"><div className="waresh-container"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">YOU MAY ALSO LIKE</p><h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">انتخاب‌های مشابه</h2></div><Link href="/#products" className="text-sm font-bold text-[#896633]">همه محصولات ←</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((item) => <Link key={item.id} href={`/products/${item.id}`} className="group overflow-hidden rounded-[1.75rem] border border-[#e0dbd1] bg-[#fffdf8] transition hover:-translate-y-1 hover:border-[#d4c39e] hover:shadow-[0_20px_50px_rgba(55,52,43,0.08)]"><div className="aspect-[4/3] overflow-hidden bg-[#eee8dc]"><img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" referrerPolicy="no-referrer" /></div><div className="p-5"><p className="text-[11px] font-bold text-[#a17c45]">{item.subcategory ?? item.category}</p><h3 className="mt-2 text-base font-extrabold leading-7">{item.name}</h3><p className="mt-2 text-xs text-[#85857c]">{formatWeight(item.weight)}</p></div></Link>)}</div></div></section>}

      <footer className="bg-[#1f2d26] py-10 text-white sm:py-12"><div className="waresh-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-10 w-auto object-contain sm:h-11" /><p className="mt-3 max-w-sm text-xs leading-6 text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65"><Link href="/">فروشگاه</Link><Link href="/tools">ابزار طلا</Link><Link href="/about">درباره وارش</Link><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">تلگرام</a></div></div></footer>
    </main>
  );
}
