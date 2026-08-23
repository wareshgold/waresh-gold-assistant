interface GoldBubbleCardProps {
  marketPrice: number;
  intrinsicPrice: number;
  bubbleAmount: number;
  bubblePercentage: number;
}

export default function GoldBubbleCard({
  marketPrice,
  intrinsicPrice,
  bubbleAmount,
  bubblePercentage,
}: GoldBubbleCardProps) {
  const format = (value: number) =>
    new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value);

  const items = [
    { label: "قیمت بازار", value: `${format(marketPrice)} تومان` },
    { label: "قیمت ذاتی", value: `${format(intrinsicPrice)} تومان` },
    { label: "مقدار حباب", value: `${format(bubbleAmount)} تومان` },
    {
      label: "درصد حباب",
      value: `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(bubblePercentage)}٪`,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🫧</span>
        <h2 className="text-2xl font-bold text-stone-50">حباب طلا</h2>
      </div>
      <p className="mt-2 text-sm text-stone-400">
        تفاوت قیمت بازار با ارزش ذاتی طلای ۱۸ عیار
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-stone-900/60 p-5"
          >
            <p className="text-sm text-stone-400">{item.label}</p>
            <p className="mt-2 text-lg font-bold text-amber-300">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
