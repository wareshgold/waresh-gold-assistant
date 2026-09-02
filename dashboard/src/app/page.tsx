import { getGoldBubble, getMarketPrice, TELEGRAM_BOT_URL } from "@/lib/api";
import MarketStatus from "@/components/MarketStatus";
import GoldBubbleCard from "@/components/GoldBubbleCard";
import GoldCalculator from "@/components/GoldCalculator";

export const dynamic = "force-dynamic";

const formatToman = (value: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value);

const tools = [
  ["۰۱", "قیمت لحظه‌ای", "نبض طلا، دلار و انس جهانی؛ ساده و روشن."],
  ["۰۲", "محاسبه‌گر طلا", "وزن، اجرت، سود، مالیات و تخفیف را دقیق حساب کن."],
  ["۰۳", "فاکتور و معامله", "محاسبات خرید و فروش، شفاف و قابل اعتماد."],
  ["۰۴", "تحلیل حباب", "فاصله قیمت بازار با ارزش ذاتی را ببین."],
  ["۰۵", "دستیار هوشمند", "سوالت را فارسی بپرس؛ وارش ابزار درست را پیدا می‌کند."],
  ["۰۶", "هشدار قیمت", "برای قیمت‌های مهمت در تلگرام هشدار بگیر."],
];

const forestImage =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=85";
const rainImage =
  "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1400&q=85";
const jewelryImage =
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85";

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
    <main className="waresh-site overflow-x-hidden bg-[#f5f1e9] text-[#24251f]">
      <div className="border-b border-[#dfe1d7] bg-[#f8f7f2]">
        <div className="waresh-container flex min-h-9 items-center justify-between gap-4 text-[11px] text-[#6e7469]">
          <span>نبض بازار طلا</span>
          <span className="font-semibold text-[#6d7d62]">
            طلای ۱۸ عیار: {market ? `${formatToman(market.gold18Price)} تومان` : "در حال دریافت…"}
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#dfe1d7]/80 bg-[#f8f7f2]/90 backdrop-blur-xl">
        <div className="waresh-container flex h-[74px] items-center justify-between gap-6">
          <a href="#top" className="group flex items-center">
            <img src="/tools/waresh-gold-logo-green.png" alt="وارش گلد" className="h-12 w-auto object-contain transition duration-500 group-hover:scale-[1.03]" />
          </a>

          <nav className="hidden items-center gap-9 text-sm font-medium text-[#62685e] lg:flex">
            <a className="waresh-link" href="#prices">قیمت امروز</a>
            <a className="waresh-link" href="#calculator">محاسبه‌گر</a>
            <a className="waresh-link" href="#story">داستان وارش</a>
            <a className="waresh-link" href="#tools">ابزارها</a>
          </nav>

          <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="waresh-gold-button rounded-full px-5 py-2.5 text-sm font-bold text-white">گفتگو در تلگرام</a>
        </div>
      </header>

      <section id="top" className="relative min-h-[760px] overflow-hidden bg-[#23372d] text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${forestImage})` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,39,31,0.96)_0%,rgba(24,52,40,0.78)_38%,rgba(20,42,34,0.30)_72%,rgba(20,42,34,0.62)_100%)]" />
        <div className="waresh-rain absolute inset-0 opacity-30" aria-hidden="true" />

        <div className="waresh-container relative grid min-h-[760px] items-end gap-12 pb-20 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24">
          <div className="max-w-2xl">
            <div className="mb-7 flex items-center gap-4 text-xs font-medium tracking-[0.2em] text-[#d6c08d]"><span className="h-px w-12 bg-[#c7a968]" />GOLD BUSINESS PLATFORM</div>
            <p className="text-sm font-medium text-[#dbe3d9]">از شمال، با طراوت باران.</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-extrabold leading-[1.35] tracking-tight sm:text-7xl">از دل باران،<span className="block text-[#d7bb79]">به ارزش طلا.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-9 text-[#dce2dc] sm:text-lg">وارش گلد، زیرساخت هوشمند بازار طلا؛ برای دیدن قیمت، محاسبه دقیق و تصمیم‌گیری مطمئن.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="#calculator" className="waresh-gold-button inline-flex items-center justify-center rounded-full px-7 py-4 font-bold text-white">شروع محاسبه</a><a href="#prices" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/15">قیمت امروز را ببین</a></div>
          </div>

          <div className="relative mx-auto w-full max-w-[430px] lg:justify-self-end">
            <div className="waresh-glass-card relative overflow-hidden rounded-[2.25rem] border border-white/20 bg-[#f8f6ef]/95 p-7 text-[#272b25] shadow-[0_35px_100px_rgba(0,0,0,0.22)] sm:p-9">
              <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#d5c08a]/30 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between"><span className="text-xs font-semibold text-[#73796e]">قیمت لحظه‌ای</span><span className="flex items-center gap-2 text-xs font-semibold text-[#668060]"><span className="h-2 w-2 rounded-full bg-[#668060]" /> آنلاین</span></div>
                <p className="mt-7 text-sm text-[#6e746a]">طلای ۱۸ عیار</p>
                <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{market ? formatToman(market.gold18Price) : "—"}</p>
                <p className="mt-1 text-xs font-medium text-[#9a7b43]">تومان / هر گرم</p>
                <div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#eeeadf] p-4"><p className="text-[11px] text-[#80867c]">دلار تهران</p><p className="mt-2 text-lg font-bold">{market ? formatToman(market.currencyPrice) : "—"}</p></div><div className="rounded-2xl bg-[#eeeadf] p-4"><p className="text-[11px] text-[#80867c]">انس جهانی</p><p className="mt-2 text-lg font-bold">{market ? formatToman(market.ouncePrice) : "—"}</p></div></div>
                {market && <div className="mt-5 border-t border-[#dcd8cc] pt-4"><MarketStatus updatedAt={market.updatedAt} /></div>}
              </div>
            </div>
            <div className="absolute -bottom-12 -left-12 hidden h-28 w-28 rounded-full border border-[#d8bd7d]/40 lg:block" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="story" className="waresh-story relative overflow-hidden bg-[#f5f1e9] py-24 sm:py-32">
        <div className="waresh-container grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
          <div className="waresh-story-visual relative order-2 min-h-[560px] lg:order-1">
            <div className="waresh-story-halo absolute -bottom-8 -left-8 h-72 w-72 rounded-full bg-[#cbd6c6]/55 blur-3xl" />
            <div className="waresh-story-main-image absolute inset-x-0 top-0 h-[500px] overflow-hidden rounded-[3.5rem] rounded-bl-[8rem] shadow-[0_35px_90px_rgba(45,56,44,0.18)] sm:h-[540px]">
              <img src={rainImage} alt="باران و طبیعت شمال ایران" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,45,35,0.03)_15%,rgba(22,45,35,0.16)_50%,rgba(22,45,35,0.72)_100%)]" />
              <div className="waresh-rain absolute inset-0 opacity-20" aria-hidden="true" />
              <div className="absolute left-7 top-7 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-white backdrop-blur-md">GILAN / ۳۷° N</div>
              <div className="absolute inset-x-7 bottom-7"><div className="max-w-sm rounded-[2rem] border border-white/20 bg-[#18382d]/72 p-5 text-white backdrop-blur-xl"><p className="text-[10px] font-semibold tracking-[0.22em] text-[#dbc58d]">WHERE WARESH BEGINS</p><p className="mt-3 text-lg font-bold leading-8">جایی که باران، فقط هوا نیست؛ بخشی از هویت است.</p></div></div>
            </div>
            <div className="waresh-story-detail absolute -bottom-1 -right-3 z-10 hidden w-44 overflow-hidden rounded-[2rem] border-[6px] border-[#f5f1e9] bg-[#d9e0d5] shadow-[0_20px_50px_rgba(45,56,44,0.18)] sm:block">
              <img src={forestImage} alt="جنگل‌های سبز شمال" className="h-52 w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-[#18382d]/80 px-3 py-2 text-center text-[10px] font-semibold text-white backdrop-blur-sm">سبزِ شمال</div>
            </div>
            <div className="absolute -right-2 top-24 z-20 hidden h-20 w-20 items-center justify-center rounded-full border border-[#b28b4c]/35 bg-[#f5f1e9]/90 shadow-[0_15px_35px_rgba(90,72,38,0.10)] backdrop-blur-md lg:flex"><span className="text-2xl text-[#a47d3f]">✦</span></div>
          </div>

          <div className="waresh-story-copy order-1 max-w-xl lg:order-2 lg:pl-4">
            <p className="waresh-section-label text-xs font-semibold text-[#9b7b48]">THE WARESH STORY</p>
            <div className="mt-6 h-px w-20 bg-[#b28b4c]" />
            <h2 className="mt-6 text-4xl font-extrabold leading-[1.55] tracking-tight text-[#293027] sm:text-5xl">وارش یعنی باران؛<span className="block text-[#68795f]">و قصه‌ی ما از همین‌جا شروع می‌شود.</span></h2>
            <p className="mt-8 text-[17px] leading-[2.25] text-[#666d63] sm:text-lg">باران در شمال، فقط از آسمان نمی‌بارد؛ در کوچه‌ها، جنگل‌ها و ریتم زندگی می‌نشیند. «وارش» از همین واژه و همین حال‌وهوا آمده است.</p>
            <p className="mt-5 text-[17px] leading-[2.25] text-[#666d63] sm:text-lg">ما می‌خواستیم بازار طلا هم چنین حسی داشته باشد: روشن، دقیق و بی‌هیاهو. جایی که تکنولوژی، داده و ابزارهای مالی پیچیده، پشت یک تجربه ساده و انسانی قرار بگیرند.</p>
            <div className="mt-9 flex items-center gap-5"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4eadf] text-[#6d7e63]">✦</span><div><p className="text-sm font-bold text-[#394239]">دقیق، آرام، ایرانی.</p><p className="mt-1 text-xs text-[#8a9188]">ریشه شمالی، نگاه رو به آینده</p></div></div>
          </div>
        </div>
      </section>

      <section id="prices" className="relative overflow-hidden bg-[#e9eee7] py-20 sm:py-28">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/70 blur-3xl" aria-hidden="true" />
        <div className="waresh-container relative">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="waresh-section-label text-xs font-semibold text-[#6e7f68]">TODAY / MARKET PULSE</p><h2 className="mt-4 text-4xl font-extrabold text-[#293027]">نبض امروز بازار</h2></div>{market && <MarketStatus updatedAt={market.updatedAt} />}</div>
          {market ? <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]"><div className="waresh-price-feature rounded-[2.5rem] bg-[#233a30] p-8 text-white shadow-[0_25px_70px_rgba(37,59,47,0.16)] sm:p-11"><div className="flex items-start justify-between gap-5"><div><p className="text-sm text-white/65">طلای ۱۸ عیار</p><p className="mt-5 text-5xl font-extrabold tracking-tight sm:text-7xl">{formatToman(market.gold18Price)}</p><p className="mt-2 text-sm text-[#d7c18d]">تومان / هر گرم</p></div><span className="rounded-full border border-[#d4bc7f]/35 px-4 py-2 text-xs font-semibold text-[#d7c18d]">Au 18K</span></div><div className="mt-14 grid gap-5 border-t border-white/15 pt-6 sm:grid-cols-2"><div><p className="text-xs text-white/50">دلار تهران</p><p className="mt-2 text-xl font-bold">{formatToman(market.currencyPrice)} تومان</p></div><div><p className="text-xs text-white/50">انس جهانی</p><p className="mt-2 text-xl font-bold">{formatToman(market.ouncePrice)} دلار</p></div></div></div><div className="relative min-h-[310px] overflow-hidden rounded-[2.5rem] bg-[#d6dfd2]"><img src={jewelryImage} alt="زیورآلات طلا" className="absolute inset-0 h-full w-full object-cover opacity-85 mix-blend-multiply" /><div className="absolute inset-0 bg-gradient-to-t from-[#2d4235]/85 via-[#2d4235]/20 to-transparent" /><div className="absolute inset-x-7 bottom-7 text-white"><p className="text-xs font-semibold tracking-[0.16em] text-[#dfc98f]">GOLD / EVERY DAY</p><p className="mt-3 text-2xl font-extrabold leading-relaxed">قیمت را بدان.<br />بعد تصمیم بگیر.</p></div></div></div> : <div className="mt-10 rounded-[2rem] bg-white/70 p-10 text-center text-[#70766d]">قیمت لحظه‌ای فعلاً در دسترس نیست.</div>}
        </div>
      </section>

      <section id="calculator" className="waresh-calculator-section relative overflow-hidden bg-[#f8f6ef] py-24 sm:py-32"><div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#d7dfd2] blur-3xl" aria-hidden="true" /><div className="waresh-container relative grid gap-14 lg:grid-cols-[0.68fr_1.32fr] lg:items-start"><div className="lg:sticky lg:top-28"><p className="waresh-section-label text-xs font-semibold text-[#9b7b48]">PRECISION / CALCULATOR</p><h2 className="mt-5 text-4xl font-extrabold leading-[1.55] text-[#293027] sm:text-5xl">حساب کن.<br /><span className="text-[#6b7d62]">با خیال راحت.</span></h2><p className="mt-6 leading-9 text-[#70766d]">وزن، اجرت، سود، مالیات و تخفیف را وارد کن. قیمت طلای لحظه‌ای هم کنار محاسبه‌گر است.</p><div className="mt-9 flex items-center gap-4 text-sm font-semibold text-[#667460]"><span className="h-10 w-10 rounded-full bg-[#e3eadf] text-center leading-10">✓</span>فرمول شفاف و قابل بررسی</div><div className="mt-4 flex items-center gap-4 text-sm font-semibold text-[#667460]"><span className="h-10 w-10 rounded-full bg-[#e3eadf] text-center leading-10">✓</span>قیمت لحظه‌ای بازار</div></div><div className="waresh-calculator-frame rounded-[2.5rem] border border-[#dfe3d9] bg-white/75 p-5 shadow-[0_30px_90px_rgba(48,63,51,0.08)] sm:p-8"><GoldCalculator liveGoldPrice={market?.gold18Price} /></div></div></section>

      {bubble && <section id="bubble" className="waresh-container scroll-mt-28 py-24 sm:py-32"><div className="mb-10 max-w-2xl"><p className="waresh-section-label text-xs font-semibold text-[#9b7b48]">MARKET / BUBBLE</p><h2 className="mt-4 text-4xl font-extrabold text-[#293027]">بازار بالاتر است یا ارزش واقعی؟</h2><p className="mt-4 leading-8 text-[#70766d]">حباب طلا را کنار ارزش ذاتی ببین تا تصویر کامل‌تری از بازار داشته باشی.</p></div><div className="waresh-bubble-wrap rounded-[2.75rem] bg-[#e8eee6] p-3 sm:p-5"><GoldBubbleCard marketPrice={bubble.marketPrice} intrinsicPrice={bubble.intrinsicPrice} bubbleAmount={bubble.bubbleAmount} bubblePercentage={bubble.bubblePercentage} /></div></section>}

      <section id="tools" className="relative overflow-hidden bg-[#24372e] py-24 text-white sm:py-32"><div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url(${forestImage})`, backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden="true" /><div className="waresh-rain absolute inset-0 opacity-15" aria-hidden="true" /><div className="waresh-container relative"><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div className="max-w-2xl"><p className="waresh-section-label text-xs font-semibold text-[#d6c08d]">WARESH GOLD TOOLS</p><h2 className="mt-5 text-4xl font-extrabold leading-relaxed sm:text-5xl">ابزارهای وارش،<br />برای هر روز بازار.</h2></div><p className="max-w-sm leading-8 text-white/60">از یک نگاه سریع به قیمت تا محاسبه و تحلیل؛ همه‌چیز در یک تجربه آرام و یکپارچه.</p></div><div className="mt-14 grid gap-x-10 gap-y-0 border-t border-white/15 md:grid-cols-2 lg:grid-cols-3">{tools.map(([number, title, description]) => <a key={number} href={number === "۰۲" ? "#calculator" : number === "۰۴" ? "#bubble" : "#prices"} className="waresh-tool-row group border-b border-white/15 py-8"><div className="flex gap-5"><span className="text-xs font-semibold text-[#d6c08d]">{number}</span><div><h3 className="text-xl font-bold text-white transition group-hover:text-[#e0c98c]">{title}</h3><p className="mt-2 text-sm leading-7 text-white/55">{description}</p></div></div></a>)}</div></div></section>

      <section className="relative overflow-hidden bg-[#dfe7dc] py-24 sm:py-32"><div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/70 blur-3xl" aria-hidden="true" /><div className="waresh-container relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="waresh-section-label text-xs font-semibold text-[#6d7d62]">RAIN / GOLD / DIGITAL</p><h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.55] text-[#293027] sm:text-6xl">بازار طلا را،<br /><span className="text-[#6b7d62]">با حال‌وهوای وارش دنبال کن.</span></h2><p className="mt-6 max-w-xl leading-9 text-[#70766d]">قیمت، محاسبه، تحلیل و دستیار هوشمند؛ حالا در ربات تلگرام هم کنار توست.</p></div><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="waresh-gold-button inline-flex items-center justify-center rounded-full px-8 py-4 font-bold text-white">باز کردن ربات وارش</a></div></section>

      <footer className="border-t border-[#dfe1d7] bg-[#f8f7f2]"><div className="waresh-container flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between"><div><img src="/tools/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto object-contain" /><p className="mt-2 text-xs text-[#80867c]">زیرساخت هوشمند کسب‌وکار طلا</p></div><div className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#70766d]"><a className="waresh-link" href="#prices">قیمت امروز</a><a className="waresh-link" href="#calculator">محاسبه‌گر</a><a className="waresh-link" href="#bubble">حباب</a><a className="waresh-link" href="#tools">ابزارها</a><a className="waresh-link" href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">تلگرام</a></div></div><div className="waresh-container waresh-rule" /><div className="waresh-container py-5 text-xs text-[#9a9f96]">© ۱۴۰۵ وارش گلد — از دل باران، به ارزش طلا.</div></footer>
    </main>
  );
}
