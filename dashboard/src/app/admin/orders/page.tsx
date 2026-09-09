import type { Metadata } from "next";
import AdminOrderConsole from "@/components/AdminOrderConsole";

export const metadata: Metadata = {
  title: "مدیریت سفارش‌ها | وارش گلد",
  description: "پنل مدیریت وضعیت سفارش‌های وارش گلد",
};

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e9] px-4 py-10 text-[#292b26] sm:px-6 sm:py-16">
      <AdminOrderConsole />
    </main>
  );
}
