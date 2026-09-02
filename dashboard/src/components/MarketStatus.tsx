interface MarketStatusProps {
  updatedAt: string;
}

export default function MarketStatus({ updatedAt }: MarketStatusProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-[#8b8379]">
      <span className="flex items-center gap-2 font-semibold text-[#698260]">
        <span className="h-2 w-2 rounded-full bg-[#698260]" />
        بازار آنلاین
      </span>
      <span>
        آخرین بروزرسانی: {new Date(updatedAt).toLocaleString("fa-IR")}
      </span>
    </div>
  );
}
