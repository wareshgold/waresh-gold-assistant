import type {
  MarketPrice,
  GoldBubble,
} from "@/types/market";
import type { Product } from "@/data/products";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://waresh-gold-assistant.wareshgold.workers.dev";

export const TELEGRAM_BOT_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "https://t.me/Wareshgoldbot";

export async function getMarketPrice(): Promise<MarketPrice> {
  const response = await fetch(`${API_BASE_URL}/market/gold-price`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch market price");
  }

  return response.json();
}

export async function getGoldBubble(): Promise<GoldBubble> {
  const response = await fetch(`${API_BASE_URL}/market/gold-bubble`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gold bubble");
  }

  return response.json();
}

type GoldCalculationResponse = {
  total: number;
};

export async function calculateProductPrice(
  product: Product,
  goldPrice: number,
): Promise<number> {
  const response = await fetch("/api/calc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      weight: product.weight,
      goldPrice,
      laborPercent: product.laborPercent,
      profitPercent: product.profitPercent,
      taxPercent: product.taxPercent,
    }),
  });

  const data = (await response.json().catch(() => null)) as GoldCalculationResponse | null;

  if (!response.ok || !data || typeof data.total !== "number") {
    throw new Error("Failed to calculate product price");
  }

  return data.total;
}

export async function calculateProductPrices(
  products: readonly Product[],
  goldPrice: number,
): Promise<Record<number, number>> {
  const results = await Promise.all(
    products.map(async (product) => {
      try {
        return [product.id, await calculateProductPrice(product, goldPrice)] as const;
      } catch {
        return [product.id, null] as const;
      }
    }),
  );

  return Object.fromEntries(
    results.filter((entry): entry is readonly [number, number] => entry[1] !== null),
  );
}
