import { useEffect, useState } from "react";

/**
 * True once the webfonts have settled (or after a short cap, so a slow font
 * request never blocks the intro animations). Typing/measuring before the
 * fonts swap is what makes the titles reflow mid-animation.
 */
export function useFontsReady(capMs = 1500) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => { if (!done) { done = true; setReady(true); } };
    document.fonts?.ready.then(finish) ?? finish();
    const t = window.setTimeout(finish, capMs);
    return () => window.clearTimeout(t);
  }, [capMs]);

  return ready;
}
