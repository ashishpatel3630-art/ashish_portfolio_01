import { ArrowUpRight, ExternalLink, GitBranch } from "lucide-react";

interface Project {
  number: string;
  name: string;
  type: string;
  description: string;
  stack: string[];
  github: string;
  live: string;
  status: string;
  category: string;
}

const projectFlows: Record<string, string[]> = {
  PATREXO: ["BUSINESS KNOWLEDGE", "AGENT WORKFLOW", "APPROVAL"],
  "KARYA AI": ["LOCAL MODEL", "WORKBENCH", "MCP TOOLS"],
  "OGI RIDE": ["STUDENTS", "ROUTES", "FLEET"],
  "RAG KNOWLEDGE ASSISTANT": ["DOCUMENTS", "EMBEDDINGS", "RETRIEVAL"],
};

export default function ProjectCard({ project }: { project: Project }) {
  const flow = projectFlows[project.name] ?? [];
  const isConcept = project.status === "CONCEPT";

  return (
    <article className="group min-w-0">
      <div
        aria-label={`${project.name} system preview: ${flow.join(" to ")}`}
        className="relative flex min-h-[230px] flex-col justify-between overflow-hidden border border-white/10 bg-[#101216] p-5 sm:min-h-[280px] sm:p-7"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_45%,rgba(107,157,255,0.11),transparent_58%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="relative flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-white/45">
          <span>{isConcept ? "Concept architecture" : "System architecture"}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#65e5f2]" />
            {project.number}
          </span>
        </div>

        <div className="relative grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-3">
          {flow.map((step, index) => (
            <span key={step} className="contents">
              <span className="flex min-h-[62px] items-center justify-center border border-white/10 bg-[#08090b]/70 px-2 text-center text-[8px] uppercase leading-4 tracking-[0.1em] text-white/75 sm:min-h-[74px] sm:px-3 sm:text-[9px]">
                {step}
              </span>
              {index < flow.length - 1 && (
                <span
                  aria-hidden="true"
                  className="h-px w-3 bg-gradient-to-r from-[#6b9dff]/30 to-[#65e5f2]/70 sm:w-5"
                />
              )}
            </span>
          ))}
        </div>

        <div className="relative flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-[9px] uppercase tracking-[0.14em] text-white/40">
          <span>{project.category}</span>
          <span>{isConcept ? "Exploration" : project.status}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[9px] uppercase tracking-[0.14em] text-white/40">
        <span>{project.number} / {project.type}</span>
        <span className="text-[#65e5f2]">{project.status}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <h3 className="text-3xl font-semibold uppercase tracking-[-0.06em] text-white sm:text-4xl">
          {project.name}
        </h3>
        <ArrowUpRight
          aria-hidden="true"
          className="shrink-0 text-[#6b9dff] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
        />
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((technology) => (
          <span
            key={technology}
            className="border border-white/10 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] text-white/45"
          >
            {technology}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-[9px] uppercase tracking-[0.14em]">
        <span className="text-white/35">
          {isConcept ? "Experimental concept" : project.status}
        </span>
        <div className="flex flex-wrap gap-4">
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-[#65e5f2]"
            >
              Live project <ExternalLink size={12} aria-hidden="true" />
            </a>
          ) : null}
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-[#65e5f2]"
            >
              Source <GitBranch size={13} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
