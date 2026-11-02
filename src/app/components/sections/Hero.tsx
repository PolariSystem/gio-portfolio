import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ActionButton } from "../ActionButton";
import { MaskParagraph } from "../MaskParagraph";
import { DotTitle } from "../DotTitle";
import { useGridSpec, useMediaQuery } from "../useMediaQuery";
import { goToSection } from "../navigation";

// The trailing "." is not part of the typed text: it is rendered separately as
// the caret that leads the line-by-line build and stays blinking at the end.
const LINES = ["Hello", "I'm Giovany Cruz", "and I'm a Product Designer"];
// Each typed line is `white-space: nowrap` so the title cannot reflow midway
// through the animation — which means a phone needs its own break points
// rather than relying on wrapping. Same words, one more line.
const LINES_MOBILE = [
  "Hello",
  "I'm Giovany Cruz",
  "and I'm a Product",
  "Designer",
];

const SUBTITLE =
  "UX/UI and design systems for SaaS, web, and mobile products.";

type Props = {
  /** Held false while the preloader is up so the intro plays with the reveal. */
  start?: boolean;
};

export function Hero({ start = true }: Props) {
  const [subReveal, setSubReveal] = useState(false);
  const actions = useRef<HTMLDivElement>(null);
  const { mobile, cols } = useGridSpec();
  const actionCols = mobile ? 1 : Math.max(1, cols - 4);
  const compact = useMediaQuery("(max-width: 1100px)");

  useLayoutEffect(() => {
    const container = actions.current;
    if (!container) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const unit = container.clientWidth / actionCols;
      if (!unit) return;
      container.querySelectorAll<HTMLElement>("[data-hero-action]").forEach((slot) => {
        const button = slot.querySelector("button");
        const label = slot.querySelector("[data-action-label]");
        if (!button || !label) return;
        const css = getComputedStyle(button);
        const minimum = label.getBoundingClientRect().width + parseFloat(css.paddingLeft) + parseFloat(css.paddingRight) + parseFloat(css.borderLeftWidth) + parseFloat(css.borderRightWidth);
        slot.style.gridColumn = `span ${Math.min(actionCols, Math.max(1, Math.ceil((minimum - 0.5) / unit)))}`;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    void document.fonts.ready.then(measure);
    return () => { disposed = true; observer.disconnect(); };
  }, [actionCols]);

  useEffect(() => {
    if (!start || !subReveal || !actions.current) return;
    const context = gsap.context(() => {
      const items = actions.current!.querySelectorAll("[data-hero-action]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
      } else {
        gsap.fromTo(items, { autoAlpha: 0, y: 20 }, {
          autoAlpha: 1, y: 0, duration: 0.6, delay: 0.45, stagger: 0.12, ease: "power2.out",
        });
      }
    }, actions);
    return () => context.revert();
  }, [start, subReveal]);

  // Fires when the dot has finished writing the whole title.
  const onTitleDone = () => {
    setSubReveal(true);
  };

  return (
    <section
      id="hero"
      data-snap
      className="relative h-screen w-full overflow-hidden text-[#fafafa]"
    >

      <div
        className="site-content relative z-[5] flex h-full flex-col justify-end"
        style={{
          paddingTop: "clamp(6rem, 8vh, 8rem)",
          paddingBottom: "clamp(4rem, 12vh, 8rem)",
        }}
      >
        <div
          className="flex flex-col items-start"
          style={{ gap: mobile ? "1rem" : "clamp(1.5rem, 1.67vw, 2rem)" }}
        >
          {/* Title — single size, dot caret builds the copy linearly */}
          <DotTitle
            as="h1"
            lines={compact ? LINES_MOBILE : LINES}
            start={start}
            onDone={onTitleDone}
            className="font-display uppercase"
            style={{
              // min() keeps the longest line inside the column on narrow phones.
              fontSize: mobile
                ? "min(2rem, 8.4vw)"
                : "clamp(2rem, 4.17vw, 5rem)",
              lineHeight: 1.2,
              color: "#fafafa",
            }}
          />

          <div
            className="flex w-full flex-col items-start"
            style={{ gap: mobile ? "1rem" : "clamp(1.5rem, 1.67vw, 2rem)" }}
          >
            <MaskParagraph
              text={SUBTITLE}
              start={subReveal}
              style={{
                fontSize: "var(--text-lead)",
                lineHeight: "var(--leading-body)",
                maxWidth: "min(590px, 100%)",
                width: "100%",
              }}
            />

            <div
              ref={actions}
              className="hero-actions"
              style={{
                gridTemplateColumns: `repeat(${actionCols}, minmax(0, 1fr))`,
              }}
            >
              <span data-hero-action className="hero-action" style={{ opacity: 0, visibility: "hidden", transform: "translateY(20px)" }}>
                <ActionButton
                  tone="light"
                  size={mobile ? "nav" : "cta"}
                  variant="outline"
                  style={{
                    minHeight: mobile ? "var(--control-height)" : "calc(var(--control-height) + 8px)",
                    width: "100%",
                    padding: mobile ? "10px 20px" : "16px 20px",
                  }}
                  onClick={() => goToSection("projects")}
                >
                  View work
                </ActionButton>
              </span>
              <span data-hero-action className="hero-action" style={{ opacity: 0, visibility: "hidden", transform: "translateY(20px)" }}>
                <ActionButton
                  tone="light"
                  size={mobile ? "nav" : "cta"}
                  style={{ minHeight: mobile ? "var(--control-height)" : "calc(var(--control-height) + 8px)", width: "100%", padding: mobile ? "10px 20px" : "16px 20px" }}
                  onClick={() => goToSection("footer")}
                >
                  let's talk.
                </ActionButton>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phone-only swipe cue: the site moves a whole screen per gesture, which
          is worth saying once rather than leaving to chance. */}
      {mobile && subReveal && (
        <div
          className="pointer-events-none absolute z-[6] flex items-center"
          style={{
            left: "var(--gutter)",
            bottom: 24,
            gap: 8,
            color: "#fafafa",
            opacity: 0.65,
          }}
        >
          <span
            style={{
              display: "block",
              height: 6,
              width: 6,
              background: "#fafafa",
              animation: "blink 1.2s steps(1) infinite",
            }}
          />
          <span
            className="font-cond uppercase"
            style={{ fontSize: "var(--text-label)", letterSpacing: "0.18em" }}
          >
            Swipe up to see my work
          </span>
        </div>
      )}
    </section>
  );
}
