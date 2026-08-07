import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";

type Props = {
  text: string;
  /** Animation runs when this flips to true. */
  start?: boolean;
  delay?: number;
  stagger?: number;
  /** Wait until the paragraph enters the viewport before revealing. */
  startOnView?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Paragraph whose *wrapped* lines each reveal behind their own mask.
 * The text is measured once laid out, split at the real line breaks, and then
 * re-rendered as one masked row per visual line.
 */
export function MaskParagraph({ text, start = true, delay = 0, stagger = 0.08, startOnView = false, className, style }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [inView, setInView] = useState(!startOnView);

  useEffect(() => {
    if (!startOnView || !wrap.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(wrap.current);
    return () => io.disconnect();
  }, [startOnView]);

  const running = start && inView;

  // Measure the visual line breaks of the plain paragraph.
  useLayoutEffect(() => {
    const el = measure.current;
    if (!el) return;
    let disposed = false;
    let lastWidth = -1;

    const compute = () => {
      if (disposed) return;
      const node = el.firstChild;
      if (!node) { setLines([text]); return; }
      const range = document.createRange();
      const out: string[] = [];
      let current = "";
      let lastTop: number | null = null;

      for (let i = 0; i < text.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const top = range.getBoundingClientRect().top;
        if (lastTop !== null && Math.abs(top - lastTop) > 1) {
          out.push(current.trim());
          current = "";
        }
        lastTop = top;
        current += text[i];
      }
      if (current.trim()) out.push(current.trim());
      // Only swap when the split actually changed, so we never blank the block.
      setLines((prev) =>
        prev && prev.length === out.length && prev.every((l, i) => l === out[i]) ? prev : out.length ? out : [text]
      );
    };

    // First pass before paint, then again once webfonts settle (their metrics
    // change where the text wraps).
    lastWidth = el.getBoundingClientRect().width;
    compute();
    document.fonts?.ready.then(() => { if (!disposed) compute(); });

    // Re-measure only on real width changes — observing height would loop.
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (Math.abs(w - lastWidth) < 1) return;
      lastWidth = w;
      compute();
    });
    ro.observe(el);
    return () => { disposed = true; ro.disconnect(); };
  }, [text]);

  useEffect(() => {
    if (!lines || !running || !wrap.current) return;
    const items = wrap.current.querySelectorAll<HTMLElement>("[data-mask-inner]");
    gsap.fromTo(
      items,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.8, ease: "power3.out", stagger, delay }
    );
  }, [lines, running, delay, stagger]);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", ...style }}>
      {/*
        Hidden copy used to find the wrap points. It stays in normal flow so it
        always reserves the exact box the text needs: the layout is final from
        the first frame and never reflows while measuring. It is never painted,
        so there is no flash of unmasked text either.
      */}
      <p
        ref={measure}
        aria-hidden
        style={{
          margin: 0,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        {text}
      </p>

      {lines && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <span
                data-mask-inner
                className="inline-block will-change-transform"
                style={{ transform: running ? undefined : "translateY(110%)" }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
