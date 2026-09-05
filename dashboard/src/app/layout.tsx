import type { Metadata, Viewport } from "next";
import InstallPrompt from "@/components/InstallPrompt";
import "./globals.css";
import "./website-polish.css";
import "./mobile-scale.css";
import "./homepage-polish.css";
import "./website-ui-overrides.css";
import "./footer-branding.css";
import "./hero-slogans.css";
import "./header-navigation-polish.css";
import "./market-calculator-polish.css";
import "./gift-footer-polish.css";
import "./about-cta-polish.css";
import "./inner-pages-polish.css";
import "./about-rain.css";

const primaryLogo = "/waresh-gold-logo-green.png";
const browserIcon = "/waresh-gold-logo-white.jpg";

export const metadata: Metadata = {
  title: "وارش گلد | فروشگاه طلا و جواهر",
  description:
    "فروشگاه وارش گلد؛ انتخاب طلا و جواهر، قیمت روز بازار و ابزارهای دقیق خرید طلا",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: browserIcon,
    shortcut: browserIcon,
    apple: browserIcon,
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
