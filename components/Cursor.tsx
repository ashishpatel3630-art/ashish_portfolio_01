"use client";

import { useEffect, useState } from "react";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("VIEW");

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    const onEnterInteractive = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, .filter, .project-card, .contact-button");
      if (!interactive) {
        setActive(false);
        setLabel("VIEW");
        return;
      }

      setActive(true);
      const text = target.getAttribute("aria-label") || target.textContent || "VIEW";
      setLabel(text.trim().slice(0, 12).toUpperCase() || "VIEW");
    };

    const onLeaveInteractive = () => {
      setActive(false);
      setLabel("VIEW");
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    document.querySelectorAll("a, button, .filter, .project-card, .contact-button").forEach((element) => {
      element.addEventListener("pointerenter", onEnterInteractive);
      element.addEventListener("pointerleave", onLeaveInteractive);
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.querySelectorAll("a, button, .filter, .project-card, .contact-button").forEach((element) => {
        element.removeEventListener("pointerenter", onEnterInteractive);
        element.removeEventListener("pointerleave", onLeaveInteractive);
      });
    };
  }, []);

  return (
    <div
      className={`cursor ${visible ? "visible" : ""} ${active ? "active" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      aria-hidden="true"
    >
      <span className="cursor-dot" />
      <span className="cursor-label">{label}</span>
    </div>
  );
}
