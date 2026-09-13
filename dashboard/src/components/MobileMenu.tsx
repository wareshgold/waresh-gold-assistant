"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TELEGRAM_BOT_URL } from "@/lib/api";
import { clearCustomerProfile, readCustomerProfile, saveCustomerProfile, type CustomerProfile } from "@/lib/customerAccount";

type CustomerApi = { customerId: string; username: string; phone: string; firstName: string; lastName: string; addresses?: CustomerProfile["addresses"] };

const links = [["محصولات", "/#products"], ["هدیه", "/#gifts"], ["قیمت امروز", "/#prices"], ["ابزار طلا", "/tools"], ["درباره وارش", "/about"], ["حساب کاربری", "/account"]] as const;

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(() => readCustomerProfile());

  useEffect(() => {
    const sync = () => setProfile(readCustomerProfile());
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json().catch(() => null) as { customer?: CustomerApi } | null;
        if (response.ok && data?.customer) setProfile(saveCustomerProfile({ ...data.customer, addresses: data.customer.addresses ?? [] }));
        else if (response.status === 401) { clearCustomerProfile(); setProfile(null); }
        else sync();
      } catch { sync(); }
    };
    window.addEventListener("waresh:account-change", sync);
    void loadSession();
    return () => window.removeEventListener("waresh:account-change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.removeProperty("overflow"); };
  }, [open]);

  const displayName = profile ? (`${profile.firstName} ${profile.lastName}`.trim() || profile.username || "مشتری وارش") : "";
  const menu = open ? (
    <div className="waresh-mobile-menu-root fixed inset-0 z-[2147483647] isolate overflow-hidden bg-[#faf8f2]">
      <button type="button" className="waresh-mobile-menu-backdrop absolute inset-0 z-0 bg-[#14251e]/72 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="بستن منو" />
      <aside className="waresh-mobile-menu absolute inset-y-0 right-0 z-10 flex w-[min(92vw,410px)] flex-col bg-[#faf8f2] px-6 pb-7 pt-5 shadow-[-30px_0_90px_rgba(16,30,24,0.2)] sm:px-7 sm:pt-6" role="dialog" aria-modal="true" aria-label="منوی سایت وارش گلد">
        <div className="flex min-h-[64px] items-center justify-between border-b border-[#e0ddd4] pb-4">
          <Link href="/" onClick={() => setOpen(false)} aria-label="صفحه اصلی وارش گلد" className="shrink-0"><Image src="/waresh-gold-logo-green.png" alt="وارش گلد" width={165} height={44} className="h-11 w-auto" /></Link>
          <button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d8d2c7] text-[22px] leading-none text-[#39453d] transition hover:bg-white" aria-label="بستن منو">×</button>
        </div>
        {profile ? <Link href="/account" onClick={() => setOpen(false)} className="mt-5 rounded-2xl border border-[#d9c69e] bg-[#fffaf0] p-4"><p className="text-[10px] font-bold tracking-[0.16em] text-[#9b7b48]">حساب کاربری</p><p className="mt-2 text-sm font-extrabold text-[#263b31]">{displayName}</p><p className="mt-1 text-[11px] text-[#777970]" dir="ltr">@{profile.username}</p></Link> : null}
        <nav className="flex flex-1 flex-col justify-center gap-0.5" aria-label="منوی اصلی سایت">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-[62px] items-center border-b border-[#e7e3d9] text-[22px] font-extrabold text-[#29332d] transition-colors hover:text-[#987238] active:text-[#987238]">{label}</Link>)}
        </nav>
        <div className="border-t border-[#e0ddd4] pt-5"><p className="text-[10px] font-bold tracking-[0.2em] text-[#a17c45]">WARESH GOLD</p><a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#263b31] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1c2e26]">گفتگو و مشاوره در تلگرام</a></div>
      </aside>
    </div>
  ) : null;

  return <><div className="flex items-center gap-2"><Link href="/account" className="hidden min-h-11 max-w-[190px] items-center gap-2 truncate rounded-full border border-[#d9c69e] bg-[#fffaf0] px-4 text-xs font-bold text-[#765728] lg:inline-flex">{profile ? `سلام، ${displayName}` : "ورود به حساب"}</Link><button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8d2c7] bg-white/65 text-[#334238] transition hover:bg-white" aria-label="باز کردن منوی سایت" aria-expanded={open} aria-haspopup="dialog"><span className="flex w-5 flex-col gap-1.5" aria-hidden="true"><span className="h-px w-full bg-current" /><span className="h-px w-3/4 bg-current" /><span className="h-px w-full bg-current" /></span></button></div>{typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}</>;
}
