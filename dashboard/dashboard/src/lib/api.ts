import type { MarketPrice } from "@/types/market";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://waresh-gold-assistant.wareshgold.workers.dev";

export async function getMarketPrice(): Promise<MarketPrice> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/market/gold-price`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch market price");
  }

  return response.json();
}