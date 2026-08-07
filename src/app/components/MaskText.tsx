import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  startOnView?: boolean;
  style?: React.CSSProperties;
};

export function MaskText({ lines, className, lineClassName, delay = 0, startOnView = true, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>("[data-mask-inner]");
    const animate = () =>
      gsap.fromTo(
        items,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, delay }
      );
    if (startOnView) {
      ScrollTrigger.create({ trigger: ref.current, start: "top 85%", once: true, onEnter: animate });
    } else {
      animate();
    }
  }, [delay, startOnView]);

  return (
    <div ref={ref} className={className} style={style}>
      {lines.map((l, i) => (
        <div key={i} className={`overflow-hidden ${lineClassName ?? ""}`}>
          <span data-mask-inner className="inline-block will-change-transform">{l}</span>
        </div>
      ))}
    </div>
  );
}
