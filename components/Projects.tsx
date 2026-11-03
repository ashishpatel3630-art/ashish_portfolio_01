
"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

const filters = ["ALL", "AGENTIC AI", "GENERATIVE AI", "PRODUCT"];

export default function Projects() {
  const [active, setActive] = useState("ALL");

  const filtered = projects.filter((project) => {
    return active === "ALL" || project.category === active;
  });

  return (
    <section className="work-section section-wrap" id="work">
      <div className="section-label">
        <span>01</span>
        <span>SELECTED WORK</span>
        <i />
      </div>

      <div className="section-heading-row">
        <h2>
          Ideas into
          <br />
          <span>working systems.</span>
        </h2>

        <p>
          Product work, engineering explorations, and concepts—clearly
          distinguished by their current status.
        </p>
      </div>

      <div className="filter-row" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={active === filter}
            className={`filter ${active === filter ? "active" : ""}`}
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filtered.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}
