import { useEffect, useRef } from "react";
import { gsap } from "gsap";

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
  const lineColor = lineColorProp ?? (dark ? "rgba(250,250,250,0.10)" : "rgba(18,19,22,0.10)");
  const pulseColor = pulseColorProp ?? (dark ? "rgba(250,250,250,0.65)" : "rgba(18,19,22,0.65)");
  const accent = accentColor ?? (dark ? "#fafafa" : "#121316");

  useEffect(() => {
    if (!animateIn || !ref.current) return;
    const lines = Array.from(ref.current.querySelectorAll<HTMLElement>("[data-line]"));
    const shuffled = [...lines].sort(() => Math.random() - 0.5);
    gsap.fromTo(
      shuffled,
      { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, duration: 0.7, ease: "power2.out", stagger: 0.04 }
    );

    const pulses = Array.from(ref.current.querySelectorAll<HTMLElement>("[data-pulse]"));
    pulses.forEach((p) => {
      gsap.set(p, { top: "-15%" });
      gsap.to(p, {
        top: "115%",
        duration: 3 + Math.random() * 2.5,
        delay: Math.random() * 3,
        ease: "none",
        repeat: -1,
      });
    });
  }, [animateIn]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0 site-grid">
      {Array.from({ length: 13 }).map((_, i) => {
        const isAccent = i === 11;
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
            {animateIn && !isAccent && (
              <div
                data-pulse
                className="absolute left-0"
                style={{ width: 1, height: "18%", background: `linear-gradient(to bottom, transparent, ${pulseColor}, transparent)` }}
              />
            )}
            {i === 12 && (
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
