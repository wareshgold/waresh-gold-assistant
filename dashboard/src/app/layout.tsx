import type { Metadata, Viewport } from "next";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";
import "./website-polish.css";
import "./mobile-scale.css";
import "./homepage-polish.css";
import "./website-ui-overrides.css";

export const metadata: Metadata = {
  title: "وارش گلد | فروشگاه طلا و جواهر",
  description:
    "فروشگاه وارش گلد؛ انتخاب طلا و جواهر، قیمت روز بازار و ابزارهای دقیق خرید طلا",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/waresh-gold-logo-white.jpg",
    shortcut: "/waresh-gold-logo-white.jpg",
    apple: "/waresh-gold-logo-white.jpg",
  },
  appleWebApp: {
    capable: true,
    title: "وارش گلد",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#263b31",
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
      <body className="min-h-full bg-[#f7f3ec] text-[#24211d]">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
