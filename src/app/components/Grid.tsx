import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { useGridSpec } from "./useMediaQuery";

type Props = {
  dark?: boolean;
  accentColor?: string;
  animateIn?: boolean;
  showAccent?: boolean;
  lineColor?: string;
  pulseColor?: string;
  /** @deprecated */ accentIndex?: number;
};

export function Grid({ dark = false, accentColor, animateIn = false, showAccent = true, lineColor: lineColorProp, pulseColor: pulseColorProp }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // The column count has to track the CSS grid template, or the surplus
  // children would wrap onto implicit rows.
  const { cols, accentIndex } = useGridSpec();
  const lineColor = lineColorProp ?? (dark ? "rgba(250,250,250,0.10)" : "rgba(18,19,22,0.10)");
  const pulseColor = pulseColorProp ?? (dark ? "rgba(250,250,250,0.65)" : "rgba(18,19,22,0.65)");
  const accent = accentColor ?? (dark ? "#fafafa" : "#121316");

  useEffect(() => {
    if (!animateIn || !ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = Array.from(ref.current.querySelectorAll<HTMLElement>("[data-line]"));
    const shuffled = [...lines].sort(() => Math.random() - 0.5);
    const draw = gsap.fromTo(
      shuffled,
      { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, duration: 0.7, ease: "power2.out", stagger: 0.04 }
    );

    return () => {
      draw.kill();
    };
    // `cols` re-runs the draw when the breakpoint flips, so the new set of
    // lines animates in rather than appearing fully drawn.
  }, [animateIn, cols]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 site-grid">
      {Array.from({ length: cols }).map((_, i) => {
        const isAccent = i === accentIndex;
        return (
          <div
            key={i}
            className="relative h-full overflow-hidden"
            style={{ background: isAccent && showAccent ? accent : "transparent" }}
          >
            <div
              data-line
              className="absolute left-0 top-0 h-full"
              style={{ width: 1, background: lineColor }}
            />
            {animateIn && (!isAccent || !showAccent) && (
              <div
                data-pulse
                className="grid-pulse absolute left-0"
                style={{ width: 1, height: "18%", background: `linear-gradient(to bottom, transparent, ${pulseColor}, transparent)`, "--pulse-duration": `${3.6 + (i % 5) * 0.45}s`, "--pulse-delay": `${-i * 0.68}s` } as CSSProperties}
              />
            )}
            {i === cols - 1 && (
              <div
                data-line
                className="absolute right-0 top-0 h-full"
                style={{ width: 1, background: lineColor }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
