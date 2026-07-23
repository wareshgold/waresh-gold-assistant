"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-8">
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <h2 className="text-2xl font-bold text-zinc-900">
          خطا در دریافت اطلاعات بازار
        </h2>

        <p className="mt-3 text-zinc-600">
          ارتباط با سرویس قیمت طلا برقرار نشد.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black px-5 py-3 text-white"
        >
          تلاش دوباره
        </button>
      </div>
    </main>
  );
}