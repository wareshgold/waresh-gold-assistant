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
        className="min-h-12 w-full rounded-xl border border-[#ded5c9] bg-[#fffdf9] px-4 py-3 text-left text-[#302b25] placeholder:text-[#b0a79d] outline-none transition focus:border-[#b08a45] focus:ring-2 focus:ring-[#b08a45]/10"
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

  const useLivePrice = () => {
    if (!liveGoldPrice) return;
    setGoldPrice(String(liveGoldPrice));
    setTotal(null);
    setError(null);
  };

  const reset = () => {
    setWeight("");
    setGoldPrice(liveGoldPrice ? String(liveGoldPrice) : "");
    setLabor("");
    setProfit("");
    setTax("");
    setDiscount("");
    setTotal(null);
    setError(null);
  };

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
      (laborNum !== null && laborNum < 0) ||
      (profitNum !== null && profitNum < 0) ||
      (taxNum !== null && taxNum < 0) ||
      (discountNum !== null && discountNum < 0)
    ) {
      setError("وزن و قیمت هر گرم را وارد کنید؛ سایر درصدها اختیاری هستند.");
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
          laborPercent: laborNum ?? 0,
          profitPercent: profitNum ?? 0,
          taxPercent: taxNum ?? 0,
          discount: discountNum ?? 0,
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
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-[2rem] border border-[#e1d8cc] bg-[#f7f2e9] p-5 shadow-[0_24px_70px_rgba(55,52,43,0.08)] sm:p-8 lg:p-9">
      <div className="flex flex-col gap-4 border-b border-[#e1d8cc] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[#a08350]">CALCULATOR</p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#29251f]">محاسبه‌گر قیمت طلا</h3>
          <p className="mt-2 max-w-xl text-xs leading-6 text-[#81796f]">
            فقط وزن و قیمت هر گرم لازم است؛ اجرت، سود، مالیات و تخفیف کاملاً اختیاری هستند.
          </p>
        </div>
        <span className="self-start rounded-full bg-[#eee1c9] px-3 py-1 text-sm font-bold text-[#8a6b38] sm:self-auto">۱۸K</span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="وزن طلا (گرم)" value={weight} onChange={setWeight} placeholder="مثلاً 1.5" required />
        <div>
          <Field
            label="قیمت هر گرم طلای ۱۸ عیار (تومان)"
            value={goldPrice}
            onChange={setGoldPrice}
            placeholder="مثلاً 22276000"
            required
            hint={liveGoldPrice ? `قیمت لحظه‌ای: ${formatToman(liveGoldPrice)} تومان` : undefined}
          />
          {liveGoldPrice && (
            <button type="button" onClick={useLivePrice} className="mt-2 min-h-9 text-xs font-bold text-[#987238] transition hover:text-[#6f5229]">
              استفاده از قیمت لحظه‌ای
            </button>
          )}
        </div>
        <Field label="اجرت (%) — اختیاری" value={labor} onChange={setLabor} placeholder="مثلاً 7" />
        <Field label="سود (%) — اختیاری" value={profit} onChange={setProfit} placeholder="مثلاً 0" />
        <Field label="مالیات (%) — اختیاری" value={tax} onChange={setTax} placeholder="مثلاً 9" />
        <Field label="تخفیف (%) — اختیاری" value={discount} onChange={setDiscount} placeholder="مثلاً 5" />
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-[#c98c7b]/30 bg-[#f7e9e5] px-4 py-3 text-sm leading-6 text-[#8f4f3f]">
          {error}
        </p>
      )}

      {total !== null && (
        <div aria-live="polite" className="mt-5 rounded-2xl border border-[#d6c19b] bg-[#eee1c9] p-5 sm:p-6">
          <p className="text-sm text-[#80683e]">قیمت نهایی</p>
          <p className="mt-2 text-3xl font-extrabold text-[#30291f] sm:text-4xl">
            {formatToman(total)} <span className="text-lg">تومان</span>
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button type="submit" disabled={loading} className="min-h-12 rounded-xl bg-[#302b25] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1f1b17] disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "در حال محاسبه…" : "محاسبه قیمت نهایی"}
        </button>
        <button type="button" onClick={reset} disabled={loading} className="min-h-12 rounded-xl border border-[#d7cec1] bg-[#fffdf9] px-6 py-4 text-sm font-bold text-[#6d665d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
          پاک کردن
        </button>
      </div>
    </form>
  );
}
