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

  const percent = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(bubblePercentage);
  const positive = bubbleAmount >= 0;

  const items = [
    { label: "قیمت بازار", value: `${format(marketPrice)} تومان` },
    { label: "ارزش ذاتی", value: `${format(intrinsicPrice)} تومان` },
    { label: "مقدار حباب", value: `${format(bubbleAmount)} تومان` },
    { label: "درصد حباب", value: `${percent}٪` },
  ];

  return (
    <section className="border border-[#e1d8cc] bg-[#fffdf9]">
      <div className="flex flex-col gap-4 border-b border-[#e8e0d4] p-7 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#a08350]">BUBBLE ANALYSIS</p>
          <h3 className="mt-3 text-2xl font-extrabold text-[#29251f]">فاصله بازار تا ارزش ذاتی</h3>
          <p className="mt-2 text-sm text-[#766f66]">تحلیل قیمت طلای ۱۸ عیار بر اساس ارزش ذاتی محاسبه‌شده</p>
        </div>
        <span className={`text-lg font-extrabold ${positive ? "text-[#9a6840]" : "text-[#698260]"}`}>
          {positive ? "حباب مثبت" : "حباب منفی"} · {percent}٪
        </span>
      </div>
      <div className="grid gap-px bg-[#e1d8cc] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="bg-[#fffdf9] p-6">
            <p className="text-xs text-[#8b8379]">{item.label}</p>
            <p className="mt-3 text-lg font-bold text-[#3d3831]">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
