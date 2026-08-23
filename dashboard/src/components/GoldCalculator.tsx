"use client";

import { useState } from "react";

interface GoldCalculatorProps {
  liveGoldPrice?: number;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/٫/g, ".");
}

function parseNumber(value: string): number | null {
  const normalized = toLatinDigits(value).replace(/[,\s]/g, "");
  if (normalized === "") return null;
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

function Field({ label, value, onChange, placeholder, required, hint }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-stone-300">
        {label}
        {required && <span className="text-amber-400"> *</span>}
      </span>
      <input
        type="text"
        inputMode="decimal"
        dir="ltr"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-stone-900/70 px-4 py-2.5 text-left text-stone-100 placeholder:text-stone-600 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
      />
      {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export default function GoldCalculator({ liveGoldPrice }: GoldCalculatorProps) {
  const [weight, setWeight] = useState("");
  const [goldPrice, setGoldPrice] = useState(
    liveGoldPrice ? String(liveGoldPrice) : ""
  );
  const [labor, setLabor] = useState("");
  const [profit, setProfit] = useState("");
  const [tax, setTax] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatToman = (value: number) =>
    new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTotal(null);

    const weightNum = parseNumber(weight);
    const goldPriceNum = parseNumber(goldPrice);
    const laborNum = parseNumber(labor);
    const profitNum = parseNumber(profit);
    const taxNum = parseNumber(tax);
    const discountNum = parseNumber(discount);

    if (
      weightNum === null ||
      weightNum <= 0 ||
      goldPriceNum === null ||
      goldPriceNum <= 0 ||
      laborNum === null ||
      laborNum < 0 ||
      profitNum === null ||
      profitNum < 0 ||
      taxNum === null ||
      taxNum < 0 ||
      (discountNum !== null && discountNum < 0)
    ) {
      setError("لطفاً مقادیر معتبر وارد کنید: وزن و قیمت بیشتر از صفر، درصدها از صفر کمتر نباشند.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/calc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: weightNum,
          goldPrice: goldPriceNum,
          laborPercent: laborNum,
          profitPercent: profitNum,
          taxPercent: taxNum,
          ...(discountNum !== null ? { discount: discountNum } : {}),
        }),
      });

      const data = (await response.json()) as { total?: number; error?: string };

      if (!response.ok || typeof data.total !== "number") {
        setError(data.error ?? "خطا در محاسبه. دوباره تلاش کنید.");
        return;
      }

      setTotal(data.total);
    } catch {
      setError("اتصال برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">🧮</span>
        <h2 className="text-2xl font-bold text-stone-50">محاسبه‌گر قیمت طلا</h2>
      </div>
      <p className="mt-2 text-sm text-stone-400">
        قیمت نهایی خرید را دقیق و با فرمول طلافروشی محاسبه کن
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field
          label="وزن طلا (گرم)"
          value={weight}
          onChange={setWeight}
          placeholder="مثلاً 1.5"
          required
        />
        <Field
          label="قیمت هر گرم طلای ۱۸ عیار (تومان)"
          value={goldPrice}
          onChange={setGoldPrice}
          placeholder="مثلاً 18306478"
          required
          hint={
            liveGoldPrice
              ? `قیمت لحظه‌ای فعلی: ${formatToman(liveGoldPrice)} تومان`
              : undefined
          }
        />
        <Field
          label="اجرت (%)"
          value={labor}
          onChange={setLabor}
          placeholder="مثلاً 7"
          required
        />
        <Field label="سود (%)" value={profit} onChange={setProfit} placeholder="مثلاً 0" />
        <Field label="مالیات (%)" value={tax} onChange={setTax} placeholder="مثلاً 9" />
        <Field
          label="تخفیف (%)"
          value={discount}
          onChange={setDiscount}
          placeholder="اختیاری"
        />
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {total !== null && (
        <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
          <p className="text-sm text-amber-200/80">قیمت نهایی</p>
          <p className="mt-1 text-3xl font-extrabold text-amber-300">
            {formatToman(total)} <span className="text-xl">تومان</span>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-gradient-to-l from-amber-400 to-amber-500 px-6 py-3 text-base font-bold text-stone-950 transition hover:from-amber-300 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "در حال محاسبه…" : "محاسبه قیمت"}
      </button>
    </form>
  );
}
