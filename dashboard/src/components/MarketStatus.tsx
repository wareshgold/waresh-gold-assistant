interface MarketStatusProps {
  updatedAt: string;
}

export default function MarketStatus({
  updatedAt,
}: MarketStatusProps) {

  return (
    <section
      className="
        mt-8
        rounded-2xl
        bg-white
        p-6
        shadow-sm
        border
        border-zinc-200
      "
    >

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-zinc-900">
            وضعیت بازار
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            اتصال مستقیم به Waresh Gold Market Engine
          </p>

        </div>


        <div className="flex items-center gap-2">

          <span
            className="
              h-3
              w-3
              rounded-full
              bg-green-500
            "
          />

          <span className="text-sm font-medium text-green-600">
            Online
          </span>

        </div>

      </div>


      <div
        className="
          mt-6
          rounded-xl
          bg-zinc-50
          p-4
          text-sm
          text-zinc-600
        "
      >

        آخرین بروزرسانی:

        <span className="ml-2 font-medium text-zinc-900">
          {new Date(updatedAt).toLocaleString("fa-IR")}
        </span>

      </div>


    </section>
  );
}