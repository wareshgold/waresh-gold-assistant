export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-100 p-8 font-sans">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="h-10 w-64 animate-pulse rounded bg-zinc-300" />
          <div className="mt-3 h-5 w-40 animate-pulse rounded bg-zinc-200" />
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-white shadow"
            />
          ))}
        </section>
      </div>
    </main>
  );
}