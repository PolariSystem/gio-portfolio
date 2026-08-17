import { useEffect, useState } from "react";

/** Phone-and-below. Everything wider keeps the original desktop composition. */
export const MOBILE_QUERY = "(max-width: 767px)";
/** Touch devices, where a custom software cursor is meaningless. */
export const TOUCH_QUERY = "(pointer: coarse)";
/**
 * Not enough vertical room for the full-height compositions — a phone held
 * sideways, or a short desktop window. Normal laptops and monitors are far
 * above this, so nothing there is affected.
 */
export const SHORT_QUERY = "(max-height: 560px)";

/**
 * Reads the match synchronously on first render — resolving it in an effect
 * would render one desktop-layout frame on a phone before correcting itself.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
export const useIsTouch = () => useMediaQuery(TOUCH_QUERY);
export const useIsShort = () => useMediaQuery(SHORT_QUERY);

/**
 * The site grid, in one place. Desktop keeps its 13 columns with the accent
 * stripe at index 11; mobile collapses to four fluid columns plus a narrow
 * accent rail pinned to the right edge, which is what the phone layout hangs
 * its navigation and alignment off.
 */
export function useGridSpec() {
  const mobile = useIsMobile();
  return mobile
    ? { cols: 5, accentIndex: 4, mobile: true }
    : { cols: 13, accentIndex: 11, mobile: false };
}
