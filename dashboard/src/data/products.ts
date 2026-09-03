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
  image: string;
  description: string;
  shippingNote: string;
}

const SHIPPING_NOTE = "هزینه ارسال به عهده مشتری می‌باشد.";

// Visual-only sample imagery selected to keep the demo catalog in one coherent jewelry style.
const IMAGE = {
  ringSimple: "https://images.pexels.com/photos/10581426/pexels-photo-10581426.jpeg?auto=compress&cs=tinysrgb&w=900",
  ringStone: "https://images.pexels.com/photos/12168877/pexels-photo-12168877.jpeg?auto=compress&cs=tinysrgb&w=900",
  ringPebbles: "https://images.pexels.com/photos/15945449/pexels-photo-15945449.jpeg?auto=compress&cs=tinysrgb&w=900",
  ringMinimal: "https://images.pexels.com/photos/17069421/pexels-photo-17069421.jpeg?auto=compress&cs=tinysrgb&w=900",
  earringsHoop: "https://images.pexels.com/photos/12194347/pexels-photo-12194347.jpeg?auto=compress&cs=tinysrgb&w=900",
  earringsMarble: "https://images.pexels.com/photos/10457796/pexels-photo-10457796.jpeg?auto=compress&cs=tinysrgb&w=900",
  earringsPearl: "https://images.pexels.com/photos/23495778/pexels-photo-23495778.jpeg?auto=compress&cs=tinysrgb&w=900",
  pendantSet: "https://images.pexels.com/photos/11062263/pexels-photo-11062263.jpeg?auto=compress&cs=tinysrgb&w=900",
  pendantHand: "https://images.pexels.com/photos/8542167/pexels-photo-8542167.jpeg?auto=compress&cs=tinysrgb&w=900",
  pendantStar: "https://images.pexels.com/photos/13325931/pexels-photo-13325931.jpeg?auto=compress&cs=tinysrgb&w=900",
  braceletWhite: "https://images.pexels.com/photos/12194338/pexels-photo-12194338.jpeg?auto=compress&cs=tinysrgb&w=900",
  braceletBeige: "https://images.pexels.com/photos/12168880/pexels-photo-12168880.jpeg?auto=compress&cs=tinysrgb&w=900",
  braceletDetail: "https://images.pexels.com/photos/12194337/pexels-photo-12194337.jpeg?auto=compress&cs=tinysrgb&w=900",
  braceletSoft: "https://images.pexels.com/photos/12194305/pexels-photo-12194305.jpeg?auto=compress&cs=tinysrgb&w=900",
  bangleSimple: "https://images.pexels.com/photos/12194309/pexels-photo-12194309.jpeg?auto=compress&cs=tinysrgb&w=900",
  necklaceCuban: "https://images.pexels.com/photos/14111400/pexels-photo-14111400.jpeg?auto=compress&cs=tinysrgb&w=900",
  necklacePendant: "https://images.pexels.com/photos/13292423/pexels-photo-13292423.jpeg?auto=compress&cs=tinysrgb&w=900",
  necklaceLifestyle: "https://images.pexels.com/photos/5386593/pexels-photo-5386593.jpeg?auto=compress&cs=tinysrgb&w=900",
  menChain: "https://images.pexels.com/photos/25724264/pexels-photo-25724264.jpeg?auto=compress&cs=tinysrgb&w=900",
  menRing: "https://images.pexels.com/photos/9120161/pexels-photo-9120161.jpeg?auto=compress&cs=tinysrgb&w=900",
  leatherGoldBlack: "https://www.orogoldgallery.com/wp-content/uploads/2022/06/NEW-20.jpg",
  leatherGoldBrown: "https://www.technolife.com/image/color_image_TLP-65738_f62e4b24_1d6fc40e-eeb0-4a53-ab14-559dd38804f7.png",
  leatherGoldMinimal: "https://www.technolife.com/image/color_image_TLP-299286_1cb8beeb-124b-4dbe-8a29-d47c1d8f5ff1.png",
  leatherGoldSlim: "https://www.gallerymoneh.com/wp-content/uploads/2025/08/slimy-design-men-gold-bracelet-01.jpg",
} as const;

export const PRODUCTS: Product[] = [
  { id: 1, name: "انگشتر ساده مخصوص هدیه", category: "کم-اجرت", subcategory: "انگشتر", weight: 1.2, laborPercent: 3, profitPercent: 7, taxPercent: 0, icon: "◌", image: IMAGE.ringSimple, description: "انگشتر ساده و ظریف، انتخابی مناسب برای هدیه", shippingNote: SHIPPING_NOTE },
  { id: 2, name: "گوشواره میخی مخصوص هدیه", category: "کم-اجرت", subcategory: "گوشواره", weight: 0.8, laborPercent: 4, profitPercent: 7, taxPercent: 0, icon: "◐", image: IMAGE.earringsHoop, description: "گوشواره میخی ساده و ظریف، مناسب هدیه", shippingNote: SHIPPING_NOTE },
  { id: 3, name: "پلاک کوچک مخصوص هدیه", category: "کم-اجرت", subcategory: "آویز", weight: 0.5, laborPercent: 5, profitPercent: 7, taxPercent: 0, icon: "✦", image: IMAGE.pendantSet, description: "پلاک کوچک و ظریف، انتخابی مناسب برای هدیه", shippingNote: SHIPPING_NOTE },
  { id: 4, name: "انگشتر نگین‌دار", category: "انگشتر", weight: 2.5, laborPercent: 6, profitPercent: 7, taxPercent: 0, icon: "◈", image: IMAGE.ringStone, description: "انگشتر با نگین درخشان", shippingNote: SHIPPING_NOTE },
  { id: 5, name: "انگشتر حلقه‌ای", category: "انگشتر", weight: 1.8, laborPercent: 5, profitPercent: 7, taxPercent: 0, icon: "○", image: IMAGE.ringPebbles, description: "انگشتر حلقه‌ای مینیمال", shippingNote: SHIPPING_NOTE },
  { id: 6, name: "انگشتر مردانه", category: "مردانه", weight: 4.2, laborPercent: 7, profitPercent: 7, taxPercent: 0, icon: "◉", image: IMAGE.menRing, description: "انگشتر مردانه شیک", shippingNote: SHIPPING_NOTE },
  { id: 7, name: "آویز قلب", category: "آویز", weight: 1.5, laborPercent: 8, profitPercent: 7, taxPercent: 0, icon: "♡", image: IMAGE.pendantHand, description: "آویز قلب ظریف", shippingNote: SHIPPING_NOTE },
  { id: 8, name: "آویز ستاره", category: "آویز", weight: 1.2, laborPercent: 6, profitPercent: 7, taxPercent: 0, icon: "✦", image: IMAGE.pendantStar, description: "آویز ستاره درخشان", shippingNote: SHIPPING_NOTE },
  { id: 9, name: "النگو ساده", category: "النگو", weight: 15.5, laborPercent: 4, profitPercent: 7, taxPercent: 0, icon: "◯", image: IMAGE.bangleSimple, description: "النگو ساده و شیک", shippingNote: SHIPPING_NOTE },
  { id: 10, name: "النگو طرح‌دار", category: "النگو", weight: 18.2, laborPercent: 9, profitPercent: 7, taxPercent: 0, icon: "◎", image: IMAGE.braceletBeige, description: "النگو با طرح خاص", shippingNote: SHIPPING_NOTE },
  { id: 11, name: "گوشواره آویزی", category: "گوشواره", weight: 1.8, laborPercent: 8, profitPercent: 7, taxPercent: 0, icon: "◒", image: IMAGE.earringsPearl, description: "گوشواره آویزی ظریف", shippingNote: SHIPPING_NOTE },
  { id: 12, name: "گوشواره میخی", category: "گوشواره", weight: 0.9, laborPercent: 5, profitPercent: 7, taxPercent: 0, icon: "◐", image: IMAGE.earringsMarble, description: "گوشواره میخی ساده", shippingNote: SHIPPING_NOTE },
  { id: 13, name: "گردنبند زنجیری", category: "گردنبند", weight: 5.5, laborPercent: 6, profitPercent: 7, taxPercent: 0, icon: "⌁", image: IMAGE.necklaceCuban, description: "گردنبند زنجیری ظریف", shippingNote: SHIPPING_NOTE },
  { id: 14, name: "گردنبند با پلاک", category: "گردنبند", weight: 3.2, laborPercent: 7, profitPercent: 7, taxPercent: 0, icon: "◇", image: IMAGE.necklacePendant, description: "گردنبند با پلاک زیبا", shippingNote: SHIPPING_NOTE },
  { id: 15, name: "دستبند زنجیری", category: "دستبند", weight: 4.5, laborPercent: 6, profitPercent: 7, taxPercent: 0, icon: "⌁", image: IMAGE.braceletDetail, description: "دستبند زنجیری مدرن", shippingNote: SHIPPING_NOTE },
  { id: 16, name: "دستبند النگویی", category: "دستبند", weight: 8.2, laborPercent: 7, profitPercent: 7, taxPercent: 0, icon: "◎", image: IMAGE.braceletSoft, description: "دستبند النگویی شیک", shippingNote: SHIPPING_NOTE },
  { id: 17, name: "انگشتر مردانه ساده", category: "مردانه", weight: 5.8, laborPercent: 5, profitPercent: 7, taxPercent: 0, icon: "◉", image: IMAGE.ringMinimal, description: "انگشتر مردانه ساده و شیک", shippingNote: SHIPPING_NOTE },
  { id: 18, name: "زنجیر مردانه", category: "مردانه", weight: 12.5, laborPercent: 10, profitPercent: 7, taxPercent: 0, icon: "⌁", image: IMAGE.menChain, description: "زنجیر مردانه ضخیم", shippingNote: SHIPPING_NOTE },
  { id: 19, name: "دستبند چرم مشکی مخصوص هدیه", category: "کم-اجرت", subcategory: "دستبند", weight: 0.24, laborPercent: 2, profitPercent: 7, taxPercent: 0, icon: "◍", image: IMAGE.leatherGoldBlack, description: "دستبند چرم مشکی با قطعه طلای ظریف؛ انتخابی سبک برای هدیه", shippingNote: SHIPPING_NOTE },
  { id: 20, name: "دستبند چرم قهوه‌ای مخصوص هدیه", category: "کم-اجرت", subcategory: "دستبند", weight: 0.28, laborPercent: 2, profitPercent: 7, taxPercent: 0, icon: "◍", image: IMAGE.leatherGoldBrown, description: "ترکیب چرم قهوه‌ای و طلای ظریف با ظاهر مردانه و مینیمال", shippingNote: SHIPPING_NOTE },
  { id: 21, name: "دستبند چرم مینیمال مخصوص هدیه", category: "کم-اجرت", subcategory: "دستبند", weight: 0.32, laborPercent: 3, profitPercent: 7, taxPercent: 0, icon: "◍", image: IMAGE.leatherGoldMinimal, description: "دستبند چرم و طلا با طراحی ساده برای استفاده روزمره", shippingNote: SHIPPING_NOTE },
  { id: 22, name: "دستبند چرم باریک مخصوص هدیه", category: "کم-اجرت", subcategory: "دستبند", weight: 0.35, laborPercent: 3, profitPercent: 7, taxPercent: 0, icon: "◍", image: IMAGE.leatherGoldSlim, description: "مدل باریک و سبک چرم و طلا برای یک هدیه جمع‌وجور", shippingNote: SHIPPING_NOTE },
];

export const PRODUCT_CATEGORIES: Array<{ value: ProductCategory; label: string }> = [
  { value: "کم-اجرت", label: "مخصوص هدیه" },
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
