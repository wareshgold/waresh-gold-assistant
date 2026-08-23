import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "وارش گلد | دستیار هوشمند بازار طلا",
  description:
    "قیمت لحظه‌ای طلا و دلار، محاسبه‌گر حرفه‌ای قیمت طلا و فاکتور، تحلیل حباب بازار و دستیار هوشمند وارش گلد",
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-stone-950 text-stone-100">
        {children}
      </body>
    </html>
  );
}
