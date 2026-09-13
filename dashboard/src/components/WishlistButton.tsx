"use client";

import { useEffect, useState } from "react";

type WishlistButtonProps = {
  productId: number | string;
  size?: "sm" | "md";
  className?: string;
  onActiveChange?: (active: boolean) => void;
};

type WishlistResponse = { items?: Array<{ productId: string }>; error?: string };

export default function WishlistButton({ productId, size = "md", className = "", onActiveChange }: WishlistButtonProps) {
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/account/wishlist", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<WishlistResponse>;
      })
      .then((payload) => {
        if (cancelled) return;
        const nextActive = Boolean(payload?.items?.some((item) => item.productId === String(productId)));
        setActive(nextActive);
        onActiveChange?.(nextActive);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [productId, onActiveChange]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const response = active
        ? await fetch(`/api/account/wishlist/${encodeURIComponent(String(productId))}`, { method: "DELETE" })
        : await fetch("/api/account/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: String(productId) }),
          });
      const payload = await response.json().catch(() => ({})) as WishlistResponse;
      if (response.status === 401) {
        window.location.href = `/account?returnTo=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (!response.ok) throw new Error(payload.error || "عملیات علاقه‌مندی انجام نشد.");
      const nextActive = !active;
      setActive(nextActive);
      onActiveChange?.(nextActive);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "عملیات علاقه‌مندی انجام نشد.");
    } finally {
      setBusy(false);
    }
  };

  const dimensions = size === "sm" ? "h-10 w-10" : "h-11 w-11";

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={busy}
      aria-pressed={active}
      aria-busy={busy}
      aria-label={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      title={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={`inline-flex ${dimensions} shrink-0 items-center justify-center rounded-full border border-[#ded8cc] bg-white/90 text-lg text-[#9b753c] shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#cdb27c] hover:bg-[#fbf6ea] disabled:cursor-wait disabled:opacity-60 ${active ? "border-[#cdb27c] bg-[#f7efdf] text-[#8f682f]" : ""} ${className}`}
    >
      <span aria-hidden="true">{active ? "♥" : "♡"}</span>
    </button>
  );
}
