interface PriceCardProps {
  title: string;
  value: string;
  icon: string;
  description?: string;
}

export default function PriceCard({ title, value, icon, description }: PriceCardProps) {
  return (
    <article className="group bg-[#fffdf9] p-7 transition hover:bg-[#fbf7ef] sm:p-8">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-[#766f66]">{title}</p>
          <p className="mt-4 text-2xl font-extrabold tracking-tight text-[#29251f] sm:text-3xl">{value}</p>
        </div>
        <span className="text-sm font-bold tracking-widest text-[#b08a45] transition group-hover:scale-105">{icon}</span>
      </div>
      {description && <p className="mt-5 text-xs text-[#9a9187]">{description}</p>}
    </article>
  );
}
