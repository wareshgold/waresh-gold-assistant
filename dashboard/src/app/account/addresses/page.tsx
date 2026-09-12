"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import type { CustomerAddress } from "@/lib/customerAccount";

type Customer = {
  firstName: string;
  lastName: string;
  addresses?: CustomerAddress[];
};

type AddressForm = Omit<CustomerAddress, "id" | "customerId" | "createdAt" | "updatedAt">;

const emptyAddress: AddressForm = {
  title: "",
  recipientName: "",
  phone: "",
  province: "",
  city: "",
  address: "",
  postalCode: "",
};

export default function AccountAddressesPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [form, setForm] = useState<AddressForm>(emptyAddress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const loadAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await response.json().catch(() => null) as { customer?: Customer } | null;
      if (!response.ok || !data?.customer) {
        setCustomer(null);
        setAddresses([]);
        return;
      }
      setCustomer(data.customer);
      setAddresses(data.customer.addresses ?? []);
    } catch {
      setMessage("ارتباط با سرویس حساب کاربری برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccount();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyAddress });
    setMessage("");
    setShowForm(true);
  };

  const openEdit = (address: CustomerAddress) => {
    setEditingId(address.id);
    setForm({
      title: address.title,
      recipientName: address.recipientName,
      phone: address.phone,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,
    });
    setMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyAddress });
  };

  const updateField = (field: keyof AddressForm, value: string) => {
    setForm((current) => ({ ...current, [field]: field === "postalCode" ? value.replace(/\D/g, "").slice(0, 10) : value }));
  };

  const submitAddress = async () => {
    if (saving) return;
    const values = Object.values(form).map((value) => value.trim());
    if (values.some((value) => !value)) {
      setMessage("همه اطلاعات آدرس را کامل کنید.");
      return;
    }
    if (form.postalCode.trim().length !== 10) {
      setMessage("کد پستی باید ۱۰ رقم باشد.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...(editingId ? { addressId: editingId } : {}) }),
      });
      const data = await response.json().catch(() => null) as { address?: CustomerAddress; error?: string } | null;
      if (!response.ok || !data?.address) {
        setMessage(data?.error ?? (editingId ? "ویرایش آدرس انجام نشد." : "ثبت آدرس انجام نشد."));
        return;
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyAddress });
      setMessage(editingId ? "آدرس با موفقیت ویرایش شد." : "آدرس با موفقیت ثبت شد.");
      await loadAccount();
    } catch {
      setMessage("ارتباط با سرویس آدرس برقرار نشد.");
    } finally {
      setSaving(false);
    }
  };

  const removeAddress = async (addressId: string) => {
    if (deletingId) return;
    const address = addresses.find((item) => item.id === addressId);
    if (!address || !window.confirm(`آدرس «${address.title}» حذف شود؟`)) return;

    setDeletingId(addressId);
    setMessage("");
    try {
      const response = await fetch(`/api/account/addresses/${encodeURIComponent(addressId)}`, { method: "DELETE" });
      const data = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) {
        setMessage(data?.error ?? "حذف آدرس انجام نشد.");
        return;
      }
      if (editingId === addressId) closeForm();
      setMessage("آدرس حذف شد.");
      await loadAccount();
    } catch {
      setMessage("ارتباط با سرویس آدرس برقرار نشد.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]"><Header /><section className="waresh-container py-16"><div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-8 text-sm text-[#70766d]">در حال دریافت آدرس‌ها...</div></section></main>;
  }

  if (!customer) {
    return <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]"><Header /><section className="waresh-container py-16"><div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-8 text-center"><h1 className="text-2xl font-extrabold">مدیریت آدرس‌ها</h1><p className="mt-3 text-sm leading-7 text-[#70766d]">برای مدیریت آدرس‌های ارسال ابتدا وارد حساب کاربری شوید.</p><Link href="/account" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#25392f] px-6 text-sm font-bold text-white">ورود به حساب</Link></div></section></main>;
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]">
      <Header />
      <section className="waresh-container py-10 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">DELIVERY ADDRESSES</p><h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">مدیریت آدرس‌ها</h1><p className="mt-3 text-sm leading-7 text-[#70766d]">آدرس‌های ارسال را اضافه، ویرایش یا حذف کنید. هنگام Checkout می‌توانید یکی از آن‌ها را انتخاب کنید.</p></div>
          <div className="flex gap-2"><Link href="/account" className="inline-flex min-h-11 items-center rounded-full border border-[#d9cfc1] bg-white px-5 text-xs font-bold text-[#62685e]">بازگشت به حساب</Link><button type="button" onClick={showForm ? closeForm : openCreate} className="min-h-11 rounded-full bg-[#25392f] px-5 text-xs font-bold text-white">{showForm ? "بستن فرم" : "افزودن آدرس"}</button></div>
        </div>

        {showForm && <section className="mt-8 rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(55,52,43,0.05)] sm:p-7"><div className="border-b border-[#eee9df] pb-4"><p className="text-xs font-bold tracking-[0.14em] text-[#9b7b48]">{editingId ? "EDIT ADDRESS" : "NEW ADDRESS"}</p><h2 className="mt-2 text-xl font-extrabold">{editingId ? "ویرایش آدرس" : "آدرس جدید"}</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{([['title','عنوان آدرس','خانه'],['recipientName','نام گیرنده','نام و نام خانوادگی'],['phone','شماره گیرنده','۰۹۱۲...'],['province','استان','تهران'],['city','شهر','تهران'],['postalCode','کد پستی','۱۰ رقم']] as const).map(([field,label,placeholder]) => <label key={field} className="block"><span className="text-xs font-bold text-[#55584f]">{label}</span><input value={form[field]} onChange={(event) => updateField(field, event.target.value)} disabled={saving} inputMode={field === 'postalCode' ? 'numeric' : field === 'phone' ? 'tel' : undefined} className="mt-2 min-h-12 w-full rounded-2xl border border-[#ddd7cb] bg-white px-4 text-sm outline-none transition focus:border-[#b28b4c] disabled:opacity-60" placeholder={placeholder} /></label>)}<label className="block sm:col-span-2"><span className="text-xs font-bold text-[#55584f]">نشانی کامل</span><textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} rows={4} disabled={saving} className="mt-2 w-full rounded-2xl border border-[#ddd7cb] bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#b28b4c] disabled:opacity-60" placeholder="خیابان، کوچه، پلاک، واحد..." /></label><button type="button" onClick={() => void submitAddress()} disabled={saving} className="min-h-12 rounded-full bg-[#25392f] px-5 text-sm font-bold text-white disabled:opacity-50 sm:col-span-2">{saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "ذخیره آدرس"}</button></div></section>}

        {message && <p className="mt-5 rounded-2xl bg-[#f5f1e9] p-4 text-xs leading-6 text-[#777970]">{message}</p>}

        <div className="mt-8 space-y-3">{addresses.length ? addresses.map((address) => <article key={address.id} className="rounded-[1.5rem] border border-[#e3ddd2] bg-[#fffdf8] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-extrabold">{address.title}</p><p className="mt-1 text-xs text-[#777970]">{address.recipientName} · <span dir="ltr">{address.phone}</span></p><p className="mt-3 text-xs leading-7 text-[#62685e]">{address.province}، {address.city}، {address.address}</p><p className="mt-1 text-[10px] text-[#99978f]">کد پستی: <span dir="ltr">{address.postalCode}</span></p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => openEdit(address)} disabled={saving || deletingId !== null} className="min-h-10 rounded-full border border-[#d9cfc1] bg-white px-4 text-[11px] font-bold text-[#765728] disabled:opacity-50">ویرایش</button><button type="button" onClick={() => void removeAddress(address.id)} disabled={saving || deletingId !== null} className="min-h-10 rounded-full border border-[#e1cbc4] bg-white px-4 text-[11px] font-bold text-[#94675f] disabled:opacity-50">{deletingId === address.id ? "در حال حذف..." : "حذف"}</button></div></div></article>) : <div className="rounded-[1.5rem] border border-dashed border-[#d9d0c2] bg-[#fffdf8] p-8 text-center"><p className="text-sm font-extrabold">هنوز آدرسی ثبت نشده است.</p><p className="mt-2 text-xs leading-6 text-[#777970]">یک آدرس ذخیره کنید تا در Checkout با یک انتخاب سریع از آن استفاده کنید.</p><button type="button" onClick={openCreate} className="mt-5 min-h-11 rounded-full bg-[#25392f] px-5 text-xs font-bold text-white">افزودن اولین آدرس</button></div>}</div>
      </section>
    </main>
  );
}

function Header() {
  return <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl"><div className="waresh-container flex h-[76px] items-center justify-between gap-4"><Link href="/" aria-label="وارش گلد"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto" /></Link><nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex"><Link className="waresh-link" href="/#products">محصولات</Link><Link className="waresh-link" href="/tools">ابزار طلا</Link><Link className="waresh-link" href="/about">درباره وارش</Link></nav><MobileMenu /></div></header>;
}
