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
      <span className="mb-2 block text-sm font-medium text-[#5f584f]">
        {label}
        {required && <span className="text-[#a27b3e]"> *</span>}
      </span>
      <input
        type="text"
        inputMode="decimal"
        dir="ltr"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#ded5c9] bg-[#fffdf9] px-4 py-3 text-left text-[#302b25] placeholder:text-[#b0a79d] outline-none transition focus:border-[#b08a45] focus:ring-2 focus:ring-[#b08a45]/10"
      />
      {hint && <span className="mt-2 block text-xs text-[#8b8379]">{hint}</span>}
    </label>
  );
}

export default function GoldCalculator({ liveGoldPrice }: GoldCalculatorProps) {
  const [weight, setWeight] = useState("");
  const [goldPrice, setGoldPrice] = useState(liveGoldPrice ? String(liveGoldPrice) : "");
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
      weightNum === null || weightNum <= 0 ||
      goldPriceNum === null || goldPriceNum <= 0 ||
      laborNum === null || laborNum < 0 ||
      profitNum === null || profitNum < 0 ||
      taxNum === null || taxNum < 0 ||
      (discountNum !== null && discountNum < 0)
    ) {
      setError("لطفاً وزن و قیمت را بیشتر از صفر و درصدها را صفر یا بیشتر وارد کنید.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/tools/api/calc", {
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
    <form onSubmit={handleSubmit} className="border border-[#e1d8cc] bg-[#f7f2e9] p-7 sm:p-9">
      <div className="flex items-end justify-between gap-4 border-b border-[#e1d8cc] pb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[#a08350]">CALCULATOR</p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#29251f]">محاسبه‌گر قیمت طلا</h3>
        </div>
        <span className="text-sm font-bold text-[#a08350]">۱۸K</span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="وزن طلا (گرم)" value={weight} onChange={setWeight} placeholder="مثلاً 1.5" required />
        <Field
          label="قیمت هر گرم طلای ۱۸ عیار (تومان)"
          value={goldPrice}
          onChange={setGoldPrice}
          placeholder="مثلاً 22276000"
          required
          hint={liveGoldPrice ? `قیمت لحظه‌ای: ${formatToman(liveGoldPrice)} تومان` : undefined}
        />
        <Field label="اجرت (%)" value={labor} onChange={setLabor} placeholder="مثلاً 7" required />
        <Field label="سود (%)" value={profit} onChange={setProfit} placeholder="مثلاً 0" required />
        <Field label="مالیات (%)" value={tax} onChange={setTax} placeholder="مثلاً 9" required />
        <Field label="تخفیف (%)" value={discount} onChange={setDiscount} placeholder="اختیاری" />
      </div>

      {error && <p className="mt-5 border border-[#c98c7b]/30 bg-[#f7e9e5] px-4 py-3 text-sm text-[#8f4f3f]">{error}</p>}

      {total !== null && (
        <div className="mt-5 border border-[#d6c19b] bg-[#eee1c9] p-6">
          <p className="text-sm text-[#80683e]">قیمت نهایی</p>
          <p className="mt-2 text-3xl font-extrabold text-[#30291f]">
            {formatToman(total)} <span className="text-lg">تومان</span>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-[#302b25] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1f1b17] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "در حال محاسبه…" : "محاسبه قیمت نهایی"}
      </button>
    </form>
  );
}
