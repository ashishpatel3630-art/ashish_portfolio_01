"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#08090b] px-6 text-[#f5f5f2]">
      <div className="max-w-lg">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#65e5f2]">
          Something went wrong
        </p>
        <h1 className="mt-4 text-4xl font-semibold uppercase tracking-[-0.06em] sm:text-5xl">
          The page hit an unexpected error.
        </h1>
        <p className="mt-5 text-sm leading-7 text-white/55">
          Please try again. If the problem continues, use the contact link to
          let me know.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-11 bg-[#6b9dff] px-5 text-[10px] uppercase tracking-[0.15em] text-[#08090b] hover:bg-[#8bb2ff]"
          >
            Try again
          </button>
          <a
            href="mailto:ashishpatel3630@gmail.com"
            className="inline-flex min-h-11 items-center border border-white/15 px-5 text-[10px] uppercase tracking-[0.15em] text-white/80 hover:border-white/40"
          >
            Contact
          </a>
        </div>
      </div>
    </main>
  );
}
