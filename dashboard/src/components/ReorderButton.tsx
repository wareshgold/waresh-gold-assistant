"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";
import { getProductVariants } from "@/data/productVariants";
import { addToCart } from "@/lib/cart";
import { getProducts } from "@/lib/products";

type ReorderItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

type Props = {
  items: ReorderItem[];
};

function findProduct(products: Product[], productId: string) {
  const numericId = Number(productId);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) return null;
  return products.find((product) => product.id === numericId) ?? null;
}

export default function ReorderButton({ items }: Props) {
  const router = useRouter();
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReorder = async () => {
    if (reordering || !items.length) return;

    setReordering(true);
    setError(null);

    try {
      const products = await getProducts();
      const resolved = items.map((item) => {
        const product = findProduct(products, item.productId);
        if (!product) throw new Error("یکی از محصولات این سفارش دیگر در کاتالوگ وارش موجود نیست.");

        const variant = getProductVariants(product).find((candidate) => candidate.id === item.variantId);
        if (!variant || !variant.available) {
          throw new Error(`مدل «${product.name}» در حال حاضر قابل سفارش نیست.`);
        }

        if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) {
          throw new Error("تعداد یکی از اقلام سفارش معتبر نیست.");
        }

        return { product, variantId: variant.id, quantity: item.quantity };
      });

      for (const item of resolved) {
        addToCart({
          productId: item.product.id,
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }

      router.push("/cart");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ثبت مجدد سفارش انجام نشد. دوباره تلاش کنید.");
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => void handleReorder()}
        disabled={reordering || !items.length}
        className="flex min-h-12 w-full items-center justify-center rounded-full border border-[#d9c69e] bg-[#fffaf0] px-5 py-3.5 text-sm font-bold text-[#765728] transition hover:bg-[#f8efdc] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {reordering ? "در حال آماده‌سازی..." : "ثبت مجدد سفارش"}
      </button>
      {error ? <p role="alert" className="mt-2 text-center text-[10px] leading-5 text-[#80594e]">{error}</p> : null}
    </div>
  );
}
