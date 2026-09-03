import { TELEGRAM_BOT_URL } from "@/lib/api";
import MobileMenu from "@/components/MobileMenu";

const rainImage = "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1600&q=85";
const forestImage = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=85";

const aboutLinks = [
  ["داستان وارش", "#story"],
  ["دیدگاه ما", "#view"],
  ["ادامه مسیر", "#next"],
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-5">
          <a href="/" aria-label="بازگشت به خانه"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-12 w-auto" /></a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#646a61] lg:flex"><a className="waresh-link" href="/">فروشگاه</a><a className="waresh-link" href="/tools">ابزار طلا</a><a className="waresh-link" href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">تلگرام</a></nav>
          <div className="flex items-center gap-2">
            <a href="/#products" className="hidden rounded-full bg-[#263b31] px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1c2e26] sm:inline-flex">مشاهده محصولات</a>
            <MobileMenu />
          </div>
        </div>
      </header>

      <nav className="sticky top-[76px] z-40 border-b border-[#dfe1d7] bg-[#f8f6ef]/95 backdrop-blur" aria-label="دسترسی سریع درباره وارش">
        <div className="waresh-container flex gap-2 overflow-x-auto py-3">
          {aboutLinks.map(([label, href]) => <a key={href} href={href} className="shrink-0 rounded-full border border-[#d9d5ca] bg-white/70 px-4 py-2.5 text-xs font-bold text-[#5d625a] transition hover:border-[#c9b681] hover:bg-[#fffdf8] hover:text-[#84632e]">{label}</a>)}
        </div>
      </nav>

      <section id="story" className="scroll-mt-32 relative bg-[#23372d] py-24 text-white sm:py-32">
        <div className="waresh-container relative grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
          <div><p className="text-xs font-bold tracking-[0.24em] text-[#d7bf8b]">THE WARESH STORY</p><h1 className="mt-6 text-5xl font-extrabold leading-[1.4] sm:text-7xl">وارش یعنی باران؛<span className="block text-[#d8bd7e]">و قصه‌ی ما از همین‌جا شروع می‌شود.</span></h1><p className="mt-7 max-w-2xl text-lg leading-9 text-[#d8e0d9]">باران در شمال، فقط از آسمان نمی‌بارد؛ در کوچه‌ها، جنگل‌ها و ریتم زندگی می‌نشیند. «وارش» از همین واژه و همین حال‌وهوا آمده است.</p></div>
          <div className="overflow-hidden rounded-[3rem] border border-white/15 bg-white/10 p-2 shadow-[0_35px_90px_rgba(0,0,0,0.25)]"><img src={rainImage} alt="باران و طبیعت شمال ایران" className="h-[420px] w-full rounded-[2.6rem] object-cover sm:h-[480px]" /></div>
        </div>
      </section>

      <section id="view" className="scroll-mt-32 py-24 sm:py-32"><div className="waresh-container grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div className="overflow-hidden rounded-[3rem] bg-[#dce4d9] p-3"><img src={forestImage} alt="جنگل‌های سبز گیلان" className="h-[380px] w-full rounded-[2.5rem] object-cover sm:h-[430px]" /></div><div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.2em] text-[#9d7842]">OUR POINT OF VIEW</p><h2 className="mt-5 text-4xl font-extrabold leading-[1.5] sm:text-5xl">ما می‌خواستیم بازار طلا هم همین حس را داشته باشد.</h2><p className="mt-7 text-lg leading-9 text-[#70756d]">روشن، دقیق و بی‌هیاهو. جایی که تکنولوژی، داده و ابزارهای مالی پیچیده، پشت یک تجربه ساده و انسانی قرار بگیرند.</p><p className="mt-5 text-lg leading-9 text-[#70756d]">وارش گلد از یک ریشه شمالی می‌آید، اما نگاهش رو به آینده است؛ از قیمت و محاسبه گرفته تا فروشگاه، دستیار هوشمند و زیرساختی که بتواند در آینده روی وب، موبایل و سرویس‌های دیگر رشد کند.</p><div className="mt-9 flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4eadf] text-[#a47d3f]">✦</span><div><p className="font-extrabold text-[#394239]">دقیق، آرام، ایرانی.</p><p className="mt-1 text-xs text-[#8a9188]">ریشه شمالی، نگاه رو به آینده</p></div></div></div></div></section>

      <section id="next" className="scroll-mt-32 bg-[#e9eee7] py-24"><div className="waresh-container text-center"><p className="text-xs font-bold tracking-[0.2em] text-[#9d7842]">WARESH GOLD</p><h2 className="mt-4 text-4xl font-extrabold">از اینجا به بعد، داستان ادامه دارد.</h2><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#70776e]">فروشگاه و ابزارهای وارش در یک مسیر واحد کنار هم قرار می‌گیرند؛ با همان دقتی که از یک کسب‌وکار طلا انتظار داریم.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href="/" className="rounded-full bg-[#263b31] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1c2e26]">رفتن به فروشگاه</a><a href="/tools" className="rounded-full border border-[#cfc8bb] bg-[#faf8f2] px-6 py-3.5 text-sm font-bold text-[#4e554c] transition hover:border-[#bca878]">دیدن ابزارها</a><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#cfc8bb] bg-transparent px-6 py-3.5 text-sm font-bold text-[#4e554c] transition hover:border-[#bca878]">گفتگو در تلگرام</a></div></div></section>

      <footer className="bg-[#1f2d26] py-12 text-white"><div className="waresh-container flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><div><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-11 w-auto object-contain" /><p className="mt-3 max-w-sm text-xs leading-6 text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65"><a className="transition hover:text-white" href="/">فروشگاه</a><a className="transition hover:text-white" href="/tools">ابزار طلا</a><a className="transition hover:text-white" href="/about">درباره وارش</a><a className="transition hover:text-white" href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">تلگرام</a></div></div></footer>
    </main>
  );
}
