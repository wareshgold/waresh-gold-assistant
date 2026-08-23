interface PriceCardProps {
  title: string;
  value: string;
  icon: string;
  description?: string;
}

export default function PriceCard({
  title,
  value,
  icon,
  description,
}: PriceCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-amber-400/40 hover:bg-white/[0.07]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-stone-400">{title}</p>
          <p className="mt-3 text-2xl font-bold text-stone-50">{value}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-2xl">
          {icon}
        </div>
      </div>
      {description && <p className="mt-4 text-sm text-stone-500">{description}</p>}
    </div>
  );
}
