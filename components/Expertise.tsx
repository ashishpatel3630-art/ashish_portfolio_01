"use client";

import { useState } from "react";
import { ArrowUpRight, BrainCircuit, Code2, Database, Workflow } from "lucide-react";
import { skillGroups, skillRelationships } from "@/data/skills";

const icons = [BrainCircuit, Database, Workflow, Code2];

export default function Expertise() {
  const [selected, setSelected] = useState("LLMs");
  const related = new Set([selected, ...(skillRelationships[selected] ?? [])]);

  return (
    <section
      className="mx-auto max-w-[1440px] px-5 py-20 text-[#f5f5f2] sm:px-8 lg:px-14 lg:py-28"
      id="expertise"
    >
      <div className="mb-12 flex items-center gap-4">
        <span className="text-[10px] tracking-[0.22em] text-[#65e5f2]">03</span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
          Technical ecosystem
        </span>
        <span className="h-px flex-1 bg-white/10" />
        <span className="hidden text-[9px] uppercase tracking-[0.18em] text-white/30 sm:block">
          Explore relationships
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-[#6b9dff]">
            Tools are part of the system
          </p>
          <h2 className="text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.07em] sm:text-6xl">
            Build the
            <br />
            <span className="text-white/35">connections.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
            A working toolkit across AI, application engineering, and
            infrastructure. Select a technology to highlight related parts of
            the ecosystem.
          </p>
          <div
            className="mt-8 border-l border-[#6b9dff]/50 pl-4"
            aria-live="polite"
          >
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">
              Selected technology
            </p>
            <p className="mt-2 text-lg font-medium text-[#65e5f2]">{selected}</p>
            <p className="mt-1 text-[11px] leading-5 text-white/40">
              Related: {(skillRelationships[selected] ?? []).join(" · ")}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {skillGroups.map((group, index) => {
            const Icon = icons[index];

            return (
              <article
                key={group.number}
                className="border border-white/10 bg-white/[0.015] p-5 transition-colors hover:border-white/20 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] tracking-[0.18em] text-[#6b9dff]">
                      {group.number}
                    </span>
                    <h3 className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/85">
                      {group.title}
                    </h3>
                  </div>
                  <Icon
                    size={17}
                    strokeWidth={1.4}
                    className="text-white/35"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.technologies.map((technology) => {
                    const isRelated = related.has(technology);

                    return (
                      <button
                        key={technology}
                        type="button"
                        aria-pressed={selected === technology}
                        onClick={() => setSelected(technology)}
                        className={`min-h-8 border px-2.5 py-1.5 text-left text-[9px] tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65e5f2] ${
                          selected === technology
                            ? "border-[#65e5f2]/70 bg-[#65e5f2]/10 text-[#a2f5fc]"
                            : isRelated
                              ? "border-[#6b9dff]/35 bg-[#6b9dff]/[0.06] text-white/80"
                              : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/80"
                        }`}
                      >
                        {technology}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-white/25">
                  <span>Focus area</span>
                  <ArrowUpRight size={12} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
