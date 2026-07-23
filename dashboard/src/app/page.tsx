import PriceCard from "@/components/PriceCard";
import { getMarketPrice } from "@/lib/api";

export default async function Home() {
  const market = await getMarketPrice();

  return (
    <main className="min-h-screen bg-zinc-100 p-8 font-sans">
      <div className="mx-auto max-w-5xl">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">
            🟡 Waresh Gold
          </h1>

          <p className="mt-2 text-zinc-600">
            Market Dashboard
          </p>
        </header>


        <section className="grid gap-6 md:grid-cols-3">

          <PriceCard
            title="طلای ۱۸ عیار"
            value={`${market.gold18Price.toLocaleString()} تومان`}
          />

          <PriceCard
            title="دلار تهران"
            value={`${market.currencyPrice.toLocaleString()} تومان`}
          />

          <PriceCard
            title="اونس جهانی"
            value={`${market.ouncePrice.toLocaleString()} USD`}
          />

        </section>


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
            {new Date(market.updatedAt).toLocaleString("fa-IR")}
          </p>

        </section>

      </div>
    </main>
  );
}