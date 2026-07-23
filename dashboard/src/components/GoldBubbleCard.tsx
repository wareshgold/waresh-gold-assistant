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


  return (

    <section
      className="
        mt-8
        rounded-3xl
        bg-white
        p-8
        shadow-sm
        border
        border-zinc-200
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          text-zinc-900
        "
      >
        🫧 حباب طلا
      </h2>



      <div
        className="
          mt-6
          grid
          gap-5
          md:grid-cols-4
        "
      >


        <div>

          <p className="text-sm text-zinc-500">
            قیمت بازار
          </p>

          <p className="mt-2 text-xl font-bold">
            {Math.round(marketPrice).toLocaleString()}
            {" "}
            تومان
          </p>

        </div>



        <div>

          <p className="text-sm text-zinc-500">
            قیمت ذاتی
          </p>

          <p className="mt-2 text-xl font-bold">
            {Math.round(intrinsicPrice).toLocaleString()}
            {" "}
            تومان
          </p>

        </div>



        <div>

          <p className="text-sm text-zinc-500">
            مقدار حباب
          </p>

          <p className="mt-2 text-xl font-bold">
            {Math.round(bubbleAmount).toLocaleString()}
            {" "}
            تومان
          </p>

        </div>



        <div>

          <p className="text-sm text-zinc-500">
            درصد حباب
          </p>

          <p className="mt-2 text-xl font-bold">
            {bubblePercentage.toFixed(2)}
            %
          </p>

        </div>


      </div>


    </section>

  );

}