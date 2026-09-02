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
  price: number;
  icon: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: "انگشتر ساده کم اجرت", category: "کم-اجرت", subcategory: "انگشتر", weight: 1.2, price: 3500000, icon: "◌", description: "انگشتر ساده با اجرت پایین" },
  { id: 2, name: "گوشواره میخی کم اجرت", category: "کم-اجرت", subcategory: "گوشواره", weight: 0.8, price: 2400000, icon: "◐", description: "گوشواره میخی ساده و ظریف" },
  { id: 3, name: "پلاک کوچک کم اجرت", category: "کم-اجرت", subcategory: "آویز", weight: 0.5, price: 1500000, icon: "✦", description: "پلاک کوچک مناسب هدیه" },
  { id: 4, name: "انگشتر نگین‌دار", category: "انگشتر", weight: 2.5, price: 7500000, icon: "◈", description: "انگشتر با نگین درخشان" },
  { id: 5, name: "انگشتر حلقه‌ای", category: "انگشتر", weight: 1.8, price: 5400000, icon: "○", description: "انگشتر حلقه‌ای مینیمال" },
  { id: 6, name: "انگشتر مردانه", category: "مردانه", weight: 4.2, price: 12600000, icon: "◉", description: "انگشتر مردانه شیک" },
  { id: 7, name: "آویز قلب", category: "آویز", weight: 1.5, price: 4500000, icon: "♡", description: "آویز قلب ظریف" },
  { id: 8, name: "آویز ستاره", category: "آویز", weight: 1.2, price: 3600000, icon: "✦", description: "آویز ستاره درخشان" },
  { id: 9, name: "النگو ساده", category: "النگو", weight: 15.5, price: 46500000, icon: "◯", description: "النگو ساده و شیک" },
  { id: 10, name: "النگو طرح‌دار", category: "النگو", weight: 18.2, price: 54600000, icon: "◎", description: "النگو با طرح خاص" },
  { id: 11, name: "گوشواره آویزی", category: "گوشواره", weight: 1.8, price: 5400000, icon: "◒", description: "گوشواره آویزی ظریف" },
  { id: 12, name: "گوشواره میخی", category: "گوشواره", weight: 0.9, price: 2700000, icon: "◐", description: "گوشواره میخی ساده" },
  { id: 13, name: "گردنبند زنجیری", category: "گردنبند", weight: 5.5, price: 16500000, icon: "⌁", description: "گردنبند زنجیری ظریف" },
  { id: 14, name: "گردنبند با پلاک", category: "گردنبند", weight: 3.2, price: 9600000, icon: "◇", description: "گردنبند با پلاک زیبا" },
  { id: 15, name: "دستبند زنجیری", category: "دستبند", weight: 4.5, price: 13500000, icon: "⌁", description: "دستبند زنجیری مدرن" },
  { id: 16, name: "دستبند النگویی", category: "دستبند", weight: 8.2, price: 24600000, icon: "◎", description: "دستبند النگویی شیک" },
  { id: 17, name: "انگشتر مردانه ساده", category: "مردانه", weight: 5.8, price: 17400000, icon: "◉", description: "انگشتر مردانه ساده و شیک" },
  { id: 18, name: "زنجیر مردانه", category: "مردانه", weight: 12.5, price: 37500000, icon: "⌁", description: "زنجیر مردانه ضخیم" },
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
