"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "waresh-wishlist";
const WISHLIST_CHANGE_EVENT = "waresh:wishlist-change";

type WishlistButtonProps = {
  productId: number;
  size?: "sm" | "md";
  className?: string;
};

function readWishlist(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is number => Number.isInteger(value));
  } catch {
    return [];
  }
}

export default function WishlistButton({ productId, size = "md", className = "" }: WishlistButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const syncWishlistState = () => {
      setActive(readWishlist().includes(productId));
    };

    syncWishlistState();
    window.addEventListener(WISHLIST_CHANGE_EVENT, syncWishlistState);
    window.addEventListener("storage", syncWishlistState);

    return () => {
      window.removeEventListener(WISHLIST_CHANGE_EVENT, syncWishlistState);
      window.removeEventListener("storage", syncWishlistState);
    };
  }, [productId]);

  const toggle = () => {
    const wishlist = readWishlist();
    const next = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setActive(next.includes(productId));
    window.dispatchEvent(new CustomEvent(WISHLIST_CHANGE_EVENT, { detail: next }));
  };

  const dimensions = size === "sm" ? "h-10 w-10" : "h-11 w-11";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      title={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={`inline-flex ${dimensions} shrink-0 items-center justify-center rounded-full border border-[#ded8cc] bg-white/90 text-lg text-[#9b753c] shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#cdb27c] hover:bg-[#fbf6ea] ${active ? "border-[#cdb27c] bg-[#f7efdf] text-[#8f682f]" : ""} ${className}`}
    >
      <span aria-hidden="true">{active ? "♥" : "♡"}</span>
    </button>
  );
}
