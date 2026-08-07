import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ActionButton } from "./ActionButton";

const goTo = (id: string) => {
  const snaps = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
  const idx = snaps.indexOf(document.getElementById(id) as HTMLElement);
  if (idx >= 0) (window as any).__snapTo?.(idx);
};

export function Navbar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.6, ease: "power3.out" });
  }, []);

  return (
    <div
      ref={ref}
      className="fixed left-0 top-0 z-50 site-grid h-20 items-center"
      style={{ mixBlendMode: "difference" as any, color: "#fafafa" }}
    >
      {/* Logo in first col area */}
      <div className="col-span-3 flex items-center" style={{ paddingLeft: "calc(100vw / 13)" }}>
        <span className="font-display text-[1.25rem]" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
          Gio.
        </span>
      </div>

      {/* C0ntact */}
      <div className="flex justify-center" style={{ gridColumn: "10 / 11" }}>
        <ActionButton tone="light" size="nav" onClick={() => goTo("footer")}>Contact.</ActionButton>
      </div>
      {/* About */}
      <div className="flex justify-center" style={{ gridColumn: "11 / 12" }}>
        <ActionButton tone="light" size="nav" onClick={() => goTo("about")}>About.</ActionButton>
      </div>
      {/* Work — sits exactly above accent column */}
      <div className="col-accent flex justify-center">
        <ActionButton tone="light" size="nav" onClick={() => goTo("projects")}>Work.</ActionButton>
      </div>
    </div>
  );
}
