import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Grid } from "../Grid";
import { ActionButton } from "../ActionButton";
import { MaskParagraph } from "../MaskParagraph";
import { DotTitle } from "../DotTitle";
import { useIsMobile } from "../useMediaQuery";

// The trailing "." is not part of the typed text: it is rendered separately as
// the caret that leads the line-by-line build and stays blinking at the end.
const LINES = ["Hello", "I'm Giovany Cruz", "and i'm Product designer"];
// Each typed line is `white-space: nowrap` so the title cannot reflow midway
// through the animation — which means a phone needs its own break points
// rather than relying on wrapping. Same words, one more line.
const LINES_MOBILE = ["Hello", "I'm Giovany Cruz", "and i'm Product", "designer"];

const SUBTITLE =
  "Specializing in high-conversion Landing Pages, SaaS platforms, and Mobile Applications";

type Props = {
  /** Held false while the preloader is up so the intro plays with the reveal. */
  start?: boolean;
};

export function Hero({ start = true }: Props) {
  const subWrap = useRef<HTMLDivElement>(null);
  const [subReveal, setSubReveal] = useState(false);
  const mobile = useIsMobile();

  // Fires when the dot has finished writing the whole title.
  const onTitleDone = () => {
    setSubReveal(true);
    if (!subWrap.current) return;
    gsap.to(subWrap.current.querySelectorAll("[data-fade]"), {
      opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power2.out",
    });
  };

  return (
    <section data-snap className="relative h-screen w-full overflow-hidden bg-[#121316] text-[#fafafa]">
      <Grid dark animateIn={start} accentColor="#fafafa" />

      <div
        className="site-content relative z-[5] flex h-full flex-col justify-end"
        style={{ paddingTop: "clamp(6rem, 8vh, 8rem)", paddingBottom: "clamp(4rem, 12vh, 8rem)" }}
      >
        <div className="flex flex-col items-start" style={{ gap: "clamp(1.5rem, 1.67vw, 2rem)" }}>
          {/* Title — single size, dot caret builds the copy linearly */}
          <DotTitle
            as="h1"
            lines={mobile ? LINES_MOBILE : LINES}
            start={start}
            onDone={onTitleDone}
            className="font-display uppercase"
            style={{
              // min() keeps the longest line inside the column on narrow phones.
              fontSize: mobile ? "min(2rem, 8.4vw)" : "clamp(2rem, 4.17vw, 5rem)",
              lineHeight: 1.2,
              color: "#fafafa",
            }}
          />

          <div ref={subWrap} className="flex w-full flex-col items-start" style={{ gap: "clamp(1.5rem, 1.67vw, 2rem)" }}>
            <MaskParagraph
              text={SUBTITLE}
              start={subReveal}
              style={{
                fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
                lineHeight: 1.2,
                maxWidth: "min(590px, 100%)",
                width: "100%",
              }}
            />

            <span
              data-fade
              style={{ display: mobile ? "block" : "inline-block", opacity: 0, transform: "translateY(20px)", width: mobile ? "100%" : undefined }}
            >
              <ActionButton tone="light" size="cta" style={mobile ? { width: "100%" } : undefined}>let's talk.</ActionButton>
            </span>
          </div>
        </div>
      </div>

      {/* Phone-only swipe cue: the site moves a whole screen per gesture, which
          is worth saying once rather than leaving to chance. */}
      {mobile && subReveal && (
        <div
          className="pointer-events-none absolute z-[6] flex items-center"
          style={{ left: "var(--gutter)", bottom: 24, gap: 8, color: "#fafafa", opacity: 0.65 }}
        >
          <span
            style={{ display: "block", height: 6, width: 6, background: "#fafafa", animation: "blink 1.2s steps(1) infinite" }}
          />
          <span className="font-cond uppercase" style={{ fontSize: 11, letterSpacing: "0.18em" }}>
            Swipe up
          </span>
        </div>
      )}
    </section>
  );
}
