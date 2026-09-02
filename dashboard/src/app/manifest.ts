import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "وارش گلد | فروشگاه طلا و جواهر",
    short_name: "وارش گلد",
    description: "فروشگاه وارش گلد؛ انتخاب طلا و جواهر با قیمت روز بازار و ابزارهای دقیق خرید طلا.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ec",
    theme_color: "#263b31",
    dir: "rtl",
    lang: "fa",
    icons: [
      {
        src: "/waresh-gold-logo-green.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
