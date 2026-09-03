import Image from "next/image";
import Link from "next/link";
import { getGoldBubble, getMarketPrice } from "@/lib/api";
import MarketStatus from "@/components/MarketStatus";
import GoldBubbleCard from "@/components/GoldBubbleCard";
import GoldCalculator from "@/components/GoldCalculator";
import MobileMenu from "@/components/MobileMenu";

export const dynamic = "force-dynamic";

const formatToman = (value: number) => new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value);

const toolLinks = [
  ["قیمت بازار", "#prices", "قیمت ۱۸ عیار، دلار و انس"],
  ["محاسبه‌گر", "#calculator", "محاسبه قیمت نهایی"],
  ["حباب طلا", "#bubble", "فاصله بازار و ارزش ذاتی"],
] as const;

export default async function ToolsPage() {
  const [marketResult, bubbleResult] = await Promise.allSettled([getMarketPrice(), getGoldBubble()]);
  const market = marketResult.status === "fulfilled" ? marketResult.value : null;
  const bubble = bubbleResult.status === "fulfilled" ? bubbleResult.value : null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-4 sm:gap-5">
          <Link href="/" aria-label="وارش گلد" className="shrink-0">
            <Image src="/waresh-gold-logo-green.png" alt="وارش گلد" width={180} height={48} className="h-11 w-auto object-contain sm:h-12" priority />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex" aria-label="ناوبری اصلی">
            <Link className="waresh-link" href="/#products">محصولات</Link>
            <Link className="waresh-link" href="/#gifts">هدیه</Link>
            <Link className="waresh-link" href="/#prices">قیمت امروز</Link>
            <Link className="waresh-link" href="/tools">ابزار طلا</Link>
            <Link className="waresh-link" href="/about">درباره وارش</Link>
          </nav>
          <div className="flex items-center gap-2">
            <a href={"https://t.me/Wareshgoldbot"} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center rounded-full bg-[#b28b4c] px-5 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#9d773d] sm:inline-flex">گفتگو در تلگرام</a>
            <MobileMenu />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#23372d] py-16 text-white sm:py-28">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden="true" />
        <div className="waresh-container relative">
          <p className="text-xs font-bold tracking-[0.24em] text-[#d7bf8b]">WARESH GOLD TOOLS</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.45] sm:mt-5 sm:text-7xl sm:leading-[1.4]">ابزارهای طلا،<span className="block text-[#d8bd7e]">ساده و دقیق.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#d8e0d9] sm:mt-7 sm:text-lg sm:leading-9">قیمت بازار، محاسبه‌گر طلا و تحلیل حباب؛ ابزارهایی که محاسبات را به هسته اصلی وارش می‌سپارند.</p>
        </div>
      </section>

      <nav className="sticky top-[76px] z-40 border-b border-[#dfe1d7] bg-[#f8f6ef]/95 backdrop-blur" aria-label="دسترسی سریع ابزارها">
        <div className="waresh-container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {toolLinks.map(([label, href, description]) => <a key={href} href={href} title={description} className="shrink-0 rounded-full border border-[#d9d5ca] bg-white/70 px-4 py-2.5 text-xs font-bold text-[#5d625a] transition hover:border-[#c9b681] hover:bg-[#fffdf8] hover:text-[#84632e]">{label}</a>)}
        </div>
      </nav>

      <section id="prices" className="scroll-mt-32 bg-[#e9eee7] py-16 sm:py-28">
        <div className="waresh-container">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold tracking-[0.2em] text-[#9b7843]">MARKET / LIVE</p><h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">نبض بازار</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[#70776e] sm:mt-4 sm:text-base sm:leading-8">آخرین داده‌های بازار را یک‌جا ببین؛ بدون اینکه از ابزارهای محاسباتی جدا شوی.</p></div>
            {market && <MarketStatus updatedAt={market.updatedAt} />}
          </div>
          {market ? <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-[1.7rem] bg-[#23372d] p-5 text-white sm:rounded-[2rem] sm:p-7"><p className="text-xs text-white/55">طلای ۱۸ عیار</p><p className="mt-3 text-2xl font-extrabold sm:text-3xl">{formatToman(market.gold18Price)}</p><p className="mt-1 text-xs text-[#d8bd7e]">تومان / گرم</p></div><div className="rounded-[1.7rem] bg-[#faf8f2] p-5 sm:rounded-[2rem] sm:p-7"><p className="text-xs text-[#858a83]">دلار تهران</p><p className="mt-3 text-xl font-extrabold sm:text-2xl">{formatToman(market.currencyPrice)}</p></div><div className="rounded-[1.7rem] bg-[#faf8f2] p-5 sm:rounded-[2rem] sm:p-7"><p className="text-xs text-[#858a83]">انس جهانی</p><p className="mt-3 text-xl font-extrabold sm:text-2xl">{Number(market.ouncePrice).toLocaleString("en-US")}</p><p className="mt-1 text-xs text-[#9b753c]">دلار</p></div><div className="rounded-[1.7rem] bg-[#faf8f2] p-5 sm:rounded-[2rem] sm:p-7"><p className="text-xs text-[#858a83]">وضعیت</p><p className="mt-3 text-xl font-extrabold text-[#698260] sm:text-2xl">آنلاین</p></div></div> : <div className="mt-8 rounded-[1.7rem] bg-[#faf8f2] p-8 text-center text-sm text-[#70776e] sm:mt-10 sm:rounded-[2rem] sm:p-10">قیمت لحظه‌ای فعلاً در دسترس نیست.</div>}
        </div>
      </section>

      <section id="calculator" className="scroll-mt-32 bg-[#f8f6ef] py-20 sm:py-32">
        <div className="waresh-container grid gap-9 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-40"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">PRECISION / CALCULATOR</p><h2 className="mt-4 text-3xl font-extrabold leading-[1.5] sm:mt-5 sm:text-5xl">محاسبه‌گر طلا</h2><p className="mt-4 text-sm leading-8 text-[#70766d] sm:mt-5 sm:text-base sm:leading-9">وزن، اجرت، سود، مالیات و تخفیف را وارد کن. محاسبه در سرویس اصلی طلا انجام می‌شود.</p><div className="mt-6 rounded-2xl border border-[#ded8cc] bg-[#fffdf8] p-4 text-sm leading-7 text-[#77776f] sm:mt-7 sm:p-5"><p className="font-bold text-[#4f554d]">نکته</p><p className="mt-1">قیمت هر گرم را می‌توانی با قیمت لحظه‌ای بازار هماهنگ کنی و سپس جزئیات فاکتور را وارد کنی.</p></div></div>
          <div className="rounded-[2rem] border border-[#dfe3d9] bg-white/80 p-2 shadow-[0_30px_90px_rgba(48,63,51,0.08)] sm:rounded-[2.5rem] sm:p-8"><GoldCalculator liveGoldPrice={market?.gold18Price} /></div>
        </div>
      </section>

      {bubble && <section id="bubble" className="scroll-mt-32 bg-[#f5f1e9] py-20 sm:py-32"><div className="waresh-container"><div className="mb-8 max-w-2xl sm:mb-10"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">MARKET / BUBBLE</p><h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">تحلیل حباب طلا</h2><p className="mt-3 text-sm leading-7 text-[#70776e] sm:mt-4 sm:text-base sm:leading-8">فاصله قیمت بازار با ارزش ذاتی را ببین.</p></div><div className="rounded-[2rem] bg-[#e8eee6] p-2 sm:rounded-[2.75rem] sm:p-5"><GoldBubbleCard marketPrice={bubble.marketPrice} intrinsicPrice={bubble.intrinsicPrice} bubbleAmount={bubble.bubbleAmount} bubblePercentage={bubble.bubblePercentage} /></div></div></section>}

      <footer className="bg-[#1f2d26] py-10 text-white sm:py-12"><div className="waresh-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><Image src="/waresh-gold-logo-white.jpg" alt="وارش گلد" width={180} height={44} className="h-10 w-auto object-contain sm:h-11" /><p className="mt-3 max-w-sm text-xs leading-6 text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65"><Link href="/">فروشگاه</Link><Link href="/tools">ابزار طلا</Link><Link href="/about">درباره وارش</Link><a href={"https://t.me/Wareshgoldbot"} target="_blank" rel="noopener noreferrer">تلگرام</a></div></div></footer>
    </main>
  );
}
