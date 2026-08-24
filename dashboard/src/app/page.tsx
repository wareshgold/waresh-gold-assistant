import { getMarketPrice, getGoldBubble, TELEGRAM_BOT_URL } from "@/lib/api";
import PriceCard from "@/components/PriceCard";
import MarketStatus from "@/components/MarketStatus";
import GoldBubbleCard from "@/components/GoldBubbleCard";
import GoldCalculator from "@/components/GoldCalculator";

export const dynamic = "force-dynamic";

const formatToman = (value: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value);

const features = [
  {
    icon: "🟡",
    title: "قیمت لحظه‌ای طلا",
    description: "قیمت هر گرم طلای ۱۸ عیار، دلار تهران و انس جهانی، مستقیم از بازار.",
  },
  {
    icon: "🧮",
    title: "محاسبه‌گر دقیق",
    description: "فرمول استاندارد طلافروشی با اجرت، سود، مالیات و تخفیف — بدون خطا.",
  },
  {
    icon: "🧾",
    title: "فاکتور و صورتحساب",
    description: "محاسبه فاکتور خرید و فروش با جزئیات کامل برای کسب‌وکار طلا.",
  },
  {
    icon: "🫧",
    title: "تحلیل حباب بازار",
    description: "تفاوت قیمت بازار با ارزش ذاتی طلا را لحظه‌ای ببین.",
  },
  {
    icon: "🤖",
    title: "دستیار هوشمند",
    description: "سوالات طلا و بازار را به زبان فارسی از دستیار هوشمند بپرس.",
  },
  {
    icon: "🔔",
    title: "هشدار قیمت",
    description: "وقتی قیمت طلا به عدد دلخواهت رسید، در تلگرام خبردار شو.",
  },
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
    <main className="flex-1">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-stone-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-lg text-stone-950">
              🟡
            </span>
            وارش گلد
          </a>
          <nav className="hidden items-center gap-6 text-sm text-stone-400 md:flex">
            <a href="#prices" className="transition hover:text-amber-300">
              قیمت‌ها
            </a>
            <a href="#calculator" className="transition hover:text-amber-300">
              ماشین‌حساب
            </a>
            <a href="#features" className="transition hover:text-amber-300">
              امکانات
            </a>
          </nav>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gradient-to-l from-amber-400 to-amber-500 px-4 py-2 text-sm font-bold text-stone-950 transition hover:from-amber-300 hover:to-amber-400"
          >
            گفتگو در تلگرام
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(217,119,6,0.28), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-300">
            ✨ دستیار هوشمند بازار طلا
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight text-stone-50 sm:text-6xl">
            محاسبه، قیمت و تحلیل طلا
            <span className="block bg-gradient-to-l from-amber-300 to-amber-500 bg-clip-text text-transparent">
              همه در یک‌جا
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
            وارش گلد ابزارهای کاربردی بازار طلا را کنار هم می‌گذارد: قیمت لحظه‌ای،
            ماشین‌حساب حرفه‌ای، فاکتور و تحلیل بازار — هم در تلگرام، هم در وب.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl bg-gradient-to-l from-amber-400 to-amber-500 px-8 py-4 text-lg font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-300 hover:to-amber-400 sm:w-auto"
            >
              شروع گفتگو در تلگرام
            </a>
            <a
              href="#calculator"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-bold text-stone-100 backdrop-blur transition hover:border-amber-400/40 hover:bg-white/10 sm:w-auto"
            >
              ماشین‌حساب آنلاین
            </a>
          </div>
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 text-center">
            {[
              { value: "لحظه‌ای", label: "بروزرسانی قیمت" },
              { value: "دقیق", label: "فرمول طلافروشی" },
              { value: "فارسی", label: "پشتیبانی کامل" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur">
                <p className="text-sm font-bold text-amber-300">{item.value}</p>
                <p className="mt-1 text-xs text-stone-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live prices */}
      <section id="prices" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:px-6">
        {market ? (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              <PriceCard
                title="طلای ۱۸ عیار"
                value={`${formatToman(market.gold18Price)} تومان`}
                icon="🟡"
                description="قیمت لحظه‌ای هر گرم"
              />
              <PriceCard
                title="دلار تهران"
                value={`${formatToman(market.currencyPrice)} تومان`}
                icon="💵"
                description="نرخ بازار آزاد"
              />
              <PriceCard
                title="انس جهانی"
                value={`${formatToman(market.ouncePrice)} دلار`}
                icon="🌎"
                description="قیمت جهانی طلا"
              />
            </div>
            <MarketStatus updatedAt={market.updatedAt} />
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-stone-400 backdrop-blur">
            قیمت لحظه‌ای در دسترس نیست — لطفاً کمی بعد دوباره مراجعه کنید.
          </div>
        )}

        {bubble && (
          <div className="mt-6">
            <GoldBubbleCard
              marketPrice={bubble.marketPrice}
              intrinsicPrice={bubble.intrinsicPrice}
              bubbleAmount={bubble.bubbleAmount}
              bubblePercentage={bubble.bubblePercentage}
            />
          </div>
        )}
      </section>

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-10 sm:px-6">
        <GoldCalculator liveGoldPrice={market?.gold18Price} />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-stone-50 sm:text-4xl">
            برای کسب‌وکار طلا،
            <span className="text-amber-400"> هر روز</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-400">
            ابزارهایی که طلافروش‌ها و خریداران حرفه‌ای هر روز به آن‌ها نیاز دارند.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-amber-400/30"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-2xl">
                {feature.icon}
              </span>
              <h3 className="mt-5 text-lg font-bold text-stone-50">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-stone-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-stone-900 to-stone-900 p-10 text-center sm:p-14">
          <h2 className="text-3xl font-extrabold text-stone-50 sm:text-4xl">
            همه این‌ها در تلگرام هم هست 🚀
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-400">
            ربات وارش گلد را شروع کن: قیمت لحظه‌ای، محاسبه، هشدار قیمت و دستیار
            هوشمند — بدون نصب هیچ برنامه‌ای.
          </p>
          <a
            href={TELEGRAM_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-2xl bg-gradient-to-l from-amber-400 to-amber-500 px-10 py-4 text-lg font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-300 hover:to-amber-400"
          >
            باز کردن ربات در تلگرام
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-stone-500 sm:flex-row sm:px-6">
          <p className="flex items-center gap-2 font-bold text-stone-300">
            🟡 وارش گلد
          </p>
          <p>© ۱۴۰۴ وارش گلد — دستیار هوشمند بازار طلا</p>
        </div>
      </footer>
    </main>
  );
}
