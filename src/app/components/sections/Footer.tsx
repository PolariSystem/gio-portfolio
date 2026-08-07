import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { MaskText } from "../MaskText";
import { MaskParagraph } from "../MaskParagraph";
import { ActionButton } from "../ActionButton";
import svgPaths from "../../../imports/Footer-1/svg-7rkubv1yt7";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        if (linksRef.current) {
          gsap.to(linksRef.current, { opacity: 1, duration: 0 });
          gsap.fromTo(
            linksRef.current.children,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, delay: 0.4, ease: "power2.out" }
          );
        }
        if (logoRef.current) {
          gsap.fromTo(logoRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" });
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={ref} id="footer" data-snap className="relative h-screen w-full overflow-hidden bg-[#121316] text-[#fafafa]">
      <Grid dark animateIn accentColor="#121316" />

      <div
        className="relative z-10 flex h-full flex-col justify-between py-16"
        style={{ paddingLeft: "calc(100vw / 13)", paddingRight: "calc(100vw / 13 * 2)" }}
      >
        {/* Top: Let's talk + quote */}
        <div className="flex flex-col gap-5 max-w-[600px]">
          <div className="flex items-center gap-2">
            <span className="h-[8px] w-[8px] bg-white flex-shrink-0" style={{ animation: "blink 1.2s steps(1) infinite" }} />
            <span className="font-sans text-white" style={{ fontSize: 20 }}>Let's talk</span>
          </div>
          <MaskParagraph
            text="Every project is an opportunity to innovate and connect."
            startOnView
            className="font-display uppercase text-white"
            style={{ width: "100%", fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 700, lineHeight: 1.2 }}
          />
        </div>

        {/* Middle: large tagline right-aligned */}
        <div className="flex justify-end">
          <MaskText
            lines={["Let's make yours", "a reality!"]}
            className="font-display uppercase text-white text-right"
            style={{ fontSize: "clamp(48px, 8vw, 120px)", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.02em" }}
          />
        </div>

        {/* Bottom: Gio. logo + social links */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          {/* Gio. SVG Logo */}
          <div ref={logoRef} className="opacity-0" style={{ width: "min(500px, 45vw)" }}>
            <svg
              viewBox="0 0 885 353.346"
              fill="none"
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <g>
                <path d={svgPaths.p445f000} fill="#FAFAFA" />
                <path d={svgPaths.p25b80380} fill="#FAFAFA" />
                <path d={svgPaths.p37725b30} fill="#FAFAFA" />
                <path d={svgPaths.p3ce4a900} fill="#FAFAFA" />
              </g>
            </svg>
          </div>

          {/* Social links */}
          <nav ref={linksRef as any} className="flex gap-4" style={{ opacity: 0, willChange: "opacity" }}>
            {["LINKEDIN", "INSTAGRAM", "X"].map((l) => (
              <ActionButton key={l} tone="light" size="nav">
                {l}
              </ActionButton>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
