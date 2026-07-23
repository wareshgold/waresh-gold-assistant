import PriceCard from "@/components/PriceCard";
import MarketStatus from "@/components/MarketStatus";
import { getMarketPrice } from "@/lib/api";


export default async function Home() {

  const market =
    await getMarketPrice();


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


        <MarketStatus
          updatedAt={market.updatedAt}
        />


      </div>

    </main>
  );
}