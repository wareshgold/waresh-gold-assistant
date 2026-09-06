"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  productId: number;
  variantId: string;
  disabled?: boolean;
};

export default function AddToCartButton({ productId, variantId, disabled = false }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (disabled) return;
    addToCart({ productId, variantId, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-[#cdb27c] bg-[#b28b4c] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(178,139,76,0.18)] transition hover:-translate-y-0.5 hover:bg-[#9d773d] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
    >
      {disabled ? "ناموجود" : added ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
    </button>
  );
}
