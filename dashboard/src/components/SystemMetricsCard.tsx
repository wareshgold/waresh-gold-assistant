import type {
  SystemMetricsSummary,
} from "@/types/system";


interface Props {

  metrics:
    SystemMetricsSummary;

}



export default function SystemMetricsCard({

  metrics

}: Props) {


  const items = [

    {
      title: "Requests",
      value: metrics.requests,
      icon: "🌐",
    },

    {
      title: "Latency",
      value: `${metrics.requestDuration} ms`,
      icon: "⚡",
    },

    {
      title: "Cache Hits",
      value: metrics.cacheHits,
      icon: "🚀",
    },

    {
      title: "Cache Misses",
      value: metrics.cacheMisses,
      icon: "📦",
    },

    {
      title: "Market Success",
      value: metrics.marketFetchSuccess,
      icon: "🟢",
    },

    {
      title: "Errors",
      value:
        metrics.marketFetchFailure +
        metrics.cacheErrors,
      icon: "🔴",
    },

  ];



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
          mb-6
          text-2xl
          font-bold
          text-zinc-900
        "
      >
        ⚙️ System Monitoring
      </h2>



      <div
        className="
          grid
          gap-5
          md:grid-cols-3
        "
      >

        {items.map((item) => (

          <div
            key={item.title}
            className="
              rounded-2xl
              bg-zinc-50
              p-5
              border
              border-zinc-100
            "
          >

            <div className="text-2xl">
              {item.icon}
            </div>


            <div
              className="
                mt-3
                text-sm
                text-zinc-500
              "
            >
              {item.title}
            </div>


            <div
              className="
                mt-1
                text-2xl
                font-bold
                text-zinc-900
              "
            >
              {item.value}
            </div>


          </div>

        ))}

      </div>


    </section>

  );

}