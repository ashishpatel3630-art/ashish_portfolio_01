"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  ["HOME", "#top"],
  ["ABOUT", "#about"],
  ["PROJECTS", "#work"],
  ["EXPERTISE", "#expertise"],
  ["EXPERIENCE", "#experience"],
  ["CONTACT", "#contact"],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.35] },
    );

    links.forEach(([, href]) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Ashish Mewada, home">
        AM<span>.</span>
      </a>

      <nav
        className={`nav-links ${open ? "open" : ""}`}
        id="primary-navigation"
        aria-label="Main navigation"
      >
        {links.map(([label, href]) => (
          <a
            key={label}
            href={href}
            aria-current={active === href ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>

      <a className="header-availability" href="mailto:ashishpatel3630@gmail.com">
        <span />
        OPEN TO OPPORTUNITIES
      </a>

      <button
        className="menu-toggle"
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-controls="primary-navigation"
        aria-expanded={open}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  );
}
