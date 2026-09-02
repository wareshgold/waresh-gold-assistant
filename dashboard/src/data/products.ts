export type ProductCategory =
  | "کم-اجرت"
  | "انگشتر"
  | "آویز"
  | "النگو"
  | "گوشواره"
  | "گردنبند"
  | "دستبند"
  | "مردانه";

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  subcategory?: string;
  weight: number;
  laborPercent: number;
  profitPercent: number;
  taxPercent: number;
  icon: string;
  description: string;
  shippingNote: string;
}

const SHIPPING_NOTE = "هزینه ارسال به عهده مشتری می‌باشد.";

export const PRODUCTS: Product[] = [
  { id: 1, name: "انگشتر ساده کم اجرت", category: "کم-اجرت", subcategory: "انگشتر", weight: 1.2, laborPercent: 3, profitPercent: 7, taxPercent: 0, icon: "◌", description: "انگشتر ساده با اجرت پایین", shippingNote: SHIPPING_NOTE },
  { id: 2, name: "گوشواره میخی کم اجرت", category: "کم-اجرت", subcategory: "گوشواره", weight: 0.8, laborPercent: 4, profitPercent: 7, taxPercent: 0, icon: "◐", description: "گوشواره میخی ساده و ظریف", shippingNote: SHIPPING_NOTE },
  { id: 3, name: "پلاک کوچک کم اجرت", category: "کم-اجرت", subcategory: "آویز", weight: 0.5, laborPercent: 5, profitPercent: 7, taxPercent: 0, icon: "✦", description: "پلاک کوچک مناسب هدیه", shippingNote: SHIPPING_NOTE },
  { id: 4, name: "انگشتر نگین‌دار", category: "انگشتر", weight: 2.5, laborPercent: 6, profitPercent: 7, taxPercent: 0, icon: "◈", description: "انگشتر با نگین درخشان", shippingNote: SHIPPING_NOTE },
  { id: 5, name: "انگشتر حلقه‌ای", category: "انگشتر", weight: 1.8, laborPercent: 5, profitPercent: 7, taxPercent: 0, icon: "○", description: "انگشتر حلقه‌ای مینیمال", shippingNote: SHIPPING_NOTE },
  { id: 6, name: "انگشتر مردانه", category: "مردانه", weight: 4.2, laborPercent: 7, profitPercent: 7, taxPercent: 0, icon: "◉", description: "انگشتر مردانه شیک", shippingNote: SHIPPING_NOTE },
  { id: 7, name: "آویز قلب", category: "آویز", weight: 1.5, laborPercent: 8, profitPercent: 7, taxPercent: 0, icon: "♡", description: "آویز قلب ظریف", shippingNote: SHIPPING_NOTE },
  { id: 8, name: "آویز ستاره", category: "آویز", weight: 1.2, laborPercent: 6, profitPercent: 7, taxPercent: 0, icon: "✦", description: "آویز ستاره درخشان", shippingNote: SHIPPING_NOTE },
  { id: 9, name: "النگو ساده", category: "النگو", weight: 15.5, laborPercent: 4, profitPercent: 7, taxPercent: 0, icon: "◯", description: "النگو ساده و شیک", shippingNote: SHIPPING_NOTE },
  { id: 10, name: "النگو طرح‌دار", category: "النگو", weight: 18.2, laborPercent: 9, profitPercent: 7, taxPercent: 0, icon: "◎", description: "النگو با طرح خاص", shippingNote: SHIPPING_NOTE },
  { id: 11, name: "گوشواره آویزی", category: "گوشواره", weight: 1.8, laborPercent: 8, profitPercent: 7, taxPercent: 0, icon: "◒", description: "گوشواره آویزی ظریف", shippingNote: SHIPPING_NOTE },
  { id: 12, name: "گوشواره میخی", category: "گوشواره", weight: 0.9, laborPercent: 5, profitPercent: 7, taxPercent: 0, icon: "◐", description: "گوشواره میخی ساده", shippingNote: SHIPPING_NOTE },
  { id: 13, name: "گردنبند زنجیری", category: "گردنبند", weight: 5.5, laborPercent: 6, profitPercent: 7, taxPercent: 0, icon: "⌁", description: "گردنبند زنجیری ظریف", shippingNote: SHIPPING_NOTE },
  { id: 14, name: "گردنبند با پلاک", category: "گردنبند", weight: 3.2, laborPercent: 7, profitPercent: 7, taxPercent: 0, icon: "◇", description: "گردنبند با پلاک زیبا", shippingNote: SHIPPING_NOTE },
  { id: 15, name: "دستبند زنجیری", category: "دستبند", weight: 4.5, laborPercent: 6, profitPercent: 7, taxPercent: 0, icon: "⌁", description: "دستبند زنجیری مدرن", shippingNote: SHIPPING_NOTE },
  { id: 16, name: "دستبند النگویی", category: "دستبند", weight: 8.2, laborPercent: 7, profitPercent: 7, taxPercent: 0, icon: "◎", description: "دستبند النگویی شیک", shippingNote: SHIPPING_NOTE },
  { id: 17, name: "انگشتر مردانه ساده", category: "مردانه", weight: 5.8, laborPercent: 5, profitPercent: 7, taxPercent: 0, icon: "◉", description: "انگشتر مردانه ساده و شیک", shippingNote: SHIPPING_NOTE },
  { id: 18, name: "زنجیر مردانه", category: "مردانه", weight: 12.5, laborPercent: 10, profitPercent: 7, taxPercent: 0, icon: "⌁", description: "زنجیر مردانه ضخیم", shippingNote: SHIPPING_NOTE },
];

export const PRODUCT_CATEGORIES: Array<{ value: ProductCategory; label: string }> = [
  { value: "کم-اجرت", label: "کم اجرت" },
  { value: "انگشتر", label: "انگشتر" },
  { value: "آویز", label: "آویز" },
  { value: "النگو", label: "النگو" },
  { value: "گوشواره", label: "گوشواره" },
  { value: "گردنبند", label: "گردنبند" },
  { value: "دستبند", label: "دستبند" },
  { value: "مردانه", label: "مردانه" },
];

export function formatToman(value: number): string {
  return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value)} تومان`;
}

export function formatWeight(value: number): string {
  return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(value)} گرم`;
}
