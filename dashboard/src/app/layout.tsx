import type { Metadata } from "next";
import "./globals.css";
import "./website-polish.css";

export const metadata: Metadata = {
  title: "وارش گلد | فروشگاه طلا و جواهر",
  description:
    "فروشگاه وارش گلد؛ انتخاب طلا و جواهر، قیمت روز بازار و ابزارهای دقیق خرید طلا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#f7f3ec] text-[#24211d]">{children}</body>
    </html>
  );
}
