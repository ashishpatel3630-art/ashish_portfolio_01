
"use client";

import {
  ArrowUpRight,
  GitBranch,
  Globe,
  Mail,
  MoveUpRight,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

const socialLinks = [
  {
    label: "GITHUB",
    handle: "Explore my work",
    href: "https://github.com/ashishpatel3630-art",
    icon: GitBranch,
  },
  {
    label: "LINKEDIN",
    handle: "Let's connect",
    href: "https://linkedin.com/in/ashish-mewada-0499ba379",
    icon: Globe,
  },
];

const reveal = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
    },
  },
};

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-[#080808] px-6 py-28 text-white md:px-12 lg:px-20 lg:py-36"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-[-180px] left-1/2 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.045] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl">

        {/* Section label */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 flex items-center gap-4"
        >
          <span className="text-xs tracking-[0.3em] text-white">
            07
          </span>

          <span className="text-xs tracking-[0.3em] text-white/40">
            CONTACT
          </span>

          <div className="h-px flex-1 bg-white/10" />

          <span className="hidden text-[10px] tracking-[0.25em] text-white/25 sm:block">
            THE NEXT STEP STARTS HERE
          </span>
        </motion.div>

        {/* Main contact area */}
        <div className="grid gap-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">

          {/* Main heading */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="mb-8 flex items-center gap-3">
              <Sparkles size={15} className="text-white/60" />

              <span className="text-[10px] tracking-[0.3em] text-white/40">
                HAVE AN IDEA? LET&apos;S MAKE IT REAL.
              </span>
            </div>

            <h2 className="text-[clamp(3.3rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.075em]">
              LET&apos;S BUILD
              <br />
              <span className="text-white/30">
                SOMETHING
              </span>
              <br />
              INTELLIGENT<span className="text-white/30">.</span>
            </h2>

            <p className="mt-10 max-w-xl text-sm leading-8 text-white/45 md:text-base">
              Have a project, an interesting opportunity or an idea worth
              exploring? I&apos;m always open to connecting with people who
              want to build meaningful technology.
            </p>
          </motion.div>

          {/* Contact action */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-10 lg:pb-2"
          >
            <div>
              <span className="mb-5 block text-[10px] tracking-[0.25em] text-white/30">
                01 / GET IN TOUCH
              </span>

              <a
                href="mailto:ashishpatel3630@gmail.com"
                className="group flex w-full items-center justify-between gap-5 rounded-2xl border border-white/15 bg-white/[0.04] p-6 transition-all duration-500 hover:border-white/40 hover:bg-white hover:text-black sm:p-8"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 transition-colors duration-500 group-hover:border-black/20">
                    <Mail size={19} />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold tracking-[0.16em]">
                      START A CONVERSATION
                    </span>

                    <span className="mt-2 block text-[11px] text-white/40 transition-colors duration-500 group-hover:text-black/50">
                      ashishpatel3630@gmail.com
                    </span>
                  </div>
                </div>

                <ArrowUpRight
                  size={22}
                  className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            </div>

            {/* Social links */}
            <div>
              <span className="mb-5 block text-[10px] tracking-[0.25em] text-white/30">
                02 / FIND ME ONLINE
              </span>

              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -5 }}
                      className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-all duration-300 hover:border-white/35 hover:bg-white/[0.07]"
                    >
                      <div>
                        <Icon
                          size={18}
                          className="mb-4 text-white/60 transition-colors group-hover:text-white"
                        />

                        <span className="block text-[10px] font-semibold tracking-[0.2em]">
                          {item.label}
                        </span>

                        <span className="mt-2 block text-[10px] text-white/30">
                          {item.handle}
                        </span>
                      </div>

                      <MoveUpRight
                        size={15}
                        className="self-start text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                      />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom divider */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-32 border-t border-white/10 pt-8"
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-white/70">
                ASHISH MEWADA
              </p>

              <p className="mt-2 text-[10px] tracking-[0.2em] text-white/30">
                AI ENGINEER / BUILDER / CREATOR
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />

              <span className="text-[10px] tracking-[0.2em] text-white/40">
                OPEN TO OPPORTUNITIES
              </span>
            </div>

            <span className="text-[10px] tracking-[0.2em] text-white/25">
              © 2026 ALL RIGHTS RESERVED
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
 