"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, Check, CircleDot } from "lucide-react";

const stages = [
  {
    name: "USER INPUT",
    description:
      "A request, goal, or event enters the system with its relevant context and constraints.",
    technologies: ["Web UI", "REST API"],
  },
  {
    name: "API GATEWAY",
    description:
      "The application boundary validates input, applies access rules, and routes work to the right service.",
    technologies: ["FastAPI", "Authentication"],
  },
  {
    name: "ORCHESTRATION",
    description:
      "A workflow coordinates state, model calls, tools, retries, and human approval where needed.",
    technologies: ["LangGraph", "Workflow state"],
  },
  {
    name: "LLM / AGENT",
    description:
      "The model reasons over instructions and context, then proposes a response or a constrained action.",
    technologies: ["LLMs", "Structured output"],
  },
  {
    name: "RETRIEVAL / TOOLS",
    description:
      "Relevant knowledge is retrieved and approved tools provide the information or capability needed.",
    technologies: ["RAG", "Vector search", "MCP"],
  },
  {
    name: "EXECUTION",
    description:
      "Actions run through explicit permissions and produce observable results rather than assumed success.",
    technologies: ["APIs", "Tool adapters"],
  },
  {
    name: "VERIFICATION",
    description:
      "The result is checked against the task, safety rules, and expected output before it is returned.",
    technologies: ["Evaluations", "Guardrails"],
  },
  {
    name: "RESPONSE",
    description:
      "The user receives a clear result with useful context, status, and a traceable outcome.",
    technologies: ["Response formatting", "Observability"],
  },
];

export default function Architecture() {
  const [activeStage, setActiveStage] = useState(0);
  const active = stages[activeStage];

  return (
    <section
      id="architecture"
      className="relative overflow-hidden border-y border-white/10 bg-[#101216] px-5 py-20 text-[#f5f5f2] sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 flex items-center gap-4">
          <span className="text-[10px] tracking-[0.22em] text-[#65e5f2]">
            04
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
            System architecture
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="hidden text-[9px] uppercase tracking-[0.18em] text-white/30 sm:block">
            A way of thinking
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-[0.24em] text-[#6b9dff]">
              How I think about intelligent systems
            </p>
            <h2 className="max-w-[620px] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.07em] sm:text-6xl">
              Useful AI is a{" "}
              <span className="text-white/35">system,</span> not a prompt.
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-white/55">
              Strong AI products connect models to context, tools, and
              verification. Explore the stages to see the responsibility each
              layer carries.
            </p>

            <div
              className="mt-9 border-l border-[#65e5f2]/50 pl-5"
              aria-live="polite"
            >
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#65e5f2]">
                Selected layer
              </p>
              <h3 className="mt-3 text-lg font-medium uppercase tracking-[0.08em]">
                {active.name}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/55">
                {active.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {active.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="border border-white/10 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white/55"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <ol className="grid gap-2 sm:grid-cols-2">
              {stages.map((stage, index) => {
                const isActive = index === activeStage;
                const isPassed = index < activeStage;

                return (
                  <li key={stage.name}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveStage(index)}
                      className={`group flex min-h-[68px] w-full items-center gap-3 border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65e5f2] ${
                        isActive
                          ? "border-[#6b9dff]/60 bg-[#6b9dff]/[0.08]"
                          : "border-white/10 bg-white/[0.015] hover:border-white/25"
                      }`}
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center border border-white/10 text-[9px] text-white/45">
                        {isPassed ? (
                          <Check size={12} aria-hidden="true" />
                        ) : (
                          String(index + 1).padStart(2, "0")
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-white/85">
                          {stage.name}
                        </span>
                        <span className="mt-1 block truncate text-[9px] text-white/35">
                          {stage.technologies.join(" · ")}
                        </span>
                      </span>
                      {index < stages.length - 1 && (
                        <span className="text-white/20 sm:hidden" aria-hidden="true">
                          <ArrowDown size={13} />
                        </span>
                      )}
                      <span className="hidden text-white/20 sm:block" aria-hidden="true">
                        {index % 2 === 0 ? (
                          <ArrowRight size={13} />
                        ) : (
                          <CircleDot size={13} />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-[9px] uppercase tracking-[0.16em] text-white/30">
              Illustrative engineering model · implementations vary by product
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
