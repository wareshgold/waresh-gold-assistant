const PRODUCTS = [
    { id: 1, name: "انگشتر ساده کم اجرت", category: "کم-اجرت", subcategory: "انگشتر", weight: 1.2, price: 3500000, emoji: "💍", description: "انگشتر ساده با اجرت پایین" },
    { id: 2, name: "گوشواره میخی کم اجرت", category: "کم-اجرت", subcategory: "گوشواره", weight: 0.8, price: 2400000, emoji: "👂", description: "گوشواره میخی ساده" },
    { id: 3, name: "پلاک کوچک کم اجرت", category: "کم-اجرت", subcategory: "آویز", weight: 0.5, price: 1500000, emoji: "✨", description: "پلاک کوچک مناسب هدیه" },
    { id: 4, name: "انگشتر نگین‌دار", category: "انگشتر", weight: 2.5, price: 7500000, emoji: "💍", description: "انگشتر با نگین درخشان" },
    { id: 5, name: "انگشتر حلقه‌ای", category: "انگشتر", weight: 1.8, price: 5400000, emoji: "💍", description: "انگشتر حلقه‌ای مینیمال" },
    { id: 6, name: "انگشتر مردانه", category: "مردانه", weight: 4.2, price: 12600000, emoji: "💍", description: "انگشتر مردانه شیک" },
    { id: 7, name: "آویز قلب", category: "آویز", weight: 1.5, price: 4500000, emoji: "💖", description: "آویز قلب زیبا" },
    { id: 8, name: "آویز ستاره", category: "آویز", weight: 1.2, price: 3600000, emoji: "⭐", description: "آویز ستاره درخشان" },
    { id: 9, name: "النگو ساده", category: "النگو", weight: 15.5, price: 46500000, emoji: "⭕", description: "النگو ساده و شیک" },
    { id: 10, name: "النگو طرح‌دار", category: "النگو", weight: 18.2, price: 54600000, emoji: "⭕", description: "النگو با طرح خاص" },
    { id: 11, name: "گوشواره آویزی", category: "گوشواره", weight: 1.8, price: 5400000, emoji: "👂", description: "گوشواره آویزی ظریف" },
    { id: 12, name: "گوشواره میخی", category: "گوشواره", weight: 0.9, price: 2700000, emoji: "👂", description: "گوشواره میخی ساده" },
    { id: 13, name: "گردنبند زنجیری", category: "گردنبند", weight: 5.5, price: 16500000, emoji: "📿", description: "گردنبند زنجیری ظریف" },
    { id: 14, name: "گردنبند با پلاک", category: "گردنبند", weight: 3.2, price: 9600000, emoji: "📿", description: "گردنبند با پلاک زیبا" },
    { id: 15, name: "دستبند زنجیری", category: "دستبند", weight: 4.5, price: 13500000, emoji: "⌚", description: "دستبند زنجیری مدرن" },
    { id: 16, name: "دستبند النگویی", category: "دستبند", weight: 8.2, price: 24600000, emoji: "⌚", description: "دستبند النگویی شیک" },
    { id: 17, name: "انگشتر مردانه ساده", category: "مردانه", weight: 5.8, price: 17400000, emoji: "💍", description: "انگشتر مردانه ساده و شیک" },
    { id: 18, name: "زنجیر مردانه", category: "مردانه", weight: 12.5, price: 37500000, emoji: "📿", description: "زنجیر مردانه ضخیم" }
];

function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

function formatWeight(weight) {
    return weight + ' گرم طلای ۱۸ عیار';
}