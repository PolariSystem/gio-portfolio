import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { MaskText } from "../MaskText";
import { MaskParagraph } from "../MaskParagraph";
import { ActionButton } from "../ActionButton";
import { useIsMobile, useIsShort } from "../useMediaQuery";
import { footer1SvgPaths as svgPaths } from "../../../assets/svgPaths";

const goTo = (id: string) => {
  const snaps = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
  const idx = snaps.indexOf(document.getElementById(id) as HTMLElement);
  if (idx >= 0) (window as any).__snapTo?.(idx);
};

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const mobile = useIsMobile();
  // A phone held sideways gives this section ~390px of height; at the desktop
  // sizes the mark and contact buttons fall off the bottom.
  const short = useIsShort();

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
        className="relative z-10 flex h-full flex-col justify-between"
        style={{
          paddingLeft: "var(--gutter)",
          paddingRight: mobile ? "var(--content-pad-right)" : "var(--gutter)",
          paddingTop: short ? 48 : mobile ? 96 : 64,
          paddingBottom: short ? 16 : mobile ? 28 : 64,
        }}
      >
        {/* Top: Let's talk + quote */}
        <div className="flex flex-col gap-5 max-w-[400px]">
          <div className="flex items-center gap-2">
            <span className="h-[8px] w-[8px] bg-white flex-shrink-0" style={{ animation: "blink 1.2s steps(1) infinite" }} />
            <span className="font-sans text-white" style={{ fontSize: 20 }}>Let's talk</span>
          </div>
          <MaskParagraph
            text="Every project is an opportunity to innovate and connect."
            startOnView
            className="font-display uppercase text-white"
            style={{ width: "100%", fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 500, lineHeight: 1.2 }}
          />
        </div>

        {/* Middle: large tagline right-aligned */}
        <div className="flex justify-end">
          <MaskText
            lines={["Let's make your", " dreams a reality!"]}
            className="font-display uppercase text-white text-right"
            style={{ fontSize: short ? "clamp(24px, 4vw, 36px)" : mobile ? "clamp(30px, 9vw, 44px)" : "clamp(48px, 8vw, 80px)", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.02em" }}
          />
        </div>

        {/* Bottom: Gio. logo + social links */}
        {/* Phone stacks the mark over full-width contact buttons; the desktop
            11-column split has no room for three labels at 390px. */}
        <div
          className="site-grid"
          style={
            mobile
              ? { display: "flex", flexDirection: "column", gap: 16, width: "100%" }
              : { display: "grid", gridTemplateColumns: "repeat(11, 1fr)" }
          }
        >
          {/* Gio. SVG Logo */}
          <button
            ref={logoRef}
            className="opacity-0 cursor-pointer bg-none border-none p-0"
            style={{
              gridColumn: mobile ? undefined : "1 / 9",
              alignSelf: mobile ? "start" : "end",
              minHeight: 0,
              color: "inherit",
            }}
            onClick={() => goTo("hero")}
            type="button"
            aria-label="Go to home"
          >
            <svg
              viewBox="0 0 885 353.346"
              fill="none"
              style={{ width: short ? "min(240px, 28vw)" : mobile ? "min(500px, 62vw)" : "min(500px, 45vw)", height: "auto", display: "block" }}
            >
              <g>
                <path d={svgPaths.p445f000} fill="#FAFAFA" />
                <path d={svgPaths.p25b80380} fill="#FAFAFA" />
                <path d={svgPaths.p37725b30} fill="#FAFAFA" />
                <path d={svgPaths.p3ce4a900} fill="#FAFAFA" />
              </g>
            </svg>
          </button>

          {/* Social links aligned to navbar button columns */}
          <div
            ref={linksRef as any}
            style={{
              gridColumn: mobile ? undefined : "9 / 12",
              opacity: 0,
              willChange: "opacity",
              display: "flex",
              flexDirection: mobile ? "column" : "row",
              alignItems: "stretch",
              alignSelf: mobile ? "stretch" : "end",
              gap: mobile ? "0.375rem" : "0.5rem",
              width: "100%",
            }}
          >
            <ActionButton
              type="button"
              tone="light"
              size="nav"
              style={{ flex: 1, minWidth: 0 }}
              onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=imgiovanycruz@gmail.com", "_blank")}
            >
              GMAIL
            </ActionButton>
            <ActionButton
              type="button"
              tone="light"
              size="nav"
              style={{ flex: 1, minWidth: 0 }}
              onClick={() => window.open("https://wa.me/5353232460", "_blank")}
            >
              WHATSAPP
            </ActionButton>
            <ActionButton
              type="button"
              tone="light"
              size="nav"
              style={{ flex: 1, minWidth: 0 }}
              onClick={() => window.open("https://t.me/PolariSystem", "_blank")}
            >
              TELEGRAM
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
