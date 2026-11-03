
import {
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
} from "lucide-react";

const experience = [
  {
    date: "CURRENT",
    category: "PROFESSIONAL EXPERIENCE",
    title: "ML ENGINEER",
    company: "Elix Studio",
    description:
      "Machine Learning Engineer at Elix Studio.",
    icon: BriefcaseBusiness,
    current: true,
  },
  {
    date: "1 MONTH",
    category: "INTERNSHIP",
    title: "INTERN",
    company: "Patrex",
    description: "One-month internship experience at Patrex.",
    icon: BriefcaseBusiness,
    current: false,
  },
  {
    date: "EXPECTED 2028",
    category: "EDUCATION",
    title: "B.TECH · COMPUTER SCIENCE",
    company: "Oriental College of Technology",
    description:
      "Undergraduate studies in Computer Science and Engineering. Expected graduation: 2028.",
    icon: GraduationCap,
    current: false,
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-[#08090D] px-6 py-24 text-white md:px-12 lg:px-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 flex items-center gap-4">
          <span className="text-xs tracking-[0.25em] text-blue-400">
            06
          </span>

          <span className="text-xs tracking-[0.25em] text-white/50">
            EXPERIENCE & EDUCATION
          </span>

          <div className="h-px flex-1 bg-white/10" />

          <span className="hidden text-[10px] tracking-[0.2em] text-white/30 sm:block">
            MY JOURNEY
          </span>
        </div>

        {/* Main Layout */}
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          {/* Left Content */}
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <p className="mb-7 text-[11px] tracking-[0.3em] text-blue-400">
              THE PATH SO FAR
            </p>

            <h2 className="text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              ALWAYS
              <br />
              <span className="text-blue-400">IN MOTION.</span>
            </h2>

            <p className="mt-8 max-w-sm text-sm leading-8 text-white/45 md:text-base">
              Every experience adds a new perspective. From learning
              engineering fundamentals to building intelligent systems,
              I&apos;m continuously growing as an engineer and builder.
            </p>

            <div className="mt-10 flex items-center gap-3 text-xs tracking-[0.2em] text-white/40">
              <MapPin size={15} className="text-blue-400" />
              BHOPAL, INDIA
            </div>
          </div>

          {/* Right Timeline */}
          <div className="relative">
            <div className="absolute bottom-8 left-[5px] top-8 w-px bg-white/10" />

            <div className="space-y-5">
              {experience.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={`${item.company}-${item.title}`}
                    className="group relative pl-9"
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-0 top-9 z-10 h-[11px] w-[11px] rounded-full border-2 ${
                        item.current
                          ? "border-blue-400 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                          : "border-white/30 bg-[#08090D]"
                      }`}
                    />

                    <div className="border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.04] sm:p-8">
                      {/* Date and Category */}
                      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[10px] font-medium tracking-[0.2em] text-blue-400">
                          {item.date}
                        </span>

                        <span className="text-[9px] tracking-[0.18em] text-white/30">
                          {item.category}
                        </span>
                      </div>

                      {/* Role */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm text-white/55">
                            {item.company}
                          </p>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 text-blue-400 transition-colors duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-400/10">
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                      </div>

                      <p className="mt-6 max-w-lg text-sm leading-7 text-white/40">
                        {item.description}
                      </p>

                      {item.current && (
                        <div className="mt-7 flex items-center gap-2">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                          <span className="text-[9px] tracking-[0.2em] text-blue-400">
                            CURRENT POSITION
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Journey End */}
            <div className="ml-1 mt-8 flex items-center gap-3 pl-8">
              <div className="h-2 w-2 rounded-full bg-white/20" />
              <span className="text-[10px] tracking-[0.2em] text-white/25">
                THE JOURNEY CONTINUES...
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs tracking-[0.15em] text-white/35">
            LEARNING. BUILDING. EVOLVING.
          </p>

          <a
            href="https://linkedin.com/in/ashish-mewada-0499ba379"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 text-xs tracking-[0.15em] text-white transition-colors hover:text-blue-400"
          >
            CONNECT WITH ME
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
