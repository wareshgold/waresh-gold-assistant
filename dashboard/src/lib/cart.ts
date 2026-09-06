export type CartItem = {
  productId: number;
  variantId: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "waresh-cart";
export const CART_CHANGE_EVENT = "waresh:cart-change";

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const candidate = item as Record<string, unknown>;
    const productId = candidate.productId;
    const variantId = candidate.variantId;
    const quantity = candidate.quantity;

    if (!Number.isInteger(productId) || typeof variantId !== "string" || !variantId) return [];
    if (!Number.isInteger(quantity) || quantity < 1) return [];

    return [{ productId, variantId, quantity }];
  });
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return normalizeItems(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]): CartItem[] {
  const normalized = normalizeItems(items);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT, { detail: normalized }));
  }

  return normalized;
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = readCart();
  const existing = cart.find(
    (entry) => entry.productId === item.productId && entry.variantId === item.variantId,
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ ...item });
  }

  return writeCart(cart);
}

export function removeFromCart(productId: number, variantId: string): CartItem[] {
  return writeCart(
    readCart().filter(
      (item) => !(item.productId === productId && item.variantId === variantId),
    ),
  );
}

export function updateCartQuantity(
  productId: number,
  variantId: string,
  quantity: number,
): CartItem[] {
  if (quantity < 1) return removeFromCart(productId, variantId);

  return writeCart(
    readCart().map((item) =>
      item.productId === productId && item.variantId === variantId
        ? { ...item, quantity: Math.floor(quantity) }
        : item,
    ),
  );
}

export function getCartCount(items = readCart()): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
