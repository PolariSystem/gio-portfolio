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
      <button
        className={`flex items-center cursor-pointer bg-none border-none p-0 ${mobile ? "col-span-4" : "col-span-3"}`}
        style={{ paddingLeft: "var(--gutter)", color: "inherit" }}
        onClick={() => goTo("hero")}
        type="button"
        aria-label="Go to home"
      >
        <svg width="49" height="20" viewBox="0 0 49 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.69738 0C13.6059 7.07135e-06 17.327 2.37675 17.7554 6.72962H13.6194C13.1108 4.59324 11.5848 3.52501 9.57705 3.52501C5.80237 3.52501 4.20299 6.72963 4.20299 10.0677C4.203 13.5437 5.38487 16.4855 9.71683 16.4855V19.9752C9.71683 19.9752 9.50469 19.9752 9.39655 19.9752C3.507 19.9752 1.20988e-05 15.5689 0 10.0677C0 4.40631 3.80782 0 9.69738 0ZM17.749 19.9752H13.5975V13.0559H9.71683V9.21311H17.749V19.9752Z" fill="white"/>
          <path d="M25 1.95532V4.91222H21V1.95532H25ZM21 20V6.93404H25V20H21Z" fill="white"/>
          <path d="M31.7454 12.9436C31.7454 15.0968 32.5104 17.2241 35.0426 17.2241C37.6012 17.2241 38.3661 15.0968 38.3661 12.9436C38.3661 10.7903 37.6012 8.63708 35.0426 8.63708C32.5104 8.63708 31.7454 10.7903 31.7454 12.9436ZM27.9999 12.9436C27.9999 8.66303 30.7695 5.86122 35.0426 5.86122C39.3421 5.86122 42.1117 8.66303 42.1117 12.9436C42.1117 17.1982 39.3421 20 35.0426 20C30.7695 20 27.9999 17.1982 27.9999 12.9436Z" fill="white"/>
          <path d="M44.9999 20V15.9901H48.9999V20H44.9999Z" fill="white"/>
        </svg>
      </button>

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
