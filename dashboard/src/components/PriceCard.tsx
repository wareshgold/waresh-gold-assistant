interface PriceCardProps {
  title: string;
  value: string;
}

export default function PriceCard({
  title,
  value,
}: PriceCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="text-sm text-zinc-500">
        {title}
      </h3>

      <p className="mt-3 text-2xl font-bold text-zinc-900">
        {value}
      </p>
    </div>
  );
}