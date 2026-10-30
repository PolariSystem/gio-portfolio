import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";

const GridContext = createContext({
  cols: 13,
  accentIndex: 11,
  mobile: false,
  setMinimum: (_width: number) => {},
});

/** One shared grid, sized from the largest navigation button plus breathing room. */
export function SiteGridProvider({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState(() => document.documentElement.clientWidth);
  const [minimum, setMinimum] = useState(112);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const desktopCols = Math.max(6, Math.min(13, Math.floor(width / minimum)));
  const cols = mobile ? 5 : desktopCols;

  useLayoutEffect(() => {
    const sync = () => {
      setWidth(document.documentElement.clientWidth);
      setMobile(window.matchMedia("(max-width: 767px)").matches);
    };
    const observer = new ResizeObserver(sync);
    observer.observe(document.documentElement);
    window.addEventListener("resize", sync);
    sync();
    return () => { observer.disconnect(); window.removeEventListener("resize", sync); };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const portraitStart = Math.ceil(desktopCols / 2) + 1;
    const values = {
      "--desktop-grid-cols": String(desktopCols),
      "--desktop-grid-unit": `${width / desktopCols}px`,
      "--desktop-grid-end": String(desktopCols + 1),
      "--desktop-accent-start": String(desktopCols - 1),
      "--desktop-inner-cols": String(desktopCols - 2),
      "--desktop-portrait-start": String(portraitStart),
      "--desktop-about-cols": String(portraitStart - 2),
      "--footer-logo-end": String(desktopCols - 4),
      "--footer-links-start": String(desktopCols - 3),
    };
    for (const [name, value] of Object.entries(values)) root.style.setProperty(name, value);
    return () => { for (const name of Object.keys(values)) root.style.removeProperty(name); };
  }, [desktopCols, width]);

  const value = useMemo(() => ({ cols, accentIndex: mobile ? 4 : cols - 2, mobile, setMinimum }), [cols, mobile]);
  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
}

export const useSiteGrid = () => useContext(GridContext);
