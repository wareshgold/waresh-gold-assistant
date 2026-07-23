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
    <div
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-sm
        border
        border-zinc-200
        transition
        hover:shadow-md
      "
    >

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-zinc-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-bold text-zinc-900">
            {value}
          </p>
        </div>


        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-yellow-100
            text-2xl
          "
        >
          {icon}
        </div>

      </div>


      {description && (
        <p className="mt-4 text-sm text-zinc-500">
          {description}
        </p>
      )}

    </div>
  );
}