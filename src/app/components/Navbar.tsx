import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ActionButton } from "./ActionButton";
import { useIsMobile } from "./useMediaQuery";

const goTo = (id: string) => {
  const snaps = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
  const idx = snaps.indexOf(document.getElementById(id) as HTMLElement);
  if (idx >= 0) (window as any).__snapTo?.(idx);
};

type Props = {
  /** Held false while the preloader is up so the drop-in plays on reveal. */
  start?: boolean;
};

export function Navbar({ start = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // The three word-buttons are pinned to desktop grid columns 10–12, which do
  // not exist on the phone grid. There, SectionRail carries navigation and the
  // header keeps only the mark.
  const mobile = useIsMobile();
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
      <div
        className={`flex items-center ${mobile ? "col-span-4" : "col-span-3"}`}
        style={{ paddingLeft: "var(--gutter)" }}
      >
        <svg width="48" height="18" viewBox="0 0 51 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.6497 20V17.3797C13.1499 19.3048 11.2484 20 9.40047 20C3.50844 20 0 15.5882 0 10.0802C0 4.41176 3.50844 0 9.40047 0C13.3106 0 17.0333 2.37968 17.4618 6.73797H13.4445C12.9357 4.59893 11.4091 3.52941 9.40047 3.52941C5.62421 3.52941 4.20477 6.73797 4.20477 10.0802C4.20477 13.262 5.62421 16.4706 9.40047 16.4706C12.159 16.4706 13.7124 15.0267 13.9534 12.3529H9.72185V9.2246H17.7564V20H14.6497Z" fill="#FAFAFA"/>
          <path d="M24.8929 0.90909V4.03743H21.0898V0.90909H24.8929ZM21.0898 20V6.17647H24.8929V20H21.0898Z" fill="#FAFAFA"/>
          <path d="M32.0291 12.7273C32.0291 14.9465 32.8058 17.139 35.3769 17.139C37.9747 17.139 38.7514 14.9465 38.7514 12.7273C38.7514 10.508 37.9747 8.28877 35.3769 8.28877C32.8058 8.28877 32.0291 10.508 32.0291 12.7273ZM28.2261 12.7273C28.2261 8.31551 31.0382 5.42781 35.3769 5.42781C39.7423 5.42781 42.5544 8.31551 42.5544 12.7273C42.5544 17.1123 39.7423 20 35.3769 20C31.0382 20 28.2261 17.1123 28.2261 12.7273Z" fill="#FAFAFA"/>
          <path d="M45.8879 20V15.8824H50.0927V20H45.8879Z" fill="#FAFAFA"/>
        </svg>
      </div>

      {!mobile && (
        <>
          {/* C0ntact */}
          <div className="flex justify-center" style={{ gridColumn: "10 / 11" }}>
            <ActionButton tone="light" size="nav" onClick={() => goTo("footer")}>Contact.</ActionButton>
          </div>
          {/* About */}
          <div className="flex justify-center" style={{ gridColumn: "11 / 12" }}>
            <ActionButton tone="light" size="nav" onClick={() => goTo("about")}>About.</ActionButton>
          </div>
          {/* Work — sits exactly above accent column */}
          <div className="col-accent flex justify-center">
            <ActionButton tone="light" size="nav" onClick={() => goTo("projects")}>Work.</ActionButton>
          </div>
        </>
      )}
    </div>
  );
}
