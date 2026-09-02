import { TELEGRAM_BOT_URL } from "@/lib/api";

const rainImage = "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1600&q=85";
const forestImage = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=85";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1e9] text-[#292b26]">
      <header className="border-b border-[#dedfd7] bg-[#faf8f2]/95">
        <div className="waresh-container flex h-20 items-center justify-between gap-5">
          <a href="/" aria-label="بازگشت به خانه"><img src="/tools/waresh-gold-logo-green.png" alt="وارش گلد" className="h-12 w-auto" /></a>
          <nav className="flex items-center gap-6 text-sm font-semibold text-[#646a61]"><a href="/">فروشگاه</a><a href="/tools">ابزار طلا</a><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">تلگرام</a></nav>
        </div>
      </header>

      <section className="relative bg-[#23372d] py-28 text-white sm:py-36">
        <div className="waresh-container relative grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
          <div><p className="text-xs font-bold tracking-[0.24em] text-[#d7bf8b]">THE WARESH STORY</p><h1 className="mt-6 text-5xl font-extrabold leading-[1.4] sm:text-7xl">وارش یعنی باران؛<span className="block text-[#d8bd7e]">و قصه‌ی ما از همین‌جا شروع می‌شود.</span></h1><p className="mt-7 max-w-2xl text-lg leading-9 text-[#d8e0d9]">باران در شمال، فقط از آسمان نمی‌بارد؛ در کوچه‌ها، جنگل‌ها و ریتم زندگی می‌نشیند. «وارش» از همین واژه و همین حال‌وهوا آمده است.</p></div>
          <div className="overflow-hidden rounded-[3rem] border border-white/15 bg-white/10 p-2 shadow-[0_35px_90px_rgba(0,0,0,0.25)]"><img src={rainImage} alt="باران و طبیعت شمال ایران" className="h-[480px] w-full rounded-[2.6rem] object-cover" /></div>
        </div>
      </section>

      <section className="py-24 sm:py-32"><div className="waresh-container grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div className="overflow-hidden rounded-[3rem] bg-[#dce4d9] p-3"><img src={forestImage} alt="جنگل‌های سبز گیلان" className="h-[430px] w-full rounded-[2.5rem] object-cover" /></div><div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.2em] text-[#9d7842]">OUR POINT OF VIEW</p><h2 className="mt-5 text-4xl font-extrabold leading-[1.5] sm:text-5xl">ما می‌خواستیم بازار طلا هم همین حس را داشته باشد.</h2><p className="mt-7 text-lg leading-9 text-[#70756d]">روشن، دقیق و بی‌هیاهو. جایی که تکنولوژی، داده و ابزارهای مالی پیچیده، پشت یک تجربه ساده و انسانی قرار بگیرند.</p><p className="mt-5 text-lg leading-9 text-[#70756d]">وارش گلد از یک ریشه شمالی می‌آید، اما نگاهش رو به آینده است؛ از قیمت و محاسبه گرفته تا فروشگاه، دستیار هوشمند و زیرساختی که بتواند در آینده روی وب، موبایل و سرویس‌های دیگر رشد کند.</p><div className="mt-9 flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4eadf] text-[#a47d3f]">✦</span><div><p className="font-extrabold text-[#394239]">دقیق، آرام، ایرانی.</p><p className="mt-1 text-xs text-[#8a9188]">ریشه شمالی، نگاه رو به آینده</p></div></div></div></div></section>

      <section className="bg-[#e9eee7] py-24"><div className="waresh-container text-center"><p className="text-xs font-bold tracking-[0.2em] text-[#9d7842]">WARESH GOLD</p><h2 className="mt-4 text-4xl font-extrabold">از اینجا به بعد، داستان ادامه دارد.</h2><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#70776e]">فروشگاه و ابزارهای وارش در یک مسیر واحد کنار هم قرار می‌گیرند؛ با همان دقتی که از یک کسب‌وکار طلا انتظار داریم.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href="/" className="rounded-full bg-[#263b31] px-6 py-3.5 text-sm font-bold text-white">رفتن به فروشگاه</a><a href="/tools" className="rounded-full border border-[#cfc8bb] bg-[#faf8f2] px-6 py-3.5 text-sm font-bold text-[#4e554c]">دیدن ابزارها</a></div></div></section>
    </main>
  );
}
