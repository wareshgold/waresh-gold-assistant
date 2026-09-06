import type { Product, ProductColor } from "@/data/products";

export type ProductVariant = {
  id: string;
  label: string;
  color?: ProductColor;
  size?: string;
  weight: number;
  available: boolean;
};

const COLOR_LABELS: Record<ProductColor, string> = {
  "yellow-gold": "طلایی",
  "white-gold": "طلای سفید",
  "rose-gold": "رزگلد",
};

export function getProductVariants(product: Product): ProductVariant[] {
  const colors = product.availableColors?.length
    ? product.availableColors
    : product.color
      ? [product.color]
      : [undefined];
  const sizes = product.sizes?.length ? product.sizes : [undefined];

  return colors.flatMap((color) =>
    sizes.map((size) => {
      const id = [color ?? "default", size ?? "standard"].join("-");
      const label = [
        color ? COLOR_LABELS[color] : null,
        size ? `سایز ${size}` : null,
      ]
        .filter(Boolean)
        .join(" · ") || "مدل استاندارد";

      return {
        id,
        label,
        color,
        size,
        weight: product.weight,
        available: product.stockStatus !== "out-of-stock",
      };
    }),
  );
}

export function getVariantLabel(product: Product, variantId: string): string {
  return getProductVariants(product).find((variant) => variant.id === variantId)?.label ?? "مدل استاندارد";
}
