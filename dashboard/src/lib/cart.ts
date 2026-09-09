export type CartItem = {
  productId: number;
  variantId: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "waresh-cart";
export const CART_CHANGE_EVENT = "waresh:cart-change";
export const MAX_CART_ITEM_QUANTITY = 99;
export const MAX_CART_ITEMS = 50;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function isValidCartItem(item: unknown): item is CartItem {
  if (!isRecord(item)) return false;

  return (
    typeof item.productId === "number" &&
    Number.isSafeInteger(item.productId) &&
    item.productId > 0 &&
    typeof item.variantId === "string" &&
    item.variantId.trim().length > 0 &&
    item.variantId.length <= 128 &&
    typeof item.quantity === "number" &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= MAX_CART_ITEM_QUANTITY
  );
}

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  const normalized: CartItem[] = [];
  const indexByKey = new Map<string, number>();

  for (const item of value) {
    if (!isValidCartItem(item)) continue;

    const variantId = item.variantId.trim();
    const key = `${item.productId}:${variantId}`;
    const existingIndex = indexByKey.get(key);

    if (existingIndex === undefined) {
      if (normalized.length >= MAX_CART_ITEMS) break;
      indexByKey.set(key, normalized.length);
      normalized.push({
        productId: item.productId,
        variantId,
        quantity: item.quantity,
      });
      continue;
    }

    const existing = normalized[existingIndex];
    existing.quantity = Math.min(
      MAX_CART_ITEM_QUANTITY,
      existing.quantity + item.quantity,
    );
  }

  return normalized;
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
  if (!isValidCartItem(item)) return readCart();

  const cart = readCart();
  const variantId = item.variantId.trim();
  const existing = cart.find(
    (entry) => entry.productId === item.productId && entry.variantId === variantId,
  );

  if (existing) {
    existing.quantity = Math.min(
      MAX_CART_ITEM_QUANTITY,
      existing.quantity + item.quantity,
    );
  } else if (cart.length < MAX_CART_ITEMS) {
    cart.push({
      productId: item.productId,
      variantId,
      quantity: item.quantity,
    });
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
  if (!Number.isFinite(quantity)) return readCart();
  if (quantity < 1) return removeFromCart(productId, variantId);

  const normalizedQuantity = Math.min(
    MAX_CART_ITEM_QUANTITY,
    Math.floor(quantity),
  );

  if (normalizedQuantity < 1) return removeFromCart(productId, variantId);

  return writeCart(
    readCart().map((item) =>
      item.productId === productId && item.variantId === variantId
        ? { ...item, quantity: normalizedQuantity }
        : item,
    ),
  );
}

export function getCartCount(items = readCart()): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
