interface MarketStatusProps {
  updatedAt: string;
}

export default function MarketStatus({ updatedAt }: MarketStatusProps) {
  return (
    <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-stone-50">وضعیت بازار</h2>
        <p className="mt-1 text-sm text-stone-400">
          اتصال مستقیم به موتور قیمت وارش گلد
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          آنلاین
        </span>
        <span className="rounded-full border border-white/10 bg-stone-900/60 px-3 py-1 text-sm text-stone-400">
          آخرین بروزرسانی:{" "}
          <span className="font-medium text-stone-200">
            {new Date(updatedAt).toLocaleString("fa-IR")}
          </span>
        </span>
      </div>
    </section>
  );
}
