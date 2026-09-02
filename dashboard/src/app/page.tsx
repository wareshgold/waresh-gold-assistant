import { getGoldBubble, getMarketPrice, TELEGRAM_BOT_URL } from "@/lib/api";
import PriceCard from "@/components/PriceCard";
import MarketStatus from "@/components/MarketStatus";
import GoldBubbleCard from "@/components/GoldBubbleCard";
import GoldCalculator from "@/components/GoldCalculator";

export const dynamic = "force-dynamic";

const formatToman = (value: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value);

const tools = [
  ["۰۱", "قیمت لحظه‌ای", "طلا، دلار و انس جهانی را یک‌جا ببین."],
  ["۰۲", "محاسبه‌گر طلا", "اجرت، سود، مالیات و تخفیف را دقیق حساب کن."],
  ["۰۳", "فاکتور و معامله", "برای خرید و فروش، محاسبات روشن و قابل اعتماد."],
  ["۰۴", "تحلیل حباب", "فاصله قیمت بازار با ارزش ذاتی را بررسی کن."],
  ["۰۵", "دستیار هوشمند", "سوالات بازار طلا را به فارسی بپرس."],
  ["۰۶", "هشدار قیمت", "برای قیمت‌های مهمت در تلگرام هشدار بگیر."],
];

export default async function Home() {
  let market = null;
  let bubble = null;

  try {
    market = await getMarketPrice();
  } catch {
    market = null;
  }

  try {
    bubble = await getGoldBubble();
  } catch {
    bubble = null;
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec]">
      <div className="border-b border-[#e8e0d4] bg-[#fffdf9]">
        <div className="waresh-container flex min-h-10 items-center justify-between gap-4 text-xs text-[#766f66]">
          <span>قیمت هر گرم طلای ۱۸ عیار</span>
          <span className="font-bold text-[#87672e]">
            {market ? `${formatToman(market.gold18Price)} تومان` : "در حال دریافت قیمت…"}
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#e8e0d4]/90 bg-[#fffdf9]/95 backdrop-blur-md">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-6">
          <a href="#top" className="shrink-0 text-center leading-none">
            <span className="block text-[11px] font-medium tracking-[0.35em] text-[#a08350]">WARESH</span>
            <span className="mt-1 block text-xl font-extrabold tracking-tight text-[#24211d]">وارش گلد</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#5f584f] lg:flex">
            <a className="transition hover:text-[#a27b3e]" href="#prices">قیمت‌ها</a>
            <a className="transition hover:text-[#a27b3e]" href="#calculator">محاسبه‌گر</a>
            <a className="transition hover:text-[#a27b3e]" href="#tools">ابزارها</a>
            <a className="transition hover:text-[#a27b3e]" href="#bubble">حباب بازار</a>
          </nav>

          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#b08a45] bg-[#b08a45] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#967238]"
          >
            گفتگو در تلگرام
          </a>
        </div>
      </header>

      <section id="top" className="overflow-hidden bg-[#fffdf9]">
        <div className="waresh-container grid min-h-[610px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="text-right">
            <p className="waresh-section-label text-xs font-semibold text-[#a08350]">GOLD BUSINESS PLATFORM</p>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.45] tracking-tight text-[#24211d] sm:text-6xl">
              بازار طلا را
              <span className="block text-[#a27b3e]">دقیق‌تر ببین.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#766f66] sm:text-lg">
              وارش گلد، مجموعه‌ای از ابزارهای حرفه‌ای برای قیمت، محاسبه و تحلیل بازار طلا؛
              ساده، شفاف و همیشه در دسترس.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center bg-[#b08a45] px-8 py-4 text-base font-bold text-white transition hover:bg-[#967238]"
              >
                محاسبه قیمت طلا
              </a>
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-[#d6cbbb] bg-[#fffdf9] px-8 py-4 text-base font-bold text-[#3d3831] transition hover:border-[#b08a45] hover:text-[#87672e]"
              >
                دستیار تلگرام
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute -inset-8 rounded-full bg-[#d6bd8b]/20 blur-3xl" />
            <div className="relative border border-[#e5dac9] bg-[#f5efe5] p-7 shadow-[0_25px_80px_rgba(75,55,25,0.10)] sm:p-9">
              <div className="border-b border-[#dfd3c2] pb-6">
                <p className="text-sm text-[#766f66]">قیمت لحظه‌ای طلای ۱۸ عیار</p>
                <p className="mt-3 text-4xl font-extrabold tracking-tight text-[#24211d] sm:text-5xl">
                  {market ? formatToman(market.gold18Price) : "—"}
                </p>
                <p className="mt-1 text-sm font-medium text-[#a08350]">تومان / هر گرم</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-[#dfd3c2] pt-6">
                <div className="pr-4">
                  <p className="text-xs text-[#8b8379]">دلار تهران</p>
                  <p className="mt-2 text-lg font-bold text-[#3d3831]">
                    {market ? formatToman(market.currencyPrice) : "—"}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-xs text-[#8b8379]">انس جهانی</p>
                  <p className="mt-2 text-lg font-bold text-[#3d3831]">
                    {market ? formatToman(market.ouncePrice) : "—"}
                  </p>
                </div>
              </div>
              <div className="mt-7 flex items-center justify-between border-t border-[#dfd3c2] pt-5 text-xs text-[#8b8379]">
                <span>موتور قیمت وارش گلد</span>
                <span className="flex items-center gap-2 font-semibold text-[#698260]">
                  <span className="h-2 w-2 rounded-full bg-[#698260]" /> آنلاین
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="prices" className="waresh-container scroll-mt-28 py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-5 border-b border-[#e1d8cc] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="waresh-section-label text-xs font-semibold text-[#a08350]">LIVE MARKET</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#24211d]">نبض بازار</h2>
          </div>
          {market && <MarketStatus updatedAt={market.updatedAt} />}
        </div>
        {market ? (
          <div className="mt-8 grid gap-px overflow-hidden border border-[#e1d8cc] bg-[#e1d8cc] md:grid-cols-3">
            <PriceCard title="طلای ۱۸ عیار" value={`${formatToman(market.gold18Price)} تومان`} icon="Au" description="هر گرم در بازار ایران" />
            <PriceCard title="دلار تهران" value={`${formatToman(market.currencyPrice)} تومان`} icon="$" description="نرخ بازار آزاد" />
            <PriceCard title="انس جهانی" value={`${formatToman(market.ouncePrice)} دلار`} icon="Oz" description="قیمت جهانی طلا" />
          </div>
        ) : (
          <div className="mt-8 border border-[#e1d8cc] bg-[#fffdf9] p-8 text-center text-[#766f66]">
            قیمت لحظه‌ای فعلاً در دسترس نیست.
          </div>
        )}
      </section>

      <section id="calculator" className="scroll-mt-28 border-y border-[#e8e0d4] bg-[#fffdf9] py-16 sm:py-20">
        <div className="waresh-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="waresh-section-label text-xs font-semibold text-[#a08350]">PRECISION CALCULATOR</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-relaxed text-[#24211d]">قیمت نهایی را<br />با خیال راحت حساب کن.</h2>
            <p className="mt-5 leading-8 text-[#766f66]">
              وزن، اجرت، سود، مالیات و تخفیف را وارد کن تا محاسبه با فرمول طلافروشی انجام شود.
            </p>
            <div className="mt-8 border-r-2 border-[#b08a45] pr-5 text-sm leading-7 text-[#766f66]">
              قیمت طلای ۱۸ عیار به‌صورت لحظه‌ای در اختیار محاسبه‌گر قرار می‌گیرد.
            </div>
          </div>
          <GoldCalculator liveGoldPrice={market?.gold18Price} />
        </div>
      </section>

      {bubble && (
        <section id="bubble" className="waresh-container scroll-mt-28 py-16 sm:py-20">
          <div className="mb-8">
            <p className="waresh-section-label text-xs font-semibold text-[#a08350]">MARKET ANALYSIS</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#24211d]">حباب بازار طلا</h2>
          </div>
          <GoldBubbleCard
            marketPrice={bubble.marketPrice}
            intrinsicPrice={bubble.intrinsicPrice}
            bubbleAmount={bubble.bubbleAmount}
            bubblePercentage={bubble.bubblePercentage}
          />
        </section>
      )}

      <section id="tools" className="scroll-mt-28 border-y border-[#e8e0d4] bg-[#f1eadf] py-16 sm:py-20">
        <div className="waresh-container">
          <div className="max-w-2xl">
            <p className="waresh-section-label text-xs font-semibold text-[#a08350]">WAResh GOLD TOOLS</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#24211d] sm:text-4xl">ابزارهایی برای هر روز بازار</h2>
            <p className="mt-4 leading-8 text-[#766f66]">از یک نگاه ساده به قیمت تا تحلیل و تصمیم‌گیری حرفه‌ای.</p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-[#ded3c4] bg-[#ded3c4] sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(([number, title, description]) => (
              <div key={number} className="bg-[#f7f2e9] p-7 transition hover:bg-[#fffdf9]">
                <span className="text-xs font-bold tracking-[0.18em] text-[#b08a45]">{number}</span>
                <h3 className="mt-5 text-lg font-bold text-[#302b25]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#766f66]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="waresh-container py-16 sm:py-20">
        <div className="border border-[#d9c8aa] bg-[#ebe0cc] px-7 py-12 text-center sm:px-12">
          <p className="waresh-section-label text-xs font-semibold text-[#8f6d37]">YOUR DIGITAL GOLD ASSISTANT</p>
          <h2 className="mt-5 text-3xl font-extrabold text-[#30291f] sm:text-4xl">وارش گلد، همیشه کنارته.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-8 text-[#6f6251]">
            قیمت، محاسبه، تحلیل و دستیار هوشمند را در ربات تلگرام هم در اختیار داشته باش.
          </p>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex bg-[#30291f] px-9 py-4 font-bold text-white transition hover:bg-[#1f1a15]"
          >
            باز کردن ربات در تلگرام
          </a>
        </div>
      </section>

      <footer className="border-t border-[#e1d8cc] bg-[#fffdf9]">
        <div className="waresh-container flex flex-col gap-6 py-9 text-sm text-[#766f66] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-extrabold text-[#302b25]">وارش گلد</p>
            <p className="mt-1">زیرساخت هوشمند کسب‌وکار طلا</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <a href="#prices" className="hover:text-[#87672e]">قیمت‌ها</a>
            <a href="#calculator" className="hover:text-[#87672e]">محاسبه‌گر</a>
            <a href="#tools" className="hover:text-[#87672e]">ابزارها</a>
            <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#87672e]">تلگرام</a>
          </div>
        </div>
        <div className="waresh-container waresh-rule" />
        <div className="waresh-container py-5 text-xs text-[#9a9187]">© ۱۴۰۵ وارش گلد — دستیار هوشمند بازار طلا</div>
      </footer>
    </main>
  );
}
