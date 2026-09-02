"use client";

import { useEffect, useState } from "react";
import { TELEGRAM_BOT_URL } from "@/lib/api";

const links = [
  ["محصولات", "#products"],
  ["هدیه", "#gifts"],
  ["قیمت امروز", "#prices"],
  ["ابزار طلا", "/tools"],
  ["درباره وارش", "/about"],
] as const;

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8d2c7] bg-white/65 text-[#334238] transition hover:bg-white lg:hidden"
        aria-label="باز کردن منوی سایت"
        aria-expanded={open}
      >
        <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-3/4 bg-current" />
          <span className="h-px w-full bg-current" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#14251e]/65 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="بستن منو"
          />
          <aside className="waresh-mobile-menu absolute inset-y-0 right-0 flex w-[min(88vw,390px)] flex-col bg-[#faf8f2] px-7 pb-8 pt-6 shadow-[-30px_0_90px_rgba(16,30,24,0.2)]">
            <div className="flex items-center justify-between border-b border-[#e0ddd4] pb-5">
              <img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d2c7] text-xl text-[#39453d]"
                aria-label="بستن منو"
              >
                ×
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-2" aria-label="منوی موبایل">
              {links.map(([label, href], index) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between border-b border-[#e7e3d9] py-4 text-2xl font-extrabold text-[#29332d] transition hover:text-[#987238]"
                >
                  <span>{label}</span>
                  <span className="text-sm font-normal text-[#b28b4c] opacity-0 transition group-hover:opacity-100">0{index + 1}</span>
                </a>
              ))}
            </nav>

            <div className="border-t border-[#e0ddd4] pt-6">
              <p className="text-xs font-bold tracking-[0.18em] text-[#a17c45]">WARESH GOLD</p>
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#263b31] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#1c2e26]"
              >
                گفتگو و مشاوره در تلگرام
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
