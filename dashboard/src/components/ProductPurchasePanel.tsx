"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { getProductVariants } from "@/data/productVariants";
import AddToCartButton from "@/components/AddToCartButton";

type ProductPurchasePanelProps = {
  product: Product;
};

export default function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const variants = useMemo(() => getProductVariants(product), [product]);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "default-standard");
  const selectedVariant = variants.find((variant) => variant.id === variantId) ?? variants[0];

  const hasColors = variants.some((variant) => variant.color);
  const hasSizes = variants.some((variant) => variant.size);

  return (
    <div className="mt-4 rounded-[1.75rem] border border-[#ded8cc] bg-[#fffdf8] p-5 sm:p-6">
      {(hasColors || hasSizes) && (
        <div className="space-y-5">
          {hasColors && (
            <div>
              <p className="text-xs font-bold text-[#55584f]">انتخاب مدل</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setVariantId(variant.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${variant.id === variantId ? "border-[#b28b4c] bg-[#f5ead5] text-[#765728]" : "border-[#ded8cc] bg-white text-[#6e7169] hover:border-[#cdb27c]"}`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasColors && hasSizes && (
            <div>
              <p className="text-xs font-bold text-[#55584f]">انتخاب سایز</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setVariantId(variant.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${variant.id === variantId ? "border-[#b28b4c] bg-[#f5ead5] text-[#765728]" : "border-[#ded8cc] bg-white text-[#6e7169] hover:border-[#cdb27c]"}`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedVariant && <p className="text-[11px] text-[#88877f]">مدل انتخاب‌شده: {selectedVariant.label}</p>}
        </div>
      )}

      <AddToCartButton
        productId={product.id}
        variantId={selectedVariant?.id ?? "default-standard"}
        disabled={!selectedVariant?.available}
      />
    </div>
  );
}
