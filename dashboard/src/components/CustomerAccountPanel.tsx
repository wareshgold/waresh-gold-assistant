"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearCustomerProfile,
  getAccountChangeEvent,
  isValidIranPhone,
  normalizeIranPhone,
  readCustomerProfile,
  saveCustomerProfile,
  type CustomerProfile,
} from "@/lib/customerAccount";

function createProfile(phone: string, customerId: string): CustomerProfile {
  return { phone, customerId, firstName: "", lastName: "", addresses: [] };
}

type OtpRequestResponse = {
  requestId: string;
  expiresAt: string;
  retryAfterSeconds: number;
};

type OtpVerifyResponse = {
  customerId: string;
  phone: string;
};

export default function CustomerAccountPanel() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [phone, setPhone] = useState("");
  const [requestId, setRequestId] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sync = () => setProfile(readCustomerProfile());
    sync();
    const eventName = getAccountChangeEvent();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const requestOtp = async () => {
    const normalized = normalizeIranPhone(phone);
    if (!isValidIranPhone(normalized)) {
      setMessage("شماره موبایل ایران را به شکل معتبر وارد کنید.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized, purpose: "login" }),
      });

      const data = (await response.json().catch(() => null)) as OtpRequestResponse | { error?: string } | null;

      if (!response.ok || !data || !("requestId" in data)) {
        setMessage(data && "error" in data && data.error ? data.error : "ارسال کد تأیید انجام نشد. دوباره تلاش کنید.");
        return;
      }

      setPhone(normalized);
      setRequestId(data.requestId);
      setOtpRequested(true);
      setMessage("کد تأیید برای شماره شما ارسال شد.");
    } catch {
      setMessage("ارتباط با سرویس احراز هویت برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!requestId || !/^\d{4,6}$/.test(otp)) {
      setMessage("کد تأیید را وارد کنید.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          phone: normalizeIranPhone(phone),
          code: otp,
          purpose: "login",
        }),
      });

      const data = (await response.json().catch(() => null)) as OtpVerifyResponse | { error?: string } | null;

      if (!response.ok || !data || !("customerId" in data) || !("phone" in data)) {
        setMessage(data && "error" in data && data.error ? data.error : "کد تأیید نامعتبر است.");
        return;
      }

      const next = profile ?? createProfile(data.phone, data.customerId);
      setProfile(saveCustomerProfile({ ...next, customerId: data.customerId, phone: data.phone }));
      setOtp("");
      setRequestId("");
      setOtpRequested(false);
      setMessage("ورود با موفقیت انجام شد.");
    } catch {
      setMessage("ارتباط با سرویس احراز هویت برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

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
          <button type="button" onClick={() => { clearCustomerProfile(); setProfile(null); }} className="min-h-11 rounded-full border border-[#dfcfc1] px-5 text-xs font-bold text-[#895e52]">خروج از حساب</button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link href="/cart" className="rounded-[1.5rem] border border-[#e3ddd2] bg-white p-5 transition hover:-translate-y-0.5"><p className="text-xs text-[#929188]">خرید</p><p className="mt-2 text-sm font-extrabold">سبد خرید</p></Link>
          <div className="rounded-[1.5rem] border border-[#e3ddd2] bg-white p-5"><p className="text-xs text-[#929188]">سفارش‌ها</p><p className="mt-2 text-sm font-extrabold">به‌زودی فعال می‌شود</p></div>
          <div className="rounded-[1.5rem] border border-[#e3ddd2] bg-white p-5"><p className="text-xs text-[#929188]">آدرس‌ها</p><p className="mt-2 text-sm font-extrabold">{profile.addresses.length} آدرس ثبت‌شده</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-[#ded8cc] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(55,52,43,0.06)] sm:p-8">
      <p className="text-xs font-bold tracking-[0.2em] text-[#9b7b48]">CUSTOMER ACCOUNT</p>
      <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">ورود به حساب وارش</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[#70766d]">برای ورود، شماره موبایل خود را وارد کنید تا کد تأیید از سرویس احراز هویت ارسال شود.</p>

      <div className="mt-8 max-w-md">
        <label className="text-xs font-bold text-[#55584f]" htmlFor="account-phone">شماره موبایل</label>
        <input id="account-phone" value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" className="mt-2 h-12 w-full rounded-2xl border border-[#ddd7cb] bg-white px-4 text-sm outline-none transition focus:border-[#b28b4c]" dir="ltr" disabled={loading} />
        {!otpRequested ? (
          <button type="button" onClick={requestOtp} disabled={loading} className="mt-3 min-h-12 w-full rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? "در حال ارسال..." : "دریافت کد تأیید"}</button>
        ) : (
          <>
            <label className="mt-5 block text-xs font-bold text-[#55584f]" htmlFor="account-otp">کد تأیید</label>
            <input id="account-otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="کد ۴ تا ۶ رقمی" className="mt-2 h-12 w-full rounded-2xl border border-[#ddd7cb] bg-white px-4 text-sm tracking-[0.3em] outline-none transition focus:border-[#b28b4c]" dir="ltr" disabled={loading} />
            <button type="button" onClick={verifyOtp} disabled={loading} className="mt-3 min-h-12 w-full rounded-full bg-[#25392f] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? "در حال بررسی..." : "تأیید و ورود"}</button>
          </>
        )}
        {message && <p className="mt-4 rounded-2xl bg-[#f5f1e9] p-4 text-xs leading-6 text-[#777970]">{message}</p>}
      </div>
    </div>
  );
}
