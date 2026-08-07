import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { DotTitle } from "../DotTitle";
import { MaskParagraph } from "../MaskParagraph";
import { HexRadar, type HexItem } from "../HexRadar";

gsap.registerPlugin(ScrollTrigger);

const SKILLS: HexItem[] = [
  { label: "Product Design", value: 95 },
  { label: "UX/UI Design", value: 95 },
  { label: "Brand & Identity", value: 60 },
  { label: "Design Systems", value: 85 },
  { label: "Project Management", value: 70 },
  { label: "Frontend Dev", value: 25 },
];

const TOOLS: HexItem[] = [
  { label: "Figma", value: 100 },
  { label: "Adobe Suite", value: 80 },
  { label: "Framer", value: 80 },
  { label: "Affinity Suite", value: 90 },
  { label: "DaVinci Resolve", value: 70 },
  { label: "VS Code", value: 25 },
];

export function Services() {
  const sec = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

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
          paddingLeft: "calc(100vw / 13)",
          // Two columns clear on the right so the charts never run under the
          // black accent column.
          paddingRight: "calc(100vw / 13 * 2)",
          paddingTop: "clamp(7rem, 19vh, 13rem)",
          paddingBottom: "clamp(3rem, 12vh, 8rem)",
          gap: "clamp(1.5rem, 1.67vw, 2rem)",
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

        {/* Hexagonal stats — skills on the left, tools on the right */}
        <div
          className="grid min-h-0 w-full flex-1 grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(1rem, 1.67vw, 2rem)" }}
        >
          <div className="relative min-h-0 min-w-0">
            <HexRadar data={SKILLS} start={started} delay={0.6} />
          </div>
          <div className="relative min-h-0 min-w-0">
            <HexRadar data={TOOLS} start={started} delay={0.8} />
          </div>
        </div>
      </div>
    </section>
  );
}
