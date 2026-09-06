"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCustomerProfile, saveCustomerProfile, type CustomerProfile } from "@/lib/customerAccount";

type CustomerApi = {
  customerId: string;
  username: string;
  phone: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  addresses?: CustomerProfile["addresses"];
};

const toProfile = (customer: CustomerApi): CustomerProfile => ({
  customerId: customer.customerId,
  phone: customer.phone,
  firstName: customer.firstName,
  lastName: customer.lastName,
  addresses: customer.addresses ?? [],
});

export default function CustomerAccountPanel() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAccount = async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await response.json().catch(() => null) as { customer?: CustomerApi } | null;
      if (response.ok && data?.customer) {
        setProfile(saveCustomerProfile(toProfile(data.customer)));
      } else {
        setProfile(null);
      }
    } catch {
      setMessage("ارتباط با سرویس حساب کاربری برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadAccount(); }, []);

  const submit = async () => {
    setLoading(true);
    setMessage("");
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login"
      ? { username: username.trim(), password }
      : { username: username.trim(), password, phone: phone.trim(), nationalId: nationalId.replace(/\D/g, ""), firstName: firstName.trim(), lastName: lastName.trim() };

    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json().catch(() => null) as { customer?: CustomerApi; error?: string } | null;
      if (!response.ok || !data?.customer) {
        setMessage(data?.error ?? (mode === "login" ? "ورود انجام نشد." : "ثبت‌نام انجام نشد."));
        return;
      }
      setProfile(saveCustomerProfile(toProfile(data.customer)));
      setPassword("");
      setMessage(mode === "login" ? "ورود با موفقیت انجام شد." : "حساب کاربری با موفقیت ساخته شد.");
    } catch {
      setMessage("ارتباط با سرویس حساب کاربری برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); } finally {
      clearCustomerProfile();
      setProfile(null);
      setLoading(false);
      setMessage("از حساب خارج شدید.");
    }
  };

  if (loading && !profile) {
    return <div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-8 text-sm text-[#70766d]">در حال بررسی حساب کاربری...</div>;
  }

  if (profile) {
    return (
      <div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.06)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">MY ACCOUNT</p>
            <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">حساب کاربری</h1>
            <p className="mt-3 text-sm text-[#70766d]">{profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : "مشتری وارش گلد"}</p>
            <p className="mt-1 text-xs text-[#929188]" dir="ltr">{profile.phone}</p>
          </div>
          <button type="button" onClick={logout} disabled={loading} className="min-h-11 rounded-full border border-[#dfcfc1] px-5 text-xs font-bold text-[#895e52] disabled:opacity-60">خروج از حساب</button>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link href="/cart" className="rounded-[1.5rem] border border-[#e3ddd2] bg-white p-5 transition hover:-translate-y-0.5"><p className="text-xs text-[#929188]">خرید</p><p className="mt-2 text-sm font-extrabold">سبد خرید</p></Link>
          <div className="rounded-[1.5rem] border border-[#e3ddd2] bg-white p-5"><p className="text-xs text-[#929188]">سفارش‌ها</p><p className="mt-2 text-sm font-extrabold">به‌زودی فعال می‌شود</p></div>
          <div className="rounded-[1.5rem] border border-[#e3ddd2] bg-white p-5"><p className="text-xs text-[#929188]">آدرس‌ها</p><p className="mt-2 text-sm font-extrabold">{profile.addresses.length} آدرس ثبت‌شده</p></div>
        </div>
        {message && <p className="mt-5 rounded-2xl bg-[#f5f1e9] p-4 text-xs leading-6 text-[#777970]">{message}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.06)] sm:p-8">
      <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">CUSTOMER ACCOUNT</p>
      <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">{mode === "login" ? "ورود به حساب وارش" : "ساخت حساب وارش"}</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[#70766d]">فعلاً ورود و ثبت‌نام با نام کاربری و رمز عبور انجام می‌شود. تأیید پیامکی و ایمیلی در این مرحله غیرفعال است.</p>

      <div className="mt-6 flex gap-2 rounded-full bg-[#f5f1e9] p-1 max-w-md">
        <button type="button" onClick={() => { setMode("login"); setMessage(""); }} className={`flex-1 rounded-full px-4 py-2.5 text-xs font-bold ${mode === "login" ? "bg-white shadow-sm" : "text-[#777970]"}`}>ورود</button>
        <button type="button" onClick={() => { setMode("register"); setMessage(""); }} className={`flex-1 rounded-full px-4 py-2.5 text-xs font-bold ${mode === "register" ? "bg-white shadow-sm" : "text-[#777970]"}`}>ثبت‌نام</button>
      </div>

      <div className="mt-6 max-w-md space-y-4">
        <Field id="account-username" label="نام کاربری" value={username} onChange={setUsername} placeholder="مثلاً ali_gold" autoComplete="username" disabled={loading} />
        <Field id="account-password" label="رمز عبور" value={password} onChange={setPassword} placeholder="حداقل ۸ کاراکتر" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} disabled={loading} />
        {mode === "register" && <>
          <Field id="account-phone" label="شماره موبایل" value={phone} onChange={setPhone} placeholder="09121234567" inputMode="tel" autoComplete="tel" disabled={loading} />
          <Field id="account-national-id" label="کد ملی" value={nationalId} onChange={(value) => setNationalId(value.replace(/\D/g, "").slice(0, 10))} placeholder="۱۰ رقم" inputMode="numeric" autoComplete="off" disabled={loading} />
          <div className="grid gap-4 sm:grid-cols-2"><Field id="account-first-name" label="نام" value={firstName} onChange={setFirstName} autoComplete="given-name" disabled={loading} /><Field id="account-last-name" label="نام خانوادگی" value={lastName} onChange={setLastName} autoComplete="family-name" disabled={loading} /></div>
        </>}
        <button type="button" onClick={submit} disabled={loading} className="min-h-12 w-full rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? "در حال پردازش..." : mode === "login" ? "ورود" : "ساخت حساب و ورود"}</button>
        {message && <p className="rounded-2xl bg-[#f5f1e9] p-4 text-xs leading-6 text-[#777970]">{message}</p>}
      </div>
    </div>
  );
}

type FieldProps = { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; inputMode?: "text" | "tel" | "numeric"; autoComplete?: string; disabled?: boolean };
function Field({ id, label, value, onChange, placeholder, type = "text", inputMode = "text", autoComplete, disabled }: FieldProps) {
  return <div><label className="text-xs font-bold text-[#55584f]" htmlFor={id}>{label}</label><input id={id} value={value} onChange={(event) => onChange(event.target.value)} type={type} inputMode={inputMode} autoComplete={autoComplete} placeholder={placeholder} className="mt-2 h-12 w-full rounded-2xl border border-[#ddd7cb] bg-white px-4 text-sm outline-none transition focus:border-[#b28b4c]" dir={inputMode === "numeric" || inputMode === "tel" ? "ltr" : "auto"} disabled={disabled} /></div>;
}
