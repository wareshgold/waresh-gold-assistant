import Image from "next/image";
import Link from "next/link";
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
        <div className="waresh-container flex h-[76px] items-center justify-between gap-4 sm:gap-5">
          <Link href="/" aria-label="بازگشت به خانه" className="shrink-0">
            <Image src="/waresh-gold-logo-green.png" alt="وارش گلد" width={180} height={48} className="h-11 w-auto object-contain sm:h-12" priority />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#646a61] lg:flex" aria-label="ناوبری اصلی">
            <Link className="waresh-link" href="/#products">محصولات</Link>
            <Link className="waresh-link" href="/#gifts">هدیه</Link>
            <Link className="waresh-link" href="/#prices">قیمت امروز</Link>
            <Link className="waresh-link" href="/tools">ابزار طلا</Link>
            <Link className="waresh-link" href="/about">درباره وارش</Link>
          </nav>
          <div className="flex items-center gap-2">
            <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center rounded-full bg-[#b28b4c] px-5 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#9d773d] sm:inline-flex">گفتگو در تلگرام</a>
            <MobileMenu />
          </div>
        </div>
      </header>

      <nav className="sticky top-[76px] z-40 border-b border-[#dfe1d7] bg-[#f8f6ef]/95 backdrop-blur" aria-label="دسترسی سریع درباره وارش">
        <div className="waresh-container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {aboutLinks.map(([label, href]) => <a key={href} href={href} className="shrink-0 rounded-full border border-[#d9d5ca] bg-white/70 px-4 py-2.5 text-xs font-bold text-[#5d625a] transition hover:border-[#c9b681] hover:bg-[#fffdf8] hover:text-[#84632e]">{label}</a>)}
        </div>
      </nav>

      <section id="story" className="waresh-about-hero scroll-mt-32 relative bg-[#23372d] py-20 text-white sm:py-32">
        <div className="waresh-container relative grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
          <div><p className="text-xs font-bold tracking-[0.24em] text-[#d7bf8b]">THE WARESH STORY</p><h1 className="mt-5 text-4xl font-extrabold leading-[1.45] sm:mt-6 sm:text-7xl sm:leading-[1.4]">وارش یعنی باران؛<span className="block text-[#d8bd7e]">و قصه‌ی ما از همین‌جا شروع می‌شود.</span></h1><p className="mt-6 max-w-2xl text-base leading-8 text-[#d8e0d9] sm:mt-7 sm:text-lg sm:leading-9">باران در شمال، فقط از آسمان نمی‌بارد؛ در کوچه‌ها، جنگل‌ها و ریتم زندگی می‌نشیند. «وارش» از همین واژه و همین حال‌وهوا آمده است.</p></div>
          <div className="overflow-hidden rounded-[2.2rem] border border-white/15 bg-white/10 p-2 shadow-[0_35px_90px_rgba(0,0,0,0.25)] sm:rounded-[3rem]"><Image src={rainImage} alt="باران و طبیعت شمال ایران" width={1600} height={480} className="h-[320px] w-full rounded-[1.9rem] object-cover sm:h-[480px] sm:rounded-[2.6rem]" /></div>
        </div>
      </section>

      <section id="view" className="scroll-mt-32 py-20 sm:py-32"><div className="waresh-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16"><div className="overflow-hidden rounded-[2.2rem] bg-[#dce4d9] p-2 sm:rounded-[3rem] sm:p-3"><Image src={forestImage} alt="جنگل‌های سبز گیلان" width={1600} height={430} className="h-[300px] w-full rounded-[1.9rem] object-cover sm:h-[430px] sm:rounded-[2.5rem]" /></div><div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.2em] text-[#9d7842]">OUR POINT OF VIEW</p><h2 className="mt-4 text-3xl font-extrabold leading-[1.5] sm:mt-5 sm:text-5xl">ما می‌خواستیم بازار طلا هم همین حس را داشته باشد.</h2><p className="mt-6 text-base leading-8 text-[#70756d] sm:mt-7 sm:text-lg sm:leading-9">روشن، دقیق و بی‌هیاهو. جایی که تکنولوژی، داده و ابزارهای مالی پیچیده، پشت یک تجربه ساده و انسانی قرار بگیرند.</p><p className="mt-4 text-base leading-8 text-[#70756d] sm:mt-5 sm:text-lg sm:leading-9">وارش گلد از یک ریشه شمالی می‌آید، اما نگاهش رو به آینده است؛ از قیمت و محاسبه گرفته تا فروشگاه، دستیار هوشمند و زیرساختی که بتواند در آینده روی وب، موبایل و سرویس‌های دیگر رشد کند.</p><div className="mt-7 flex items-center gap-4 sm:mt-9"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e4eadf] text-[#a47d3f]">✦</span><div><p className="font-extrabold text-[#394239]">دقیق، آرام، ایرانی.</p><p className="mt-1 text-xs text-[#8a9188]">ریشه شمالی، نگاه رو به آینده</p></div></div></div></div></section>

      <section id="next" className="scroll-mt-32 bg-[#e9eee7] py-20 sm:py-24"><div className="waresh-container text-center"><p className="text-xs font-bold tracking-[0.2em] text-[#9d7842]">WARESH GOLD</p><h2 className="mt-4 text-3xl font-extrabold leading-[1.5] sm:text-4xl">از اینجا به بعد، داستان ادامه دارد.</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#70776e] sm:mt-5 sm:text-base sm:leading-8">فروشگاه و ابزارهای وارش در یک مسیر واحد کنار هم قرار می‌گیرند؛ با همان دقتی که از یک کسب‌وکار طلا انتظار داریم.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"><Link href="/" className="min-h-12 rounded-full bg-[#263b31] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1c2e26]">رفتن به فروشگاه</Link><Link href="/tools" className="min-h-12 rounded-full border border-[#cfc8bb] bg-[#faf8f2] px-6 py-3.5 text-sm font-bold text-[#4e554c] transition hover:border-[#bca878]">دیدن ابزارها</Link><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="min-h-12 rounded-full border border-[#cfc8bb] bg-transparent px-6 py-3.5 text-sm font-bold text-[#4e554c] transition hover:border-[#bca878]">گفتگو در تلگرام</a></div></div></section>

      <footer className="bg-[#1f2d26] py-10 text-white sm:py-12"><div className="waresh-container flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><div><Image src="/waresh-gold-logo-white.jpg" alt="وارش گلد" width={180} height={44} className="h-10 w-auto object-contain sm:h-11" /><p className="mt-3 max-w-sm text-xs leading-6 text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65"><Link className="transition hover:text-white" href="/">فروشگاه</Link><Link className="transition hover:text-white" href="/tools">ابزار طلا</Link><Link className="transition hover:text-white" href="/about">درباره وارش</Link><a className="transition hover:text-white" href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">تلگرام</a></div></div></footer>
    </main>
  );
}
