import { getGoldBubble, getMarketPrice, TELEGRAM_BOT_URL } from "@/lib/api";
import GoldCalculator from "@/components/GoldCalculator";
import MobileMenu from "@/components/MobileMenu";
import ProductCatalog from "@/components/ProductCatalog";
import ScrollExperience from "@/components/ScrollExperience";
import { formatToman } from "@/data/products";

export const dynamic = "force-dynamic";

const forestImage = "/waresh-forest.svg";
const jewelryImage = "/waresh-jewelry.svg";
const giftImage = "/waresh-gift.svg";

export default async function Home() {
  const [marketResult, bubbleResult] = await Promise.allSettled([getMarketPrice(), getGoldBubble()]);
  const market = marketResult.status === "fulfilled" ? marketResult.value : null;
  const bubble = bubbleResult.status === "fulfilled" ? bubbleResult.value : null;

  return (
    <ScrollExperience>
      <main className="waresh-site overflow-x-hidden bg-[#f5f1e9] text-[#292b26]">
        <div className="border-b border-[#dfe1d7] bg-[#faf8f2]"><div className="waresh-container flex min-h-9 items-center justify-between gap-4 text-[11px] text-[#73776f]"><span>وارش گلد · فروشگاه طلا و جواهر</span><span className="font-bold text-[#6b7c62]">{market ? `طلای ۱۸ عیار ${formatToman(market.gold18Price)}` : "قیمت بازار در حال دریافت…"}</span></div></div>

        <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/90 backdrop-blur-xl"><div className="waresh-container flex h-[76px] items-center justify-between gap-5">
          <a href="#top" className="shrink-0" aria-label="وارش گلد"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-12 w-auto object-contain" /></a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#62685e] lg:flex"><a className="waresh-link" href="#products">محصولات</a><a className="waresh-link" href="#gifts">هدیه</a><a className="waresh-link" href="#prices">قیمت امروز</a><a className="waresh-link" href="/tools">ابزار طلا</a><a className="waresh-link" href="/about">درباره وارش</a></nav>
          <div className="flex items-center gap-2"><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="hidden rounded-full bg-[#b28b4c] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#9d773d] sm:inline-flex">گفتگو در تلگرام</a><MobileMenu /></div>
        </div></header>

        <section id="top" className="waresh-scroll-scene relative min-h-[620px] overflow-hidden bg-[#182b24] text-white sm:min-h-[660px]">
          <img src={forestImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-70" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,24,19,0.95)_0%,rgba(18,40,31,0.76)_42%,rgba(18,39,31,0.4)_74%,rgba(10,22,18,0.62)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(214,188,123,0.2),transparent_24%),radial-gradient(circle_at_25%_15%,rgba(205,224,211,0.1),transparent_30%)]" />
          <div className="waresh-mist absolute inset-x-0 bottom-0 h-[48%]" aria-hidden="true" />
          <div className="waresh-rain absolute inset-0 opacity-80" aria-hidden="true" />
          <div className="waresh-container relative grid min-h-[620px] items-center gap-12 py-14 sm:min-h-[660px] sm:py-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8bd7e]/30 bg-black/15 px-4 py-2 text-[11px] font-bold text-[#dbc58d] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d8bd7e]" aria-hidden="true" />
                قیمت روز بازار · انتخاب آگاهانه
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.24] tracking-tight sm:text-7xl">طلا را فقط<br /><span className="text-[#d8bd7e]">برای امروز نخر.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-9 text-[#d9e0da] sm:text-lg">مدل‌های ظریف و کم‌اجرت، قیمت شفاف و محاسبه دقیق؛ تا انتخاب طلا از یک خرید، به یک انتخاب مطمئن تبدیل شود.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#products" className="inline-flex items-center justify-center rounded-full bg-[#b28b4c] px-7 py-4 font-bold text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#9d773d]">انتخاب طلا</a><a href="#prices" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/15">قیمت امروز</a></div>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-xs text-[#c7d0c8]"><span>کم‌اجرت</span><span>قیمت شفاف</span><span>محاسبه دقیق</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-[470px] lg:justify-self-end">
              <div className="waresh-hero-jewel relative overflow-hidden rounded-[2.8rem] shadow-[0_45px_110px_rgba(0,0,0,0.38)]">
                <img src={jewelryImage} alt="نمونه‌ای از طلا و جواهرات وارش" className="h-[430px] w-full object-cover sm:h-[500px]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,18,0.02)_28%,rgba(10,24,18,0.82)_100%)]" />
                <div className="absolute left-5 top-5 rounded-2xl border border-white/15 bg-[#172a22]/75 px-4 py-3 shadow-xl backdrop-blur-md">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-[#cdb477]">طلای ۱۸ عیار</p>
                  <p className="mt-1 text-sm font-extrabold text-white">{market ? formatToman(market.gold18Price) : "قیمت بازار"}</p>
                </div>
                <div className="absolute inset-x-7 bottom-7"><p className="text-[10px] font-bold tracking-[0.2em] text-[#dbc58d]">انتخاب‌های وارش</p><p className="mt-2 text-2xl font-extrabold">زیبایی، بدون هیاهو.</p></div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-full border border-white/15 bg-[#21372c]/90 px-5 py-3 text-xs font-bold text-[#d8c08c] shadow-xl backdrop-blur-md sm:block">از بارانِ گیلان تا طلای ماندگار</div>
            </div>
          </div>
          <span className="waresh-scroll-marker" aria-hidden="true" />
        </section>

        <section id="products" className="waresh-scroll-scene bg-[#f5f1e9] py-24 sm:py-32"><div className="waresh-container"><div className="waresh-reveal mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between" data-reveal="up"><div><p className="text-xs font-bold tracking-[0.2em] text-[#a17c45]">THE COLLECTION</p><h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#292d28] sm:text-5xl">محصولات وارش</h2><p className="mt-4 max-w-xl text-base leading-8 text-[#72766f]">دسته‌بندی کن، بازه قیمت را انتخاب کن و محصول مناسب خودت را پیدا کن.</p></div><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#96713b] transition hover:text-[#73552b]">برای خرید و مشاوره ← تلگرام</a></div><div className="waresh-reveal" data-reveal="up" data-delay="1"><ProductCatalog liveGoldPrice={market?.gold18Price} /></div></div></section>

        <section id="gifts" className="waresh-scroll-scene relative overflow-hidden bg-[#1d3028] text-white"><div className="absolute inset-0"><img src={giftImage} alt="هدیه‌ای از طلا و جواهر" className="h-full w-full object-cover object-center opacity-75" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,37,29,0.98)_0%,rgba(22,43,34,0.88)_38%,rgba(18,35,28,0.52)_68%,rgba(12,25,20,0.7)_100%)]" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(220,192,125,0.2),transparent_26%)]" /></div><div className="waresh-container relative grid min-h-[720px] items-center gap-12 py-24 sm:min-h-[760px] sm:py-28 lg:grid-cols-[0.82fr_1.18fr]"><div className="max-w-xl"><p className="text-xs font-bold tracking-[0.2em] text-[#d8bd7e]">GIFT EDIT</p><h2 className="mt-5 text-5xl font-extrabold leading-[1.3] sm:text-6xl">هدیه‌ای که<br /><span className="text-[#d8bd7e]">می‌ماند.</span></h2><p className="mt-6 max-w-lg text-base leading-8 text-[#d6ddd6]">برای انتخاب هدیه، از فیلتر بازه قیمت در مجموعه بالا استفاده کن؛ انتخاب بر اساس بودجه، ساده و شفاف.</p><a href="#products" className="mt-8 inline-flex rounded-full bg-[#b28b4c] px-7 py-4 font-bold text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#9d773d]">انتخاب هدیه</a></div><div className="self-end lg:self-center"><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">{[["۳ تا ۱۰ میلیون","انتخاب‌های ظریف و اقتصادی"],["۱۰ تا ۲۰ میلیون","برای یک هدیه ویژه"],["۲۰ تا ۳۰ میلیون","انتخاب‌های چشمگیرتر"]].map(([range,description], index)=><a key={range} href="#products" className="waresh-gift-range waresh-reveal group flex items-center justify-between gap-5 rounded-[1.7rem] border border-white/15 bg-black/20 p-5 backdrop-blur-md transition hover:-translate-x-1 hover:bg-black/30" data-reveal="left" data-delay={String(index + 1)}><div><span className="text-sm font-bold text-[#dbc58d]">{range}</span><p className="mt-2 text-base font-extrabold">{description}</p></div><span className="text-lg text-white/55 transition group-hover:text-white">←</span></a>)}</div></div></div></section>

        <section id="prices" className="waresh-scroll-scene bg-[#e9eee7] py-24 sm:py-28"><div className="waresh-container"><div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"><div className="waresh-reveal lg:sticky lg:top-28" data-reveal="right"><p className="text-xs font-bold tracking-[0.2em] text-[#9b7843]">MARKET / LIVE</p><h2 className="mt-4 text-4xl font-extrabold text-[#293129] sm:text-5xl">نبض بازار</h2><p className="mt-5 max-w-lg text-base leading-8 text-[#70776e]">قیمت‌های بازار از هسته اصلی وارش دریافت می‌شوند؛ سایت فقط آن‌ها را نمایش می‌دهد و محاسبات را به سرویس مطمئن طلا می‌سپارد.</p><div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">{[["طلای ۱۸ عیار",market?formatToman(market.gold18Price):"—"],["دلار تهران",market?formatToman(market.currencyPrice):"—"],["انس جهانی",market?Number(market.ouncePrice).toLocaleString("en-US"):"—"],["حباب",bubble?formatToman(bubble.bubbleAmount):"—"]].map(([label,value])=><div key={label} className="rounded-[1.5rem] bg-[#faf8f2] p-5"><p className="text-xs text-[#858a83]">{label}</p><p className="mt-2 text-xl font-extrabold text-[#9b753c]">{value}</p></div>)}</div></div><div className="waresh-reveal" data-reveal="left" data-delay="1"><GoldCalculator liveGoldPrice={market?.gold18Price} /></div></div></div></section>

        <section className="waresh-scroll-scene relative overflow-hidden bg-[#f5f1e9] py-24 sm:py-32"><div className="waresh-container grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center"><div className="waresh-reveal" data-reveal="right"><p className="text-xs font-bold tracking-[0.2em] text-[#9d7842]">FROM GILAN, FOR TOMORROW</p><h2 className="mt-5 text-4xl font-extrabold leading-[1.45] text-[#2b302a] sm:text-5xl">وارش را بیشتر بشناس.</h2><p className="mt-6 max-w-xl text-base leading-9 text-[#70756d]">«وارش» یعنی باران. داستان ریشه شمالی و نگاه ما به آینده را در صفحه درباره وارش بخوان.</p><a href="/about" className="mt-8 inline-flex rounded-full bg-[#263b31] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">درباره وارش</a></div><div className="waresh-reveal" data-reveal="left"><div className="rounded-[2.5rem] border border-[#ddd8cc] bg-[#ebe7dc] p-10"><p className="text-sm font-bold text-[#9a7742]">باران / طلا / زمان</p><p className="mt-5 text-3xl font-extrabold leading-[1.5] text-[#343830]">از شمال ایران، با وسواس برای انتخابی که فردا هم ارزش داشته باشد.</p></div></div></div></section>

        <section className="bg-[#24382f] py-16 text-white"><div className="waresh-container flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-bold tracking-[0.2em] text-[#d7bf8b]">WARESH GOLD</p><h2 className="mt-3 text-3xl font-extrabold">برای انتخاب طلا، با ما حرف بزن.</h2></div><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#b28b4c] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#9d773d]">گفتگو در تلگرام</a></div></section>

        <footer className="bg-[#17251f] py-12 text-white"><div className="waresh-container flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-11 w-auto object-contain object-left" /><div className="flex flex-wrap gap-5 text-sm text-white/65"><a className="hover:text-white" href="/about">درباره وارش</a><a className="hover:text-white" href="/tools">ابزار طلا</a><a className="hover:text-white" href="#products">محصولات</a><a className="hover:text-white" href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">تلگرام</a></div><p className="text-xs text-white/45">© {new Date().getFullYear()} Waresh Gold</p></div></footer>
      </main>
    </ScrollExperience>
  );
}
