import {
  PRODUCTS,
  type Product,
  type ProductCategory,
} from "@/data/products";
import {
  fetchCatalogProduct,
  fetchCatalogProductServer,
  fetchCatalogProducts,
  fetchCatalogProductsServer,
  type CatalogProduct,
} from "@/lib/catalogApi";

const FALLBACK_IMAGE = "/waresh-gold-logo-green.png";
const FALLBACK_DESCRIPTION = "محصول ثبت‌شده در کاتالوگ وارش گلد.";
const SHIPPING_NOTE = "هزینه ارسال به عهده مشتری می‌باشد.";

const visualById = new Map(PRODUCTS.map((product) => [String(product.id), product]));

function toProduct(item: CatalogProduct): Product {
  const visual = visualById.get(item.productId);
  const productId = Number(item.productId);
  const category = item.category as ProductCategory;

  return {
    ...(visual ?? {
      id: productId,
      name: item.name,
      category,
      subcategory: item.subcategory ?? undefined,
      weight: item.weightGrams,
      karat: item.karat,
      laborPercent: item.laborPercent,
      profitPercent: item.profitPercent,
      taxPercent: item.taxPercent,
      icon: "◌",
      image: FALLBACK_IMAGE,
      description: FALLBACK_DESCRIPTION,
      shippingNote: SHIPPING_NOTE,
    }),
    id: productId,
    sku: item.sku,
    name: item.name,
    category,
    subcategory: item.subcategory ?? undefined,
    weight: item.weightGrams,
    karat: item.karat,
    laborPercent: item.laborPercent,
    profitPercent: item.profitPercent,
    taxPercent: item.taxPercent,
    stockStatus: item.stockStatus,
  };
}

export function mergeCatalogProducts(catalog: readonly CatalogProduct[]): Product[] {
  return catalog.filter((item) => item.active).map(toProduct);
}

export function mergeCatalogProduct(catalogProduct: CatalogProduct | null): Product | null {
  if (!catalogProduct || !catalogProduct.active) return null;
  return toProduct(catalogProduct);
}

/**
 * Client-side product access. The catalog transport uses the Next.js API route.
 */
export async function getProducts(): Promise<Product[]> {
  const catalog = await fetchCatalogProducts();
  return mergeCatalogProducts(catalog);
}

/**
 * Client-side product access by ID.
 */
export async function getProduct(productId: string): Promise<Product | null> {
  const catalogProduct = await fetchCatalogProduct(productId);
  return mergeCatalogProduct(catalogProduct);
}

/**
 * Server-side product access. This bypasses the dashboard API route and talks
 * directly to the platform catalog service.
 */
export async function getProductsServer(): Promise<Product[]> {
  const catalog = await fetchCatalogProductsServer();
  return mergeCatalogProducts(catalog);
}

/**
 * Server-side product access by ID.
 */
export async function getProductServer(productId: string): Promise<Product | null> {
  const catalogProduct = await fetchCatalogProductServer(productId);
  return mergeCatalogProduct(catalogProduct);
}

export function getStaticProduct(productId: string): Product | null {
  const id = Number(productId);
  if (!Number.isInteger(id)) return null;
  return PRODUCTS.find((product) => product.id === id) ?? null;
}
