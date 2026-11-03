
"use client";

import {
  ArrowUpRight,
  MapPin,
  BrainCircuit,
  Workflow,
  Code2,
  MoveUpRight,
} from "lucide-react";

import { motion } from "framer-motion";

const highlights = [
  {
    icon: BrainCircuit,
    number: "01",
    title: "AI ENGINEERING",
    description:
      "Building intelligent applications powered by LLMs, RAG pipelines and machine learning.",
    tags: ["LLMs", "RAG", "ML"],
  },
  {
    icon: Workflow,
    number: "02",
    title: "AGENTIC SYSTEMS",
    description:
      "Engineering autonomous agents, intelligent tool calling and multi-step AI workflows.",
    tags: ["AI Agents", "LangGraph", "MCP"],
  },
  {
    icon: Code2,
    number: "03",
    title: "SYSTEMS THINKING",
    description:
      "Connecting backend architecture, intelligent logic and product experiences into scalable systems.",
    tags: ["Python", "Backend", "Architecture"],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#080808] px-6 py-28 text-white md:px-12 lg:px-20 lg:py-36"
    >
      {/* Background details */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[10%] h-[450px] w-[450px] rounded-full bg-white/[0.025] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Section Header */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-20 flex items-center gap-4"
        >
          <span className="text-xs tracking-[0.3em] text-white">
            02
          </span>

          <span className="text-xs tracking-[0.3em] text-white/40">
            ABOUT ME
          </span>

          <div className="h-px flex-1 bg-white/10" />

          <span className="hidden text-[10px] tracking-[0.25em] text-white/25 sm:block">
            BEHIND THE CODE
          </span>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-28">

          {/* Left */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.p
              variants={revealVariants}
              className="mb-8 text-[10px] tracking-[0.35em] text-white/40"
            >
              ENGINEER / BUILDER / LEARNER
            </motion.p>

            <motion.h2
              variants={revealVariants}
              className="text-5xl font-semibold leading-[1.05] tracking-[-0.065em] sm:text-6xl md:text-7xl lg:text-[86px]"
            >
              BEYOND
              <br />
              BUILDING
              <br />
              <span className="text-white/30">
                MODELS.
              </span>
              <br />
              BUILDING
              <br />
              INTELLIGENCE<span className="text-white/30">.</span>
            </motion.h2>

            <motion.div
              variants={revealVariants}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 transition-all duration-500 hover:border-white/30 hover:bg-white/[0.06]">
                <MapPin size={15} className="text-white/60" />

                <span className="text-[10px] tracking-[0.2em] text-white/60">
                  BHOPAL, INDIA
                </span>
              </div>

              <span className="text-[10px] tracking-[0.2em] text-white/25">
                OPEN TO OPPORTUNITIES
              </span>
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col justify-center"
          >
            <motion.div variants={revealVariants}>
              <span className="mb-7 block text-[10px] tracking-[0.3em] text-white/30">
                01 / WHO I AM
              </span>

              <p className="text-xl font-light leading-relaxed tracking-tight text-white/90 md:text-2xl">
                I work at the intersection of{" "}
                <span className="font-medium text-white">
                  artificial intelligence
                </span>
                , software engineering and product thinking — building
                technology designed to solve meaningful problems.
              </p>
            </motion.div>

            <motion.div variants={revealVariants}>
              <p className="mt-9 text-sm leading-8 text-white/45 md:text-base">
                My engineering focus revolves around LLM application
                development, retrieval-augmented generation, agentic AI
                architectures and the backend infrastructure required
                to power intelligent systems.
              </p>
            </motion.div>

            <motion.div variants={revealVariants}>
              <p className="mt-6 text-sm leading-8 text-white/45 md:text-base">
                I enjoy the entire development journey — from understanding
                complex problems and designing system architectures to
                implementing intelligent workflows and crafting experiences
                people love to use.
              </p>
            </motion.div>

            <motion.div variants={revealVariants}>
              <a
                href="https://linkedin.com/in/ashish-mewada-0499ba379"
                target="_blank"
                rel="noreferrer"
                className="group mt-12 inline-flex w-fit items-center gap-4 border-b border-white/30 pb-3 text-[11px] tracking-[0.25em] text-white transition-all duration-300 hover:border-white hover:text-white/60"
              >
                LET&apos;S CONNECT

                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Expertise Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-32 grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.number}
                variants={revealVariants}
                whileHover={{ y: -7 }}
                className="group relative border-b border-white/10 py-10 transition-colors duration-500 hover:bg-white/[0.025] sm:px-7 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0"
              >
                {/* Card top */}
                <div className="mb-12 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-black">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>

                  <span className="text-[10px] tracking-[0.2em] text-white/25">
                    / {item.number}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-white">
                    {item.title}
                  </h3>

                  <MoveUpRight
                    size={15}
                    className="text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                  />
                </div>

                <p className="mt-5 max-w-sm text-sm leading-7 text-white/40 transition-colors duration-300 group-hover:text-white/65">
                  {item.description}
                </p>

                {/* Technology Tags */}
                <div className="mt-7 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] tracking-wider text-white/40 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom indicator */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-700 group-hover:w-full" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Statement */}
        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-24 flex flex-col justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center"
        >
          <p className="text-[10px] tracking-[0.25em] text-white/25">
            THINK DEEPER. BUILD SMARTER. CREATE IMPACT.
          </p>

          <span className="text-[10px] tracking-[0.2em] text-white/25">
            ASHISH MEWADA © 2026
          </span>
        </motion.div>

      </div>
    </section>
  );
}
