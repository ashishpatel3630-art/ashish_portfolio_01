export default function Loading() {
  return (
    <main
      aria-label="Loading portfolio"
      className="min-h-screen animate-pulse bg-[#08090b] px-6 py-10 text-[#f5f5f2] motion-reduce:animate-none"
    >
      <div className="mx-auto max-w-7xl">
        <div className="h-10 border-b border-white/10" />
        <div className="mt-24 max-w-4xl space-y-4">
          <div className="h-5 w-48 bg-white/[0.08]" />
          <div className="h-16 max-w-3xl bg-white/[0.08] sm:h-24" />
          <div className="h-16 max-w-2xl bg-white/[0.08] sm:h-24" />
          <div className="h-16 max-w-3xl bg-white/[0.08] sm:h-24" />
          <div className="h-4 max-w-xl bg-white/[0.05]" />
        </div>
      </div>
    </main>
  );
}
