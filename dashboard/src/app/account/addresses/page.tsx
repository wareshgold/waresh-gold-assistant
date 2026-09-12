"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import type { CustomerAddress } from "@/lib/customerAccount";

type Customer = { firstName: string; lastName: string; addresses?: CustomerAddress[] };
type AddressForm = Omit<CustomerAddress, "id" | "customerId" | "createdAt" | "updatedAt" | "isDefault">;
const emptyAddress: AddressForm = { title: "", recipientName: "", phone: "", province: "", city: "", address: "", postalCode: "" };

export default function AccountAddressesPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [form, setForm] = useState<AddressForm>(emptyAddress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [defaultingId, setDefaultingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const loadAccount = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await response.json().catch(() => null) as { customer?: Customer } | null;
      if (!response.ok || !data?.customer) { setCustomer(null); setAddresses([]); return; }
      setCustomer(data.customer); setAddresses(data.customer.addresses ?? []);
    } catch { setMessage("ارتباط با سرویس حساب کاربری برقرار نشد."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadAccount(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ ...emptyAddress }); setMessage(""); setShowForm(true); };
  const openEdit = (a: CustomerAddress) => { setEditingId(a.id); setForm({ title:a.title, recipientName:a.recipientName, phone:a.phone, province:a.province, city:a.city, address:a.address, postalCode:a.postalCode }); setMessage(""); setShowForm(true); };
  const closeForm = () => { if (saving) return; setShowForm(false); setEditingId(null); setForm({ ...emptyAddress }); };
  const updateField = (field: keyof AddressForm, value: string) => setForm(c => ({ ...c, [field]: field === "postalCode" ? value.replace(/\D/g, "").slice(0,10) : value }));

  const submitAddress = async () => {
    if (saving) return;
    if (Object.values(form).some(v => !v.trim())) { setMessage("همه اطلاعات آدرس را کامل کنید."); return; }
    if (form.postalCode.trim().length !== 10) { setMessage("کد پستی باید ۱۰ رقم باشد."); return; }
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/account/addresses", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...form, ...(editingId ? {addressId:editingId} : {}) }) });
      const data = await response.json().catch(() => null) as { address?: CustomerAddress; error?: string } | null;
      if (!response.ok || !data?.address) { setMessage(data?.error ?? "ثبت آدرس انجام نشد."); return; }
      setShowForm(false); setEditingId(null); setForm({...emptyAddress}); setMessage(editingId ? "آدرس با موفقیت ویرایش شد." : "آدرس با موفقیت ثبت شد."); await loadAccount();
    } catch { setMessage("ارتباط با سرویس آدرس برقرار نشد."); } finally { setSaving(false); }
  };

  const setDefault = async (address: CustomerAddress) => {
    if (defaultingId || address.isDefault) return;
    setDefaultingId(address.id); setMessage("");
    try {
      const response = await fetch("/api/account/addresses", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...address, addressId:address.id, isDefault:true }) });
      const data = await response.json().catch(() => null) as { address?: CustomerAddress; error?: string } | null;
      if (!response.ok || !data?.address) { setMessage(data?.error ?? "تغییر آدرس پیش‌فرض انجام نشد."); return; }
      setMessage(`«${address.title}» به‌عنوان آدرس پیش‌فرض انتخاب شد.`); await loadAccount();
    } catch { setMessage("ارتباط با سرویس آدرس برقرار نشد."); } finally { setDefaultingId(null); }
  };

  const removeAddress = async (addressId: string) => {
    if (deletingId) return;
    const address = addresses.find(a => a.id === addressId);
    if (!address || !window.confirm(`آدرس «${address.title}» حذف شود؟`)) return;
    setDeletingId(addressId); setMessage("");
    try {
      const response = await fetch(`/api/account/addresses/${encodeURIComponent(addressId)}`, { method:"DELETE" });
      const data = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) { setMessage(data?.error ?? "حذف آدرس انجام نشد."); return; }
      if (editingId === addressId) closeForm(); setMessage(address.isDefault ? "آدرس پیش‌فرض حذف شد و آدرس بعدی به‌صورت خودکار پیش‌فرض شد." : "آدرس حذف شد."); await loadAccount();
    } catch { setMessage("ارتباط با سرویس آدرس برقرار نشد."); } finally { setDeletingId(null); }
  };

  if (loading) return <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]"><Header/><section className="waresh-container py-16"><div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-8">در حال دریافت آدرس‌ها...</div></section></main>;
  if (!customer) return <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]"><Header/><section className="waresh-container py-16"><div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-8 text-center"><h1 className="text-2xl font-extrabold">مدیریت آدرس‌ها</h1><p className="mt-3 text-sm text-[#70766d]">برای مدیریت آدرس‌های ارسال ابتدا وارد حساب کاربری شوید.</p><Link href="/account" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#25392f] px-6 text-sm font-bold text-white">ورود به حساب</Link></div></section></main>;

  return <main className="min-h-screen bg-[#f5f1e9] text-[#292b26]"><Header/><section className="waresh-container py-10 sm:py-16">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">DELIVERY ADDRESSES</p><h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">مدیریت آدرس‌ها</h1><p className="mt-3 text-sm text-[#70766d]">آدرس پیش‌فرض در Checkout به‌صورت خودکار انتخاب می‌شود.</p></div><div className="flex gap-2"><Link href="/account" className="inline-flex min-h-11 items-center rounded-full border border-[#d9cfc1] bg-white px-5 text-xs font-bold text-[#62685e]">بازگشت به حساب</Link><button type="button" onClick={showForm?closeForm:openCreate} className="min-h-11 rounded-full bg-[#25392f] px-5 text-xs font-bold text-white">{showForm?"بستن فرم":"افزودن آدرس"}</button></div></div>
    {showForm && <section className="mt-8 rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-5 sm:p-7"><h2 className="text-xl font-extrabold">{editingId?"ویرایش آدرس":"آدرس جدید"}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{([['title','عنوان آدرس','خانه'],['recipientName','نام گیرنده','نام و نام خانوادگی'],['phone','شماره گیرنده','۰۹۱۲...'],['province','استان','تهران'],['city','شهر','تهران'],['postalCode','کد پستی','۱۰ رقم']] as const).map(([field,label,placeholder])=><label key={field}><span className="text-xs font-bold">{label}</span><input value={form[field]} onChange={e=>updateField(field,e.target.value)} disabled={saving} inputMode={field==='postalCode'?'numeric':field==='phone'?'tel':undefined} className="mt-2 min-h-12 w-full rounded-2xl border border-[#ddd7cb] bg-white px-4 text-sm outline-none focus:border-[#b28b4c]" placeholder={placeholder}/></label>)}<label className="sm:col-span-2"><span className="text-xs font-bold">نشانی کامل</span><textarea value={form.address} onChange={e=>updateField('address',e.target.value)} rows={4} disabled={saving} className="mt-2 w-full rounded-2xl border border-[#ddd7cb] bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-[#b28b4c]" placeholder="خیابان، کوچه، پلاک، واحد..."/></label><button type="button" onClick={()=>void submitAddress()} disabled={saving} className="min-h-12 rounded-full bg-[#25392f] px-5 text-sm font-bold text-white sm:col-span-2">{saving?"در حال ذخیره...":editingId?"ذخیره تغییرات":"ذخیره آدرس"}</button></div></section>}
    {message && <p className="mt-5 rounded-2xl bg-[#f5f1e9] p-4 text-xs text-[#777970]">{message}</p>}
    <div className="mt-8 space-y-3">{addresses.length?addresses.map(a=><article key={a.id} className={`rounded-[1.5rem] border bg-[#fffdf8] p-5 ${a.isDefault?'border-[#c6a66b]':'border-[#e3ddd2]'}`}><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-extrabold">{a.title}</p>{a.isDefault&&<span className="rounded-full bg-[#f3e8d2] px-3 py-1 text-[10px] font-extrabold text-[#765728]">پیش‌فرض</span>}</div><p className="mt-1 text-xs text-[#777970]">{a.recipientName} · <span dir="ltr">{a.phone}</span></p><p className="mt-3 text-xs leading-7 text-[#62685e]">{a.province}، {a.city}، {a.address}</p><p className="mt-1 text-[10px] text-[#99978f]">کد پستی: <span dir="ltr">{a.postalCode}</span></p></div><div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={()=>void setDefault(a)} disabled={a.isDefault||defaultingId!==null||saving||deletingId!==null} className="min-h-10 rounded-full border border-[#c6a66b] bg-[#fffaf0] px-4 text-[11px] font-bold text-[#765728] disabled:opacity-45">{defaultingId===a.id?'در حال انتخاب...':a.isDefault?'آدرس پیش‌فرض':'انتخاب به‌عنوان پیش‌فرض'}</button><button type="button" onClick={()=>openEdit(a)} disabled={saving||defaultingId!==null||deletingId!==null} className="min-h-10 rounded-full border border-[#d9cfc1] bg-white px-4 text-[11px] font-bold text-[#765728]">ویرایش</button><button type="button" onClick={()=>void removeAddress(a.id)} disabled={saving||defaultingId!==null||deletingId!==null} className="min-h-10 rounded-full border border-[#e1cbc4] bg-white px-4 text-[11px] font-bold text-[#94675f]">{deletingId===a.id?'در حال حذف...':'حذف'}</button></div></div></article>):<div className="rounded-[1.5rem] border border-dashed border-[#d9d0c2] bg-[#fffdf8] p-8 text-center"><p className="text-sm font-extrabold">هنوز آدرسی ثبت نشده است.</p><button type="button" onClick={openCreate} className="mt-5 min-h-11 rounded-full bg-[#25392f] px-5 text-xs font-bold text-white">افزودن اولین آدرس</button></div>}</div>
  </section></main>;
}

function Header(){return <header className="sticky top-0 z-50 border-b border-[#dedfd7]/80 bg-[#faf8f2]/95 backdrop-blur-xl"><div className="waresh-container flex h-[76px] items-center justify-between gap-4"><Link href="/" aria-label="وارش گلد"><img src="/waresh-gold-logo-green.png" alt="وارش گلد" className="h-11 w-auto"/></Link><nav className="hidden items-center gap-6 text-sm font-semibold text-[#62685e] lg:flex"><Link className="waresh-link" href="/#products">محصولات</Link><Link className="waresh-link" href="/tools">ابزار طلا</Link><Link className="waresh-link" href="/about">درباره وارش</Link></nav><MobileMenu/></div></header>}
