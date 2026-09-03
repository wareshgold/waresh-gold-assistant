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
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/90 backdrop-blur-xl">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-5">
          <a href="/" aria-label="وارش گلد"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-12 w-auto object-contain" /></a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex"><a className="waresh-link" href="/">فروشگاه</a><a className="waresh-link" href="/about">درباره وارش</a></nav>
          <div className="flex items-center gap-2">
            <a href="/#products" className="hidden rounded-full bg-[#263b31] px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1c2e26] sm:inline-flex">مشاهده محصولات</a>
            <MobileMenu />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#23372d] py-20 text-white sm:py-28">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden="true" />
        <div className="waresh-container relative">
          <p className="text-xs font-bold tracking-[0.24em] text-[#d7bf8b]">WARESH GOLD TOOLS</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-extrabold leading-[1.4] sm:text-7xl">ابزارهای طلا،<span className="block text-[#d8bd7e]">ساده و دقیق.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-9 text-[#d8e0d9]">قیمت بازار، محاسبه‌گر طلا و تحلیل حباب؛ ابزارهایی که محاسبات را به هسته اصلی وارش می‌سپارند.</p>
        </div>
      </section>

      <nav className="sticky top-[76px] z-40 border-b border-[#dfe1d7] bg-[#f8f6ef]/95 backdrop-blur" aria-label="دسترسی سریع ابزارها">
        <div className="waresh-container flex gap-2 overflow-x-auto py-3">
          {toolLinks.map(([label, href, description]) => <a key={href} href={href} title={description} className="shrink-0 rounded-full border border-[#d9d5ca] bg-white/70 px-4 py-2.5 text-xs font-bold text-[#5d625a] transition hover:border-[#c9b681] hover:bg-[#fffdf8] hover:text-[#84632e]">{label}</a>)}
        </div>
      </nav>

      <section id="prices" className="scroll-mt-32 bg-[#e9eee7] py-20 sm:py-28">
        <div className="waresh-container">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold tracking-[0.2em] text-[#9b7843]">MARKET / LIVE</p><h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">نبض بازار</h2><p className="mt-4 max-w-xl leading-8 text-[#70776e]">آخرین داده‌های بازار را یک‌جا ببین؛ بدون اینکه از ابزارهای محاسباتی جدا شوی.</p></div>
            {market && <MarketStatus updatedAt={market.updatedAt} />}
          </div>
          {market ? <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-[2rem] bg-[#23372d] p-7 text-white"><p className="text-xs text-white/55">طلای ۱۸ عیار</p><p className="mt-3 text-3xl font-extrabold">{formatToman(market.gold18Price)}</p><p className="mt-1 text-xs text-[#d8bd7e]">تومان / گرم</p></div><div className="rounded-[2rem] bg-[#faf8f2] p-7"><p className="text-xs text-[#858a83]">دلار تهران</p><p className="mt-3 text-2xl font-extrabold">{formatToman(market.currencyPrice)}</p></div><div className="rounded-[2rem] bg-[#faf8f2] p-7"><p className="text-xs text-[#858a83]">انس جهانی</p><p className="mt-3 text-2xl font-extrabold">{Number(market.ouncePrice).toLocaleString("en-US")}</p><p className="mt-1 text-xs text-[#9b753c]">دلار</p></div><div className="rounded-[2rem] bg-[#faf8f2] p-7"><p className="text-xs text-[#858a83]">وضعیت</p><p className="mt-3 text-2xl font-extrabold text-[#698260]">آنلاین</p></div></div> : <div className="mt-10 rounded-[2rem] bg-[#faf8f2] p-10 text-center text-[#70776e]">قیمت لحظه‌ای فعلاً در دسترس نیست.</div>}
        </div>
      </section>

      <section id="calculator" className="scroll-mt-32 bg-[#f8f6ef] py-24 sm:py-32">
        <div className="waresh-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-40"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">PRECISION / CALCULATOR</p><h2 className="mt-5 text-4xl font-extrabold leading-[1.5] sm:text-5xl">محاسبه‌گر طلا</h2><p className="mt-5 leading-9 text-[#70766d]">وزن، اجرت، سود، مالیات و تخفیف را وارد کن. محاسبه در سرویس اصلی طلا انجام می‌شود.</p><div className="mt-7 rounded-2xl border border-[#ded8cc] bg-[#fffdf8] p-5 text-sm leading-7 text-[#77776f]"><p className="font-bold text-[#4f554d]">نکته</p><p className="mt-1">قیمت هر گرم را می‌توانی با قیمت لحظه‌ای بازار هماهنگ کنی و سپس جزئیات فاکتور را وارد کنی.</p></div></div>
          <div className="rounded-[2.5rem] border border-[#dfe3d9] bg-white/80 p-5 shadow-[0_30px_90px_rgba(48,63,51,0.08)] sm:p-8"><GoldCalculator liveGoldPrice={market?.gold18Price} /></div>
        </div>
      </section>

      {bubble && <section id="bubble" className="scroll-mt-32 bg-[#f5f1e9] py-24 sm:py-32"><div className="waresh-container"><div className="mb-10 max-w-2xl"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">MARKET / BUBBLE</p><h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">تحلیل حباب طلا</h2><p className="mt-4 leading-8 text-[#70776e]">فاصله قیمت بازار با ارزش ذاتی را ببین.</p></div><div className="rounded-[2.75rem] bg-[#e8eee6] p-3 sm:p-5"><GoldBubbleCard marketPrice={bubble.marketPrice} intrinsicPrice={bubble.intrinsicPrice} bubbleAmount={bubble.bubbleAmount} bubblePercentage={bubble.bubblePercentage} /></div></div></section>}

      <footer className="bg-[#1f2d26] py-12 text-white"><div className="waresh-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-11 w-auto object-contain" /><div className="flex gap-6 text-sm text-white/65"><a href="/">فروشگاه</a><a href="/tools">ابزار طلا</a><a href="/about">درباره وارش</a></div></div></footer>
    </main>
  );
}
