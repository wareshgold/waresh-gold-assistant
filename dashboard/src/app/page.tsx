import PriceCard from "@/components/PriceCard";
import MarketStatus from "@/components/MarketStatus";
import GoldBubbleCard from "@/components/GoldBubbleCard";

import {
  getMarketPrice,
  getGoldBubble,
} from "@/lib/api";



export default async function Home() {


  const market =
    await getMarketPrice();



  const bubble =
    await getGoldBubble();



  return (

    <main
      className="
        min-h-screen
        bg-zinc-100
        p-8
        font-sans
      "
    >


      <div className="mx-auto max-w-6xl">



        <header className="mb-10">


          <div
            className="
              rounded-3xl
              bg-white
              p-8
              shadow-sm
              border
              border-zinc-200
            "
          >


            <h1
              className="
                text-4xl
                font-bold
                text-zinc-900
              "
            >
              🟡 Waresh Gold
            </h1>



            <p
              className="
                mt-3
                text-lg
                text-zinc-600
              "
            >
              Professional Gold Market Dashboard
            </p>



            <p
              className="
                mt-2
                text-sm
                text-zinc-500
              "
            >
              Live data powered by Waresh Gold Engine
            </p>


          </div>


        </header>




        <section
          className="
            grid
            gap-6
            md:grid-cols-3
          "
        >


          <PriceCard

            title="طلای ۱۸ عیار"

            value={
              `${market.gold18Price.toLocaleString()} تومان`
            }

            icon="🟡"

            description="قیمت لحظه‌ای هر گرم"

          />



          <PriceCard

            title="دلار تهران"

            value={
              `${market.currencyPrice.toLocaleString()} تومان`
            }

            icon="💵"

            description="نرخ بازار آزاد"

          />



          <PriceCard

            title="اونس جهانی"

            value={
              `${market.ouncePrice.toLocaleString()} USD`
            }

            icon="🌎"

            description="Gold Spot Price"

          />


        </section>




        <GoldBubbleCard

          marketPrice={
            bubble.marketPrice
          }


          intrinsicPrice={
            bubble.intrinsicPrice
          }


          bubbleAmount={
            bubble.bubbleAmount
          }


          bubblePercentage={
            bubble.bubblePercentage
          }

        />





        <MarketStatus

          updatedAt={
            market.updatedAt
          }

        />


      </div>


    </main>

  );

}