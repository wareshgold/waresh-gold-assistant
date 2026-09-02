import type {
  MarketPrice,
  GoldBubble,
} from "@/types/market";

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
