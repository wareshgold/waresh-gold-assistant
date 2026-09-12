import type { Metadata } from "next";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import CustomerAccountPanel from "@/components/CustomerAccountPanel";
import CustomerOrderHistory from "@/components/CustomerOrderHistory";

export const metadata: Metadata = {
  title: "حساب کاربری | وارش گلد",
  description: "ورود و مدیریت حساب کاربری وارش گلد",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl">
        <div className="waresh-container flex h-[76px] items-center justify-between gap-4">
          <Link href="/" aria-label="وارش گلد" className="shrink-0"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto object-contain" /></Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex" aria-label="ناوبری اصلی">
            <Link className="waresh-link" href="/#products">محصولات</Link>
            <Link className="waresh-link" href="/#gifts">هدیه</Link>
            <Link className="waresh-link" href="/#prices">قیمت امروز</Link>
            <Link className="waresh-link" href="/tools">ابزار طلا</Link>
            <Link className="waresh-link" href="/about">درباره وارش</Link>
          </nav>
          <div className="flex items-center gap-2"><Link href="/cart" className="hidden min-h-11 items-center rounded-full border border-[#d9c69e] bg-[#fffaf0] px-4 text-xs font-bold text-[#765728] sm:inline-flex">سبد خرید</Link><MobileMenu /></div>
        </div>
      </header>

      <section className="waresh-container py-10 sm:py-16 lg:py-20">
        <div className="mb-6 flex justify-end"><Link href="/account/addresses" className="inline-flex min-h-11 items-center rounded-full border border-[#d9cfc1] bg-white px-5 text-xs font-bold text-[#765728]">مدیریت کامل آدرس‌ها</Link></div>
        <CustomerAccountPanel />
        <CustomerOrderHistory />
      </section>

      <footer className="bg-[#1f2d26] py-10 text-white"><div className="waresh-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><img src="/waresh-gold-logo-white.jpg" alt="وارش گلد" className="h-10 w-auto object-contain" /><p className="mt-3 text-xs text-white/45">فروشگاه طلا و ابزارهای دقیق وارش؛ ریشه شمالی، نگاه رو به آینده.</p></div><Link href="/" className="text-sm text-white/65">بازگشت به فروشگاه</Link></div></footer>
    </main>
  );
}
