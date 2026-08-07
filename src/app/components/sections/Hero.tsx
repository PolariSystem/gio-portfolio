import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Grid } from "../Grid";
import { ActionButton } from "../ActionButton";
import { MaskParagraph } from "../MaskParagraph";
import { DotTitle } from "../DotTitle";

// The trailing "." is not part of the typed text: it is rendered separately as
// the caret that leads the line-by-line build and stays blinking at the end.
const LINES = ["Hello", "I'm Giovany Cruz", "and i'm Product designer"];

const SUBTITLE =
  "Specializing in high-conversion Landing Pages, SaaS platforms, and Mobile Applications";

export function Hero() {
  const subWrap = useRef<HTMLDivElement>(null);
  const [subReveal, setSubReveal] = useState(false);

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
      <Grid dark animateIn accentColor="#fafafa" />

      <div
        className="site-content relative z-[5] flex h-full flex-col justify-end"
        style={{ paddingTop: "clamp(6rem, 8vh, 8rem)", paddingBottom: "clamp(4rem, 12vh, 8rem)" }}
      >
        <div className="flex flex-col items-start" style={{ gap: "clamp(1.5rem, 1.67vw, 2rem)" }}>
          {/* Title — single size, dot caret builds the copy linearly */}
          <DotTitle
            as="h1"
            lines={LINES}
            onDone={onTitleDone}
            className="font-display uppercase"
            style={{ fontSize: "clamp(2rem, 4.17vw, 5rem)", lineHeight: 1.2, color: "#fafafa" }}
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

            <span data-fade style={{ display: "inline-block", opacity: 0, transform: "translateY(20px)" }}>
              <ActionButton tone="light" size="cta">let's talk.</ActionButton>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
