import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { DotTitle } from "../DotTitle";
import { MaskParagraph } from "../MaskParagraph";
import { useIsMobile } from "../useMediaQuery";
import type { HexItem } from "../HexRadar";

gsap.registerPlugin(ScrollTrigger);

/**
 * recharts is by far the heaviest dependency on the site and it is used only
 * here, so it gets its own chunk. App warms it on idle right after the intro,
 * which lands it long before this section can be reached by scrolling — and
 * the 0 → value animation still runs, because it keys off mount.
 */
const HexRadar = lazy(() => import("../HexRadar").then((m) => ({ default: m.HexRadar })));

const SKILLS: HexItem[] = [
  { label: "Product Design", value: 95 },
  { label: "UX/UI Design", value: 100 },
  { label: "AI Workflow Design", value: 95 },
  { label: "Design Systems", value: 85 },
  { label: "Project Management", value: 70 },
  { label: "Frontend Dev", value: 25 },
];

const TOOLS: HexItem[] = [
  { label: "Figma", value: 100 },
  { label: "Adobe Suite", value: 80 },
  { label: "Framer", value: 80 },
  { label: "Affinity Suite", value: 90 },
  { label: "AI Workflow Automation", value: 95 },
  { label: "VS Code", value: 25 },
];

const TABS = [
  { key: "skills", label: "Skills", data: SKILLS },
  { key: "tools", label: "Tools", data: TOOLS },
];

export function Services() {
  const sec = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const mobile = useIsMobile();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!sec.current) return;
    const st = ScrollTrigger.create({
      trigger: sec.current, start: "top 60%", once: true,
      onEnter: () => setStarted(true),
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={sec} id="services" data-snap className="relative h-screen w-full overflow-hidden bg-[#fafafa] text-[#121316]">
      <Grid animateIn accentColor="#121316" pulseColor="rgba(18,19,22,0.18)" lineColor="rgba(231,231,232,1)" />

      <div
        className="relative z-[5] flex h-full flex-col"
        style={{
          paddingLeft: "var(--gutter)",
          // Two columns clear on the right so the charts never run under the
          // black accent column.
          paddingRight: mobile ? "var(--content-pad-right)" : "calc(100vw / 13 * 2)",
          paddingTop: mobile ? "6rem" : "clamp(7rem, 19vh, 13rem)",
          paddingBottom: mobile ? "1.5rem" : "clamp(3rem, 12vh, 8rem)",
          gap: mobile ? "1rem" : "clamp(1.5rem, 1.67vw, 2rem)",
        }}
      >
        {/* Title + subtitle — same appear behaviour as before */}
        <div className="flex flex-col" style={{ gap: "clamp(1rem, 1.25vw, 1.5rem)", maxWidth: "min(738px, 100%)" }}>
          {started && (
            <DotTitle
              lines={["Skills & Tools"]}
              className="font-display uppercase"
              style={{ fontSize: "clamp(1.75rem, 2.08vw, 2.5rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "0.02em" }}
            />
          )}
          {started && (
            <MaskParagraph
              text="Throughout my years of experience, I've acquired expertise with some skills and tools, which I continue to perfect."
              delay={0.5}
              style={{ width: "100%", fontSize: "clamp(1rem, 1.25vw, 1.5rem)", lineHeight: 1.2 }}
            />
          )}
        </div>

        {/* Phone: side by side would give each hexagon ~140px of drawing area,
            so the two charts become one switchable chart at full width. The
            remount on switch replays the 0 → value draw, which turns the
            toggle itself into part of the animation. */}
        {mobile ? (
          <div className="flex min-h-0 w-full flex-1 flex-col" style={{ gap: "0.75rem" }}>
            <div className="flex w-full" style={{ gap: 0 }}>
              {TABS.map((t, i) => {
                const on = i === tab;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(i)}
                    aria-pressed={on}
                    className="font-cond uppercase tap-target flex-1"
                    style={{
                      background: "transparent",
                      border: 0,
                      padding: "10px 0",
                      color: "#121316",
                      opacity: on ? 1 : 0.4,
                      fontSize: 13,
                      letterSpacing: "0.12em",
                      borderBottom: `2px solid ${on ? "#121316" : "rgba(18,19,22,0.15)"}`,
                      transition: "opacity 0.3s ease, border-color 0.3s ease",
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Capped: the hexagon's radius is limited by the column width, so
                a taller box only adds dead space above and below it. */}
            <div className="relative min-h-0 w-full flex-1" style={{ maxHeight: "min(46dvh, 320px)" }}>
              <Suspense fallback={null}>
                <HexRadar key={TABS[tab].key} data={TABS[tab].data} start={started} delay={0.2} />
              </Suspense>
            </div>
          </div>
        ) : (
          <div
            className="grid min-h-0 w-full flex-1 grid-cols-1 md:grid-cols-2"
            style={{ gap: "clamp(1rem, 1.67vw, 2rem)" }}
          >
            <Suspense fallback={null}>
              <div className="relative min-h-0 min-w-0">
                <HexRadar data={SKILLS} start={started} delay={0.6} />
              </div>
              <div className="relative min-h-0 min-w-0">
                <HexRadar data={TOOLS} start={started} delay={0.8} />
              </div>
            </Suspense>
          </div>
        )}
      </div>
    </section>
  );
}
