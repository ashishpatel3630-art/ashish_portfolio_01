"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, MapPin } from "lucide-react";

const HeroNetwork = dynamic(() => import("@/components/HeroNetwork"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="absolute inset-0 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(101,229,242,0.12),transparent_65%)]"
    />
  ),
});

const revealTarget = { opacity: 1, y: 0 };

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <header
      id="top"
      className="relative isolate min-h-[calc(100svh-84px)] overflow-hidden border-b border-white/10 bg-[#08090b] text-[#f5f5f2]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_45%,rgba(107,157,255,0.11),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent_40%)]"
      />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/[0.045] lg:block" />

      <div className="relative mx-auto flex min-h-[inherit] w-full max-w-[1440px] flex-col px-5 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between border-b border-white/10 py-4 text-[9px] uppercase tracking-[0.2em] text-white/55 sm:text-[10px]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>Open to AI engineering opportunities</span>
          </div>
          <span className="hidden items-center gap-2 sm:flex">
            <MapPin size={12} className="text-[#6b9dff]" />
            Bhopal, India
          </span>
        </div>

        <div className="grid flex-1 items-center gap-4 py-10 md:py-12 lg:grid-cols-[1.28fr_0.72fr] lg:gap-0 lg:py-14">
          <div className="relative z-10">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={revealTarget}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.05 }}
              className="mb-6 text-[10px] uppercase tracking-[0.28em] text-white/50 sm:text-[11px]"
            >
              Ashish Mewada <span className="mx-2 text-[#6b9dff]">/</span>
              Agentic AI Engineer
            </motion.p>

            <h1 className="max-w-[900px] text-[clamp(2.9rem,8vw,7rem)] font-semibold uppercase leading-[0.82] tracking-[-0.085em]">
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                animate={revealTarget}
                transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.14, ease: "easeOut" }}
                className="block"
              >
                Engineering
              </motion.span>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                animate={revealTarget}
                transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
                className="block text-transparent [-webkit-text-stroke:1px_rgba(245,245,242,0.52)]"
              >
                Intelligence.
              </motion.span>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                animate={revealTarget}
                transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.36, ease: "easeOut" }}
                className="block"
              >
                Building
              </motion.span>
              <motion.span
                initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                animate={revealTarget}
                transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.47, ease: "easeOut" }}
                className="block"
              >
                What&apos;s <span className="text-[#6b9dff]">Next.</span>
              </motion.span>
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={revealTarget}
              transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.58 }}
              className="mt-7 max-w-[600px] text-sm leading-7 text-white/60 sm:text-base sm:leading-8"
            >
              I build intelligent systems that reason, retrieve, interact, and
              take action—turning complex AI capabilities into practical
              products.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={revealTarget}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                className="group inline-flex min-h-12 items-center gap-3 bg-[#6b9dff] px-5 text-[10px] font-medium uppercase tracking-[0.17em] text-[#08090b] transition-colors hover:bg-[#8bb2ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#65e5f2]"
              >
                Explore selected work
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center border border-white/15 px-5 text-[10px] uppercase tracking-[0.17em] text-white/80 transition-colors hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#65e5f2]"
              >
                Start a conversation
              </a>
            </motion.div>

            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[9px] uppercase tracking-[0.16em] text-white/38 sm:text-[10px]">
              <span>Generative AI</span>
              <span aria-hidden="true" className="text-[#65e5f2]">/</span>
              <span>Machine learning</span>
              <span aria-hidden="true" className="text-[#65e5f2]">/</span>
              <span>Systems engineering</span>
            </div>
          </div>

          <div className="relative mx-auto h-[300px] w-full max-w-[580px] sm:h-[390px] lg:h-[540px]">
            <div
              aria-hidden="true"
              className="absolute inset-[8%] rounded-full border border-white/[0.07]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-[20%] rounded-full border border-[#6b9dff]/15"
            />
            <HeroNetwork reducedMotion={Boolean(reduceMotion)} />
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.22em] text-white/40">
              Intelligence is a system
            </div>
            <div className="pointer-events-none absolute left-2 top-[22%] hidden border-l border-[#65e5f2]/40 pl-3 text-[9px] uppercase tracking-[0.16em] text-white/45 sm:block">
              <span className="block text-[#65e5f2]">01 / Reason</span>
              Model + context
            </div>
            <div className="pointer-events-none absolute bottom-[23%] right-0 hidden border-l border-[#6b9dff]/50 pl-3 text-[9px] uppercase tracking-[0.16em] text-white/45 sm:block">
              <span className="block text-[#6b9dff]">02 / Act</span>
              Tools + feedback
            </div>
          </div>
        </div>

        <a
          href="#approach"
          className="group flex items-center justify-between border-t border-white/10 py-4 text-[9px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white/80 sm:text-[10px]"
        >
          <span>AI engineering · Agentic systems · Product thinking</span>
          <span className="inline-flex items-center gap-2">
            Explore the system
            <ArrowDown
              size={13}
              className="transition-transform group-hover:translate-y-1"
            />
          </span>
        </a>
      </div>
    </header>
  );
}
