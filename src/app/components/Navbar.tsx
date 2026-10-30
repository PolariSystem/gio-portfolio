import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ActionButton } from "./ActionButton";
import { BrandMark } from "./BrandMark";
import { useGridSpec } from "./useMediaQuery";
import { goToSection } from "./navigation";

type Props = {
  /** Held false while the preloader is up so the drop-in plays on reveal. */
  start?: boolean;
};

export function Navbar({ start = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // The buttons occupy the three columns before the final gutter. SectionRail
  // carries navigation on phones, where the header keeps only the mark.
  const { mobile, cols, setMinimum } = useGridSpec();
  useLayoutEffect(() => {
    if (mobile || !ref.current) return;
    const buttons = Array.from(ref.current.querySelectorAll<HTMLElement>("[data-nav-button]"));
    let disposed = false;
    const measure = () => {
      if (disposed || !buttons.length) return;
      setMinimum(Math.ceil(Math.max(...buttons.map((button) => button.offsetWidth))) + 16);
    };
    const observer = new ResizeObserver(measure);
    buttons.forEach((button) => observer.observe(button));
    measure();
    void document.fonts.ready.then(measure);
    return () => { disposed = true; observer.disconnect(); };
  }, [mobile, setMinimum]);
  useEffect(() => {
    if (!start || !ref.current) return;
    const tw = gsap.fromTo(ref.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.6, ease: "power3.out" });
    return () => { tw.kill(); };
  }, [start]);

  return (
    <div
      ref={ref}
      className="fixed left-0 top-0 z-50 site-grid h-20 items-center"
      style={{ mixBlendMode: "difference" as any, color: "#fafafa", opacity: 0 }}
    >
      {/* Logo in first col area */}
      <button
        className="flex items-center cursor-pointer bg-none border-none p-0"
        style={{ gridColumn: `span ${mobile ? 4 : Math.min(3, cols - 4)}`, paddingLeft: "var(--gutter)", color: "inherit" }}
        onClick={() => goToSection("hero")}
        type="button"
        aria-label="Go to home"
      >
        <BrandMark />
      </button>

      {!mobile && (
        <>
          {/* Work leads the navigation, matching the page order. */}
          <div className="flex justify-center" style={{ gridColumn: `${cols - 3} / ${cols - 2}` }}>
            <ActionButton data-nav-button style={{ flexShrink: 0 }} tone="light" size="nav" onClick={() => goToSection("projects")}>Work.</ActionButton>
          </div>
          {/* About */}
          <div className="flex justify-center" style={{ gridColumn: `${cols - 2} / ${cols - 1}` }}>
            <ActionButton data-nav-button style={{ flexShrink: 0 }} tone="light" size="nav" onClick={() => goToSection("about")}>About.</ActionButton>
          </div>
          {/* Contact remains visible above the accent column. */}
          <div className="col-accent flex justify-center">
            <ActionButton data-nav-button style={{ flexShrink: 0 }} tone="light" size="nav" onClick={() => goToSection("footer")}>Contact.</ActionButton>
          </div>
        </>
      )}
    </div>
  );
}
