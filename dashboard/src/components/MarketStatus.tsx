interface MarketStatusProps {
  updatedAt: string;
}

export default function MarketStatus({
  updatedAt,
}: MarketStatusProps) {
  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow">

      <h2 className="text-xl font-semibold text-zinc-900">
        Market Status
      </h2>

      <div className="mt-4 flex items-center gap-2">

        <span className="h-3 w-3 rounded-full bg-green-500" />

        <span className="text-zinc-700">
          Online
        </span>

      </div>

      <p className="mt-4 text-sm text-zinc-500">
        Last update:
        {" "}
        {new Date(updatedAt).toLocaleString("fa-IR")}
      </p>

    </section>
  );
}