import { useEffect, useState } from "react";
import { useIsMobile } from "./useMediaQuery";

const SECTIONS = [
  { id: "", label: "Intro" },
  { id: "about", label: "About" },
  { id: "services", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "footer", label: "Contact" },
];

/**
 * Phone navigation. The desktop header puts three word-buttons across the top
 * row; there is no room for that on a phone, and a hamburger would hide the
 * one thing worth showing — where you are in a five-screen, snap-scrolled site.
 *
 * So the accent rail that already runs down the right edge of every section
 * becomes the navigation: one marker per section, the current one drawn as a
 * long bar, everything blended with `difference` so it stays legible whether
 * the rail underneath it is black or bone. It doubles as a progress readout
 * and sits exactly where a thumb rests.
 */
export function SectionRail() {
  const mobile = useIsMobile();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onChange = (e: Event) => setIdx((e as CustomEvent<number>).detail);
    setIdx((window as any).__currentSnapIdx ?? 0);
    window.addEventListener("snapchange", onChange);
    return () => window.removeEventListener("snapchange", onChange);
  }, []);

  if (!mobile) return null;

  return (
    <nav
      aria-label="Sections"
      className="fixed right-0 top-0 z-[60] flex h-[100dvh] flex-col items-center justify-center"
      style={{ width: 40, mixBlendMode: "difference" as any }}
    >
      <span
        className="font-cond uppercase"
        style={{
          writingMode: "vertical-rl",
          fontSize: 10,
          letterSpacing: "0.18em",
          color: "#fafafa",
          marginBottom: 16,
          transition: "opacity 0.3s ease",
        }}
      >
        {SECTIONS[idx]?.label}
      </span>

      <div className="flex flex-col items-center" style={{ gap: 10 }}>
        {SECTIONS.map((s, i) => {
          const active = i === idx;
          return (
            <button
              key={s.label}
              type="button"
              aria-label={`Go to ${s.label}`}
              aria-current={active}
              onClick={() => (window as any).__snapTo?.(i)}
              className="flex items-center justify-center"
              // Visually a 3px tick, but a 40x22 touch target around it.
              style={{ width: 40, height: 22, background: "transparent", padding: 0, border: 0 }}
            >
              <span
                style={{
                  display: "block",
                  width: 3,
                  height: active ? 26 : 6,
                  background: "#fafafa",
                  opacity: active ? 1 : 0.45,
                  transition: "height 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
